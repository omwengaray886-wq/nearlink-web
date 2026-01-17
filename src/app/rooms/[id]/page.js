'use client';

import { useParams, useRouter, usePathname } from 'next/navigation'; // ✅ Added usePathname
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext'; // ✅ Import Auth Context
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import BookingWidget from '@/components/BookingWidget';

import { 
  Star, Share2, Heart, MapPin, Wifi, Car, Utensils, 
  Wind, Maximize, CheckCircle, ShieldCheck, ChevronLeft, 
  ChevronRight, Calendar, Users, Minus, Plus, Flag,
  ArrowRight, Coffee, Sparkles, Trophy, Bed, Bath, 
  Monitor, Info, Lock, Key, Loader2
} from 'lucide-react';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function RoomDetails() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname(); // ✅ Get current URL for return redirect
  const { user } = useAuth(); // ✅ Get current user status

  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Booking State
  const [guestCount, setGuestCount] = useState(1);
  const [activeTab, setActiveTab] = useState('overview');
  const [isScrolled, setIsScrolled] = useState(false);
  const [dates, setDates] = useState({ checkIn: "", checkOut: "" });

  // --- 1. FETCH REAL DATA ---
  useEffect(() => {
    const fetchListing = async () => {
      if (!params.id) return;
      setIsLoading(true);
      try {
        const docRef = doc(db, "properties", params.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setListing({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("Listing not found");
        }
      } catch (err) {
        console.error("Error fetching listing:", err);
        setError("Failed to load listing details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchListing();
    
    // Scroll Listener
    const handleScroll = () => setIsScrolled(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [params.id]);

  // --- 🔒 AUTH & BOOKING LOGIC ---
  const handleBookingAttempt = () => {
    if (!user) {
      // 1. User is NOT logged in: Redirect to Login with Return URL
      // We encode the current path so it passes safely in the URL
      const returnUrl = encodeURIComponent(pathname);
      router.push(`/login?returnUrl=${returnUrl}`);
    } else {
      // 2. User IS logged in: Scroll to Booking Widget or Trigger logic
      // For now, we scroll to the widget if they clicked the sticky header button
      const widget = document.getElementById('booking-widget');
      if (widget) {
        widget.scrollIntoView({ behavior: 'smooth' });
      } else {
        console.log("Proceeding to booking...");
      }
    }
  };

  // --- 2. LOADING STATE ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-black mx-auto mb-4"/>
          <p className="text-gray-500 font-medium">Loading details...</p>
        </div>
      </div>
    );
  }

  // --- 3. ERROR STATE ---
  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-500 mb-6">{error || "We couldn't find that property."}</p>
          <a href="/" className="bg-black text-white px-6 py-3 rounded-xl font-bold text-sm">Go Home</a>
        </div>
      </div>
    );
  }

  // Helper for Rating Bars
  const RatingRow = ({ label, score }) => (
      <div className="flex items-center justify-between mb-3 text-sm">
          <span className="text-gray-600 font-medium w-32">{label}</span>
          <div className="flex-1 h-1 bg-gray-200 rounded-full mx-4 overflow-hidden">
              <div className="h-full bg-black rounded-full" style={{ width: `${(score/5)*100}%` }}></div>
          </div>
          <span className="font-bold text-gray-900">{score ? score.toFixed(1) : "N/A"}</span>
      </div>
  );

  return (
    <main className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
      
      {/* 1. CINEMATIC HEADER GRID */}
      <div className="h-[60vh] md:h-[75vh] grid grid-cols-4 grid-rows-2 gap-1 p-1 bg-black">
          <div className="col-span-2 row-span-2 relative group overflow-hidden">
             {/* Fallback image if array is empty */}
             <img src={listing.images?.[0] || listing.image} className="w-full h-full object-cover transition duration-1000 group-hover:scale-105 opacity-90 group-hover:opacity-100" alt="Main View" />
             <div className="absolute top-6 left-6 z-20">
                 <Navbar transparent={true} />
             </div>
          </div>
          <div className="col-span-1 row-span-1 relative group overflow-hidden">
             <img src={listing.images?.[1] || listing.image} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" alt="Detail 1" />
          </div>
          <div className="col-span-1 row-span-1 relative group overflow-hidden">
             <img src={listing.images?.[2] || listing.image} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" alt="Detail 2" />
          </div>
          <div className="col-span-1 row-span-1 relative group overflow-hidden">
             <img src={listing.images?.[3] || listing.image} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" alt="Detail 3" />
          </div>
          <div className="col-span-1 row-span-1 relative group overflow-hidden cursor-pointer">
             <img src={listing.images?.[4] || listing.image} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" alt="Detail 4" />
             <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition flex items-center justify-center">
                 <button className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-lg font-bold text-sm">
                     Show all photos
                 </button>
             </div>
          </div>
      </div>

      {/* 2. STICKY SUB-NAV */}
      <div className={`sticky top-0 z-40 bg-white border-b border-gray-200 transition-all duration-300 ${isScrolled ? 'translate-y-0 shadow-md' : 'translate-y-0'}`}>
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
              <div className="flex gap-8 text-sm font-bold text-gray-600">
                  {['Overview', 'Rooms', 'Amenities', 'Location', 'Reviews'].map((tab) => (
                      <button 
                        key={tab}
                        onClick={() => setActiveTab(tab.toLowerCase())}
                        className={`h-16 border-b-2 transition-colors ${activeTab === tab.toLowerCase() ? 'border-black text-black' : 'border-transparent hover:text-black'}`}
                      >
                          {tab}
                      </button>
                  ))}
              </div>
              {isScrolled && (
                  <div className="flex items-center gap-4 animate-in fade-in slide-in-from-right-4">
                      <div className="text-right hidden md:block">
                          <p className="font-bold text-sm">KSh {parseInt(listing.price).toLocaleString()} <span className="font-normal text-gray-500">/ night</span></p>
                          <div className="flex items-center gap-1 justify-end text-xs text-yellow-500">
                              <Star size={10} fill="currentColor"/> {listing.rating || 'New'}
                          </div>
                      </div>
                      <button 
                        onClick={handleBookingAttempt}
                        className="bg-black text-white px-6 py-2 rounded-lg font-bold text-sm shadow-lg hover:bg-gray-800 transition"
                      >
                          Reserve
                      </button>
                  </div>
              )}
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* --- LEFT COLUMN: DETAILS --- */}
          <div className="lg:col-span-2 space-y-12">
              
              {/* HEADER INFO */}
              <div className="border-b border-gray-100 pb-8">
                  <h1 className="text-4xl font-black text-gray-900 mb-2">{listing.title}</h1>
                  <p className="text-xl text-gray-500 mb-6">{listing.location}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-700 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <span className="flex items-center gap-2"><Users size={18}/> {listing.guests || 2} Guests</span>
                      <span className="text-gray-300">|</span>
                      <span className="flex items-center gap-2"><Bed size={18}/> {listing.bedrooms || 1} Bedrooms</span>
                      <span className="text-gray-300">|</span>
                      <span className="flex items-center gap-2"><Bath size={18}/> {listing.baths || 1} Baths</span>
                  </div>
              </div>

              {/* HOST SNIPPET */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-8">
                  <div className="flex items-center gap-4">
                      <div className="relative">
                          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center font-bold text-2xl text-gray-500">
                             {listing.hostName ? listing.hostName.charAt(0) : 'H'}
                          </div>
                          <div className="absolute -bottom-1 -right-1 bg-black text-white p-1 rounded-full border-2 border-white"><ShieldCheck size={12}/></div>
                      </div>
                      <div>
                          <h3 className="font-bold text-lg text-gray-900">Hosted by {listing.hostName || "NearLink Host"}</h3>
                          <p className="text-gray-500 text-sm">Superhost · Joined 2024</p>
                      </div>
                  </div>
              </div>

              {/* DESCRIPTION */}
              <div className="border-b border-gray-100 pb-8">
                  <h3 className="font-bold text-xl mb-4">About this space</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">{listing.description}</p>
              </div>

              {/* AMENITIES */}
              <div className="border-b border-gray-100 pb-8">
                  <h3 className="font-bold text-xl mb-6">What this place offers</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
                      {listing.amenities && listing.amenities.map((item) => (
                          <div key={item} className="flex items-center gap-3 text-gray-700">
                              <CheckCircle size={18} className="text-black" />
                              {item}
                          </div>
                      ))}
                  </div>
              </div>

              {/* REVIEWS ANALYTICS */}
              <div>
                  <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                      <Star className="fill-black"/> {listing.rating || 'New'} · {listing.reviewCount || 0} reviews
                  </h3>
                  {/* Mock ratings for visual balance if not present */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-2 mb-8">
                      <RatingRow label="Cleanliness" score={5.0} />
                      <RatingRow label="Accuracy" score={4.9} />
                      <RatingRow label="Communication" score={4.8} />
                      <RatingRow label="Location" score={5.0} />
                      <RatingRow label="Check-in" score={5.0} />
                      <RatingRow label="Value" score={4.8} />
                  </div>
              </div>

          </div>

          {/* --- RIGHT COLUMN: REAL BOOKING WIDGET --- */}
          <div className="relative" id="booking-widget">
              {/* ✅ PASSED PROPS:
                  - property: The full listing data
                  - user: The current auth user
                  - onBookAttempt: Function to trigger if they aren't logged in
              */}
              <BookingWidget 
                property={listing}
                user={user} 
                onBookAttempt={handleBookingAttempt}
                dates={{ 
                    checkIn: "2026-06-01", 
                    checkOut: "2026-06-05" 
                }}
                guests={guestCount}
              />
              
              {/* Rare Find Badge */}
              <div className="mt-6 bg-white border border-gray-100 p-4 rounded-xl shadow-sm flex items-start gap-3">
                  <div className="bg-pink-100 p-2 rounded-lg text-pink-600"><Trophy size={20}/></div>
                  <div>
                      <h4 className="font-bold text-sm">Rare find</h4>
                      <p className="text-xs text-gray-500">This place is usually booked.</p>
                  </div>
              </div>
          </div>

      </div>
      
      <Footer />
    </main>
  );
}