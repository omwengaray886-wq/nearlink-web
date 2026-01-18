'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';
import { 
  Shield, Lock, Eye, FileText, Server, Globe, 
  CreditCard, MapPin, UserCheck, Bell, ChevronRight, 
  Download, Activity, Scale, Fingerprint, Database
} from 'lucide-react';

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState('1');

  // Sidebar Navigation Links
  const sidebarLinks = [
    { id: '1', label: '1. Definitions & Scope' },
    { id: '2', label: '2. Data Collection Protocols' },
    { id: '3', label: '3. AI & Algorithmic Processing' },
    { id: '4', label: '4. Sharing & Disclosure' },
    { id: '5', label: '5. International Transfers' },
    { id: '6', label: '6. Security Infrastructure' },
    { id: '7', label: '7. Your Rights' },
    { id: '8', label: '8. Contact Us' },
  ];

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 140;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  // Scroll Spy Logic
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      sidebarLinks.forEach(section => {
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
    <main className="min-h-screen bg-[#F9FAFB] text-gray-900 font-sans selection:bg-[#005871] selection:text-white">
      {/* NAVBAR */}
      <div className="bg-black pb-2 shadow-sm sticky top-0 z-50 border-b border-white/10">
         <Navbar theme="dark" />
      </div>

      {/* HEADER */}
      <div className="bg-[#050505] text-white pt-24 pb-20 relative overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="inline-flex items-center gap-2 border border-white/20 bg-white/5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
            <Scale size={12} className="text-blue-400" /> Legal & Compliance
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Global Privacy Policy</h1>
          <p className="text-lg text-gray-400 max-w-3xl leading-relaxed">
            This comprehensive document details NearLink's protocols for data processing, algorithmic decision-making, and compliance with international regulations including the Kenya Data Protection Act.
          </p>
          <div className="mt-8 flex items-center gap-6 text-xs font-mono text-gray-500">
            <span>Effective: January 14, 2026</span>
            <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
            <span>Version: 3.0 (Enterprise)</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* SIDEBAR NAVIGATION (Sticky) */}
          <div className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-32 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Table of Contents</p>
              </div>
              <div className="max-h-[70vh] overflow-y-auto p-2 space-y-1">
                {sidebarLinks.map(link => (
                  <button
                    key={link.id}
                    onClick={() => scrollTo(link.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-xs font-bold transition-all flex items-center justify-between group ${
                      activeSection === link.id 
                        ? 'bg-black text-white shadow-md' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {link.label}
                    {activeSection === link.id && <ChevronRight size={12} />}
                  </button>
                ))}
              </div>
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <button className="w-full border border-gray-300 bg-white text-gray-900 px-4 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition">
                  <Download size={14}/> Download PDF
                </button>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="flex-1 space-y-20 max-w-4xl">
            
            {/* 1. DEFINITIONS */}
            <section id="1" className="space-y-6">
              <span className="text-[#005871] font-bold text-sm tracking-widest">01. PREAMBLE</span>
              <h2 className="text-3xl font-black text-gray-900">Definitions & Scope</h2>
              <div className="prose prose-lg text-gray-600">
                <p>
                  NearLink Inc. ("NearLink", "we", "us", or "our") provides a multi-sided digital platform. This Privacy Policy applies to all users of our ecosystem, including Guests, Hosts, Drivers, and Experience Providers.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 not-prose">
                  <div className="bg-white p-5 rounded-xl border border-gray-200">
                    <h4 className="font-bold text-sm mb-2 text-black">Data Controller</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">NearLink Inc. is the Data Controller for data collected directly from you (e.g., account creation, booking requests).</p>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-gray-200">
                    <h4 className="font-bold text-sm mb-2 text-black">Data Processor</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">For certain corporate services and payment processing, NearLink acts as a Data Processor.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. DATA COLLECTION */}
            <section id="2" className="space-y-6 pt-10 border-t border-gray-200">
               <span className="text-[#005871] font-bold text-sm tracking-widest">02. COLLECTION</span>
              <h2 className="text-3xl font-black text-gray-900">Data Collection Protocols</h2>
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2"><Fingerprint size={20} className="text-purple-600"/> Biometric & Identity Data</h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    To comply with Anti-Money Laundering (AML) and Know Your Customer (KYC) regulations, we collect:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                    <li><strong>Government ID:</strong> Images of National ID, Passport, or Driver's License.</li>
                    <li><strong>Facial Recognition:</strong> "Selfie" imagery used solely for liveness checks and matching against Government ID.</li>
                    <li><strong>Background Check Data:</strong> Criminal history and credit reports (where permitted by law) for Hosts and Drivers.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2"><Activity size={20} className="text-blue-600"/> Telematics & Mobility Data</h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    For our Transport and Mobility services, we collect granular sensor data:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                    <li><strong>Precise Geo-location:</strong> GPS data collected in foreground and background (for Drivers).</li>
                    <li><strong>Device Status:</strong> Battery level, signal strength, and app version to optimize dispatch algorithms.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 3. ALGORITHMIC USE */}
            <section id="3" className="space-y-6 pt-10 border-t border-gray-200">
              <span className="text-[#005871] font-bold text-sm tracking-widest">03. PROCESSING</span>
              <h2 className="text-3xl font-black text-gray-900">AI & Algorithmic Decision Making</h2>
              <p className="text-gray-600 leading-relaxed">
                NearLink utilizes proprietary machine learning models to automate decisions. You have the right to request human review of significant decisions.
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 space-y-4">
                <div className="flex gap-4">
                    <div className="shrink-0 w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center font-bold">1</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Dynamic Pricing</h4>
                        <p className="text-sm text-gray-600">Algorithms analyze supply, demand, weather, and traffic to set real-time pricing for Stays and Rides.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="shrink-0 w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center font-bold">2</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Fraud Detection</h4>
                        <p className="text-sm text-gray-600">AI models analyze payment patterns to block suspicious transactions and prevent account takeovers.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="shrink-0 w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center font-bold">3</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Search Ranking</h4>
                        <p className="text-sm text-gray-600">Listings are ranked based on user preferences, booking history, and host performance metrics.</p>
                    </div>
                </div>
              </div>
            </section>

            {/* 4. DISCLOSURE */}
            <section id="4" className="space-y-6 pt-10 border-t border-gray-200">
              <span className="text-[#005871] font-bold text-sm tracking-widest">04. DISCLOSURE</span>
              <h2 className="text-3xl font-black text-gray-900">Data Sharing Matrix</h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-100 text-gray-900 font-bold uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3 border-b">Recipient Category</th>
                            <th className="px-4 py-3 border-b">Data Types Shared</th>
                            <th className="px-4 py-3 border-b">Purpose</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        <tr>
                            <td className="px-4 py-3 font-medium">Payment Processors</td>
                            <td className="px-4 py-3 text-gray-600">Card hash, Transaction ID</td>
                            <td className="px-4 py-3 text-gray-600">PCI-DSS compliant processing.</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 font-medium">Identity Vendors</td>
                            <td className="px-4 py-3 text-gray-600">Biometric hash, ID Document</td>
                            <td className="px-4 py-3 text-gray-600">KYC/AML Verification.</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 font-medium">Law Enforcement</td>
                            <td className="px-4 py-3 text-gray-600">Metadata, Location History</td>
                            <td className="px-4 py-3 text-gray-600">Response to valid subpoenas/warrants.</td>
                        </tr>
                    </tbody>
                </table>
              </div>
            </section>

            {/* 5. CROSS-BORDER */}
            <section id="5" className="space-y-6 pt-10 border-t border-gray-200">
              <span className="text-[#005871] font-bold text-sm tracking-widest">05. INTERNATIONAL</span>
              <h2 className="text-3xl font-black text-gray-900">Cross-Border Data Transfers</h2>
              <p className="text-gray-600">
                NearLink operates globally. Your data may be transferred to, and processed in, countries other than the country in which you are resident.
              </p>
              <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl">
                <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2"><Globe size={18}/> Transfer Mechanisms</h4>
                <p className="text-sm text-blue-800">
                    We rely on <strong>Standard Contractual Clauses (SCCs)</strong> approved by relevant Data Protection Authorities to ensure your data remains protected when transferred internationally (e.g., to AWS servers).
                </p>
              </div>
            </section>

             {/* 6. SECURITY */}
             <section id="6" className="space-y-6 pt-10 border-t border-gray-200">
              <span className="text-[#005871] font-bold text-sm tracking-widest">06. SECURITY</span>
              <h2 className="text-3xl font-black text-gray-900">Security Infrastructure</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <h4 className="font-bold flex items-center gap-2"><Lock size={16} className="text-green-600"/> Encryption at Rest</h4>
                    <p className="text-xs text-gray-500">All sensitive database fields are encrypted using AES-256 standards.</p>
                </div>
                <div className="space-y-2">
                    <h4 className="font-bold flex items-center gap-2"><Shield size={16} className="text-green-600"/> Encryption in Transit</h4>
                    <p className="text-xs text-gray-500">All data transmission occurs over TLS 1.3 encrypted channels.</p>
                </div>
                <div className="space-y-2">
                    <h4 className="font-bold flex items-center gap-2"><CreditCard size={16} className="text-green-600"/> PCI-DSS Level 1</h4>
                    <p className="text-xs text-gray-500">We maintain full compliance for handling payment card data.</p>
                </div>
                <div className="space-y-2">
                    <h4 className="font-bold flex items-center gap-2"><Eye size={16} className="text-green-600"/> Access Controls</h4>
                    <p className="text-xs text-gray-500">Strict Principle of Least Privilege (PoLP) for internal employee access.</p>
                </div>
              </div>
            </section>

            {/* 7. RIGHTS */}
            <section id="7" className="space-y-6 pt-10 border-t border-gray-200">
               <span className="text-[#005871] font-bold text-sm tracking-widest">07. RIGHTS</span>
               <h2 className="text-3xl font-black text-gray-900">Your Data Rights</h2>
               <p className="text-gray-600">You have the right to access, rectify, or delete your personal data.</p>
               <ul className="space-y-2 text-sm text-gray-600 list-disc pl-5">
                 <li><strong>Right to Access:</strong> Request a copy of all data we hold about you.</li>
                 <li><strong>Right to Rectification:</strong> Correct inaccurate data in your profile settings.</li>
                 <li><strong>Right to Erasure:</strong> Request deletion of your account (subject to legal retention periods).</li>
               </ul>
            </section>

             {/* 8. CONTACT */}
             <section id="8" className="space-y-6 pt-10 border-t border-gray-200 pb-20">
              <h2 className="text-3xl font-black text-gray-900">Legal Contact</h2>
              <div className="bg-[#050505] text-white p-8 rounded-2xl shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h4 className="text-lg font-bold mb-4">Data Protection Officer (DPO)</h4>
                        <p className="text-gray-400 text-sm mb-4">For specific inquiries regarding your data rights, deletion requests, or regulatory compliance.</p>
                        <a href="mailto:dpo@nearlink.com" className="text-white font-bold underline decoration-[#005871] decoration-2">dpo@nearlink.com</a>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold mb-4">Mailing Address</h4>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            NearLink Inc. Legal Dept.<br/>
                            West Park Towers, 6th Floor<br/>
                            Westlands, Nairobi, Kenya
                        </p>
                    </div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}