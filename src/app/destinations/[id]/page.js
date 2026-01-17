'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  MapPin, Sun, CloudRain, Wind, Calendar, DollarSign, Languages, 
  ArrowRight, Star, Heart, Share2, PlayCircle, Info
} from 'lucide-react';

import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

// --- DATA SIMULATOR ---
const getDestinationData = (id) => {
    return {
        id: id,
        name: "Nairobi",
        country: "Kenya",
        tagline: "The Green City in the Sun",
        description: "A vibrant metropolis that serves as the gateway to East Africa. Nairobi is the only capital city in the world with a national park within its borders. From the Giraffe Centre to the bustling Maasai Markets, it offers a unique blend of urban energy and wildlife.",
        stats: {
            currency: "KES (Shilling)",
            language: "Swahili, English",
            bestTime: "June - Oct",
            temp: "24°C"
        },
        heroImage: "https://images.unsplash.com/photo-1621257297928-1444d3209226?q=80&w=2500", // Nairobi Skyline
        images: [
            "https://images.unsplash.com/photo-1547471080-7541d1697052?q=80&w=800", // Giraffe
            "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=800", // Park
            "https://images.unsplash.com/photo-1583069356398-38f325a7d65b?q=80&w=800"  // City
        ],
        topStays: [
            { id: "s1", title: "Hemingways Nairobi", price: "45,000", rating: 4.9, img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600" },
            { id: "s2", title: "Giraffe Manor", price: "120,000", rating: 5.0, img: "https://images.unsplash.com/photo-1547471080-7541d1697052?q=80&w=600" },
            { id: "s3", title: "Tree House Karen", price: "15,000", rating: 4.7, img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=600" }
        ],
        topExperiences: [
            { id: "e1", title: "Nairobi National Park", price: "4,000", rating: 4.8, img: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=600" },
            { id: "e2", title: "David Sheldrick Trust", price: "1,500", rating: 4.9, img: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=80&w=600" }
        ]
    };
};

export default function DestinationPage() {
  const params = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (params.id) setData(getDestinationData(params.id));
  }, [params.id]);

  if (!data) return <div className="min-h-screen bg-black" />;

  return (
    <main className="min-h-screen bg-white font-sans pb-20">
      <Navbar />

      {/* 1. MASSIVE HERO HEADER */}
      <div className="relative h-[60vh] w-full overflow-hidden">
          <img 
            src={data.heroImage} 
            className="absolute inset-0 w-full h-full object-cover"
            alt={data.name}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/30"></div>
          
          <div className="absolute top-24 right-8 flex gap-4">
              <button className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-white hover:text-black transition">
                  <Share2 size={20} />
              </button>
              <button className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-white hover:text-red-500 transition">
                  <Heart size={20} />
              </button>
          </div>

          <div className="absolute bottom-0 left-0 w-full p-8 md:p-20">
              <div className="max-w-4xl">
                  <div className="flex items-center gap-2 mb-4 text-gray-900">
                      <MapPin size={20} className="text-nearlink"/>
                      <span className="font-bold tracking-widest uppercase">{data.country}</span>
                  </div>
                  <h1 className="text-6xl md:text-8xl font-black text-gray-900 mb-6 tracking-tighter">
                      {data.name}
                  </h1>
                  <p className="text-xl text-gray-600 max-w-2xl font-medium leading-relaxed">
                      {data.tagline}
                  </p>
              </div>
          </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-3 gap-16 -mt-10 relative z-10">
          
          {/* --- LEFT: STATS & INFO --- */}
          <div className="lg:col-span-2 space-y-16">
              
              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex flex-col gap-2">
                      <Sun className="text-orange-500" size={24}/>
                      <div>
                          <p className="text-xs text-gray-400 font-bold uppercase">Weather</p>
                          <p className="font-bold text-lg">{data.stats.temp}</p>
                      </div>
                  </div>
                  <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex flex-col gap-2">
                      <Calendar className="text-blue-500" size={24}/>
                      <div>
                          <p className="text-xs text-gray-400 font-bold uppercase">Best Time</p>
                          <p className="font-bold text-lg">{data.stats.bestTime}</p>
                      </div>
                  </div>
                  <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex flex-col gap-2">
                      <DollarSign className="text-green-500" size={24}/>
                      <div>
                          <p className="text-xs text-gray-400 font-bold uppercase">Currency</p>
                          <p className="font-bold text-lg">KES</p>
                      </div>
                  </div>
                  <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex flex-col gap-2">
                      <Languages className="text-purple-500" size={24}/>
                      <div>
                          <p className="text-xs text-gray-400 font-bold uppercase">Language</p>
                          <p className="font-bold text-lg">English</p>
                      </div>
                  </div>
              </div>

              {/* Description */}
              <div>
                  <h2 className="text-2xl font-bold mb-6">About {data.name}</h2>
                  <p className="text-gray-600 text-lg leading-8">{data.description}</p>
                  
                  <div className="mt-8 grid grid-cols-3 gap-4 h-48">
                      {data.images.map((img, i) => (
                          <div key={i} className="relative rounded-2xl overflow-hidden group">
                              <img src={img} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition"></div>
                          </div>
                      ))}
                  </div>
              </div>

              {/* TOP STAYS CAROUSEL */}
              <div>
                  <div className="flex justify-between items-end mb-8">
                      <h2 className="text-2xl font-bold">Where to stay</h2>
                      <a href="#" className="text-sm font-bold underline">View all stays</a>
                  </div>
                  <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
                      {data.topStays.map((stay) => (
                          <div key={stay.id} className="min-w-[280px] group cursor-pointer">
                              <div className="relative h-48 rounded-2xl overflow-hidden mb-3">
                                  <img src={stay.img} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                                  <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-md text-xs font-bold shadow-sm">
                                      ★ {stay.rating}
                                  </div>
                              </div>
                              <h3 className="font-bold text-gray-900">{stay.title}</h3>
                              <p className="text-sm text-gray-500">From KSh {stay.price} / night</p>
                          </div>
                      ))}
                  </div>
              </div>

              {/* TOP EXPERIENCES CAROUSEL */}
              <div>
                  <div className="flex justify-between items-end mb-8">
                      <h2 className="text-2xl font-bold">Unmissable Experiences</h2>
                      <a href="#" className="text-sm font-bold underline">View all activities</a>
                  </div>
                  <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
                      {data.topExperiences.map((exp) => (
                          <div key={exp.id} className="min-w-[300px] group cursor-pointer">
                              <div className="relative h-64 rounded-2xl overflow-hidden mb-3">
                                  <img src={exp.img} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                      <PlayCircle className="text-white opacity-0 group-hover:opacity-100 transition transform scale-50 group-hover:scale-100 duration-300" size={48} />
                                  </div>
                              </div>
                              <h3 className="font-bold text-gray-900">{exp.title}</h3>
                              <p className="text-sm text-gray-500">From KSh {exp.price}</p>
                          </div>
                      ))}
                  </div>
              </div>

          </div>

          {/* --- RIGHT: TRAVEL TIPS WIDGET --- */}
          <div className="relative">
              <div className="sticky top-24 space-y-6">
                  
                  {/* Weather Widget */}
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-20"><Sun size={100}/></div>
                      <div className="relative z-10">
                          <p className="text-sm font-medium opacity-90 mb-1">Current Weather</p>
                          <h3 className="text-5xl font-black mb-2">{data.stats.temp}</h3>
                          <p className="font-medium">Mostly Sunny</p>
                          <div className="mt-6 flex gap-4 text-sm opacity-90">
                              <div className="flex flex-col">
                                  <span className="opacity-70 text-xs uppercase">Humidity</span>
                                  <span className="font-bold">45%</span>
                              </div>
                              <div className="flex flex-col">
                                  <span className="opacity-70 text-xs uppercase">Wind</span>
                                  <span className="font-bold">12 km/h</span>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Travel Tips Card */}
                  <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200">
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                          <Info size={18} className="text-nearlink"/> Good to know
                      </h3>
                      <ul className="space-y-4">
                          <li className="flex gap-3 text-sm text-gray-600">
                              <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 shrink-0"></div>
                              Traffic in Nairobi can be heavy. Allow extra time for travel.
                          </li>
                          <li className="flex gap-3 text-sm text-gray-600">
                              <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 shrink-0"></div>
                              MPESA is widely accepted everywhere.
                          </li>
                          <li className="flex gap-3 text-sm text-gray-600">
                              <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 shrink-0"></div>
                              Plastic bags are banned in Kenya.
                          </li>
                      </ul>
                      <button className="w-full mt-6 bg-black text-white py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition">
                          Download City Guide
                      </button>
                  </div>

              </div>
          </div>

      </div>
      
      <Footer />
    </main>
  );
}