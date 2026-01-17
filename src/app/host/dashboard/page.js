'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db, auth } from '@/lib/firebase'; // Ensure path matches your project
import { onAuthStateChanged } from 'firebase/auth';
import { 
  collection, query, where, getDocs, doc, updateDoc, deleteDoc, orderBy 
} from 'firebase/firestore';
import { 
  LayoutDashboard, Home, Calendar, Wallet, Settings, LogOut, 
  Plus, Search, Bell, CheckCircle, XCircle, MoreVertical, 
  TrendingUp, Users, Star, Loader2, MapPin, Eye
} from 'lucide-react';
import Link from 'next/link';

export default function HostDashboard() {
  const router = useRouter();

  // --- STATE MANAGEMENT ---
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [stats, setStats] = useState({ earnings: 0, views: 0, rating: 0 });

  // --- 1. AUTH & DATA FETCHING ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);

      if (currentUser) {
        await fetchHostData(currentUser.uid);
      } else {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchHostData = async (uid) => {
    setLoadingData(true);
    try {
      // A. Fetch Properties (Using 'properties' collection based on your DB)
      const propsQuery = query(collection(db, 'properties'), where('hostId', '==', uid));
      const propsSnap = await getDocs(propsQuery);
      const propsList = propsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setListings(propsList);

      // B. Fetch Bookings
      // Note: We fetch all bookings then filter by hostId manually if composite index is missing
      // Ideally: query(collection(db, 'bookings'), where('hostId', '==', uid));
      const bookingsRef = collection(db, 'bookings');
      const q = query(bookingsRef, where('hostId', '==', uid));
      const booksSnap = await getDocs(q);
      const booksList = booksSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      
      // Sort in memory (newest first)
      booksList.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setBookings(booksList);

      // C. Calculate Stats
      const totalEarnings = booksList
        .filter(b => b.status === 'confirmed')
        .reduce((acc, curr) => acc + (Number(curr.totalPrice) || 0), 0);

      // Calculate Avg Rating (Mock logic or real if you have reviews)
      const avgRating = propsList.reduce((acc, curr) => acc + (Number(curr.rating) || 0), 0) / (propsList.length || 1);

      setStats({
        earnings: totalEarnings,
        views: 1240, // You can add a 'views' field to your property documents later
        rating: avgRating.toFixed(1)
      });

    } catch (error) {
      console.error("Error loading host data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  // --- ACTIONS ---

  const handleBookingAction = async (bookingId, newStatus) => {
    try {
      // 1. Update Firebase
      await updateDoc(doc(db, "bookings", bookingId), { status: newStatus });
      
      // 2. Update UI Instantly
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
      
      // 3. Recalculate Earnings if confirmed
      if (newStatus === 'confirmed') {
         const booking = bookings.find(b => b.id === bookingId);
         setStats(prev => ({ ...prev, earnings: prev.earnings + (Number(booking.totalPrice) || 0) }));
      }
    } catch (error) {
      alert("Failed to update booking. Please check your connection.");
      console.error(error);
    }
  };

  const handleDeleteListing = async (listingId) => {
    if(!confirm("Are you sure you want to delete this listing? This cannot be undone.")) return;
    try {
      await deleteDoc(doc(db, "properties", listingId));
      setListings(prev => prev.filter(l => l.id !== listingId));
    } catch (error) {
      alert("Failed to delete listing.");
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
  };

  if (loadingAuth || (user && loadingData)) {
    return <div className="h-screen flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin w-10 h-10 text-gray-900"/></div>;
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
      
      {/* 1. SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col justify-between fixed h-full z-20">
        <div className="p-6">
          <div className="flex items-center gap-2 font-black text-2xl tracking-tighter mb-10 text-black">
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center rounded-lg">N</div>
            NearLink
          </div>
          <nav className="space-y-1">
            <SidebarItem icon={<LayoutDashboard size={20}/>} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
            <SidebarItem icon={<Calendar size={20}/>} label="Bookings" count={bookings.filter(b => b.status === 'pending').length} active={activeTab === 'bookings'} onClick={() => setActiveTab('bookings')} />
            <SidebarItem icon={<Home size={20}/>} label="Listings" active={activeTab === 'listings'} onClick={() => setActiveTab('listings')} />
            <SidebarItem icon={<Wallet size={20}/>} label="Earnings" active={activeTab === 'earnings'} onClick={() => setActiveTab('earnings')} />
            <SidebarItem icon={<Settings size={20}/>} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
          </nav>
        </div>
        
        <div className="p-6 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600">
               {user.email?.[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-sm truncate">{user.displayName || "Host"}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-bold text-red-600 hover:bg-red-50 p-2 rounded-lg w-full transition">
            <LogOut size={16}/> Sign Out
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 overflow-y-auto">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black mb-1 capitalize text-gray-900">{activeTab}</h1>
            <p className="text-gray-500 text-sm">Welcome back, {user.displayName?.split(' ')[0] || 'Partner'}. Here is your daily brief.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/host/setup">
                <button className="bg-black text-white px-5 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-gray-800 transition shadow-lg">
                <Plus size={18}/> Create Listing
                </button>
            </Link>
            <button className="p-2.5 bg-white border border-gray-200 rounded-full hover:bg-gray-50 relative">
              <Bell size={20} className="text-gray-600"/>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
          </div>
        </header>

        {/* --- DYNAMIC TABS --- */}

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard label="Total Earnings" value={`KES ${stats.earnings.toLocaleString()}`} icon={<Wallet className="text-green-600"/>} trend="Lifetime" />
              <StatCard label="Total Bookings" value={bookings.length} icon={<Calendar className="text-blue-600"/>} trend="All time" />
              <StatCard label="Listing Views" value={stats.views} icon={<Eye className="text-purple-600"/>} trend="Last 30 days" />
            </div>

            {/* Recent Activity Table */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-lg text-gray-900">Recent Bookings</h3>
                <button onClick={() => setActiveTab('bookings')} className="text-sm font-bold text-blue-600 hover:underline">View all</button>
              </div>
              {bookings.length === 0 ? (
                <EmptyState title="No bookings yet" desc="Once guests book your properties, they will appear here." />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500">
                      <tr>
                        <th className="px-6 py-4 font-bold">Property</th>
                        <th className="px-6 py-4 font-bold">Guest</th>
                        <th className="px-6 py-4 font-bold">Dates</th>
                        <th className="px-6 py-4 font-bold">Status</th>
                        <th className="px-6 py-4 font-bold text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {bookings.slice(0, 5).map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-bold text-gray-900">{booking.propertyTitle || "Listing"}</td>
                          <td className="px-6 py-4 text-gray-600">Guest User</td>
                          <td className="px-6 py-4 text-gray-500">{booking.checkIn} - {booking.checkOut}</td>
                          <td className="px-6 py-4"><StatusBadge status={booking.status}/></td>
                          <td className="px-6 py-4 font-bold text-right">KES {Number(booking.totalPrice || 0).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: LISTINGS */}
        {activeTab === 'listings' && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            {listings.length === 0 ? (
               <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                  <Home size={48} className="mx-auto text-gray-300 mb-4"/>
                  <h3 className="text-xl font-bold text-gray-900">No properties listed</h3>
                  <p className="text-gray-500 mb-6">Get started by creating your first listing on NearLink.</p>
                  <Link href="/host/setup"><button className="bg-black text-white px-6 py-3 rounded-full font-bold">Add Property</button></Link>
               </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <div key={listing.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition group">
                    <div className="h-48 bg-gray-100 relative">
                      {/* Safe Image Access */}
                      <img 
                        src={listing.images?.[0] || listing.image || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                        alt={listing.title}
                      />
                      <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-md text-xs font-bold shadow-sm flex items-center gap-1">
                        <Star size={12} className="fill-black"/> {listing.rating || "New"}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-lg mb-1 truncate text-gray-900">{listing.title}</h3>
                      <p className="text-gray-500 text-xs flex items-center gap-1 mb-4"><MapPin size={12}/> {listing.location || listing.city || "Unknown Location"}</p>
                      <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                        <span className="font-black text-lg text-gray-900">KES {Number(listing.pricePerNight || 0).toLocaleString()}</span>
                        <div className="flex gap-2">
                          <button onClick={() => handleDeleteListing(listing.id)} className="p-2 hover:bg-red-50 rounded-full text-red-600 border border-gray-200 hover:border-red-200 transition"><XCircle size={18}/></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: BOOKINGS (Interactive) */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4">
             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 font-bold">Property</th>
                      <th className="px-6 py-4 font-bold">Guest</th>
                      <th className="px-6 py-4 font-bold">Dates</th>
                      <th className="px-6 py-4 font-bold text-center">Status</th>
                      <th className="px-6 py-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td className="px-6 py-4 font-bold text-gray-900">{booking.propertyTitle}</td>
                        <td className="px-6 py-4 text-gray-600">Guest User</td>
                        <td className="px-6 py-4 text-gray-500">{booking.checkIn} - {booking.checkOut}</td>
                        <td className="px-6 py-4 text-center"><StatusBadge status={booking.status}/></td>
                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                          {booking.status === 'pending' && (
                            <>
                              <button onClick={() => handleBookingAction(booking.id, 'confirmed')} className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-bold hover:bg-green-200 transition">Accept</button>
                              <button onClick={() => handleBookingAction(booking.id, 'cancelled')} className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-200 transition">Decline</button>
                            </>
                          )}
                          {booking.status === 'confirmed' && <span className="text-xs text-green-600 font-medium flex items-center gap-1 justify-end"><CheckCircle size={14}/> Approved</span>}
                          {booking.status === 'cancelled' && <span className="text-xs text-red-400 font-medium">Declined</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {bookings.length === 0 && <EmptyState title="No Bookings" desc="Your calendar is currently clear." />}
             </div>
          </div>
        )}

      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function SidebarItem({ icon, label, count, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`flex w-full items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${active ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
    >
      <div className="flex items-center gap-3">
        {icon}
        {label}
      </div>
      {count > 0 && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{count}</span>}
    </button>
  );
}

function StatCard({ label, value, icon, trend }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-gray-50 rounded-2xl">{icon}</div>
        <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{trend}</span>
      </div>
      <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
      <h4 className="text-3xl font-black text-gray-900">{value}</h4>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    confirmed: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200"
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border capitalize ${styles[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

function EmptyState({ title, desc }) {
  return (
    <div className="p-12 text-center">
      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
        <LayoutDashboard size={24}/>
      </div>
      <h4 className="text-lg font-bold text-gray-900">{title}</h4>
      <p className="text-gray-500 text-sm">{desc}</p>
    </div>
  );
}