'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';

export default function ArticlePage({ params }) {
  // In a real app, you would fetch data using params.slug
  // For now, we simulate the content structure
  
  return (
    <main className="min-h-screen bg-white font-serif text-gray-900 selection:bg-[#005871] selection:text-white">
      <div className="bg-white pb-2 shadow-sm sticky top-0 z-50 border-b border-gray-100">
         <Navbar theme="light" />
      </div>

      <article className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        
        {/* BACK NAV */}
        <Link href="/host/guide" className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-black transition mb-12 uppercase tracking-widest font-sans">
            <ArrowLeft size={14}/> Back to Academy
        </Link>

        {/* HEADER */}
        <div className="text-center mb-12">
            <div className="inline-block bg-yellow-400 text-black px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest mb-6 font-sans">
                Regulations
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight font-sans">
                New Short-Term Rental Laws in Kenya: What You Need to Know (2026 Update)
            </h1>
            <div className="flex justify-center items-center gap-6 text-sm font-sans text-gray-500 font-medium">
                <span className="flex items-center gap-2"><Clock size={16}/> 8 min read</span>
                <span className="flex items-center gap-2"><Calendar size={16}/> Jan 14, 2026</span>
                <span className="text-[#005871]">By NearLink Legal Team</span>
            </div>
        </div>

        {/* FEATURED IMAGE */}
        <div className="w-full h-[400px] md:h-[600px] rounded-3xl overflow-hidden mb-16 shadow-2xl">
            <img 
                src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=1200" 
                className="w-full h-full object-cover" 
                alt="Law books"
            />
        </div>

        {/* CONTENT */}
        <div className="prose prose-lg prose-gray mx-auto">
            <p className="lead text-xl text-gray-600 mb-8 font-sans">
                The Tourism Regulatory Authority (TRA) has recently released updated guidelines affecting all short-term rental hosts operating in Kenya. Failure to comply could result in fines up to KES 100,000. Here is everything you need to know.
            </p>

            <h3>1. The Annual License Requirement</h3>
            <p>
                Starting February 1st, 2026, all hosts listing properties on digital platforms must display a valid TRA license number on their public profile. NearLink has added a dedicated field in your <Link href="/account" className="text-[#005871] no-underline hover:underline">Host Dashboard</Link> to submit this number.
            </p>

            <h3>2. Guest Registration</h3>
            <p>
                Hosts are now legally required to maintain a digital register of all guests, including full names and ID/Passport numbers. NearLink automates this for you during the booking process, ensuring you stay compliant without the paperwork.
            </p>

            <blockquote>
                "These regulations are designed to standardize safety and quality across the industry, ultimately benefiting professional hosts." — <em>TRA Spokesperson</em>
            </blockquote>

            <h3>3. Safety Inspections</h3>
            <p>
                To obtain your license, your property must pass a basic safety inspection. Ensure you have:
            </p>
            <ul>
                <li>Functional fire extinguishers in the kitchen.</li>
                <li>Clear emergency exit signage.</li>
                <li>A basic first aid kit accessible to guests.</li>
            </ul>

            <div className="bg-blue-50 border-l-4 border-[#005871] p-6 my-8 font-sans rounded-r-xl">
                <h4 className="font-bold text-[#005871] mb-2 text-base">Pro Tip</h4>
                <p className="m-0 text-sm">NearLink partners with approved safety vendors who can audit your property and provide equipment at a 20% discount. Check the "Partner Offers" tab in your dashboard.</p>
            </div>

            <h3>Conclusion</h3>
            <p>
                While these new rules add a layer of administration, they also professionalize the sector. Compliant hosts will receive a "Verified License" badge on NearLink, which early data shows increases booking trust by 40%.
            </p>
        </div>

        {/* SHARE */}
        <div className="border-t border-gray-100 mt-16 pt-8 flex justify-between items-center font-sans">
            <span className="font-bold text-gray-500 text-sm uppercase tracking-widest">Share this article</span>
            <div className="flex gap-4">
                <button className="p-2 bg-gray-100 rounded-full hover:bg-[#005871] hover:text-white transition"><Facebook size={18}/></button>
                <button className="p-2 bg-gray-100 rounded-full hover:bg-[#005871] hover:text-white transition"><Twitter size={18}/></button>
                <button className="p-2 bg-gray-100 rounded-full hover:bg-[#005871] hover:text-white transition"><Linkedin size={18}/></button>
                <button className="p-2 bg-gray-100 rounded-full hover:bg-[#005871] hover:text-white transition"><Share2 size={18}/></button>
            </div>
        </div>

      </article>
      <Footer />
    </main>
  );
}