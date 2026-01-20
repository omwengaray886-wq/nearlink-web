'use client';

import { Briefcase, MapPin, Clock, ArrowRight, Heart, Globe, Zap } from 'lucide-react';
import Link from 'next/link';

const OPEN_POSITIONS = [
  {
    id: 1,
    title: "Senior Full Stack Engineer",
    department: "Engineering",
    location: "Nairobi, Kenya (Remote Hybrid)",
    type: "Full-time",
    description: "We are looking for an experienced developer to help build the core infrastructure of NearLink."
  },
  {
    id: 2,
    title: "Growth Marketing Manager",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
    description: "Lead our user acquisition strategies and help us reach the next 1 million users."
  },
  {
    id: 3,
    title: "Partner Success Specialist",
    department: "Operations",
    location: "Mombasa, Kenya",
    type: "Contract",
    description: "Onboard and support our growing network of hosts and experience guides."
  }
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      
      {/* --- HERO SECTION --- */}
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <span className="text-[#005871] font-bold tracking-wider text-sm uppercase mb-3 block">Join our Mission</span>
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
          Build the future of <br/>
          <span className="text-[#005871]">African Travel.</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          NearLink is redefining how people explore, stay, and experience local culture. 
          We are looking for passionate builders, dreamers, and doers.
        </p>
        <div className="flex justify-center gap-4">
           <a href="#positions" className="bg-[#005871] text-white px-8 py-3 rounded-full font-bold hover:bg-[#004052] transition">
             View Openings
           </a>
        </div>
      </div>

      {/* --- VALUES GRID --- */}
      <div className="bg-gray-50 py-16 mb-16">
        <div className="max-w-7xl mx-auto px-6">
           <h2 className="text-3xl font-bold text-center mb-12">Why work with us?</h2>
           <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                     <Globe size={24}/>
                  </div>
                  <h3 className="font-bold text-xl mb-2">Remote-First Culture</h3>
                  <p className="text-gray-500">Work from anywhere. We believe in output, not hours spent in a chair.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4">
                     <Heart size={24}/>
                  </div>
                  <h3 className="font-bold text-xl mb-2">Impact Driven</h3>
                  <p className="text-gray-500">Your work directly empowers local hosts and transforms local economies.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mb-4">
                     <Zap size={24}/>
                  </div>
                  <h3 className="font-bold text-xl mb-2">Fast Growth</h3>
                  <p className="text-gray-500">Join a rocket ship. Opportunities for leadership and growth are endless.</p>
              </div>
           </div>
        </div>
      </div>

      {/* --- OPEN POSITIONS --- */}
      <div id="positions" className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-8">Open Positions</h2>
        
        <div className="space-y-4">
          {OPEN_POSITIONS.map((job) => (
            <div key={job.id} className="group border border-gray-200 rounded-2xl p-6 hover:border-[#005871] hover:shadow-lg transition-all cursor-pointer bg-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#005871] transition-colors">{job.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                       <span className="flex items-center gap-1"><Briefcase size={14}/> {job.department}</span>
                       <span className="flex items-center gap-1"><MapPin size={14}/> {job.location}</span>
                       <span className="flex items-center gap-1"><Clock size={14}/> {job.type}</span>
                    </div>
                 </div>
                 <button className="hidden md:flex items-center gap-2 font-bold text-sm text-[#005871] bg-[#005871]/10 px-4 py-2 rounded-full group-hover:bg-[#005871] group-hover:text-white transition">
                    Apply Now <ArrowRight size={16}/>
                 </button>
              </div>
            </div>
          ))}
        </div>

        {/* --- NO ROLES FALLBACK --- */}
        <div className="mt-12 p-8 bg-gray-50 rounded-2xl text-center">
           <h3 className="font-bold text-lg mb-2">Don't see the right role?</h3>
           <p className="text-gray-500 mb-4">We are always looking for talent. Send your CV to careers@nearlink.com</p>
           <button className="text-[#005871] font-bold underline">Email Us</button>
        </div>

      </div>
    </div>
  );
}