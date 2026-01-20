'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Search, ArrowRight, Clock, Calendar, ChevronRight, 
  Mail, Loader2, CheckCircle, Tag, User, Heart, Share2, 
  Flame, TrendingUp, Bookmark, Eye, MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

// --- 1. MOCK DATABASE ---
const CATEGORIES = ["All", "Destinations", "Host Tips", "Culture", "Food & Drink", "News"];

const ARTICLES = [
  {
    id: 1,
    category: "Destinations",
    title: "The Hidden Gems of Diani: Beyond the Beach",
    excerpt: "Discover the secret caves, local eateries, and cultural spots that most tourists miss when visiting Kenya's south coast.",
    image: "https://images.unsplash.com/photo-1534768314-9966d51025a1?auto=format&fit=crop&w=1600&q=80",
    author: "Sarah N.",
    role: "Travel Editor",
    authorImg: "https://i.pravatar.cc/150?u=sarah",
    date: "Oct 12, 2025",
    readTime: "8 min",
    views: "2.4k",
    likes: 124,
    featured: true,
    size: "large" // spans 2 cols
  },
  {
    id: 2,
    category: "Host Tips",
    title: "Styling for 5-Star Reviews",
    excerpt: "Small design touches that make a huge difference in guest satisfaction.",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    author: "Brian K.",
    role: "Superhost",
    authorImg: "https://i.pravatar.cc/150?u=brian",
    date: "Oct 10, 2025",
    readTime: "5 min",
    views: "850",
    likes: 45,
    size: "tall" // spans 2 rows
  },
  {
    id: 3,
    category: "Culture",
    title: "Nairobi's Coffee Scene",
    excerpt: "A tour through the best new cafes in Kilimani.",
    image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800&q=80",
    author: "David O.",
    role: "Food Critic",
    authorImg: "https://i.pravatar.cc/150?u=david",
    date: "Oct 08, 2025",
    readTime: "4 min",
    views: "1.2k",
    likes: 89,
    size: "normal"
  },
  {
    id: 4,
    category: "Destinations",
    title: "Naivasha for Couples",
    excerpt: "Where to stay and relax just 2 hours from the city.",
    image: "https://images.unsplash.com/photo-1517823382935-51bf1dd11d43?auto=format&fit=crop&w=800&q=80",
    author: "Lucy M.",
    role: "Contributor",
    authorImg: "https://i.pravatar.cc/150?u=lucy",
    date: "Oct 05, 2025",
    readTime: "6 min",
    views: "3k",
    likes: 210,
    size: "normal"
  },
  {
    id: 5,
    category: "News",
    title: "Introducing 'Experiences'",
    excerpt: "We are launching a new way to book local tours.",
    image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80",
    author: "NearLink Team",
    role: "Official",
    authorImg: "/logo.png",
    date: "Oct 01, 2025",
    readTime: "3 min",
    views: "5k",
    likes: 500,
    size: "wide" // spans 2 cols wide
  },
  {
    id: 6,
    category: "Host Tips",
    title: "Pricing for December",
    excerpt: "Maximize earnings during the holidays.",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
    author: "Brian K.",
    role: "Superhost",
    authorImg: "https://i.pravatar.cc/150?u=brian",
    date: "Sep 28, 2025",
    readTime: "7 min",
    views: "600",
    likes: 32,
    size: "normal"
  }
];

export default function JournalPage() {
  const [activeCat, setActiveCat] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Interactive "Like" State
  const [likedArticles, setLikedArticles] = useState({});

  // Parallax Scroll Hooks
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]); // Text moves slower
  const y2 = useTransform(scrollY, [0, 500], [0, -100]); // Image moves faster

  useEffect(() => setMounted(true), []);

  // Filter Logic (Category + Search)
  const filteredArticles = ARTICLES.filter(art => {
    const matchesCat = activeCat === "All" || art.category === activeCat;
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          art.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    setTimeout(() => {
        setSubscribing(false);
        setSubscribed(true);
        setEmail("");
    }, 1500);
  };

  const toggleLike = (id, e) => {
      e.stopPropagation();
      setLikedArticles(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white">

      {/* --- 1. PARALLAX HERO SECTION --- */}
      <div className="relative h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden">
         <motion.div style={{ y: y2 }} className="absolute inset-0">
             <img 
                src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=2000&q=80" 
                className="w-full h-full object-cover scale-110"
                alt="Journal Hero"
             />
             <div className="absolute inset-0 bg-black/40"></div>
             <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
         </motion.div>
         
         <motion.div style={{ y: y1 }} className="relative z-10 text-center text-white px-6 max-w-5xl mt-20">
             <div className="inline-flex items-center gap-2 border border-white/20 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full mb-6">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-widest">The NearLink Editorial</span>
             </div>
             <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight tracking-tight">
                Stories from <br/> the <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-200">Wild</span>.
             </h1>
             <p className="text-xl text-white/80 font-light max-w-2xl mx-auto leading-relaxed">
                Curated guides, host spotlights, and deep dives into African culture.
                Read by <span className="font-bold text-white">20,000+</span> travelers.
             </p>
         </motion.div>

         {/* Trending Ticker at Bottom of Hero */}
         <div className="absolute bottom-0 w-full bg-white/10 backdrop-blur-md border-t border-white/10 py-3 overflow-hidden flex">
            <div className="flex items-center gap-8 animate-marquee whitespace-nowrap text-white/90 text-sm font-medium">
               <span className="flex items-center gap-2"><Flame size={14} className="text-orange-500"/> Trending: Best 2026 Safari Lodges</span>
               <span>•</span>
               <span className="flex items-center gap-2"><TrendingUp size={14} className="text-green-400"/> New: Direct flights to Malindi</span>
               <span>•</span>
               <span className="flex items-center gap-2"><User size={14} className="text-blue-400"/> Host Spotlight: Mama Nina's Villa</span>
               <span>•</span>
               <span className="flex items-center gap-2"><Flame size={14} className="text-orange-500"/> Trending: Best 2026 Safari Lodges</span>
            </div>
         </div>
      </div>

      {/* --- 2. ADVANCED TOOLBAR (Sticky) --- */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 transition-all duration-300">
         <div className="max-w-[1400px] mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Categories */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar w-full md:w-auto">
                {CATEGORIES.map(cat => (
                    <button 
                        key={cat}
                        onClick={() => setActiveCat(cat)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                            activeCat === cat 
                            ? 'bg-black text-white' 
                            : 'bg-transparent text-gray-500 hover:bg-gray-100'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Live Search */}
            <div className="relative w-full md:w-64 group">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#005871] transition-colors"/>
                <input 
                   type="text" 
                   placeholder="Search articles..." 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full bg-gray-100 pl-10 pr-4 py-2.5 rounded-full text-sm outline-none focus:ring-2 focus:ring-[#005871]/20 focus:bg-white transition-all border border-transparent focus:border-gray-200"
                />
            </div>
         </div>
      </div>

      {/* --- 3. BENTO GRID LAYOUT --- */}
      <div className="max-w-[1400px] mx-auto px-6 py-12">
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[minmax(300px,auto)]">
            <AnimatePresence mode="popLayout">
                {filteredArticles.map((article, index) => {
                    // Dynamic Classes for Bento Layout
                    let spanClass = "col-span-1";
                    if (article.size === "large") spanClass = "md:col-span-2 lg:col-span-2 row-span-2";
                    if (article.size === "tall") spanClass = "row-span-2";
                    if (article.size === "wide") spanClass = "md:col-span-2";

                    return (
                        <motion.div
                            key={article.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            className={`group relative rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 bg-gray-100 ${spanClass}`}
                        >
                            {/* Background Image */}
                            <img 
                                src={article.image} 
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                alt={article.title}
                            />
                            
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

                            {/* Floating Top Actions */}
                            <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-[-10px] group-hover:translate-y-0">
                                <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border border-white/10">
                                    {article.category}
                                </span>
                                <div className="flex gap-2">
                                    <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-black transition">
                                        <Bookmark size={14}/>
                                    </button>
                                    <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-black transition">
                                        <Share2 size={14}/>
                                    </button>
                                </div>
                            </div>

                            {/* Content Content */}
                            <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 z-10 flex flex-col justify-end h-full">
                                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <div className="flex items-center gap-3 text-white/60 text-xs font-bold mb-3">
                                        <span className="flex items-center gap-1"><Calendar size={12}/> {article.date}</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1"><Clock size={12}/> {article.readTime}</span>
                                    </div>

                                    <h3 className={`font-black text-white mb-3 leading-tight ${article.size === 'large' ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'}`}>
                                        {article.title}
                                    </h3>
                                    
                                    {/* Reveal Excerpt on Hover */}
                                    <p className={`text-white/80 line-clamp-2 mb-6 text-sm ${article.size === 'large' ? 'text-lg max-w-lg' : ''} ${article.size === 'tall' ? 'line-clamp-4' : ''}`}>
                                        {article.excerpt}
                                    </p>

                                    {/* Author & Stats Row */}
                                    <div className="flex items-center justify-between border-t border-white/10 pt-4">
                                        {/* Author with Tooltip */}
                                        <div className="flex items-center gap-2 group/author relative">
                                            <img src={article.authorImg} className="w-8 h-8 rounded-full border border-white/30" alt="author"/>
                                            <span className="text-white font-bold text-sm">{article.author}</span>
                                            
                                            {/* Hover Tooltip */}
                                            <div className="absolute bottom-full left-0 mb-3 bg-white text-black p-3 rounded-xl shadow-xl w-48 opacity-0 group-hover/author:opacity-100 transition-opacity pointer-events-none scale-95 group-hover/author:scale-100 origin-bottom-left z-50">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <img src={article.authorImg} className="w-10 h-10 rounded-full" alt="author"/>
                                                    <div>
                                                        <div className="font-bold text-sm">{article.author}</div>
                                                        <div className="text-[10px] text-gray-500 uppercase font-bold">{article.role}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 text-white/70 text-xs font-medium">
                                            <span className="flex items-center gap-1"><Eye size={14}/> {article.views}</span>
                                            <button 
                                                onClick={(e) => toggleLike(article.id, e)}
                                                className={`flex items-center gap-1 transition ${likedArticles[article.id] ? 'text-red-500' : 'hover:text-white'}`}
                                            >
                                                <Heart size={14} className={likedArticles[article.id] ? 'fill-red-500' : ''}/> 
                                                {likedArticles[article.id] ? article.likes + 1 : article.likes}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
         </div>

         {/* Load More Button */}
         <div className="mt-16 text-center">
            <button className="bg-white border border-gray-200 text-black px-8 py-3 rounded-full font-bold hover:bg-black hover:text-white transition-all shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto">
               Load More Stories <ChevronRight size={16}/>
            </button>
         </div>
      </div>

      {/* --- 4. NEWSLETTER (Advanced Visuals) --- */}
      <div className="relative py-32 bg-[#020202] text-white overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
         <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>
         <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>

         <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
             <div className="w-20 h-20 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-2xl mx-auto mb-8 rotate-12 hover:rotate-0 transition-transform duration-500">
                 <Mail size={40} className="text-white" />
             </div>
             <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">The Travel Edit.</h2>
             <p className="text-gray-400 text-lg mb-12 max-w-xl mx-auto">
                 Join 15,000+ insiders. Get curated lists of hidden gems, host secrets, and exclusive launch invites.
             </p>

             {subscribed ? (
                 <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-3 text-green-400">
                     <CheckCircle size={56} className="fill-green-900/50"/>
                     <span className="font-bold text-2xl">Welcome to the club!</span>
                     <span className="text-sm text-gray-500">Check your inbox for a surprise.</span>
                 </motion.div>
             ) : (
                 <form onSubmit={handleSubscribe} className="max-w-lg mx-auto relative group">
                     <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                     <div className="relative flex items-center">
                        <input 
                            type="email" 
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full pl-8 pr-36 py-5 rounded-full bg-[#111] border border-white/10 text-white focus:border-white/30 outline-none transition-all text-lg placeholder:text-gray-600"
                        />
                        <button 
                            type="submit" 
                            disabled={subscribing}
                            className="absolute right-2 top-2 bottom-2 bg-white text-black hover:bg-gray-200 px-8 rounded-full font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {subscribing ? <Loader2 size={20} className="animate-spin"/> : "Subscribe"}
                        </button>
                     </div>
                 </form>
             )}
         </div>
      </div>

    </div>
  );
}