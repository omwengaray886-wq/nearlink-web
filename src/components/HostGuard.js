'use client'; // Required for Next.js App Router

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth'; // Replace with your actual auth hook path

export default function HostGuard({ children }) {
  const { user, loading: authLoading } = useAuth(); // Assuming your auth hook returns { user, loading }
  const [status, setStatus] = useState('checking');
  const router = useRouter();
  const db = getFirestore();

  useEffect(() => {
    if (authLoading) return;

    // 1. Not logged in -> Go to login
    if (!user) {
      router.push('/login');
      return;
    }

    // 2. Already a Host? -> Allow Access
    // (Check your user object structure, it might be user.customClaims.isHost or user.isHost)
    if (user.isHost === true) {
      setStatus('granted');
      return;
    }

    // 3. Not a host? Check their application status in Firestore
    const unsub = onSnapshot(doc(db, "host_requests", user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        if (data.status === 'verified') {
          // Admin approved! Reload page or update state to reflect new role
          setStatus('granted');
        } else if (data.status === 'pending') {
          // Application exists but is pending
          router.push('/host/status');
        } else if (data.status === 'rejected') {
          // Application rejected
          router.push('/host/rejected'); 
        }
      } else {
        // No application found -> Send to Registration
        router.push('/host/register');
      }
    });

    return () => unsub();
  }, [user, authLoading, router, db]);

  if (authLoading || status === 'checking') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}