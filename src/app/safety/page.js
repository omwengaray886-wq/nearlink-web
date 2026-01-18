'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useState } from 'react';
import { 
  ShieldCheck, Lock, UserCheck, Phone, HeartHandshake, 
  AlertTriangle, CheckCircle, Eye, CreditCard, ChevronRight,
  Umbrella, Gavel, Search, MapPin, Database, Smartphone, 
  RefreshCw, Mail, Activity
} from 'lucide-react';

export default function SafetyPage() {
  const [activeTab, setActiveTab] = useState('guest'); // 'guest' or 'host'

  return (
    <main className="min-h-screen bg-white font-sans text-gray-900 selection:bg-[#005871] selection:text-white">
      {/* NAVBAR */}
      <div className="bg-black pb-2 shadow-sm sticky top-0 z-50 border-b border-white/10">
         <Navbar theme="dark" />
      </div>

      {/* 1. CINEMATIC HERO: PHILOSOPHY */}
      <div className="relative bg-[#050505] text-white py-32 overflow-hidden">
          {/* Abstract Background */}
          <div className="absolute inset-0 opacity-20">
              <div className="absolute -right-20 -top-20 w-[600px] h-[600px] bg-[#005871] rounded-full blur-[150px]"></div>
              <div className="absolute -left-20 -bottom-20 w-[500px] h-[500px] bg-blue-900 rounded-full blur-[150px]"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
              <div className="inline-flex items-center gap-2 border border-white/20 bg-white/5 rounded-full px-4 py-2 text-xs font-bold text-[#005871] mb-8 uppercase tracking-widest backdrop-blur-md">
                  <ShieldCheck size={14} /> Trust & Safety
              </div>
              <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
                  Built on Trust. <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Secured by Technology.</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                  Our goal is to create a reliable, transparent, and secure platform where guests can book with confidence and hosts can welcome guests with peace of mind.
              </p>
          </div>
      </div>

      {/* 2. THE FOUR CORE PRINCIPLES */}
      <div className="bg-[#0a0a0a] border-b border-white/10 py-16">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                  { title: "Prevention", desc: "Stopping fraud & abuse before it happens.", icon: Activity },
                  { title: "Protection", desc: "Safeguarding users, properties & payments.", icon: ShieldCheck },
                  { title: "Transparency", desc: "Clear policies & honest communication.", icon: Eye },
                  { title: "Response", desc: "Fast & fair handling of issues.", icon: Phone }
              ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center text-center p-4">
                      <div className="w-12 h-12 rounded-full bg-[#005871]/20 flex items-center justify-center text-[#005871] mb-4">
                          <item.icon size={24}/>
                      </div>
                      <h3 className="text-white font-bold mb-2">{item.title}</h3>
                      <p className="text-gray-500 text-sm">{item.desc}</p>
                  </div>
              ))}
          </div>
      </div>

      {/* 3. INTERACTIVE ROLE SWITCHER (VERIFICATION & PROTECTION) */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2 flex justify-center max-w-md mx-auto">
              <button 
                onClick={() => setActiveTab('guest')}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'guest' ? 'bg-black text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                  I am a Guest
              </button>
              <button 
                onClick={() => setActiveTab('host')}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'host' ? 'bg-black text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                  I am a Host
              </button>
          </div>
      </div>

      {/* DYNAMIC CONTENT AREA */}
      <div className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
              
              {/* GUEST VIEW */}
              {activeTab === 'guest' && (
                  <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 space-y-16">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                          <div>
                              <h2 className="text-3xl font-black mb-6">Guest Verification & Protection</h2>
                              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                  We apply strict verification measures to ensure every account is real. Guests are required to verify email, phone, and use secure authentication.
                              </p>
                              <ul className="space-y-4">
                                  <li className="flex gap-4">
                                      <div className="bg-green-100 p-2 rounded-full h-fit text-green-700"><CheckCircle size={20}/></div>
                                      <div>
                                          <h4 className="font-bold text-gray-900">Clear Booking Confirmation</h4>
                                          <p className="text-sm text-gray-500">Know exactly what you are paying for before completion.</p>
                                      </div>
                                  </li>
                                  <li className="flex gap-4">
                                      <div className="bg-green-100 p-2 rounded-full h-fit text-green-700"><Search size={20}/></div>
                                      <div>
                                          <h4 className="font-bold text-gray-900">Scam Detection</h4>
                                          <p className="text-sm text-gray-500">Automated systems block fake accounts and unusual booking behavior.</p>
                                      </div>
                                  </li>
                                  <li className="flex gap-4">
                                      <div className="bg-green-100 p-2 rounded-full h-fit text-green-700"><RefreshCw size={20}/></div>
                                      <div>
                                          <h4 className="font-bold text-gray-900">Fair Refunds</h4>
                                          <p className="text-sm text-gray-500">Transparent cancellation policies if a stay does not match its listing.</p>
                                      </div>
                                  </li>
                              </ul>
                          </div>
                          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                              <h3 className="font-bold text-xl mb-6 flex items-center gap-2"><CreditCard className="text-[#005871]"/> Payment Security</h3>
                              <div className="space-y-4 text-sm text-gray-600">
                                  <p>All payments are processed through PCI-DSS compliant partners.</p>
                                  <ul className="list-disc pl-5 space-y-2">
                                      <li>End-to-end encrypted transactions.</li>
                                      <li>Secure tokenization of payment data.</li>
                                      <li>No storage of full card details on NearLink servers.</li>
                                  </ul>
                                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl text-yellow-800 text-xs font-bold mt-4">
                                      ⚠️ Important: NearLink will never ask you to send money outside the app.
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              )}

              {/* HOST VIEW */}
              {activeTab === 'host' && (
                  <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 space-y-16">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                          <div className="order-2 lg:order-1">
                              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                                  <h3 className="font-bold text-xl mb-6 flex items-center gap-2"><UserCheck className="text-[#005871]"/> Strict Host Verification</h3>
                                  <div className="space-y-4 text-sm text-gray-600">
                                      <p>Hosts undergo a stricter process because they manage real properties.</p>
                                      <ul className="list-disc pl-5 space-y-2">
                                          <li>Email and phone verification.</li>
                                          <li>Confirmation of property ownership/management rights.</li>
                                          <li>Identity or business verification where required.</li>
                                      </ul>
                                  </div>
                              </div>
                          </div>
                          <div className="order-1 lg:order-2">
                              <h2 className="text-3xl font-black mb-6">Listing Review & Approval</h2>
                              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                  Every property is reviewed before going live. We check for photo authenticity, correct location details, and transparent pricing.
                              </p>
                              <ul className="space-y-4">
                                  <li className="flex gap-4">
                                      <div className="bg-blue-50 p-2 rounded-full h-fit text-blue-600"><Gavel size={20}/></div>
                                      <div>
                                          <h4 className="font-bold text-gray-900">House Rules Enforcement</h4>
                                          <p className="text-sm text-gray-500">Clear support in case of disputes or misuse of property.</p>
                                      </div>
                                  </li>
                                  <li className="flex gap-4">
                                      <div className="bg-blue-50 p-2 rounded-full h-fit text-blue-600"><Shield size={20}/></div>
                                      <div>
                                          <h4 className="font-bold text-gray-900">Fraud Protection</h4>
                                          <p className="text-sm text-gray-500">Protection against fraudulent bookings and payment chargebacks.</p>
                                      </div>
                                  </li>
                              </ul>
                          </div>
                      </div>
                  </div>
              )}
          </div>
      </div>

      {/* 4. DETAILED SAFETY STANDARDS GRID */}
      <div className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-3xl font-black mb-12 text-center">Comprehensive Safety Standards</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  
                  {/* Reviews */}
                  <div className="p-8 border border-gray-100 rounded-2xl hover:border-[#005871] transition group">
                      <HeartHandshake className="text-[#005871] mb-4" size={32}/>
                      <h3 className="font-bold text-lg mb-3">Reviews & Integrity</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">
                          Only verified stays can leave reviews. We use automated moderation to remove fake, abusive, or incentivized reviews to ensure genuine feedback.
                      </p>
                  </div>

                  {/* Fraud */}
                  <div className="p-8 border border-gray-100 rounded-2xl hover:border-[#005871] transition group">
                      <AlertTriangle className="text-[#005871] mb-4" size={32}/>
                      <h3 className="font-bold text-lg mb-3">Fraud & Abuse Prevention</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">
                          We actively monitor for scams, impersonation, and payment fraud using automated risk detection and manual review teams.
                      </p>
                  </div>

                  {/* App Security */}
                  <div className="p-8 border border-gray-100 rounded-2xl hover:border-[#005871] transition group">
                      <Smartphone className="text-[#005871] mb-4" size={32}/>
                      <h3 className="font-bold text-lg mb-3">App & Platform Security</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">
                          We use modern security technologies including HTTPS/TLS encryption, secure session management, and continuous system monitoring.
                      </p>
                  </div>

                  {/* Data Privacy */}
                  <div className="p-8 border border-gray-100 rounded-2xl hover:border-[#005871] transition group">
                      <Database className="text-[#005871] mb-4" size={32}/>
                      <h3 className="font-bold text-lg mb-3">Data Privacy</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">
                          We collect only necessary info, encrypt sensitive data, and never sell personal data to third parties. See our Privacy Policy for details.
                      </p>
                  </div>

                  {/* Community Standards */}
                  <div className="p-8 border border-gray-100 rounded-2xl hover:border-[#005871] transition group">
                      <CheckCircle className="text-[#005871] mb-4" size={32}/>
                      <h3 className="font-bold text-lg mb-3">Community Standards</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">
                          Users must provide honest info, treat others with respect, and follow local laws. Harassment or discrimination results in immediate suspension.
                      </p>
                  </div>

                  {/* Enforcement */}
                  <div className="p-8 border border-gray-100 rounded-2xl hover:border-[#005871] transition group">
                      <Gavel className="text-[#005871] mb-4" size={32}/>
                      <h3 className="font-bold text-lg mb-3">Enforcement</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">
                          We enforce policies consistently. Actions include listing removal, account suspension, or withholding payouts in confirmed fraud cases.
                      </p>
                  </div>

              </div>
          </div>
      </div>

      {/* 5. INCIDENT REPORTING & CONTACT */}
      <div className="bg-[#050505] text-white py-24">
          <div className="max-w-4xl mx-auto px-6 text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Phone size={32}/>
              </div>
              <h2 className="text-3xl font-black mb-4">Incident Reporting & Support</h2>
              <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                  If something goes wrong, report issues directly within the app or contact our Trust & Safety team. All reports are treated confidentially and reviewed promptly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <a href="mailto:support@nearlink.co" className="bg-[#005871] text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 hover:bg-[#00485d] transition">
                      <Mail size={20}/> Email Trust & Safety
                  </a>
                  <button className="text-gray-400 text-sm hover:text-white underline decoration-1 underline-offset-4">
                      In urgent situations, contact local emergency services.
                  </button>
              </div>
          </div>
      </div>

      <Footer />
    </main>
  );
}