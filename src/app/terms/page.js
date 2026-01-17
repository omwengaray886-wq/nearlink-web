'use client';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useState } from 'react';
import { 
  Scale, FileText, AlertTriangle, HelpCircle, 
  Check, X, DollarSign, Download
} from 'lucide-react';

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState('agreement');

  const sections = [
    { id: 'agreement', label: 'Agreement to Terms' },
    { id: 'accounts', label: 'User Accounts' },
    { id: 'bookings', label: 'Bookings & Payments' },
    { id: 'cancellation', label: 'Cancellations' },
    { id: 'prohibited', label: 'Prohibited Activities' },
    { id: 'liability', label: 'Liability & Indemnity' },
  ];

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  return (
    <main className="min-h-screen bg-white font-sans text-gray-900">
      <div className="bg-black pb-2 shadow-sm sticky top-0 z-50 border-b border-white/10">
         <Navbar theme="dark" />
      </div>

      {/* HEADER */}
      <div className="bg-gray-50 border-b border-gray-200 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                  <div>
                      <div className="flex items-center gap-2 text-nearlink-dark font-bold uppercase tracking-widest text-xs mb-4">
                          <Scale size={16}/> Legal Center
                      </div>
                      <h1 className="text-4xl md:text-5xl font-black mb-4">Terms of Service</h1>
                      <p className="text-gray-500 text-lg max-w-2xl">
                          These terms govern your use of the NearLink platform. By using NearLink, you agree to these rules.
                      </p>
                  </div>
                  <div className="flex flex-col items-start md:items-end gap-2">
                      <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                          Last Updated: Jan 14, 2026
                      </span>
                      <button className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black transition">
                          <Download size={16}/> Download PDF
                      </button>
                  </div>
              </div>
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col lg:flex-row gap-16">
          
          {/* LEFT: STICKY SIDEBAR */}
          <div className="lg:w-64 flex-shrink-0 hidden lg:block">
              <div className="sticky top-32">
                  <h3 className="font-bold text-gray-400 text-xs uppercase tracking-widest mb-6">Navigation</h3>
                  <ul className="space-y-1 border-l-2 border-gray-100">
                      {sections.map((section) => (
                          <li key={section.id}>
                              <button 
                                onClick={() => scrollTo(section.id)}
                                className={`text-sm py-2 pl-4 text-left w-full transition-all border-l-2 -ml-[2px] ${activeSection === section.id ? 'border-black text-black font-bold' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
                              >
                                  {section.label}
                              </button>
                          </li>
                      ))}
                  </ul>
              </div>
          </div>

          {/* RIGHT: CONTENT */}
          <div className="flex-1 max-w-3xl">
              
              {/* Agreement */}
              <section id="agreement" className="mb-16 scroll-mt-32">
                  <h2 className="text-2xl font-black mb-6">1. Agreement to Terms</h2>
                  <p className="text-lg text-gray-600 leading-relaxed mb-6">
                      These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and NearLink Inc. ("we", "us", or "our"), concerning your access to and use of the NearLink website and mobile application.
                  </p>
                  <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl">
                      <p className="text-sm text-yellow-800 font-medium flex gap-3">
                          <AlertTriangle className="flex-shrink-0" size={20}/>
                          By accessing the Site, you confirm that you have read, understood, and agreed to be bound by all of these Terms of Service. If you do not agree, you are expressly prohibited from using the Site.
                      </p>
                  </div>
              </section>

              <hr className="border-gray-100 my-12"/>

              {/* Accounts */}
              <section id="accounts" className="mb-16 scroll-mt-32">
                  <h2 className="text-2xl font-black mb-6">2. User Accounts</h2>
                  <p className="text-gray-600 mb-6">
                      To access certain features of the Platform, you must register for an account. You represent and warrant that:
                  </p>
                  <ul className="space-y-3 text-gray-600">
                      <li className="flex gap-3 items-start">
                          <Check className="text-green-500 mt-1 flex-shrink-0" size={18}/>
                          <span>All registration information you submit will be true, accurate, current, and complete.</span>
                      </li>
                      <li className="flex gap-3 items-start">
                          <Check className="text-green-500 mt-1 flex-shrink-0" size={18}/>
                          <span>You are at least 18 years of age.</span>
                      </li>
                      <li className="flex gap-3 items-start">
                          <Check className="text-green-500 mt-1 flex-shrink-0" size={18}/>
                          <span>You will maintain the accuracy of such information and promptly update such registration information as necessary.</span>
                      </li>
                  </ul>
              </section>

              {/* Bookings & Payments */}
              <section id="bookings" className="mb-16 scroll-mt-32">
                  <h2 className="text-2xl font-black mb-6">3. Bookings & Payments</h2>
                  <div className="space-y-6">
                      <div className="p-6 bg-gray-50 rounded-2xl">
                          <h4 className="font-bold flex items-center gap-2 mb-2"><DollarSign size={18}/> Fees</h4>
                          <p className="text-sm text-gray-600">
                              NearLink charges a service fee to Guests and/or Hosts for the use of the platform. This fee is calculated as a percentage of the booking total and is non-refundable.
                          </p>
                      </div>
                      <p className="text-gray-600">
                          <strong>Payment Processing:</strong> All payments are processed via third-party providers (including M-Pesa, Stripe, and Paystack). NearLink does not store full credit card details.
                      </p>
                  </div>
              </section>

              {/* Prohibited */}
              <section id="prohibited" className="mb-16 scroll-mt-32">
                  <h2 className="text-2xl font-black mb-6 text-red-600">4. Prohibited Activities</h2>
                  <p className="text-gray-600 mb-4">You may not access or use the Site for any purpose other than that for which we make the Site available. Prohibited activities include:</p>
                  <ul className="space-y-2 text-gray-600">
                      <li className="flex gap-3 items-center">
                          <X className="text-red-500 flex-shrink-0" size={18}/>
                          <span>Systematically retrieving data to create a database or directory without written permission.</span>
                      </li>
                      <li className="flex gap-3 items-center">
                          <X className="text-red-500 flex-shrink-0" size={18}/>
                          <span>Circumventing, disabling, or interfering with security-related features.</span>
                      </li>
                      <li className="flex gap-3 items-center">
                          <X className="text-red-500 flex-shrink-0" size={18}/>
                          <span>Using the platform to distribute unsolicited advertising or "spam".</span>
                      </li>
                  </ul>
              </section>

              {/* Contact */}
              <section className="mt-20 pt-10 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                      <div>
                          <h4 className="font-bold text-lg">Still have questions?</h4>
                          <p className="text-gray-500 text-sm">Our legal team is here to help clarify.</p>
                      </div>
                      <button className="bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-nearlink hover:text-black transition">
                          Contact Support
                      </button>
                  </div>
              </section>

          </div>
      </div>

      <Footer />
    </main>
  );
}