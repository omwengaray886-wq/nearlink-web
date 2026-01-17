'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  Star, MapPin, Clock, ShieldCheck, Phone, MessageSquare, 
  CheckCircle, Car, Briefcase, Users, Wifi, Wind, Coffee, 
  ArrowRight, Plane, CreditCard, Calendar, Info, 
  Navigation, Fuel, Settings, AlertCircle, Plus, Minus
} from 'lucide-react';

import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

// --- ADVANCED DATA SIMULATOR ---
const getTransportDetails = (id) => {
    return {
        id: id,
        title: "Premium Airport Transfer",
        serviceLevel: "Executive Chauffeur",
        location: "Nairobi, Kenya",
        rating: 4.98,
        reviews: 850,
        basePrice: 3500, // Base rate for standard
        driver: {
            name: "David Kimani",
            experience: "8 Years",
            trips: "1,200+",
            image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop",
            verified: true,
            languages: ["English", "Swahili"],
            badges: ["Top Rated", "Punctual"]
        },
        policies: {
            cancellation: "Free up to 1 hour before pickup",
            waiting: "60 mins free waiting time at airports, 15 mins elsewhere."
        },
        classes: [
            { 
                id: "business", 
                name: "Business Class", 
                car: "Toyota Prado / Mercedes E-Class", 
                image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2500",
                priceMultiplier: 1.5, 
                seats: 3, 
                luggage: 2,
                desc: "Leather seats, tinted windows, complimentary water."
            },
            { 
                id: "van", 
                name: "Business Van", 
                car: "Mercedes V-Class / Alphard", 
                image: "https://images.unsplash.com/photo-1678736362372-acb9cb3d096a?q=80&w=2500", // Placeholder for van
                priceMultiplier: 2.0, 
                seats: 5, 
                luggage: 5,
                desc: "Extra space for groups, conference seating."
            },
            { 
                id: "first", 
                name: "First Class", 
                car: "Mercedes S-Class / Range Rover", 
                image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2500",
                priceMultiplier: 3.5, 
                seats: 3, 
                luggage: 2,
                desc: "Ultimate luxury, massage seats, rear entertainment."
            }
        ],
        amenities: [
            { icon: Wifi, label: "Onboard Wi-Fi" },
            { icon: Wind, label: "Climate Control" },
            { icon: Coffee, label: "Bottled Water" },
            { icon: ShieldCheck, label: "Passenger Insurance" },
            { icon: Phone, label: "Phone Chargers" }
        ]
    };
};

export default function TransportPage() {
  const params = useParams();
  const [data, setData] = useState(null);
  
  // Booking State
  const [selectedClass, setSelectedClass] = useState("business");
  const [bookingType, setBookingType] = useState("transfer"); // 'transfer' or 'hourly'
  const [flightNumber, setFlightNumber] = useState("");
  const [duration, setDuration] = useState(4); // Hours
  const [pickup, setPickup] = useState("JKIA International Airport");
  const [dropoff, setDropoff] = useState("");
  const [addons, setAddons] = useState({ childSeat: false, security: false });

  useEffect(() => {
    if (params.id) setData(getTransportDetails(params.id));
  }, [params.id]);

  if (!data) return <div className="min-h-screen bg-black" />;

  const currentClassData = data.classes.find(c => c.id === selectedClass);
  
  // Complex Price Calculation
  const calculateTotal = () => {
      let base = data.basePrice * currentClassData.priceMultiplier;
      if (bookingType === 'hourly') {
          base = (base * 0.8) * duration; // Hourly rate logic
      }
      if (addons.childSeat) base += 500;
      if (addons.security) base += 5000;
      return Math.round(base);
  };

  return (
    <main className="min-h-screen bg-gray-50 font-sans pb-20">
      <Navbar />

      {/* 1. CINEMATIC VEHICLE HERO */}
      <div className="relative h-[60vh] w-full overflow-hidden bg-gray-900 group">
          <img 
            src={currentClassData.image} 
            className="absolute inset-0 w-full h-full object-cover opacity-90 transition-opacity duration-500"
            alt={currentClassData.name}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 flex flex-col justify-end h-full">
              <div className="max-w-4xl animate-in slide-in-from-left-10 duration-700">
                  <div className="flex items-center gap-3 mb-4">
                      <span className="bg-white text-black text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider">
                          {data.serviceLevel}
                      </span>
                      <div className="flex items-center gap-1 text-green-400 bg-black/60 backdrop-blur-md px-3 py-1 rounded-md border border-white/10">
                          <CheckCircle size={14}/> 
                          <span className="text-xs font-bold text-white">Guaranteed Availability</span>
                      </div>
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black text-white mb-4">
                      {currentClassData.name}
                  </h1>
                  <p className="text-gray-300 text-xl font-light max-w-xl">
                      {currentClassData.car} • {currentClassData.desc}
                  </p>
              </div>
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12 -mt-10 relative z-10">
          
          {/* --- LEFT: SERVICE DETAILS --- */}
          <div className="lg:col-span-2 space-y-10">
              
              {/* Class Selection Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {data.classes.map((cls) => (
                      <div 
                        key={cls.id}
                        onClick={() => setSelectedClass(cls.id)}
                        className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${selectedClass === cls.id ? 'bg-black border-black text-white shadow-xl scale-105' : 'bg-white border-white text-gray-500 hover:border-gray-200'}`}
                      >
                          <p className="text-xs font-bold uppercase tracking-widest mb-2">{cls.name}</p>
                          <div className="flex justify-between items-end">
                              <span className="font-bold text-lg">{cls.seats} Pax</span>
                              <Car size={24} className={selectedClass === cls.id ? "text-nearlink" : "text-gray-300"}/>
                          </div>
                      </div>
                  ))}
              </div>

              {/* Driver & Safety */}
              <div className="bg-white rounded-3xl p-8 border border-gray-100 flex flex-col md:flex-row gap-8 items-start">
                  <div className="shrink-0 relative">
                      <img src={data.driver.image} className="w-24 h-24 rounded-full object-cover border-4 border-gray-100" />
                      <div className="absolute -bottom-2 -right-2 bg-black text-white p-1.5 rounded-full border-4 border-white">
                          <ShieldCheck size={16}/>
                      </div>
                  </div>
                  <div className="flex-1">
                      <div className="flex justify-between items-start">
                          <div>
                              <h3 className="font-bold text-xl text-gray-900">{data.driver.name}</h3>
                              <p className="text-sm text-gray-500 mb-3">{data.driver.experience} Experience · {data.driver.trips} Trips</p>
                          </div>
                          <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg">
                              <Star size={14} className="fill-black"/> <span className="font-bold text-sm">4.98</span>
                          </div>
                      </div>
                      <div className="flex gap-2 flex-wrap mb-4">
                          {data.driver.badges.map(b => (
                              <span key={b} className="text-xs font-bold bg-green-50 text-green-700 px-2 py-1 rounded-md">{b}</span>
                          ))}
                      </div>
                      <p className="text-gray-600 text-sm italic">
                          "I prioritize your safety and comfort above all else. The car is sanitized before every trip."
                      </p>
                  </div>
              </div>

              {/* Amenities Grid */}
              <div className="bg-white rounded-3xl p-8 border border-gray-100">
                  <h3 className="font-bold text-lg mb-6">Service Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {data.amenities.map((item, i) => (
                          <div key={i} className="flex items-center gap-3 text-gray-700">
                              <div className="bg-gray-50 p-2 rounded-lg text-black"><item.icon size={20}/></div>
                              <span className="font-medium text-sm">{item.label}</span>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Policy Info */}
              <div className="flex gap-4 p-4 bg-blue-50 text-blue-900 rounded-xl border border-blue-100 items-start">
                  <Info size={20} className="shrink-0 mt-0.5"/>
                  <div className="text-sm">
                      <p className="font-bold mb-1">Meet & Greet Included</p>
                      <p className="opacity-80 leading-relaxed">{data.policies.waiting}</p>
                  </div>
              </div>

          </div>

          {/* --- RIGHT: ADVANCED BOOKING WIDGET --- */}
          <div className="relative">
              <div className="sticky top-24 bg-white border border-gray-200 shadow-2xl rounded-3xl p-6 lg:p-8">
                  
                  {/* Booking Type Toggle */}
                  <div className="bg-gray-100 p-1 rounded-xl flex mb-6">
                      <button 
                        onClick={() => setBookingType('transfer')}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${bookingType === 'transfer' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
                      >
                          One Way
                      </button>
                      <button 
                        onClick={() => setBookingType('hourly')}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${bookingType === 'hourly' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
                      >
                          Hourly
                      </button>
                  </div>

                  {/* Route Inputs */}
                  <div className="space-y-4 mb-6">
                      <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-green-500 rounded-full"></div>
                          <input 
                            type="text" 
                            value={pickup}
                            onChange={(e) => setPickup(e.target.value)}
                            className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-black rounded-xl py-3 pl-10 pr-4 text-sm font-bold outline-none transition"
                            placeholder="Pickup Location"
                          />
                      </div>
                      
                      {bookingType === 'transfer' ? (
                          <div className="relative">
                              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full"></div>
                              <input 
                                type="text" 
                                value={dropoff}
                                onChange={(e) => setDropoff(e.target.value)}
                                className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-black rounded-xl py-3 pl-10 pr-4 text-sm font-bold outline-none transition"
                                placeholder="Dropoff Location"
                              />
                          </div>
                      ) : (
                          <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3 border border-transparent">
                              <span className="text-sm font-bold text-gray-500 ml-2">Duration</span>
                              <div className="flex items-center gap-3">
                                  <button onClick={() => setDuration(Math.max(2, duration-1))} className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center font-bold text-gray-700 hover:bg-gray-100">-</button>
                                  <span className="font-bold text-sm w-12 text-center">{duration} hrs</span>
                                  <button onClick={() => setDuration(duration+1)} className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center font-bold text-gray-700 hover:bg-gray-100">+</button>
                              </div>
                          </div>
                      )}
                  </div>

                  {/* Date/Time */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="bg-gray-50 p-3 rounded-xl border border-transparent cursor-pointer hover:bg-gray-100">
                          <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Date</p>
                          <div className="flex items-center gap-2">
                              <Calendar size={14} className="text-black"/>
                              <span className="text-sm font-bold">Today</span>
                          </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-xl border border-transparent cursor-pointer hover:bg-gray-100">
                          <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Pickup Time</p>
                          <div className="flex items-center gap-2">
                              <Clock size={14} className="text-black"/>
                              <span className="text-sm font-bold">Now</span>
                          </div>
                      </div>
                  </div>

                  {/* Flight Number (Conditional) */}
                  {pickup.toLowerCase().includes('airport') && (
                      <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 mb-6 flex items-center gap-3">
                          <Plane size={18} className="text-blue-600"/>
                          <input 
                            type="text" 
                            placeholder="Flight Number (Optional)" 
                            value={flightNumber}
                            onChange={(e) => setFlightNumber(e.target.value)}
                            className="bg-transparent text-sm font-bold text-blue-900 placeholder-blue-400 outline-none w-full"
                          />
                      </div>
                  )}

                  {/* Add-ons */}
                  <div className="mb-8 space-y-3">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Extras</p>
                      <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Child Seat</span>
                          <button 
                            onClick={() => setAddons({...addons, childSeat: !addons.childSeat})}
                            className={`w-10 h-6 rounded-full p-1 transition-colors ${addons.childSeat ? 'bg-black' : 'bg-gray-200'}`}
                          >
                              <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${addons.childSeat ? 'translate-x-4' : ''}`}></div>
                          </button>
                      </div>
                      <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Security Escort</span>
                          <button 
                            onClick={() => setAddons({...addons, security: !addons.security})}
                            className={`w-10 h-6 rounded-full p-1 transition-colors ${addons.security ? 'bg-black' : 'bg-gray-200'}`}
                          >
                              <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${addons.security ? 'translate-x-4' : ''}`}></div>
                          </button>
                      </div>
                  </div>

                  {/* Pricing Footer */}
                  <div className="border-t border-gray-100 pt-6">
                      <div className="flex justify-between items-end mb-4">
                          <span className="text-gray-500 text-sm">Estimated Total</span>
                          <span className="text-3xl font-black text-gray-900">KSh {calculateTotal().toLocaleString()}</span>
                      </div>
                      <button className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1 flex items-center justify-center gap-2">
                          Confirm Booking <ArrowRight size={20}/>
                      </button>
                  </div>

              </div>
          </div>

      </div>
      
      <Footer />
    </main>
  );
}