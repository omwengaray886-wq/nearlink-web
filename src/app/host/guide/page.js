'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState, useRef } from 'react';
import { 
  Lightbulb, Map, TrendingUp, BookOpen, PenTool, 
  Camera, DollarSign, Star, Shield, CheckCircle, 
  Play, ArrowRight, Wrench, BarChart3, Users, 
  Calculator, Download, Lock, Unlock, Zap, ChevronDown,
  Calendar, Award, MessageCircle, Quote, Clock, FileText,
  X, Loader2, PlayCircle, Eye
} from 'lucide-react';

export default function HostGuidePage() {
  const [activeRegion, setActiveRegion] = useState('Nairobi');
  const [calcData, setCalcData] = useState({ location: 'Kilimani', type: '1 Bedroom', occupancy: 75 });
  const [activeModule, setActiveModule] = useState(null);
  
  // --- INTERACTIVE STATES ---
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [notification, setNotification] = useState(null); // { type: 'success'|'loading'|'error', message: '' }
  
  // --- REFS FOR SCROLLING ---
  const marketRef = useRef(null);
  const courseRef = useRef(null);
  const journalRef = useRef(null);

  // --- HELPER FUNCTIONS ---
  const showNotification = (type, message) => {
    setNotification({ type, message });
    if(type !== 'loading') {
        setTimeout(() => setNotification(null), 3000);
    }
  };

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // --- CLICK HANDLERS ---
  const handleEnroll = () => {
    showNotification('loading', 'Processing enrollment...');
    setTimeout(() => {
        setIsEnrolled(true);
        showNotification('success', 'Welcome to the Academy! Access Unlocked.');
    }, 1500);
  };

  const handleDownload = (fileName) => {
    showNotification('loading', `Preparing ${fileName}...`);
    setTimeout(() => {
        showNotification('success', `${fileName} saved to device.`);
    }, 2000);
  };

  const handleLessonPlay = (lessonTitle) => {
    if (!isEnrolled) {
        showNotification('error', 'Please enroll to watch this lesson.');
        // Optional: Scroll to enroll button
        return;
    }
    showNotification('loading', `Loading "${lessonTitle}"...`);
    setTimeout(() => {
        showNotification('success', 'Video playing (Simulated)');
    }, 1000);
  };

  const handleMarketCardClick = (area) => {
    showNotification('loading', `Fetching real-time data for ${area}...`);
    setTimeout(() => {
        showNotification('success', `Data loaded for ${area}`);
    }, 1500);
  };

  const handleTimelineClick = (step) => {
     const tips = {
         "Week 1": "Tip: Focus on lighting for your photos.",
         "Week 2": "Tip: Upload your ID early to speed up verification.",
         "Week 3": "Tip: Send a welcome message 24h before arrival.",
         "Week 4": "Tip: Add your MPesa details in Settings > Payouts."
     };
     showNotification('success', tips[step] || "Keep going!");
  };

  // Advanced Revenue Logic
  const calculateRevenue = () => {
    const baseRates = { 'Studio': 3500, '1 Bedroom': 5500, 'Villa': 15000 };
    const locationMultiplier = { 'Kilimani': 1.2, 'Westlands': 1.4, 'Diani': 1.8, 'Naivasha': 1.5 };
    
    const nightlyRate = baseRates[calcData.type] * (locationMultiplier[calcData.location] || 1);
    const monthlyRevenue = nightlyRate * 30 * (calcData.occupancy / 100);
    
    return Math.floor(monthlyRevenue).toLocaleString();
  };

  // --- DATA ---
  const courses = [
      {
          id: 1,
          title: "Foundation: The Setup",
          duration: "45 min",
          level: "Beginner",
          lessons: ["Target Audience Analysis", "Budgeting for Furnishing", "The 'Wow' Factor Checklist", "WiFi & Workstations"]
      },
      {
          id: 2,
          title: "Operations Mastery",
          duration: "1h 20m",
          level: "Intermediate",
          lessons: ["Automating Check-ins", "Finding Reliable Cleaners", "Inventory Management", "Handling maintenance"]
      },
      {
          id: 3,
          title: "Revenue Management",
          duration: "2h",
          level: "Advanced",
          lessons: ["Dynamic Pricing 101", "Weekend vs Weekday Rates", "Length of Stay Discounts", "Managing Seasonality"]
      }
  ];

  const quotes = [
      {
          text: "I was hesitant to list my guest wing, fearing safety issues. NearLink's verification system gave me peace of mind. Now, that 'extra space' pays my children's school fees.",
          author: "Mama Grace",
          role: "Host since 2024",
          loc: "Nairobi, Kilimani"
      },
      {
          text: "The difference between a hobby and a business is data. Using the Market Intelligence tool, I realized Diani had a shortage of 'Work-from-home' villas. I pivoted my renovation and doubled my bookings.",
          author: "David O.",
          role: "Superhost",
          loc: "Diani Beach"
      }
  ];

  const articles = [
      {
          id: 1,
          slug: "regulations-2026",
          category: "Regulations",
          title: "New Short-Term Rental Laws in Kenya: What You Need to Know (2026 Update)",
          readTime: "8 min read",
          date: "Jan 14, 2026",
          image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800",
          excerpt: "The tourism regulatory authority has released new guidelines for Airbnb and NearLink hosts. Are you compliant?"
      },
      {
          id: 2,
          slug: "afro-minimalist-design",
          category: "Interior Design",
          title: "The 'Afro-Minimalist' Trend: Designing for the Modern Traveler",
          readTime: "5 min read",
          date: "Jan 10, 2026",
          image: "https://images.unsplash.com/photo-1593696140826-c58b5e636894?q=80&w=800",
          excerpt: "How to use local fabrics and materials to create a space that feels authentic yet modern."
      },
      {
          id: 3,
          slug: "tax-101-kenya",
          category: "Finance",
          title: "Tax 101 for Kenyan Hosts: Filing Returns on Rental Income",
          readTime: "12 min read",
          date: "Jan 05, 2026",
          image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800",
          excerpt: "A step-by-step guide to declaring your NearLink income on iTax without getting a headache."
      }
  ];

  return (
    <main className="min-h-screen bg-[#F5F7F9] font-sans text-gray-900 selection:bg-[#005871] selection:text-black">
      <div className="bg-black pb-2 shadow-sm sticky top-0 z-50 border-b border-white/10">
         <Navbar theme="dark" />
      </div>

      {/* --- NOTIFICATION TOAST --- */}
      {notification && (
        <div className="fixed top-24 right-6 z-[100] animate-in slide-in-from-right-10 duration-300">
            <div className={`bg-white border shadow-2xl rounded-2xl p-4 flex items-center gap-4 min-w-[300px] ${notification.type === 'error' ? 'border-red-200' : 'border-gray-100'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notification.type === 'loading' ? 'bg-blue-50 text-blue-500' : notification.type === 'error' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                    {notification.type === 'loading' ? <Loader2 size={20} className="animate-spin"/> : notification.type === 'error' ? <X size={20}/> : <CheckCircle size={20}/>}
                </div>
                <div>
                    <h4 className="font-bold text-sm">{notification.type === 'loading' ? 'Please wait' : notification.type === 'error' ? 'Action Required' : 'Success'}</h4>
                    <p className="text-xs text-gray-500">{notification.message}</p>
                </div>
                <button onClick={() => setNotification(null)} className="ml-auto text-gray-400 hover:text-black">
                    <X size={16}/>
                </button>
            </div>
        </div>
      )}

      {/* 1. HERO: THE MASTERY CENTER */}
      <div className="relative bg-[#050505] text-white pt-24 pb-48 overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#005871]/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
              <div className="inline-flex items-center gap-2 border border-white/20 bg-white/5 rounded-full px-4 py-2 text-xs font-bold text-[#005871] mb-8 uppercase tracking-widest backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <BookOpen size={14} /> NearLink University
              </div>
              <h1 className="text-5xl md:text-8xl font-black mb-8 leading-tight tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
                  Turn your space into <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#005871] via-white to-[#005871] animate-pulse">a business empire.</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
                  Access proprietary market data, masterclass courses, and the tools used by the top 1% of Superhosts in Africa.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                  <button 
                    onClick={() => scrollToSection(courseRef)}
                    className="bg-[#005871] text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition shadow-[0_0_30px_rgba(0,255,128,0.3)] flex items-center justify-center gap-2"
                  >
                      Start Free Course <Play size={20} fill="white"/>
                  </button>
                  <button 
                    onClick={() => scrollToSection(marketRef)}
                    className="bg-white/10 border border-white/20 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-black transition"
                  >
                      View Market Data
                  </button>
              </div>
          </div>
      </div>

      {/* 2. ADVANCED INVESTMENT CALCULATOR */}
      <div className="relative -mt-32 z-20 max-w-6xl mx-auto px-6 mb-24">
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-gray-100 flex flex-col lg:flex-row gap-12">
              
              <div className="flex-1 space-y-8">
                  <div>
                      <h3 className="text-3xl font-black flex items-center gap-3 mb-2"><Calculator className="text-[#005871]"/> ROI Calculator</h3>
                      <p className="text-gray-500">Project your earnings based on live market rates.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Location</label>
                          <select 
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 font-bold focus:ring-2 focus:ring-[#005871] outline-none transition"
                            onChange={(e) => setCalcData({...calcData, location: e.target.value})}
                          >
                              <option value="Kilimani">Nairobi - Kilimani</option>
                              <option value="Westlands">Nairobi - Westlands</option>
                              <option value="Diani">Coast - Diani Beach</option>
                              <option value="Naivasha">Rift Valley - Naivasha</option>
                          </select>
                      </div>
                      <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Property Type</label>
                          <select 
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 font-bold focus:ring-2 focus:ring-[#005871] outline-none transition"
                            onChange={(e) => setCalcData({...calcData, type: e.target.value})}
                          >
                              <option value="1 Bedroom">Entire Apartment (1 Bedroom)</option>
                              <option value="Studio">Studio / Guest Wing</option>
                              <option value="Villa">Holiday Villa (3+ Bedrooms)</option>
                          </select>
                      </div>
                  </div>

                  <div className="space-y-4">
                      <div className="flex justify-between">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Projected Occupancy</label>
                          <span className="font-bold text-[#005871]">{calcData.occupancy}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="30" 
                        max="100" 
                        value={calcData.occupancy} 
                        onChange={(e) => setCalcData({...calcData, occupancy: e.target.value})}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#005871]"
                      />
                      <div className="flex justify-between text-xs text-gray-400">
                          <span>Conservative (30%)</span>
                          <span>Aggressive (100%)</span>
                      </div>
                  </div>
              </div>

              <div className="flex-1 bg-[#0a0a0a] text-white rounded-3xl p-10 flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#005871]/20 rounded-full blur-[80px] group-hover:bg-[#005871]/30 transition duration-1000"></div>
                  
                  <div>
                      <p className="text-gray-400 font-medium mb-1">Monthly Potential</p>
                      <h2 className="text-6xl font-black text-white mb-4">KES {calculateRevenue()}</h2>
                      <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-3 py-1 rounded-lg text-xs font-bold">
                          <TrendingUp size={14}/> Top 10% Performance
                      </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/10">
                      <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Low Season</p>
                          <p className="text-xl font-bold text-gray-300">KES {(parseInt(calculateRevenue().replace(/,/g, '')) * 0.7).toLocaleString()}</p>
                      </div>
                      <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Peak Season</p>
                          <p className="text-xl font-bold text-[#005871]">KES {(parseInt(calculateRevenue().replace(/,/g, '')) * 1.4).toLocaleString()}</p>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* 3. MOTIVATION & QUOTES WALL */}
      <div className="py-24 bg-gray-50 border-t border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                  <div className="inline-flex items-center gap-2 border border-gray-200 bg-gray-50 rounded-full px-4 py-2 text-xs font-bold text-gray-500 mb-6">
                      <Star size={14} className="fill-yellow-400 text-yellow-400" /> Success Stories
                  </div>
                  <h2 className="text-4xl font-black mb-4">Why we do what we do.</h2>
                  <p className="text-gray-600 max-w-xl mx-auto">Join a community of thousands of hosts who are reshaping the African hospitality landscape.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {quotes.map((quote, i) => (
                      <div key={i} className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 relative hover:-translate-y-2 transition duration-500 cursor-default">
                          <Quote size={48} className="text-gray-200 absolute top-8 right-8"/>
                          <p className="text-lg font-medium text-gray-700 italic mb-8 leading-relaxed relative z-10">"{quote.text}"</p>
                          <div className="flex items-center gap-4 mt-auto">
                              <div className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                                  {quote.author.charAt(0)}
                              </div>
                              <div>
                                  <h4 className="font-bold text-lg text-gray-900">{quote.author}</h4>
                                  <div className="flex items-center gap-2 text-xs text-gray-500 font-bold uppercase tracking-wider">
                                      <span>{quote.role}</span> • <span className="text-[#005871]">{quote.loc}</span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      {/* 4. MARKET INTELLIGENCE (TABBED) */}
      <div ref={marketRef} className="py-24 max-w-7xl mx-auto px-6 scroll-mt-24">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                  <h2 className="text-4xl font-black mb-4">Where to Invest?</h2>
                  <p className="text-gray-600 max-w-xl">Real-time data from the NearLink platform showing traveler search trends.</p>
              </div>
              <div className="flex bg-white p-1 rounded-full border border-gray-200 shadow-sm">
                  {['Nairobi', 'Coast', 'Upcountry'].map(region => (
                      <button 
                        key={region}
                        onClick={() => setActiveRegion(region)}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition ${activeRegion === region ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}
                      >
                          {region}
                      </button>
                  ))}
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((item, i) => {
                  const areaName = activeRegion === 'Nairobi' ? (i === 0 ? 'Kilimani' : i === 1 ? 'Westlands' : 'South B') :
                                   activeRegion === 'Coast' ? (i === 0 ? 'Diani Beach' : i === 1 ? 'Nyali' : 'Watamu') :
                                   (i === 0 ? 'Naivasha' : i === 1 ? 'Nakuru' : 'Nanyuki');
                  return (
                      <div 
                        key={i} 
                        onClick={() => handleMarketCardClick(areaName)}
                        className="bg-white p-8 rounded-3xl border border-gray-100 hover:shadow-xl hover:border-[#005871]/50 transition duration-300 group cursor-pointer"
                      >
                          <div className="flex justify-between items-start mb-6">
                              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black text-xl group-hover:scale-110 transition">
                                  {i + 1}
                              </div>
                              <span className={`text-xs font-bold px-2 py-1 rounded ${i === 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                  {i === 0 ? 'TOP PICK' : 'STEADY'}
                              </span>
                          </div>
                          <h3 className="text-xl font-black mb-1 flex items-center gap-2">
                              {areaName} <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition"/>
                          </h3>
                          <p className="text-sm text-gray-500 mb-6">
                              {i === 0 ? 'High yield, consistent business travelers.' : 'Seasonal peaks, great for holiday homes.'}
                          </p>
                          <div className="space-y-4">
                              <div>
                                  <div className="flex justify-between text-xs font-bold mb-1">
                                      <span>Demand Score</span><span>{90 - (i * 10)}/100</span>
                                  </div>
                                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                      <div className="bg-black h-full transition-all duration-1000" style={{width: `${90 - (i * 10)}%`}}></div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  );
              })}
          </div>
      </div>

      {/* 5. HOST JOURNEY TIMELINE */}
      <div className="py-24 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                  <h2 className="text-4xl font-black mb-4">Your Roadmap to Success</h2>
                  <p className="text-gray-600">The typical journey of a NearLink host, from idea to first payout.</p>
              </div>

              <div className="relative">
                  <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0"></div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                      {[
                          { icon: Lightbulb, title: "Week 1", sub: "Setup", desc: "Furnishing & Listing" },
                          { icon: CheckCircle, title: "Week 2", sub: "Verify", desc: "Identity Check" },
                          { icon: Calendar, title: "Week 3", sub: "Booking", desc: "First Guest Arrival" },
                          { icon: DollarSign, title: "Week 4", sub: "Payout", desc: "Revenue to M-Pesa" }
                      ].map((step, i) => (
                          <div 
                            key={i} 
                            onClick={() => handleTimelineClick(step.title)}
                            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center group hover:-translate-y-2 transition duration-300 cursor-pointer hover:border-[#005871]"
                          >
                              <div className="w-16 h-16 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#005871] group-hover:text-white transition shadow-sm border border-gray-100">
                                  <step.icon size={28}/>
                              </div>
                              <h4 className="font-bold text-lg mb-0.5">{step.title}: {step.sub}</h4>
                              <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </div>

      {/* 6. EXPANDABLE COURSE CURRICULUM (LMS) */}
      <div ref={courseRef} className="py-24 bg-[#111] text-white scroll-mt-24">
          <div className="max-w-5xl mx-auto px-6">
              <div className="flex items-center justify-between mb-12">
                  <div>
                      <h2 className="text-4xl font-black mb-2">Masterclass Curriculum</h2>
                      <p className="text-gray-400">Practical knowledge you can apply immediately.</p>
                  </div>
                  <button 
                    onClick={handleEnroll}
                    disabled={isEnrolled}
                    className={`hidden md:flex px-6 py-3 rounded-xl font-bold items-center gap-2 transition ${isEnrolled ? 'bg-green-500 text-white cursor-default' : 'bg-white text-black hover:bg-gray-200'}`}
                  >
                      {isEnrolled ? (
                          <><CheckCircle size={18}/> Enrolled</>
                      ) : (
                          <>Enroll All <ArrowRight size={18}/></>
                      )}
                  </button>
              </div>

              <div className="space-y-4">
                  {courses.map((course) => (
                      <div key={course.id} className="border border-white/10 rounded-2xl bg-[#151515] overflow-hidden transition-all duration-300 hover:border-[#005871]/30">
                          <button 
                            onClick={() => setActiveModule(activeModule === course.id ? null : course.id)}
                            className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition"
                          >
                              <div className="flex items-center gap-6">
                                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl transition ${isEnrolled ? 'bg-green-500/20 text-green-500' : 'bg-white/10 text-[#005871]'}`}>
                                      {isEnrolled ? <Unlock size={18}/> : course.id}
                                  </div>
                                  <div className="text-left">
                                      <h4 className="font-bold text-xl text-white">{course.title}</h4>
                                      <div className="flex gap-4 text-xs text-gray-500 mt-1">
                                          <span className="flex items-center gap-1"><Clock size={12}/> {course.duration}</span>
                                          <span className="flex items-center gap-1"><BarChart3 size={12}/> {course.level}</span>
                                      </div>
                                  </div>
                              </div>
                              <div className={`transform transition duration-300 ${activeModule === course.id ? 'rotate-180' : ''}`}>
                                  <ChevronDown size={24} className="text-gray-500"/>
                              </div>
                          </button>

                          {activeModule === course.id && (
                              <div className="border-t border-white/10 bg-black/50 p-6 animate-in slide-in-from-top-2">
                                  <ul className="space-y-3">
                                      {course.lessons.map((lesson, idx) => (
                                          <li 
                                            key={idx} 
                                            onClick={() => handleLessonPlay(lesson)}
                                            className="flex items-center gap-4 text-gray-400 hover:text-white transition cursor-pointer group p-2 rounded hover:bg-white/5"
                                          >
                                              <div className={`w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center transition ${isEnrolled ? 'group-hover:border-[#005871] group-hover:bg-[#005871] group-hover:text-black' : 'group-hover:border-white'}`}>
                                                  {isEnrolled ? <Play size={12} className="fill-current"/> : <Lock size={12}/>}
                                              </div>
                                              <span className="font-medium text-sm">{lesson}</span>
                                              <span className="ml-auto text-xs border border-white/10 px-2 py-1 rounded text-gray-500">10 min</span>
                                          </li>
                                      ))}
                                  </ul>
                                  {!isEnrolled && (
                                      <div className="mt-6 p-4 bg-[#005871]/10 border border-[#005871]/20 rounded-xl flex items-center justify-between">
                                          <span className="text-sm font-bold text-[#005871] flex items-center gap-2"><Lock size={14}/> Unlock full access to watch</span>
                                          <button onClick={handleEnroll} className="text-xs font-bold bg-[#005871] text-black px-4 py-2 rounded-lg hover:bg-white transition">Unlock Now</button>
                                      </div>
                                  )}
                              </div>
                          )}
                      </div>
                  ))}
              </div>
          </div>
      </div>

      {/* 7. HOST JOURNAL (READING SECTION) */}
      <div ref={journalRef} className="py-24 bg-white border-t border-gray-100 scroll-mt-24">
          <div className="max-w-7xl mx-auto px-6">
              <div className="flex justify-between items-end mb-12">
                  <div>
                      <div className="inline-flex items-center gap-2 border border-gray-200 bg-gray-50 rounded-full px-3 py-1 text-xs font-bold text-gray-500 mb-4">
                          <FileText size={14}/> The Host Journal
                      </div>
                      <h2 className="text-4xl font-black mb-2">Read, Learn, Grow.</h2>
                      <p className="text-gray-600">Deep dives into regulations, design, and hospitality trends.</p>
                  </div>
                  <Link href="/host/guide/archive" className="text-sm font-bold text-[#005871] flex items-center gap-2 hover:underline">
                      View all articles <ArrowRight size={16}/>
                  </Link>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="group cursor-pointer">
                      <Link href={`/host/guide/${articles[0].slug}`}>
                          <div className="aspect-[4/3] rounded-3xl overflow-hidden mb-6 relative">
                              <img src={articles[0].image} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" alt="Featured"/>
                              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition"></div>
                              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-gray-200">
                                  {articles[0].category}
                              </div>
                          </div>
                          <h3 className="text-3xl font-black mb-3 group-hover:text-[#005871] transition">{articles[0].title}</h3>
                          <p className="text-gray-500 mb-4 line-clamp-2 leading-relaxed">{articles[0].excerpt}</p>
                          <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                              <span>{articles[0].readTime}</span>
                              <span>•</span>
                              <span>{articles[0].date}</span>
                          </div>
                      </Link>
                  </div>

                  <div className="flex flex-col gap-8">
                      {articles.slice(1).map((article, i) => (
                          <Link href={`/host/guide/${article.slug}`} key={i} className="flex gap-6 group cursor-pointer border-b border-gray-100 pb-8 last:border-0 last:pb-0">
                              <div className="w-32 h-32 rounded-2xl overflow-hidden shrink-0 relative">
                                  <img src={article.image} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" alt="Article"/>
                              </div>
                              <div>
                                  <div className="text-xs font-bold text-[#005871] uppercase tracking-wider mb-2">{article.category}</div>
                                  <h4 className="text-xl font-bold mb-2 leading-tight group-hover:text-[#005871] transition">{article.title}</h4>
                                  <div className="flex items-center gap-2 text-xs text-gray-400">
                                      <Clock size={12}/> {article.readTime}
                                  </div>
                              </div>
                          </Link>
                      ))}
                  </div>
              </div>
          </div>
      </div>

      {/* 8. DOWNLOADABLE TOOLKIT */}
      <div className="py-24 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
              <div className="bg-[#005871]/5 rounded-[3rem] p-12 md:p-20 relative overflow-hidden border border-[#005871]/10">
                  <div className="relative z-10">
                      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                          <div>
                              <h2 className="text-4xl font-black mb-4 text-gray-900">Host Toolkit</h2>
                              <p className="text-gray-600 max-w-lg">Don't reinvent the wheel. Download the exact templates and scripts used by Superhosts.</p>
                          </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                          {[
                              { icon: Zap, title: "House Manual", type: "PDF Template", color: "red" },
                              { icon: CheckCircle, title: "Cleaning Checklist", type: "Excel Sheet", color: "blue" },
                              { icon: Shield, title: "Inventory List", type: "Google Sheet", color: "purple" },
                              { icon: MessageCircle, title: "Response Scripts", type: "Word Doc", color: "orange" }
                          ].map((item, i) => (
                              <div 
                                key={i} 
                                onClick={() => handleDownload(item.title)}
                                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 cursor-pointer border border-gray-100 group"
                              >
                                  <div className={`w-12 h-12 bg-${item.color}-50 text-${item.color}-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
                                      <item.icon size={24}/>
                                  </div>
                                  <h4 className="font-bold text-lg mb-1 text-gray-900">{item.title}</h4>
                                  <p className="text-xs text-gray-500 mb-6 font-medium bg-gray-100 inline-block px-2 py-1 rounded">{item.type}</p>
                                  <button className="w-full py-2 border border-gray-200 rounded-lg text-xs font-bold flex items-center justify-center gap-2 group-hover:bg-black group-hover:text-white transition">
                                      <Download size={14}/> Download Now
                                  </button>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <Footer />
    </main>
  );
}