'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useState } from 'react';
import { 
  Scale, FileText, AlertTriangle, HelpCircle, 
  Check, X, DollarSign, Download, ChevronRight, Gavel
} from 'lucide-react';

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState('agreement');

  const sections = [
    { id: 'agreement', label: '1. Agreement to Terms' },
    { id: 'accounts', label: '2. User Accounts' },
    { id: 'bookings', label: '3. Bookings & Payments' },
    { id: 'cancellation', label: '4. Cancellation Policy' },
    { id: 'prohibited', label: '5. Prohibited Activities' },
    { id: 'liability', label: '6. Limitation of Liability' },
  ];

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 140;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(id);
    }
  };

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
                          These terms govern your use of the NearLink platform. By creating an account or booking a service, you agree to these rules.
                      </p>
                  </div>
                  <div className="flex flex-col items-start md:items-end gap-2">
                      <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                          Last Updated: Jan 14, 2026
                      </span>
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
              
              {/* 1. Agreement */}
              <section id="agreement" className="scroll-mt-32">
                  <h2 className="text-2xl font-black mb-6 flex items-center gap-3">1. Agreement to Terms</h2>
                  <p className="text-lg text-gray-600 leading-relaxed mb-6">
                      These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and NearLink Inc. ("we", "us", or "our"), concerning your access to and use of the NearLink website and mobile application.
                  </p>
                  <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl flex gap-4">
                      <AlertTriangle className="text-yellow-600 flex-shrink-0" size={24}/>
                      <p className="text-sm text-yellow-800 font-medium leading-relaxed">
                          <strong>Important:</strong> By accessing the Site, you confirm that you have read, understood, and agreed to be bound by all of these Terms of Service. If you do not agree, you are expressly prohibited from using the Site.
                      </p>
                  </div>
              </section>

              {/* 2. Accounts */}
              <section id="accounts" className="scroll-mt-32 border-t border-gray-100 pt-16">
                  <h2 className="text-2xl font-black mb-6">2. User Accounts</h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                      To access certain features of the Platform (such as booking a stay or listing a property), you must register for an account. By registering, you represent and warrant that:
                  </p>
                  <ul className="grid gap-4">
                      <li className="flex gap-4 p-4 bg-gray-50 rounded-xl items-start">
                          <div className="bg-green-100 p-1.5 rounded-full text-green-600 mt-0.5"><Check size={16}/></div>
                          <span className="text-gray-700 text-sm">All registration information you submit is true, accurate, current, and complete.</span>
                      </li>
                      <li className="flex gap-4 p-4 bg-gray-50 rounded-xl items-start">
                          <div className="bg-green-100 p-1.5 rounded-full text-green-600 mt-0.5"><Check size={16}/></div>
                          <span className="text-gray-700 text-sm">You are at least 18 years of age (or the legal age of majority in your jurisdiction).</span>
                      </li>
                      <li className="flex gap-4 p-4 bg-gray-50 rounded-xl items-start">
                          <div className="bg-green-100 p-1.5 rounded-full text-green-600 mt-0.5"><Check size={16}/></div>
                          <span className="text-gray-700 text-sm">You will maintain the security of your password and accept all risks of unauthorized access.</span>
                      </li>
                  </ul>
              </section>

              {/* 3. Bookings */}
              <section id="bookings" className="scroll-mt-32 border-t border-gray-100 pt-16">
                  <h2 className="text-2xl font-black mb-6">3. Bookings & Payments</h2>
                  <div className="space-y-6">
                      <div className="p-6 border border-gray-200 rounded-2xl hover:border-black transition duration-300">
                          <h4 className="font-bold flex items-center gap-2 mb-3 text-lg"><DollarSign size={20} className="text-[#005871]"/> Service Fees</h4>
                          <p className="text-gray-600 leading-relaxed text-sm">
                              NearLink charges a service fee to Guests and/or Hosts for the use of the platform. This fee is calculated as a percentage of the booking total and is non-refundable once a booking is confirmed.
                          </p>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                          <strong>Payment Processing:</strong> All payments are processed via secure third-party providers (including M-Pesa, Stripe, and Flutterwave). NearLink acts as the limited payment collection agent for the Host.
                      </p>
                  </div>
              </section>

              {/* 4. Cancellations */}
              <section id="cancellation" className="scroll-mt-32 border-t border-gray-100 pt-16">
                  <h2 className="text-2xl font-black mb-6">4. Cancellation Policy</h2>
                  <p className="text-gray-600 mb-6">
                      Cancellation policies are set by the Host for each listing. Standard policies include:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                          <h4 className="font-bold text-green-900 mb-1">Flexible</h4>
                          <p className="text-xs text-green-800">Full refund 24h prior to arrival.</p>
                      </div>
                      <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                          <h4 className="font-bold text-yellow-900 mb-1">Moderate</h4>
                          <p className="text-xs text-yellow-800">Full refund 5 days prior.</p>
                      </div>
                      <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                          <h4 className="font-bold text-red-900 mb-1">Strict</h4>
                          <p className="text-xs text-red-800">50% refund up to 7 days prior.</p>
                      </div>
                  </div>
              </section>

              {/* 5. Prohibited */}
              <section id="prohibited" className="scroll-mt-32 border-t border-gray-100 pt-16">
                  <h2 className="text-2xl font-black mb-6 text-red-600 flex items-center gap-2"><Gavel size={24}/> 5. Prohibited Activities</h2>
                  <p className="text-gray-600 mb-6">You may not access or use the Site for any purpose other than that for which we make the Site available. Prohibited activities include:</p>
                  <ul className="space-y-3">
                      <li className="flex gap-3 items-center text-gray-700">
                          <X className="text-red-500 flex-shrink-0" size={18}/>
                          <span>Systematically retrieving data to create a database or directory without written permission.</span>
                      </li>
                      <li className="flex gap-3 items-center text-gray-700">
                          <X className="text-red-500 flex-shrink-0" size={18}/>
                          <span>Circumventing, disabling, or interfering with security-related features of the Site.</span>
                      </li>
                      <li className="flex gap-3 items-center text-gray-700">
                          <X className="text-red-500 flex-shrink-0" size={18}/>
                          <span>Using the platform to distribute unsolicited advertising or "spam".</span>
                      </li>
                      <li className="flex gap-3 items-center text-gray-700">
                          <X className="text-red-500 flex-shrink-0" size={18}/>
                          <span>Booking a listing for someone else without their consent or knowledge.</span>
                      </li>
                  </ul>
              </section>

              {/* 6. Liability */}
              <section id="liability" className="scroll-mt-32 border-t border-gray-100 pt-16">
                  <h2 className="text-2xl font-black mb-6">6. Limitation of Liability</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                      In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the site.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                      Our liability to you for any cause whatsoever, and regardless of the form of the action, will at all times be limited to the amount paid, if any, by you to us during the six (6) month period prior to any cause of action arising.
                  </p>
              </section>

              {/* Contact Block */}
              <section className="mt-20 pt-12 border-t border-gray-200">
                  <div className="bg-black text-white rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
                      <div>
                          <h4 className="font-bold text-xl mb-2">Still have questions?</h4>
                          <p className="text-gray-400 text-sm">Our legal team is here to help clarify any confusion.</p>
                      </div>
                      <button className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-[#005871] hover:text-white transition flex items-center gap-2">
                          <HelpCircle size={18}/> Contact Support
                      </button>
                  </div>
              </section>

          </div>
      </div>

      <Footer />
    </main>
  );
}