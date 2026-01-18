'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useBooking } from '@/hooks/useBooking'; // ✅ Import the hook
import { 
  ChevronLeft, CreditCard, Smartphone, 
  Star, Loader2, CheckCircle, Lock 
} from 'lucide-react';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { initiateBooking, loading: bookingLoading } = useBooking(); // ✅ Use the hook

  // --- GET URL PARAMS ---
  const propertyId = searchParams.get('id');
  const checkInDate = searchParams.get('checkIn');
  const checkOutDate = searchParams.get('checkOut');
  const guests = Number(searchParams.get('guests')) || 1;
  const type = searchParams.get('type') || 'property'; // 'property' or 'activity'

  // --- STATE ---
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('mpesa'); // 'mpesa' or 'card'
  const [phoneNumber, setPhoneNumber] = useState('');

  // --- 1. FETCH ITEM DETAILS ---
  useEffect(() => {
    const fetchItem = async () => {
      if (!propertyId) return;
      try {
        const collectionName = type === 'activity' ? 'activities' : 'properties';
        const docRef = doc(db, collectionName, propertyId);
        const snapshot = await getDoc(docRef);
        
        if (snapshot.exists()) {
          setItem({ id: snapshot.id, ...snapshot.data() });
        }
      } catch (error) {
        console.error("Error fetching checkout item:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      if (!user) router.push(`/login?redirect=/checkout?id=${propertyId}`);
      else fetchItem();
    }
  }, [propertyId, user, authLoading, type, router]);

  // --- CALCULATIONS ---
  const calculateTotal = () => {
    if (!item) return { total: 0, count: 0, serviceFee: 0, basePrice: 0 };
    
    const price = Number(item.price || item.pricePerNight);
    let duration = 1;

    if (type === 'property' && checkInDate && checkOutDate) {
        const start = new Date(checkInDate);
        const end = new Date(checkOutDate);
        const diff = end - start;
        duration = Math.ceil(diff / (1000 * 60 * 60 * 24));
        if (duration < 1) duration = 1;
    } else if (type === 'activity') {
        // For activities, price is usually per person
        duration = guests; 
    }

    const basePrice = price * duration;
    const serviceFee = Math.round(basePrice * 0.10); // 10% fee
    const total = basePrice + serviceFee;

    return { total, count: duration, serviceFee, basePrice };
  };

  const { total, count, serviceFee, basePrice } = calculateTotal();

  // --- HANDLER: CONFIRM BOOKING ---
  const handlePayment = async () => {
    if (bookingLoading) return;

    try {
      // 1. Call Cloud Function via Hook
      const paymentData = await initiateBooking({
        propertyId: item.id,
        checkIn: checkInDate, // Pass strings, backend handles parsing
        checkOut: checkOutDate,
        guests,
        bookingType: type === 'activity' ? 'activity' : 'stay'
      });

      // 2. Redirect to Paystack
      if (paymentData.authorizationUrl) {
        window.location.href = paymentData.authorizationUrl; 
      } else {
        alert("Payment initialization failed. No URL returned.");
      }

    } catch (error) {
      console.error("Booking failed:", error);
      alert("Payment failed: " + error.message);
    }
  };

  if (loading || authLoading) return <div className="min-h-screen bg-white flex items-center justify-center"><Loader2 className="animate-spin w-10 h-10 text-black"/></div>;

  if (!item) return <div className="min-h-screen flex items-center justify-center">Item not found</div>;

  return (
    <main className="min-h-screen bg-white pb-20 font-sans text-gray-900 selection:bg-[#005871] selection:text-white">
      <div className="bg-black pb-2 shadow-sm sticky top-0 z-50 border-b border-white/10">
         <Navbar theme="dark" />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Back Button */}
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black mb-8 transition">
            <ChevronLeft size={18}/> Back
        </button>

        <h1 className="text-3xl font-black text-gray-900 mb-12">Confirm and pay</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* LEFT: PAYMENT DETAILS */}
            <div className="space-y-10">
                
                {/* 1. Your Trip */}
                <section>
                    <h3 className="text-xl font-bold mb-4">Your Trip</h3>
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <p className="font-bold text-gray-900">Dates</p>
                            <p className="text-sm text-gray-500">
                                {checkInDate} – {checkOutDate}
                            </p>
                        </div>
                        <button className="text-sm font-bold underline text-gray-900">Edit</button>
                    </div>
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-bold text-gray-900">Guests</p>
                            <p className="text-sm text-gray-500">{guests} guest{guests > 1 ? 's' : ''}</p>
                        </div>
                        <button className="text-sm font-bold underline text-gray-900">Edit</button>
                    </div>
                </section>

                <div className="h-px bg-gray-200 w-full"></div>

                {/* 2. Payment Method */}
                <section>
                    <h3 className="text-xl font-bold mb-6">Pay with</h3>
                    
                    <div className="space-y-4">
                        {/* M-Pesa Option */}
                        <div 
                            onClick={() => setPaymentMethod('mpesa')}
                            className={`border rounded-2xl p-4 cursor-pointer transition flex items-center justify-between ${paymentMethod === 'mpesa' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-green-500 text-white rounded-lg flex items-center justify-center">
                                    <Smartphone size={24}/>
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">M-Pesa</p>
                                    <p className="text-xs text-gray-500">Fast & Secure</p>
                                </div>
                            </div>
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'mpesa' ? 'border-black' : 'border-gray-300'}`}>
                                {paymentMethod === 'mpesa' && <div className="w-3 h-3 bg-black rounded-full"></div>}
                            </div>
                        </div>

                        {paymentMethod === 'mpesa' && (
                            <div className="animate-in fade-in slide-in-from-top-2 ml-2 pl-4 border-l-2 border-gray-100">
                                <label className="text-xs font-bold text-gray-500 uppercase">M-Pesa Phone Number</label>
                                <input 
                                    type="tel" 
                                    placeholder="0712 345 678" 
                                    className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none focus:border-green-500 transition"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                            </div>
                        )}

                        {/* Card Option */}
                        <div 
                            onClick={() => setPaymentMethod('card')}
                            className={`border rounded-2xl p-4 cursor-pointer transition flex items-center justify-between ${paymentMethod === 'card' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center">
                                    <CreditCard size={24}/>
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">Credit or Debit Card</p>
                                    <p className="text-xs text-gray-500">Visa, Mastercard</p>
                                </div>
                            </div>
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'card' ? 'border-black' : 'border-gray-300'}`}>
                                {paymentMethod === 'card' && <div className="w-3 h-3 bg-black rounded-full"></div>}
                            </div>
                        </div>
                    </div>
                </section>

                <div className="h-px bg-gray-200 w-full"></div>

                {/* 3. Confirm Button */}
                <section>
                    <p className="text-xs text-gray-500 mb-6">
                        By selecting the button below, I agree to the <span className="underline font-bold">Host's House Rules</span>, <span className="underline font-bold">NearLink's Rebooking and Refund Policy</span>, and that NearLink can charge my payment method if I'm responsible for damage.
                    </p>
                    <button 
                        onClick={handlePayment}
                        disabled={bookingLoading || (paymentMethod === 'mpesa' && phoneNumber.length < 10)}
                        className="w-full bg-[#005871] text-white h-14 rounded-xl font-black text-lg hover:bg-[#00485d] transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {bookingLoading ? <Loader2 className="animate-spin"/> : <CheckCircle size={20}/>}
                        {bookingLoading ? "Processing..." : `Confirm and Pay KSh ${total.toLocaleString()}`}
                    </button>
                </section>

            </div>

            {/* RIGHT: PRICE SUMMARY CARD */}
            <div className="relative">
                <div className="sticky top-32 bg-white rounded-3xl border border-gray-200 p-6 shadow-xl">
                    
                    {/* Item Preview */}
                    <div className="flex gap-4 mb-6">
                        <img 
                            src={item.images?.[0] || item.imageUrl || item.image || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"} 
                            className="w-24 h-24 rounded-xl object-cover"
                            alt="Property"
                        />
                        <div>
                            <p className="text-xs text-gray-500">{type === 'activity' ? 'Experience' : 'Entire home'}</p>
                            <h4 className="font-bold text-gray-900 line-clamp-2 text-sm">{item.title || item.category}</h4>
                            <div className="flex items-center gap-1 mt-1 text-xs font-bold">
                                <Star size={12} className="fill-black"/> {item.rating?.overall || 5.0} <span className="text-gray-400 font-normal">({item.reviews || 0} reviews)</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-gray-100 w-full mb-6"></div>

                    {/* Price Breakdown */}
                    <h3 className="font-bold text-lg mb-4">Price details</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between text-gray-600">
                            <span>KSh {Number(item.price || item.pricePerNight).toLocaleString()} x {count} {type === 'activity' ? 'people' : 'nights'}</span>
                            <span>KSh {basePrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span className="underline decoration-dotted cursor-help">Service fee</span>
                            <span>KSh {serviceFee.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="h-px bg-gray-100 w-full my-6"></div>

                    <div className="flex justify-between items-center">
                        <span className="font-black text-gray-900">Total (KES)</span>
                        <span className="font-black text-xl">KSh {total.toLocaleString()}</span>
                    </div>

                    <div className="mt-6 bg-gray-50 p-3 rounded-lg flex items-center gap-3 border border-gray-100">
                        <Lock size={16} className="text-green-600"/>
                        <p className="text-xs text-gray-500">Payments are secure and encrypted.</p>
                    </div>

                </div>
            </div>

        </div>
      </div>
      <Footer />
    </main>
  );
}

// ✅ WRAPPER FOR SUSPENSE
export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><Loader2 className="animate-spin text-black"/></div>}>
      <CheckoutContent />
    </Suspense>
  );
}