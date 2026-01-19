'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup,
  OAuthProvider,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase'; 

// 1. Context Creation
const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  googleLogin: async () => {},
  appleLogin: async () => {},
  logout: async () => {},
});

// 2. Custom Hook
export const useAuth = () => useContext(AuthContext);

// 3. Provider Component
export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- HELPER: Sync User to Firestore ---
  const saveUserToFirestore = async (firebaseUser, additionalData = {}) => {
    if (!firebaseUser) return;
    
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Create NEW User Document
        await setDoc(userRef, {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || additionalData.name || 'Traveler',
          image: firebaseUser.photoURL || "https://github.com/shadcn.png", // Default avatar
          role: additionalData.role || 'traveler',
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          bio: "Just joined NearLink!"
        });
      } else {
        // Update Existing User Login Time
        await updateDoc(userRef, {
          lastLogin: serverTimestamp()
        }, { merge: true });
      }
    } catch (error) {
      console.error("Error syncing user to Firestore:", error);
    }
  };

  // --- AUTH ACTIONS ---

  const signup = async (email, password, name, role) => {
    try {
      // 1. Create Auth User
      const result = await createUserWithEmailAndPassword(auth, email, password);
      // 2. Update Display Name immediately
      await updateProfile(result.user, { displayName: name });
      // 3. Create DB Record
      await saveUserToFirestore(result.user, { name, role });
      return result;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const googleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      await saveUserToFirestore(result.user);
      return result;
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    }
  };

  const appleLogin = async () => {
    try {
      const provider = new OAuthProvider('apple.com');
      provider.addScope('email');
      provider.addScope('name');
      const result = await signInWithPopup(auth, provider);
      await saveUserToFirestore(result.user);
      return result;
    } catch (error) {
      console.error("Apple login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // --- LISTENER (THE ENGINE) ---
  useEffect(() => {
    // Listen to Firebase Auth State
    const unsubscribe = onAuthStateChanged(
      auth, 
      async (currentUser) => {
        if (currentUser) {
          try {
            // Fetch full profile (Role, Bio, etc.)
            const userRef = doc(db, 'users', currentUser.uid);
            const userSnap = await getDoc(userRef);
            
            if (userSnap.exists()) {
              setUser({ ...currentUser, ...userSnap.data() });
            } else {
              // Fallback: Use Auth data & self-heal
              setUser(currentUser);
              saveUserToFirestore(currentUser); 
            }
          } catch (error) {
            console.error("Error fetching user profile:", error);
            // Even if DB fails, let the user in
            setUser(currentUser);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Firebase Network Error:", error);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const values = { 
    user, 
    loading,
    login, 
    signup, 
    googleLogin, 
    appleLogin, 
    logout 
  };

  return (
    <AuthContext.Provider value={values}>
      {/* ✅ FIXED: We now render 'children' immediately.
         The loading state is still available via the hook if individual components need it,
         but the app is no longer blocked by a black screen.
      */}
      {children}
    </AuthContext.Provider>
  );
};