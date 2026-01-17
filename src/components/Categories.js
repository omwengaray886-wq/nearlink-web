// src/components/Categories.js
'use client';

import { 
  BedDouble,      // Stays
  Compass,        // Experiences
  Ticket,         // Things To Do
  MapPin,         // Destinations
  CalendarHeart,  // Events
  Utensils,       // Food & Nightlife
  Car,            // Transport
  BookOpen,       // Travel Guide
  Briefcase,      // Host / Partner
  UserPlus        // Become a Local Guide
} from 'lucide-react';

// Main Super-App Categories
export const MAIN_CATEGORIES = [
  { label: 'Stays', icon: BedDouble },
  { label: 'Experiences', icon: Compass },
  { label: 'Things To Do', icon: Ticket },
  { label: 'Destinations', icon: MapPin },
  { label: 'Events', icon: CalendarHeart },
  { label: 'Food & Nightlife', icon: Utensils },
  { label: 'Transport', icon: Car },
  { label: 'Travel Guide', icon: BookOpen },
  { label: 'Host / Partner', icon: Briefcase },
  { label: 'Become a Local Guide', icon: UserPlus },
];

export default function Categories({ activeCategory, onCategoryChange }) {
  return (
    // Sticky positioning ensures this bar stays visible while scrolling
    <div className="pt-4 pb-2 bg-white sticky top-20 z-40 shadow-sm border-b border-gray-100">
      <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
        
        {/* Horizontal Scroll Container */}
        <div className="flex flex-row items-center justify-between overflow-x-auto gap-8 pt-2 pb-1 no-scrollbar">
          {MAIN_CATEGORIES.map((item) => (
            <div 
              key={item.label}
              onClick={() => onCategoryChange(item.label)}
              className={`
                flex flex-col items-center justify-center gap-2 p-2 border-b-2 transition cursor-pointer min-w-[fit-content] group
                ${activeCategory === item.label 
                  ? 'border-black text-black opacity-100' 
                  : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-200 opacity-70'}
              `}
            >
              <item.icon 
                size={26} 
                strokeWidth={1.5} 
                className="group-hover:scale-110 transition-transform duration-200"
              />
              <div className="font-medium text-xs whitespace-nowrap">{item.label}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}