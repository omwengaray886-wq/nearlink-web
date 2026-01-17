'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  Star, Share2, Heart, MapPin, Clock, Utensils, 
  Phone, Globe, ChevronRight, Users, Calendar, 
  CheckCircle, ChefHat, Flame, Wine, Music, 
  Car, Shirt, Volume2, ArrowRight, UtensilsCrossed
} from 'lucide-react';

import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

// --- COMPLEX DATA SIMULATOR ---
const getFoodDetails = (id) => {
    return {
        id: id,
        name: "The Carnivore Experience",
        tagline: "Africa's Greatest Eating Experience",
        location: "Langata, Nairobi",
        cuisine: "African BBQ / Steakhouse",
        priceRange: "$$$",
        rating: { overall: 4.8, food: 4.9, service: 4.7, ambience: 4.8, value: 4.6 },
        reviews: 2150,
        status: "Open Now",
        hours: "12:00 PM - 11:00 PM",
        heroImage: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2500",
        chef: {
            name: "Chef Omondi",
            role: "Head Grill Master",
            quote: "We don't just roast meat; we celebrate the primal connection between fire and flavor.",
            image: "https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=200&h=200&fit=crop"
        },
        description: "A legendary open-air meat specialty restaurant that has become a standard stop on the safari trail. Every type of meat imaginable, including a selection of exotic game meats, is roasted over charcoal and carved at your table.",
        tags: ["Live Music", "Outdoor Seating", "Full Bar", "Smart Casual"],
        logistics: {
            parking: "Valet & Private Lot",
            dressCode: "Smart Casual",
            noiseLevel: "Lively",
            payment: "Cash, Card, MPESA"
        },
        // ✅ FIXED: Added Contact Object to prevent crash
        contact: {
            phone: "+254 711 222 333",
            website: "www.carnivore.co.ke"
        },
        menu: {
            starters: [
                { name: "Crocodile Skewers", desc: "Marinated in garlic butter", price: "KSh 1,200" },
                { name: "Ostrich Carpaccio", desc: "Thinly sliced with parmesan", price: "KSh 1,500" },
                { name: "Soup of the Day", desc: "Ask your waiter", price: "KSh 800" }
            ],
            mains: [
                { name: "The Carnivore Platter", desc: "Unlimited selection of charcoal-roasted meats carved at your table", price: "KSh 4,500" },
                { name: "Prime Aged Steak", desc: "500g T-Bone served with pepper sauce", price: "KSh 3,200" },
                { name: "Grilled Tilapia", desc: "Whole lake fish with ugali", price: "KSh 2,200" }
            ],
            drinks: [
                { name: "Dawa Cocktail", desc: "Vodka, honey, lime, ice", price: "KSh 900" },
                { name: "Tusker Lager", desc: "Local premium beer", price: "KSh 500" },
                { name: "House Red", desc: "South African Shiraz", price: "KSh 800/glass" }
            ]
        },
        gallery: [
            "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800",
            "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800",
            "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800"
        ]
    };
};

export default function FoodPage() {
  const params = useParams();
  const [data, setData] = useState(null);
  const [partySize, setPartySize] = useState(2);
  const [selectedTime, setSelectedTime] = useState(null);
  const [activeMenuTab, setActiveMenuTab] = useState('mains');
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (params.id) setData(getFoodDetails(params.id));
    const handleScroll = () => setIsScrolled(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [params.id]);

  if (!data) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div></div>;

  const RatingBar = ({ label, value }) => (
      <div className="flex items-center justify-between mb-2 text-sm">
          <span className="text-gray-500 w-24 font-medium">{label}</span>
          <div className="flex-1 h-1.5 bg-gray-100 rounded-full mx-3">
              <div className="h-full bg-orange-500 rounded-full" style={{ width: `${(value/5)*100}%` }}></div>
          </div>
          <span className="font-bold text-gray-900">{value}</span>
      </div>
  );

  return (
    <main className="min-h-screen bg-gray-50 font-sans pb-20">
      <Navbar />

      {/* 1. CINEMATIC HERO */}
      <div className="relative h-[65vh] w-full overflow-hidden group">
          <img 
            src={data.heroImage} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
            alt={data.name}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          
          <div className="absolute top-24 right-8 flex gap-4 z-20">
              <button className="bg-white/10 backdrop-blur-md p-3 rounded-full text-white hover:bg-white hover:text-black transition">
                  <Share2 size={20} />
              </button>
              <button className="bg-white/10 backdrop-blur-md p-3 rounded-full text-white hover:bg-white hover:text-red-500 transition">
                  <Heart size={20} />
              </button>
          </div>

          <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 lg:p-24">
              <div className="max-w-5xl">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider shadow-lg">
                          {data.cuisine}
                      </span>
                      <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider border border-white/20">
                          {data.priceRange}
                      </span>
                      <div className="flex items-center gap-1 text-yellow-400 bg-black/60 backdrop-blur-md px-3 py-1 rounded-md border border-white/10">
                          <Star size={14} fill="currentColor"/> 
                          <span className="text-sm font-bold text-white">{data.rating.overall} ({data.reviews})</span>
                      </div>
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight drop-shadow-2xl">
                      {data.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-6 text-gray-200 font-medium text-lg">
                      <span className="flex items-center gap-2"><MapPin size={20} className="text-orange-500"/> {data.location}</span>
                      <span className="hidden md:inline w-1 h-1 bg-gray-500 rounded-full"></span>
                      <span className="flex items-center gap-2"><Clock size={20} className="text-green-400"/> {data.status} · Closes 11 PM</span>
                  </div>
              </div>
          </div>
      </div>

      {/* 2. STICKY NAV */}
      <div className={`sticky top-0 z-40 bg-white border-b border-gray-200 transition-all duration-300 ${isScrolled ? 'translate-y-0 shadow-md' : 'translate-y-0'}`}>
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
              <div className="flex gap-8 text-sm font-bold text-gray-600 overflow-x-auto no-scrollbar">
                  {['Overview', 'Menu', 'Chef', 'Reviews'].map((tab) => (
                      <button 
                        key={tab}
                        onClick={() => setActiveTab(tab.toLowerCase())}
                        className={`h-16 border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.toLowerCase() ? 'border-orange-500 text-orange-500' : 'border-transparent hover:text-black'}`}
                      >
                          {tab}
                      </button>
                  ))}
              </div>
              {isScrolled && (
                  <button className="hidden md:block bg-black text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-gray-800">
                      Reserve Table
                  </button>
              )}
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* --- LEFT COLUMN: CONTENT --- */}
          <div className="lg:col-span-2 space-y-16">
              
              {/* Vibe & Logistics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-12 border-b border-gray-100">
                  <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                      <Shirt className="text-gray-400 mb-2" size={24}/>
                      <p className="text-xs text-gray-400 font-bold uppercase mb-1">Dress Code</p>
                      <p className="font-bold text-gray-900">{data.logistics.dressCode}</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                      <Volume2 className="text-gray-400 mb-2" size={24}/>
                      <p className="text-xs text-gray-400 font-bold uppercase mb-1">Noise Level</p>
                      <p className="font-bold text-gray-900">{data.logistics.noiseLevel}</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                      <Car className="text-gray-400 mb-2" size={24}/>
                      <p className="text-xs text-gray-400 font-bold uppercase mb-1">Parking</p>
                      <p className="font-bold text-gray-900">{data.logistics.parking}</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                      <Utensils className="text-gray-400 mb-2" size={24}/>
                      <p className="text-xs text-gray-400 font-bold uppercase mb-1">Cuisine</p>
                      <p className="font-bold text-gray-900">BBQ / Grill</p>
                  </div>
              </div>

              {/* Description & Story */}
              <div>
                  <h2 className="text-2xl font-bold mb-6 text-gray-900">The Experience</h2>
                  <p className="text-gray-600 leading-8 text-lg mb-8">
                      {data.description}
                  </p>
                  
                  {/* Photo Strip */}
                  <div className="grid grid-cols-3 gap-4 h-48 rounded-2xl overflow-hidden">
                      {data.gallery.map((img, i) => (
                          <div key={i} className="relative group cursor-pointer">
                              <img src={img} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition"></div>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Interactive Menu Section */}
              <div id="menu" className="scroll-mt-24">
                  <div className="flex items-center justify-between mb-8">
                      <h2 className="text-2xl font-bold flex items-center gap-2"><UtensilsCrossed className="text-orange-500"/> Menu Highlights</h2>
                      <div className="flex gap-2">
                          {['starters', 'mains', 'drinks'].map(cat => (
                              <button 
                                key={cat}
                                onClick={() => setActiveMenuTab(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-bold capitalize transition ${activeMenuTab === cat ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                              >
                                  {cat}
                              </button>
                          ))}
                      </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6">
                      {data.menu[activeMenuTab].map((item, i) => (
                          <div key={i} className="flex justify-between items-start border-b border-gray-100 pb-6 last:border-0">
                              <div>
                                  <h4 className="font-bold text-lg text-gray-900 mb-1">{item.name}</h4>
                                  <p className="text-gray-500 text-sm">{item.desc}</p>
                              </div>
                              <span className="font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-lg text-sm whitespace-nowrap">
                                  {item.price}
                              </span>
                          </div>
                      ))}
                  </div>
                  <button className="w-full mt-6 py-3 border border-gray-300 rounded-xl font-bold text-gray-700 hover:border-black hover:text-black transition">
                      Download Full Menu (PDF)
                  </button>
              </div>

              {/* Chef Profile */}
              <div className="bg-gray-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-[80px]"></div>
                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                      <img src={data.chef.image} className="w-32 h-32 rounded-full object-cover border-4 border-white/20" />
                      <div className="text-center md:text-left">
                          <p className="text-orange-400 font-bold tracking-widest text-xs uppercase mb-2">Meet the Chef</p>
                          <h3 className="text-3xl font-bold mb-2">{data.chef.name}</h3>
                          <p className="text-gray-400 mb-6 italic text-lg">"{data.chef.quote}"</p>
                          <div className="flex gap-4 justify-center md:justify-start">
                              <span className="text-xs font-bold bg-white/10 px-3 py-1 rounded-full">15 Yrs Experience</span>
                              <span className="text-xs font-bold bg-white/10 px-3 py-1 rounded-full">Award Winner</span>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Reviews Breakdown */}
              <div id="reviews" className="scroll-mt-24">
                  <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                      <Star className="fill-black"/> {data.rating.overall} · {data.reviews} reviews
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4">
                      <RatingBar label="Food" value={data.rating.food} />
                      <RatingBar label="Service" value={data.rating.service} />
                      <RatingBar label="Ambience" value={data.rating.ambience} />
                      <RatingBar label="Value" value={data.rating.value} />
                  </div>
              </div>

          </div>

          {/* --- RIGHT: COMPLEX BOOKING WIDGET --- */}
          <div className="relative">
              <div className="sticky top-24 bg-white border border-gray-200 shadow-2xl rounded-3xl p-6 lg:p-8">
                  
                  <div className="text-center mb-8">
                      <h3 className="text-2xl font-black text-gray-900 mb-1">Make a Reservation</h3>
                      <p className="text-sm text-gray-500">Free reservation • Instant confirmation</p>
                  </div>

                  {/* Party Size */}
                  <div className="mb-6">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Party Size</label>
                      <div className="flex items-center justify-between bg-gray-50 rounded-xl p-2 border border-gray-200">
                          <button onClick={() => setPartySize(Math.max(1, partySize-1))} className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center hover:bg-gray-100 transition text-gray-700 font-bold">-</button>
                          <span className="font-bold text-gray-900 flex items-center gap-2"><Users size={18}/> {partySize} People</span>
                          <button onClick={() => setPartySize(partySize+1)} className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center hover:bg-gray-100 transition text-gray-700 font-bold">+</button>
                      </div>
                  </div>

                  {/* Date & Time */}
                  <div className="space-y-4 mb-8">
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Date</label>
                          <div className="relative">
                              <input type="date" className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-black focus:border-black block p-3 pl-10 font-bold" />
                              <Calendar className="absolute left-3 top-3 text-gray-400" size={18}/>
                          </div>
                      </div>
                      
                      {/* Seating Area Selection */}
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Seating Area</label>
                          <select className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl p-3 font-bold">
                              <option>Main Dining Hall</option>
                              <option>Terrace (Outdoor)</option>
                              <option>Private Booth (+KSh 1000)</option>
                          </select>
                      </div>

                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Time</label>
                          <div className="grid grid-cols-3 gap-2">
                              {['12:30 PM', '01:00 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM'].map((time) => (
                                  <button 
                                    key={time}
                                    onClick={() => setSelectedTime(time)}
                                    className={`text-xs font-bold py-2 rounded-lg border transition ${selectedTime === time ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-black'}`}
                                  >
                                      {time}
                                  </button>
                              ))}
                          </div>
                      </div>
                  </div>

                  <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1 flex items-center justify-center gap-2">
                      Confirm Table <ArrowRight size={20}/>
                  </button>
                  
                  {/* Contact Info Footer */}
                  <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-4">
                      {/* Safe check for contact info */}
                      {data.contact && (
                        <>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                              <div className="bg-gray-100 p-2 rounded-full"><Phone size={16}/></div>
                              <span className="font-medium">{data.contact.phone}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                              <div className="bg-gray-100 p-2 rounded-full"><Globe size={16}/></div>
                              <span className="font-medium">{data.contact.website}</span>
                          </div>
                        </>
                      )}
                  </div>

              </div>
          </div>

      </div>
      
      <Footer />
    </main>
  );
}