'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';
import { 
  Scale, FileText, AlertTriangle, Check, X, 
  DollarSign, Download, ChevronRight, Gavel, 
  Shield, Globe, Users
} from 'lucide-react';

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState('agreement');

  const sections = [
    { id: 'agreement', label: '1. Introduction' },
    { id: 'license', label: '2. Use License' },
    { id: 'accounts', label: '3. User Accounts' },
    { id: 'hosts', label: '4. Host Obligations' },
    { id: 'payments', label: '5. Payments & M-Pesa' },
    { id: 'liability', label: '6. Liability' },
    { id: 'law', label: '7. Governing Law' },
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
      <div className="bg-gray-50 border-b border-gray-200 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                  <div>
                      <div className="flex items-center gap-2 text-[#005871] font-bold uppercase tracking-widest text-xs mb-4">
                          <Scale size={16}/> Legal Center
                      </div>
                      <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Terms of Service</h1>
                      <p className="text-gray-500 text-lg max-w-2xl leading-relaxed">
                          Last updated: January 2026. Please read these terms carefully before using NearLink.
                      </p>
                  </div>
                  <div className="flex flex-col items-start md:items-end gap-2">
                      <button className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black transition border border-gray-300 px-4 py-2 rounded-lg bg-white">
                          <Download size={16}/> Download PDF
                      </button>
                  </div>
              </div>
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col lg:flex-row gap-16">
          
          {/* LEFT: STICKY SIDEBAR */}
          <div className="lg:w-72 flex-shrink-0 hidden lg:block">
              <div className="sticky top-32">
                  <h3 className="font-bold text-gray-400 text-xs uppercase tracking-widest mb-6 px-4">Table of Contents</h3>
                  <ul className="space-y-1">
                      {sections.map((section) => (
                          <li key={section.id}>
                              <button 
                                onClick={() => scrollTo(section.id)}
                                className={`text-sm py-3 px-4 text-left w-full transition-all rounded-lg flex justify-between items-center group ${activeSection === section.id ? 'bg-black text-white font-bold shadow-md' : 'text-gray-500 hover:bg-gray-100 hover:text-black'}`}
                              >
                                  {section.label}
                                  {activeSection === section.id && <ChevronRight size={14}/>}
                              </button>
                          </li>
                      ))}
                  </ul>
              </div>
          </div>

          {/* RIGHT: CONTENT */}
          <div className="flex-1 max-w-3xl space-y-20">
              
              {/* 1. Introduction */}
              <section id="agreement" className="scroll-mt-32">
                  <h2 className="text-2xl font-black mb-6 flex items-center gap-3">1. Introduction</h2>
                  <p className="text-lg text-gray-600 leading-relaxed mb-6">
                      Welcome to NearLink. By accessing our website and mobile application, you agree to be bound by these Terms of Service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl flex gap-4">
                      <Shield className="text-blue-600 flex-shrink-0" size={24}/>
                      <p className="text-sm text-blue-900 font-medium leading-relaxed">
                          If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.
                      </p>
                  </div>
              </section>

              {/* 2. Use License */}
              <section id="license" className="scroll-mt-32 border-t border-gray-100 pt-16">
                  <h2 className="text-2xl font-black mb-6">2. Use License</h2>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                      Permission is granted to temporarily download one copy of the materials (information or software) on NearLink's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                  </p>
                  <ul className="grid gap-3 pl-4">
                      <li className="flex gap-3 text-sm text-gray-600 items-center"><X size={16} className="text-red-500"/> Modify or copy the materials;</li>
                      <li className="flex gap-3 text-sm text-gray-600 items-center"><X size={16} className="text-red-500"/> Use the materials for any commercial purpose;</li>
                      <li className="flex gap-3 text-sm text-gray-600 items-center"><X size={16} className="text-red-500"/> Attempt to decompile or reverse engineer any software;</li>
                  </ul>
              </section>

              {/* 3. User Accounts */}
              <section id="accounts" className="scroll-mt-32 border-t border-gray-100 pt-16">
                  <h2 className="text-2xl font-black mb-6">3. User Accounts</h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                      To use certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
                  </p>
                  <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
                      <h4 className="font-bold flex items-center gap-2 mb-2"><Users size={18}/> Account Security</h4>
                      <p className="text-sm text-gray-600">
                          You are responsible for safeguarding your password. You agree that you will not disclose your password to any third party and that you will take sole responsibility for any activities or actions under your account.
                      </p>
                  </div>
              </section>

              {/* 4. Host Obligations */}
              <section id="hosts" className="scroll-mt-32 border-t border-gray-100 pt-16">
                  <h2 className="text-2xl font-black mb-6">4. Host Obligations</h2>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                      As a Host, you are solely responsible for setting your own price, availability, and rules for your Listing. By listing on NearLink, you represent and warrant that:
                  </p>
                  <ul className="space-y-3">
                      <li className="flex gap-3 p-4 bg-gray-50 rounded-xl items-start">
                          <div className="bg-green-100 p-1.5 rounded-full text-green-600 mt-0.5"><Check size={16}/></div>
                          <span className="text-gray-700 text-sm">Your Listing will not breach any agreements you have entered into with any third parties (e.g., homeowners association, lease agreements).</span>
                      </li>
                      <li className="flex gap-3 p-4 bg-gray-50 rounded-xl items-start">
                          <div className="bg-green-100 p-1.5 rounded-full text-green-600 mt-0.5"><Check size={16}/></div>
                          <span className="text-gray-700 text-sm">You will comply with all applicable laws, tax requirements, and other rules and regulations (including having all required permits, licenses and registrations).</span>
                      </li>
                  </ul>
              </section>

              {/* 5. Payments & M-Pesa */}
              <section id="payments" className="scroll-mt-32 border-t border-gray-100 pt-16">
                  <h2 className="text-2xl font-black mb-6 text-[#005871] flex items-center gap-2">
                      <DollarSign size={28}/> 5. Payments & M-Pesa
                  </h2>
                  <div className="space-y-6 text-gray-600 leading-relaxed">
                      <p>
                          NearLink integrates with <strong>M-Pesa</strong> for payments. By using our payment services, you agree to be bound by the Safaricom M-Pesa Terms and Conditions.
                      </p>
                      <ul className="list-disc pl-5 space-y-2">
                          <li><strong>Processing:</strong> NearLink is not a bank and does not offer banking services. We act as a limited payment collection agent.</li>
                          <li><strong>Reversals:</strong> Transaction reversals are subject to standard M-Pesa reversal policies and NearLink's internal fraud review.</li>
                          <li><strong>Fees:</strong> Standard M-Pesa transaction fees may apply in addition to NearLink service fees.</li>
                      </ul>
                  </div>
              </section>

              {/* 6. Liability */}
              <section id="liability" className="scroll-mt-32 border-t border-gray-100 pt-16">
                  <h2 className="text-2xl font-black mb-6 text-red-600 flex items-center gap-2"><AlertTriangle size={24}/> 6. Limitation of Liability</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                      In no event shall NearLink or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on NearLink's website.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                      Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.
                  </p>
              </section>

              {/* 7. Governing Law */}
              <section id="law" className="scroll-mt-32 border-t border-gray-100 pt-16 pb-20">
                  <h2 className="text-2xl font-black mb-6 flex items-center gap-2"><Gavel size={24}/> 7. Governing Law</h2>
                  <div className="bg-black text-white p-8 rounded-2xl shadow-xl">
                      <div className="flex gap-4 items-start">
                          <Globe className="mt-1 text-[#005871]" size={24}/>
                          <div>
                              <p className="text-lg font-medium leading-relaxed">
                                  These terms and conditions are governed by and construed in accordance with the laws of <strong>Kenya</strong>.
                              </p>
                              <p className="text-gray-400 mt-4 text-sm">
                                  You irrevocably submit to the exclusive jurisdiction of the courts in that State or location for the resolution of any disputes.
                              </p>
                          </div>
                      </div>
                  </div>
              </section>

          </div>
      </div>

      <Footer />
    </main>
  );
}