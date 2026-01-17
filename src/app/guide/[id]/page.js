'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  Star, MapPin, ShieldCheck, MessageCircle, Globe, 
  CheckCircle, PlayCircle, Calendar, Award, ThumbsUp, 
  Briefcase, Clock, ChevronRight, UserCheck, Phone, Mail,
  Instagram, Linkedin, Languages, Camera, Navigation, 
  FileText, Video, ArrowRight
} from 'lucide-react';

import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

// --- COMPLEX DATA SIMULATOR ---
const getGuideDetails = (id) => {
    return {
        id: id,
        name: "John Ochieng",
        role: "Certified Cultural Guide",
        tagline: "Unveiling the hidden soul of Nairobi since 2019",
        location: "Nairobi, Kenya",
        rating: 4.98,
        reviews: 142,
        joined: "May 2019",
        verified: true,
        responseRate: "100%",
        responseTime: "under 1 hr",
        languages: [
            { name: "English", level: "Native" },
            { name: "Swahili", level: "Native" },
            { name: "Luo", level: "Fluent" },
            { name: "French", level: "Conversational" }
        ],
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        videoIntro: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?q=80&w=1000",
        bio: "Habari! I am a historian by profession and a traveler at heart. I specialize in showing you the Nairobi that isn't in the guidebooks—from the hidden jazz clubs of Westlands to the authentic street food of Kibera. My tours are safe, inclusive, and deeply researched.",
        stats: {
            tours: 450,
            clients: 1200,
            countries: 35
        },
        portfolio: [
            "https://images.unsplash.com/photo-1547471080-7541d1697052?q=80&w=400",
            "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=400",
            "https://images.unsplash.com/photo-1583069356398-38f325a7d65b?q=80&w=400"
        ],
        services: [
            { 
                id: 1, 
                title: "Virtual Trip Planning", 
                price: 1500, 
                unit: "30 mins", 
                desc: "1-on-1 video call to plan your perfect Kenya itinerary.",
                includes: ["Custom Itinerary PDF", "Safety Tips", "Budgeting Advice"]
            },
            { 
                id: 2, 
                title: "Nairobi Walking Tour", 
                price: 5000, 
                unit: "4 hours", 
                desc: "A deep dive into the history and culture of the city center.",
                includes: ["Market Visits", "Street Food Tasting", "History Walk", "Photography"]
            },
            { 
                id: 3, 
                title: "Full Day City & Park", 
                price: 12000, 
                unit: "8 hours", 
                desc: "Complete guide service including National Park and Giraffe Centre.",
                includes: ["Private Transport", "Park Guiding", "Lunch stops", "Hotel Pickup"]
            }
        ],
        reviewsList: [
            { user: "Sarah M.", date: "Oct 2023", rating: 5, text: "John knows everyone in the city! We skipped every line and ate the best food." },
            { user: "David K.", date: "Sep 2023", rating: 5, text: "The street food tour was the highlight of our trip. John made us feel so safe." }
        ]
    };
};

export default function GuidePage() {
  const params = useParams();
  const [data, setData] = useState(null);
  const [selectedService, setSelectedService] = useState(2);
  const [activeTab, setActiveTab] = useState('services');

  useEffect(() => {
    if (params.id) setData(getGuideDetails(params.id));
  }, [params.id]);

  if (!data) return <div className="min-h-screen bg-black" />;

  const currentService = data.services.find(s => s.id === selectedService);

  return (
    <main className="min-h-screen bg-gray-50 font-sans pb-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
          
          {/* 1. PROFESSIONAL HEADER CARD */}
          <div className="bg-white rounded-[2.5rem] p-0 shadow-sm border border-gray-100 mb-12 relative overflow-hidden">
              {/* Cover Image */}
              <div className="h-48 bg-gradient-to-r from-blue-900 to-blue-600 relative">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                  <div className="absolute bottom-6 right-8 flex gap-3">
                      <button className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white hover:text-blue-600 transition"><Instagram size={20}/></button>
                      <button className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white hover:text-blue-600 transition"><Linkedin size={20}/></button>
                  </div>
              </div>
              
              <div className="px-8 pb-8 md:px-12 md:pb-12">
                  <div className="relative flex flex-col md:flex-row gap-8 items-start -mt-16">
                      
                      {/* Avatar */}
                      <div className="relative shrink-0">
                          <img src={data.image} className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover border-4 border-white shadow-xl" />
                          {data.verified && (
                              <div className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full border-4 border-white shadow-sm" title="Verified Expert">
                                  <ShieldCheck size={24}/>
                              </div>
                          )}
                      </div>

                      {/* Info Block */}
                      <div className="flex-1 mt-16 md:mt-20">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                              <div>
                                  <div className="flex items-center gap-2 mb-1">
                                      <h1 className="text-3xl md:text-4xl font-black text-gray-900">{data.name}</h1>
                                      <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{data.role}</span>
                                  </div>
                                  <p className="text-lg text-gray-500 font-medium mb-4">{data.tagline}</p>
                                  
                                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                      <span className="flex items-center gap-1"><MapPin size={16}/> {data.location}</span>
                                      <span className="flex items-center gap-1"><Clock size={16}/> Responds {data.responseTime}</span>
                                      <span className="flex items-center gap-1"><Briefcase size={16}/> {data.joined}</span>
                                  </div>
                              </div>

                              <div className="flex gap-3 mt-4 md:mt-0">
                                  <button className="border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold text-sm hover:border-black hover:text-black transition">
                                      Save Profile
                                  </button>
                                  <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition shadow-lg flex items-center gap-2">
                                      <MessageCircle size={18}/> Message
                                  </button>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-100">
                      <div className="text-center md:text-left">
                          <p className="text-2xl font-black text-gray-900">{data.rating}</p>
                          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Rating</p>
                      </div>
                      <div className="text-center md:text-left">
                          <p className="text-2xl font-black text-gray-900">{data.stats.tours}+</p>
                          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Tours Led</p>
                      </div>
                      <div className="text-center md:text-left">
                          <p className="text-2xl font-black text-gray-900">{data.stats.clients}+</p>
                          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Happy Clients</p>
                      </div>
                      <div className="text-center md:text-left">
                          <p className="text-2xl font-black text-gray-900">{data.stats.countries}</p>
                          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Nationalities</p>
                      </div>
                  </div>
              </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              
              {/* --- LEFT: TABS & CONTENT --- */}
              <div className="lg:col-span-2 space-y-10">
                  
                  {/* Tabs */}
                  <div className="flex gap-8 border-b border-gray-200">
                      {['About', 'Services', 'Portfolio', 'Reviews'].map((tab) => (
                          <button 
                            key={tab}
                            onClick={() => setActiveTab(tab.toLowerCase())}
                            className={`pb-4 text-sm font-bold transition ${activeTab === tab.toLowerCase() ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-black'}`}
                          >
                              {tab}
                          </button>
                      ))}
                  </div>

                  {/* Dynamic Content */}
                  {activeTab === 'about' && (
                      <div className="animate-in fade-in slide-in-from-bottom-4">
                          <h2 className="text-xl font-bold mb-4">Biography</h2>
                          <p className="text-gray-600 text-lg leading-8 mb-8">{data.bio}</p>
                          
                          <h3 className="font-bold mb-4">Languages</h3>
                          <div className="grid grid-cols-2 gap-4">
                              {data.languages.map((lang) => (
                                  <div key={lang.name} className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100">
                                      <span className="font-medium text-gray-700">{lang.name}</span>
                                      <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded-md">{lang.level}</span>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}

                  {(activeTab === 'services' || activeTab === 'overview') && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                          {data.services.map((service) => (
                              <div 
                                key={service.id} 
                                onClick={() => setSelectedService(service.id)}
                                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-md ${selectedService === service.id ? 'border-blue-600 bg-blue-50/50' : 'border-gray-100 bg-white'}`}
                              >
                                  <div className="flex justify-between items-start mb-2">
                                      <h3 className="font-bold text-lg text-gray-900">{service.title}</h3>
                                      <span className="font-bold text-blue-600">KSh {service.price.toLocaleString()}</span>
                                  </div>
                                  <p className="text-gray-600 text-sm mb-4">{service.desc}</p>
                                  <div className="flex flex-wrap gap-2">
                                      {service.includes.map(inc => (
                                          <span key={inc} className="text-xs bg-white border border-gray-200 px-2 py-1 rounded-md text-gray-500 font-medium">
                                              {inc}
                                          </span>
                                      ))}
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}

                  {activeTab === 'portfolio' && (
                      <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4">
                          <div className="relative h-64 rounded-2xl overflow-hidden group col-span-2">
                              <img src={data.videoIntro} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition">
                                  <PlayCircle size={48} className="text-white fill-white/20"/>
                              </div>
                          </div>
                          {data.portfolio.map((img, i) => (
                              <img key={i} src={img} className="rounded-2xl h-48 w-full object-cover hover:opacity-90 transition" />
                          ))}
                      </div>
                  )}

                  {activeTab === 'reviews' && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                          {data.reviewsList.map((review, i) => (
                              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100">
                                  <div className="flex items-center justify-between mb-3">
                                      <div className="flex items-center gap-3">
                                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
                                              {review.user[0]}
                                          </div>
                                          <div>
                                              <p className="font-bold text-sm">{review.user}</p>
                                              <p className="text-xs text-gray-400">{review.date}</p>
                                          </div>
                                      </div>
                                      <div className="flex gap-0.5">
                                          {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-yellow-400 text-yellow-400"/>)}
                                      </div>
                                  </div>
                                  <p className="text-gray-600 text-sm leading-relaxed">"{review.text}"</p>
                              </div>
                          ))}
                      </div>
                  )}

              </div>

              {/* --- RIGHT: HIRE ME WIDGET --- */}
              <div className="relative">
                  <div className="sticky top-24 bg-white border border-gray-200 shadow-xl rounded-3xl p-6 lg:p-8">
                      
                      <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
                              <span className="text-xs font-bold text-green-600 uppercase tracking-wide">Available Now</span>
                          </div>
                          <span className="text-xs text-gray-400 font-bold">Local Time: 10:45 AM</span>
                      </div>

                      <div className="mb-6 pb-6 border-b border-gray-100">
                          <p className="text-sm text-gray-500 font-medium mb-1">Selected Package</p>
                          <h3 className="text-xl font-black text-gray-900 mb-1">{currentService.title}</h3>
                          <div className="flex items-center justify-between mt-2">
                              <span className="text-3xl font-black text-blue-600">KSh {currentService.price.toLocaleString()}</span>
                              <span className="text-sm font-bold bg-gray-100 px-2 py-1 rounded-md text-gray-600">{currentService.unit}</span>
                          </div>
                      </div>

                      {/* Calendar Widget (Visual Only) */}
                      <div className="mb-6">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Availability</label>
                          <div className="grid grid-cols-5 gap-2 text-center">
                              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((d, i) => (
                                  <div key={d} className={`rounded-lg py-2 border ${i===2 ? 'bg-black text-white border-black' : 'bg-white border-gray-200 text-gray-400'}`}>
                                      <span className="text-[10px] block font-bold">{d}</span>
                                      <span className="text-sm font-bold">{12+i}</span>
                                  </div>
                              ))}
                          </div>
                      </div>

                      <button className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1 flex items-center justify-center gap-2">
                          Request Booking <ArrowRight size={20}/>
                      </button>
                      
                      <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                          <ShieldCheck size={14}/> 100% Satisfaction Guarantee
                      </p>
                  </div>
              </div>

          </div>

      </div>
      
      <Footer />
    </main>
  );
}