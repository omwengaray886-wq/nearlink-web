'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'; // ✅ Import Auth
import { db } from '@/lib/firebase'; // ✅ Import Firestore
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

import { 
  User, Shield, CreditCard, Bell, LogOut, Camera, 
  CheckCircle, ChevronRight, Lock, Smartphone, Mail, 
  MapPin, Gift, Settings, Eye, AlertTriangle, Plus,
  LayoutGrid, FileText, Download, ExternalLink,
  RefreshCw, UploadCloud, X, ToggleLeft, ToggleRight,
  History, Fingerprint, Globe, Loader2
} from 'lucide-react';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function AccountPage() {
  const { user, logout, loading } = useAuth(); // ✅ Get real user
  const router = useRouter();
  
  // UI State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Data State
  const [bookings, setBookings] = useState([]);
  const [fetchingBookings, setFetchingBookings] = useState(true);

  // --- 1. PROTECT ROUTE ---
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // --- 2. FETCH BOOKINGS ---
  useEffect(() => {
    const fetchUserBookings = async () => {
      if (user?.uid) {
        try {
          const q = query(
            collection(db, 'bookings'),
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc')
          );
          const snapshot = await getDocs(q);
          const userBookings = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setBookings(userBookings);
        } catch (error) {
          console.error("Error fetching bookings:", error);
        } finally {
          setFetchingBookings(false);
        }
      }
    };

    if (user) fetchUserBookings();
  }, [user]);

  // --- HANDLERS ---
  const handleSave = () => {
    setIsSaving(true);
    // In a real app, you would update Firestore 'users' collection here
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
    }, 1500);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-white w-10 h-10"/>
      </div>
    );
  }

  // Helper for Sidebar Items
  const SidebarItem = ({ id, label, icon: Icon, alert }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group relative ${activeTab === id ? 'bg-black text-white shadow-lg font-bold' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
    >
      <Icon size={18} className={activeTab === id ? "text-white" : "text-gray-400 group-hover:text-gray-900"} />
      <span className="flex-1 text-left">{label}</span>
      {alert && <span className="w-2 h-2 bg-red-500 rounded-full"></span>}
      {activeTab === id && <ChevronRight size={16} className="opacity-50"/>}
    </button>
  );

  return (
    <main className="min-h-screen bg-[#F8F9FA] font-sans pb-20">
      <div className="bg-black pb-2 shadow-md">
         <Navbar theme="dark" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 pt-12">
        
        {/* HEADER PROFILE SUMMARY */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
            <div className="flex items-center gap-6">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full p-1 bg-white shadow-sm border border-gray-200">
                        {user.image ? (
                            <img src={user.image} className="w-full h-full rounded-full object-cover" alt="Profile"/>
                        ) : (
                            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-500">
                                {user.name?.charAt(0) || "U"}
                            </div>
                        )}
                    </div>
                    <button className="absolute bottom-0 right-0 bg-black text-white p-2 rounded-full border-2 border-white hover:bg-gray-800 transition">
                        <Camera size={14}/>
                    </button>
                </div>
                <div>
                    <h1 className="text-3xl font-black text-gray-900">{user.name || "Traveler"}</h1>
                    <p className="text-gray-500 flex items-center gap-2">
                        {user.email} • <span className="text-green-600 font-bold text-xs bg-green-50 px-2 py-0.5 rounded-full">Member</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Joined {user.createdAt ? new Date(user.createdAt).getFullYear() : "2024"}</p>
                </div>
            </div>
            <div className="flex gap-3">
                <button className="bg-white border border-gray-200 text-gray-700 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-50 transition">
                    Public Profile
                </button>
                <button className="bg-black text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-800 transition shadow-lg shadow-black/20">
                    Host Dashboard
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* --- LEFT SIDEBAR --- */}
            <div className="lg:col-span-3">
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 sticky top-24">
                    <div className="px-4 pt-2 pb-6">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Account</p>
                        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-green-500 h-full rounded-full" style={{width: `40%`}}></div>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-2 text-right">40% Complete</p>
                    </div>
                    <nav className="space-y-1">
                        <SidebarItem id="dashboard" label="Overview" icon={LayoutGrid} />
                        <SidebarItem id="profile" label="Personal Info" icon={User} />
                        <SidebarItem id="wallet" label="My Trips & Wallet" icon={CreditCard} />
                        <SidebarItem id="security" label="Login & Security" icon={Shield} alert={true} />
                        <div className="my-4 border-t border-gray-100"></div>
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-red-600 hover:bg-red-50 transition font-medium text-sm"
                        >
                            <LogOut size={18} />
                            <span>Sign Out</span>
                        </button>
                    </nav>
                </div>
            </div>

            {/* --- MAIN CONTENT AREA --- */}
            <div className="lg:col-span-9 space-y-8">
                
                {/* 1. DASHBOARD VIEW */}
                {activeTab === 'dashboard' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-black text-white rounded-3xl p-6 relative overflow-hidden shadow-xl">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-nearlink/20 rounded-full blur-[50px]"></div>
                                <div className="relative z-10">
                                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total Trips</p>
                                    <h3 className="text-3xl font-black mb-4">{bookings.length}</h3>
                                    <div className="flex gap-2">
                                        <button onClick={() => router.push('/')} className="bg-nearlink text-black px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-white transition">Book New</button>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><Shield size={20}/></div>
                                    <span className="text-xs font-bold bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md">Action Needed</span>
                                </div>
                                <p className="font-bold text-gray-900">Identity Check</p>
                                <p className="text-xs text-gray-500 mb-3">Upload your National ID back side to complete verification.</p>
                                <button onClick={() => setActiveTab('security')} className="text-xs font-bold text-blue-600 hover:underline">Complete Now</button>
                            </div>

                            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-green-50 p-2 rounded-lg text-green-600"><Gift size={20}/></div>
                                </div>
                                <p className="font-bold text-gray-900">Refer & Earn</p>
                                <p className="text-xs text-gray-500 mb-3">Invite friends and earn travel credits.</p>
                                <button className="w-full border border-gray-200 rounded-lg py-1.5 text-xs font-bold hover:bg-gray-50">Copy Invite Link</button>
                            </div>
                        </div>

                        {/* Recent Bookings Table */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="font-bold text-lg">Recent Bookings</h3>
                                <button onClick={() => setActiveTab('wallet')} className="text-sm text-nearlink font-bold hover:underline">View All</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 text-gray-500">
                                        <tr>
                                            <th className="px-6 py-4 font-bold">Property/Activity</th>
                                            <th className="px-6 py-4 font-bold">Date</th>
                                            <th className="px-6 py-4 font-bold">Status</th>
                                            <th className="px-6 py-4 font-bold text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {fetchingBookings ? (
                                            <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500">Loading your trips...</td></tr>
                                        ) : bookings.length === 0 ? (
                                            <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500">No bookings yet. Time to explore!</td></tr>
                                        ) : (
                                            bookings.slice(0, 5).map((booking, i) => (
                                                <tr key={booking.id || i} className="hover:bg-gray-50 transition cursor-pointer" onClick={() => router.push(`/trips/${booking.id}`)}>
                                                    <td className="px-6 py-4 font-medium text-gray-900">{booking.propertyName || "Experience"}</td>
                                                    <td className="px-6 py-4 text-gray-500">
                                                        {booking.checkIn?.seconds ? new Date(booking.checkIn.seconds * 1000).toLocaleDateString() : "Pending"}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                            booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                                                            booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                            {booking.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right font-bold text-gray-900">
                                                        KES {(booking.totalAmount || 0).toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. PROFILE VIEW */}
                {activeTab === 'profile' && (
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm animate-in fade-in slide-in-from-right-4">
                        <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                                <p className="text-gray-500 text-sm">Manage your personal details.</p>
                            </div>
                            <button 
                                onClick={() => setIsEditing(!isEditing)}
                                className="text-sm font-bold text-black border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
                            >
                                {isEditing ? "Cancel" : "Edit Details"}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Legal Name</label>
                                <input disabled={!isEditing} type="text" defaultValue={user.name} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 font-bold text-gray-900 outline-none disabled:opacity-60" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
                                <input disabled type="email" defaultValue={user.email} className="w-full bg-gray-100 border border-gray-200 rounded-xl py-3 px-4 font-bold text-gray-500 outline-none cursor-not-allowed" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
                                <input disabled={!isEditing} type="tel" placeholder="Add phone number" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 font-bold text-gray-900 outline-none disabled:opacity-60" />
                            </div>
                        </div>

                        {isEditing && (
                            <div className="mt-8 flex justify-end pt-6 border-t border-gray-100">
                                <button 
                                    onClick={handleSave}
                                    className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition shadow-lg flex items-center gap-2"
                                >
                                    {isSaving ? <RefreshCw className="animate-spin" size={18}/> : <CheckCircle size={18}/>}
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* 3. WALLET VIEW (Placeholder for now) */}
                {activeTab === 'wallet' && (
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center py-20">
                        <CreditCard size={48} className="mx-auto text-gray-300 mb-4"/>
                        <h3 className="font-bold text-xl text-gray-900">Wallet & Trips</h3>
                        <p className="text-gray-500 mb-6">View your complete booking history and manage payment methods.</p>
                        <button onClick={() => router.push('/')} className="bg-nearlink text-black px-6 py-2 rounded-full font-bold text-sm">Book a Trip</button>
                    </div>
                )}

            </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}