'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, getDocs, query } from 'firebase/firestore';
import { 
  Map as MapIcon, List, ChevronDown, Loader2, 
  Search as SearchIcon, XCircle
} from 'lucide-react';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ListingCard from '../../components/ListingCard';
import ExperienceCard from '../../components/ExperienceCard';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // 1. Get URL Params
  const locationQuery = searchParams.get('location') || '';
  const categoryQuery = searchParams.get('category') || 'Stays';
  const guestsQuery = searchParams.get('guests') || 1;

  // 2. State
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  // Default to Stays unless "Experiences" is specifically requested
  const [activeTab, setActiveTab] = useState(categoryQuery === 'Experiences' ? 'Experiences' : 'Stays');
  const [showMap, setShowMap] = useState(false);

  // --- 3. FETCH & FILTER REAL DATA ---
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setResults([]); // Clear previous results while loading

      try {
        // Determine collection: 'properties' vs 'activities'
        const collectionName = activeTab === 'Experiences' ? 'activities' : 'properties';
        
        // Fetch all docs (Client-side filtering is fast for <1000 items)
        const q = query(collection(db, collectionName));
        const snapshot = await getDocs(q);
        
        const rawData = snapshot.docs.map(doc => {
            const data = doc.data();
            
            // --- DATA NORMALIZATION (Crucial for production) ---
            return { 
                id: doc.id, 
                ...data,
                // Fix Images: Handle array vs string vs different field names
                image: data.images?.[0] || data.imageUrl || data.imageurl || data.image || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
                // Fix Price: Ensure it's a formatted string
                price: data.price ? Number(data.price).toLocaleString() : "0",
                // Fix Rating: Handle number vs object
                rating: typeof data.rating === 'object' ? (data.rating.overall || 5.0) : (data.rating || 5.0),
                reviews: data.reviews || data.reviewCount || 0,
                // Fix Location
                location: data.location || "Nairobi, Kenya",
                // Fix Title
                title: data.title || data.category || "Untitled Listing"
            };
        });

        // --- CLIENT-SIDE FILTERING ---
        const filtered = rawData.filter(item => {
            if (!locationQuery) return true; // If no search, show all

            const searchLoc = locationQuery.toLowerCase();
            const itemLocation = (item.location || "").toLowerCase();
            const title = (item.title || "").toLowerCase();
            
            // Fuzzy Match: Search text inside Location OR Title
            return itemLocation.includes(searchLoc) || title.includes(searchLoc);
        });

        setResults(filtered);
      } catch (error) {
        console.error("Search Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [locationQuery, activeTab]); // Re-run when Search or Tab changes

  // Handler to switch tabs and update URL
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('category', tab);
    router.replace(`/search?${newParams.toString()}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
         <Navbar />
      </div>
      
      {/* SEARCH HEADER */}
      <div className="sticky top-[72px] z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1920px] mx-auto px-6 py-4">
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                
                {/* Search Summary Display */}
                <div 
                    onClick={() => router.push('/')}
                    className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-sm font-medium w-full md:w-auto cursor-pointer hover:bg-gray-200 transition"
                >
                    <SearchIcon size={16} className="text-nearlink"/>
                    <span className="font-bold text-black">{locationQuery || "Anywhere"}</span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    <span className="text-gray-600">Any week</span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    <span className="text-gray-600">{guestsQuery} guests</span>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto no-scrollbar">
                    <button 
                        onClick={() => handleTabChange('Stays')}
                        className={`px-4 py-2 rounded-full text-sm font-bold border transition whitespace-nowrap ${activeTab === 'Stays' ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-200 hover:border-black'}`}
                    >
                        Stays
                    </button>
                    <button 
                        onClick={() => handleTabChange('Experiences')}
                        className={`px-4 py-2 rounded-full text-sm font-bold border transition whitespace-nowrap ${activeTab === 'Experiences' ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-200 hover:border-black'}`}
                    >
                        Experiences
                    </button>
                    <div className="w-px h-6 bg-gray-200 mx-2 hidden sm:block"></div>
                    <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-sm font-bold hover:border-black transition whitespace-nowrap">
                        Price <ChevronDown size={14}/>
                    </button>
                    <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-sm font-bold hover:border-black transition whitespace-nowrap">
                        Type of place <ChevronDown size={14}/>
                    </button>
                </div>

                {/* Map Toggle */}
                <div className="hidden lg:flex items-center gap-3">
                    <button 
                        onClick={() => setShowMap(!showMap)}
                        className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-800 transition"
                    >
                        {showMap ? <List size={16}/> : <MapIcon size={16}/>} 
                        {showMap ? "Show List" : "Show Map"}
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex min-h-screen">
        
        {/* LEFT: RESULTS LIST */}
        <div className={`w-full ${showMap ? 'lg:w-[60%]' : 'lg:w-full'} px-6 py-8`}>
            
            <h1 className="text-xl font-bold mb-6">
                {loading ? "Searching..." : (
                    <>
                        {results.length > 0 ? `${results.length} ${activeTab}` : 'No matches found'} 
                        {locationQuery && <span className="text-gray-500 font-normal"> in "{locationQuery}"</span>}
                    </>
                )}
            </h1>

            {loading ? (
                <div className="flex flex-col items-center justify-center h-64">
                    <Loader2 className="animate-spin w-10 h-10 text-nearlink mb-4"/>
                    <p className="text-gray-500 font-medium">Scanning the horizon...</p>
                </div>
            ) : results.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <XCircle className="w-12 h-12 text-gray-300 mb-4"/>
                    <h3 className="text-lg font-bold text-gray-900">No matches found</h3>
                    <p className="text-gray-500 mb-4">Try checking your spelling or removing filters.</p>
                    <button onClick={() => router.push('/')} className="text-nearlink font-bold hover:underline">Clear Search</button>
                </div>
            ) : (
                <div className={`grid gap-6 ${showMap ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'}`}>
                    {results.map((item) => (
                        activeTab === 'Stays' ? (
                            <ListingCard key={item.id} data={item} />
                        ) : (
                            <ExperienceCard key={item.id} data={item} />
                        )
                    ))}
                </div>
            )}
        </div>

        {/* RIGHT: MAP PLACEHOLDER */}
        {showMap && (
            <div className="hidden lg:block w-[40%] bg-gray-100 sticky top-[136px] h-[calc(100vh-136px)]">
                <div className="h-full w-full flex items-center justify-center text-gray-400 bg-gray-200 relative">
                    <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(#9ca3af 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                    <div className="bg-white p-6 rounded-2xl shadow-xl z-10 text-center max-w-xs">
                        <MapIcon size={48} className="mx-auto text-nearlink mb-3" />
                        <p className="font-bold text-gray-800 text-lg">Map View</p>
                        <p className="text-sm text-gray-500 mb-4">We are integrating Google Maps API to show {results.length} listings.</p>
                        <button onClick={() => setShowMap(false)} className="text-xs font-bold bg-black text-white px-4 py-2 rounded-lg">Close Map</button>
                    </div>
                </div>
            </div>
        )}

      </div>

      <Footer />
    </div>
  );
}

// ✅ WRAPPER FOR SUSPENSE (Required for Next.js useSearchParams)
export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><Loader2 className="animate-spin text-nearlink"/></div>}>
      <SearchContent />
    </Suspense>
  );
}