'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { 
  CheckCircle, MapPin, Calendar, Users, MessageSquare, 
  Phone, Copy, Shield, Home, Loader2, Share2, Printer
} from 'lucide-react';

import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export default function TripDetailsPage() {
  const { id } = useParams(); // This gets the ID from the URL (e.g., '123')
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // --- STATE ---
  const [booking, setBooking] = useState(null);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchTripDetails = async () => {
      if (!id || !user) return;

      setLoading(true);
      try {
        // 1. Fetch Booking Document using the ID from the URL
        const bookingRef = doc(db, 'bookings', id);
        const bookingSnap = await getDoc(bookingRef);

        if (!bookingSnap.exists()) {
          setError("Booking not found.");
          setLoading(false);
          return;
        }

        const bookingData = bookingSnap.data();

        // Security Check: Ensure the current user owns this booking
        if (bookingData.userId !== user.uid) {
          setError("You do not have permission to view this trip.");
          setLoading(false);
          return;
        }

        setBooking({ id: bookingSnap.id, ...bookingData });

        // 2. Fetch Associated Property/Activity Details
        // We use the 'propertyId' or 'activityId' stored in the booking
        const collectionName = bookingData.bookingType === 'activity' ? 'activities' : 'properties';
        const propertyRef = doc(db, collectionName, bookingData.propertyId);
        const propertySnap = await getDoc(propertyRef);

        if (propertySnap.exists()) {
          setProperty(propertySnap.data());
        }

      } catch (err) {
        console.error("Error fetching trip:", err);
        setError("Failed to load trip details.");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      if (user) {
        fetchTripDetails();
      } else {
        router.push('/login');
      }
    }
  }, [id, user, authLoading, router]);

  // --- RENDER HELPERS ---
  const formatDate = (timestamp) => {
    if (!timestamp) return "TBD";
    // Handle Firestore Timestamp or standard Date string
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (authLoading || loading) {
    return <div className="min-h-screen bg-white flex items-center justify-center"><Loader2 className="animate-spin text-nearlink w-10 h-10"/></div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center flex-col gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Oops!</h1>
        <p className="text-gray-500">{error}</p>
        <button onClick={() => router.push('/')} className="bg-black text-white px-6 py-3 rounded-xl font-bold">Go Home</button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F9FA] pb-20">
      <div className="bg-white border-b border-gray-100"><Navbar /></div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        
        {/* SUCCESS BANNER (Only show if status is confirmed) */}
        {booking.status === 'confirmed' && (
            <div className="bg-green-50 border border-green-100 p-6 rounded-2xl flex items-start gap-4 mb-8">
                <div className="bg-green-100 p-2 rounded-full text-green-600 mt-1"><CheckCircle size={24}/></div>
                <div>
                    <h2 className="text-lg font-bold text-green-900">You're all set!</h2>
                    <p className="text-green-800 text-sm">We sent a confirmation email to <strong>{user.email}</strong>.</p>
                </div>
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* LEFT: TRIP DETAILS */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* 1. Main Trip Info */}
                <section>
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 mb-2">Trip to {booking.location || "Nairobi"}</h1>
                            <div className="flex items-center gap-2 text-sm font-bold text-gray-500 bg-gray-100 w-fit px-3 py-1 rounded-full">
                                {booking.bookingType === 'activity' ? 'Experience' : 'Stay'} • {booking.status}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 border border-gray-200 rounded-full hover:bg-gray-50 transition text-gray-500"><Share2 size={18}/></button>
                            <button className="p-2 border border-gray-200 rounded-full hover:bg-gray-50 transition text-gray-500"><Printer size={18}/></button>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm flex flex-col md:flex-row">
                        <div className="w-full md:w-1/3 h-48 md:h-auto bg-gray-200 relative">
                            {property?.images?.[0] || property?.image || property?.imageUrl ? (
                                <img src={property.images?.[0] || property.image || property.imageUrl} className="w-full h-full object-cover"/>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400"><Home size={32}/></div>
                            )}
                        </div>
                        <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                            <h3 className="font-bold text-xl mb-1">{booking.propertyName}</h3>
                            <p className="text-gray-500 text-sm mb-4">{booking.location}</p>
                            
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Check-in</p>
                                    <p className="font-bold text-gray-900">{formatDate(booking.checkIn)}</p>
                                    <p className="text-xs text-gray-500">11:00 AM</p>
                                </div>
                                <div className="border-l border-gray-100 pl-6">
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Checkout</p>
                                    <p className="font-bold text-gray-900">{formatDate(booking.checkOut)}</p>
                                    <p className="text-xs text-gray-500">10:00 AM</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. Reservation Details */}
                <section className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
                    <h3 className="font-bold text-lg mb-6">Reservation Details</h3>
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-600"><Users size={20}/></div>
                            <div>
                                <p className="font-bold text-gray-900">Guests</p>
                                <p className="text-sm text-gray-500">{booking.guests} people</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-600"><Copy size={20}/></div>
                            <div>
                                <p className="font-bold text-gray-900">Confirmation Code</p>
                                <p className="text-sm text-gray-500 font-mono">{booking.id.substring(0, 8).toUpperCase()}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-600"><Shield size={20}/></div>
                            <div>
                                <p className="font-bold text-gray-900">Cancellation Policy</p>
                                <p className="text-sm text-gray-500">Free cancellation up to 48 hours before check-in.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. Directions */}
                <section className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
                    <h3 className="font-bold text-lg mb-6">Getting There</h3>
                    <div className="bg-gray-100 rounded-xl h-48 w-full flex items-center justify-center text-gray-400 mb-4">
                        <MapPin size={32}/>
                        <span className="ml-2 font-bold">Map Preview</span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{booking.address || "Address details provided in confirmation email."}</p>
                    <button className="mt-4 text-nearlink font-bold text-sm hover:underline">Get Directions</button>
                </section>

            </div>

            {/* RIGHT: PAYMENT & SUPPORT */}
            <div className="space-y-8">
                
                {/* Payment Breakdown */}
                <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
                    <h3 className="font-bold text-lg mb-6">Payment Info</h3>
                    <div className="space-y-3 pb-6 border-b border-gray-100">
                        <div className="flex justify-between text-gray-600 text-sm">
                            <span>Base Price</span>
                            <span>KES {booking.totalAmount ? (booking.totalAmount * 0.9).toLocaleString() : "0"}</span>
                        </div>
                        <div className="flex justify-between text-gray-600 text-sm">
                            <span>Service Fee</span>
                            <span>KES {booking.totalAmount ? (booking.totalAmount * 0.1).toLocaleString() : "0"}</span>
                        </div>
                    </div>
                    <div className="flex justify-between font-black text-xl pt-6">
                        <span>Total</span>
                        <span>KES {booking.totalAmount?.toLocaleString()}</span>
                    </div>
                </div>

                {/* Host Contact */}
                <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
                    <h3 className="font-bold text-lg mb-6">Your Host</h3>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden">
                            <img src={property?.host?.image || "https://github.com/shadcn.png"} className="w-full h-full object-cover"/>
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">{property?.host?.name || "NearLink Host"}</p>
                            <p className="text-xs text-gray-500">Joined {property?.host?.joined || "2024"}</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <button className="w-full border border-gray-200 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 flex items-center justify-center gap-2">
                            <MessageSquare size={16}/> Message Host
                        </button>
                        <button className="w-full border border-gray-200 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 flex items-center justify-center gap-2">
                            <Phone size={16}/> Call Host
                        </button>
                    </div>
                </div>

                {/* Support */}
                <div className="text-center">
                    <p className="text-xs text-gray-400 mb-2">Reference ID: {booking.id}</p>
                    <button className="text-gray-500 font-bold text-sm hover:text-black">Contact NearLink Support</button>
                </div>

            </div>

        </div>
      </div>
      <Footer />
    </main>
  );
}