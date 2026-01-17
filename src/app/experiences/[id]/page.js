'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase'; // ✅ Real Firebase Connection
import { doc, getDoc } from 'firebase/firestore';
import BookingWidget from '@/components/BookingWidget'; // ✅ Payment Integration

import { 
  PlayCircle, Clock, MapPin, Star, ShieldCheck, Heart, Share2, 
  ChevronLeft, ChevronRight, CheckCircle, Users, CloudSun, AlertCircle, 
  Camera, Anchor, Coffee, Music, X, Calendar, Ticket, ArrowRight, Wind,
  Languages, Accessibility, Smartphone, HelpCircle, ChevronDown, ChevronUp,
  Award, ThumbsUp, MessageSquare, Loader2
} from 'lucide-react';

import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export default function ExperiencePage() {
  const params = useParams();
  const router = useRouter();
  
  // --- STATE ---
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI State
  const [activeImg, setActiveImg] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedFaq, setExpandedFaq] = useState(0);
  
  // Booking State
  const [ticketCounts, setTicketCounts] = useState(1); // Default 1 person
  const [bookingDate, setBookingDate] = useState("");

  // --- 1. FETCH REAL DATA ---
  useEffect(() => {
    const fetchExperience = async () => {
      if (!params.id) return;
      setIsLoading(true);
      try {
        // ✅ Point to 'activities' collection based on your DB structure
        const docRef = doc(db, "activities", params.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const expData = docSnap.data();
          
          // Map DB fields to UI expected structure with fallbacks
          setData({ 
            id: docSnap.id, 
            ...expData,
            // Ensure gallery exists, fallback to single image or placeholder
            gallery: expData.gallery || [expData.imageUrl || expData.image || "https://images.unsplash.com/photo-1544551763-46a013bb70d5"],
            title: expData.title || expData.category || "Untitled Experience",
            location: expData.location || "Nairobi",
            duration: expData.duration || "Full Day",
            price: Number(expData.price) || 0,
            // Host logic
            host: expData.host || { 
                name: expData.hostname || "NearLink Guide", 
                image: "https://github.com/shadcn.png", 
                role: "Expert Guide", 
                experience: "5 Years",
                about: expData.description ? expData.description.substring(0, 100) + "..." : "Join us for an amazing adventure."
            },
            // Fallbacks for arrays
            itinerary: expData.itinerary || [],
            faqs: expData.faqs || [],
            languages: expData.languages || ["English", "Swahili"],
            rating: expData.rating || { overall: 5.0, guide: 5.0, value: 5.0, safety: 5.0, transport: 5.0 },
            reviews: expData.reviewCount || 0
          });
        } else {
          setError("Experience not found");
        }
      } catch (err) {
        console.error("Error fetching experience:", err);
        setError("Failed to load experience details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExperience();
    
    // Scroll Listener
    const handleScroll = () => setIsScrolled(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [params.id]);

  // --- HANDLER: Secure Booking Click ---
  const handleStickyBookClick = () => {
    if (!auth.currentUser) {
        // Redirect to login if guest
        router.push('/login');
    } else {
        // Scroll to widget if logged in
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // --- 2. LOADING STATE ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-nearlink animate-spin" />
      </div>
    );
  }

  // --- 3. ERROR STATE ---
  if (error || !data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center flex-col gap-4">
        <h2 className="text-2xl font-bold">Oops!</h2>
        <p className="text-gray-500">{error || "Something went wrong."}</p>
        <a href="/" className="bg-black text-white px-6 py-3 rounded-full font-bold">Go Home</a>
      </div>
    );
  }

  const RatingBar = ({ label, value }) => (
      <div className="flex items-center gap-4 text-sm mb-2">
          <span className="w-24 font-medium text-gray-600">{label}</span>
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-black rounded-full" style={{ width: `${(value/5)*100}%` }}></div>
          </div>
          <span className="font-bold text-gray-900">{value ? value.toFixed(1) : "N/A"}</span>
      </div>
  );

  return (
    <main className="min-h-screen bg-white font-sans pb-20">
      
      {/* 1. CINEMATIC HEADER */}
      <div className="relative h-[85vh] w-full overflow-hidden bg-black group">
          <img 
            src={data.gallery[activeImg]} 
            className="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-[3s] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
          
          <div className="absolute top-6 left-0 w-full z-30">
              <Navbar transparent={true} />
          </div>

          <div className="absolute top-24 right-8 flex flex-col gap-4 z-20">
              <button className="bg-white/10 backdrop-blur-md p-3 rounded-full text-white border border-white/20 hover:bg-white hover:text-black transition shadow-lg">
                  <Share2 size={20} />
              </button>
              <button 
                onClick={() => setIsLiked(!isLiked)}
                className={`bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/20 transition shadow-lg ${isLiked ? 'bg-white text-red-500' : 'text-white hover:bg-white hover:text-red-500'}`}
              >
                  <Heart size={20} className={isLiked ? "fill-current" : ""} />
              </button>
          </div>

          <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 z-20 flex flex-col md:flex-row items-end justify-between gap-8">
              <div className="max-w-4xl">
                  <div className="flex items-center gap-3 mb-4">
                      <span className="bg-nearlink text-white text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider shadow-lg">
                          Signature Experience
                      </span>
                      <div className="flex items-center gap-1 text-yellow-400 bg-black/60 backdrop-blur-md px-3 py-1 rounded-md border border-white/10 shadow-lg">
                          <Star size={14} fill="currentColor"/> 
                          <span className="text-sm font-bold text-white">{data.rating.overall} ({data.reviews} reviews)</span>
                      </div>
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight drop-shadow-2xl">
                      {data.title}
                  </h1>
                  <div className="flex items-center gap-6 text-gray-200 font-medium text-lg">
                      <span className="flex items-center gap-2"><MapPin size={20} className="text-nearlink"/> {data.location}</span>
                      <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                      <span className="flex items-center gap-2"><Clock size={20}/> {data.duration}</span>
                  </div>
              </div>

              {/* Gallery Thumbnails (Only show if multiple images exist) */}
              {data.gallery.length > 1 && (
                  <div className="hidden md:flex gap-2 bg-black/40 backdrop-blur-md p-2 rounded-2xl border border-white/10">
                      {data.gallery.slice(0, 4).map((img, i) => (
                          <div 
                            key={i} 
                            onClick={() => setActiveImg(i)}
                            className={`w-20 h-16 rounded-xl overflow-hidden cursor-pointer border-2 transition ${activeImg === i ? 'border-nearlink opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                          >
                              <img src={img} className="w-full h-full object-cover" />
                          </div>
                      ))}
                  </div>
              )}
          </div>
      </div>

      {/* 2. STICKY NAV */}
      <div className={`sticky top-0 z-40 bg-white border-b border-gray-200 transition-all duration-300 ${isScrolled ? 'translate-y-0 shadow-md' : 'translate-y-0'}`}>
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
              <div className="flex gap-8 text-sm font-bold text-gray-600 overflow-x-auto no-scrollbar">
                  {['Overview', 'Itinerary', 'Host', 'Reviews', 'FAQ'].map((tab) => (
                      <button 
                        key={tab}
                        onClick={() => setActiveTab(tab.toLowerCase())}
                        className={`h-16 border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.toLowerCase() ? 'border-nearlink text-nearlink' : 'border-transparent hover:text-black'}`}
                      >
                          {tab}
                      </button>
                  ))}
              </div>
              {isScrolled && (
                  <div className="hidden md:flex items-center gap-4 animate-in fade-in slide-in-from-right-4">
                      <div className="text-right">
                          <p className="font-bold text-sm">From KSh {data.price.toLocaleString()}</p>
                          <div className="flex items-center gap-1 justify-end text-xs text-green-600 font-bold">
                              Available Today
                          </div>
                      </div>
                      <button 
                        onClick={handleStickyBookClick}
                        className="bg-nearlink text-white px-6 py-2 rounded-lg font-bold text-sm shadow-lg hover:bg-nearlink-dark"
                      >
                          Book Now
                      </button>
                  </div>
              )}
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* --- LEFT COLUMN: CONTENT --- */}
          <div className="lg:col-span-2 space-y-12">
              
              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-12 border-b border-gray-100">
                  <div className="flex flex-col gap-1">
                      <Languages className="text-gray-400" size={20}/>
                      <span className="font-bold text-gray-900">Languages</span>
                      <span className="text-xs text-gray-500">{data.languages.join(", ")}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                      <Users className="text-gray-400" size={20}/>
                      <span className="font-bold text-gray-900">Group Size</span>
                      <span className="text-xs text-gray-500">{data.groupSize || "Varies"}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                      <Accessibility className="text-gray-400" size={20}/>
                      <span className="font-bold text-gray-900">Accessibility</span>
                      <span className="text-xs text-gray-500">{data.accessibility || "Contact Host"}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                      <Smartphone className="text-gray-400" size={20}/>
                      <span className="font-bold text-gray-900">Ticket Type</span>
                      <span className="text-xs text-gray-500">{data.ticketType || "Mobile"}</span>
                  </div>
              </div>

              {/* Host Profile */}
              <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 flex flex-col md:flex-row gap-8">
                  <div className="shrink-0 flex flex-col items-center">
                      <div className="relative">
                          <img src={data.host.image} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md" />
                          <div className="absolute bottom-0 right-0 bg-nearlink text-white p-1.5 rounded-full border-2 border-white">
                              <ShieldCheck size={14}/>
                          </div>
                      </div>
                      <div className="mt-3 flex items-center gap-1 text-xs font-bold text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm">
                          <Award size={12} className="text-yellow-500"/> Superhost
                      </div>
                  </div>
                  <div className="flex-1">
                      <h3 className="font-bold text-xl text-gray-900 mb-1">Hosted by {data.host.name}</h3>
                      <p className="text-sm text-gray-500 mb-4">{data.host.role} · {data.host.experience}</p>
                      <p className="text-gray-600 leading-relaxed italic">"{data.host.about}"</p>
                      <button className="mt-4 text-nearlink font-bold text-sm underline">Contact Host</button>
                  </div>
              </div>

              {/* Itinerary Timeline */}
              {data.itinerary && data.itinerary.length > 0 ? (
                <div>
                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-2"><MapPin className="text-nearlink"/> Journey Itinerary</h2>
                    <div className="relative border-l-2 border-dashed border-gray-200 ml-4 space-y-12">
                        {data.itinerary.map((item, i) => (
                            <div key={i} className="relative pl-10 group">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-nearlink group-hover:scale-125 transition shadow-sm"></div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                    <span className="text-xs font-bold text-white bg-black px-3 py-1 rounded-full w-fit shadow-md">
                                        {item.time || `Stop ${i+1}`}
                                    </span>
                                    <h4 className="font-bold text-lg text-gray-900">{item.title}</h4>
                                </div>
                                <p className="text-gray-600 leading-relaxed text-sm bg-white p-4 rounded-xl border border-gray-100 shadow-sm group-hover:border-nearlink/30 transition">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
              ) : (
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
                    <h2 className="text-xl font-bold mb-2">About this Activity</h2>
                    <p className="text-gray-600">{data.description || "No description available."}</p>
                </div>
              )}

              {/* Reviews Section */}
              <div className="border-t border-gray-100 pt-12">
                  <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                      <Star className="fill-black"/> {data.rating.overall} · {data.reviews} reviews
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-10">
                      <RatingBar label="Guide" value={data.rating.guide} />
                      <RatingBar label="Value" value={data.rating.value} />
                      <RatingBar label="Safety" value={data.rating.safety} />
                      <RatingBar label="Transport" value={data.rating.transport} />
                  </div>
              </div>

              {/* FAQ Accordion */}
              {data.faqs && data.faqs.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {data.faqs.map((faq, i) => (
                            <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                                <button 
                                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                                  className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition text-left"
                                >
                                    <span className="font-bold text-gray-800">{faq.q}</span>
                                    {expandedFaq === i ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                                </button>
                                {expandedFaq === i && (
                                    <div className="p-4 bg-white text-gray-600 text-sm leading-relaxed border-t border-gray-200">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
              )}

          </div>

          {/* --- RIGHT: REAL BOOKING WIDGET --- */}
          <div className="relative">
              <div className="sticky top-24">
                  {/* Reuse the BookingWidget component but adapt for activities */}
                  <BookingWidget 
                    property={{...data, type: 'activity'}} // Explicitly set type for payment logic
                    dates={{ 
                        checkIn: bookingDate || "Select Date", // Use state for single-day activity
                        checkOut: bookingDate || "Select Date" 
                    }}
                    guests={ticketCounts}
                  />
                  
                  {/* Simple Date Picker UI */}
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Select Activity Date</label>
                      <input 
                        type="date" 
                        className="w-full p-2 border rounded-lg bg-white font-bold"
                        onChange={(e) => setBookingDate(e.target.value)}
                        // Set min date to today
                        min={new Date().toISOString().split('T')[0]}
                      />
                      
                      <div className="mt-4 flex justify-between items-center bg-white p-2 rounded-lg border">
                          <span className="text-sm font-bold">Guests</span>
                          <div className="flex items-center gap-2">
                              <button onClick={() => setTicketCounts(Math.max(1, ticketCounts-1))} className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">-</button>
                              <span className="text-sm font-bold w-4 text-center">{ticketCounts}</span>
                              <button onClick={() => setTicketCounts(ticketCounts+1)} className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">+</button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

      </div>
      
      <Footer />
    </main>
  );
}