'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
  ShieldCheck, Globe, MapPin, ArrowRight, User, Cpu, 
  Zap, Server, Layers, BarChart, Heart, Fingerprint, 
  Briefcase, Anchor, Code, Database, Lock, Smartphone,
  Home, Compass, Car, CheckCircle, Radio, Leaf, Award, 
  TrendingUp, Users, Newspaper, Play, ChevronDown,
  Terminal, Activity, Quote
} from 'lucide-react';

export default function AboutPage() {
  const [scrollY, setScrollY] = useState(0);
  const [counts, setCounts] = useState({ hosts: 0, guests: 0, cities: 0, valuation: 0 });

  // Scroll Listener
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Counter Logic
  useEffect(() => {
    const duration = 2500;
    const steps = 60;
    const targets = { hosts: 15400, guests: 450000, cities: 42, valuation: 12 };
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = Math.min(currentStep / steps, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCounts({
        hosts: Math.floor(targets.hosts * ease),
        guests: Math.floor(targets.guests * ease),
        cities: Math.floor(targets.cities * ease),
        valuation: Math.floor(targets.valuation * ease)
      });
      if (currentStep >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, []);

  const leadership = [
    { name: "Sarah M.", role: "Chief Operating Officer", prev: "Ex-Uber Africa", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400" },
    { name: "David K.", role: "VP of Engineering", prev: "Ex-Google", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400" },
    { name: "Amina J.", role: "Head of Trust & Safety", prev: "Ex-Airbnb", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400" },
    { name: "John O.", role: "Chief Growth Officer", prev: "Ex-Safaricom", img: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=400" },
  ];

  return (
    <main className="min-h-screen bg-[#050505] font-sans text-white selection:bg-[#005871] selection:text-white">
      {/* Navbar with blur effect */}
      <div className="bg-black/80 backdrop-blur-xl pb-2 shadow-sm sticky top-0 z-50 border-b border-white/10">
          <Navbar theme="dark" />
      </div>

      {/* 1. HERO: THE MANIFESTO (Dark Mode) */}
      <div className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden">
          {/* Animated Mesh Background */}
          <div className="absolute inset-0 opacity-40">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-black to-black"></div>
              <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-[#005871]/10 rounded-full blur-[120px]"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mt-10">
              <div>
                  <div className="inline-flex items-center gap-2 border border-white/20 bg-white/5 rounded-full px-4 py-2 text-xs font-bold text-[#005871] mb-8 uppercase tracking-widest backdrop-blur-md">
                      <Zap size={14} /> The Operating System for Travel
                  </div>
                  <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-[0.95] tracking-tighter">
                      Building the <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
                          Digital Bridge.
                      </span>
                  </h1>
                  <p className="text-xl text-gray-300 max-w-xl leading-relaxed mb-10 border-l-4 border-[#005871] pl-6">
                      NearLink is a technology company connecting the physical world of African hospitality with the digital economy. We don't just find stays; we engineer trust.
                  </p>
                  <div className="flex gap-4">
                      <button className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                          Read the Vision <ArrowRight size={20}/>
                      </button>
                      <button className="px-8 py-4 rounded-full font-bold text-lg text-white border border-white/20 hover:bg-white/10 transition flex items-center gap-2">
                          <Play size={20} className="fill-white"/> Watch Film
                      </button>
                  </div>
              </div>
              <div className="relative hidden lg:block">
                  {/* Abstract 3D Cube/Map Representation */}
                  <div className="w-full aspect-square border border-white/10 rounded-3xl bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm relative p-8 flex items-center justify-center animate-in fade-in slide-in-from-right-10 duration-1000">
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                      <div className="text-center">
                          <Globe size={120} className="text-white mx-auto mb-6 opacity-80 stroke-1"/>
                          <p className="text-2xl font-black tracking-widest">NEARLINK GLOBAL</p>
                          <p className="text-xs text-gray-500 font-mono mt-2">LAT: -1.2921 • LNG: 36.8219</p>
                          <div className="mt-6 flex justify-center gap-2">
                              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                              <span className="text-xs text-green-500 font-mono">LIVE DATA FEED</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          
          <div className="absolute bottom-10 w-full flex justify-center animate-bounce opacity-30">
              <ChevronDown size={32}/>
          </div>
      </div>

      {/* 2. LIVE DATA TICKER */}
      <div className="border-y border-white/10 bg-[#050505] overflow-hidden whitespace-nowrap py-4">
          <div className="inline-block animate-marquee text-xs font-mono text-gray-400">
              <span className="mx-8"><span className="text-green-500">●</span> SYSTEMS OPERATIONAL</span>
              <span className="mx-8">HOST PAYOUTS: <span className="text-white">$14.2M</span></span>
              <span className="mx-8">ACTIVE GUESTS: <span className="text-white">12,402</span></span>
              <span className="mx-8">NEW LISTINGS (24H): <span className="text-green-500">+145</span></span>
              <span className="mx-8">AVG RATING: <span className="text-white">4.88</span></span>
              <span className="mx-8">SECURITY THREATS BLOCKED: <span className="text-white">459</span></span>
              {/* Repeat for visual continuity */}
              <span className="mx-8"><span className="text-green-500">●</span> SYSTEMS OPERATIONAL</span>
              <span className="mx-8">HOST PAYOUTS: <span className="text-white">$14.2M</span></span>
          </div>
      </div>

      {/* 3. FOUNDER PROFILE (ADVANCED LIGHT MODE SECTION) */}
      <div className="py-32 bg-white text-black relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gray-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 -mr-32 -mt-32"></div>
          
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
              
              {/* Image Side (Editorial Style) */}
              <div className="relative group">
                  <div className="absolute top-4 -left-4 w-full h-full border-2 border-black/10 rounded-[2rem]"></div>
                  {/* ✅ Corrected Image File Name */}
                  <img 
                    src="/ceo-brian.png" 
                    className="relative w-full h-[600px] object-cover rounded-[2rem] shadow-2xl filter grayscale group-hover:grayscale-0 transition duration-1000" 
                    alt="Brian Omwenga Onkebo"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1000"; }}
                  />
                  {/* Floating Quote Card */}
                  <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md p-6 rounded-xl border border-gray-200 shadow-xl max-w-xs">
                      <div className="flex items-center gap-3 mb-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Vision Statement</p>
                      </div>
                      <p className="font-serif italic text-gray-800">"We aren't building a travel app. We are building the trust infrastructure for a continent."</p>
                  </div>
              </div>
              
              {/* Text Side */}
              <div>
                  <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-1 bg-black"></div>
                      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">From the Desk of the CEO</h2>
                  </div>
                  
                  <h3 className="text-5xl font-black text-gray-900 mb-8 leading-[1.1]">
                      Solving the <br/>
                      <span className="text-[#005871]">Trust Gap.</span>
                  </h3>
                  
                  <div className="space-y-6 text-lg text-gray-600 leading-relaxed font-serif">
                      <p>
                          "The idea for NearLink was born out of a specific frustration. I saw incredible villas in Diani and hidden cottages in Naivasha that were invisible to the world because existing platforms didn't understand our market."
                      </p>
                      <p>
                          "Silicon Valley builds for credit cards and street addresses. <strong className="text-black font-sans">We build for M-Pesa and geolocation.</strong>"
                      </p>
                      <p>
                          "This isn't just about booking a room. It's about empowering a new generation of African entrepreneurs to monetize their assets safely. We are the operating system for the modern African host."
                      </p>
                  </div>

                  <div className="mt-12 flex items-end justify-between border-t border-gray-200 pt-8">
                      <div>
                          <img src="https://upload.wikimedia.org/wikipedia/commons/e/e4/Signature_sample.svg" className="h-16 opacity-80 mb-2" alt="Signature" />
                          {/* ✅ Corrected Name */}
                          <p className="font-bold text-xl text-black">Brian Omwenga Onkebo</p>
                          <p className="text-sm text-gray-500">Founder & CEO, NearLink</p>
                      </div>
                      <Link href="/press">
                          <button className="flex items-center gap-2 text-sm font-bold border-b-2 border-black pb-1 hover:text-[#005871] transition">
                              Read Full Bio <ArrowRight size={16}/>
                          </button>
                      </Link>
                  </div>
              </div>
          </div>
      </div>

      {/* 4. THE BLUEPRINT (System Architecture - Dark Mode) */}
      <div className="py-32 bg-[#050505] relative border-y border-white/10">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                  <div>
                      <h2 className="text-[#005871] font-bold text-sm uppercase tracking-widest mb-2"><Terminal size={16} className="inline mr-2"/> Engineering First</h2>
                      <h3 className="text-5xl font-black text-white">The NearLink Stack.</h3>
                  </div>
                  <p className="text-gray-400 max-w-md text-sm leading-relaxed text-right">
                      We built our own proprietary infrastructure to handle the unique challenges of the African market: low latency, offline-first, and mobile money native.
                  </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Stack Card 1 */}
                  <div className="bg-[#0f0f0f] border border-white/10 p-8 rounded-xl hover:border-[#005871] transition group">
                      <div className="flex justify-between items-start mb-6">
                          <div className="p-3 bg-blue-900/20 rounded-lg text-blue-400"><Smartphone size={24}/></div>
                          <span className="text-[10px] font-mono text-gray-500 bg-white/5 px-2 py-1 rounded">MOBILE</span>
                      </div>
                      <h4 className="text-xl font-bold mb-2">Flutter & Dart</h4>
                      <p className="text-gray-400 text-xs leading-relaxed mb-4">
                          Single codebase delivering 60fps native performance on iOS and Android. 
                      </p>
                  </div>

                  {/* Stack Card 2 */}
                  <div className="bg-[#0f0f0f] border border-white/10 p-8 rounded-xl hover:border-[#005871] transition group">
                      <div className="flex justify-between items-start mb-6">
                          <div className="p-3 bg-purple-900/20 rounded-lg text-purple-400"><Server size={24}/></div>
                          <span className="text-[10px] font-mono text-gray-500 bg-white/5 px-2 py-1 rounded">CORE</span>
                      </div>
                      <h4 className="text-xl font-bold mb-2">Golang</h4>
                      <p className="text-gray-400 text-xs leading-relaxed mb-4">
                          Microservices handling high-concurrency bookings with zero latency.
                      </p>
                  </div>

                  {/* Stack Card 3 */}
                  <div className="bg-[#0f0f0f] border border-white/10 p-8 rounded-xl hover:border-[#005871] transition group">
                      <div className="flex justify-between items-start mb-6">
                          <div className="p-3 bg-green-900/20 rounded-lg text-green-400"><Database size={24}/></div>
                          <span className="text-[10px] font-mono text-gray-500 bg-white/5 px-2 py-1 rounded">DATA</span>
                      </div>
                      <h4 className="text-xl font-bold mb-2">TensorFlow</h4>
                      <p className="text-gray-400 text-xs leading-relaxed mb-4">
                          AI models for fraud detection and personalized recommendations. 

[Image of neural network diagram]

                      </p>
                  </div>

                  {/* Stack Card 4 */}
                  <div className="bg-[#0f0f0f] border border-white/10 p-8 rounded-xl hover:border-[#005871] transition group">
                      <div className="flex justify-between items-start mb-6">
                          <div className="p-3 bg-orange-900/20 rounded-lg text-orange-400"><Lock size={24}/></div>
                          <span className="text-[10px] font-mono text-gray-500 bg-white/5 px-2 py-1 rounded">SECURITY</span>
                      </div>
                      <h4 className="text-xl font-bold mb-2">Cloudflare</h4>
                      <p className="text-gray-400 text-xs leading-relaxed mb-4">
                          Edge computing ensuring DDOS protection and sub-50ms load times.
                      </p>
                  </div>
              </div>
          </div>
      </div>

      {/* 5. GLOBAL OPERATIONS (Visual Map - Dark Mode) */}
      <div className="py-32 bg-[#050505] relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1">
                  <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 rounded-full px-3 py-1 text-xs font-bold text-gray-400 mb-6">
                      <Activity size={14} className="text-green-500"/> Network Status: Healthy
                  </div>
                  <h2 className="text-4xl font-black mb-6">We are everywhere <br/> you want to be.</h2>
                  <div className="space-y-6">
                      <div className="flex items-center gap-4 p-4 border border-white/5 bg-[#0a0a0a] rounded-xl">
                          <div className="h-10 w-10 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center font-bold">42</div>
                          <div>
                              <p className="font-bold text-white">Active Cities</p>
                              <p className="text-xs text-gray-500">From Nairobi to Cape Town</p>
                          </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 border border-white/5 bg-[#0a0a0a] rounded-xl">
                          <div className="h-10 w-10 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center font-bold">15k</div>
                          <div>
                              <p className="font-bold text-white">Verified Properties</p>
                              <p className="text-xs text-gray-500">Villas, Apartments, Cottages</p>
                          </div>
                      </div>
                  </div>
              </div>
              <div className="flex-1 relative">
                  {/* Abstract Map Visualization */}
                  <div className="relative w-full aspect-video bg-[#0a0a0a] rounded-3xl border border-white/10 p-4 overflow-hidden group">
                      <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/OpenStreetMap_Logo_2011.svg')] opacity-5 grayscale bg-cover bg-center"></div>
                      
                      {/* Pulse Points */}
                      <div className="absolute top-[40%] left-[60%] w-3 h-3 bg-[#005871] rounded-full animate-ping"></div>
                      <div className="absolute top-[40%] left-[60%] w-3 h-3 bg-[#005871] rounded-full border-2 border-black"></div>
                      
                      <div className="absolute top-[70%] left-[55%] w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-700"></div>
                      <div className="absolute top-[30%] left-[50%] w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-1000"></div>

                      <div className="absolute bottom-6 left-6 bg-black/80 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 text-xs font-mono">
                          <p className="text-green-400">● LIVE TRAFFIC</p>
                          <p className="text-white mt-1">1,240 Active Sessions</p>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* 6. ECOSYSTEM (Light Mode) */}
      <div className="py-32 bg-white text-black">
          <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-20">
                  <h2 className="text-sm font-bold text-[#005871] uppercase tracking-widest mb-4">The Super App Strategy</h2>
                  <h3 className="text-5xl font-black mb-6">One Platform. <br/>Infinite Possibilities.</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Stays Card */}
                  <div className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100 hover:shadow-2xl transition duration-500 hover:-translate-y-2 group">
                      <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-8 group-hover:bg-black group-hover:text-white transition">
                          <Home size={32}/>
                      </div>
                      <h4 className="text-2xl font-black mb-4">NearLink Stays</h4>
                      <p className="text-gray-600 leading-relaxed mb-6">
                          From luxury villas in Diani to serviced apartments in Kilimani.
                      </p>
                      <ul className="space-y-2 text-sm font-bold text-gray-500">
                          <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500"/> Instant Booking</li>
                          <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500"/> Verified Hosts</li>
                      </ul>
                  </div>

                  {/* Mobility Card */}
                  <div className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100 hover:shadow-2xl transition duration-500 hover:-translate-y-2 group">
                      <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-8 group-hover:bg-black group-hover:text-white transition">
                          <Car size={32}/>
                      </div>
                      <h4 className="text-2xl font-black mb-4">NearLink Mobility</h4>
                      <p className="text-gray-600 leading-relaxed mb-6">
                          Seamless transit integration. Book verified airport transfers and safari vans.
                      </p>
                      <ul className="space-y-2 text-sm font-bold text-gray-500">
                          <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500"/> Flight Tracking</li>
                          <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500"/> Vetted Drivers</li>
                      </ul>
                  </div>

                  {/* Experiences Card */}
                  <div className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100 hover:shadow-2xl transition duration-500 hover:-translate-y-2 group">
                      <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-8 group-hover:bg-black group-hover:text-white transition">
                          <Compass size={32}/>
                      </div>
                      <h4 className="text-2xl font-black mb-4">NearLink Experiences</h4>
                      <p className="text-gray-600 leading-relaxed mb-6">
                          Connect with local experts for cooking classes, hiking tours, and nightlife.
                      </p>
                      <ul className="space-y-2 text-sm font-bold text-gray-500">
                          <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500"/> Curated Itineraries</li>
                          <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500"/> Local Guides</li>
                      </ul>
                  </div>
              </div>
          </div>
      </div>

      {/* 7. LEADERSHIP TEAM (Light Mode) */}
      <div className="py-24 bg-white text-black border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-4xl font-black mb-16 text-center">Meet the Leadership</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {leadership.map((person, i) => (
                      <div key={i} className="group text-center">
                          <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-2 border-gray-100 group-hover:border-[#005871] transition">
                              <img src={person.img} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition duration-500" alt={person.name} />
                          </div>
                          <h3 className="text-xl font-bold text-black mb-1">{person.name}</h3>
                          <p className="text-[#005871] text-xs font-bold uppercase tracking-widest mb-2">{person.role}</p>
                          <p className="text-gray-500 text-xs">{person.prev}</p>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      {/* 8. SOCIAL IMPACT REPORT (Light Mode) */}
      <div className="py-24 bg-gray-50 text-black border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                  <div className="inline-flex items-center gap-2 border border-black/10 bg-white rounded-full px-4 py-1.5 text-xs font-bold mb-6">
                      <Leaf size={14} /> 2025 Impact Report
                  </div>
                  <h2 className="text-5xl font-black mb-6 leading-tight">Empowering local economies.</h2>
                  <p className="text-xl font-medium text-gray-600 mb-8 leading-relaxed">
                      We believe travel should benefit the people who live there. That's why we take the lowest commission in the industry, keeping more money in local pockets.
                  </p>
                  
                  <div className="space-y-6">
                      <div className="flex gap-4 items-center">
                          <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center font-black text-xl">85%</div>
                          <p className="font-bold text-lg text-gray-800">of booking value stays with the host.</p>
                      </div>
                      <div className="flex gap-4 items-center">
                          <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center font-black text-xl">12k</div>
                          <p className="font-bold text-lg text-gray-800">Jobs supported indirectly across Africa.</p>
                      </div>
                  </div>
              </div>
              <div className="relative h-[500px] bg-black rounded-[3rem] overflow-hidden shadow-2xl">
                  <img src="https://images.unsplash.com/photo-1523821741446-edb2b68bb7a0?q=80&w=1000" className="w-full h-full object-cover opacity-80" alt="Community"/>
                  <div className="absolute bottom-8 left-8 right-8 text-white">
                      <p className="font-bold text-xl mb-2">"NearLink helped me pay for my daughter's university fees."</p>
                      <p className="text-sm opacity-70">— Mama Grace, Superhost in Mombasa</p>
                  </div>
              </div>
          </div>
      </div>

      {/* 9. INVESTOR MARQUEE (Light Mode) */}
      <div className="py-16 bg-white border-t border-gray-200 overflow-hidden">
          <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">Backed By Global Visionaries</p>
          <div className="flex gap-16 items-center justify-center opacity-40 grayscale">
              <span className="text-3xl font-black font-serif">SEQUOIA</span>
              <span className="text-3xl font-black tracking-tight">a16z</span>
              <span className="text-xl font-bold bg-black text-white px-2 py-1">Y Combinator</span>
              <span className="text-2xl font-bold font-mono">Techstars</span>
              <span className="text-2xl font-black">Google<span className="font-light">Ventures</span></span>
          </div>
      </div>

      {/* 10. FINAL CTA (Dark Mode) */}
      <div className="relative py-32 bg-black text-center overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          
          <div className="relative z-10 max-w-4xl mx-auto px-6">
              <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight text-white">
                  Join the revolution.
              </h2>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link href="/host">
                      <button className="bg-[#005871] text-white px-10 py-5 rounded-full font-bold text-xl hover:scale-105 transition shadow-[0_0_40px_rgba(0,255,128,0.3)] flex items-center gap-3 mx-auto">
                          Start Hosting <ArrowRight size={24}/>
                      </button>
                  </Link>
                  <Link href="/search">
                      <button className="bg-white/10 border border-white/20 text-white px-10 py-5 rounded-full font-bold text-xl hover:bg-white hover:text-black transition">
                          Start Exploring
                      </button>
                  </Link>
              </div>
          </div>
      </div>

      <Footer />
    </main>
  );
}