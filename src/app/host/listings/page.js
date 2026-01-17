// src/app/host/listings/page.js
'use client';

import Navbar from '../../../components/Navbar';
import ListingCard from '../../../components/ListingCard'; // Re-using your Pro Component
import Link from 'next/link';
import { Plus, Settings, Search, Filter, Eye, Edit, Trash } from 'lucide-react';

// Mock Data representing the Host's owned properties
// We map 'title' to 'location' field just so the card displays the Name of the property prominently
const MY_PROPERTIES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop",
    location: "Modern 2BR Imara Daima", // Using Title as Location for visibility
    distance: "Active · Instant Book on",
    dates: "Last edited today", 
    price: "2,000",
    rating: 4.85,
    status: 'Listed',
    views: 1240,
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?q=80&w=2600&auto=format&fit=crop",
    location: "Naivasha Lakeview Villa",
    distance: "Pending · Review in progress",
    dates: "Created 2 days ago",
    price: "6,500",
    rating: 0,
    status: 'Pending',
    views: 45,
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2600&auto=format&fit=crop",
    location: "Cozy Studio Near CBD",
    distance: "Unlisted · Maintenance",
    dates: "Last edited 1 week ago",
    price: "1,800",
    rating: 4.7,
    status: 'Unlisted',
    views: 890,
  }
];

export default function MyListingsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navbar Wrapper */}
      <div className="bg-nearlink-dark pb-2">
         <Navbar />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-10 pt-24">
        
        {/* 1. Header with Search & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Listings</h1>
                <p className="text-gray-500">Manage your properties, prices, and availability.</p>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
                 <div className="bg-white border border-gray-200 rounded-full px-4 py-2.5 flex items-center gap-2 shadow-sm focus-within:ring-2 ring-black/10 flex-1 md:flex-none">
                    <Search size={16} className="text-gray-400"/>
                    <input type="text" placeholder="Search..." className="outline-none text-sm w-full md:w-48 bg-transparent"/>
                 </div>
                 <button className="bg-white border border-gray-200 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-50 shadow-sm transition shrink-0">
                    <Filter size={18} className="text-gray-700"/>
                 </button>
                 <Link href="/host/create">
                    <button className="bg-black text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-800 shadow-lg transition shrink-0">
                        <Plus size={20} />
                    </button>
                 </Link>
            </div>
        </div>

        {/* 2. Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Map through Properties */}
            {MY_PROPERTIES.map((property) => (
                <div key={property.id} className="relative group">
                    
                    {/* The Professional Card */}
                    <div className="opacity-100 transition duration-300">
                        <ListingCard data={property} />
                    </div>

                    {/* HOST OVERLAY: Status Badge (Top Left) */}
                    <div className="absolute top-4 left-4 z-30">
                        <span className={`px-3 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-wide shadow-md backdrop-blur-md ${
                            property.status === 'Listed' 
                              ? 'bg-green-500/90 text-white' 
                              : property.status === 'Pending' 
                                ? 'bg-yellow-500/90 text-white' 
                                : 'bg-gray-500/90 text-white'
                        }`}>
                            {property.status}
                        </span>
                    </div>

                    {/* HOST OVERLAY: Management Controls (Hover to show) */}
                    <div className="absolute inset-0 bg-black/40 rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-30 backdrop-blur-[2px]">
                        <button className="bg-white text-gray-900 px-5 py-3 rounded-full font-bold shadow-xl hover:scale-105 transition flex items-center gap-2">
                            <Edit size={16} /> Edit
                        </button>
                        <button className="bg-white text-red-600 px-3 py-3 rounded-full font-bold shadow-xl hover:scale-105 transition flex items-center justify-center">
                            <Trash size={18} />
                        </button>
                    </div>

                    {/* Stats Footer */}
                    <div className="mt-4 flex items-center justify-between px-4 text-sm text-gray-500 font-medium">
                        <div className="flex items-center gap-1">
                            <Eye size={16} className="text-nearlink" />
                            <span>{property.views} views</span>
                        </div>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">ID: {property.id}</span>
                    </div>

                </div>
            ))}

            {/* 3. "Add New" Placeholder Card */}
            <Link href="/host/create">
                <div className="h-[360px] rounded-[32px] border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-4 text-gray-400 hover:border-nearlink hover:text-nearlink hover:bg-nearlink/5 transition cursor-pointer group bg-white">
                    <div className="w-16 h-16 rounded-full bg-gray-50 group-hover:bg-white border border-gray-100 group-hover:border-nearlink/20 flex items-center justify-center transition shadow-sm">
                        <Plus size={32} />
                    </div>
                    <span className="font-bold text-lg">Add another property</span>
                </div>
            </Link>

        </div>

      </div>
    </main>
  );
}