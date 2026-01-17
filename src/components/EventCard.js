// src/components/EventCard.js
import { MapPin, Ticket, Calendar, Heart, Clock } from 'lucide-react';
import Link from 'next/link';

export default function EventCard({ data }) {
  // Safety check
  if (!data) return null;

  // Format price helper
  const formattedPrice = data.price === 0 
    ? "Free" 
    : `KSh ${data.price.toLocaleString()}`;

  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition duration-500 border border-gray-100 flex flex-col h-full relative">
      
      {/* CLICKABLE LINK WRAPPER */}
      <Link href={`/events/${data.id}`} className="block relative h-60 overflow-hidden cursor-pointer">
        <img 
          src={data.image} 
          alt={data.title}
          className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 transition duration-500 group-hover:opacity-60"></div>
        
        {/* Date Badge (Glassmorphism) */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 text-center min-w-[65px] shadow-lg border border-white/20">
            <span className="block text-[10px] font-black text-red-600 uppercase tracking-widest mb-0.5">
                {data.date?.month || 'DEC'}
            </span>
            <span className="block text-2xl font-black text-gray-900 leading-none">
                {data.date?.day || '01'}
            </span>
        </div>

        {/* Category Tag */}
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
            {data.category || 'Event'}
        </div>
      </Link>

      {/* LIKE BUTTON (Floating) */}
      <button className="absolute top-48 right-4 z-10 p-2.5 bg-white rounded-full text-gray-400 shadow-lg hover:text-red-500 hover:scale-110 transition duration-300">
          <Heart size={18} />
      </button>

      {/* CONTENT AREA */}
      <div className="p-6 flex-1 flex flex-col">
        <Link href={`/events/${data.id}`}>
            <h3 className="text-xl font-black text-gray-900 mb-3 group-hover:text-nearlink transition-colors line-clamp-2 leading-tight cursor-pointer">
                {data.title}
            </h3>
        </Link>
        
        <div className="flex flex-col gap-2.5 mb-6">
            <div className="flex items-center gap-2.5 text-gray-500 text-xs font-bold uppercase tracking-wide">
                <MapPin size={14} className="text-nearlink"/> 
                <span className="truncate">{data.location}</span>
            </div>
            <div className="flex items-center gap-2.5 text-gray-500 text-xs font-bold uppercase tracking-wide">
                <Clock size={14} className="text-nearlink"/> 
                <span>{data.time || 'TBA'}</span>
            </div>
        </div>

        {/* FOOTER: HOST & PRICE */}
        <div className="mt-auto flex items-center justify-between pt-5 border-t border-gray-100">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
                    {/* Fallback avatar if no host image */}
                    {data.hostImage ? (
                        <img src={data.hostImage} className="w-full h-full object-cover"/>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-bold">
                            {data.host?.charAt(0) || 'H'}
                        </div>
                    )}
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Hosted by</span>
                    <span className="text-xs font-bold text-gray-900 truncate max-w-[100px]">{data.host || 'Unknown'}</span>
                </div>
            </div>

            <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Starting from</span>
                <div className="flex items-center gap-1.5 text-nearlink">
                    <Ticket size={16} className="fill-current"/>
                    <span className="text-lg font-black text-gray-900">{formattedPrice}</span>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}