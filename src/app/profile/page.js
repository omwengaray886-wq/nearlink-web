'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  // Protect the route
  useEffect(() => {
    if (!loading && !user) {
      router.push('/signup');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-black">My Profile</h1>
          <button 
            onClick={() => { logout(); router.push('/signup'); }}
            className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"
          >
            <LogOut size={20} />
          </button>
        </div>

        {/* Profile Image (From Google or Mobile App) */}
        <div className="flex flex-col items-center mb-6">
          <img 
            src={user.image || user.photoURL || "https://github.com/shadcn.png"} 
            alt="Profile" 
            className="w-24 h-24 rounded-full border-4 border-gray-100 object-cover mb-4"
          />
          <h2 className="text-xl font-bold">{user.name || user.displayName}</h2>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>

        {/* Data Synced from Firestore */}
        <div className="space-y-4 border-t pt-6">
            <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Role</label>
                <p className="font-medium capitalize">{user.role || 'User'}</p>
            </div>
            
            <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Bio</label>
                <p className="font-medium">{user.bio || 'No bio found (Update this on Mobile)'}</p>
            </div>

            <div>
                <label className="text-xs font-bold text-gray-400 uppercase">User ID</label>
                <p className="text-xs font-mono bg-gray-100 p-2 rounded">{user.uid}</p>
            </div>
        </div>

      </div>
    </div>
  );
}