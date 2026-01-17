'use client';

import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  Calendar, MapPin, Clock, Share2, Heart, 
  Ticket, User, ChevronLeft, ChevronRight, Minus, Plus, 
  CheckCircle, ShieldCheck, AlertCircle, Play, Music, 
  Info, HelpCircle, Instagram, Twitter
} from 'lucide-react';
import Link from 'next/link';

// --- ADVANCED MOCK DATA ---
const EVENTS_DB = [
  {
    id: '1',
    title: "Nairobi Afro-Jazz Festival",
    tagline: "The Soul of the Savannah",
    date: "Dec 12, 2026",
    time: "14:00 - 23:00",
    location: "Carnivore Grounds, Nairobi",
    price: 2500,
    image: "https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=1600",
    description: "Experience the soulful rhythms of Africa's finest jazz musicians under the stars. This year featuring a fusion of traditional Benga beats with modern sax improvisations.",
    host: { name: "Jazz KE", verified: true, image: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100", followers: "12k" },
    lineup: [
        { name: "Sauti Sol", role: "Headliner", img: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?w=200" },
        { name: "Burna Boy", role: "Special Guest", img: "https://images.unsplash.com/photo-1529335764832-56d1ef634751?w=200" },
        { name: "Femi Kuti", role: "Legend", img: "https://images.unsplash.com/photo-1517230874863-94177f537fb3?w=200" }
    ],
    gallery: [
        "https://images.unsplash.com/photo-1459749411177-0473ef716089?w=400",
        "https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?w=400",
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400"
    ],
    tickets: [
        { type: "Regular", price: 2500, desc: "General entry + 1 drink", remaining: 120 },
        { type: "VIP", price: 5000, desc: "Front row + Lounge access", remaining: 15 },
        { type: "VVIP Group", price: 20000, desc: "Table for 5 + Bottle Service", remaining: 3 }
    ]
  },
  {
    id: '2',
    title: "Swahili Food Expo",
    tagline: "Taste the Coast",
    date: "Dec 18, 2026",
    time: "10:00 - 18:00",
    location: "Mombasa",
    price: 1000,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1600",
    description: "A culinary journey through the Swahili coast.",
    host: { name: "Coastal Vibes", verified: true, image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", followers: "5k" },
    lineup: [],
    gallery: [],
    tickets: [{ type: "Entry Pass", price: 1000, desc: "All you can taste", remaining: 500 }]
  }
];

export default function EventDetailsPage() {
  const params = useParams();
  const event = EVENTS_DB.find(e => e.id === params.id) || EVENTS_DB[0];
  
  const [ticketCounts, setTicketCounts] = useState({});
  const [total, setTotal] = useState(0);
  const [activeTab, setActiveTab] = useState('details');
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll listener for sticky nav
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const updateTicket = (type, price, operation) => {
    setTicketCounts(prev => {
        const current = prev[type] || 0;
        const newCount = operation === 'add' ? current + 1 : Math.max(0, current - 1);
        return { ...prev, [type]: newCount };
    });
  };

  useEffect(() => {
    let newTotal = 0;
    if(event.tickets) {
        event.tickets.forEach(t => newTotal += (ticketCounts[t.type] || 0) * t.price);
    }
    setTotal(newTotal);
  }, [ticketCounts, event]);

  if (!event) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  // Countdown Logic (Visual only for demo)
  const TimeBox = ({ val, label }) => (
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-2 md:p-3 text-center min-w-[70px]">
          <div className="text-2xl md:text-3xl font-black text-white">{val}</div>
          <div className="text-[10px] uppercase tracking-widest text-gray-300">{label}</div>
      </div>
  );

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-black selection:text-white">
      {/* 1. IMMERSIVE HERO */}
      <div className="relative h-[85vh] w-full overflow-hidden bg-black group">
          <img src={event.image} className="w-full h-full object-cover opacity-60 transition duration-[2s] group-hover:scale-105" alt={event.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/60"></div>
          
          <div className="absolute top-0 left-0 w-full z-50">
             <Navbar theme="dark" />
          </div>

          <div className="absolute top-24 left-6 md:left-12 z-20">
              <Link href="/events">
                  <button className="text-white/80 hover:text-white flex items-center gap-2 transition font-medium group">
                      <div className="p-2 bg-white/10 rounded-full group-hover:bg-white/20"><ChevronLeft size={20}/></div>
                      Back to Events
                  </button>
              </Link>
          </div>

          <div className="absolute bottom-0 left-0 w-full p-6 md:p-16 flex flex-col md:flex-row items-end justify-between gap-10">
              <div className="max-w-4xl animate-in slide-in-from-bottom-10 duration-700 fade-in">
                  <div className="flex gap-2 mb-4">
                      <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider animate-pulse">
                          Selling Fast
                      </span>
                      <span className="bg-white/20 backdrop-blur-md border border-white/10 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                          Music
                      </span>
                  </div>
                  <h1 className="text-5xl md:text-8xl font-black text-white mb-6 leading-[0.9] tracking-tight">{event.title}</h1>
                  <p className="text-xl text-gray-300 font-light mb-8 max-w-xl">{event.tagline}</p>
                  
                  <div className="flex flex-wrap gap-6 text-white/90">
                      <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                          <Calendar size={20} className="text-green-400"/> 
                          <span className="font-bold">{event.date}</span>
                      </div>
                      <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                          <MapPin size={20} className="text-red-400"/> 
                          <span className="font-bold">{event.location}</span>
                      </div>
                  </div>
              </div>

              {/* Countdown */}
              <div className="hidden lg:flex gap-2 animate-in slide-in-from-right-10 duration-1000 fade-in">
                  <TimeBox val="14" label="Days" />
                  <TimeBox val="06" label="Hrs" />
                  <TimeBox val="42" label="Mins" />
              </div>
          </div>
      </div>

      {/* 2. STICKY NAV TABS */}
      <div className={`sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200 transition-all ${isScrolled ? 'shadow-md' : ''}`}>
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
              <div className="flex gap-8 overflow-x-auto no-scrollbar">
                  {['Details', 'Lineup', 'Location', 'Updates'].map((tab) => (
                      <button 
                        key={tab}
                        onClick={() => setActiveTab(tab.toLowerCase())}
                        className={`h-16 border-b-2 font-bold text-sm transition whitespace-nowrap px-1 ${activeTab === tab.toLowerCase() ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-black'}`}
                      >
                          {tab}
                      </button>
                  ))}
              </div>
              <div className="hidden md:flex gap-2">
                  <button className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition"><Share2 size={20}/></button>
                  <button className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition"><Heart size={20}/></button>
              </div>
          </div>
      </div>

      {/* 3. MAIN CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* --- LEFT COLUMN (CONTENT) --- */}
          <div className="lg:col-span-8 space-y-16">
              
              {/* About Section */}
              <div id="details" className="scroll-mt-24">
                  <h3 className="text-2xl font-black mb-6 flex items-center gap-2">About the Event <Info size={20} className="text-gray-400"/></h3>
                  <p className="text-gray-600 leading-8 text-lg font-light">
                      {event.description} Join thousands of fans for an unforgettable night. We have partnered with the best sound engineers in Africa to ensure crystal clear audio. Security is paramount, with K9 units and a dedicated safety team on site.
                  </p>
                  
                  {/* Gallery Grid */}
                  {event.gallery.length > 0 && (
                      <div className="grid grid-cols-3 gap-4 mt-8 h-64">
                          <div className="col-span-2 h-full rounded-2xl overflow-hidden relative group">
                              <img src={event.gallery[0]} className="w-full h-full object-cover transition duration-700 group-hover:scale-110"/>
                              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition"></div>
                          </div>
                          <div className="flex flex-col gap-4 h-full">
                              {event.gallery.slice(1).map((img, i) => (
                                  <div key={i} className="h-full rounded-2xl overflow-hidden relative group">
                                      <img src={img} className="w-full h-full object-cover transition duration-700 group-hover:scale-110"/>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}
              </div>

              {/* Lineup Section */}
              {event.lineup && event.lineup.length > 0 && (
                  <div id="lineup" className="scroll-mt-24 pt-8 border-t border-gray-100">
                      <h3 className="text-2xl font-black mb-8 flex items-center gap-2">Star Lineup <Music size={20} className="text-gray-400"/></h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                          {event.lineup.map((artist, i) => (
                              <div key={i} className="group cursor-pointer">
                                  <div className="aspect-square rounded-full overflow-hidden mb-4 border-4 border-transparent group-hover:border-green-400 transition-all shadow-lg relative">
                                      <img src={artist.img} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition duration-500"/>
                                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                          <Play className="fill-white text-white drop-shadow-lg" size={32}/>
                                      </div>
                                  </div>
                                  <div className="text-center">
                                      <h4 className="font-bold text-lg">{artist.name}</h4>
                                      <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">{artist.role}</p>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              )}

              {/* Host Section */}
              <div className="bg-gray-50 rounded-3xl p-8 flex items-center justify-between border border-gray-100">
                  <div className="flex items-center gap-6">
                      <div className="relative">
                          <img src={event.host.image} className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"/>
                          <CheckCircle className="text-blue-500 bg-white rounded-full absolute bottom-0 right-0" size={24}/>
                      </div>
                      <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Organized by</p>
                          <h4 className="text-2xl font-black">{event.host.name}</h4>
                          <p className="text-sm font-medium text-gray-500">{event.host.followers} Followers</p>
                      </div>
                  </div>
                  <div className="flex gap-2">
                      <button className="p-3 bg-white rounded-full border border-gray-200 hover:text-pink-600 transition"><Instagram size={20}/></button>
                      <button className="p-3 bg-white rounded-full border border-gray-200 hover:text-blue-400 transition"><Twitter size={20}/></button>
                  </div>
              </div>

          </div>

          {/* --- RIGHT COLUMN (BOOKING WIDGET) --- */}
          <div className="lg:col-span-4 relative">
              <div className="sticky top-28 space-y-6">
                  
                  {/* Ticket Card */}
                  <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                      <div className="bg-black text-white p-4 text-center">
                          <p className="text-sm font-bold uppercase tracking-widest">Select Tickets</p>
                      </div>
                      
                      <div className="p-6 space-y-6">
                          {event.tickets?.map((ticket, i) => (
                              <div key={i} className={`border rounded-2xl p-4 transition-all duration-300 ${ticketCounts[ticket.type] > 0 ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                  <div className="flex justify-between items-start mb-2">
                                      <div>
                                          <p className="font-black text-gray-900">{ticket.type}</p>
                                          <p className="text-xs text-gray-500 font-medium">{ticket.desc}</p>
                                      </div>
                                      <p className="font-bold text-lg">KSh {ticket.price.toLocaleString()}</p>
                                  </div>
                                  
                                  <div className="flex items-center justify-between mt-4">
                                      <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">{ticket.remaining} left</span>
                                      <div className="flex items-center gap-4 bg-white rounded-lg border border-gray-200 px-2 py-1 shadow-sm">
                                          <button 
                                            onClick={() => updateTicket(ticket.type, ticket.price, 'sub')}
                                            disabled={!ticketCounts[ticket.type]}
                                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black disabled:opacity-30"
                                          >
                                              <Minus size={16}/>
                                          </button>
                                          <span className="font-black w-4 text-center">{ticketCounts[ticket.type] || 0}</span>
                                          <button 
                                            onClick={() => updateTicket(ticket.type, ticket.price, 'add')}
                                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black"
                                          >
                                              <Plus size={16}/>
                                          </button>
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>

                      <div className="bg-gray-50 p-6 border-t border-gray-100">
                          <div className="flex justify-between items-center mb-4 text-gray-500 text-sm">
                              <span>Service Fee</span>
                              <span>KSh {(total * 0.05).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center mb-6">
                              <span className="font-bold text-lg">Total</span>
                              <span className="font-black text-2xl">KSh {(total * 1.05).toLocaleString()}</span>
                          </div>
                          <button className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-gray-900 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group">
                              Get Tickets <ChevronRight size={20} className="group-hover:translate-x-1 transition"/>
                          </button>
                          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400 font-medium">
                              <ShieldCheck size={14} className="text-green-500"/>
                              Secure Checkout via M-Pesa
                          </div>
                      </div>
                  </div>

                  {/* Trust Card */}
                  <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex gap-4 items-start">
                      <AlertCircle className="text-blue-600 mt-1" size={24}/>
                      <div>
                          <h4 className="font-bold text-blue-900">100% Buyer Guarantee</h4>
                          <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                              Get valid tickets to any event or your money back. We protect every transaction.
                          </p>
                      </div>
                  </div>

              </div>
          </div>

      </div>
      <Footer />
    </main>
  );
}