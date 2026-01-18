'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';
import { 
  Scale, FileText, AlertTriangle, HelpCircle, 
  Check, X, DollarSign, Download, ChevronRight, Gavel,
  Shield, Globe, Calendar, RefreshCw
} from 'lucide-react';

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState('agreement');

  // Scroll Spy Logic
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      const scrollY = window.scrollY;

      sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 180;
        const sectionId = current.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          setActiveSection(sectionId);
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 140,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  const sections = [
    { id: 'agreement', label: '1. Agreement to Terms' },
    { id: 'definitions', label: '2. Definitions' },
    { id: 'overview', label: '3. Platform Overview' },
    { id: 'accounts', label: '4. User Accounts' },
    { id: 'verification', label: '5. Verification' },
    { id: 'bookings', label: '6. Bookings & Fees' },
    { id: 'cancellation', label: '7. Cancellations' },
    { id: 'obligations', label: '8-9. Obligations' },
    { id: 'disputes', label: '10. Disputes & Damage' },
    { id: 'content', label: '11. Reviews & Content' },
    { id: 'prohibited', label: '12. Prohibited Activities' },
    { id: 'liability', label: '16-17. Disclaimers & Liability' },
  ];

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
                          These terms govern your access to and use of the NearLink platform. By creating an account, booking a stay, or listing a property, you agree to be legally bound by these rules.
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
          <div className="lg:w-80 flex-shrink-0 hidden lg:block">
              <div className="sticky top-32">
                  <h3 className="font-bold text-gray-400 text-xs uppercase tracking-widest mb-6 px-4">Table of Contents</h3>
                  <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-1">
                      {sections.map((section) => (
                          <button 
                            key={section.id}
                            onClick={() => scrollTo(section.id)}
                            className={`text-xs font-bold py-3 px-4 text-left w-full transition-all rounded-lg flex justify-between items-center group ${activeSection === section.id ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:bg-gray-100 hover:text-black'}`}
                          >
                              {section.label}
                              {activeSection === section.id && <ChevronRight size={12}/>}
                          </button>
                      ))}
                  </div>
              </div>
          </div>

          {/* RIGHT: CONTENT */}
          <div className="flex-1 max-w-3xl space-y-20">
              
              {/* 1. Agreement */}
              <section id="agreement" className="scroll-mt-32">
                  <h2 className="text-2xl font-black mb-6 flex items-center gap-3">1. Agreement to Terms</h2>
                  <p className="text-gray-600 leading-relaxed mb-6">
                      These Terms of Service constitute a legally binding agreement between you ("User", "Guest", or "Host") and NearLink Inc. ("we", "us"). You confirm that you have read, understood, and agreed to be bound by these Terms, our Privacy Policy, and our Trust & Safety policies.
                  </p>
                  <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl flex gap-4">
                      <AlertTriangle className="text-yellow-600 flex-shrink-0" size={24}/>
                      <p className="text-sm text-yellow-800 font-medium leading-relaxed">
                          <strong>Important:</strong> You must be at least 18 years old (or the age of legal majority in your jurisdiction) to use the Platform. If you do not agree to these Terms, you must not use NearLink.
                      </p>
                  </div>
              </section>

              {/* 2. Definitions */}
              <section id="definitions" className="scroll-mt-32 border-t border-gray-100 pt-16">
                  <h2 className="text-2xl font-black mb-6">2. Definitions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-xl">
                          <span className="font-bold block text-sm mb-1">Guest</span>
                          <span className="text-gray-600 text-xs">A user who books or intends to book a stay.</span>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl">
                          <span className="font-bold block text-sm mb-1">Host</span>
                          <span className="text-gray-600 text-xs">A user who lists or manages a property on NearLink.</span>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl">
                          <span className="font-bold block text-sm mb-1">Listing</span>
                          <span className="text-gray-600 text-xs">A property or accommodation made available for booking.</span>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl">
                          <span className="font-bold block text-sm mb-1">Service Fees</span>
                          <span className="text-gray-600 text-xs">Fees charged by NearLink for use of the Platform.</span>
                      </div>
                  </div>
              </section>

              {/* 3. Platform Overview */}
              <section id="overview" className="scroll-mt-32 border-t border-gray-100 pt-16">
                  <h2 className="text-2xl font-black mb-6">3. Platform Overview & Role</h2>
                  <p className="text-gray-600 mb-4">NearLink is a technology platform that connects Hosts and Guests. It is important to understand our role:</p>
                  <ul className="space-y-3">
                      <li className="flex gap-3 items-center text-gray-700">
                          <X className="text-red-500 flex-shrink-0" size={18}/>
                          <span>We do not own, lease, manage, or operate any properties.</span>
                      </li>
                      <li className="flex gap-3 items-center text-gray-700">
                          <X className="text-red-500 flex-shrink-0" size={18}/>
                          <span>We are not a real estate broker, travel agency, or insurer.</span>
                      </li>
                      <li className="flex gap-3 items-center text-gray-700">
                          <Check className="text-green-500 flex-shrink-0" size={18}/>
                          <span>We act solely as an intermediary facilitating bookings and payments.</span>
                      </li>
                  </ul>
              </section>

              {/* 4. Accounts */}
              <section id="accounts" className="scroll-mt-32 border-t border-gray-100 pt-16">
                  <h2 className="text-2xl font-black mb-6">4. User Accounts</h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                      By creating an account, you agree that:
                  </p>
                  <ul className="grid gap-4">
                      <li className="flex gap-4 p-4 bg-gray-50 rounded-xl items-start">
                          <div className="bg-green-100 p-1.5 rounded-full text-green-600 mt-0.5"><Check size={16}/></div>
                          <span className="text-gray-700 text-sm">All information provided is accurate and up to date.</span>
                      </li>
                      <li className="flex gap-4 p-4 bg-gray-50 rounded-xl items-start">
                          <div className="bg-green-100 p-1.5 rounded-full text-green-600 mt-0.5"><Check size={16}/></div>
                          <span className="text-gray-700 text-sm">You are responsible for all activity under your account.</span>
                      </li>
                  </ul>
              </section>

              {/* 5. Verification */}
              <section id="verification" className="scroll-mt-32 border-t border-gray-100 pt-16">
                  <h2 className="text-2xl font-black mb-6">5. Verification & Eligibility</h2>
                  <p className="text-gray-600 mb-4">NearLink may require identity, phone, email, or property verification to maintain trust and safety.</p>
                  <div className="p-4 border-l-4 border-[#005871] bg-[#005871]/5 rounded-r-xl">
                      <p className="text-sm text-gray-700">We reserve the right to restrict or deny access if verification fails or if we detect abuse.</p>
                  </div>
              </section>

              {/* 6. Bookings & Fees */}
              <section id="bookings" className="scroll-mt-32 border-t border-gray-100 pt-16">
                  <h2 className="text-2xl font-black mb-6">6. Bookings & Payments</h2>
                  
                  <div className="space-y-8">
                      <div>
                          <h4 className="font-bold text-lg mb-2">6.1 Booking Process</h4>
                          <p className="text-gray-600 text-sm">A booking is confirmed only after successful payment and host acceptance (where applicable).</p>
                      </div>

                      <div className="p-6 border border-gray-200 rounded-2xl hover:border-black transition duration-300">
                          <h4 className="font-bold flex items-center gap-2 mb-3 text-lg"><DollarSign size={20} className="text-[#005871]"/> 6.2 Payments</h4>
                          <p className="text-gray-600 leading-relaxed text-sm mb-4">
                              All payments are processed via secure third-party providers (including M-Pesa, Stripe, and Flutterwave). NearLink does not store full payment card details.
                          </p>
                          <p className="text-gray-600 leading-relaxed text-sm">
                              NearLink acts as the limited payment collection agent for the Host. Paying NearLink is considered the same as paying the Host directly.
                          </p>
                      </div>

                      <div>
                          <h4 className="font-bold text-lg mb-2">6.3 Service Fees & Taxes</h4>
                          <p className="text-gray-600 text-sm">NearLink charges service fees to Guests and/or Hosts. Fees are disclosed before checkout and are generally non-refundable. Hosts are responsible for their own tax obligations.</p>
                      </div>
                  </div>
              </section>

              {/* 7. Cancellations */}
              <section id="cancellation" className="scroll-mt-32 border-t border-gray-100 pt-16">
                  <h2 className="text-2xl font-black mb-6">7. Cancellations & Refunds</h2>
                  <p className="text-gray-600 mb-6">
                      Cancellation policies are set by the Host. NearLink facilitates refunds according to these policies but may override them in exceptional circumstances (e.g., Force Majeure).
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                          <h4 className="font-bold text-green-900 mb-1">Flexible</h4>
                          <p className="text-xs text-green-800">Full refund 24h prior.</p>
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

              {/* 8-9. Obligations */}
              <section id="obligations" className="scroll-mt-32 border-t border-gray-100 pt-16">
                  <h2 className="text-2xl font-black mb-6">8-9. User Obligations</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                          <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Globe size={20}/> Host Obligations</h3>
                          <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
                              <li>Provide accurate listing info.</li>
                              <li>Ensure properties are safe & clean.</li>
                              <li>Comply with local zoning laws.</li>
                              <li>Maintain insurance coverage.</li>
                          </ul>
                      </div>
                      <div>
                          <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Check size={20}/> Guest Obligations</h3>
                          <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
                              <li>Respect host rules & property.</li>
                              <li>Use listings for lawful purposes.</li>
                              <li>Avoid unauthorized guests.</li>
                              <li>Report damages immediately.</li>
                          </ul>
                      </div>
                  </div>
              </section>

              {/* 10. Disputes */}
              <section id="disputes" className="scroll-mt-32 border-t border-gray-100 pt-16">
                  <h2 className="text-2xl font-black mb-6">10. Property Damage & Disputes</h2>
                  <p className="text-gray-600 mb-4">Guests are responsible for damages caused during a stay. Hosts must provide evidence for claims.</p>
                  <div className="p-4 bg-gray-50 rounded-xl text-sm text-gray-600">
                      NearLink may assist in dispute resolution but does not guarantee outcomes. Decisions made by our Trust & Safety team regarding security deposits are final.
                  </div>
              </section>

              {/* 12. Prohibited */}
              <section id="prohibited" className="scroll-mt-32 border-t border-gray-100 pt-16">
                  <h2 className="text-2xl font-black mb-6 text-red-600 flex items-center gap-2"><Gavel size={24}/> 12. Prohibited Activities</h2>
                  <ul className="space-y-3">
                      <li className="flex gap-3 items-center text-gray-700">
                          <X className="text-red-500 flex-shrink-0" size={18}/>
                          <span>Engaging in fraud, scams, or impersonation.</span>
                      </li>
                      <li className="flex gap-3 items-center text-gray-700">
                          <X className="text-red-500 flex-shrink-0" size={18}/>
                          <span>Circumventing platform fees (booking off-platform).</span>
                      </li>
                      <li className="flex gap-3 items-center text-gray-700">
                          <X className="text-red-500 flex-shrink-0" size={18}/>
                          <span>Using the Platform for illegal activities (e.g., drug manufacturing).</span>
                      </li>
                      <li className="flex gap-3 items-center text-gray-700">
                          <X className="text-red-500 flex-shrink-0" size={18}/>
                          <span>Interfering with platform security or scraping data.</span>
                      </li>
                  </ul>
              </section>

              {/* 16-17. Liability */}
              <section id="liability" className="scroll-mt-32 border-t border-gray-100 pt-16">
                  <h2 className="text-2xl font-black mb-6">16-17. Disclaimers & Liability</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                      The Platform is provided "as is". NearLink does not guarantee the accuracy of listings or quality of accommodations.
                  </p>
                  <div className="bg-gray-100 p-6 rounded-2xl">
                      <p className="text-sm font-medium text-gray-800 leading-relaxed">
                          <strong>Limitation of Liability:</strong> To the maximum extent permitted by law, NearLink shall not be liable for indirect, incidental, or consequential damages. Our total liability shall not exceed the fees paid by you to NearLink in the six (6) months preceding the claim.
                      </p>
                  </div>
              </section>

              {/* Contact Block */}
              <section className="mt-20 pt-12 border-t border-gray-200">
                  <div className="bg-black text-white rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
                      <div>
                          <h4 className="font-bold text-xl mb-2">Questions about these Terms?</h4>
                          <p className="text-gray-400 text-sm">Our legal team is available to clarify any points.</p>
                      </div>
                      <div className="flex gap-4">
                          <button className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-[#005871] hover:text-white transition flex items-center gap-2">
                              <HelpCircle size={18}/> Contact Support
                          </button>
                      </div>
                  </div>
              </section>

          </div>
      </div>

      <Footer />
    </main>
  );
}