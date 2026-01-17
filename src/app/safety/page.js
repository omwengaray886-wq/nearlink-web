'use client';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useState } from 'react';
import { 
  ShieldCheck, Lock, UserCheck, Phone, HeartHandshake, 
  AlertTriangle, CheckCircle, Eye, CreditCard, ChevronRight,
  Umbrella, Gavel, Search
} from 'lucide-react';

export default function SafetyPage() {
  const [activeTab, setActiveTab] = useState('guest'); // 'guest' or 'host'

  return (
    <main className="min-h-screen bg-white font-sans text-gray-900 selection:bg-nearlink selection:text-black">
      <div className="bg-black pb-2 shadow-sm sticky top-0 z-50 border-b border-white/10">
         <Navbar theme="dark" />
      </div>

      {/* 1. CINEMATIC HERO */}
      <div className="relative bg-[#050505] text-white py-32 overflow-hidden">
          {/* Abstract Background */}
          <div className="absolute inset-0 opacity-20">
              <div className="absolute -right-20 -top-20 w-[600px] h-[600px] bg-nearlink rounded-full blur-[150px]"></div>
              <div className="absolute -left-20 -bottom-20 w-[500px] h-[500px] bg-blue-900 rounded-full blur-[150px]"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
              <div className="inline-flex items-center gap-2 border border-white/20 bg-white/5 rounded-full px-4 py-2 text-xs font-bold text-nearlink mb-8 uppercase tracking-widest backdrop-blur-md">
                  <ShieldCheck size={14} /> Trust & Safety Center
              </div>
              <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
                  Safety isn't a feature. <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">It's our foundation.</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                  We have engineered a multi-layered defense system combining AI fraud detection, biometric verification, and human rapid-response teams to keep you safe.
              </p>
          </div>
      </div>

      {/* 2. INTERACTIVE TOGGLE SECTION */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2 flex justify-center max-w-md mx-auto">
              <button 
                onClick={() => setActiveTab('guest')}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'guest' ? 'bg-black text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                  I am a Traveler
              </button>
              <button 
                onClick={() => setActiveTab('host')}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'host' ? 'bg-black text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                  I am a Host
              </button>
          </div>
      </div>

      {/* 3. DYNAMIC CONTENT AREA */}
      <div className="py-24">
          <div className="max-w-7xl mx-auto px-6">
              
              {/* GUEST VIEW */}
              {activeTab === 'guest' && (
                  <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 space-y-24">
                      
                      {/* Section A: Verification */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                          <div>
                              <h2 className="text-3xl font-black mb-6">Know exactly who you're staying with.</h2>
                              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                  Every host on NearLink goes through a rigorous vetting process. We don't just check email addresses; we verify real-world identities.
                              </p>
                              <ul className="space-y-4">
                                  <li className="flex gap-4">
                                      <div className="bg-green-100 p-2 rounded-full h-fit text-green-700"><UserCheck size={20}/></div>
                                      <div>
                                          <h4 className="font-bold text-gray-900">Government ID Check</h4>
                                          <p className="text-sm text-gray-500">We scan passports and National IDs against global databases.</p>
                                      </div>
                                  </li>
                                  <li className="flex gap-4">
                                      <div className="bg-green-100 p-2 rounded-full h-fit text-green-700"><Eye size={20}/></div>
                                      <div>
                                          <h4 className="font-bold text-gray-900">Liveness Detection</h4>
                                          <p className="text-sm text-gray-500">Hosts must take a live selfie to prove they match their ID.</p>
                                      </div>
                                  </li>
                                  <li className="flex gap-4">
                                      <div className="bg-green-100 p-2 rounded-full h-fit text-green-700"><Phone size={20}/></div>
                                      <div>
                                          <h4 className="font-bold text-gray-900">Phone Verification</h4>
                                          <p className="text-sm text-gray-500">Active mobile numbers linked to M-Pesa verified via OTP.</p>
                                      </div>
                                  </li>
                              </ul>
                          </div>
                          <div className="bg-gray-100 rounded-3xl p-8 relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-64 h-64 bg-nearlink/20 rounded-full blur-[80px]"></div>
                              {/* Visual representation of a verified profile card */}
                              <div className="bg-white p-6 rounded-2xl shadow-xl relative z-10 max-w-sm mx-auto transform rotate-2 hover:rotate-0 transition duration-500">
                                  <div className="flex items-center gap-4 mb-4">
                                      <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
                                          <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200" className="w-full h-full object-cover"/>
                                      </div>
                                      <div>
                                          <h3 className="font-bold text-lg">Sarah M.</h3>
                                          <div className="flex items-center gap-1 text-green-600 text-xs font-bold uppercase tracking-wide">
                                              <ShieldCheck size={14}/> Identity Verified
                                          </div>
                                      </div>
                                  </div>
                                  <div className="space-y-2">
                                      <div className="h-2 bg-gray-100 rounded w-full"></div>
                                      <div className="h-2 bg-gray-100 rounded w-3/4"></div>
                                  </div>
                                  <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                                      <span className="text-xs text-gray-400">Joined 2024</span>
                                      <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded">Superhost</span>
                                  </div>
                              </div>
                          </div>
                      </div>

                      {/* Section B: Financial Safety */}
                      <div className="bg-black text-white rounded-[3rem] p-12 md:p-16 relative overflow-hidden">
                          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                              <div>
                                  <h2 className="text-3xl font-black mb-6">Payment Protection</h2>
                                  <p className="text-gray-400 mb-8 leading-relaxed">
                                      We hold your payment in a secure escrow account. The host effectively doesn't get paid until 24 hours after you successfully check in.
                                  </p>
                                  <button className="bg-white text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-nearlink transition">
                                      Learn about Refund Policy <ChevronRight size={18}/>
                                  </button>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                  <div className="bg-white/10 p-6 rounded-2xl border border-white/10">
                                      <Lock className="text-nearlink mb-4" size={32}/>
                                      <h4 className="font-bold text-lg">Secure Escrow</h4>
                                      <p className="text-xs text-gray-400 mt-2">Funds are safely held until check-in is verified.</p>
                                  </div>
                                  <div className="bg-white/10 p-6 rounded-2xl border border-white/10">
                                      <AlertTriangle className="text-red-500 mb-4" size={32}/>
                                      <h4 className="font-bold text-lg">Scam Protection</h4>
                                      <p className="text-xs text-gray-400 mt-2">Never pay outside the app. We protect on-platform payments.</p>
                                  </div>
                              </div>
                          </div>
                      </div>

                  </div>
              )}

              {/* HOST VIEW */}
              {activeTab === 'host' && (
                  <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 space-y-24">
                      
                      {/* Section A: NearCover */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                          <div className="order-2 lg:order-1">
                              <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 border border-gray-200 shadow-xl relative">
                                  <div className="absolute top-6 right-6 text-nearlink"><Umbrella size={48} strokeWidth={1}/></div>
                                  <h3 className="text-2xl font-black mb-2 flex items-center gap-2">NearCover <span className="bg-black text-white text-[10px] px-2 py-1 rounded">INCLUDED</span></h3>
                                  <p className="text-gray-500 text-sm mb-8">Top-to-bottom protection for every booking.</p>
                                  
                                  <div className="space-y-4">
                                      <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                          <span className="font-bold text-gray-700">Liability Protection</span>
                                          <span className="font-black text-black">$1,000,000</span>
                                      </div>
                                      <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                          <span className="font-bold text-gray-700">Damage Protection</span>
                                          <span className="font-black text-black">$1,000,000</span>
                                      </div>
                                      <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                          <span className="font-bold text-gray-700">Pet Damage</span>
                                          <span className="font-black text-black">Covered</span>
                                      </div>
                                      <div className="flex justify-between items-center">
                                          <span className="font-bold text-gray-700">Income Loss</span>
                                          <span className="font-black text-black">Covered</span>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <div className="order-1 lg:order-2">
                              <h2 className="text-3xl font-black mb-6">Host with confidence. <br/> We've got your back.</h2>
                              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                  Accidents happen. That's why we built NearCover. It provides $1M in damage protection and $1M in liability insurance for every single booking, at no extra cost to you.
                              </p>
                              <div className="flex flex-col gap-4">
                                  <div className="flex gap-4">
                                      <div className="bg-blue-50 p-2 rounded-full h-fit text-blue-600"><Gavel size={20}/></div>
                                      <div>
                                          <h4 className="font-bold text-gray-900">Dispute Resolution</h4>
                                          <p className="text-sm text-gray-500">A dedicated team to handle claims fairly and quickly.</p>
                                      </div>
                                  </div>
                                  <div className="flex gap-4">
                                      <div className="bg-blue-50 p-2 rounded-full h-fit text-blue-600"><Search size={20}/></div>
                                      <div>
                                          <h4 className="font-bold text-gray-900">Guest Screening</h4>
                                          <p className="text-sm text-gray-500">Our AI flags high-risk bookings before they happen.</p>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>

                  </div>
              )}

          </div>
      </div>

      {/* 4. 24/7 SUPPORT BANNER */}
      <div className="bg-gray-50 border-y border-gray-200 py-24">
          <div className="max-w-4xl mx-auto px-6 text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-md text-red-500">
                  <Phone size={32} />
              </div>
              <h2 className="text-4xl font-black mb-6">24/7 Rapid Response Team</h2>
              <p className="text-gray-600 text-lg mb-8">
                  If you ever feel unsafe, our dedicated safety line is available day or night. We have local teams in Nairobi, Lagos, and Cape Town ready to assist.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 transition shadow-xl shadow-red-200">
                      <AlertTriangle size={20}/> Get Emergency Help
                  </button>
                  <button className="bg-white border border-gray-200 hover:border-black text-black px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 transition">
                      Visit Safety Center
                  </button>
              </div>
          </div>
      </div>

      {/* 5. COMMUNITY STANDARDS */}
      <div className="py-24">
          <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="p-8 border border-gray-100 rounded-3xl hover:shadow-lg transition">
                      <HeartHandshake className="text-nearlink mb-6" size={40}/>
                      <h3 className="text-xl font-bold mb-3">Inclusivity</h3>
                      <p className="text-gray-500 leading-relaxed">
                          We have a zero-tolerance policy for discrimination. Everyone deserves to feel at home, everywhere.
                      </p>
                  </div>
                  <div className="p-8 border border-gray-100 rounded-3xl hover:shadow-lg transition">
                      <Lock className="text-nearlink mb-6" size={40}/>
                      <h3 className="text-xl font-bold mb-3">Privacy</h3>
                      <p className="text-gray-500 leading-relaxed">
                          We strictly prohibit hidden cameras and undisclosed recording devices in private spaces.
                      </p>
                  </div>
                  <div className="p-8 border border-gray-100 rounded-3xl hover:shadow-lg transition">
                      <CheckCircle className="text-nearlink mb-6" size={40}/>
                      <h3 className="text-xl font-bold mb-3">Reliability</h3>
                      <p className="text-gray-500 leading-relaxed">
                          Hosts must honor confirmed bookings. Last-minute cancellations are penalized to protect guests.
                      </p>
                  </div>
              </div>
          </div>
      </div>

      <Footer />
    </main>
  );
}