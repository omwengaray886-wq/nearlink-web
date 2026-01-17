"use client"; // <--- 1. Required for onClick events to work

import { useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, Calendar, Users } from 'lucide-react';

export default function Hero() {
  // 2. State to track which part of the search bar is active/highlighted
  const [activeField, setActiveField] = useState(null); // 'location', 'dates', or 'guests'

  return (
    <div className="relative w-full h-[85vh] bg-nearlink-dark overflow-hidden">
      
      {/* Background Image (Darkened) */}
      <div className="absolute inset-0 bg-black/40 z-10" onClick={() => setActiveField(null)}></div> 
      {/* ^ Clicking background closes the search active state */}
      
      <img 
        src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop" 
        className="absolute inset-0 w-full h-full object-cover"
        alt="Background"
      />

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-4">
        
        {/* Big Heading */}
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg leading-tight">
          Find your space. <br />
          <span className="text-nearlink-light">Anytime. Anywhere.</span>
        </h1>
        
        <p className="text-gray-200 text-lg mb-10 max-w-2xl hidden md:block">
          Experience South Africa's most flexible booking platform. 
          Hourly workspaces to luxury solar-powered villas.
        </p>

        {/* SEARCH BAR CONTAINER */}
        <div className="bg-white rounded-[32px] flex flex-col md:flex-row items-center shadow-2xl max-w-5xl w-full mx-auto relative">
            
            {/* 1. Location Input */}
            <div 
                className={`flex items-center gap-3 w-full py-4 px-6 md:py-3 md:rounded-l-[32px] transition cursor-pointer relative
                ${activeField === 'location' ? 'bg-gray-100 shadow-inner' : 'hover:bg-gray-50'}`}
                onClick={(e) => {
                    e.stopPropagation();
                    setActiveField('location');
                }}
            >
                <MapPin className={`shrink-0 transition ${activeField === 'location' ? 'text-black' : 'text-nearlink'}`} />
                <div className="text-left w-full">
                    <p className="text-xs font-bold text-gray-800 uppercase tracking-wider">Location</p>
                    <input 
                      type="text" 
                      placeholder="Where to?" 
                      className="w-full text-sm outline-none text-gray-600 placeholder-gray-400 bg-transparent truncate"
                      autoFocus={activeField === 'location'} // Auto focus when clicked
                    />
                </div>
            </div>

            {/* Divider (Hidden on mobile) */}
            <div className="hidden md:block w-[1px] h-10 bg-gray-200"></div>

            {/* 2. Dates Input */}
            <div 
                className={`flex items-center gap-3 w-full py-4 px-6 md:py-3 transition cursor-pointer relative
                ${activeField === 'dates' ? 'bg-gray-100 shadow-inner' : 'hover:bg-gray-50'}`}
                onClick={(e) => {
                    e.stopPropagation();
                    setActiveField('dates');
                    console.log("Open Date Picker Logic Here");
                }}
            >
                <Calendar className={`shrink-0 transition ${activeField === 'dates' ? 'text-black' : 'text-nearlink'}`} />
                <div className="text-left w-full">
                    <p className="text-xs font-bold text-gray-800 uppercase tracking-wider">Dates</p>
                    <input 
                      type="text" 
                      placeholder="Add dates" 
                      className="w-full text-sm outline-none text-gray-600 placeholder-gray-400 bg-transparent truncate pointer-events-none" 
                      readOnly // Prevent typing, force picking
                    />
                </div>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-[1px] h-10 bg-gray-200"></div>

            {/* 3. Guests Input */}
            <div 
                className={`flex items-center gap-3 w-full py-4 px-6 md:py-3 transition cursor-pointer relative
                ${activeField === 'guests' ? 'bg-gray-100 shadow-inner' : 'hover:bg-gray-50'}`}
                onClick={(e) => {
                    e.stopPropagation();
                    setActiveField('guests');
                }}
            >
                <Users className={`shrink-0 transition ${activeField === 'guests' ? 'text-black' : 'text-nearlink'}`} />
                <div className="text-left w-full">
                    <p className="text-xs font-bold text-gray-800 uppercase tracking-wider">Guests</p>
                    <input 
                      type="number" 
                      placeholder="Add guests" 
                      className="w-full text-sm outline-none text-gray-600 placeholder-gray-400 bg-transparent truncate"
                    />
                </div>
            </div>

            {/* Search Button Container */}
            <div className="p-2 w-full md:w-auto">
                <Link href="/search" className="w-full">
                    <button 
                        className="w-full md:w-auto bg-nearlink hover:bg-nearlink-dark transition text-white px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 shadow-lg whitespace-nowrap text-lg"
                        onClick={(e) => {
                             // This ensures the button click doesn't trigger the parent div's onClick if nested
                             e.stopPropagation(); 
                        }}
                    >
                        <Search size={20} strokeWidth={3} />
                        <span className="md:hidden">Search</span> {/* Text only on mobile */}
                    </button>
                </Link>
            </div>

        </div>

      </div>
    </div>
  );
}