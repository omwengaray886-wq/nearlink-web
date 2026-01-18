'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
  Twitter, Instagram, Linkedin, Facebook, 
  Globe, ArrowUpRight, CheckCircle, 
  Smartphone, QrCode, Zap, Clock, ArrowUp, ChevronDown, Check
} from 'lucide-react';

// Custom TikTok Icon Component (Since it's often missing in standard sets)
const TikTokIcon = ({ size = 20, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [time, setTime] = useState('');

  // --- 1. INTERACTIVE STATE FOR DROPDOWNS ---
  const [currency, setCurrency] = useState({ code: 'KES', name: 'Shilling' });
  const [language, setLanguage] = useState('English (US)');
  
  const [showCurrency, setShowCurrency] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);

  // Options Data
  const currencies = [
    { code: 'KES', name: 'Shilling' },
    { code: 'USD', name: 'Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'Pound' },
    { code: 'ZAR', name: 'Rand' },
  ];

  const languages = [
    'English (US)', 'Kiswahili', 'Français', 'Deutsch', 'Español'
  ];

  // --- 2. CLOCK LOGIC ---
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Nairobi' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // --- 3. NEWSLETTER HANDLER ---
  const handleSubscribe = (e) => {
    e.preventDefault();
    if(!email) return;
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    }, 1500);
  };

  // --- 4. SCROLL TOP ---
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- 5. SOCIAL MEDIA LINKS (Replace with your actual URLs) ---
  const socialLinks = [
    { icon: <Twitter size={18}/>, url: "https://x.com/OmwengaRay45669" },
    { icon: <Instagram size={18}/>, url: "https://www.instagram.com/nearlinkofficial?igsh=aXFtd283ZWxqMTZo" },
    { icon: <Linkedin size={18}/>, url: "https://www.linkedin.com/in/nearlink-nearlink-b87494272?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" },
    { icon: <TikTokIcon size={18}/>, url: "https://www.tiktok.com/@nearlinkofficial?_r=1&_t=ZS-93A8v4taKmH" }, // ✅ Added TikTok
  ];

  // Site Links
  const links = {
    explore: [
      { label: 'Stays', href: '/search' },
      { label: 'Experiences', href: '/experiences' },
      { label: 'Transport', href: '/transport' },
      { label: 'Food & Dining', href: '/food' }
    ],
    company: [
      { label: 'About Us', href: '/about' }, 
      { label: 'Careers', href: '/careers' },
      { label: 'Become a Host', href: '/host' },
      { label: 'Host Academy', href: '/host/guide' },
      { label: 'Trust & Safety', href: '/safety' }
    ],
    support: [
      { label: 'Help Center', href: '/help' },
      { label: 'Login', href: '/login' },
      { label: 'Sign Up', href: '/signup' },
      { label: 'My Account', href: '/account' }
    ]
  };

  return (
    <footer className="bg-[#020202] text-white pt-24 overflow-hidden relative border-t border-white/5 font-sans">
      
      {/* BACKGROUND TEXTURE */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-transparent"></div>
      </div>

      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* --- TOP SECTION: CALL TO ACTION --- */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-16 mb-24">
            <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 rounded-full px-3 py-1 text-xs font-bold text-gray-300 mb-6 backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Live in 15 Countries
                </div>
                <h2 className="text-5xl md:text-6xl font-black mb-8 leading-tight tracking-tight">
                    Ready to explore the <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-600">unseen Africa?</span>
                </h2>
                <div className="flex flex-wrap gap-4">
                    <Link href="/signup">
                        <button className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                            Get Started <Zap size={20} className="fill-black"/>
                        </button>
                    </Link>
                    <Link href="/host">
                        <button className="group border border-white/20 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition flex items-center gap-2">
                            Become a Partner <ArrowUpRight size={20} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"/>
                        </button>
                    </Link>
                </div>
            </div>

            {/* Newsletter */}
            <div className="w-full lg:w-auto relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <div className="bg-[#0a0a0a] rounded-[1.8rem] p-8 md:p-10 relative border border-white/10">
                    <div className="relative z-10">
                        <h3 className="font-bold text-2xl mb-2">Join the inner circle</h3>
                        <p className="text-gray-400 text-sm mb-8 max-w-xs">Weekly curated travel drops, hidden gems, and exclusive partner deals.</p>
                        <form onSubmit={handleSubscribe} className="relative">
                            <input 
                                type="email" 
                                placeholder="Email address" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#151515] text-white h-14 pl-5 pr-36 rounded-xl outline-none border border-white/10 focus:border-white/30 transition placeholder:text-gray-600"
                            />
                            <button 
                                type="submit"
                                disabled={status === 'loading' || status === 'success'}
                                className={`absolute right-1.5 top-1.5 h-11 px-6 rounded-lg font-bold text-sm transition-all flex items-center justify-center ${status === 'success' ? 'bg-green-500 text-white' : 'bg-white text-black hover:bg-gray-200'}`}
                            >
                                {status === 'loading' ? (
                                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                                ) : status === 'success' ? (
                                    <CheckCircle size={18}/>
                                ) : (
                                    'Join'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        {/* --- MIDDLE SECTION: LINKS & DOWNLOAD --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-t border-white/10 pt-16 pb-16">
            <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
                {Object.entries(links).map(([category, items]) => (
                    <div key={category}>
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">{category}</h4>
                        <ul className="space-y-4">
                            {items.map((item) => (
                                <li key={item.label}>
                                    <Link href={item.href} className="group flex items-center gap-2 text-gray-400 hover:text-white transition font-medium text-sm">
                                        <span className="w-1.5 h-1.5 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="md:col-span-4 flex flex-col items-start md:items-end">
                <div className="bg-[#111] rounded-3xl p-6 border border-white/10 flex items-center gap-6 group hover:border-white/30 transition duration-500 w-full md:w-auto cursor-pointer">
                    <div className="bg-white p-3 rounded-xl shrink-0 shadow-lg group-hover:scale-110 transition">
                        <QrCode size={64} className="text-black"/>
                    </div>
                    <div>
                        <p className="font-bold text-lg mb-1 group-hover:text-blue-400 transition">Scan to download</p>
                        <p className="text-xs text-gray-400 mb-3">Available on iOS & Android</p>
                        <div className="flex gap-2">
                            <Smartphone size={16} className="text-gray-500"/>
                            <span className="text-xs font-bold text-gray-500">Super App V2.0</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- BOTTOM SECTION: INTERACTIVE FOOTER --- */}
        <div className="flex flex-col lg:flex-row justify-between items-center py-8 border-t border-white/10 text-xs text-gray-500 font-medium gap-6 pb-32">
            
            <div className="flex flex-wrap gap-6 items-center justify-center lg:justify-start">
                <span>© 2026 NearLink Inc.</span>
                <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
                <Link href="/terms" className="hover:text-white transition">Terms</Link>
                <Link href="/sitemap" className="hover:text-white transition">Sitemap</Link>
            </div>

            <div className="flex flex-wrap gap-4 items-center justify-center">
                
                {/* --- 1. LANGUAGE PICKER --- */}
                <div className="relative">
                    <button 
                        onClick={() => { setShowLanguage(!showLanguage); setShowCurrency(false); }}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition text-gray-300 hover:text-white"
                    >
                        <Globe size={14}/> {language} <ChevronDown size={12}/>
                    </button>
                    
                    {showLanguage && (
                        <div className="absolute bottom-full left-0 mb-2 w-40 bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-xl z-50">
                            {languages.map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => { setLanguage(lang); setShowLanguage(false); }}
                                    className="w-full text-left px-4 py-3 hover:bg-white/10 text-gray-300 hover:text-white flex justify-between"
                                >
                                    {lang}
                                    {language === lang && <Check size={12} className="text-green-500"/>}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* --- 2. CURRENCY PICKER --- */}
                <div className="relative">
                    <button 
                        onClick={() => { setShowCurrency(!showCurrency); setShowLanguage(false); }}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition text-gray-300 hover:text-white"
                    >
                        {currency.code} ({currency.name}) <ChevronDown size={12}/>
                    </button>

                    {showCurrency && (
                        <div className="absolute bottom-full left-0 mb-2 w-48 bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-xl z-50">
                            {currencies.map((curr) => (
                                <button
                                    key={curr.code}
                                    onClick={() => { setCurrency(curr); setShowCurrency(false); }}
                                    className="w-full text-left px-4 py-3 hover:bg-white/10 text-gray-300 hover:text-white flex justify-between"
                                >
                                    <span>{curr.code} - {curr.name}</span>
                                    {currency.code === curr.code && <Check size={12} className="text-green-500"/>}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="w-px h-4 bg-white/20 hidden lg:block"></div>

                {/* --- 3. LIVE CLOCK --- */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111] border border-white/10">
                    <Clock size={12} className="text-green-500"/>
                    <span className="text-gray-300">NBO {time}</span>
                </div>

                {/* --- 4. SOCIAL ICONS (Interactive) --- */}
                <div className="flex gap-2 ml-2">
                    {socialLinks.map((social, i) => (
                        <a 
                            key={i} 
                            href={social.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="p-2 hover:bg-white/10 rounded-full transition text-gray-400 hover:text-white"
                        >
                            {social.icon}
                        </a>
                    ))}
                </div>

                {/* Scroll to Top */}
                <button onClick={scrollToTop} className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-full hover:bg-white hover:text-black transition ml-2">
                    <ArrowUp size={14}/>
                </button>
            </div>
        </div>

        {/* MASSIVE WATERMARK */}
        <div className="relative w-full overflow-hidden h-[12vw] md:h-[10vw] flex items-center justify-center select-none pointer-events-none mt-8">
            <h1 className="text-[18vw] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white/5 to-transparent absolute -bottom-[6vw]">
                NEARLINK
            </h1>
        </div>

      </div>
    </footer>
  );
}