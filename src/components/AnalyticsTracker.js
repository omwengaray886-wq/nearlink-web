'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, updateDoc, increment, addDoc, collection, serverTimestamp, setDoc } from 'firebase/firestore';

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // --- SETUP: GET SESSION ID ---
    // This ensures we track one user as one "Visitor" even if they refresh
    let sessionId = sessionStorage.getItem('visitor_session_id');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem('visitor_session_id', sessionId);
    }

    const isMobile = window.innerWidth < 768;

    // --- FUNCTION 1: HEARTBEAT (New! For Live Dashboard) ---
    // This runs every 15 seconds to tell the Admin "I am still online"
    const sendHeartbeat = async () => {
      try {
        const visitorRef = doc(db, "activeVisitors", sessionId);
        await setDoc(visitorRef, {
          page: pathname,
          device: isMobile ? 'mobile' : 'desktop',
          country: 'KE', // Placeholder (replace with real IP API later if needed)
          lastActive: serverTimestamp(),
          // Optional: Add expiry time for auto-cleanup rules if you use them
        }, { merge: true });
      } catch (error) {
        console.error("Error sending heartbeat:", error);
      }
    };

    // --- FUNCTION 2: HISTORICAL LOGS (Existing Logic) ---
    // This counts total views and adds to the activity feed history
    const logView = async () => {
      try {
        // A. Increment Total Views
        const statsRef = doc(db, "dashboard_stats", "general");
        await setDoc(statsRef, { last_updated: serverTimestamp() }, { merge: true });
        await updateDoc(statsRef, { total_views: increment(1) });

        // B. Add to Activity Log (History)
        await addDoc(collection(db, "activity_logs"), {
          type: 'page_view',
          page: pathname,
          timestamp: serverTimestamp(),
          device: isMobile ? 'Mobile' : 'Desktop',
          country: 'KE'
        });

        console.log(`[Analytics] Logged view for: ${pathname}`);
      } catch (error) {
        console.error("Error logging analytics:", error);
      }
    };

    // --- EXECUTION ---
    
    // 1. Run immediately on route change
    sendHeartbeat(); // Updates "Active Now" instantly
    logView();       // Updates "Total Views" instantly

    // 2. Keep the Heartbeat alive (runs every 15 seconds)
    // This keeps the user "Online" on your dashboard active card
    const interval = setInterval(sendHeartbeat, 15000);

    // Cleanup interval when the user leaves the page or component unmounts
    return () => clearInterval(interval);

  }, [pathname]); // Re-run this entire logic when the URL changes

  return null; // Invisible component
}