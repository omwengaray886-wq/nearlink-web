// src/components/DestinationCard.js
import { MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DestinationCard({ data }) {
  return (
    <Link href={`/destinations/${data.id}`} className="group cursor-pointer block relative h-[400px] rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500">
      
      {/* Background Image */}
      <img 
        src={data.image} 
        alt={data.name}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 w-full p-6 text-white transform transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
        <div className="flex items-center gap-2 mb-2 opacity-80 text-sm font-bold tracking-widest uppercase">
            <span className="bg-white/20 backdrop-blur-md px-2 py-1 rounded-md">{data.type}</span>
            <span>•</span>
            <span>{data.tag}</span>
        </div>
        
        <h3 className="text-3xl font-bold mb-2">{data.name}</h3>
        
        <div className="flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
            <p className="text-gray-300 text-sm max-w-[80%] line-clamp-2">
                {data.description}
            </p>
            <div className="bg-white text-black p-2 rounded-full">
                <ArrowRight size={20} />
            </div>
        </div>
      </div>
    </Link>
  );
}