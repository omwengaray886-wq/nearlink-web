'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { 
  collection, query, where, 
  onSnapshot, doc, updateDoc, deleteDoc, orderBy 
} from 'firebase/firestore';
import { 
  Plus, Home, LayoutGrid, ChevronLeft, ChevronRight,
  Loader2, Calendar as CalendarIcon, Users, Wallet, CheckCircle, 
  XCircle, TrendingUp, MoreHorizontal, MapPin, Star, Settings, Bell, 
  ArrowUpRight, ArrowDownRight, Search, Filter, Download, Clock,
  PlayCircle, Award, Lightbulb, Trash2, Eye, Pencil, 
  // 👇 Category Icons
  Car, Utensils, Calendar, Map, Tent, 
  // 👇 Detail Icons
  Palette, Fuel, Gauge, ChefHat, Timer, Zap, Music
} from 'lucide-react';

import Navbar from '@/components/Navbar';
import CreateListingWizard from '@/components/host/CreateListingWizard';

// --- MOCK DATA FOR ACADEMY ---
const HOST_LESSONS = [
  { id: 1, title: "Getting Started on NearLink", category: "Basics", duration: "5 min", completed: true, image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7" },
  { id: 2, title: "Taking Photos that Sell", category: "Marketing", duration: "12 min", completed: false, image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32" },
  { id: 3, title: "Mastering Guest Communication", category: "Hospitality", duration: "8 min", completed: false, image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df" },
  { id: 4, title: "Pricing Strategies for High Season", category: "Finance", duration: "15 min", completed: false, image: "https://images.unsplash.com/photo-1554224155-984063584d45" },
];

export default function HostPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // --- STATE ---
  const [view, setView] = useState('dashboard'); 
  const [activeTab, setActiveTab] = useState('overview'); 
  const [editingProperty, setEditingProperty] = useState(null);
  
  // Data State
  const [myProperties, setMyProperties] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [stats, setStats] = useState({ revenue: 0, views: 0, bookings: 0, occupancy: 0 });
  const [fetching, setFetching] = useState(true);

  // --- 1. PROTECT ROUTE ---
  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  // --- 2. REAL-TIME DATA FETCHING ---
  useEffect(() => {
    if (!user?.uid) return;

    setFetching(true);

    // A. Listen to Properties
    const qProps = query(collection(db, 'properties'), where('hostId', '==', user.uid));
    const unsubscribeProps = onSnapshot(qProps, (snapshot) => {
      const props = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMyProperties(props);
    });

    // B. Listen to Bookings
    const qBookings = query(collection(db, 'bookings'), where('hostId', '==', user.uid), orderBy('createdAt', 'desc'));
    const unsubscribeBookings = onSnapshot(qBookings, (snapshot) => {
      const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMyBookings(bookings);
      
      // Calculate Stats
      const revenue = bookings
        .filter(b => b.status === 'confirmed')
        .reduce((acc, curr) => acc + (Number(curr.totalAmount) || 0), 0);
      
      setStats({
        revenue,
        bookings: bookings.length,
        views: 1240 + (bookings.length * 15), 
        occupancy: bookings.length > 0 ? 65 : 0 
      });
      
      setFetching(false);
    });

    return () => {
      unsubscribeProps();
      unsubscribeBookings();
    };
  }, [user]);

  // --- HANDLERS ---
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    setView('dashboard'); 
  };

  const handleBookingAction = async (bookingId, status) => {
    try {
      await updateDoc(doc(db, "bookings", bookingId), { status });
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("Action failed.");
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if(confirm("Are you sure? This action cannot be undone.")) {
      try {
        await deleteDoc(doc(db, "properties", propertyId));
      } catch (error) {
        console.error("Error deleting property:", error);
      }
    }
  };

  // --- HELPER: GET ICON FOR TYPE ---
  const getTypeIcon = (type) => {
    switch(type) {
        case 'transport': return <Car size={18} className="text-blue-600"/>;
        case 'food': return <Utensils size={18} className="text-orange-600"/>;
        case 'event': return <Calendar size={18} className="text-purple-600"/>;
        case 'experience': return <Tent size={18} className="text-pink-600"/>; 
        case 'guide': return <Map size={18} className="text-teal-600"/>; 
        default: return <Home size={18} className="text-green-600"/>; 
    }
  };

  // --- HELPER: RENDER SMART DETAILS (NEW) ---
  const renderSmartDetails = (prop) => {
    const d = prop.details || {};
    
    switch(prop.type) {
        case 'transport':
            return (
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    {d.color && <span className="flex items-center gap-1"><Palette size={12}/> {d.color}</span>}
                    {d.transmission && <span className="flex items-center gap-1"><Gauge size={12}/> {d.transmission}</span>}
                    {d.fuelType && <span className="flex items-center gap-1"><Fuel size={12}/> {d.fuelType}</span>}
                </div>
            );
        case 'food':
            return (
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    {d.cuisine && <span className="flex items-center gap-1 px-1.5 py-0.5 bg-orange-50 text-orange-700 rounded font-medium">{d.cuisine}</span>}
                    {d.chefName && <span className="flex items-center gap-1"><ChefHat size={12}/> Chef {d.chefName}</span>}
                </div>
            );
        case 'experience':
            return (
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    {d.duration && <span className="flex items-center gap-1"><Timer size={12}/> {d.duration} Hrs</span>}
                    {d.activityLevel && <span className="flex items-center gap-1"><Zap size={12}/> {d.activityLevel}</span>}
                </div>
            );
        case 'event':
            return (
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    {d.date && <span className="flex items-center gap-1"><CalendarIcon size={12}/> {d.date}</span>}
                    {d.ageLimit && <span className="flex items-center gap-1"><Users size={12}/> {d.ageLimit}</span>}
                </div>
            );
        default: // Stay
            return (
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    <span className="flex items-center gap-1">{d.guests || 2} Guests</span>
                    <span className="flex items-center gap-1">•</span>
                    <span className="flex items-center gap-1">{d.bedrooms || 1} Bedrooms</span>
                </div>
            );
    }
  };

  // --- COMPONENT: CALENDAR GRID ---
  const CalendarView = () => {
    const days = Array.from({ length: 30 }, (_, i) => i + 1);
    
    return (
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm animate-in fade-in slide-in-from-bottom-2">
        <div className="flex justify-between mb-6">
          <h3 className="font-bold text-lg">January 2026</h3>
          <div className="flex gap-2 text-sm">
            <span className="flex items-center gap-1"><div className="w-3 h-3 bg-green-100 rounded-full border border-green-200"></div> Available</span>
            <span className="flex items-center gap-1"><div className="w-3 h-3 bg-[#005871] rounded-full"></div> Booked</span>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-center text-xs font-bold text-gray-400 uppercase py-2">{d}</div>
          ))}
          <div className="col-span-4"></div> 
          {days.map(day => {
            const isBooked = myBookings.some(b => day % 5 === 0);
            return (
              <div key={day} className={`
                h-24 border rounded-xl p-2 relative transition hover:border-[#005871] cursor-pointer
                ${isBooked ? 'bg-[#005871]/10 border-[#005871]/20' : 'bg-white border-gray-100'}
              `}>
                <span className={`text-sm font-bold ${isBooked ? 'text-[#005871]' : 'text-gray-700'}`}>{day}</span>
                {isBooked && <div className="mt-2 text-[10px] bg-white p-1 rounded border border-[#005871]/20 shadow-sm truncate">Guest</div>}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading || !user) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-white"/></div>;

  return (
    <main className="min-h-screen bg-gray-50/50 font-sans pb-20">
      
      {/* --- TOP NAVBAR --- */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-[40]">
          <Navbar />
      </div>

      {/* --- HOST TOOLBAR (STICKY & HIGH Z-INDEX) --- */}
      <div className="bg-white border-b border-gray-200 sticky top-[72px] z-[100] shadow-sm">
          <div className="max-w-[1600px] mx-auto px-6 h-14 flex items-center justify-between gap-4">
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg overflow-x-auto no-scrollbar">
                  {['overview', 'listings', 'bookings', 'calendar', 'learning'].map((tab) => (
                      <button 
                        key={tab}
                        onClick={() => handleTabClick(tab)}
                        className={`px-4 py-1.5 rounded-md text-sm font-bold capitalize transition-all whitespace-nowrap relative z-10 cursor-pointer ${
                            activeTab === tab && view === 'dashboard' 
                            ? 'bg-white text-black shadow-sm ring-1 ring-black/5' 
                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'
                        }`}
                      >
                          {tab}
                      </button>
                  ))}
              </div>
              <div className="flex items-center gap-3">
                  <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 mr-4">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> System Operational
                  </div>
                  <button onClick={() => { setEditingProperty(null); setView('wizard'); }} className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-800 transition shadow-lg">
                      <Plus size={16}/> Create Listing
                  </button>
              </div>
          </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-8">
        
        {/* --- VIEW 1: DASHBOARD --- */}
        {view === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                
                {/* 1. Header Greeting */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 capitalize">
                            {activeTab === 'learning' ? 'Host Academy' : `${activeTab} Dashboard`}
                        </h1>
                        <p className="text-sm text-gray-500">
                            {activeTab === 'learning' ? 'Master the art of hosting.' : `Manage your business, ${user.name?.split(' ')[0] || 'Partner'}.`}
                        </p>
                    </div>
                </div>

                {/* --- TAB CONTENT SWITCHER --- */}
                
                {/* 1. OVERVIEW TAB */}
                {activeTab === 'overview' && (
                    <>
                        {/* Metrics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-gray-50 rounded-lg"><Wallet size={20} className="text-gray-900"/></div>
                                    <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full"><TrendingUp size={12}/> +12.5%</span>
                                </div>
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Revenue</p>
                                <h3 className="text-3xl font-black text-gray-900 mt-1">KES {stats.revenue.toLocaleString()}</h3>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-gray-50 rounded-lg"><CalendarIcon size={20} className="text-gray-900"/></div>
                                    <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full"><ArrowUpRight size={12}/> +4%</span>
                                </div>
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Bookings</p>
                                <h3 className="text-3xl font-black text-gray-900 mt-1">{stats.bookings}</h3>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-gray-50 rounded-lg"><Home size={20} className="text-gray-900"/></div>
                                </div>
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Properties</p>
                                <h3 className="text-3xl font-black text-gray-900 mt-1">{myProperties.length}</h3>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-gray-50 rounded-lg"><Users size={20} className="text-gray-900"/></div>
                                </div>
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Listing Views</p>
                                <h3 className="text-3xl font-black text-gray-900 mt-1">{stats.views}</h3>
                            </div>
                        </div>

                        {/* Recent Bookings & Listings Preview */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                             {/* Small Listings Table */}
                             <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                                <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
                                    <h3 className="font-bold text-gray-900">Your Listings</h3>
                                    <button onClick={() => handleTabClick('listings')} className="text-xs font-bold text-nearlink hover:underline cursor-pointer">View All</button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <tbody className="divide-y divide-gray-100">
                                            {myProperties.slice(0,3).map(prop => (
                                                <tr key={prop.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-gray-100 rounded-lg shrink-0">
                                                                {getTypeIcon(prop.type)}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="font-bold text-gray-900 truncate max-w-[150px]">{prop.title}</div>
                                                                {renderSmartDetails(prop)}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">KES {Number(prop.pricePerNight || prop.price).toLocaleString()}</td>
                                                </tr>
                                            ))}
                                            {myProperties.length === 0 && <tr><td className="p-6 text-center text-gray-400">No properties</td></tr>}
                                        </tbody>
                                    </table>
                                </div>
                             </div>

                             {/* Small Bookings Table */}
                             <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                                <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
                                    <h3 className="font-bold text-gray-900">Recent Bookings</h3>
                                    <button onClick={() => handleTabClick('bookings')} className="text-xs font-bold text-nearlink hover:underline cursor-pointer">View All</button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <tbody className="divide-y divide-gray-100">
                                            {myBookings.slice(0,3).map(bk => (
                                                <tr key={bk.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 font-bold">Guest</td>
                                                    <td className="px-6 py-4">{bk.propertyName}</td>
                                                    <td className="px-6 py-4 text-right"><span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded">{bk.status}</span></td>
                                                </tr>
                                            ))}
                                            {myBookings.length === 0 && <tr><td className="p-6 text-center text-gray-400">No bookings</td></tr>}
                                        </tbody>
                                    </table>
                                </div>
                             </div>
                        </div>
                    </>
                )}

                {/* 2. LISTINGS TAB */}
                {activeTab === 'listings' && (
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 w-[40%]">Listing Details</th>
                                        <th className="px-6 py-3">Location</th>
                                        <th className="px-6 py-3">Price</th>
                                        <th className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {myProperties.map(prop => (
                                        <tr key={prop.id} className="hover:bg-gray-50/80 transition group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 rounded-lg bg-gray-200 overflow-hidden shrink-0 border border-gray-200 relative group-hover:scale-105 transition">
                                                        <img src={prop.images?.[0] || prop.imageUrl} className="w-full h-full object-cover"/>
                                                        {/* Badge on Image */}
                                                        <div className="absolute top-1 left-1 bg-black/50 backdrop-blur-sm p-1 rounded-md text-white">
                                                            {getTypeIcon(prop.type)}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900 text-lg truncate max-w-[250px]">{prop.title}</div>
                                                        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium uppercase tracking-wide">
                                                            <span>{prop.category}</span>
                                                            <span>•</span>
                                                            <span className={prop.status === 'active' ? 'text-green-600' : 'text-gray-400'}>{prop.status || 'Active'}</span>
                                                        </div>
                                                        {/* RENDER SMART DETAILS HERE */}
                                                        {renderSmartDetails(prop)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">{prop.location?.city || prop.city}</td>
                                            <td className="px-6 py-4 font-bold text-lg">KES {Number(prop.pricePerNight || prop.price).toLocaleString()}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button 
                                                        onClick={() => {
                                                            setEditingProperty(prop);
                                                            setView('wizard');
                                                        }}
                                                        className="text-gray-400 hover:text-black p-2 rounded-full hover:bg-gray-100 transition"
                                                    >
                                                        <Pencil size={18}/>
                                                    </button>
                                                    <button onClick={() => handleDeleteProperty(prop.id)} className="text-gray-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition cursor-pointer">
                                                        <Trash2 size={18}/>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {myProperties.length === 0 && <tr><td colSpan="4" className="p-12 text-center text-gray-400">No listings found.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* 3. BOOKINGS TAB */}
                {activeTab === 'bookings' && (
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3">Guest</th>
                                    <th className="px-6 py-3">Service</th>
                                    <th className="px-6 py-3">Total</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {myBookings.map(booking => (
                                    <tr key={booking.id} className="hover:bg-gray-50/80 transition">
                                        <td className="px-6 py-4 font-bold text-gray-900">Guest</td>
                                        <td className="px-6 py-4 text-gray-600">{booking.propertyName}</td>
                                        <td className="px-6 py-4 font-bold text-gray-900">KES {Number(booking.totalAmount).toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                                                booking.status === 'confirmed' ? 'bg-green-50 text-green-700 border border-green-100' : 
                                                booking.status === 'cancelled' ? 'bg-red-50 text-red-700 border border-red-100' :
                                                'bg-yellow-50 text-yellow-700 border border-yellow-100'
                                            }`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                                            {booking.status === 'pending' && (
                                                <>
                                                    <button onClick={() => handleBookingAction(booking.id, 'confirmed')} className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200 cursor-pointer"><CheckCircle size={16}/></button>
                                                    <button onClick={() => handleBookingAction(booking.id, 'cancelled')} className="p-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 cursor-pointer"><XCircle size={16}/></button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {myBookings.length === 0 && <tr><td colSpan="5" className="p-12 text-center text-gray-400">No bookings yet.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* 4. CALENDAR TAB */}
                {activeTab === 'calendar' && <CalendarView />}

                {/* 5. LEARNING TAB */}
                {activeTab === 'learning' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in">
                        <div className="lg:col-span-2 space-y-6">
                            {HOST_LESSONS.map((lesson) => (
                                <div key={lesson.id} className="group flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl border border-gray-200 hover:border-black transition cursor-pointer shadow-sm">
                                    <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden relative shrink-0">
                                        <img src={lesson.image} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"><PlayCircle size={32} className="text-white"/></div>
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#005871] bg-[#005871]/10 px-2 py-1 rounded">{lesson.category}</span>
                                            <span className="text-xs font-medium text-gray-500 flex items-center gap-1"><Clock size={12}/> {lesson.duration}</span>
                                        </div>
                                        <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-[#005871] transition">{lesson.title}</h3>
                                        <p className="text-sm text-gray-500">Learn essential skills to attract more guests.</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-6">
                            <div className="bg-[#005871] text-white p-6 rounded-3xl relative overflow-hidden">
                                <div className="relative z-10">
                                    <h3 className="text-xl font-bold mb-1">Your Progress</h3>
                                    <p className="text-sm text-white/80 mb-6">You've completed 1 of 4 lessons.</p>
                                    <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden"><div className="bg-white h-full rounded-full w-[25%]"></div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )}

        {/* --- VIEW 2: PROFESSIONAL WIZARD (Handles Create & Edit) --- */}
        {view === 'wizard' && (
            <CreateListingWizard 
               initialData={editingProperty} 
               onClose={() => {
                   setView('dashboard');
                   setEditingProperty(null); 
               }} 
               onSuccess={() => {
                  setView('dashboard');
                  setActiveTab('listings');
                  setEditingProperty(null); 
               }}
            />
        )}

      </div>
    </main>
  );
}