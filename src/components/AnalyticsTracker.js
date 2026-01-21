'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, updateDoc, increment, addDoc, collection, serverTimestamp, setDoc, getDoc } from 'firebase/firestore';

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const logView = async () => {
      try {
        // 1. INCREMENT TOTAL VIEWS COUNTER
        // We use 'setDoc' with merge:true to ensure the document exists first
        const statsRef = doc(db, "dashboard_stats", "general");
        
        // Ensure doc exists (safe check)
        await setDoc(statsRef, { last_updated: serverTimestamp() }, { merge: true });
        
        // Increment the view count atomicaly
        await updateDoc(statsRef, {
          total_views: increment(1)
        });

        // 2. LOG THE SPECIFIC ACTIVITY
        // This populates the "Live Feed" on your dashboard
        await addDoc(collection(db, "activity_logs"), {
          type: 'page_view',
          page: pathname,
          timestamp: serverTimestamp(),
          device: window.innerWidth < 768 ? 'Mobile' : 'Desktop',
          country: 'KE' // In a real app, you'd fetch this from an IP API
        });

        console.log(`[Analytics] Logged view for: ${pathname}`);

      } catch (error) {
        console.error("Error logging analytics:", error);
      }
    };

    // Run this logic every time the Pathname changes
    if (pathname) {
      logView();
    }

  }, [pathname]);

  return null; // This component renders nothing visually
}