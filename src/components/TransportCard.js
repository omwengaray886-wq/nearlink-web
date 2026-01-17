'use client';

import Link from 'next/link';
import { Star, User, Briefcase, ShieldCheck } from 'lucide-react';

export default function TransportCard({ data }) {
  return (
    // ✅ FIX: Points to /transport/ID
    <Link href={`/transport/${data.id}`} className="group cursor-pointer block h-full">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100 mb-3">
        <img
          src={data.image}
          alt={data.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
        
        {/* Type Badge */}
        <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
            {data.type}
        </div>

        {/* Verified Badge */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 text-[10px] font-bold text-green-700 shadow-sm">
            <ShieldCheck size={12} /> Verified Driver
        </div>
      </div>

      <div className="flex justify-between items-start">
        <div>
           <h3 className="font-bold text-gray-900 leading-tight">{data.title}</h3>
           <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
               <span className="flex items-center gap-1"><User size={12}/> 4</span>
               <span className="flex items-center gap-1"><Briefcase size={12}/> 2 Bags</span>
           </div>
        </div>
        <div className="text-right">
           <div className="flex items-center justify-end gap-1 text-xs font-bold mb-1">
               <Star size={12} className="fill-black"/> {data.rating}
           </div>
           <span className="font-bold text-sm">KSh {data.price}</span>
        </div>
      </div>
    </Link>
  );
}