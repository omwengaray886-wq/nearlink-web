// src/app/wishlists/page.js
'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ListingCard from '../../components/ListingCard'; // Using your Pro Component
import Link from 'next/link';
import { Edit2, Heart, X, Share, MoreHorizontal } from 'lucide-react';

// Mock "Saved" Data matched to ListingCard format
const SAVED_ITEMS = [
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1600596542815-22b8c153bd30?q=80&w=2600&auto=format&fit=crop",
    location: "Luxury Villa in Westlands",
    distance: "5 km away",
    dates: "Feb 10 - 15",
    price: "8,500",
    rating: 4.95,
    note: "Perfect for the team offsite?"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2600&auto=format&fit=crop",
    location: "Seaside Apartment",
    distance: "Mombasa · Beachfront",
    dates: "Apr 2 - 7",
    price: "5,000",
    rating: 4.90,
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2565&auto=format&fit=crop",
    location: "Nanyuki, Mt Kenya",
    distance: "150 km away",
    dates: "Available now",
    price: "9,000",
    rating: 4.95,
    guestFavorite: true,
  }
];

export default function WishlistPage() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [items, setItems] = useState(SAVED_ITEMS);

  // Function to simulate removing an item
  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <main className="min-h-screen bg-white">
      
      {/* 1. Navbar Wrapper */}
      <div className="bg-nearlink-dark pb-2 border-b border-gray-100">
         <Navbar />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-12 pt-16">
        
        {/* 2. Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Summer 2026 List</h1>
                <p className="text-gray-500 font-medium">{items.length} stays saved</p>
            </div>
            
            <div className="flex gap-3">
                 <button className="flex items-center gap-2 font-bold text-sm px-4 py-2 hover:bg-gray-100 rounded-full border border-gray-200 transition">
                    <Share size={16} /> Share
                 </button>
                 <button 
                    onClick={() => setIsEditMode(!isEditMode)}
                    className={`flex items-center gap-2 font-bold text-sm px-4 py-2 rounded-full border transition ${isEditMode ? 'bg-black text-white border-black' : 'hover:bg-gray-100 border-gray-200'}`}
                 >
                    <Edit2 size={16} /> {isEditMode ? 'Done' : 'Edit'}
                 </button>
            </div>
        </div>

        {/* 3. Grid of Saved Homes */}
        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {items.map((item) => (
              <div key={item.id} className="relative group animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* Remove Button (Only visible in Edit Mode) */}
                {isEditMode && (
                    <button 
                        onClick={() => removeItem(item.id)}
                        className="absolute -top-3 -right-3 z-30 bg-white p-2 rounded-full shadow-lg hover:bg-red-50 hover:scale-110 transition border border-gray-200"
                    >
                        <X size={20} className="text-red-500" />
                    </button>
                )}

                {/* The Professional Listing Card */}
                {/* Use div to disable link clicking while editing if desired, or keep as is */}
                <div className={isEditMode ? "pointer-events-none opacity-90" : ""}>
                    <ListingCard data={item} />
                </div>

                {/* Wishlist Note (Complex Detail) */}
                {item.note && (
                    <div className="mt-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 flex gap-3 items-start">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-gray-600">Me</span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 italic">"{item.note}"</p>
                        </div>
                    </div>
                )}
              </div>
            ))}
          </div>
        ) : (
           /* 4. Empty State */
           <div className="flex flex-col items-center justify-center py-32 text-center bg-gray-50 rounded-[32px] border border-dashed border-gray-200">
               <div className="bg-white p-6 rounded-full mb-6 shadow-sm">
                   <Heart size={48} className="text-gray-300" />
               </div>
               <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
               <p className="text-gray-500 max-w-md mb-8">
                   As you search, click the heart icon to save your favorite places and experiences here.
               </p>
               <Link href="/search">
                   <button className="bg-nearlink hover:bg-nearlink-dark text-white font-bold py-3 px-8 rounded-xl shadow-lg transition transform hover:-translate-y-1">
                       Start exploring
                   </button>
               </Link>
           </div>
        )}

      </div>
      <Footer />
    </main>
  );
}