'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useBooking } from '@/hooks/useBooking'; // Using our hook for cancellations
import { Loader2, ArrowLeft, MapPin, Calendar, User, MessageSquare, Ban } from 'lucide-react';

export default function TripDetailsPage() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const { cancelReservation, loading: actionLoading } = useBooking();
  const router = useRouter();
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) return router.push('/login');

    const fetchBooking = async () => {
      try {
        const docRef = doc(db, 'bookings', id);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          setBooking({
            id: snapshot.id,
            ...data,
            checkIn: data.checkIn?.toDate ? data.checkIn.toDate() : new Date(data.checkIn),
            checkOut: data.checkOut?.toDate ? data.checkOut.toDate() : new Date(data.checkOut),
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchBooking();
  }, [id, user, authLoading, router]);

  const handleCancel = async () => {
    const confirm = window.confirm("Are you sure you want to cancel this booking? Refunds are subject to the cancellation policy.");
    if (!confirm) return;

    const success = await cancelReservation(id, "User requested cancellation via web");
    if (success) {
      alert("Booking cancelled successfully.");
      router.refresh(); // Refresh to update status
    } else {
      alert("Failed to cancel booking.");
    }
  };

  if (loading || authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin"/></div>;
  if (!booking) return <div className="min-h-screen flex items-center justify-center">Booking not found</div>;

  return (
    <main className="min-h-screen bg-white pb-20">
      <div className="bg-black pb-2 shadow-sm sticky top-0 z-50 border-b border-white/10">
         <Navbar theme="dark" />
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link href="/trips" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black mb-8">
            <ArrowLeft size={16}/> Back to Trips
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
            <h1 className="text-3xl font-black">{booking.propertyName}</h1>
            <div className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                {booking.status}
            </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            
            {/* Left: Details */}
            <div className="md:col-span-2 space-y-8">
                <img 
                    src={booking.propertyImage || "https://images.unsplash.com/photo-1570129477492-45c003edd2be"} 
                    className="w-full h-64 object-cover rounded-2xl bg-gray-100"
                />

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Check-in</p>
                        <p className="font-bold text-lg">{booking.checkIn.toDateString()}</p>
                        <p className="text-sm">2:00 PM</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Check-out</p>
                        <p className="font-bold text-lg">{booking.checkOut.toDateString()}</p>
                        <p className="text-sm">11:00 AM</p>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8">
                    <h3 className="font-bold text-lg mb-4">Reservation Details</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 text-gray-600">
                            <User size={20}/>
                            <span>{booking.guests} Guests</span>
                        </div>
                        <div className="flex items-center gap-4 text-gray-600">
                            <MapPin size={20}/>
                            <span>{booking.location || "Location not provided"}</span>
                        </div>
                        <div className="flex items-center gap-4 text-gray-600">
                            <Calendar size={20}/>
                            <span>Confirmation Code: <span className="font-mono text-black font-bold text-sm ml-2">#{booking.id.substring(0, 8).toUpperCase()}</span></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <h3 className="font-bold mb-4">Total Cost</h3>
                    <p className="text-3xl font-black mb-1">KES {(booking.priceBreakdown?.totalAmount || booking.totalAmount).toLocaleString()}</p>
                    <p className="text-sm text-green-600 font-bold mb-6">Paid via {booking.paymentMethod || 'Paystack'}</p>
                    
                    <button className="w-full bg-black text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 mb-3">
                        <MessageSquare size={18}/> Message Host
                    </button>
                    
                    {booking.status !== 'cancelled' && (
                        <button 
                            onClick={handleCancel}
                            disabled={actionLoading}
                            className="w-full bg-white border border-red-200 text-red-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-50 transition"
                        >
                            {actionLoading ? <Loader2 className="animate-spin"/> : <Ban size={18}/>}
                            Cancel Booking
                        </button>
                    )}
                </div>
                
                <div className="bg-blue-50 p-6 rounded-2xl text-blue-900 text-sm">
                    <p className="font-bold mb-2">Need Help?</p>
                    <p>Contact NearLink support with your reference ID: <strong>{booking.id.substring(0, 8).toUpperCase()}</strong></p>
                </div>
            </div>

        </div>
      </div>
      <Footer />
    </main>
  );
}