'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, ChevronRight, ChevronLeft, Star, MapPin, BadgeCheck } from 'lucide-react';

export default function ListingCard({ data }) {
  if (!data) return null;
  const router = useRouter(); // Use router for navigation instead of Link

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Fallback images
  const images = data.images && data.images.length > 0 ? data.images : [
    data.image || "https://images.unsplash.com/photo-1600596542815-22b8c153bd30?q=80&w=2600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2600&auto=format&fit=crop"
  ];

  // Navigate to Details Page
  const handleCardClick = () => {
    router.push(`/rooms/${data.id}`);
  };

  const nextImage = (e) => {
    e.stopPropagation(); // Don't trigger card click
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const toggleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <div 
      className="group cursor-pointer relative w-full h-[340px] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick} // Make the whole card clickable here
    >
      
      {/* 1. BACKGROUND IMAGE */}
      <div className="block w-full h-full relative">
         <img 
            src={images[currentImageIndex]} 
            alt={data.title || "Listing Image"}
            className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
         />
         <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />
      </div>

      {/* 2. TOP BADGES */}
      {parseFloat(data.rating) > 4.8 && (
        <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
            <BadgeCheck size={14} className="text-[#00A699] fill-teal-50" />
            <span className="text-[11px] font-extrabold text-gray-900 uppercase tracking-wide">Guest Favorite</span>
        </div>
      )}

      {/* Rating & Heart */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-3">
         <div className="bg-gray-900/80 backdrop-blur-md px-2.5 py-1.5 rounded-full flex items-center gap-1 border border-white/10">
             <Star size={12} className="text-yellow-400 fill-yellow-400" />
             <span className="text-white text-xs font-bold">{data.rating || "New"}</span>
         </div>

         <button 
           onClick={toggleFavorite}
           className="bg-white p-2 rounded-full hover:scale-110 transition active:scale-95 shadow-md flex items-center justify-center group/heart"
         >
             <Heart 
               size={18} 
               className={`transition-colors duration-300 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-900 group-hover/heart:text-red-500'}`} 
             />
         </button>
      </div>

      {/* 3. NAVIGATION ARROWS */}
      {isHovered && (
        <>
           <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 p-2 rounded-full hover:bg-white shadow-md transition-all hover:scale-105 active:scale-95">
              <ChevronLeft size={18} className="text-gray-900" />
           </button>
           <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 p-2 rounded-full hover:bg-white shadow-md transition-all hover:scale-105 active:scale-95">
              <ChevronRight size={18} className="text-gray-900" />
           </button>
           
           <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
              {images.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`w-1.5 h-1.5 rounded-full transition-all shadow-sm ${idx === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'}`}
                />
              ))}
           </div>
        </>
      )}

      {/* 4. BOTTOM FLOATING INFO CARD */}
      <div className="absolute bottom-4 left-4 right-4 z-20">
         <div className="bg-white/95 backdrop-blur-xl p-4 rounded-2xl shadow-lg flex justify-between items-center gap-3 border border-white/40 hover:scale-[1.02] transition-transform duration-300">
             
             <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                 <h3 className="font-bold text-gray-900 text-[15px] truncate leading-tight">
                    {data.location || "Cozy Home"}
                 </h3>
                 <div className="flex items-center gap-1 text-gray-500 text-xs truncate font-medium">
                    <MapPin size={12} className="shrink-0" />
                    <span className="truncate">{data.title || "Experience nearby"}</span>
                 </div>
             </div>

             <div className="bg-[#E0F7F6] px-3 py-2 rounded-xl flex flex-col items-end shrink-0 border border-[#00A699]/30 shadow-sm">
                 <span className="text-[#008489] font-extrabold text-[15px]">
                    <span className="text-xs font-normal mr-0.5">KSh</span>{data.price}
                 </span>
                 <span className="text-gray-500 text-[10px] font-medium leading-none">
                    /night
                 </span>
             </div>

         </div>
      </div>

    </div>
  );
}