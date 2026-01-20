'use client';

import { useParams, useRouter } from 'next/navigation';
import { ARTICLES } from '@/data/articles';
import { useState, useEffect } from 'react';
import { 
  ArrowLeft, Calendar, Clock, Facebook, Twitter, Linkedin, 
  Link as LinkIcon, Share2, Star, ArrowRight, CheckCircle, 
  MapPin, ThumbsUp, ThumbsDown, List, X
} from 'lucide-react';
import { motion, useScroll, useSpring } from 'framer-motion';

// --- BLOCK RENDERER ---
const RenderBlock = ({ block }) => {
  switch (block.type) {
    case 'paragraph':
      return <p className="text-lg text-gray-600 leading-relaxed mb-8">{block.text}</p>;
    
    case 'heading':
      const HeadingTag = `h${block.level || 2}`;
      return (
        <HeadingTag id={block.id} className={`font-bold text-gray-900 mb-6 mt-12 scroll-mt-24 ${block.level === 3 ? 'text-xl' : 'text-2xl md:text-3xl'}`}>
          {block.text}
        </HeadingTag>
      );

    case 'quote':
      return (
        <blockquote className="border-l-4 border-[#005871] pl-6 py-2 my-10 bg-gray-50 rounded-r-xl">
           <p className="text-xl italic text-gray-800 font-serif mb-3">"{block.text}"</p>
           {block.author && <cite className="text-sm text-gray-500 font-bold not-italic uppercase tracking-wide">— {block.author}</cite>}
        </blockquote>
      );

    case 'image_grid':
      return (
        <div className="my-10">
           <div className={`grid gap-4 ${block.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {block.images.map((img, idx) => (
                 <div key={idx} className="rounded-xl overflow-hidden shadow-md">
                    <img src={img} className="w-full h-full object-cover hover:scale-105 transition duration-700" alt="Detail"/>
                 </div>
              ))}
           </div>
           {block.caption && <p className="text-center text-sm text-gray-400 mt-3 italic">{block.caption}</p>}
        </div>
      );

    case 'pros_cons':
      return (
        <div className="grid md:grid-cols-2 gap-6 my-10">
            <div className="bg-green-50/50 border border-green-100 p-6 rounded-2xl">
                <div className="flex items-center gap-2 font-bold text-green-800 mb-4 uppercase text-xs tracking-widest">
                    <ThumbsUp size={16}/> The Good
                </div>
                <ul className="space-y-3">
                    {block.pros.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                            <CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5"/> {item}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="bg-red-50/50 border border-red-100 p-6 rounded-2xl">
                <div className="flex items-center gap-2 font-bold text-red-800 mb-4 uppercase text-xs tracking-widest">
                    <ThumbsDown size={16}/> The Bad
                </div>
                <ul className="space-y-3">
                    {block.cons.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0"></div> {item}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      );

    case 'map_location':
      return (
        <div className="my-10 rounded-2xl overflow-hidden border border-gray-200 shadow-lg relative group">
            <div className="bg-gray-100 h-64 flex items-center justify-center relative">
                {/* Simulated Map Visual */}
                <div className="absolute inset-0 opacity-50" style={{backgroundImage: 'radial-gradient(#ccc 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                <div className="bg-white p-4 rounded-xl shadow-xl z-10 flex items-center gap-3 animate-bounce">
                    <div className="bg-[#005871] p-2 rounded-full text-white"><MapPin size={24}/></div>
                    <div>
                        <div className="font-bold text-sm text-gray-900">{block.name}</div>
                        <div className="text-xs text-gray-500">Click to view on Google Maps</div>
                    </div>
                </div>
            </div>
            <a 
                href={`https://www.google.com/maps/search/?api=1&query=${block.lat},${block.lng}`} 
                target="_blank" 
                rel="noreferrer"
                className="absolute inset-0 z-20"
            />
        </div>
      );

    case 'checklist':
      return (
        <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-8 my-10">
           <h4 className="font-bold text-[#005871] mb-6 flex items-center gap-2 text-lg">
              <CheckCircle size={24}/> {block.title}
           </h4>
           <ul className="grid md:grid-cols-2 gap-4">
              {block.items.map((item, i) => (
                 <li key={i} className="flex items-center gap-3 text-gray-700 bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
                    <div className="w-4 h-4 rounded-full border-2 border-green-500 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                    {item}
                 </li>
              ))}
           </ul>
        </div>
      );

    case 'booking_card':
      return (
        <div className="my-12 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all max-w-md mx-auto group ring-1 ring-gray-100">
           <div className="h-56 overflow-hidden relative">
              <img src={block.image} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" alt={block.title}/>
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm">
                 <Star size={12} className="fill-black"/> {block.rating}
              </div>
           </div>
           <div className="p-6">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#005871] mb-2">Featured Experience</div>
              <h4 className="font-bold text-2xl mb-2 text-gray-900">{block.title}</h4>
              <p className="text-gray-500 text-sm mb-6">Bookable directly on NearLink with instant confirmation.</p>
              <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                 <div>
                    <span className="text-xs text-gray-400 block font-bold uppercase">From</span>
                    <span className="text-xl font-black text-gray-900">{block.price}</span>
                 </div>
                 <a href={block.link} className="bg-[#005871] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#004052] transition flex items-center gap-2 shadow-lg shadow-[#005871]/20">
                    Book Now <ArrowRight size={16}/>
                 </a>
              </div>
           </div>
        </div>
      );

    default:
      return null;
  }
};

export default function ArticlePage() {
  const { id } = useParams();
  const router = useRouter();
  const [showShareToast, setShowShareToast] = useState(false);
  
  // Find article
  const article = ARTICLES.find(a => a.id.toString() === id);

  // --- 1. READING PROGRESS BAR ---
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // --- 2. EXTRACT TABLE OF CONTENTS ---
  const toc = article?.content?.filter(block => block.type === 'heading').map(h => ({
      id: h.id || h.text.toLowerCase().replace(/\s+/g, '-'),
      text: h.text
  })) || [];

  if (!article) return <div className="min-h-screen flex items-center justify-center">Article not found.</div>;

  // Real Share Handlers
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const text = `Check out this article on NearLink: ${article.title}`;

  const handleCopyLink = () => {
      navigator.clipboard.writeText(shareUrl);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 3000);
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      
      {/* READING PROGRESS BAR */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-[#005871] origin-left z-50"
        style={{ scaleX }}
      />

      {/* HERO HEADER */}
      <div className="relative h-[70vh] min-h-[550px]">
         <img src={article.image} className="w-full h-full object-cover" alt={article.title} />
         <div className="absolute inset-0 bg-black/40"></div>
         <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
         
         {/* Navigation */}
         <div className="absolute top-24 left-4 md:left-10 z-20">
             <button 
                onClick={() => router.back()} 
                className="flex items-center gap-2 text-white/90 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition backdrop-blur-md border border-white/10"
             >
                <ArrowLeft size={20}/> <span className="hidden md:inline">Back to Journal</span>
             </button>
         </div>

         {/* Title Area */}
         <div className="absolute bottom-0 left-0 w-full p-6 md:p-20 text-white">
             <motion.div initial={{y: 30, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{duration: 0.8}}>
                 <div className="flex flex-wrap items-center gap-4 mb-6">
                    <span className="bg-[#005871] text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded text-white shadow-lg border border-white/10">
                        {article.category}
                    </span>
                    <span className="flex items-center gap-2 text-sm font-bold bg-black/40 backdrop-blur-md px-3 py-1.5 rounded text-white/90 border border-white/10">
                        <Clock size={14}/> {article.readTime} Read
                    </span>
                 </div>
                 
                 <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight max-w-5xl drop-shadow-2xl">
                    {article.title}
                 </h1>
                 
                 <div className="flex items-center gap-4">
                     <img src={article.author?.avatar} className="w-14 h-14 rounded-full border-2 border-white shadow-md" alt={article.author?.name}/>
                     <div>
                         <div className="font-bold text-lg leading-none mb-1">{article.author?.name}</div>
                         <div className="text-white/70 text-xs uppercase tracking-wide font-bold">{article.author?.role}</div>
                     </div>
                 </div>
             </motion.div>
         </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 mt-16">
          
          {/* LEFT: TABLE OF CONTENTS (Sticky Desktop) */}
          <div className="hidden lg:block lg:col-span-3">
              <div className="sticky top-32 p-6 border-l-2 border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-6 uppercase text-xs tracking-widest flex items-center gap-2">
                      <List size={14}/> In this article
                  </h4>
                  <ul className="space-y-4">
                      {toc.map((item) => (
                          <li key={item.id}>
                              <a href={`#${item.id}`} className="text-sm text-gray-500 hover:text-[#005871] font-medium transition block">
                                  {item.text}
                              </a>
                          </li>
                      ))}
                  </ul>
              </div>
          </div>

          {/* CENTER: MAIN CONTENT */}
          <div className="lg:col-span-6">
              {/* Excerpt */}
              <p className="text-2xl md:text-3xl text-gray-900 font-serif leading-relaxed mb-12 border-b border-gray-100 pb-12">
                  {article.excerpt}
              </p>

              {/* Render Blocks */}
              {article.content.map((block, index) => (
                  <RenderBlock key={index} block={block} />
              ))}

              {/* Share Section */}
              <div className="bg-gray-50 rounded-3xl p-8 mt-16 text-center">
                 <h4 className="font-bold text-xl text-gray-900 mb-2">Enjoyed this story?</h4>
                 <p className="text-gray-500 mb-6">Share it with your travel buddy.</p>
                 <div className="flex justify-center gap-4">
                     <a 
                        href={`https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}`} 
                        target="_blank" rel="noreferrer"
                        className="p-4 bg-white rounded-full text-blue-400 shadow-sm hover:shadow-md hover:scale-110 transition"
                     >
                        <Twitter size={20}/>
                     </a>
                     <a 
                        href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} 
                        target="_blank" rel="noreferrer"
                        className="p-4 bg-white rounded-full text-blue-600 shadow-sm hover:shadow-md hover:scale-110 transition"
                     >
                        <Facebook size={20}/>
                     </a>
                     <a 
                        href={`https://api.whatsapp.com/send?text=${text} ${shareUrl}`} 
                        target="_blank" rel="noreferrer"
                        className="p-4 bg-white rounded-full text-green-500 shadow-sm hover:shadow-md hover:scale-110 transition"
                     >
                        <Share2 size={20}/>
                     </a>
                     <button 
                        onClick={handleCopyLink}
                        className="p-4 bg-white rounded-full text-gray-700 shadow-sm hover:shadow-md hover:scale-110 transition relative"
                     >
                        <LinkIcon size={20}/>
                        {/* TOAST NOTIFICATION */}
                        {showShareToast && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-black text-white text-xs py-1 px-3 rounded-lg whitespace-nowrap">
                                Copied!
                            </div>
                        )}
                     </button>
                 </div>
              </div>
          </div>

          {/* RIGHT: AUTHOR & SIDEBAR (Sticky) */}
          <div className="lg:col-span-3 space-y-10">
              <div className="bg-white border border-gray-200 rounded-3xl p-8 sticky top-32 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  <div className="flex flex-col items-center text-center">
                      <img src={article.author?.avatar} className="w-24 h-24 rounded-full mb-4 border-4 border-gray-50" alt="Author"/>
                      <div className="font-bold text-xl text-gray-900">{article.author?.name}</div>
                      <div className="text-xs text-[#005871] font-bold uppercase tracking-widest mb-4">{article.author?.role}</div>
                      <p className="text-gray-500 text-sm leading-relaxed mb-6">
                          {article.author?.bio || "Passionate about travel and exploring local cultures."}
                      </p>
                      <button className="w-full py-2.5 rounded-xl border border-gray-200 font-bold text-sm hover:bg-black hover:text-white transition">
                          View Profile
                      </button>
                  </div>
              </div>
          </div>

      </div>

      {/* RELATED ARTICLES */}
      <div className="bg-[#f9fafb] mt-24 py-24 border-t border-gray-200">
          <div className="max-w-[1400px] mx-auto px-6">
              <div className="flex items-center justify-between mb-12">
                  <h3 className="text-3xl font-black text-gray-900">More from the Journal</h3>
                  <button onClick={() => router.push('/journal')} className="font-bold text-[#005871] hover:underline flex items-center gap-1">
                      View all <ArrowRight size={16}/>
                  </button>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                  {ARTICLES.filter(a => a.id !== article.id).slice(0, 3).map(rel => (
                      <div key={rel.id} onClick={() => router.push(`/journal/${rel.id}`)} className="cursor-pointer group bg-white rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full">
                          <div className="h-56 overflow-hidden relative">
                              <img src={rel.image} className="w-full h-full object-cover transition duration-700 group-hover:scale-110"/>
                              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition"></div>
                              <span className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1 text-xs font-bold rounded-lg uppercase tracking-wider text-gray-900 shadow-sm">
                                  {rel.category}
                              </span>
                          </div>
                          <div className="p-6 flex flex-col flex-1">
                              <div className="flex items-center gap-2 text-xs text-gray-400 font-bold uppercase mb-3">
                                  <span>{rel.date}</span> • <span>{rel.readTime}</span>
                              </div>
                              <h4 className="font-bold text-xl group-hover:text-[#005871] transition mb-4 leading-tight flex-1">
                                  {rel.title}
                              </h4>
                              <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                                  <img src={rel.author?.avatar} className="w-8 h-8 rounded-full" alt="author"/>
                                  <span className="text-sm text-gray-600 font-bold">{rel.author?.name}</span>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>

    </div>
  );
}