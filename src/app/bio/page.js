'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Quote, ArrowLeft, Terminal, Globe, Award, TrendingUp } from 'lucide-react';

export default function BioPage() {
  return (
    <main className="min-h-screen bg-white font-serif text-gray-900 selection:bg-black selection:text-white">
      <div className="bg-white pb-2 shadow-sm sticky top-0 z-50 border-b border-gray-100">
         <Navbar theme="light" />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 md:py-20">
        
        {/* BACK NAVIGATION */}
        <Link href="/about" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-black transition mb-12 uppercase tracking-widest font-sans">
            <ArrowLeft size={16}/> Back to Vision
        </Link>

        {/* HEADER SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start mb-24">
            <div className="md:col-span-5 relative group">
                <div className="absolute top-4 -left-4 w-full h-full border-2 border-black/10 rounded-[2rem]"></div>
                <img 
                    src="/ceo-brian.png" 
                    alt="Brian Omwenga Onkebo" 
                    className="w-full h-auto rounded-[2rem] shadow-2xl grayscale group-hover:grayscale-0 transition duration-700 object-cover aspect-[3/4]"
                />
            </div>
            <div className="md:col-span-7 flex flex-col justify-center h-full">
                <h1 className="text-5xl md:text-7xl font-black font-sans mb-6 leading-tight">
                    The Architect <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-500">of Trust.</span>
                </h1>
                <h2 className="text-xl font-bold text-[#005871] font-sans mb-8">Brian Omwenga Onkebo</h2>
                <div className="prose prose-lg text-gray-600 leading-relaxed font-sans">
                    <p className="mb-6">
                        Brian is a technologist, entrepreneur, and the Founder & CEO of NearLink. He is building the digital operating system for African hospitality, bridging the gap between informal markets and the global digital economy.
                    </p>
                    <div className="grid grid-cols-2 gap-6 mt-8 border-t border-gray-100 pt-8 font-sans">
                        <div>
                            <span className="block text-2xl font-black text-black">Technical</span>
                            <span className="text-sm text-gray-500">Founder</span>
                        </div>
                        <div>
                            <span className="block text-2xl font-black text-black">Market</span>
                            <span className="text-sm text-gray-500">Strategist</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* NARRATIVE SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-3">
                <div className="sticky top-32 space-y-8 font-sans">
                    <div>
                        <h4 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-2">Expertise</h4>
                        <ul className="space-y-2 text-sm font-medium">
                            <li className="flex items-center gap-2"><Terminal size={14}/> Full-Stack Engineering</li>
                            <li className="flex items-center gap-2"><TrendingUp size={14}/> Financial Markets</li>
                            <li className="flex items-center gap-2"><Globe size={14}/> African Macro-economics</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-2">Connect</h4>
                        <div className="flex gap-4">
                            <a href="#" className="text-gray-900 hover:text-[#005871] underline decoration-1 underline-offset-4">LinkedIn</a>
                            <a href="#" className="text-gray-900 hover:text-[#005871] underline decoration-1 underline-offset-4">Twitter</a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="md:col-span-8 md:col-start-5 space-y-12 text-lg text-gray-700 leading-relaxed">
                
                <section>
                    <h3 className="text-3xl font-bold font-sans text-black mb-6">The Origin Story</h3>
                    <p>
                        The idea for NearLink was born not in a boardroom, but on a dirt road in Naivasha. Brian noticed a fundamental disconnect: incredible properties—villas, cottages, and guest houses—existed physically but were invisible digitally.
                    </p>
                    <p className="mt-4">
                        "I saw owners standing by the roadside holding keys, waiting for customers," Brian recalls. "It wasn't a lack of supply; it was a lack of infrastructure. Silicon Valley platforms required credit cards and street addresses that didn't exist. We needed a solution built for M-Pesa and geolocation."
                    </p>
                </section>

                <div className="relative pl-8 md:pl-12 py-4">
                    <Quote size={48} className="absolute left-0 top-0 text-[#005871]/20 -z-10"/>
                    <p className="text-2xl font-bold font-sans italic text-black">
                        "We aren't just building an app. We are digitizing trust for a continent where reputation has always been currency."
                    </p>
                </div>

                <section>
                    <h3 className="text-3xl font-bold font-sans text-black mb-6">Engineering the Solution</h3>
                    <p>
                        With a background in software development and financial trading, Brian approached the problem as an engineer. He personally architected the initial version of the NearLink stack, prioritizing:
                    </p>
                    <ul className="list-disc pl-5 mt-4 space-y-2 font-sans text-base">
                        <li><strong>Offline-First Capability:</strong> Ensuring the app works in areas with spotty data.</li>
                        <li><strong>Trust Protocols:</strong> Implementing strict identity verification to replace anonymity with accountability.</li>
                        <li><strong>Financial Inclusion:</strong> Integrating mobile money deeply into the booking flow to allow instant, secure payouts for hosts.</li>
                    </ul>
                </section>

                <section>
                    <h3 className="text-3xl font-bold font-sans text-black mb-6">The Vision Ahead</h3>
                    <p>
                        Today, Brian leads NearLink with a singular focus: to become the operating system for African travel. Under his leadership, the company has expanded beyond just stays into mobility and experiences, creating a cohesive ecosystem that empowers local entrepreneurs.
                    </p>
                    <p className="mt-4">
                        "Our goal is simple," says Brian. "If you want to move, stay, or experience anything in Africa, you use NearLink. We are building the digital bridge to the physical world."
                    </p>
                </section>

            </div>
        </div>

      </div>
      <Footer />
    </main>
  );
}