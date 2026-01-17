'use client';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useState, useEffect } from 'react';
import { 
  Shield, Lock, Eye, FileText, Download, 
  ChevronRight, Mail, Server, Globe, CheckCircle
} from 'lucide-react';

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState('intro');

  const sections = [
    { id: 'intro', label: 'Introduction' },
    { id: 'collection', label: 'Data We Collect' },
    { id: 'usage', label: 'How We Use Data' },
    { id: 'sharing', label: 'Sharing & Disclosure' },
    { id: 'security', label: 'Data Security' },
    { id: 'rights', label: 'Your Rights' },
    { id: 'contact', label: 'Contact Us' },
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
                          <Shield size={16}/> Legal Center
                      </div>
                      <h1 className="text-4xl md:text-5xl font-black mb-4">Privacy Policy</h1>
                      <p className="text-gray-500 text-lg max-w-2xl">
                          We believe that trust is the foundation of the NearLink community. This policy outlines how we protect your digital footprint.
                      </p>
                  </div>
                  <div className="flex flex-col items-start md:items-end gap-2">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Effective: Jan 14, 2026
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
                  <h3 className="font-bold text-gray-400 text-xs uppercase tracking-widest mb-6">Table of Contents</h3>
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
              
              {/* Introduction */}
              <section id="intro" className="mb-16 scroll-mt-32">
                  <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl mb-8 flex gap-4">
                      <div className="mt-1 text-blue-600"><Eye size={24}/></div>
                      <div>
                          <h4 className="font-bold text-blue-900 mb-2">The Short Version</h4>
                          <p className="text-sm text-blue-800 leading-relaxed">
                              We only collect data necessary to provide our services (like booking stays or processing payments). We never sell your personal data to third parties. You have full control over your data settings in the app.
                          </p>
                      </div>
                  </div>
                  <p className="text-lg text-gray-600 leading-relaxed mb-6">
                      NearLink, Inc. ("NearLink", "we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclosure, and safeguard your information when you visit our website nearlink.com and our mobile application.
                  </p>
              </section>

              <hr className="border-gray-100 my-12"/>

              {/* Data Collection */}
              <section id="collection" className="mb-16 scroll-mt-32">
                  <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                      <FileText className="text-nearlink-dark"/> 1. Information We Collect
                  </h2>
                  <p className="text-gray-600 mb-6">We collect information in three categories:</p>
                  
                  <div className="space-y-6">
                      <div className="pl-6 border-l-4 border-gray-100">
                          <h3 className="font-bold text-lg mb-2">A. Information You Give Us</h3>
                          <ul className="list-disc pl-5 space-y-2 text-gray-600">
                              <li><strong>Account Profile:</strong> Name, email, phone number, and profile photo.</li>
                              <li><strong>Identity Verification:</strong> Images of your government-issued ID (National ID/Passport) as required by local KYC laws.</li>
                              <li><strong>Payment Data:</strong> M-Pesa numbers, credit card details (processed via secure gateways like Stripe/Paystack).</li>
                          </ul>
                      </div>

                      <div className="pl-6 border-l-4 border-gray-100">
                          <h3 className="font-bold text-lg mb-2">B. Information We Automatically Collect</h3>
                          <ul className="list-disc pl-5 space-y-2 text-gray-600">
                              <li><strong>Geo-Location:</strong> Precise location data to show nearby stays and enable safety features.</li>
                              <li><strong>Usage Data:</strong> Pages viewed, bookings made, and interaction time.</li>
                              <li><strong>Device Information:</strong> IP address, device model, and OS version.</li>
                          </ul>
                      </div>
                  </div>
              </section>

              {/* Usage */}
              <section id="usage" className="mb-16 scroll-mt-32">
                  <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                      <Server className="text-nearlink-dark"/> 2. How We Use Your Data
                  </h2>
                  <p className="text-gray-600 mb-4">We use your personal data to:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-xl">
                          <h4 className="font-bold mb-2">Service Provision</h4>
                          <p className="text-sm text-gray-500">Processing bookings, payments, and facilitating host-guest communication.</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl">
                          <h4 className="font-bold mb-2">Safety & Security</h4>
                          <p className="text-sm text-gray-500">Detecting fraud, verifying identities, and ensuring platform integrity.</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl">
                          <h4 className="font-bold mb-2">Customer Support</h4>
                          <p className="text-sm text-gray-500">Resolving disputes and answering your queries.</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl">
                          <h4 className="font-bold mb-2">R&D</h4>
                          <p className="text-sm text-gray-500">Analyzing usage trends to improve our app performance.</p>
                      </div>
                  </div>
              </section>

              {/* Sharing */}
              <section id="sharing" className="mb-16 scroll-mt-32">
                  <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                      <Globe className="text-nearlink-dark"/> 3. Sharing & Disclosure
                  </h2>
                  <p className="text-gray-600 mb-4">
                      We do not sell your data. We share information only in the following circumstances:
                  </p>
                  <ul className="space-y-4 text-gray-600">
                      <li className="flex gap-3">
                          <CheckCircle className="text-green-500 flex-shrink-0" size={20}/>
                          <span><strong>With Hosts/Guests:</strong> To facilitate your booking (e.g., sharing your first name and profile photo). Phone numbers are masked until a booking is confirmed.</span>
                      </li>
                      <li className="flex gap-3">
                          <CheckCircle className="text-green-500 flex-shrink-0" size={20}/>
                          <span><strong>With Service Providers:</strong> Cloud hosting (AWS/Google Cloud), identity verification partners, and payment processors.</span>
                      </li>
                      <li className="flex gap-3">
                          <CheckCircle className="text-green-500 flex-shrink-0" size={20}/>
                          <span><strong>Legal Requirements:</strong> If compelled by a valid court order or to protect the safety of any person.</span>
                      </li>
                  </ul>
              </section>

              {/* Contact */}
              <section id="contact" className="mb-16 scroll-mt-32">
                  <div className="bg-black text-white p-8 rounded-3xl">
                      <h2 className="text-2xl font-black mb-4">Questions about your data?</h2>
                      <p className="text-gray-400 mb-6">
                          Our Data Protection Officer (DPO) is available to answer any questions regarding your privacy rights.
                      </p>
                      <div className="flex flex-col gap-4">
                          <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                                  <Mail size={18}/>
                              </div>
                              <span className="font-medium">privacy@nearlink.com</span>
                          </div>
                          <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                                  <Globe size={18}/>
                              </div>
                              <span className="font-medium">NearLink HQ, Westlands, Nairobi, Kenya</span>
                          </div>
                      </div>
                  </div>
              </section>

          </div>
      </div>

      <Footer />
    </main>
  );
}