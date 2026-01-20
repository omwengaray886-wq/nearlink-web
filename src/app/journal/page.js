'use client';

import { useState, useEffect } from 'react';
import { 
  Search, ArrowRight, Clock, Calendar, ChevronRight, 
  Mail, Loader2, CheckCircle, Tag, User 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- MOCK DATA ---
const CATEGORIES = ["All", "Destinations", "Host Tips", "Culture", "NearLink News"];

const FEATURED_STORY = {
  id: 0,
  category: "Destinations",
  title: "The Hidden Gems of Diani: Beyond the Beach",
  excerpt: "Discover the secret caves, local eateries, and cultural spots that most tourists miss when visiting Kenya's south coast.",
  image: "https://images.unsplash.com/photo-1534768314-9966d51025a1?auto=format&fit=crop&w=1600&q=80",
  author: "Sarah N.",
  date: "Oct 12, 2025",
  readTime: "8 min read"
};

const ARTICLES = [
  {
    id: 1,
    category: "Host Tips",
    title: "How to Style Your Apartment for 5-Star Reviews",
    excerpt: "Small design touches that make a huge difference in guest satisfaction.",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    author: "Brian K.",
    date: "Oct 10, 2025",
    readTime: "5 min read"
  },
  {
    id: 2,
    category: "Culture",
    title: "Nairobi's Evolving Coffee Scene",
    excerpt: "A tour through the best new cafes in Kilimani and Westlands.",
    image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800&q=80",
    author: "David O.",
    date: "Oct 08, 2025",
    readTime: "4 min read"
  },
  {
    id: 3,
    category: "Destinations",
    title: "Weekend Getaway: Naivasha for Couples",
    excerpt: "Where to stay, eat, and relax just 2 hours from the city.",
    image: "https://images.unsplash.com/photo-1517823382935-51bf1dd11d43?auto=format&fit=crop&w=800&q=80",
    author: "Lucy M.",
    date: "Oct 05, 2025",
    readTime: "6 min read"
  },
  {
    id: 4,
    category: "NearLink News",
    title: "Introducing 'Experiences': Do More Than Just Stay",
    excerpt: "We are launching a new way to book local tours and adventures.",
    image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80",
    author: "Team NearLink",
    date: "Oct 01, 2025",
    readTime: "3 min read"
  },
  {
    id: 5,
    category: "Host Tips",
    title: "Smart Pricing Strategies for December",
    excerpt: "Maximize your earnings during the holiday peak season.",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
    author: "Brian K.",
    date: "Sep 28, 2025",
    readTime: "7 min read"
  }
];

export default function JournalPage() {
  const [activeCat, setActiveCat] = useState("All");
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const filteredArticles = activeCat === "All" 
    ? ARTICLES 
    : ARTICLES.filter(art => art.category === activeCat);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    // Simulate API call
    setTimeout(() => {
        setSubscribing(false);
        setSubscribed(true);
        setEmail("");
    }, 1500);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white">

      {/* --- 1. HERO SECTION (Dark for Navbar Visibility) --- */}
      <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
         <div className="absolute inset-0">
             <img 
                src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=2000&q=80" 
                className="w-full h-full object-cover"
                alt="Journal Hero"
             />
             <div className="absolute inset-0 bg-black/50"></div>
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
         </div>
         <div className="relative z-10 text-center text-white px-6 max-w-4xl mt-16">
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <span className="font-bold tracking-[0.2em] uppercase text-xs mb-4 block text-white/80">The NearLink Journal</span>
                <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                    Stories from <br/> the road less traveled.
                </h1>
                <p className="text-xl text-white/80 font-light max-w-2xl mx-auto">
                    Guides, tips, and inspiration for hosts and travelers across Africa.
                </p>
             </motion.div>
         </div>
      </div>

      {/* --- 2. CONTENT CONTAINER --- */}
      <div className="max-w-7xl mx-auto px-6 py-20">
         
         {/* CATEGORY FILTER */}
         <div className="flex flex-wrap items-center justify-center gap-2 mb-16">
            {CATEGORIES.map(cat => (
                <button 
                    key={cat}
                    onClick={() => setActiveCat(cat)}
                    className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                        activeCat === cat 
                        ? 'bg-black text-white shadow-lg transform scale-105' 
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                >
                    {cat}
                </button>
            ))}
         </div>

         {/* FEATURED STORY (Only show on 'All') */}
         {activeCat === "All" && (
             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group relative rounded-[40px] overflow-hidden mb-20 cursor-pointer shadow-2xl shadow-gray-200"
             >
                <div className="grid md:grid-cols-2 h-full">
                    <div className="h-[400px] md:h-[500px] overflow-hidden">
                        <img 
                           src={FEATURED_STORY.image} 
                           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                           alt="Featured"
                        />
                    </div>
                    <div className="bg-[#005871] text-white p-10 md:p-16 flex flex-col justify-center relative overflow-hidden">
                        {/* Decor */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] pointer-events-none"></div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6 text-white/70 text-sm font-bold uppercase tracking-wider">
                                <span className="bg-white/20 px-3 py-1 rounded-full text-white">{FEATURED_STORY.category}</span>
                                <span>•</span>
                                <span>Featured Story</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">{FEATURED_STORY.title}</h2>
                            <p className="text-lg text-white/80 mb-8 leading-relaxed max-w-md">{FEATURED_STORY.excerpt}</p>
                            
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                                    {FEATURED_STORY.author[0]}
                                </div>
                                <div className="text-sm">
                                    <div className="font-bold">{FEATURED_STORY.author}</div>
                                    <div className="text-white/60">{FEATURED_STORY.date} · {FEATURED_STORY.readTime}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
             </motion.div>
         )}

         {/* ARTICLE GRID */}
         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            <AnimatePresence mode="popLayout">
                {filteredArticles.map((article) => (
                    <motion.div
                        key={article.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="group cursor-pointer flex flex-col h-full"
                    >
                        {/* Image */}
                        <div className="relative h-64 rounded-2xl overflow-hidden mb-6 shadow-md">
                            <img 
                                src={article.image} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                alt={article.title}
                            />
                            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider text-gray-900 shadow-sm">
                                {article.category}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col flex-1">
                            <div className="flex items-center gap-2 text-xs text-gray-400 font-medium mb-3 uppercase tracking-wide">
                                <Calendar size={12} /> {article.date}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#005871] transition-colors leading-tight">
                                {article.title}
                            </h3>
                            <p className="text-gray-500 line-clamp-2 mb-6 text-sm leading-relaxed flex-1">
                                {article.excerpt}
                            </p>
                            
                            {/* Footer */}
                            <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                                   <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-500"><User size={12}/></div>
                                   {article.author}
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                   <Clock size={12}/> {article.readTime}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
         </div>

      </div>

      {/* --- 3. NEWSLETTER SECTION --- */}
      <div className="bg-gray-50 py-24 border-t border-gray-100">
         <div className="max-w-4xl mx-auto px-6 text-center">
             <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mx-auto mb-6 text-[#005871]">
                 <Mail size={32} />
             </div>
             <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Travel inspiration in your inbox.</h2>
             <p className="text-gray-500 text-lg mb-10 max-w-lg mx-auto">
                 Join 15,000+ travelers and hosts getting the best tips, hidden gems, and exclusive NearLink offers.
             </p>

             {subscribed ? (
                 <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-3 text-green-600">
                     <CheckCircle size={48} className="fill-green-100"/>
                     <span className="font-bold text-lg">You're on the list!</span>
                 </motion.div>
             ) : (
                 <form onSubmit={handleSubscribe} className="max-w-md mx-auto relative">
                     <input 
                        type="email" 
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full pl-6 pr-32 py-4 rounded-full border border-gray-300 focus:border-[#005871] focus:ring-4 focus:ring-[#005871]/10 outline-none transition-all text-lg shadow-sm"
                     />
                     <button 
                        type="submit" 
                        disabled={subscribing}
                        className="absolute right-2 top-2 bottom-2 bg-[#005871] hover:bg-[#004255] text-white px-6 rounded-full font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
                     >
                        {subscribing ? <Loader2 size={20} className="animate-spin"/> : "Subscribe"}
                     </button>
                 </form>
             )}
             <p className="text-xs text-gray-400 mt-6">No spam, ever. Unsubscribe anytime.</p>
         </div>
      </div>

    </div>
  );
}