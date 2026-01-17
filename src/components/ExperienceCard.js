'use client';

import Link from 'next/link';
import { Star, Heart, MapPin, Clock } from 'lucide-react';
import { useState } from 'react';

export default function ExperienceCard({ data }) {
  const [liked, setLiked] = useState(false);

  const toggleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(!liked);
  };

  return (
    // ✅ FIX: Pointing to the correct '/experiences' folder
    <Link href={`/experiences/${data.id}`} className="group cursor-pointer block h-full">
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-200 mb-3">
        <img
          src={data.image}
          alt={data.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
        
        {/* Gradient Overlay for Text Visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

        {/* Floating Heart */}
        <button
          onClick={toggleLike}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/30 transition z-10"
        >
          <Heart
            size={20}
            className={`transition ${liked ? 'fill-red-500 text-red-500' : 'text-white'}`}
          />
        </button>

        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-black shadow-sm">
            {data.category}
        </div>

        {/* Bottom Info Overlay (Inside Image) */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
             <h3 className="font-bold text-lg leading-tight mb-1 drop-shadow-md line-clamp-2">{data.title}</h3>
             <div className="flex items-center gap-3 text-xs font-medium opacity-90">
                 <span className="flex items-center gap-1"><MapPin size={12}/> {data.location}</span>
                 <span className="flex items-center gap-1"><Clock size={12}/> 3 hours</span>
             </div>
        </div>
      </div>

      {/* Pricing Row */}
      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-1">
           <Star size={14} className="fill-black text-black" />
           <span className="text-sm font-bold">{data.rating}</span>
           <span className="text-xs text-gray-500">({data.reviews})</span>
        </div>
        <div className="text-sm">
           <span className="font-bold">KSh {data.price}</span> / person
        </div>
      </div>
    </Link>
  );
}