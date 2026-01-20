'use client';

import { useState, useEffect } from 'react';
import { 
  Briefcase, MapPin, Clock, ArrowRight, Heart, Globe, Zap, 
  Search, Check, Copy, Mail, ChevronRight, Users, Coffee, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- 1. DATA: JOBS ---
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

  // Filter Logic
  const filteredJobs = activeTab === "All" 
    ? OPEN_POSITIONS 
    : OPEN_POSITIONS.filter(job => job.department === activeTab);

  // Advanced Email Copy Handler
  const handleCopyEmail = () => {
    navigator.clipboard.writeText("careers@nearlink.co");
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000); // Reset after 2s
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      
      {/* --- HERO SECTION --- */}
      <div className="relative overflow-hidden mb-20">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#005871]/5 rounded-full blur-[100px] -z-10"></div>
         <div className="max-w-4xl mx-auto px-6 text-center pt-10">
            <motion.div 
               initial={{ opacity: 0, y: 20 }} 
               animate={{ opacity: 1, y: 0 }} 
               transition={{ duration: 0.5 }}
            >
                <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-[#005871] text-xs font-bold tracking-widest uppercase mb-6 border border-blue-100">
                    We are hiring
                </span>
                <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tighter leading-tight">
                  Do the best work <br/> of your life.
                </h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                  NearLink is building the operating system for African travel. 
                  Join a team of builders, dreamers, and explorers.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a href="#jobs" className="bg-[#005871] text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 hover:shadow-xl hover:shadow-[#005871]/20 transition-all duration-300 w-full sm:w-auto">
                        View Open Roles
                    </a>
                </div>
            </motion.div>
         </div>
      </div>

      {/* --- VALUES / PERKS --- */}
      <div className="max-w-7xl mx-auto px-6 mb-32">
         <div className="grid md:grid-cols-3 gap-6">
            {BENEFITS.map((item, i) => (
                <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-8 rounded-3xl bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-xl transition-all duration-300 group"
                >
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-900 shadow-sm mb-6 group-hover:scale-110 group-hover:bg-[#005871] group-hover:text-white transition-all duration-300">
                        <item.icon size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                </motion.div>
            ))}
         </div>
      </div>

      {/* --- JOB BOARD SECTION --- */}
      <div id="jobs" className="max-w-5xl mx-auto px-6">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-gray-100 pb-8">
            <h2 className="text-3xl font-bold text-gray-900">Open Positions</h2>
            
            {/* FILTER TABS */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                {DEPARTMENTS.map(dept => (
                    <button 
                        key={dept}
                        onClick={() => setActiveTab(dept)}
                        className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                            activeTab === dept 
                            ? 'bg-black text-white shadow-lg' 
                            : 'bg-white text-gray-500 hover:bg-gray-100'
                        }`}
                    >
                        {dept}
                    </button>
                ))}
            </div>
         </div>

         {/* JOB LIST */}
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
                                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider rounded-md">New</span>
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
                                    <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-[#005871] group-hover:border-[#005871] group-hover:text-white transition-all duration-300">
                                        <ArrowRight size={20}/>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <Search size={24}/>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No roles found</h3>
                        <p className="text-gray-500">Check back later or apply generally below.</p>
                    </div>
                )}
            </AnimatePresence>
         </div>
      </div>

      {/* --- ADVANCED FOOTER: GENERAL APPLICATION --- */}
      <div className="max-w-3xl mx-auto px-6 mt-32 text-center">
         <div className="bg-[#005871] rounded-[40px] p-8 md:p-12 text-white shadow-2xl shadow-[#005871]/30 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] pointer-events-none"></div>
            
            <div className="relative z-10">
                <h3 className="text-3xl font-black mb-4">Don't see your role?</h3>
                <p className="text-white/80 mb-8 max-w-lg mx-auto text-lg">
                    We are always looking for exceptional talent. Send us your portfolio and tell us how you can make an impact.
                </p>

                {/* ADVANCED EMAIL COMPONENT */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <div className="relative group">
                        <button 
                            onClick={handleCopyEmail}
                            className="bg-white text-[#005871] pl-6 pr-14 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all flex items-center gap-3 w-full sm:w-auto relative overflow-hidden"
                        >
                            <Mail size={20} className="shrink-0"/>
                            <span>careers@nearlink.co</span>
                            
                            {/* Copy Icon / Check Icon Animation */}
                            <div className={`absolute right-0 top-0 h-full w-12 flex items-center justify-center border-l border-gray-100 transition-colors ${emailCopied ? 'bg-green-500 text-white' : 'bg-gray-50 text-gray-400'}`}>
                                {emailCopied ? <Check size={20}/> : <Copy size={20}/>}
                            </div>
                        </button>
                        
                        {/* Tooltip Feedback */}
                        {emailCopied && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-bold py-1.5 px-3 rounded-lg shadow-xl whitespace-nowrap"
                            >
                                Copied to clipboard!
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
                            </motion.div>
                        )}
                    </div>
                </div>
                
                <p className="mt-6 text-xs text-white/40 font-medium uppercase tracking-widest">Average response time: 48 Hours</p>
            </div>
         </div>
      </div>

    </div>
  );
}