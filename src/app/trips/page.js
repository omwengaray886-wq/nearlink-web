'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { 
  Calendar, MapPin, ChevronRight, Ban, Receipt, Home, 
  XCircle, MessageCircle, Loader2, Plane
} from 'lucide-react';
import Link from 'next/link';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function TripsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // --- STATE ---
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- FETCH BOOKINGS ---
  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      setLoading(true);
      try {
        // Query: Get all bookings for this user, sorted by creation date
        const q = query(
          collection(db, 'bookings'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBookings(list);
      } catch (error) {
        console.error("Error fetching trips:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      if (user) {
        fetchBookings();
      } else {
        router.push('/login');
      }
    }
  }, [user, authLoading, router]);

  // --- FILTER LOGIC ---
  const getFilteredTrips = () => {
    const now = new Date();
    return bookings.filter(trip => {
      // Convert Firestore Timestamp to JS Date
      const checkInDate = trip.checkIn?.seconds ? new Date(trip.checkIn.seconds * 1000) : new Date(trip.checkIn);
      const isCancelled = trip.status === 'cancelled';

      if (activeTab === 'cancelled') return isCancelled;
      if (activeTab === 'past') return !isCancelled && checkInDate < now;
      // Default 'upcoming'
      return !isCancelled && checkInDate >= now;
    });
  };

  const filteredTrips = getFilteredTrips();

  if (authLoading || loading) {
    return <div className="min-h-screen bg-white flex items-center justify-center"><Loader2 className="animate-spin w-10 h-10 text-nearlink"/></div>;
  }

  return (
    <main className="min-h-screen bg-[#F8F9FA] pb-20">
      <div className="bg-white border-b border-gray-100"><Navbar /></div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        
        <h1 className="text-3xl font-black text-gray-900 mb-8">Trips</h1>

        {/* TABS */}
        <div className="flex border-b border-gray-200 mb-8 overflow-x-auto no-scrollbar">
            {['upcoming', 'past', 'cancelled'].map((tab) => (
                <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 font-bold text-sm capitalize whitespace-nowrap transition-all border-b-2 ${activeTab === tab ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                >
                    {tab}
                </button>
            ))}
        </div>

        {/* CONTENT */}
        <div className="space-y-6">
            {filteredTrips.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        {activeTab === 'cancelled' ? <Ban className="text-gray-400"/> : <Plane className="text-gray-400"/>}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">No {activeTab} trips</h3>
                    <p className="text-gray-500 mb-6">
                        {activeTab === 'upcoming' 
                            ? "Time to dust off your bags and start planning your next adventure." 
                            : `You don't have any ${activeTab} trips.`}
                    </p>
                    {activeTab === 'upcoming' && (
                        <button onClick={() => router.push('/')} className="bg-black text-white px-6 py-3 rounded-full font-bold text-sm">
                            Start Exploring
                        </button>
                    )}
                </div>
            ) : (
                filteredTrips.map((trip) => (
                    <div key={trip.id} className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col md:flex-row gap-6 hover:shadow-md transition group">
                        
                        {/* Image Thumbnail */}
                        <div className="w-full md:w-48 h-32 bg-gray-100 rounded-xl overflow-hidden relative shrink-0">
                            {/* We don't save the image in booking usually, so use a placeholder or the one if saved */}
                            {trip.propertyImage ? (
                                <img src={trip.propertyImage} className="w-full h-full object-cover"/>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400"><Home size={24}/></div>
                            )}
                        </div>

                        {/* Trip Info */}
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{trip.propertyName || "Trip"}</h3>
                                <span className="font-mono text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                                    {trip.id.substring(0, 6).toUpperCase()}
                                </span>
                            </div>
                            
                            <p className="text-gray-500 text-sm mb-4">{trip.location || "Nairobi"}</p>
                            
                            <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-700 bg-gray-50 p-3 rounded-xl w-fit">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-gray-400"/>
                                    <span>
                                        {trip.checkIn?.seconds 
                                            ? new Date(trip.checkIn.seconds * 1000).toLocaleDateString() 
                                            : trip.checkIn} 
                                        {' - '}
                                        {trip.checkOut?.seconds 
                                            ? new Date(trip.checkOut.seconds * 1000).toLocaleDateString() 
                                            : trip.checkOut}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-row md:flex-col justify-between items-end gap-2 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 shrink-0">
                            <div className="text-right hidden md:block">
                                <p className="text-xs text-gray-400 uppercase font-bold">Total</p>
                                <p className="font-black text-lg">KES {trip.totalAmount?.toLocaleString()}</p>
                            </div>
                            
                            <Link href={`/trips/${trip.id}`} className="w-full md:w-auto">
                                <button className="w-full bg-black text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-800 transition">
                                    View Details <ChevronRight size={16}/>
                                </button>
                            </Link>
                        </div>

                    </div>
                ))
            )}
        </div>

      </div>
      <Footer />
    </main>
  );
}