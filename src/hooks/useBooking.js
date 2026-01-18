import { httpsCallable } from 'firebase/functions';
import { functions } from '@/lib/firebase';
import { useState } from 'react';

export function useBooking() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. CALL THE "initializeBookingPayment" FUNCTION
  const initiateBooking = async (bookingData) => {
    setLoading(true);
    setError(null);

    try {
      // ✅ 1. Get the current website URL dynamically (Localhost or Live)
      // This creates: "https://nearlink.website/booking/success" or "http://localhost:3000/booking/success"
      const returnUrl = `${window.location.origin}/booking/success`;

      // 'initializeBookingPayment' must match the name in your backend index.js
      const paymentFunction = httpsCallable(functions, 'initializeBookingPayment');
      
      const result = await paymentFunction({
        propertyId: bookingData.propertyId,
        checkInDate: bookingData.checkIn,
        checkOutDate: bookingData.checkOut,
        guests: bookingData.guests,
        bookingType: bookingData.bookingType || 'stay', // Use dynamic type or default to 'stay'
        returnUrl: returnUrl // ✅ Sending the correct redirect link to backend
      });

      return result.data; // Returns { authorizationUrl, accessCode, reference }

    } catch (err) {
      console.error("Booking Error:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 2. CALL THE "cancelBooking" FUNCTION
  const cancelReservation = async (bookingId, reason) => {
    setLoading(true);
    try {
      const cancelFunction = httpsCallable(functions, 'cancelBooking');
      await cancelFunction({ bookingId, reason });
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { initiateBooking, cancelReservation, loading, error };
}