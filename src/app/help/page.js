'use client';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useState, useEffect } from 'react';
import { 
  Search, HelpCircle, MessageSquare, Phone, Mail, 
  ChevronDown, ChevronUp, Shield, CreditCard, User, 
  Calendar, Home, FileText, CheckCircle, ArrowRight,
  Activity, AlertCircle, X, Send, ThumbsUp, ThumbsDown,
  Clock, Zap, LayoutGrid
} from 'lucide-react';

export default function HelpPage() {
  const [activeTab, setActiveTab] = useState('guest'); // 'guest' or 'host'
  const [openFaq, setOpenFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [ticketExpanded, setTicketExpanded] = useState(false);

  // --- MOCK DATA: SYSTEM STATUS ---
  const systemStatus = [
      { name: "Payments System", status: "Operational", color: "green" },
      { name: "Booking Engine", status: "Operational", color: "green" },
      { name: "Mobile App API", status: "Degraded Performance", color: "yellow" }
  ];

  // --- MOCK DATA: USER TICKETS ---
  const myTickets = [
      { id: "TKT-9920", subject: "Refund Request - #B8829", status: "In Progress", date: "2 hours ago" },
      { id: "TKT-8812", subject: "ID Verification Failed", status: "Resolved", date: "Oct 12" }
  ];

  // --- MOCK DATA: FAQs ---
  const faqs = [
    {
      id: 1,
      question: "How do I cancel my reservation for a full refund?",
      answer: "Go to 'My Trips', select the reservation you want to cancel, and click 'Cancel Booking'. If you cancel within 48 hours of booking and at least 14 days before check-in, you will receive a full refund minus the service fee.",
      role: 'guest',
      category: 'booking',
      helpful: 245
    },
    {
      id: 2,
      question: "I can't check in. The host is unresponsive.",
      answer: "We are sorry to hear that. First, try messaging via the app. If no response after 30 mins, tap 'Report Issue' on your booking page. Our Trust & Safety team will intervene immediately.",
      role: 'guest',
      category: 'safety',
      helpful: 890
    },
    {
      id: 3,
      question: "How do I verify my identity?",
      answer: "Go to Account > Personal Info > Identity Verification. You will need to upload a photo of your Government ID (Passport or ID) and take a selfie. Verification typically takes 5-10 minutes.",
      role: 'all',
      category: 'account',
      helpful: 120
    },
    {
      id: 4,
      question: "How do I list my property?",
      answer: "Click 'Become a Host' in the top menu. You will be guided through a 10-step process to add photos, amenities, and set your pricing. Once submitted, our team reviews listings within 24 hours.",
      role: 'host',
      category: 'hosting',
      helpful: 56
    },
    {
      id: 5,
      question: "Payouts: When and how do I get paid?",
      answer: "Payouts are released 24 hours after your guest checks in. Depending on your bank or M-Pesa, it may take 1-3 business days to reflect. Ensure your payout method is set up in Account Settings.",
      role: 'host',
      category: 'earnings',
      helpful: 332
    }
  ];

  // Filter Logic
  const filteredFaqs = faqs.filter(faq => 
    (faq.role === activeTab || faq.role === 'all') &&
    (faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
     faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <main className="min-h-screen bg-[#F8F9FA] font-sans text-gray-900 selection:bg-nearlink selection:text-black">
      <div className="bg-black pb-2 shadow-sm sticky top-0 z-50 border-b border-white/10">
         <Navbar theme="dark" />
      </div>

      {/* 1. HERO: INTELLIGENT SEARCH */}
      <div className="bg-[#050505] text-white pt-24 pb-40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-nearlink/10 rounded-full blur-[150px] pointer-events-none animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none"></div>
          
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
              <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 rounded-full px-3 py-1 text-xs font-bold text-gray-400 mb-6 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Support Online
              </div>
              <h1 className="text-5xl md:text-6xl font-black mb-8 tracking-tight">How can we help you?</h1>
              
              {/* Advanced Search Bar */}
              <div className="relative max-w-2xl mx-auto mb-8 group">
                  <div className="absolute inset-0 bg-gradient-to-r from-nearlink to-blue-600 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                  <div className="relative">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-nearlink transition">
                          <Search size={24}/>
                      </div>
                      <input 
                        type="text" 
                        placeholder="Describe your issue (e.g., 'refund', 'check-in')..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-16 pl-16 pr-6 rounded-full bg-[#151515] border border-white/10 text-white font-bold text-lg outline-none focus:bg-black focus:border-nearlink transition shadow-2xl placeholder:text-gray-600"
                      />
                  </div>
              </div>

              {/* Quick Chips */}
              <div className="flex flex-wrap justify-center gap-3 text-sm">
                  <span className="text-gray-500">Popular:</span>
                  {['Cancel Booking', 'Payment Failed', 'Contact Host', 'Change Dates'].map((tag, i) => (
                      <button key={i} onClick={() => setSearchQuery(tag)} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 transition text-gray-300 text-xs font-medium">
                          {tag}
                      </button>
                  ))}
              </div>
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-24 -mt-24 relative z-20">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* --- LEFT SIDEBAR: DASHBOARD & STATUS --- */}
              <div className="lg:col-span-3 space-y-6">
                  
                  {/* Role Switcher */}
                  <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100 flex flex-col gap-1">
                      <button 
                        onClick={() => setActiveTab('guest')}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'guest' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                      >
                          <span>I am a Guest</span>
                          {activeTab === 'guest' && <CheckCircle size={16}/>}
                      </button>
                      <button 
                        onClick={() => setActiveTab('host')}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'host' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                      >
                          <span>I am a Host</span>
                          {activeTab === 'host' && <CheckCircle size={16}/>}
                      </button>
                  </div>

                  {/* My Tickets Widget */}
                  <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                          <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500">My Tickets</h3>
                          <span className="bg-nearlink/10 text-nearlink text-xs font-bold px-2 py-0.5 rounded-full">{myTickets.length}</span>
                      </div>
                      <div className="space-y-3">
                          {myTickets.map((ticket, i) => (
                              <div key={i} className="p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-300 transition cursor-pointer group">
                                  <div className="flex justify-between items-start mb-1">
                                      <span className="text-[10px] font-bold text-gray-400">{ticket.id}</span>
                                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                          {ticket.status}
                                      </span>
                                  </div>
                                  <p className="font-bold text-sm text-gray-900 group-hover:text-nearlink transition truncate">{ticket.subject}</p>
                                  <p className="text-xs text-gray-400 mt-1">{ticket.date}</p>
                              </div>
                          ))}
                          <button className="w-full py-2 border border-dashed border-gray-300 rounded-xl text-xs font-bold text-gray-500 hover:text-black hover:border-black transition flex items-center justify-center gap-2">
                              <MessageSquare size={14}/> Open New Ticket
                          </button>
                      </div>
                  </div>

                  {/* System Status Widget */}
                  <div className="bg-[#111] text-white rounded-3xl p-6 border border-gray-800 shadow-lg">
                      <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
                          <Activity size={16}/> System Status
                      </h3>
                      <div className="space-y-4">
                          {systemStatus.map((sys, i) => (
                              <div key={i} className="flex items-center justify-between text-sm">
                                  <span className="text-gray-300">{sys.name}</span>
                                  <div className="flex items-center gap-2">
                                      <span className={`w-2 h-2 rounded-full ${sys.color === 'green' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-yellow-500'}`}></span>
                                      <span className={`text-xs font-bold ${sys.color === 'green' ? 'text-green-500' : 'text-yellow-500'}`}>
                                          {sys.status}
                                      </span>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>

              {/* --- CENTER: KNOWLEDGE BASE --- */}
              <div className="lg:col-span-6 space-y-6">
                  
                  {/* Category Grid */}
                  <div className="grid grid-cols-2 gap-4">
                      <button className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition text-left group">
                          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition"><Calendar size={20}/></div>
                          <h4 className="font-bold text-gray-900">Booking & Trips</h4>
                          <p className="text-xs text-gray-500 mt-1">Cancellations, changes...</p>
                      </button>
                      <button className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition text-left group">
                          <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition"><CreditCard size={20}/></div>
                          <h4 className="font-bold text-gray-900">Payments</h4>
                          <p className="text-xs text-gray-500 mt-1">Refunds, methods...</p>
                      </button>
                  </div>

                  {/* FAQ Accordion */}
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                      <div className="p-6 border-b border-gray-100">
                          <h2 className="font-black text-xl">Frequent Questions</h2>
                      </div>
                      <div className="divide-y divide-gray-100">
                          {filteredFaqs.length > 0 ? filteredFaqs.map((faq) => (
                              <div key={faq.id} className="group">
                                  <button 
                                    onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                                    className={`w-full flex items-center justify-between p-6 text-left transition hover:bg-gray-50 ${openFaq === faq.id ? 'bg-gray-50' : ''}`}
                                  >
                                      <span className="font-bold text-gray-800 pr-4">{faq.question}</span>
                                      {openFaq === faq.id ? <ChevronUp size={20} className="text-nearlink shrink-0"/> : <ChevronDown size={20} className="text-gray-400 shrink-0"/>}
                                  </button>
                                  
                                  {openFaq === faq.id && (
                                      <div className="px-6 pb-6 pt-0 bg-gray-50 animate-in slide-in-from-top-1">
                                          <p className="text-gray-600 leading-relaxed text-sm mb-4">{faq.answer}</p>
                                          <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                              <span className="text-xs text-gray-400 font-bold">{faq.helpful} people found this helpful</span>
                                              <div className="flex gap-2">
                                                  <button className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-500 hover:text-green-600 transition"><ThumbsUp size={14}/></button>
                                                  <button className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-500 hover:text-red-600 transition"><ThumbsDown size={14}/></button>
                                              </div>
                                          </div>
                                      </div>
                                  )}
                              </div>
                          )) : (
                              <div className="p-12 text-center">
                                  <HelpCircle size={48} className="mx-auto text-gray-200 mb-4"/>
                                  <p className="text-gray-500 font-medium">No articles found matching "{searchQuery}"</p>
                              </div>
                          )}
                      </div>
                  </div>
              </div>

              {/* --- RIGHT: CONTACT & AI --- */}
              <div className="lg:col-span-3 space-y-6">
                  <div className="bg-gradient-to-b from-blue-600 to-blue-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
                      <h3 className="font-black text-xl mb-2">Need urgent help?</h3>
                      <p className="text-blue-100 text-sm mb-6">Our priority support team is available 24/7 for active trip issues.</p>
                      
                      <div className="space-y-3 relative z-10">
                          <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-white text-blue-900 hover:bg-blue-50 transition font-bold text-sm shadow-md">
                              <Phone size={18}/> Call Priority Line
                          </button>
                          <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-blue-700/50 hover:bg-blue-700 transition font-bold text-sm border border-blue-500">
                              <Mail size={18}/> Email Us
                          </button>
                      </div>
                  </div>

                  <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm text-center">
                      <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Shield size={24}/>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-1">Trust & Safety</h4>
                      <p className="text-xs text-gray-500 mb-4">Report suspicious activity or safety concerns immediately.</p>
                      <button className="text-xs font-bold text-red-600 border border-red-100 bg-red-50 px-4 py-2 rounded-lg hover:bg-red-100 transition w-full">
                          Report Incident
                      </button>
                  </div>
              </div>

          </div>
      </div>

      {/* FLOATING AI CHAT WIDGET */}
      <div className="fixed bottom-6 right-6 z-[100]">
          {isChatOpen ? (
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 w-[350px] overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
                  {/* Chat Header */}
                  <div className="bg-black p-4 flex justify-between items-center text-white">
                      <div className="flex items-center gap-3">
                          <div className="relative">
                              <div className="w-8 h-8 rounded-full bg-nearlink flex items-center justify-center font-bold text-black">N</div>
                              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-black rounded-full"></span>
                          </div>
                          <div>
                              <h4 className="font-bold text-sm">NearLink AI</h4>
                              <p className="text-[10px] text-gray-400">Typically replies instantly</p>
                          </div>
                      </div>
                      <button onClick={() => setIsChatOpen(false)} className="text-gray-400 hover:text-white"><X size={18}/></button>
                  </div>

                  {/* Chat Body */}
                  <div className="h-[300px] bg-gray-50 p-4 overflow-y-auto space-y-4">
                      <div className="flex gap-3">
                          <div className="w-6 h-6 rounded-full bg-black flex-shrink-0"></div>
                          <div className="bg-white p-3 rounded-2xl rounded-tl-none text-xs text-gray-600 shadow-sm border border-gray-100">
                              Hello Brian! How can I assist you with your booking today?
                          </div>
                      </div>
                      <div className="flex gap-3 flex-row-reverse">
                          <div className="bg-black text-white p-3 rounded-2xl rounded-tr-none text-xs shadow-md">
                              I need help with my refund.
                          </div>
                      </div>
                      <div className="flex gap-3">
                          <div className="w-6 h-6 rounded-full bg-black flex-shrink-0"></div>
                          <div className="bg-white p-3 rounded-2xl rounded-tl-none text-xs text-gray-600 shadow-sm border border-gray-100">
                              I can help with that. Which booking is this regarding?
                              <div className="mt-2 flex flex-col gap-2">
                                  <button className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg text-left text-xs font-bold text-gray-800 transition">#B8829 - Diani Villa</button>
                                  <button className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg text-left text-xs font-bold text-gray-800 transition">#A9921 - Nairobi Apartment</button>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Chat Input */}
                  <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
                      <input type="text" placeholder="Type a message..." className="flex-1 bg-gray-50 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-nearlink/50 transition"/>
                      <button className="w-9 h-9 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition">
                          <Send size={16}/>
                      </button>
                  </div>
              </div>
          ) : (
              <button 
                onClick={() => setIsChatOpen(true)}
                className="bg-black text-white p-4 rounded-full shadow-2xl hover:scale-110 transition duration-300 group flex items-center gap-2 pr-6"
              >
                  <MessageSquare size={24} className="group-hover:animate-bounce"/>
                  <span className="font-bold text-sm">Chat Support</span>
              </button>
          )}
      </div>

      <Footer />
    </main>
  );
}