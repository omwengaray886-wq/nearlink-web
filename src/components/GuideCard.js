'use client';

import Link from 'next/link';
import { Star, MessageCircle, MapPin, ShieldCheck } from 'lucide-react';

export default function GuideCard({ data }) {
  return (
    // ✅ FIX: Points to /guide/ID
    <Link href={`/guide/${data.id}`} className="group cursor-pointer block h-full">
      <div className="bg-white rounded-3xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
        
        {/* Header: Image & Badge */}
        <div className="flex items-start justify-between mb-6">
            <div className="relative">
                <img 
                  src={data.image} 
                  alt={data.name} 
                  className="w-20 h-20 rounded-full object-cover border-4 border-gray-50 shadow-md group-hover:scale-105 transition"
                />
                {data.verified && (
                    <div className="absolute -bottom-1 -right-1 bg-black text-white p-1 rounded-full border-2 border-white">
                        <ShieldCheck size={12}/>
                    </div>
                )}
            </div>
            <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg text-xs font-bold">
                <Star size={12} fill="currentColor"/> {data.rating}
            </div>
        </div>

        {/* Info */}
        <div className="mb-4 flex-1">
            <h3 className="font-bold text-xl text-gray-900 mb-1 group-hover:text-nearlink transition">{data.name}</h3>
            <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                <MapPin size={14}/> {data.location}
            </div>
            
            <div className="flex flex-wrap gap-2">
                {data.specialties.map((tag, i) => (
                    <span key={i} className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                        {tag}
                    </span>
                ))}
            </div>
        </div>

        {/* Footer: Languages & Action */}
        <div className="pt-4 border-t border-gray-100 mt-auto">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                <span className="font-bold text-gray-900">Speaks:</span> {data.languages.join(", ")}
            </div>
            <button className="w-full py-3 rounded-xl border-2 border-gray-100 font-bold text-gray-600 flex items-center justify-center gap-2 group-hover:border-black group-hover:text-black transition">
                <MessageCircle size={18}/> Ask a Local
            </button>
        </div>

      </div>
    </Link>
  );
}