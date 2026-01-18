'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
  Check, Calendar, MapPin, Users, Copy, 
  ArrowRight, Home, MessageSquare, Download,
  Printer, Share2
} from 'lucide-react';

export default function BookingSuccessPage() {
  const [copied, setCopied] = useState(false);

  // Mock Booking Data (In a real app, you'd fetch this via a query param or context)
  const booking = {
    id: "NL-8492-KW",
    property: "Serene Villa by the Creek",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800",
    location: "Kilimani, Nairobi",
    checkIn: "Fri, Feb 14",
    checkOut: "Mon, Feb 17",
    guests: "2 Guests",
    total: "KES 45,000",
    host: "Sarah M."
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(booking.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-[#005871] selection:text-white">
      <div className="bg-black pb-2 shadow-sm sticky top-0 z-50 border-b border-white/10">
         <Navbar theme="dark" />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 md:py-20">
        
        {/* SUCCESS HEADER */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-200 ring-8 ring-green-50">
                <Check size={48} className="text-white stroke-[3]"/>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-gray-900">
                You're going to Nairobi!
            </h1>
            <p className="text-xl text-gray-500">
                Booking confirmed. We've sent a receipt to your email.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* LEFT: BOOKING DETAILS (TICKET STYLE) */}
            <div className="lg:col-span-7 animate-in slide-in-from-left-4 duration-700 delay-100">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 relative">
                    {/* Top Decorative Bar */}
                    <div className="h-3 w-full bg-[#005871]"></div>
                    
                    <div className="p-8">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Confirmation Code</p>
                                <div 
                                  onClick={handleCopy}
                                  className="flex items-center gap-3 cursor-pointer group"
                                >
                                    <span className="text-2xl font-black text-[#005871] tracking-wide">{booking.id}</span>
                                    <div className="text-gray-300 group-hover:text-gray-600 transition">
                                        {copied ? <Check size={18} className="text-green-500"/> : <Copy size={18}/>}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Paid</p>
                                <p className="text-xl font-bold text-black">{booking.total}</p>
                            </div>
                        </div>

                        <hr className="border-dashed border-gray-200 my-8"/>

                        <div className="flex gap-6 mb-8">
                            <img src={booking.image} alt="Property" className="w-24 h-24 rounded-2xl object-cover shadow-sm"/>
                            <div>
                                <h3 className="text-xl font-bold mb-2">{booking.property}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                    <MapPin size={16}/> {booking.location}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Users size={16}/> Hosted by {booking.host}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase mb-1">Check-In</p>
                                <p className="font-bold text-lg">{booking.checkIn}</p>
                                <p className="text-sm text-gray-500">After 2:00 PM</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-400 font-bold uppercase mb-1">Check-Out</p>
                                <p className="font-bold text-lg">{booking.checkOut}</p>
                                <p className="text-sm text-gray-500">Before 11:00 AM</p>
                            </div>
                        </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="bg-gray-50 p-6 border-t border-gray-100 flex justify-between items-center">
                        <button className="text-sm font-bold text-gray-500 hover:text-black flex items-center gap-2 transition">
                            <Printer size={16}/> Print Receipt
                        </button>
                        <button className="text-sm font-bold text-gray-500 hover:text-black flex items-center gap-2 transition">
                            <Download size={16}/> Save to Calendar
                        </button>
                    </div>
                </div>
            </div>

            {/* RIGHT: NEXT STEPS */}
            <div className="lg:col-span-5 space-y-8 animate-in slide-in-from-right-4 duration-700 delay-200">
                
                <div>
                    <h3 className="text-xl font-black mb-6">What happens next?</h3>
                    <div className="space-y-6 relative">
                        {/* Timeline Line */}
                        <div className="absolute left-3.5 top-2 bottom-0 w-0.5 bg-gray-200"></div>

                        <div className="flex gap-6 relative">
                            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center shrink-0 z-10 shadow-sm border-2 border-white">
                                <Check size={16}/>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">Booking Confirmed</h4>
                                <p className="text-sm text-gray-500 mt-1">We've processed your payment and notified {booking.host}.</p>
                            </div>
                        </div>

                        <div className="flex gap-6 relative">
                            <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-300 text-gray-400 flex items-center justify-center shrink-0 z-10">
                                <span className="text-xs font-bold">2</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">Message your Host</h4>
                                <p className="text-sm text-gray-500 mt-1">Introduce yourself and ask about check-in details.</p>
                                <button className="mt-3 text-xs font-bold bg-white border border-gray-200 px-4 py-2 rounded-lg hover:border-black transition flex items-center gap-2">
                                    <MessageSquare size={14}/> Send Message
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-6 relative">
                            <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-300 text-gray-400 flex items-center justify-center shrink-0 z-10">
                                <span className="text-xs font-bold">3</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">Enjoy your stay</h4>
                                <p className="text-sm text-gray-500 mt-1">Check-in is on {booking.checkIn}. Safe travels!</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#005871]/5 border border-[#005871]/10 rounded-2xl p-6">
                    <h4 className="font-bold text-[#005871] mb-2">Need Help?</h4>
                    <p className="text-sm text-gray-600 mb-4">
                        If you need to modify or cancel this booking, please visit your trips page.
                    </p>
                    <div className="flex gap-3">
                        <Link href="/trips" className="flex-1 bg-[#005871] text-white py-3 rounded-xl font-bold text-sm hover:scale-105 transition shadow-lg shadow-[#005871]/20 flex items-center justify-center gap-2">
                            Go to Trips <ArrowRight size={16}/>
                        </Link>
                        <Link href="/" className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-black font-bold text-sm hover:bg-gray-50 transition">
                            <Home size={18}/>
                        </Link>
                    </div>
                </div>

            </div>

        </div>
      </div>
      <Footer />
    </main>
  );
}