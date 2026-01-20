'use client';

import { useParams, useRouter } from 'next/navigation';
import { ARTICLES } from '@/data/articles'; // SHARED DATA
import { 
  ArrowLeft, Calendar, Clock, Facebook, Twitter, Linkedin, 
  Link as LinkIcon, Share2, Star, ArrowRight, Play, CheckCircle 
} from 'lucide-react';
import { motion } from 'framer-motion';

// --- BLOCK RENDERER COMPONENTS ---

const RenderBlock = ({ block }) => {
  switch (block.type) {
    case 'paragraph':
      return <p className="text-lg text-gray-600 leading-relaxed mb-6">{block.text}</p>;
    
    case 'heading':
      const HeadingTag = `h${block.level || 2}`;
      return (
        <HeadingTag className={`font-bold text-gray-900 mb-4 mt-8 ${block.level === 3 ? 'text-xl' : 'text-2xl md:text-3xl'}`}>
          {block.text}
        </HeadingTag>
      );

    case 'quote':
      return (
        <blockquote className="border-l-4 border-[#005871] pl-6 py-2 my-8 bg-gray-50 rounded-r-lg">
           <p className="text-xl italic text-gray-800 font-serif mb-2">"{block.text}"</p>
           {block.author && <cite className="text-sm text-gray-500 font-bold not-italic uppercase tracking-wide">— {block.author}</cite>}
        </blockquote>
      );

    case 'image_grid':
      return (
        <div className="my-8">
           <div className={`grid gap-4 ${block.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {block.images.map((img, idx) => (
                 <div key={idx} className="rounded-xl overflow-hidden shadow-md">
                    <img src={img} className="w-full h-full object-cover hover:scale-105 transition duration-700" alt="Detail"/>
                 </div>
              ))}
           </div>
           {block.caption && <p className="text-center text-sm text-gray-400 mt-2 italic">{block.caption}</p>}
        </div>
      );

    case 'checklist':
      return (
        <div className="bg-green-50 border border-green-100 rounded-2xl p-6 my-8">
           <h4 className="font-bold text-green-900 mb-4 flex items-center gap-2">
              <CheckCircle size={20}/> {block.title}
           </h4>
           <ul className="space-y-3">
              {block.items.map((item, i) => (
                 <li key={i} className="flex items-start gap-3 text-green-800">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0"></div>
                    {item}
                 </li>
              ))}
           </ul>
        </div>
      );

    case 'booking_card':
      return (
        <div className="my-10 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all max-w-md mx-auto group">
           <div className="h-48 overflow-hidden relative">
              <img src={block.image} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt={block.title}/>
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                 <Star size={12} className="fill-black"/> {block.rating}
              </div>
           </div>
           <div className="p-6">
              <h4 className="font-bold text-xl mb-1">{block.title}</h4>
              <p className="text-gray-500 text-sm mb-4">Bookable directly on NearLink</p>
              <div className="flex items-center justify-between mt-4 border-t border-gray-100 pt-4">
                 <div className="text-lg font-black">{block.price}</div>
                 <a href={block.link} className="bg-[#005871] text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-[#004052] transition flex items-center gap-2">
                    Book Now <ArrowRight size={14}/>
                 </a>
              </div>
           </div>
        </div>
      );

    case 'video_embed':
      return (
        <div className="my-8 rounded-2xl overflow-hidden shadow-lg aspect-video bg-black relative group cursor-pointer">
           <iframe 
             src={block.src} 
             className="w-full h-full" 
             title="Video"
             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
             allowFullScreen
           ></iframe>
        </div>
      );

    default:
      return null;
  }
};

// --- MAIN PAGE COMPONENT ---

export default function ArticlePage() {
  const { id } = useParams();
  const router = useRouter();
  
  // Find article by ID
  const article = ARTICLES.find(a => a.id.toString() === id);

  if (!article) return <div className="min-h-screen flex items-center justify-center">Article not found.</div>;

  return (
    <div className="bg-white min-h-screen pb-20">
      
      {/* 1. HERO HEADER */}
      <div className="relative h-[65vh] min-h-[500px]">
         <img src={article.image} className="w-full h-full object-cover" alt={article.title} />
         <div className="absolute inset-0 bg-black/40"></div>
         <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
         
         <div className="absolute top-24 left-4 md:left-10 z-20">
             <button 
                onClick={() => router.back()} 
                className="flex items-center gap-2 text-white/90 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition backdrop-blur-md"
             >
                <ArrowLeft size={20}/> Back to Journal
             </button>
         </div>

         <div className="absolute bottom-0 left-0 w-full p-6 md:p-20 text-white">
             <motion.div initial={{y: 20, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{duration: 0.6}}>
                 <div className="flex flex-wrap items-center gap-4 mb-6">
                    <span className="bg-[#005871] text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded text-white shadow-lg">
                        {article.category}
                    </span>
                    <span className="flex items-center gap-1 text-sm font-medium bg-black/30 backdrop-blur-md px-3 py-1.5 rounded text-white/90">
                        <Clock size={14}/> {article.readTime} Read
                    </span>
                 </div>
                 
                 <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight max-w-5xl drop-shadow-lg">
                    {article.title}
                 </h1>
                 
                 <div className="flex items-center gap-4">
                     <img src={article.author?.avatar} className="w-12 h-12 rounded-full border-2 border-white shadow-md" alt={article.author?.name}/>
                     <div>
                         <div className="font-bold text-lg leading-none mb-1">{article.author?.name}</div>
                         <div className="text-white/70 text-xs uppercase tracking-wide font-bold">{article.author?.role}</div>
                     </div>
                 </div>
             </motion.div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12">
          
          {/* 2. MAIN CONTENT COLUMN */}
          <div className="lg:col-span-8">
              <div className="prose prose-lg md:prose-xl max-w-none text-gray-600">
                  {/* Lead Excerpt */}
                  <p className="text-xl md:text-2xl text-gray-800 font-serif leading-relaxed mb-10 border-b border-gray-100 pb-10">
                      {article.excerpt}
                  </p>

                  {/* Dynamic Blocks */}
                  {article.content.map((block, index) => (
                      <RenderBlock key={index} block={block} />
                  ))}
              </div>

              {/* Share Footer */}
              <div className="border-t border-gray-100 mt-16 pt-10">
                 <h4 className="font-bold text-gray-900 mb-6">Share this story</h4>
                 <div className="flex gap-4">
                     <button className="flex items-center gap-2 px-5 py-3 bg-gray-100 rounded-full hover:bg-blue-600 hover:text-white transition font-bold text-sm">
                        <Facebook size={18}/> Facebook
                     </button>
                     <button className="flex items-center gap-2 px-5 py-3 bg-gray-100 rounded-full hover:bg-blue-400 hover:text-white transition font-bold text-sm">
                        <Twitter size={18}/> Twitter
                     </button>
                     <button className="flex items-center gap-2 px-5 py-3 bg-gray-100 rounded-full hover:bg-gray-900 hover:text-white transition font-bold text-sm">
                        <LinkIcon size={18}/> Copy Link
                     </button>
                 </div>
              </div>
          </div>

          {/* 3. SIDEBAR (Sticky) */}
          <div className="lg:col-span-4 space-y-10">
              {/* Author Bio */}
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 sticky top-32">
                  <h4 className="font-bold text-gray-900 uppercase tracking-widest text-xs mb-6">About the Author</h4>
                  <div className="flex items-center gap-4 mb-4">
                      <img src={article.author?.avatar} className="w-16 h-16 rounded-full" alt="Author"/>
                      <div>
                          <div className="font-bold text-lg">{article.author?.name}</div>
                          <div className="text-sm text-gray-500">{article.author?.role}</div>
                      </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                      {article.author?.bio || "Passionate about travel and exploring local cultures."}
                  </p>
                  {article.author?.socials && (
                      <div className="flex gap-3">
                          <button className="p-2 bg-white border border-gray-200 rounded-full hover:border-gray-400 transition"><Twitter size={16}/></button>
                          <button className="p-2 bg-white border border-gray-200 rounded-full hover:border-gray-400 transition"><Linkedin size={16}/></button>
                      </div>
                  )}
              </div>

              {/* Stats Card */}
              {article.stats && (
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                      <div className="grid grid-cols-3 gap-4 text-center divide-x divide-gray-100">
                          <div>
                              <div className="font-black text-xl text-gray-900">{article.stats.views.toLocaleString()}</div>
                              <div className="text-xs text-gray-400 font-bold uppercase mt-1">Reads</div>
                          </div>
                          <div>
                              <div className="font-black text-xl text-gray-900">{article.stats.likes}</div>
                              <div className="text-xs text-gray-400 font-bold uppercase mt-1">Likes</div>
                          </div>
                          <div>
                              <div className="font-black text-xl text-gray-900">{article.stats.shares}</div>
                              <div className="text-xs text-gray-400 font-bold uppercase mt-1">Shares</div>
                          </div>
                      </div>
                  </div>
              )}
          </div>

      </div>

      {/* 4. RELATED ARTICLES */}
      <div className="bg-gray-50 mt-24 py-24 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-6">
              <div className="flex items-center justify-between mb-12">
                  <h3 className="text-3xl font-black text-gray-900">Keep Reading</h3>
                  <button onClick={() => router.push('/journal')} className="font-bold text-[#005871] hover:underline">View all stories</button>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                  {ARTICLES.filter(a => a.id !== article.id).slice(0, 3).map(rel => (
                      <div key={rel.id} onClick={() => router.push(`/journal/${rel.id}`)} className="cursor-pointer group bg-white rounded-2xl p-4 hover:shadow-xl transition-all duration-300 border border-gray-100">
                          <div className="h-48 rounded-xl overflow-hidden mb-6 relative">
                              <img src={rel.image} className="w-full h-full object-cover transition duration-700 group-hover:scale-110"/>
                              <span className="absolute top-3 left-3 bg-white/95 backdrop-blur px-2 py-1 text-xs font-bold rounded uppercase tracking-wider text-gray-900">
                                  {rel.category}
                              </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-400 font-bold uppercase mb-3">
                              <span>{rel.date}</span> • <span>{rel.readTime}</span>
                          </div>
                          <h4 className="font-bold text-xl group-hover:text-[#005871] transition mb-3 leading-tight">
                              {rel.title}
                          </h4>
                          <div className="flex items-center gap-2">
                              <img src={rel.author?.avatar} className="w-6 h-6 rounded-full" alt="author"/>
                              <span className="text-sm text-gray-500 font-medium">{rel.author?.name}</span>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>

    </div>
  );
}