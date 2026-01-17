// src/app/contact/page.js
'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Mail, MessageCircle, Phone, ChevronDown, ChevronUp, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [formStatus, setFormStatus] = useState('idle'); // idle, submitting, success

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    // Simulate network request
    setTimeout(() => {
        setFormStatus('success');
    }, 1500);
  };

  const FAQS = [
    {
      question: "How do I cancel a booking?",
      answer: "Go to your 'Trips' page, select the booking you wish to cancel, and click 'Cancel Booking'. Refunds are processed according to the host's cancellation policy."
    },
    {
      question: "How do I become a host?",
      answer: "Click 'Become a Host' in the top menu. You'll need to verify your identity, upload photos of your space, and set your availability."
    },
    {
      question: "Is payment via M-Pesa secure?",
      answer: "Yes. We use industry-standard encryption and direct integration with Safaricom to ensure your mobile money transactions are safe and instant."
    },
    {
      question: "What if the host cancels on me?",
      answer: "In the rare event of a host cancellation, you are protected by NearCover. We will offer a full refund or help you find a similar place nearby."
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 1. Navbar Wrapper */}
      <div className="bg-nearlink-dark pb-2 shadow-sm">
         <Navbar />
      </div>

      {/* 2. Hero Header */}
      <div className="bg-nearlink-dark text-white pt-12 pb-24 px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">How can we help?</h1>
          <p className="text-gray-200 text-lg max-w-xl mx-auto">
              From setting up your account to booking your dream stay, we are here to support you 24/7.
          </p>
      </div>

      <div className="max-w-[1120px] mx-auto px-6 -mt-16 pb-20">
          
          {/* 3. Contact Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {/* Chat */}
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center hover:-translate-y-1 transition duration-300">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle size={28} />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Live Chat</h3>
                  <p className="text-gray-500 text-sm mb-6">Chat with our support team in real-time.</p>
                  <button className="bg-black text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-gray-800 transition">
                      Start Chat
                  </button>
              </div>

              {/* Email */}
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center hover:-translate-y-1 transition duration-300">
                  <div className="w-14 h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail size={28} />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Email Support</h3>
                  <p className="text-gray-500 text-sm mb-6">For general inquiries and feedback.</p>
                  <a href="mailto:support@nearlink.com" className="text-nearlink font-bold underline hover:text-nearlink-dark">
                      support@nearlink.com
                  </a>
              </div>

              {/* Phone */}
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center hover:-translate-y-1 transition duration-300">
                  <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Phone size={28} />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Phone</h3>
                  <p className="text-gray-500 text-sm mb-6">Urgent issues for active bookings.</p>
                  <a href="tel:+254700000000" className="text-nearlink font-bold underline hover:text-nearlink-dark">
                      +254 700 123 456
                  </a>
              </div>
          </div>

          {/* 4. Split Layout: Form & FAQ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              
              {/* LEFT: Contact Form */}
              <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
                  
                  {formStatus === 'success' ? (
                      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center animate-in fade-in zoom-in duration-300">
                          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                              <CheckCircle size={32} />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                          <p className="text-gray-600">We'll get back to you within 24 hours.</p>
                          <button 
                            onClick={() => setFormStatus('idle')}
                            className="mt-6 text-sm font-bold underline text-green-700"
                          >
                              Send another message
                          </button>
                      </div>
                  ) : (
                      <form onSubmit={handleSubmit} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                              <div>
                                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">First Name</label>
                                  <input type="text" required className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:border-nearlink focus:ring-1 focus:ring-nearlink transition bg-white" placeholder="Jane" />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Last Name</label>
                                  <input type="text" required className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:border-nearlink focus:ring-1 focus:ring-nearlink transition bg-white" placeholder="Doe" />
                              </div>
                          </div>

                          <div>
                              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address</label>
                              <input type="email" required className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:border-nearlink focus:ring-1 focus:ring-nearlink transition bg-white" placeholder="jane@example.com" />
                          </div>

                          <div>
                              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Subject</label>
                              <select className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:border-nearlink focus:ring-1 focus:ring-nearlink transition bg-white text-gray-600">
                                  <option>General Inquiry</option>
                                  <option>Booking Issue</option>
                                  <option>Payment Issue</option>
                                  <option>Report a Listing</option>
                              </select>
                          </div>

                          <div>
                              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Message</label>
                              <textarea required rows="4" className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:border-nearlink focus:ring-1 focus:ring-nearlink transition bg-white" placeholder="How can we help you?"></textarea>
                          </div>

                          <button 
                            type="submit"
                            disabled={formStatus === 'submitting'}
                            className="w-full bg-nearlink hover:bg-nearlink-dark text-white font-bold py-4 rounded-xl shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-70"
                          >
                              {formStatus === 'submitting' ? 'Sending...' : <><Send size={18} /> Send Message</>}
                          </button>
                      </form>
                  )}
              </div>

              {/* RIGHT: FAQ Accordion */}
              <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                  <div className="space-y-4">
                      {FAQS.map((faq, index) => (
                          <div 
                            key={index} 
                            className={`border border-gray-200 rounded-xl overflow-hidden bg-white transition-all duration-300 ${activeAccordion === index ? 'shadow-md ring-1 ring-black' : ''}`}
                          >
                              <button 
                                onClick={() => toggleAccordion(index)}
                                className="w-full flex justify-between items-center p-5 text-left"
                              >
                                  <span className="font-bold text-gray-900">{faq.question}</span>
                                  {activeAccordion === index ? <ChevronUp size={20} className="text-nearlink" /> : <ChevronDown size={20} className="text-gray-400" />}
                              </button>
                              
                              <div 
                                className={`px-5 overflow-hidden transition-all duration-300 ease-in-out ${activeAccordion === index ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
                              >
                                  <p className="text-gray-600 leading-relaxed text-sm">
                                      {faq.answer}
                                  </p>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>

          </div>
      </div>

      <Footer />
    </main>
  );
}