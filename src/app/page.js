'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation'; 
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext'; 
import { db } from '@/lib/firebase'; 
import { collection, getDocs, query, limit, orderBy, onSnapshot } from 'firebase/firestore';

import { 
  ShieldCheck, Zap, Map as MapIcon, UserCheck, CheckCircle, Wifi, Briefcase, Calendar,
  Globe, Sun, Clock, UtensilsCrossed, List, Car, Truck, 
  Search, MapPin, ChevronRight, Play, TrendingUp, CloudSun, History, 
  Plus, Loader2, Minus, SlidersHorizontal, Navigation, X, Volume2, VolumeX,
  ArrowUpRight, Star, Building2
} from 'lucide-react';

// ✅ Components
import Navbar from '@/components/Navbar';
import Categories from '@/components/Categories';
import ListingCard from '@/components/ListingCard'; 
import ExperienceCard from '@/components/ExperienceCard'; 
import DestinationCard from '@/components/DestinationCard'; 
import EventCard from '@/components/EventCard'; 
import FoodCard from '@/components/FoodCard'; 
import TransportCard from '@/components/TransportCard';
import GuideCard from '@/components/GuideCard';
import InteractiveMap from '@/components/InteractiveMap'; 
import DownloadAppSection from '@/components/DownloadAppSection';

// --- CONSTANTS ---
const POPULAR_LOCATIONS = [
  { name: "Nairobi", desc: "The Green City in the Sun", image: "https://images.unsplash.com/photo-1663447946197-20072b226079?q=80&w=800&auto=format&fit=crop" },
  { name: "Diani Beach", desc: "Africa's Leading Beach Destination", image: "https://images.unsplash.com/photo-1544977930-1090098df240?q=80&w=800&auto=format&fit=crop" },
  { name: "Mombasa", desc: "Historic Coastal City", image: "https://images.unsplash.com/photo-1570703770337-123321529593?q=80&w=800&auto=format&fit=crop" },
  { name: "Naivasha", desc: "Lakes & Geothermal Spas", image: "https://images.unsplash.com/photo-1621689486187-b93976374f67?q=80&w=800&auto=format&fit=crop" },
  { name: "Maasai Mara", desc: "The World Cup of Wildlife", image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=800&auto=format&fit=crop" },
  { name: "Nakuru", desc: "Home of the Flamingos", image: "https://images.unsplash.com/photo-1647867375236-4076e036df86?q=80&w=800&auto=format&fit=crop" },
  { name: "Lamu", desc: "UNESCO World Heritage Site", image: "https://images.unsplash.com/photo-1590933742469-8392138e0783?q=80&w=800&auto=format&fit=crop" },
  { name: "Nanyuki", desc: "Gateway to Mount Kenya", image: "https://images.unsplash.com/photo-1655219904297-b6d39a383427?q=80&w=800&auto=format&fit=crop" }
];

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

const HERO_IMAGES = {
  'Stays': "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1600&q=65&fm=webp", 
  'Experiences': "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=65&fm=webp", 
  'Transport': "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=65&fm=webp", 
  'Food & Nightlife': "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1600&q=65&fm=webp", 
  'Events': "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=65&fm=webp", 
  'Destinations': "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1600&q=65&fm=webp", 
  'Things To Do': "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1600&q=65&fm=webp", 
  'Travel Guide': "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=65&fm=webp" 
};

// --- FILTERS ---
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

const MOCK_RECENT = [
  { id: 1, label: "Mombasa • Dec 12-14", icon: History },
  { id: 2, label: "Safari Vans", icon: Car },
  { id: 3, label: "Restaurants in Westlands", icon: UtensilsCrossed },
];

// --- HELPER COMPONENTS ---

const StoryViewer = ({ story, onClose }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const duration = 5000; 
        const interval = 50; 
        const step = 100 / (duration / interval);

        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    onClose(); 
                    return 100;
                }
                return prev + step;
            });
        }, interval);

        return () => clearInterval(timer);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center animate-in fade-in duration-200">
            <button onClick={onClose} className="absolute top-6 right-6 text-white z-50 p-2 bg-black/20 rounded-full hover:bg-black/50 backdrop-blur-sm"><X size={24}/></button>
            <div className="absolute top-4 left-4 right-4 h-1 bg-white/30 rounded-full overflow-hidden z-50">
                <div style={{ width: `${progress}%` }} className="h-full bg-white transition-all duration-100 ease-linear"></div>
            </div>
            <div className="relative h-full w-full md:max-w-md bg-gray-900 aspect-[9/16] md:rounded-2xl overflow-hidden shadow-2xl">
                {story.type === 'video' ? (
                     <video src={story.mediaUrl} autoPlay playsInline className="w-full h-full object-cover" />
                ) : (
                     <img src={story.mediaUrl} className="w-full h-full object-cover animate-slow-zoom" alt="Story" />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60"></div>
                <div className="absolute top-8 left-4 flex items-center gap-3">
                    <img src={story.hostAvatar || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} className="w-10 h-10 rounded-full border-2 border-[#005871] object-cover"/>
                    <span className="text-white font-bold drop-shadow-md">{story.hostName}</span>
                </div>
                <div className="absolute bottom-10 left-4 right-4 text-center">
                    <p className="text-white text-lg font-medium mb-6 drop-shadow-md">{story.caption}</p>
                    {story.linkedActivityId && (
                        <Link href={`/experiences/${story.linkedActivityId}`}>
                            <button className="bg-white text-black font-bold py-3 px-8 rounded-full w-full hover:scale-105 transition shadow-lg">
                                View Details
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

const VideoCard = ({ vid, router }) => {
    const videoRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isMuted, setIsMuted] = useState(true);

    const handleHover = () => {
        setIsHovered(true);
        if(videoRef.current) {
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {}); 
            }
        }
    };

    const handleLeave = () => {
        setIsHovered(false);
        if(videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    return (
        <div 
            className="relative aspect-[9/16] w-[200px] md:w-[240px] shrink-0 rounded-2xl overflow-hidden group cursor-pointer shadow-lg snap-start border border-gray-100 bg-black"
            onMouseEnter={handleHover}
            onMouseLeave={handleLeave}
            onClick={() => {
                if(vid.linkedActivityId) router.push(`/experiences/${vid.linkedActivityId}`);
            }}
        >
            <div className={`absolute inset-0 bg-gray-800 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
                {vid.type === 'video' ? (
                     <div className="relative w-full h-full">
                         <video src={vid.mediaUrl} className="w-full h-full object-cover opacity-80" />
                         <div className="absolute inset-0 flex items-center justify-center"><Play size={32} className="text-white fill-white/50"/></div>
                     </div>
                ) : (
                     <img src={vid.mediaUrl} className="w-full h-full object-cover" />
                )}
            </div>
            
            {vid.type === 'video' && (
                <video 
                    ref={videoRef}
                    src={vid.mediaUrl} 
                    muted={isMuted}
                    loop
                    playsInline
                    className={`absolute inset-0 w-full h-full object-cover ${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity`}
                />
            )}

            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/80"></div>
            
            <div className="absolute top-3 left-3 flex items-center gap-2">
                 <img src={vid.hostAvatar || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} className="w-6 h-6 rounded-full border border-white object-cover"/>
                 <span className="text-[10px] text-white font-bold text-shadow drop-shadow-md">{vid.hostName}</span>
            </div>
            
            {isHovered && vid.type === 'video' && (
                <button 
                    onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
                    className="absolute top-3 right-3 bg-black/40 backdrop-blur-md text-white p-1.5 rounded-full hover:bg-white/20"
                >
                    {isMuted ? <VolumeX size={14}/> : <Volume2 size={14}/>}
                </button>
            )}

            <div className="absolute bottom-4 left-3 right-3">
                <div className="flex justify-between items-end mb-2">
                    <h4 className="text-white font-bold text-sm leading-tight line-clamp-2 w-full drop-shadow-md">{vid.caption}</h4>
                </div>
                
                <button className="w-full bg-white text-black text-xs font-black py-2.5 rounded-xl hover:bg-gray-200 flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg">
                    <Zap size={14} className="text-[#005871]" fill="currentColor"/> Book Now
                </button>
            </div>
        </div>
    );
}

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

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371; 
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * (Math.PI/180)) * Math.cos(lat2 * (Math.PI/180)) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; 
};

export default function Home() {
  const router = useRouter(); 
  const { user } = useAuth() || {}; 
  
  const [activeCategory, setActiveCategory] = useState('Stays');
  const [activeSubCategory, setActiveSubCategory] = useState('All');
  const [showFullMap, setShowFullMap] = useState(false); 
  const [scrolled, setScrolled] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  
  const [realData, setRealData] = useState({
      stays: [], experiences: [], food: [], transport: [], events: [], destinations: [], things: [], guides: []
  });
  const [stories, setStories] = useState([]); 
  const [activeStory, setActiveStory] = useState(null); 
  const [isLoading, setIsLoading] = useState(true);

  const [activeSearchField, setActiveSearchField] = useState(null);
  const [searchLocation, setSearchLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0 });
  const searchRef = useRef(null);

  // --- 1. REAL-TIME LISTENER FOR ACTIVITIES (Things To Do / Experiences) ---
  useEffect(() => {
    const q = query(collection(db, "activities"), orderBy("createdAt", "desc"), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(doc => {
            const d = doc.data();
            return {
                id: doc.id,
                ...d,
                title: d.title || d.category || "Activity",
                image: d.imageUrl || d.image || "https://images.unsplash.com/photo-1544551763-46a013bb70d5",
                price: d.price ? Number(d.price).toLocaleString() : "0",
                rating: d.rating || "New"
            };
        });
        setRealData(prev => ({ ...prev, experiences: items, things: items }));
    }, (error) => { console.error("Real-time activities error:", error); });
    return () => unsubscribe();
  }, []);

  // ✅ --- 2. REAL-TIME LISTENER FOR DESTINATIONS (THE FIX) ---
  // This listens to 'destinations'. If empty, it falls back to hardcoded POPULAR_LOCATIONS to ensure UI is populated.
  useEffect(() => {
    const q = query(collection(db, "destinations"), limit(20));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            title: doc.data().name || doc.data().city || "Destination",
            location: doc.data().description || doc.data().country || "Explore",
            image: doc.data().imageUrl || doc.data().image || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1",
            weather: doc.data().weather || "28°C",
            rating: "4.8"
        }));

        if (items.length === 0) {
             // FALLBACK: If DB is empty, use the professional constants
             const mockDestinations = POPULAR_LOCATIONS.map((loc, index) => ({
                 id: `mock-${index}`,
                 title: loc.name,
                 location: loc.desc,
                 image: loc.image,
                 weather: "28°C",
                 rating: "4.9"
             }));
             setRealData(prev => ({ ...prev, destinations: mockDestinations }));
        } else {
             setRealData(prev => ({ ...prev, destinations: items }));
        }
    }, (error) => { console.warn("Destinations listener error:", error); });
    return () => unsubscribe();
  }, []);

  // --- 3. GENERAL FETCH FOR OTHER STATIC CATEGORIES ---
  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Stories
            try {
                const storiesQuery = query(collection(db, "stories"), orderBy("createdAt", "desc"), limit(10));
                const storiesSnap = await getDocs(storiesQuery);
                setStories(storiesSnap.docs.map(doc => ({
                    id: doc.id, ...doc.data(),
                    caption: doc.data().caption || "New Story",
                    hostName: doc.data().hostName || "Host",
                    hostAvatar: doc.data().hostAvatar || "", 
                    mediaUrl: doc.data().mediaUrl || "",
                    type: doc.data().type || "image"
                })));
            } catch (err) {}

            const fetchCollection = async (col, limitCount) => {
                try {
                    const q = query(collection(db, col), limit(limitCount));
                    const snap = await getDocs(q);
                    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                } catch (e) { return []; }
            };

            const [stays, food, transport, guides] = await Promise.all([
                fetchCollection("properties", 20),
                fetchCollection("food", 20),
                fetchCollection("transport", 20),
                fetchCollection("guides", 20),
            ]);

            setRealData(prev => ({ 
                ...prev,
                stays: stays.map(d => ({ ...d, title: d.title || d.name, price: d.pricePerNight || d.price, image: d.images?.[0] || d.imageUrl })), 
                food: food.map(d => ({ ...d, title: d.title || d.name, image: d.imageurl || d.image })), 
                transport: transport.map(d => ({ ...d, title: d.make ? `${d.make} ${d.model}` : d.title, image: d.imageUrl })), 
                guides: guides.map(d => ({ ...d, image: d.imageUrl })),
                events: [] 
            }));

        } catch (error) {
            console.error("Global Fetch Error:", error);
        } finally {
            setIsLoading(false);
        }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
            },
            (error) => console.log("Location denied or unavailable:", error.message)
        );
    }
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
      else if (activeCategory === 'Things To Do') data = realData.things;
      else if (activeCategory === 'Destinations') data = realData.destinations; // ✅ Correct Data Source
      else if (activeCategory === 'Food & Nightlife') data = realData.food;
      else if (activeCategory === 'Transport') data = realData.transport;
      else if (activeCategory === 'Travel Guide') data = realData.guides;
      
      let filtered = data;
      if (activeSubCategory !== 'All' && !activeSubCategory.startsWith('All')) {
          filtered = data.filter(item => {
              const text = [item.category, item.type, item.title, item.location, item.name].filter(Boolean).join(" ").toLowerCase();
              return text.includes(activeSubCategory.toLowerCase());
          });
      }
      
      if (userLocation && activeCategory === 'Stays') {
          filtered = filtered.map(item => {
              const dist = (item.lat && item.lng) 
                  ? calculateDistance(userLocation.lat, userLocation.lng, item.lat, item.lng) 
                  : 99999;
              return { ...item, distance: dist };
          }).sort((a, b) => a.distance - b.distance);
      }
      return filtered;
  };

  const displayedItems = getFilteredItems();

  return (
    <main className="min-h-screen bg-gray-50/50 font-sans text-gray-900 selection:bg-[#005871] selection:text-white pb-0">
      
      {/* DYNAMIC ISLAND */}
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

      {activeStory && (
          <StoryViewer story={activeStory} onClose={() => setActiveStory(null)} />
      )}
      
      {/* HERO SECTION */}
      <div className="relative h-[85vh] w-full flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
              <img 
                key={activeCategory} 
                src={HERO_IMAGES[activeCategory] || HERO_IMAGES['Stays']} 
                className="w-full h-full object-cover scale-110 motion-safe:animate-slow-pan transition-opacity duration-700" 
                alt="Hero"
                loading="eager" 
                fetchPriority="high"
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

              <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white mb-8 tracking-tight drop-shadow-2xl leading-tight animate-fade-in-up">
                  {user?.name ? `Welcome back, ${user.name.split(' ')[0]}.` : (HERO_TEXTS[activeCategory] || "Wake up Here.")}
              </h1>
              
              {/* SEARCH BAR (Full Logic) */}
              <div 
                    ref={searchRef}
                    className={`w-full max-w-4xl bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.4)] p-2 flex flex-col md:flex-row gap-2 md:gap-0 relative z-20 border border-white/50 transition-all duration-200 ${activeSearchField ? 'bg-gray-100' : ''}`}
                    onClick={(e) => e.stopPropagation()} 
              >
                  {/* Location */}
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

                  {/* Dates */}
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

                  {/* Guests */}
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

                  {/* Button */}
                  <button onClick={handleSearch} className="bg-[#005871] hover:bg-[#004052] text-white p-4 md:p-5 rounded-[1.5rem] transition-all duration-300 shadow-xl flex items-center justify-center w-full md:w-auto aspect-auto md:aspect-square group my-auto md:mr-1">
                      <span className="md:hidden font-bold mr-2">Search</span>
                      <Search size={24} strokeWidth={2.5} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition"/>
                  </button>
              </div>
          </div>
      </div>

      {/* --- YOUR STORY --- */}
      <div className="pt-8 pb-4 border-b border-gray-100 bg-white">
          <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
              <div className="flex gap-6 overflow-x-auto no-scrollbar pb-2 snap-x items-center">
                  <div className="flex flex-col items-center gap-2 cursor-pointer group shrink-0 snap-start pl-2">
                      <div className="relative w-[65px] h-[65px]">
                          <div className="w-full h-full rounded-full border-2 border-gray-100 p-1">
                              <img src={user?.photoURL || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} className="w-full h-full rounded-full object-cover opacity-50"/>
                          </div>
                          <div className="absolute bottom-0 right-0 bg-[#005871] text-white rounded-full p-1 border-2 border-white"><Plus size={14} /></div>
                      </div>
                      <span className="text-xs font-bold text-gray-400">Your Story</span>
                  </div>
                  {stories.map((story) => (
                      <div key={story.id} onClick={() => setActiveStory(story)} className="flex flex-col items-center gap-2 cursor-pointer group shrink-0 snap-start">
                          <div className="p-[3px] rounded-full bg-gradient-to-tr from-[#005871] to-[#009fb8] group-hover:scale-105 transition-transform duration-300">
                              <div className="w-[60px] h-[60px] rounded-full border-2 border-white overflow-hidden bg-gray-200">
                                  <img src={story.hostAvatar || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} className="w-full h-full object-cover" alt={story.caption}/>
                              </div>
                          </div>
                          <span className="text-xs font-bold text-gray-700 truncate max-w-[70px]">{story.caption}</span>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      {/* --- CONTENT GRID --- */}
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
                  <button onClick={() => setShowFullMap(!showFullMap)} className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-xl text-xs font-bold hover:border-[#005871] transition">{showFullMap ? <List size={14} /> : <MapIcon size={14} />} {showFullMap ? 'List' : 'Full Map'}</button>
                  <button className="bg-[#005871] p-2 rounded-xl text-white hover:bg-[#004052]"><SlidersHorizontal size={16}/></button>
              </div>
           </div>
        </div>
      </div>

      <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4 py-8 md:py-12">
         {showFullMap ? (
             <div className="h-[600px] w-full bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300">
                 <InteractiveMap onClose={() => setShowFullMap(false)} properties={displayedItems} center={userLocation} />
             </div>
         ) : (
             <>
               {/* WATCH & BOOK */}
               {!['Transport', 'Travel Guide'].includes(activeCategory) && stories.length > 0 && (
                   <div className="mb-10">
                       <div className="flex items-center gap-2 mb-6"><div className="bg-[#005871] p-1.5 rounded-lg text-white"><Play size={16} fill="currentColor" /></div><h3 className="text-lg md:text-xl font-bold">Watch & Book</h3></div>
                       <div className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory no-scrollbar scroll-smooth">
                           {stories.map((vid) => ( <VideoCard key={vid.id} vid={vid} router={router} /> ))}
                       </div>
                   </div>
               )}

               {/* MAP BANNER */}
               {activeCategory === 'Stays' && (
                   <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                       <div className="flex items-center justify-between mb-6">
                           <div className="flex items-center gap-2">
                               <div className="bg-green-100 p-1.5 rounded-lg text-green-700 animate-pulse"><Navigation size={16} /></div>
                               <h3 className="text-lg md:text-xl font-bold">{userLocation ? "Stays Around You" : "Explore on Map"}</h3>
                           </div>
                       </div>
                       <div className="h-[350px] md:h-[450px] w-full bg-gray-100 rounded-3xl border border-gray-200 shadow-inner overflow-hidden relative">
                           <InteractiveMap properties={displayedItems} center={userLocation || { lat: -1.2921, lng: 36.8219 }} zoom={userLocation ? 13 : 11} />
                       </div>
                   </div>
               )}

               {/* LISTINGS GRID */}
               <div className={`grid gap-6 md:gap-8 ${activeCategory === 'Stays' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
                   {isLoading && (<div className="col-span-full h-64 flex items-center justify-center"><Loader2 className="animate-spin w-12 h-12 text-[#005871]" /></div>)}
                   {!isLoading && displayedItems.length === 0 && (
                       <div className="col-span-full h-64 flex flex-col items-center justify-center text-gray-400">
                           <Search size={48} className="mb-4 opacity-50" /><p className="font-bold">No results found.</p>
                       </div>
                   )}
                   {activeCategory === 'Stays' && displayedItems.map((stay) => <ListingCard key={stay.id} data={stay} />)}
                   {(activeCategory === 'Experiences' || activeCategory === 'Things To Do') && displayedItems.map((item) => <ExperienceCard key={item.id} data={item} />)}
                   {activeCategory === 'Food & Nightlife' && displayedItems.map((food) => <FoodCard key={food.id} data={food} />)}
                   {activeCategory === 'Transport' && displayedItems.map((transport) => <TransportCard key={transport.id} data={transport} />)}
                   
                   {/* Destinations with Weather Badge Restored */}
                   {activeCategory === 'Destinations' && displayedItems.map((dest) => (
                       <div className="relative group" key={dest.id}>
                           <DestinationCard data={dest} />
                           <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm"><CloudSun size={12} className="text-orange-500"/> {dest.weather || '25°C'}</div>
                       </div>
                   ))}
                   
                   {activeCategory === 'Events' && displayedItems.map((event) => <EventCard key={event.id} data={event} />)}
                   
                   {/* Travel Guide with Community Card Restored */}
                   {activeCategory === 'Travel Guide' && (
                       <div className="col-span-full grid grid-cols-1 lg:grid-cols-3 gap-8">
                           {displayedItems.map((guide) => <GuideCard key={guide.id} data={guide} />)}
                           <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-3xl border border-gray-200">
                               <h3 className="text-xl font-bold mb-4">Community</h3>
                               <p className="text-sm text-gray-600 mb-6">Connect with other travelers and share your experiences.</p>
                               <button className="w-full bg-[#005871] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#004052]">Join the Discussion</button>
                           </div>
                       </div>
                   )}
               </div>
            </>
         )}
      </div>

      {/* --- ✨ ADVANCED HOST CTA SECTION (ANIMATED) --- */}
      <section className="relative py-24 md:py-32 bg-[#050505] text-white overflow-hidden group">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#005871]/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-900/10 rounded-full blur-[120px]" />

        <div className="max-w-[1400px] mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="space-y-8 text-center lg:text-left animate-in slide-in-from-left-8 duration-700">
               <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                  <Star size={12} className="text-yellow-400 fill-yellow-400"/>
                  <span>Elite Partner Program</span>
               </div>
               <h2 className="text-5xl md:text-7xl font-serif italic leading-tight">
                 Unlock the true <br/>
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 not-italic font-sans font-black">Potential.</span>
               </h2>
               <p className="text-lg text-gray-400 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                 Join the top 1% of hosts. NearLink utilizes AI-driven dynamic pricing and automated guest vetting to maximize your property's yield by up to 40%.
               </p>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition duration-300">
                     <div className="text-3xl font-black text-green-400 mb-1">+40%</div>
                     <div className="text-xs text-gray-400 font-bold uppercase">Revenue Growth</div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition duration-300">
                     <div className="text-3xl font-black text-blue-400 mb-1">0%</div>
                     <div className="text-xs text-gray-400 font-bold uppercase">Listing Fees</div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition duration-300 hidden md:block">
                     <div className="text-3xl font-black text-purple-400 mb-1">24/7</div>
                     <div className="text-xs text-gray-400 font-bold uppercase">Global Support</div>
                  </div>
               </div>
               <div className="pt-6">
                 <Link href="/host">
                   <button className="relative overflow-hidden group bg-white text-black px-10 py-5 rounded-full font-bold text-lg hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-300 mx-auto lg:mx-0 flex items-center gap-3">
                      <span className="relative z-10">Start Hosting</span>
                      <ArrowUpRight size={20} className="relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"/>
                      <div className="absolute inset-0 bg-gray-200 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                   </button>
                 </Link>
               </div>
            </div>

            <div className="relative h-[600px] w-full hidden lg:block perspective-1000">
                <div className="absolute top-0 right-0 w-[380px] h-[480px] bg-gray-800 rounded-[2rem] border border-white/5 shadow-2xl transform rotate-6 hover:rotate-3 transition duration-700 overflow-hidden">
                   <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80" className="w-full h-full object-cover opacity-60"/>
                   <div className="absolute bottom-6 left-6 right-6">
                      <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
                         <div className="h-2 w-24 bg-white/50 rounded mb-2"></div>
                         <div className="h-2 w-16 bg-white/30 rounded"></div>
                      </div>
                   </div>
                </div>
                <div className="absolute bottom-10 left-10 w-[400px] bg-white text-black rounded-[2rem] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.5)] transform -rotate-3 hover:rotate-0 hover:scale-105 transition duration-500 z-20">
                   <div className="flex justify-between items-start mb-8">
                      <div>
                         <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total Earnings</p>
                         <h3 className="text-4xl font-black tracking-tight">KES 245k</h3>
                      </div>
                      <div className="bg-green-100 text-green-700 p-3 rounded-full">
                         <TrendingUp size={24} />
                      </div>
                   </div>
                   <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                         <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white"><Building2 size={18}/></div>
                         <div className="flex-1">
                            <p className="font-bold text-sm">Villa Sunset</p>
                            <p className="text-xs text-gray-500">5 New bookings</p>
                         </div>
                         <span className="text-sm font-bold">+12%</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl opacity-60">
                         <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                         <div className="flex-1">
                            <div className="h-3 w-24 bg-gray-300 rounded mb-1"></div>
                            <div className="h-2 w-16 bg-gray-200 rounded"></div>
                         </div>
                      </div>
                   </div>
                </div>
            </div>

          </div>
        </div>
      </section>

      {/* ✅ DOWNLOAD APP SECTION */}
      <DownloadAppSection />

    </main>
  );
}