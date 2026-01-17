'use client';

import { useState } from 'react';
import { functions } from '@/lib/firebase'; // ✅ Imports your configured connection
import { httpsCallable } from 'firebase/functions';
import { Loader2, CreditCard, AlertCircle } from 'lucide-react';

export default function BookingWidget({ property, dates, guests }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- THE CONNECTION LOGIC ---
  const handlePayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Point to the specific function on your backend
      const initPayment = httpsCallable(functions, 'initializeBookingPayment');

      // 2. Send the data (Payload matches your Flutter app exactly)
      const result = await initPayment({
        propertyId: property.id,
        checkInDate: dates.checkIn,   // Format: "YYYY-MM-DD"
        checkOutDate: dates.checkOut, // Format: "YYYY-MM-DD"
        guests: guests,               // Number: e.g., 2
        bookingType: 'stay'           // or 'activity'
      });

      // 3. Receive the secure Paystack URL from your Cloud Function
      const { authorizationUrl, reference } = result.data;

      console.log("✅ Payment Initialized. Ref:", reference);

      // 4. Connect user to Paystack (Redirect)
      window.location.href = authorizationUrl;

    } catch (err) {
      console.error("❌ Connection Failed:", err);
      setError(err.message || "Could not connect to payment server.");
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xl sticky top-24">
      
      <div className="flex justify-between items-end mb-6">
        <div>
          <span className="text-2xl font-black">KES {parseInt(property.price).toLocaleString()}</span>
          <span className="text-gray-500 text-sm"> / night</span>
        </div>
        <div className="flex items-center gap-1 text-xs font-bold text-gray-500">
          <span className="text-nearlink">★</span> 4.96 (120 reviews)
        </div>
      </div>

      {/* Booking Summary Box */}
      <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
        <div className="flex border-b border-gray-200">
          <div className="flex-1 p-3 border-r border-gray-200">
            <label className="block text-[10px] font-bold uppercase text-gray-500">Check-in</label>
            <div className="text-sm font-medium">{dates.checkIn || 'Select Date'}</div>
          </div>
          <div className="flex-1 p-3">
            <label className="block text-[10px] font-bold uppercase text-gray-500">Check-out</label>
            <div className="text-sm font-medium">{dates.checkOut || 'Select Date'}</div>
          </div>
        </div>
        <div className="p-3">
          <label className="block text-[10px] font-bold uppercase text-gray-500">Guests</label>
          <div className="text-sm font-medium">{guests} Guests</div>
        </div>
      </div>

      {/* Error Message Display */}
      {error && (
        <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg mb-4 flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* THE TRIGGER BUTTON */}
      <button 
        onClick={handlePayment}
        disabled={isLoading || !dates.checkIn || !dates.checkOut}
        className="w-full bg-nearlink hover:bg-nearlink-dark text-black py-4 rounded-xl font-bold text-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            Connecting Securely...
          </>
        ) : (
          <>
            Confirm & Pay <CreditCard size={20} />
          </>
        )}
      </button>

      <p className="text-center text-xs text-gray-400 mt-4 font-medium">
        You won't be charged yet
      </p>
    </div>
  );
}