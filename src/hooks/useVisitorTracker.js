import { useEffect } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig'; // Make sure this path is correct for your main app

export const useVisitorTracker = () => {
  useEffect(() => {
    // 1. Identify the session
    let sessionId = sessionStorage.getItem('visitor_id');
    if (!sessionId) {
      sessionId = 'visitor-' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('visitor_id', sessionId);
    }

    // 2. Detect Mobile
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    // 3. Send Heartbeat to Firebase
    const sendHeartbeat = async () => {
      try {
        await setDoc(doc(db, "activeVisitors", sessionId), {
          page: window.location.pathname,
          device: isMobile ? 'mobile' : 'desktop',
          country: 'South Africa', // You can remove this hardcoding later
          lastActive: serverTimestamp()
        }, { merge: true });
      } catch (err) {
        console.error("Tracker Error:", err);
      }
    };

    // Run immediately
    sendHeartbeat();

    // Run every 10 seconds to keep them "Online"
    const interval = setInterval(sendHeartbeat, 10000);

    return () => clearInterval(interval);
  }, []);
};