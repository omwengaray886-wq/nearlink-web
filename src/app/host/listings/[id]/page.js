'use client';

import { useState } from 'react';
import { 
  Star, Share2, Heart, MapPin, Wifi, Car, Utensils, 
  Wind, Tv, ShieldCheck, User, Calendar, Minus, Plus, ChevronDown
} from 'lucide-react';
import Navbar from '@/components/Navbar'; // ✅ Fixed Import
import Footer from '@/components/Footer'; // ✅ Fixed Import

export default function ListingPage({ params }) {
  const [liked, setLiked] = useState(false);
  const [guests, setGuests] = useState(1);

  // --- MOCK DATA (Replace with Firestore fetch later) ---
  const listing = {
    id: params.id || '123', // Fallback ID
    title: "The Glass House on the Cliff",
    location: "Champagne Ridge, Kajiado, Kenya",
    price: 22500, // Stored as number for math
    rating: 4.98,
    reviews: 124,
    host: "Brian Rao",
    hostTime: "5 years hosting",
    description: "Experience the ultimate rift valley view in this architectural masterpiece. Suspended on the edge of the cliff, the Glass House offers panoramic views, complete privacy, and an infinity pool that merges with the horizon. Perfect for couples or solo travelers looking for serenity.",
    amenities: ["Fast Wifi", "Infinity Pool", "Private Hot Tub", "Chef on Request", "Free Parking", "Air Conditioning", "Cinema Room"],
    images: [
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2000", // Main
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1000",
      "https://images.unsplash.com/photo-1600596542815-2a429b08e695?q=80&w=1000",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000",
    ]
  };

  // --- CALCULATIONS ---
  const NIGHTS = 5;
  const CLEANING_FEE = 2500;
  const SERVICE_FEE = 14000;
  const subtotal = listing.price * NIGHTS;
  const total = subtotal + CLEANING_FEE + SERVICE_FEE;

  // Formatting Helper
  const formatMoney = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <main className="bg-white min-h-screen font-sans text-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        
        {/* 1. HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-sm gap-4">
            <div className="flex items-center gap-2 font-medium">
              <Star size={16} fill="black" /> 
              <span>{listing.rating}</span>
              <span className="underline cursor-pointer">({listing.reviews} reviews)</span>
              <span>·</span>
              <span className="flex items-center gap-1 text-gray-600 underline font-bold cursor-pointer">
                 <MapPin size={14}/> {listing.location}
              </span>
            </div>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 underline hover:bg-gray-100 px-3 py-2 rounded-lg transition">
                <Share2 size={16}/> Share
              </button>
              <button onClick={() => setLiked(!liked)} className="flex items-center gap-2 underline hover:bg-gray-100 px-3 py-2 rounded-lg transition">
                <Heart size={16} fill={liked ? "#ff385c" : "transparent"} className={liked ? "text-[#ff385c]" : "text-black"}/> Save
              </button>
            </div>
          </div>
        </div>

        {/* 2. PHOTO GRID (Airbnb Style) */}
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 h-[400px] md:h-[500px] rounded-2xl overflow-hidden relative mb-12 cursor-pointer group">
            <div className="col-span-1 md:col-span-2 md:row-span-2 relative overflow-hidden">
                <img src={listing.images[0]} className="w-full h-full object-cover hover:scale-105 transition duration-500" alt="Main View" />
            </div>
            <div className="hidden md:block col-span-1 row-span-1 relative overflow-hidden">
                <img src={listing.images[1]} className="w-full h-full object-cover hover:scale-105 transition duration-500" alt="Interior" />
            </div>
            <div className="hidden md:block col-span-1 row-span-1 relative overflow-hidden">
                <img src={listing.images[2]} className="w-full h-full object-cover hover:scale-105 transition duration-500" alt="Bedroom" />
            </div>
            <div className="hidden md:block col-span-1 row-span-1 relative overflow-hidden">
                <img src={listing.images[3]} className="w-full h-full object-cover hover:scale-105 transition duration-500" alt="Bathroom" />
            </div>
            <div className="hidden md:block col-span-1 row-span-1 relative overflow-hidden">
                <img src={listing.images[4]} className="w-full h-full object-cover hover:scale-105 transition duration-500" alt="Exterior" />
                <button className="absolute bottom-4 right-4 bg-white px-4 py-2 text-xs font-bold rounded-lg border border-black shadow-md hover:scale-105 transition">Show all photos</button>
            </div>
        </div>

        {/* 3. CONTENT LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 relative">
            
            {/* LEFT COLUMN: Details */}
            <div className="lg:col-span-2">
                
                {/* Host Info */}
                <div className="flex justify-between items-center border-b border-gray-200 pb-6 mb-6">
                    <div>
                        <h2 className="text-2xl font-bold mb-1">Entire villa hosted by {listing.host}</h2>
                        <p className="text-gray-500">6 guests · 3 bedrooms · 3 beds · 3.5 baths</p>
                    </div>
                    <div className="w-14 h-14 bg-gray-200 rounded-full overflow-hidden border border-gray-300">
                        <img src="https://github.com/shadcn.png" className="w-full h-full object-cover" alt="Host" />
                    </div>
                </div>

                {/* Key Features */}
                <div className="border-b border-gray-200 pb-6 mb-6 space-y-6">
                    <div className="flex gap-4">
                        <ShieldCheck size={24} className="text-gray-600"/>
                        <div>
                            <h3 className="font-bold">Self check-in</h3>
                            <p className="text-gray-500 text-sm">Check yourself in with the keypad.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <Star size={24} className="text-gray-600"/>
                        <div>
                            <h3 className="font-bold">Experienced Host</h3>
                            <p className="text-gray-500 text-sm">{listing.host} has excellent reviews for other stays.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <Calendar size={24} className="text-gray-600"/>
                        <div>
                            <h3 className="font-bold">Free cancellation for 48 hours</h3>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="border-b border-gray-200 pb-6 mb-6">
                    <p className="text-gray-700 leading-relaxed text-lg">
                        {listing.description}
                    </p>
                    <button className="mt-4 underline font-bold flex items-center gap-1">Show more <ChevronDown size={16}/></button>
                </div>

                {/* Amenities */}
                <div className="pb-6 mb-6">
                    <h3 className="text-xl font-bold mb-6">What this place offers</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {listing.amenities.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 text-gray-700">
                                {idx === 0 ? <Wifi size={20}/> : idx === 1 ? <Utensils size={20}/> : <Car size={20}/>}
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                    <button className="mt-8 border border-black px-6 py-3 rounded-lg font-bold hover:bg-gray-50 transition">Show all 32 amenities</button>
                </div>
            </div>

            {/* RIGHT COLUMN: Sticky Reservation Card */}
            <div className="relative">
                <div className="sticky top-28 bg-white p-6 rounded-2xl shadow-[0_6px_16px_rgba(0,0,0,0.12)] border border-gray-200">
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <span className="text-2xl font-bold">KSh {formatMoney(listing.price)}</span> <span className="text-gray-500">night</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm font-bold underline">
                            <Star size={14} fill="black" /> {listing.rating} · {listing.reviews} reviews
                        </div>
                    </div>

                    <div className="border border-gray-400 rounded-xl overflow-hidden mb-4">
                        <div className="grid grid-cols-2 border-b border-gray-400">
                            <div className="p-3 border-r border-gray-400 hover:bg-gray-50 cursor-pointer">
                                <label className="text-[10px] font-bold uppercase block">Check-in</label>
                                <span className="text-sm">Add date</span>
                            </div>
                            <div className="p-3 hover:bg-gray-50 cursor-pointer">
                                <label className="text-[10px] font-bold uppercase block">Checkout</label>
                                <span className="text-sm">Add date</span>
                            </div>
                        </div>
                        <div className="p-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center">
                            <div>
                                <label className="text-[10px] font-bold uppercase block">Guests</label>
                                <span className="text-sm">{guests} guest{guests > 1 && 's'}</span>
                            </div>
                            <div className="flex gap-2 items-center">
                                <button onClick={()=>setGuests(Math.max(1, guests-1))} className="p-1 rounded-full hover:bg-gray-200"><Minus size={12}/></button>
                                <button onClick={()=>setGuests(guests+1)} className="p-1 rounded-full hover:bg-gray-200"><Plus size={12}/></button>
                            </div>
                        </div>
                    </div>

                    {/* Reserve Button - Using Standard Red/Pink if brand color not defined */}
                    <button className="w-full bg-[#ff385c] hover:bg-[#d90b3e] text-white font-bold py-3.5 rounded-xl text-lg mb-4 transition-transform active:scale-95">
                        Reserve
                    </button>

                    <p className="text-center text-sm text-gray-500 mb-6">You won't be charged yet</p>

                    <div className="space-y-3 text-gray-600">
                        <div className="flex justify-between">
                            <span className="underline">KSh {formatMoney(listing.price)} x {NIGHTS} nights</span>
                            <span>KSh {formatMoney(subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="underline">Cleaning fee</span>
                            <span>KSh {formatMoney(CLEANING_FEE)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="underline">Service fee</span>
                            <span>KSh {formatMoney(SERVICE_FEE)}</span>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between font-bold text-lg">
                        <span>Total before taxes</span>
                        <span>KSh {formatMoney(total)}</span>
                    </div>
                </div>
            </div>

        </div>
      </div>
      <Footer />
    </main>
  );
}