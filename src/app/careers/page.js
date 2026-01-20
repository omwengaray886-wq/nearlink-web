'use client';

import { useState, useEffect } from 'react';
import { 
  Briefcase, MapPin, Clock, ArrowRight, Heart, Globe, Zap, 
  Search, Check, Copy, Mail, Users, Coffee, Shield, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- 1. DATA CONFIGURATION ---
const OPEN_POSITIONS = [
  {
    id: 1,
    title: "Senior Full Stack Engineer",
    department: "Engineering",
    location: "Nairobi (Hybrid)",
    type: "Full-time",
    salary: "$3k - $5k / mo",
    tags: ["React", "Node.js", "Firebase"]
  },
  {
    id: 2,
    title: "Growth Marketing Lead",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
    salary: "Competitive",
    tags: ["SEO", "User Acquisition", "Data"]
  },
  {
    id: 3,
    title: "Product Designer (UI/UX)",
    department: "Design",
    location: "Nairobi",
    type: "Contract",
    salary: "Project Based",
    tags: ["Figma", "Prototyping"]
  },
  {
    id: 4,
    title: "Partner Success Manager",
    department: "Operations",
    location: "Mombasa",
    type: "Full-time",
    salary: "Competitive",
    tags: ["Onboarding", "Support"]
  }
];

const BENEFITS = [
    { icon: Globe, title: "Remote-First", desc: "Work from home, a cafe, or our Nairobi hub." },
    { icon: Heart, title: "Health Cover", desc: "Comprehensive medical insurance for you and family." },
    { icon: Zap, title: "Latest Gear", desc: "MacBook Pro and noise-canceling headphones provided." },
    { icon: Coffee, title: "Unlimited Off", desc: "We focus on output. Take time when you need it." },
    { icon: Users, title: "Team Retreats", desc: "Quarterly trips to explore our own 'Experiences'." },
    { icon: Shield, title: "Equity Plan", desc: "Own a piece of the company you are building." },
];

const DEPARTMENTS = ["All", "Engineering", "Marketing", "Design", "Operations"];

export default function CareersPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [emailCopied, setEmailCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Filter Jobs
  const filteredJobs = activeTab === "All" 
    ? OPEN_POSITIONS 
    : OPEN_POSITIONS.filter(job => job.department === activeTab);

  // Advanced Clipboard Logic
  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("careers@nearlink.co");
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  // Prevent hydration mismatch
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white">
      
      {/* --- 1. IMMERSIVE HERO SECTION --- */}
      {/* Dark background ensures the White Navbar text is ALWAYS visible */}
      <div className="relative h-[65vh] min-h-[500px] flex items-center justify-center overflow-hidden">
         {/* Background Image */}
         <div className="absolute inset-0 z-0">
             <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80" 
                className="w-full h-full object-cover transform scale-105"
                alt="Team working"
             />
             {/* Gradient Overlays for Readability */}
             <div className="absolute inset-0 bg-black/50"></div>
             <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-white"></div>
         </div>

         {/* Hero Content */}
         <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white mt-16">
            <motion.div 
               initial={{ opacity: 0, y: 30 }} 
               animate={{ opacity: 1, y: 0 }} 
               transition={{ duration: 0.8 }}
            >
                <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-xs font-bold tracking-widest uppercase text-white">We are hiring</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight drop-shadow-lg">
                  Do the best work <br/> of your life.
                </h1>
                
                <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed font-light drop-shadow-md">
                  NearLink is building the operating system for African travel. <br className="hidden md:block"/>
                  Join a team of builders, dreamers, and explorers.
                </p>
                
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => document.getElementById('jobs').scrollIntoView({ behavior: 'smooth' })}
                    className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all flex items-center gap-2 mx-auto"
                >
                    View Open Roles <ArrowRight size={20}/>
                </motion.button>
            </motion.div>
         </div>
      </div>

      {/* --- 2. COMPANY CULTURE (NEW) --- */}
      <div className="max-w-7xl mx-auto px-6 py-24 border-b border-gray-100">
         <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
               <h2 className="text-3xl font-bold mb-6 text-gray-900">Built for impact,<br/>driven by passion.</h2>
               <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  We are not just building an app; we are unlocking the hidden gems of Africa. Our team is a diverse group of engineers, creatives, and operators who care deeply about local communities.
               </p>
               <div className="grid grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-50 rounded-2xl">
                     <div className="text-3xl font-black text-[#005871] mb-1">45%</div>
                     <div className="text-sm text-gray-500 font-medium">Female Leadership</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl">
                     <div className="text-3xl font-black text-[#005871] mb-1">10+</div>
                     <div className="text-sm text-gray-500 font-medium">Countries Represented</div>
                  </div>
               </div>
            </div>
            {/* Culture Grid */}
            <div className="grid grid-cols-2 gap-4">
               <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=500&q=80" className="rounded-2xl w-full h-48 object-cover translate-y-8" alt="Office"/>
               <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=500&q=80" className="rounded-2xl w-full h-48 object-cover" alt="Meeting"/>
               <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=500&q=80" className="rounded-2xl w-full h-48 object-cover translate-y-8" alt="Team"/>
               <img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=500&q=80" className="rounded-2xl w-full h-48 object-cover" alt="Happy"/>
            </div>
         </div>
      </div>

      {/* --- 3. BENEFITS GRID --- */}
      <div className="max-w-7xl mx-auto px-6 py-24 bg-gray-50/50">
         <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Perks & Benefits</h2>
            <p className="text-gray-500 max-w-xl mx-auto">We take care of the details so you can focus on the big picture.</p>
         </div>
         <div className="grid md:grid-cols-3 gap-8">
            {BENEFITS.map((item, i) => (
                <div key={i} className="p-8 rounded-3xl bg-white border border-gray-100 hover:border-[#005871]/30 hover:shadow-xl hover:shadow-[#005871]/5 transition-all duration-300 group cursor-default">
                    <div className="w-14 h-14 bg-blue-50/50 rounded-2xl flex items-center justify-center text-[#005871] shadow-sm mb-6 group-hover:scale-110 group-hover:bg-[#005871] group-hover:text-white transition-all duration-300">
                        <item.icon size={26} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                    <p className="text-gray-500 leading-relaxed text-sm">{item.desc}</p>
                </div>
            ))}
         </div>
      </div>

      {/* --- 4. JOB BOARD (SCROLL ANCHOR ADDED) --- */}
      <div id="jobs" className="max-w-5xl mx-auto px-6 py-24 scroll-mt-20">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-gray-100 pb-8">
            <h2 className="text-3xl font-bold text-gray-900">Open Positions</h2>
            
            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                {DEPARTMENTS.map(dept => (
                    <button 
                        key={dept}
                        onClick={() => setActiveTab(dept)}
                        className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                            activeTab === dept 
                            ? 'bg-black text-white shadow-lg transform scale-105' 
                            : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                        {dept}
                    </button>
                ))}
            </div>
         </div>

         {/* Job Cards */}
         <div className="space-y-4">
            <AnimatePresence mode='wait'>
                {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                        <motion.div 
                            key={job.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="group relative bg-white border border-gray-200 p-6 md:p-8 rounded-3xl hover:border-[#005871] hover:shadow-2xl hover:shadow-[#005871]/10 transition-all duration-300 cursor-pointer overflow-hidden"
                        >
                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider rounded-md border border-green-200">New</span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                                        <span className="flex items-center gap-1.5"><Briefcase size={16}/> {job.department}</span>
                                        <span className="flex items-center gap-1.5"><MapPin size={16}/> {job.location}</span>
                                        <span className="flex items-center gap-1.5"><Clock size={16}/> {job.type}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        {job.tags.map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-md text-xs font-medium text-gray-600">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="hidden md:block text-right">
                                        <span className="block text-sm font-bold text-gray-900">{job.salary}</span>
                                        <span className="text-xs text-gray-400">Estimated</span>
                                    </div>
                                    <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-[#005871] group-hover:border-[#005871] group-hover:text-white transition-all duration-300 shadow-sm bg-white">
                                        <ArrowRight size={20}/>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <Search size={24}/>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No open roles in this department</h3>
                        <p className="text-gray-500">Please apply generally below or check back later.</p>
                    </div>
                )}
            </AnimatePresence>
         </div>
      </div>

      {/* --- 5. INTERACTIVE FOOTER CTA --- */}
      <div className="max-w-4xl mx-auto px-6 pb-24 text-center">
         <div className="bg-[#005871] rounded-[48px] p-8 md:p-16 text-white shadow-2xl shadow-[#005871]/30 relative overflow-hidden group">
            {/* Ambient Background Animation */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-white/15 transition-all duration-1000"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/20 rounded-full blur-[80px] pointer-events-none"></div>
            
            <div className="relative z-10">
                <h3 className="text-3xl md:text-4xl font-black mb-6">Don't see your role?</h3>
                <p className="text-white/80 mb-10 max-w-lg mx-auto text-lg leading-relaxed">
                    We are always looking for exceptional talent. Send us your portfolio and tell us how you can make an impact.
                </p>

                {/* ADVANCED EMAIL BUTTON */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <div className="relative">
                        <button 
                            onClick={handleCopyEmail}
                            className="bg-white text-[#005871] pl-8 pr-16 py-5 rounded-2xl font-bold text-lg hover:bg-blue-50 hover:scale-105 active:scale-95 transition-all flex items-center gap-4 w-full sm:w-auto shadow-xl group/btn overflow-hidden"
                        >
                            <Mail size={24} className="shrink-0 group-hover/btn:scale-110 transition-transform duration-300"/>
                            <span>careers@nearlink.co</span>
                            
                            {/* Animated Status Icon */}
                            <div className={`absolute right-2 top-2 bottom-2 w-12 flex items-center justify-center rounded-xl transition-all duration-300 ${emailCopied ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                <AnimatePresence mode='wait'>
                                    {emailCopied ? (
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                            <Check size={20} strokeWidth={3}/>
                                        </motion.div>
                                    ) : (
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                            <Copy size={20}/>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </button>
                        
                        {/* Floating Tooltip */}
                        <AnimatePresence>
                            {emailCopied && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                    className="absolute -top-14 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-bold py-2 px-4 rounded-xl shadow-xl whitespace-nowrap z-50 pointer-events-none"
                                >
                                    Copied to clipboard!
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-black rotate-45"></div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
         </div>
      </div>

    </div>
  );
}