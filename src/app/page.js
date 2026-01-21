'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation'; 
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext'; 
import { db } from '@/lib/firebase'; 
import { collection, getDocs, query, limit } from 'firebase/firestore';

import { 
  ShieldCheck, Zap, Map as MapIcon, UserCheck, CheckCircle, Wifi, Briefcase, Calendar,
  Globe, Sun, Clock, UtensilsCrossed, List, Car, Truck, 
  Search, MapPin, ChevronRight, Play, TrendingUp, CloudSun, History, 
  Plus, Loader2, Minus, SlidersHorizontal
} from 'lucide-react';

// ✅ Components
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer'; 
import Categories from '@/components/Categories';
import ListingCard from '@/components/ListingCard'; 
import ExperienceCard from '@/components/ExperienceCard'; 
import DestinationCard from '@/components/DestinationCard'; 
import EventCard from '@/components/EventCard'; 
import FoodCard from '@/components/FoodCard'; 
import TransportCard from '@/components/TransportCard';
import GuideCard from '@/components/GuideCard';
import InteractiveMap from '@/components/InteractiveMap'; 

// --- CONSTANTS ---
const POPULAR_LOCATIONS = [
  { name: "Nairobi", desc: "Capital City" },
  { name: "Diani Beach", desc: "Coastal Paradise" },
  { name: "Mombasa", desc: "Historic Coast" },
  { name: "Naivasha", desc: "Lakes & Geothermals" },
  { name: "Maasai Mara", desc: "Safari & Wildlife" },
  { name: "Nakuru", desc: "National Park" },
  { name: "Lamu", desc: "Old Town & Culture" },
  { name: "Nanyuki", desc: "Mount Kenya Region" }
];

// ✅ DYNAMIC HERO TEXTS
const HERO_TEXTS = {
  'Stays': "Find your home away from home.",
  'Experiences': "Don't just visit. Live it.",
  'Transport': "Journey without limits.",
  'Food & Nightlife': "Savor the local flavor.",
  'Events': "Experience the extraordinary.",
  'Destinations': "Discover your next adventure.",
  'Things To Do': "Create memories that last.",
  'Travel Guide': "Travel smarter, go further."
};

// ✅ DYNAMIC HERO IMAGES (Changes background based on tab)
const HERO_IMAGES = {
  'Stays': "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=2000&q=80", // Cozy Lodge
  'Experiences': "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=2668&q=80", // Safari
  'Transport': "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=2000&q=80", // Safari Van
  'Food & Nightlife': "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=2000&q=80", // Food
  'Events': "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=2000&q=80", // Concert
  'Destinations': "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=2000&q=80", // Landscape
  'Things To Do': "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=2000&q=80", // Activity
  'Travel Guide': "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=2000&q=80" // Map/Guide
};

const STAY_TYPES = ["All Stays", "BnBs", "Guest houses", "Lodges", "Eco stays", "Village homestays", "Luxury villas"];
const STAY_FILTERS = [{ label: "Verified", icon: CheckCircle }, { label: "Work-ready", icon: Briefcase }, { label: "Fast Wifi", icon: Wifi }];

const EXPERIENCE_TYPES = ["All Activities", "Safaris", "Cultural tours", "Village visits", "Cooking", "Wildlife", "Hiking"];
const EXPERIENCE_FILTERS = [{ label: "Family", icon: CheckCircle }, { label: "Multi-day", icon: Calendar }];

const FOOD_TYPES = ["All Spots", "Restaurants", "Street Food", "Bars", "Coffee", "Traditional"];
const FOOD_FILTERS = [{ label: "Open Now", icon: Clock }, { label: "Delivery", icon: UtensilsCrossed }];

const TRANSPORT_TYPES = ["All Transport", "Airport", "Taxis", "Rentals", "Safari Vans", "Trains", "Boats"];
const TRANSPORT_FILTERS = [{ label: "Driver", icon: UserCheck }, { label: "4x4", icon: Truck }];

const EVENT_TYPES = ["All Events", "Festivals", "Concerts", "Ceremonies", "Sports", "Food Fest"];
const EVENT_FILTERS = [{ label: "Weekend", icon: Calendar }, { label: "Free Entry", icon: Zap }];

const DESTINATION_TYPES = ["All Places", "Countries", "Cities", "Regions", "Villages", "Landmarks"];
const DESTINATION_FILTERS = [{ label: "Visa-free", icon: Globe }, { label: "Tropical", icon: Sun }];

const THING_TYPES = ["All Things", "Museums", "Parks", "Shopping", "Kids", "Outdoor"];
const THING_FILTERS = [{ label: "Open Now", icon: Clock }, { label: "Free", icon: Zap }];

const GUIDE_TYPES = ["All Guides", "Local", "Community", "Stories", "Tips"];
const GUIDE_FILTERS = [{ label: "Verified", icon: ShieldCheck }, { label: "Multilingual", icon: Globe }];

const MOCK_STORIES = [
  { id: 1, name: "Diani Vibe", image: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=2600", viewed: false },
  { id: 2, name: "Safari Life", image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2668", viewed: false },
  { id: 3, name: "Nairobi Eats", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2574", viewed: true },
  { id: 4, name: "Lamu Art", image: "https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?q=80&w=2670", viewed: false },
  { id: 5, name: "Hiking", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560", viewed: true },
];

const MOCK_VIDEOS = [
  { id: 1, title: "Swimming with Dolphins in Wasini", views: "12k", image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2670" },
  { id: 2, title: "Hidden Waterfall in Aberdares", views: "8.5k", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560" },
  { id: 3, title: "Best Street Food in Mombasa", views: "45k", image: "https://images.unsplash.com/photo-1590595906931-81f04f0ccebb?q=80&w=2670" },
  { id: 4, title: "Luxury Glamping Maasai Mara", views: "22k", image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2668" },
];

const MOCK_RECENT = [
  { id: 1, label: "Mombasa • Dec 12-14", icon: History },
  { id: 2, label: "Safari Vans", icon: Car },
  { id: 3, label: "Restaurants in Westlands", icon: UtensilsCrossed },
];

// --- HELPER COMPONENT ---
const GuestCounter = ({ label, desc, value, field, setGuests }) => (
  <div className="flex justify-between items-center py-4 border-b border-gray-100 last:border-0">
    <div>
      <h4 className="font-bold text-sm text-gray-900">{label}</h4>
      <p className="text-xs text-gray-500">{desc}</p>
    </div>
    <div className="flex items-center gap-3">
      <button 
        onClick={(e) => { e.stopPropagation(); setGuests(prev => ({...prev, [field]: Math.max(0, prev[field]-1)}))}}
        className={`w-8 h-8 rounded-full border flex items-center justify-center ${value === 0 ? 'border-gray-200 text-gray-200' : 'border-gray-400 text-gray-600 hover:border-[#005871] hover:text-[#005871]'}`}
        disabled={value === 0}
      >
        <Minus size={14}/>
      </button>
      <span className="w-4 text-center text-sm font-medium">{value}</span>
      <button 
        onClick={(e) => { e.stopPropagation(); setGuests(prev => ({...prev, [field]: prev[field]+1}))}}
        className="w-8 h-8 rounded-full border border-gray-400 text-gray-600 hover:border-[#005871] hover:text-[#005871] flex items-center justify-center"
      >
        <Plus size={14}/>
      </button>
    </div>
  </div>
);

export default function Home() {
  const router = useRouter(); 
  const { user } = useAuth() || {}; 
  
  const [activeCategory, setActiveCategory] = useState('Stays');
  const [activeSubCategory, setActiveSubCategory] = useState('All');
  const [showMap, setShowMap] = useState(false); 
  const [scrolled, setScrolled] = useState(false);
  
  // --- REAL DATA STATE ---
  const [realData, setRealData] = useState({
      stays: [],
      experiences: [], 
      food: [],
      transport: [],
      events: [],
      destinations: [],
      things: [],
      guides: []
  });
  const [isLoading, setIsLoading] = useState(true);

  // --- ADVANCED SEARCH STATE ---
  const [activeSearchField, setActiveSearchField] = useState(null);
  const [searchLocation, setSearchLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0 });
  const searchRef = useRef(null);

  // --- FETCH REAL DATA FROM FIREBASE ---
  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        try {
            // 1. Fetch Properties (Stays)
            let stays = [];
            try {
                const staysQuery = query(collection(db, "properties"), limit(20));
                const staysSnap = await getDocs(staysQuery);
                stays = staysSnap.docs.map(doc => {
                  const d = doc.data();
                  return { 
                    id: doc.id, 
                    ...d,
                    title: d.title || d.name || "Untitled Property",
                    location: d.city || d.location || "Nairobi, Kenya",
                    price: d.pricePerNight ? Number(d.pricePerNight).toLocaleString() : "0", 
                    image: d.images?.[0] || d.image || d.imageUrl || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
                    rating: d.rating || "New"
                  };
                });
            } catch (err) { console.warn("Stays fetch error:", err); }

            // 2. Fetch Experiences
            let experiences = [];
            try {
                const expQuery = query(collection(db, "activities"), limit(20));
                const expSnap = await getDocs(expQuery);
                experiences = expSnap.docs.map(doc => {
                  const d = doc.data();
                  return { 
                    id: doc.id, 
                    ...d,
                    title: d.title || d.category || "Experience",
                    price: d.price ? Number(d.price).toLocaleString() : "0",
                    image: d.imageUrl || d.image || "https://images.unsplash.com/photo-1544551763-46a013bb70d5",
                    rating: d.rating || "New"
                  };
                });
            } catch (err) { console.warn("Activities fetch error:", err); }

            // 3. Fetch Food
            let food = [];
            try {
                const foodQuery = query(collection(db, "food"), limit(20));
                const foodSnap = await getDocs(foodQuery);
                food = foodSnap.docs.map(doc => ({ 
                    id: doc.id, 
                    ...doc.data(),
                    title: doc.data().title || doc.data().name || "Restaurant",
                    image: doc.data().imageurl || doc.data().image || "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b"
                }));
            } catch (err) { console.warn("Food fetch error:", err); }

            // 4. Fetch Guides
            let guides = [];
            try {
                const guidesQuery = query(collection(db, "guides"), limit(20));
                const guidesSnap = await getDocs(guidesQuery);
                guides = guidesSnap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    name: doc.data().name || "Expert Guide",
                    image: doc.data().imageUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
                }));
            } catch (err) { console.warn("Guides fetch error:", err); }

            // 5. Fetch Transport
            let transport = [];
            try {
                const transportQuery = query(collection(db, "transport"), limit(20));
                const transportSnap = await getDocs(transportQuery);
                transport = transportSnap.docs.map(doc => {
                  const d = doc.data();
                  return {
                    id: doc.id,
                    ...d,
                    title: d.make ? `${d.make} ${d.model}` : (d.title || "Rental"),
                    price: d.pricePerDay ? Number(d.pricePerDay).toLocaleString() : "0",
                    image: d.imageUrl || "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2",
                    specs: [d.transmission, d.fuelType].filter(Boolean)
                  };
                });
            } catch (err) { console.warn("Transport fetch error:", err); }

            setRealData({ stays, experiences, food, transport, events: [], destinations: [], things: [], guides });
        } catch (error) {
            console.error("Global Fetch Error:", error);
        } finally {
            setIsLoading(false);
        }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setActiveSearchField(null);
      }
    };
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    e.stopPropagation();
    router.push(`/search?location=${encodeURIComponent(searchLocation)}`);
  };

  const getSubMenu = () => {
      if (activeCategory === 'Experiences') return { types: EXPERIENCE_TYPES, filters: EXPERIENCE_FILTERS };
      if (activeCategory === 'Things To Do') return { types: THING_TYPES, filters: THING_FILTERS };
      if (activeCategory === 'Destinations') return { types: DESTINATION_TYPES, filters: DESTINATION_FILTERS };
      if (activeCategory === 'Events') return { types: EVENT_TYPES, filters: EVENT_FILTERS };
      if (activeCategory === 'Food & Nightlife') return { types: FOOD_TYPES, filters: FOOD_FILTERS };
      if (activeCategory === 'Transport') return { types: TRANSPORT_TYPES, filters: TRANSPORT_FILTERS };
      if (activeCategory === 'Travel Guide') return { types: GUIDE_TYPES, filters: GUIDE_FILTERS };
      return { types: STAY_TYPES, filters: STAY_FILTERS }; 
  };
  const { types } = getSubMenu();

  const getFilteredItems = () => {
      let data = [];
      if (activeCategory === 'Stays') data = realData.stays;
      else if (activeCategory === 'Experiences') data = realData.experiences;
      else if (activeCategory === 'Food & Nightlife') data = realData.food;
      else if (activeCategory === 'Transport') data = realData.transport;
      else if (activeCategory === 'Travel Guide') data = realData.guides;
      
      if (activeSubCategory !== 'All' && !activeSubCategory.startsWith('All')) {
          return data.filter(item => {
              const text = [item.category, item.type, item.title, item.location, item.name].filter(Boolean).join(" ").toLowerCase();
              return text.includes(activeSubCategory.toLowerCase());
          });
      }
      return data;
  };

  const displayedItems = getFilteredItems();

  return (
    <main className="min-h-screen bg-gray-50/50 font-sans text-gray-900 selection:bg-[#005871] selection:text-white pb-0">
      
      {/* DYNAMIC ISLAND NOTIFICATION */}
      <div 
        onClick={() => router.push('/search')}
        className="fixed top-20 md:top-4 left-1/2 -translate-x-1/2 z-[40] animate-fade-in-down hidden lg:flex cursor-pointer hover:scale-105 transition-transform"
      >
          <div className="bg-[#005871]/95 backdrop-blur-xl text-white px-5 py-2.5 rounded-full text-xs font-medium flex items-center gap-3 shadow-2xl border border-white/10 ring-1 ring-white/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="flex items-center gap-1"><CloudSun size={12} className="text-yellow-400"/> Diani Beach is 28°C today</span>
              <div className="w-[1px] h-3 bg-white/20"></div>
              <span className="font-bold text-white">Book a flight now</span>
          </div>
      </div>

      <Navbar transparent={!scrolled} />
      
      {/* HERO SECTION */}
      <div className="relative h-[85vh] w-full flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
              {/* ✅ DYNAMIC BACKGROUND IMAGE */}
              <img 
                key={activeCategory} // Forces re-render/animation on change
                src={HERO_IMAGES[activeCategory] || HERO_IMAGES['Stays']} 
                className="w-full h-full object-cover scale-110 motion-safe:animate-slow-pan transition-opacity duration-700" 
                alt="Hero"
                loading="eager"
                priority="true"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#002c38]/70 via-black/20 to-gray-50/20"></div>
          </div>

          <div className="relative z-10 w-full max-w-7xl px-4 md:px-6 flex flex-col items-center text-center mt-12">
              
              <div className="mb-6 md:mb-8 flex gap-1 p-1.5 bg-white/10 backdrop-blur-xl rounded-full border border-white/15 shadow-2xl overflow-x-auto no-scrollbar max-w-[90vw]">
                  {['Stays', 'Experiences', 'Transport'].map(cat => (
                      <button 
                        key={cat}
                        onClick={(e) => { 
                            e.stopPropagation();
                            setActiveCategory(cat); 
                            setActiveSubCategory('All'); 
                        }}
                        className={`px-4 md:px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${activeCategory === cat ? 'bg-[#005871] text-white shadow-lg' : 'text-white hover:bg-white/10'}`}
                      >
                          {cat}
                      </button>
                  ))}
              </div>

              {/* ✅ RESPONSIVE & DYNAMIC HERO TEXT */}
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white mb-8 tracking-tight drop-shadow-2xl leading-tight">
                  {user?.name ? (
                    `Welcome back, ${user.name.split(' ')[0]}.`
                  ) : (
                    HERO_TEXTS[activeCategory] || "Wake up Here."
                  )}
              </h1>
              
              {/* RESPONSIVE SEARCH BAR */}
              <div 
                    ref={searchRef}
                    className={`w-full max-w-4xl bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.4)] p-2 flex flex-col md:flex-row gap-2 md:gap-0 relative z-20 border border-white/50 transition-all duration-200 ${activeSearchField ? 'bg-gray-100' : ''}`}
                    onClick={(e) => e.stopPropagation()} 
              >
                  {/* 1. LOCATION */}
                  <div 
                    className={`flex-1 rounded-[1.5rem] px-4 md:px-6 py-4 cursor-pointer transition group relative text-left ${activeSearchField === 'location' ? 'bg-white shadow-lg z-30' : 'hover:bg-gray-50'}`}
                    onClick={() => setActiveSearchField('location')}
                  >
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block group-hover:text-[#005871]">Location</label>
                      <input 
                        type="text" 
                        placeholder="Where to?" 
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                        className="w-full text-lg font-bold bg-transparent outline-none placeholder-gray-300 text-gray-900 truncate"
                      />
                      <MapPin className={`absolute right-4 top-1/2 -translate-y-1/2 transition ${activeSearchField === 'location' ? 'text-[#005871]' : 'text-gray-300'}`} size={20}/>
                      
                      {activeSearchField === 'location' && (
                        <div className="absolute top-full left-0 mt-4 w-full md:w-[350px] bg-white rounded-3xl shadow-2xl p-6 overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                           <h4 className="text-xs font-bold text-gray-500 mb-3 px-2">POPULAR DESTINATIONS</h4>
                           <ul className="space-y-1">
                             {POPULAR_LOCATIONS.filter(l => l.name.toLowerCase().includes(searchLocation.toLowerCase())).map((loc) => (
                               <li key={loc.name} className="flex items-center gap-4 p-3 hover:bg-gray-100 rounded-xl cursor-pointer transition" onClick={(e) => { e.stopPropagation(); setSearchLocation(loc.name); setActiveSearchField('dates'); }}>
                                  <div className="bg-[#005871]/5 p-2 rounded-lg text-[#005871]"><MapIcon size={18}/></div>
                                  <div><p className="font-bold text-gray-900 text-sm">{loc.name}</p><p className="text-xs text-gray-500">{loc.desc}</p></div>
                               </li>
                             ))}
                           </ul>
                        </div>
                      )}
                  </div>

                  <div className="w-[1px] h-10 bg-gray-200 my-auto hidden md:block"></div>

                  {/* 2. DATES */}
                  <div 
                    className={`flex-[1.5] rounded-[1.5rem] px-4 md:px-6 py-4 cursor-pointer transition group relative text-left ${activeSearchField === 'dates' ? 'bg-white shadow-lg z-30' : 'hover:bg-gray-50'}`}
                    onClick={() => setActiveSearchField('dates')}
                  >
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block group-hover:text-[#005871]">Dates</label>
                      <div className="flex items-center gap-2">
                          <input type="text" placeholder="Check in" className="w-full text-sm font-bold bg-transparent outline-none placeholder-gray-300 text-gray-900" onFocus={(e) => e.target.type = 'date'} onBlur={(e) => { if(!e.target.value) e.target.type = 'text'; }} value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
                          <span className="text-gray-300">|</span>
                          <input type="text" placeholder="Check out" className="w-full text-sm font-bold bg-transparent outline-none placeholder-gray-300 text-gray-900" onFocus={(e) => e.target.type = 'date'} onBlur={(e) => { if(!e.target.value) e.target.type = 'text'; }} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
                      </div>
                      <Calendar className={`absolute right-4 top-1/2 -translate-y-1/2 transition ${activeSearchField === 'dates' ? 'text-[#005871]' : 'text-gray-300'}`} size={20}/>
                  </div>

                  <div className="w-[1px] h-10 bg-gray-200 my-auto hidden md:block"></div>

                  {/* 3. GUESTS */}
                  <div 
                    className={`flex-1 rounded-[1.5rem] px-4 md:px-6 py-4 cursor-pointer transition group relative text-left ${activeSearchField === 'guests' ? 'bg-white shadow-lg z-30' : 'hover:bg-gray-50'}`}
                    onClick={() => setActiveSearchField('guests')}
                  >
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block group-hover:text-[#005871]">Guests</label>
                      <div className="text-lg font-bold text-gray-900 truncate">{guests.adults + guests.children > 0 ? `${guests.adults + guests.children} Guests` : 'Add guests'}</div>
                      <UserCheck className={`absolute right-4 top-1/2 -translate-y-1/2 transition ${activeSearchField === 'guests' ? 'text-[#005871]' : 'text-gray-300'}`} size={20}/>
                      {activeSearchField === 'guests' && (
                        <div className="absolute top-full right-0 mt-4 w-full md:w-[350px] bg-white rounded-3xl shadow-2xl p-6 animate-in fade-in slide-in-from-top-2 cursor-default z-50">
                           <GuestCounter label="Adults" desc="Ages 13 or above" value={guests.adults} field="adults" setGuests={setGuests} />
                           <GuestCounter label="Children" desc="Ages 2 – 12" value={guests.children} field="children" setGuests={setGuests} />
                           <GuestCounter label="Infants" desc="Under 2" value={guests.infants} field="infants" setGuests={setGuests} />
                        </div>
                      )}
                  </div>

                  {/* Search Button */}
                  <button onClick={handleSearch} className="bg-[#005871] hover:bg-[#004052] text-white p-4 md:p-5 rounded-[1.5rem] transition-all duration-300 shadow-xl flex items-center justify-center w-full md:w-auto aspect-auto md:aspect-square group my-auto md:mr-1">
                      <span className="md:hidden font-bold mr-2">Search</span>
                      <Search size={24} strokeWidth={2.5} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition"/>
                  </button>
              </div>

              {/* RECENT SEARCHES */}
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <span className="text-white/60 text-xs font-bold uppercase tracking-wider py-1.5 hidden md:block">Jump back in:</span>
                  {MOCK_RECENT.map((item) => (
                      <button key={item.id} onClick={() => router.push('/search')} className="bg-black/40 backdrop-blur-md hover:bg-black/60 border border-white/10 rounded-full px-4 py-1.5 flex items-center gap-2 text-white text-xs font-medium transition cursor-pointer">
                          <item.icon size={12} className="text-[#005871]"/> {item.label}
                      </button>
                  ))}
              </div>
          </div>
      </div>

      {/* STORY HIGHLIGHTS */}
      <div className="pt-8 pb-4 border-b border-gray-100 bg-white">
          <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
              <div className="flex gap-6 overflow-x-auto no-scrollbar pb-2 snap-x">
                  <div className="flex flex-col items-center gap-2 cursor-pointer group shrink-0 snap-start pl-2">
                      <div className="w-[60px] h-[60px] md:w-[70px] md:h-[70px] rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition">
                          <Plus size={24} className="text-gray-400"/>
                      </div>
                      <span className="text-xs font-bold text-gray-500">Your Story</span>
                  </div>
                  {MOCK_STORIES.map((story) => (
                      <div key={story.id} className="flex flex-col items-center gap-2 cursor-pointer group shrink-0 snap-start">
                          <div className={`p-[3px] rounded-full ${story.viewed ? 'bg-gray-200' : 'bg-gradient-to-tr from-[#005871] to-[#009fb8]'} group-hover:scale-105 transition-transform duration-300`}>
                              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-white overflow-hidden">
                                  <img src={story.image} className="w-full h-full object-cover" alt={story.name}/>
                              </div>
                          </div>
                          <span className="text-xs font-bold text-gray-700">{story.name}</span>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      {/* STICKY NAV & FILTERS */}
      <div className={`sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-100 transition-all duration-300 ${scrolled ? 'shadow-md' : ''}`}>
        <Categories activeCategory={activeCategory} onCategoryChange={(cat) => { setActiveCategory(cat); setActiveSubCategory('All'); }} />
        <div className="py-3">
           <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4 flex justify-between items-center gap-4 overflow-x-auto no-scrollbar">
              <div className="flex gap-2">
                  {types.map((type) => (
                      <button key={type} onClick={() => setActiveSubCategory(type)} className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 ${activeSubCategory === type ? 'bg-[#005871] text-white shadow-lg scale-105' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                          {type}
                      </button>
                  ))}
              </div>
              <div className="hidden md:flex gap-2 shrink-0 pl-4 border-l border-gray-200">
                  <button onClick={() => setShowMap(!showMap)} className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-xl text-xs font-bold hover:border-[#005871] transition">{showMap ? <List size={14} /> : <MapIcon size={14} />} {showMap ? 'List' : 'Map'}</button>
                  <button className="bg-[#005871] p-2 rounded-xl text-white hover:bg-[#004052]"><SlidersHorizontal size={16}/></button>
              </div>
           </div>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4 py-8 md:py-12">
         {showMap ? (
             <div className="h-[600px] w-full bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300">
                 <InteractiveMap onClose={() => setShowMap(false)} properties={displayedItems} />
             </div>
         ) : (
             <>
               {/* WATCH & BOOK */}
               {!['Transport', 'Travel Guide'].includes(activeCategory) && (
                   <div className="mb-10 md:mb-16">
                       <div className="flex items-center gap-2 mb-6"><div className="bg-[#005871] p-1.5 rounded-lg text-white"><Play size={16} fill="currentColor" /></div><h3 className="text-lg md:text-xl font-bold">Watch & Book</h3></div>
                       <div className="flex gap-4 overflow-x-auto pb-4 snap-x md:grid md:grid-cols-4 md:overflow-visible">
                           {MOCK_VIDEOS.map((vid) => (
                               <div key={vid.id} className="relative aspect-[9/16] w-[160px] md:w-auto shrink-0 rounded-2xl overflow-hidden group cursor-pointer shadow-lg snap-start" onClick={() => router.push(`/experiences/${vid.id}`)}>
                                   <img src={vid.image} className="w-full h-full object-cover transition duration-700 group-hover:scale-110"/>
                                   <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80"></div>
                                   <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1"><Play size={10} fill="currentColor"/> {vid.views}</div>
                                   <div className="absolute bottom-4 left-4 right-4"><h4 className="text-white font-bold text-sm leading-tight mb-2 line-clamp-2">{vid.title}</h4><button className="w-full bg-white text-black text-xs font-bold py-2 rounded-lg hover:bg-gray-200">Book Now</button></div>
                               </div>
                           ))}
                       </div>
                   </div>
               )}

               {/* GRID DISPLAY */}
               <div className={`grid gap-6 md:gap-8 ${activeCategory === 'Stays' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
                   {isLoading && (<div className="col-span-full h-64 flex items-center justify-center"><Loader2 className="animate-spin w-12 h-12 text-[#005871]" /></div>)}
                   
                   {!isLoading && displayedItems.length === 0 && (
                       <div className="col-span-full h-64 flex flex-col items-center justify-center text-gray-400">
                           <Search size={48} className="mb-4 opacity-50" /><p className="font-bold">No results found for "{activeSubCategory}"</p><button onClick={() => setActiveSubCategory('All')} className="mt-4 text-[#005871] underline font-bold">Clear Filters</button>
                       </div>
                   )}

                   {/* RENDERING CARDS BASED ON CATEGORY */}
                   {activeCategory === 'Stays' && displayedItems.map((stay) => <ListingCard key={stay.id} data={stay} />)}
                   
                   {(activeCategory === 'Experiences' || activeCategory === 'Things To Do') && displayedItems.map((item) => (
                       <ExperienceCard key={item.id} data={item} />
                   ))}
                   
                   {activeCategory === 'Food & Nightlife' && displayedItems.map((food) => <FoodCard key={food.id} data={food} />)}
                   
                   {activeCategory === 'Transport' && displayedItems.map((transport) => <TransportCard key={transport.id} data={transport} />)}
                   
                   {activeCategory === 'Destinations' && displayedItems.map((dest) => (
                       <div className="relative group" key={dest.id}>
                           <DestinationCard data={dest} /><div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm"><CloudSun size={12} className="text-orange-500"/> {dest.weather || '25°C'}</div>
                       </div>
                   ))}
                   
                   {activeCategory === 'Events' && displayedItems.map((event) => <EventCard key={event.id} data={event} />)}
                   
                   {activeCategory === 'Travel Guide' && (
                       <div className="col-span-full grid grid-cols-1 lg:grid-cols-3 gap-8">
                           {displayedItems.map((guide) => <GuideCard key={guide.id} data={guide} />)}
                           <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-3xl border border-gray-200"><h3 className="text-xl font-bold mb-4">Community</h3><button className="w-full mt-6 bg-[#005871] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#004052]">Join the Discussion</button></div>
                       </div>
                   )}
               </div>
            </>
         )}
      </div>

      {/* --- HOST CTA SECTION --- */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-[#005871] to-[#001a23] overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[200px] md:w-[500px] h-[500px] bg-black/20 rounded-full blur-[100px]"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 rounded-full px-4 py-1.5 text-xs font-bold text-white mb-6 md:mb-8 backdrop-blur-md">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>Recruiting New Partners
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-4 md:mb-6 leading-tight">Don't just list. <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Build an empire.</span></h2>
              <p className="text-base md:text-lg text-white/70 mb-8 leading-relaxed max-w-md mx-auto lg:mx-0">Join the top 1% of hosts using NearLink's AI-driven pricing and automated management tools to maximize revenue.</p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-10 md:mb-12">
                <div className="flex flex-col"><span className="text-2xl md:text-3xl font-black text-white">30%</span><span className="text-xs text-white/50 uppercase tracking-wider">More Revenue</span></div>
                <div className="w-px h-12 bg-white/10 mx-4"></div>
                <div className="flex flex-col"><span className="text-2xl md:text-3xl font-black text-white">24/7</span><span className="text-xs text-white/50 uppercase tracking-wider">Support</span></div>
                <div className="w-px h-12 bg-white/10 mx-4"></div>
                <div className="flex flex-col"><span className="text-2xl md:text-3xl font-black text-white">0%</span><span className="text-xs text-white/50 uppercase tracking-wider">Listing Fee</span></div>
              </div>
              
              <Link href="/host">
                <button className="group bg-white text-[#005871] px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center gap-3 mx-auto lg:mx-0">
                  Become a Partner <ChevronRight size={20} className="group-hover:translate-x-1 transition"/>
                </button>
              </Link>
            </div>
            
            <div className="relative h-[300px] md:h-[500px] w-full hidden lg:block">
              <div className="absolute top-10 right-10 w-80 bg-white/10 border border-white/20 rounded-2xl p-6 transform rotate-6 backdrop-blur-md scale-90">
                 <div className="h-4 w-24 bg-white/20 rounded mb-4"></div><div className="h-32 bg-black/20 rounded-xl w-full"></div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 bg-white border border-white/10 rounded-3xl p-6 shadow-2xl z-10">
                 <div className="flex justify-between items-center mb-6"><div><p className="text-xs text-gray-500 font-bold uppercase">This Month</p><h4 className="text-3xl font-black text-[#005871]">KES 145,200</h4></div><div className="w-10 h-10 bg-[#005871]/10 text-[#005871] rounded-full flex items-center justify-center"><TrendingUp size={20} /></div></div>
                 <div className="flex items-end justify-between gap-2 h-24 mb-4"><div className="w-full bg-gray-200 rounded-t-sm h-[40%]"></div><div className="w-full bg-gray-200 rounded-t-sm h-[60%]"></div><div className="w-full bg-gray-200 rounded-t-sm h-[30%]"></div><div className="w-full bg-[#005871] rounded-t-sm h-[85%] relative group cursor-pointer"><div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">High</div></div><div className="w-full bg-gray-200 rounded-t-sm h-[50%]"></div></div>
                 <div className="flex items-center gap-2 text-xs text-green-600 font-bold bg-green-50 p-2 rounded-lg"><CheckCircle size={12}/> Payout scheduled for tomorrow</div>
              </div>
              <div className="absolute bottom-20 -left-10 bg-[#005871] text-white p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-20 flex items-center gap-4 animate-in slide-in-from-bottom-8 duration-1000 delay-500">
                 <div className="relative"><img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" className="w-12 h-12 rounded-full object-cover border-2 border-white"/><div className="absolute -bottom-1 -right-1 bg-white text-[#005871] text-[10px] font-bold px-1.5 rounded-full border border-[#005871]">5.0</div></div>
                 <div><p className="font-bold text-sm">New 5-Star Review!</p><p className="text-xs text-white/70">"Best host in Nairobi..."</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}