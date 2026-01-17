'use client';

import Link from 'next/link';
import { Star, Heart, Clock, UtensilsCrossed } from 'lucide-react';
import { useState } from 'react';

export default function FoodCard({ data }) {
  const [liked, setLiked] = useState(false);

  const toggleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(!liked);
  };

  return (
    // ✅ FIX: Points to /food/ID
    <Link href={`/food/${data.id}`} className="group cursor-pointer block h-full">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-200 mb-3">
        <img
          src={data.image}
          alt={data.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60" />

        <button
          onClick={toggleLike}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/30 transition z-10"
        >
          <Heart
            size={20}
            className={`transition ${liked ? 'fill-red-500 text-red-500' : 'text-white'}`}
          />
        </button>

        {/* Status Badge */}
        <div className="absolute top-3 left-3 bg-green-500/90 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
            Open Now
        </div>

        <div className="absolute bottom-4 left-4 right-4 text-white">
             <h3 className="font-bold text-lg leading-tight mb-1 drop-shadow-md">{data.name}</h3>
             <div className="flex items-center gap-3 text-xs font-medium opacity-90">
                 <span className="flex items-center gap-1"><UtensilsCrossed size={12}/> {data.cuisine}</span>
                 <span className="flex items-center gap-1"><Clock size={12}/> Closes 11 PM</span>
             </div>
        </div>
      </div>

      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-1">
           <Star size={14} className="fill-black text-black" />
           <span className="text-sm font-bold">{data.rating}</span>
           <span className="text-xs text-gray-500">({data.reviews})</span>
        </div>
        <div className="text-sm font-bold text-gray-900">
           {data.priceRange} · {data.location}
        </div>
      </div>
    </Link>
  );
}