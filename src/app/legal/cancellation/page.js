'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';
import { 
  CalendarX, RefreshCw, ShieldAlert, CreditCard, 
  Clock, CheckCircle, XCircle, AlertTriangle, ChevronRight, Download
} from 'lucide-react';

export default function CancellationPage() {
  const [activeSection, setActiveSection] = useState('guest-policy');

  const sections = [
    { id: 'guest-policy', label: '1. Guest Cancellation Policies' },
    { id: 'host-policy', label: '2. Host Cancellations' },
    { id: 'extenuating', label: '3. Extenuating Circumstances' },
    { id: 'refunds', label: '4. Refund Timelines' },
    { id: 'nearcover', label: '5. NearCover Guarantee' },
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
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="inline-flex items-center gap-2 border border-white/20 bg-white/5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
            <RefreshCw size={12} className="text-red-400" /> Policies & Refunds
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Cancellation Policy</h1>
          <p className="text-lg text-gray-400 max-w-3xl leading-relaxed">
            Life happens. We've designed our cancellation policies to be fair to both Guests and Hosts, ensuring flexibility when you need it and protection when it counts.
          </p>
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
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="flex-1 space-y-20 max-w-4xl">
            
            {/* 1. GUEST POLICY */}
            <section id="guest-policy" className="space-y-8">
              <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                <CalendarX className="text-[#005871]" /> 1. Guest Cancellation
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Hosts set the cancellation policy for their listing. You will see the specific policy on the listing page before you book. Here are the standard tiers:
              </p>

              <div className="grid gap-6">
                {/* Flexible Tier */}
                <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-green-100 p-2 rounded-lg"><CheckCircle className="text-green-600" size={20}/></div>
                    <h3 className="font-bold text-lg text-green-900">Flexible</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-green-800">
                    <li>• Free cancellation until 24 hours before check-in.</li>
                    <li>• If cancelled within 24 hours, the first night is non-refundable.</li>
                  </ul>
                </div>

                {/* Moderate Tier */}
                <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-yellow-100 p-2 rounded-lg"><AlertTriangle className="text-yellow-600" size={20}/></div>
                    <h3 className="font-bold text-lg text-yellow-900">Moderate</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-yellow-800">
                    <li>• Free cancellation until 5 days before check-in.</li>
                    <li>• If cancelled within 5 days, 50% of the reservation cost is non-refundable.</li>
                  </ul>
                </div>

                {/* Strict Tier */}
                <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-red-100 p-2 rounded-lg"><XCircle className="text-red-600" size={20}/></div>
                    <h3 className="font-bold text-lg text-red-900">Strict</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-red-800">
                    <li>• Free cancellation for 48 hours after booking, if booked at least 14 days before check-in.</li>
                    <li>• After that, 50% refund up to 7 days before check-in. No refund after that.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 2. HOST POLICY */}
            <section id="host-policy" className="space-y-6 pt-10 border-t border-gray-100">
              <h2 className="text-3xl font-black text-gray-900">2. Host Cancellation</h2>
              <div className="prose prose-lg text-gray-600">
                <p>
                  Because cancellations disrupt guests' plans and impact confidence in the NearLink community, Hosts should fulfill all confirmed bookings. If a Host cancels:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Full Refund:</strong> The Guest will receive a 100% refund immediately.</li>
                  <li><strong>Rebooking Assistance:</strong> NearLink will assist the guest in finding comparable accommodation.</li>
                  <li><strong>Penalties:</strong> Hosts may face cancellation fees (deducted from future payouts), automated reviews indicating a cancellation, or suspension for repeated offenses.</li>
                </ul>
              </div>
            </section>

            {/* 3. EXTENUATING CIRCUMSTANCES */}
            <section id="extenuating" className="space-y-6 pt-10 border-t border-gray-100">
              <h2 className="text-3xl font-black text-gray-900">3. Extenuating Circumstances</h2>
              <p className="text-gray-600">
                In rare cases, we may waive cancellation penalties and issue refunds if the cancellation is due to an unforeseen event beyond your control.
              </p>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                <h4 className="font-bold text-sm uppercase tracking-wide text-gray-500 mb-4">Covered Events Include:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-medium">
                  <div className="flex gap-2 items-center"><ShieldAlert size={16} className="text-[#005871]"/> Government-declared emergencies</div>
                  <div className="flex gap-2 items-center"><ShieldAlert size={16} className="text-[#005871]"/> Natural disasters/Severe weather</div>
                  <div className="flex gap-2 items-center"><ShieldAlert size={16} className="text-[#005871]"/> Epidemics/Pandemics</div>
                  <div className="flex gap-2 items-center"><ShieldAlert size={16} className="text-[#005871]"/> Military actions/Civil unrest</div>
                </div>
                <p className="text-xs text-gray-400 mt-4 italic">*Documentation is required for all claims.</p>
              </div>
            </section>

            {/* 4. REFUND TIMELINES */}
            <section id="refunds" className="space-y-6 pt-10 border-t border-gray-100">
              <h2 className="text-3xl font-black text-gray-900">4. Processing Time</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl border border-gray-200 hover:border-black transition">
                  <h4 className="font-bold flex items-center gap-2 mb-2"><CreditCard size={18}/> M-Pesa / Mobile Money</h4>
                  <p className="text-3xl font-black text-[#005871] mb-2">Instant</p>
                  <p className="text-sm text-gray-500">Refunds typically reflect within 24 hours, often instantly depending on the network.</p>
                </div>
                <div className="p-6 rounded-2xl border border-gray-200 hover:border-black transition">
                  <h4 className="font-bold flex items-center gap-2 mb-2"><Clock size={18}/> Credit/Debit Card</h4>
                  <p className="text-3xl font-black text-black mb-2">5-10 Days</p>
                  <p className="text-sm text-gray-500">Dependent on your bank's processing times and international clearing.</p>
                </div>
              </div>
            </section>

            {/* 5. NEARCOVER */}
            <section id="nearcover" className="space-y-6 pt-10 border-t border-gray-100 pb-20">
              <h2 className="text-3xl font-black text-gray-900">5. NearCover Guarantee</h2>
              <div className="bg-[#005871] text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[60px] pointer-events-none"></div>
                <h3 className="text-xl font-bold mb-4 relative z-10">Did things go wrong?</h3>
                <p className="text-white/80 mb-6 relative z-10 leading-relaxed">
                  If a Host cancels within 24 hours of check-in, or if the accommodation is significantly different from the listing (e.g., missing amenities, sanitary issues), NearLink will:
                </p>
                <ul className="space-y-2 relative z-10 font-medium">
                  <li className="flex gap-2"><CheckCircle size={18} className="text-green-400"/> Rebook you at a similar or better home.</li>
                  <li className="flex gap-2"><CheckCircle size={18} className="text-green-400"/> Or refund 100% of your money.</li>
                </ul>
              </div>
            </section>

          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}