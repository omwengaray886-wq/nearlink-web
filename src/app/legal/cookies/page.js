'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';
import { 
  Cookie, Info, Settings, Shield, BarChart, 
  Globe, ToggleRight, ChevronRight, Download, Eye
} from 'lucide-react';

export default function CookiesPage() {
  const [activeSection, setActiveSection] = useState('what-are-cookies');

  const sections = [
    { id: 'what-are-cookies', label: '1. What are Cookies?' },
    { id: 'categories', label: '2. Cookie Categories' },
    { id: 'third-party', label: '3. Third-Party Technologies' },
    { id: 'management', label: '4. Managing Preferences' },
    { id: 'updates', label: '5. Updates to Policy' },
  ];

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 140;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  // Scroll Spy
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      sections.forEach(section => {
        const element = document.getElementById(section.id);
        if (element) {
          const offsetTop = element.offsetTop - 180;
          const offsetBottom = offsetTop + element.offsetHeight;
          if (scrollY >= offsetTop && scrollY < offsetBottom) {
            setActiveSection(section.id);
          }
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-white font-sans text-gray-900 selection:bg-[#005871] selection:text-white">
      {/* NAVBAR */}
      <div className="bg-black pb-2 shadow-sm sticky top-0 z-50 border-b border-white/10">
         <Navbar theme="dark" />
      </div>

      {/* HEADER */}
      <div className="bg-[#050505] text-white pt-24 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-900/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="inline-flex items-center gap-2 border border-white/20 bg-white/5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
            <Cookie size={12} className="text-orange-400" /> Tracking & Privacy
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Cookie Policy</h1>
          <p className="text-lg text-gray-400 max-w-3xl leading-relaxed">
            We believe in transparency. This policy details how NearLink uses cookies, pixels, and local storage to personalize your experience and secure your account.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 text-xs font-mono text-gray-500">
            <span>Last Updated: January 14, 2026</span>
            <span className="hidden sm:inline">•</span>
            <span>Applies to: Web, iOS, Android</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* SIDEBAR NAVIGATION (Sticky) */}
          <div className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-32 bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Table of Contents</p>
              </div>
              <div className="p-2 space-y-1">
                {sections.map(link => (
                  <button
                    key={link.id}
                    onClick={() => scrollTo(link.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-xs font-bold transition-all flex items-center justify-between group ${
                      activeSection === link.id 
                        ? 'bg-black text-white shadow-md' 
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {link.label}
                    {activeSection === link.id && <ChevronRight size={12} />}
                  </button>
                ))}
              </div>
              <div className="p-4 border-t border-gray-200 bg-white">
                <button className="w-full border border-gray-300 bg-white text-gray-900 px-4 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition">
                  <Settings size={14}/> Open Cookie Settings
                </button>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="flex-1 space-y-20 max-w-4xl">
            
            {/* 1. DEFINITIONS */}
            <section id="what-are-cookies" className="space-y-6">
              <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                <Info className="text-[#005871]" /> 1. What are Cookies?
              </h2>
              <div className="prose prose-lg text-gray-600">
                <p>
                  Cookies are small text files that are placed on your device (computer, smartphone, or tablet) when you visit a website. They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 not-prose">
                  <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                    <h4 className="font-bold text-sm mb-2 text-gray-900">Session Cookies</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">Temporary cookies that expire once you close your browser. Used for things like keeping you logged in while you navigate.</p>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                    <h4 className="font-bold text-sm mb-2 text-gray-900">Persistent Cookies</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">Remain on your device for a set period or until you delete them. Used to remember your language preferences or currency.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. CATEGORIES */}
            <section id="categories" className="space-y-8 pt-10 border-t border-gray-100">
              <h2 className="text-3xl font-black text-gray-900">2. Cookie Categories</h2>
              <p className="text-gray-600">We categorize the cookies we use into four main groups:</p>

              <div className="space-y-4">
                {/* Strictly Necessary */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-lg text-green-700"><Shield size={20}/></div>
                      <h3 className="font-bold text-lg text-gray-900">Strictly Necessary</h3>
                    </div>
                    <span className="text-[10px] font-bold uppercase bg-gray-100 px-2 py-1 rounded text-gray-500">Always Active</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Essential for the website to function. They enable core functionality such as security, network management, and accessibility. You cannot switch these off.
                  </p>
                  <p className="text-xs text-gray-400 font-mono">Examples: CSRF Token, Session ID, Auth Token</p>
                </div>

                {/* Performance */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-700"><BarChart size={20}/></div>
                    <h3 className="font-bold text-lg text-gray-900">Performance & Analytics</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    These allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us know which pages are the most and least popular.
                  </p>
                  <p className="text-xs text-gray-400 font-mono">Examples: Google Analytics (GA4), Mixpanel</p>
                </div>

                {/* Functional */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-purple-100 p-2 rounded-lg text-purple-700"><Globe size={20}/></div>
                    <h3 className="font-bold text-lg text-gray-900">Functional</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added.
                  </p>
                  <p className="text-xs text-gray-400 font-mono">Examples: Language Preference, Currency Selection</p>
                </div>

                {/* Targeting */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-orange-100 p-2 rounded-lg text-orange-700"><Eye size={20}/></div>
                    <h3 className="font-bold text-lg text-gray-900">Targeting & Advertising</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Used to build a profile of your interests and show you relevant adverts on other sites. They do not store directly personal information but are based on uniquely identifying your browser and internet device.
                  </p>
                  <p className="text-xs text-gray-400 font-mono">Examples: Meta Pixel, Google Ads</p>
                </div>
              </div>
            </section>

            {/* 3. THIRD PARTY */}
            <section id="third-party" className="space-y-6 pt-10 border-t border-gray-100">
              <h2 className="text-3xl font-black text-gray-900">3. Third-Party Technologies</h2>
              <p className="text-gray-600 leading-relaxed">
                In addition to our own cookies, we may also use various third-parties to report usage statistics of the Service, deliver advertisements on and through the Service, and so on.
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-50 text-gray-900 font-bold uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3 border-b">Provider</th>
                            <th className="px-4 py-3 border-b">Purpose</th>
                            <th className="px-4 py-3 border-b">Policy Link</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        <tr>
                            <td className="px-4 py-3 font-bold">Google</td>
                            <td className="px-4 py-3 text-gray-600">Analytics & Maps</td>
                            <td className="px-4 py-3"><a href="#" className="text-[#005871] underline">View Policy</a></td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 font-bold">Stripe</td>
                            <td className="px-4 py-3 text-gray-600">Fraud Detection</td>
                            <td className="px-4 py-3"><a href="#" className="text-[#005871] underline">View Policy</a></td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 font-bold">Cloudflare</td>
                            <td className="px-4 py-3 text-gray-600">Security & CDN</td>
                            <td className="px-4 py-3"><a href="#" className="text-[#005871] underline">View Policy</a></td>
                        </tr>
                    </tbody>
                </table>
              </div>
            </section>

            {/* 4. MANAGEMENT */}
            <section id="management" className="space-y-6 pt-10 border-t border-gray-100">
              <h2 className="text-3xl font-black text-gray-900">4. Managing Preferences</h2>
              <p className="text-gray-600">
                You can change your cookie preferences at any time by clicking the "Cookie Settings" button below. You can also block cookies by activating the setting on your browser that allows you to refuse the setting of all or some cookies.
              </p>
              
              <div className="bg-gray-100 p-6 rounded-2xl">
                <h4 className="font-bold text-gray-900 mb-4">Browser Instructions:</h4>
                <div className="flex flex-wrap gap-4">
                    <a href="#" className="px-4 py-2 bg-white rounded-lg text-xs font-bold text-gray-600 hover:text-black hover:shadow-sm transition">Chrome</a>
                    <a href="#" className="px-4 py-2 bg-white rounded-lg text-xs font-bold text-gray-600 hover:text-black hover:shadow-sm transition">Safari</a>
                    <a href="#" className="px-4 py-2 bg-white rounded-lg text-xs font-bold text-gray-600 hover:text-black hover:shadow-sm transition">Firefox</a>
                    <a href="#" className="px-4 py-2 bg-white rounded-lg text-xs font-bold text-gray-600 hover:text-black hover:shadow-sm transition">Edge</a>
                </div>
              </div>
            </section>

            {/* 5. UPDATES */}
            <section id="updates" className="space-y-6 pt-10 border-t border-gray-100 pb-20">
              <h2 className="text-3xl font-black text-gray-900">5. Updates to Policy</h2>
              <p className="text-gray-600">
                We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
              </p>
            </section>

          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}