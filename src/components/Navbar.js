'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext'; 
import { 
  Search, Menu, User, Globe, Heart, MapPin, 
  MessageSquare, Bell, LogOut, ChevronRight, 
  Sparkles, LayoutDashboard, 
  Settings, HelpCircle // ✅ FIXED: All icons are imported to prevent crashes
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSearchTab, setActiveSearchTab] = useState(null);
  const menuRef = useRef(null);

  // Close menu logic when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll logic for floating effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- DYNAMIC STYLES ---
  
  // 1. Container: Transforms from full-width to floating capsule
  const navContainerClasses = isScrolled 
    ? 'top-2 left-2 right-2 md:top-4 md:left-0 md:right-0 w-[calc(100%-16px)] md:max-w-6xl mx-auto rounded-full bg-white/90 backdrop-blur-2xl shadow-[0_8px_40px_-10px_rgba(0,0,0,0.1)] border border-white/20 py-2 px-3' 
    : 'top-0 w-full bg-transparent border-b border-transparent py-4 px-4 md:py-5 md:px-6';

  // 2. Text Color: White on top, Brand Color when scrolled
  const textColor = isScrolled ? 'text-[#005871]' : 'text-white drop-shadow-md';
  const iconColor = isScrolled ? 'text-gray-500 hover:text-[#005871]' : 'text-white/90 hover:text-white';

  // 3. Logo Filter: Invert to white on top, normal color when scrolled
  const logoFilter = isScrolled ? '' : 'brightness-0 invert drop-shadow-md';

  return (
    <div className='fixed top-0 left-0 w-full z-50 pointer-events-none'>
        {/* The Actual Nav Container */}
        <nav className={`transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] pointer-events-auto ${navContainerClasses}`}>
            <div className="flex items-center justify-between h-full">
                
                {/* 1. BRAND IDENTITY */}
                <Link href="/" className="flex items-center gap-2 md:gap-3 group pl-1 relative shrink-0">
                    <div className="relative">
                        <img 
                            src="/logo.png" 
                            alt="NearLink" 
                            className={`w-8 h-8 md:w-10 md:h-10 object-contain relative z-10 transition-all duration-300 group-hover:scale-110 ${logoFilter}`}
                            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                        />
                        {/* Fallback CSS Logo */}
                        <div className={`hidden w-8 h-8 md:w-10 md:h-10 rounded-xl items-center justify-center font-black shadow-lg transition-colors duration-300 ${isScrolled ? 'bg-[#005871] text-white' : 'bg-white text-[#005871]'}`}>
                            N
                        </div>
                    </div>
                    {/* Brand Text */}
                    <span className={`font-black text-lg md:text-xl tracking-tight hidden lg:block ${isScrolled ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'} ${textColor} transition-all duration-500`}>
                        NearLink
                    </span>
                </Link>

                {/* 2. CENTER SECTION: Search Capsule */}
                
                {/* MOBILE SEARCH ICON (Visible only on small screens) */}
                <button className={`
                    md:hidden p-2 rounded-full transition-all duration-300
                    ${isScrolled ? 'bg-gray-100 text-[#005871]' : 'bg-white/20 text-white backdrop-blur-md'}
                `}>
                    <Search size={20} strokeWidth={2.5} />
                </button>

                {/* DESKTOP SEARCH CAPSULE (Hidden on mobile) */}
                <div className={`
                    hidden md:flex items-center relative transition-all duration-500 ease-out
                    ${isScrolled ? 'scale-95' : 'scale-100'}
                `}>
                    <div className="flex items-center p-1 bg-white border border-gray-200 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_25px_rgba(0,88,113,0.15)] transition-all duration-300 group/search">
                        
                        {/* Segment: Where */}
                        <button 
                            onMouseEnter={() => setActiveSearchTab('loc')}
                            onMouseLeave={() => setActiveSearchTab(null)}
                            className="relative px-4 lg:px-6 py-2.5 text-left rounded-full hover:bg-gray-50 transition-colors group/btn"
                        >
                            <label className="block text-[10px] font-extrabold uppercase tracking-widest text-gray-400 group-hover/btn:text-[#005871] transition-colors cursor-pointer">Where</label>
                            <span className="block text-sm font-bold text-gray-900 truncate max-w-[80px] lg:max-w-[100px]">Anywhere</span>
                        </button>

                        {/* Segment: When */}
                        <button 
                            onMouseEnter={() => setActiveSearchTab('date')}
                            onMouseLeave={() => setActiveSearchTab(null)}
                            className="relative px-4 lg:px-6 py-2.5 text-left rounded-full hover:bg-gray-50 transition-colors group/btn"
                        >
                            <label className="block text-[10px] font-extrabold uppercase tracking-widest text-gray-400 group-hover/btn:text-[#005871] transition-colors cursor-pointer">When</label>
                            <span className="block text-sm font-bold text-gray-900 truncate max-w-[80px] lg:max-w-[100px]">Any week</span>
                        </button>

                        {/* Segment: Who */}
                        <button 
                            onMouseEnter={() => setActiveSearchTab('guest')}
                            onMouseLeave={() => setActiveSearchTab(null)}
                            className="relative px-4 lg:px-6 py-2.5 text-left rounded-full hover:bg-gray-50 transition-colors group/btn pr-12"
                        >
                            <label className="block text-[10px] font-extrabold uppercase tracking-widest text-gray-400 group-hover/btn:text-[#005871] transition-colors cursor-pointer">Who</label>
                            <span className="block text-sm font-medium text-gray-500 group-hover/btn:text-gray-900 truncate">Add guests</span>
                        </button>

                        {/* Search Button */}
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                            <button className="w-10 h-10 bg-[#005871] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#005871]/30 hover:scale-110 hover:shadow-[#005871]/50 transition-all duration-300">
                                <Search size={18} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* 3. RIGHT CONTROLS */}
                <div className="flex items-center gap-2 pr-1 shrink-0">
                    
                    {/* Host Link (Desktop Only) */}
                    <Link 
                        href="/host" 
                        className={`hidden xl:flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full transition-all duration-300 hover:bg-white/10 ${textColor} ${isScrolled ? 'opacity-0 w-0 px-0 overflow-hidden' : 'opacity-100 w-auto'}`}
                    >
                        Switch to Host
                    </Link>

                    {/* Globe Icon (Hidden on small mobile) */}
                    <button className={`hidden sm:block p-2.5 rounded-full hover:bg-white/10 transition ${iconColor}`}>
                        <Globe size={18} />
                    </button>

                    {/* User Profile Menu */}
                    <div className="relative" ref={menuRef}>
                        <button 
                            onClick={() => setIsOpen(!isOpen)}
                            className={`
                                flex items-center gap-2 pl-2 pr-1 py-1 md:pl-3 md:pr-1 md:py-1 rounded-full border transition-all duration-300 group
                                ${isScrolled ? 'bg-white border-gray-200' : 'bg-white/10 border-white/20 hover:bg-white/20'}
                                ${isOpen ? 'ring-2 ring-[#005871] ring-offset-2 border-transparent' : 'hover:shadow-md'}
                            `}
                        >
                            <Menu size={18} className={`${isScrolled ? 'text-gray-600' : 'text-white'} group-hover:text-[#005871] transition-colors`} />
                            <div className={`w-8 h-8 rounded-full overflow-hidden border relative ${isScrolled ? 'border-gray-100' : 'border-white/30'}`}>
                                {user?.image ? (
                                    <img src={user.image} alt="User" className="w-full h-full object-cover" />
                                ) : user ? (
                                    <div className="w-full h-full bg-[#005871] text-white flex items-center justify-center text-xs font-bold">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                        <User size={16} />
                                    </div>
                                )}
                            </div>
                        </button>

                        {/* --- DROPDOWN MENU --- */}
                        {isOpen && (
                            <div className="absolute right-0 top-12 md:top-14 w-[calc(100vw-32px)] md:w-80 bg-white rounded-3xl shadow-[0_20px_80px_-15px_rgba(0,0,0,0.2)] border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right ring-1 ring-black/5">
                                {user ? (
                                    <>
                                        {/* Dashboard Header */}
                                        <div className="p-5 bg-[#005871] relative overflow-hidden group/header cursor-pointer" onClick={() => window.location.href='/account'}>
                                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-[50px] -mr-10 -mt-10 group-hover/header:bg-white/20 transition-colors duration-500"></div>
                                            <div className="relative z-10 text-white">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded text-white/90">Member</span>
                                                    <ChevronRight size={14} className="text-white/60 group-hover/header:translate-x-1 transition-transform"/>
                                                </div>
                                                <h4 className="font-bold text-lg leading-tight truncate">{user.name || "User"}</h4>
                                                <p className="text-xs text-white/70 truncate">{user.email}</p>
                                            </div>
                                        </div>

                                        {/* Quick Grid */}
                                        <div className="grid grid-cols-2 border-b border-gray-100">
                                            <Link href="/messages" className="p-4 hover:bg-gray-50 border-r border-gray-100 text-center transition flex flex-col items-center gap-1 group">
                                                <MessageSquare size={20} className="text-gray-400 group-hover:text-[#005871] transition-colors"/>
                                                <span className="text-xs font-bold text-gray-600">Messages</span>
                                            </Link>
                                            <Link href="/trips" className="p-4 hover:bg-gray-50 text-center transition flex flex-col items-center gap-1 group">
                                                <MapPin size={20} className="text-gray-400 group-hover:text-[#005871] transition-colors"/>
                                                <span className="text-xs font-bold text-gray-600">Trips</span>
                                            </Link>
                                        </div>

                                        {/* Menu List */}
                                        <div className="p-2 space-y-0.5">
                                            <Link href="/account/wishlists" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition text-sm font-medium text-gray-700">
                                                <Heart size={16} className="text-gray-400"/> Wishlists
                                            </Link>
                                            <Link href="/host" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition text-sm font-medium text-gray-700">
                                                <LayoutDashboard size={16} className="text-gray-400"/> Manage Listings
                                            </Link>
                                            <Link href="/account" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition text-sm font-medium text-gray-700">
                                                <Settings size={16} className="text-gray-400"/> Account
                                            </Link>
                                            <div className="h-px bg-gray-100 my-1 mx-3"></div>
                                            <Link href="/help" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition text-sm text-gray-500">
                                                <HelpCircle size={16} className="text-gray-400"/> Help Center
                                            </Link>
                                            <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 transition text-sm font-bold">
                                                <LogOut size={16}/> Log out
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    // Logged Out State
                                    <div className="p-5">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-full bg-[#005871]/10 flex items-center justify-center text-[#005871]">
                                                <Sparkles size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-sm">Welcome to NearLink</h4>
                                                <p className="text-[10px] text-gray-500 font-medium">Unlock exclusive features</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Link href="/login">
                                                <button className="w-full py-2.5 bg-[#005871] hover:bg-[#004052] text-white text-sm font-bold rounded-lg transition shadow-lg shadow-[#005871]/20">
                                                    Log In
                                                </button>
                                            </Link>
                                            <Link href="/signup">
                                                <button className="w-full py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-bold rounded-lg transition">
                                                    Sign Up
                                                </button>
                                            </Link>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <Link href="/host" className="flex items-center justify-between group">
                                                <span className="text-xs font-bold text-gray-500 group-hover:text-[#005871] transition">Host your home</span>
                                                <ChevronRight size={12} className="text-gray-300 group-hover:text-[#005871] transition"/>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    </div>
  );
}