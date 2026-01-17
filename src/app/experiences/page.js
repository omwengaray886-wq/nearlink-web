// src/app/experiences/page.js
'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ExperienceCard from '../../components/ExperienceCard';
import { 
  Binoculars, // Safaris
  Tent,       // Cultural/Village
  Utensils,   // Cooking
  Fish,       // Wildlife
  Mountain,   // Hikes
  Umbrella,   // Beaches
  Bike,       // Adventure
  Landmark,   // History
  Music,      // Nightlife
  Palette,    // Art
  HeartHandshake, // Volunteering
  Sparkles,   // Wellness
  SlidersHorizontal 
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: Sparkles },
  { id: 'safari', label: 'Safaris', icon: Binoculars },
  { id: 'culture', label: 'Cultural Tours', icon: Tent },
  { id: 'cooking', label: 'Cooking', icon: Utensils },
  { id: 'wildlife', label: 'Wildlife', icon: Fish },
  { id: 'hiking', label: 'Nature Hikes', icon: Mountain },
  { id: 'beach', label: 'Beaches', icon: Umbrella },
  { id: 'adventure', label: 'Adventure', icon: Bike },
  { id: 'history', label: 'Historical', icon: Landmark },
  { id: 'nightlife', label: 'Nightlife', icon: Music },
  { id: 'art', label: 'Art & Music', icon: Palette },
  { id: 'volunteer', label: 'Volunteering', icon: HeartHandshake },
];

const EXPERIENCES_DATA = [
  {
    id: 1,
    category: 'Cooking',
    title: 'Traditional Swahili Cooking Class',
    location: 'Mombasa Old Town',
    duration: '4 hours',
    groupSize: 6,
    price: '3,500',
    rating: 4.98,
    reviews: 124,
    image: 'https://images.unsplash.com/photo-1590595906931-81f04f0ccebb?q=80&w=2670&auto=format&fit=crop',
    featured: true
  },
  {
    id: 2,
    category: 'Safari',
    title: 'Nairobi National Park Game Drive',
    location: 'Nairobi',
    duration: '5 hours',
    groupSize: 4,
    price: '8,000',
    rating: 4.85,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2668&auto=format&fit=crop',
    featured: false
  },
  {
    id: 3,
    category: 'Art & Music',
    title: 'Maasai Market Beadwork Workshop',
    location: 'Westlands',
    duration: '3 hours',
    groupSize: 10,
    price: '2,000',
    rating: 4.92,
    reviews: 45,
    image: 'https://images.unsplash.com/photo-1498967923769-90c741e43477?q=80&w=2670&auto=format&fit=crop',
    featured: true
  },
  {
    id: 4,
    category: 'Nature Hikes',
    title: 'Karura Forest Bike & Picnic',
    location: 'Nairobi',
    duration: '4 hours',
    groupSize: 8,
    price: '1,500',
    rating: 4.75,
    reviews: 210,
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop',
    featured: false
  },
  // Add more mock data here to test scrolling
];

export default function ExperiencesPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  // Simple Filter Logic
  const filteredData = activeCategory === 'all' 
    ? EXPERIENCES_DATA 
    : EXPERIENCES_DATA.filter(item => 
        item.category.toLowerCase().includes(activeCategory.toLowerCase()) || 
        (activeCategory === 'safari' && item.category === 'Safari') ||
        (activeCategory === 'cooking' && item.category === 'Cooking')
      );

  return (
    <main className="min-h-screen bg-white">
      {/* 1. Navbar Wrapper */}
      <div className="bg-nearlink-dark pb-2 shadow-sm">
         <Navbar />
      </div>

      {/* 2. Hero Section */}
      <div className="relative py-20 bg-gray-900 overflow-hidden">
          <div className="absolute inset-0 opacity-40">
              <img 
                src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=2572&auto=format&fit=crop" 
                className="w-full h-full object-cover"
                alt="Experiences Hero"
              />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
          
          <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4 relative z-10">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                  Unforgettable activities <br/> hosted by locals.
              </h1>
              <p className="text-xl text-gray-200 max-w-xl">
                  Immerse yourself in culture, adventure, and culinary delights. Verified hosts, authentic experiences.
              </p>
          </div>
      </div>

      {/* 3. Sticky Categories Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100 py-4 shadow-sm">
          <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4 flex items-center gap-4">
              
              {/* Filter Button */}
              <button className="flex items-center gap-2 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold hover:border-black transition shrink-0">
                  <SlidersHorizontal size={16} /> Filters
              </button>
              <div className="h-8 w-[1px] bg-gray-300 mx-2 shrink-0"></div>

              {/* Categories Scroll */}
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
                  {CATEGORIES.map((cat) => (
                      <button 
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`flex flex-col items-center gap-2 min-w-[80px] p-2 rounded-xl transition opacity-80 hover:opacity-100 ${activeCategory === cat.id ? 'text-black border-b-2 border-black opacity-100' : 'text-gray-500 hover:bg-gray-50'}`}
                      >
                          <cat.icon size={24} strokeWidth={1.5} />
                          <span className="text-xs font-bold whitespace-nowrap">{cat.label}</span>
                      </button>
                  ))}
              </div>
          </div>
      </div>

      {/* 4. Experience Grid */}
      <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {activeCategory === 'all' ? 'Top rated experiences' : `${CATEGORIES.find(c => c.id === activeCategory)?.label} near you`}
          </h2>
          
          {filteredData.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                  {filteredData.map((item) => (
                      <ExperienceCard key={item.id} data={item} />
                  ))}
              </div>
          ) : (
              <div className="py-20 text-center border-2 border-dashed border-gray-200 rounded-3xl">
                  <p className="text-gray-500 text-lg">No experiences found in this category yet.</p>
                  <button onClick={() => setActiveCategory('all')} className="mt-4 text-nearlink font-bold underline">
                      View all activities
                  </button>
              </div>
          )}
      </div>

      <Footer />
    </main>
  );
}