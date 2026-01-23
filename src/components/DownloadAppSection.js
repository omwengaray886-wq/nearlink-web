'use client';

import { Apple, Play, Smartphone, Star } from 'lucide-react';

export default function DownloadAppSection() {
  return (
    <section className="relative bg-black text-white overflow-hidden py-24">
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]" />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* LEFT: Copy & Buttons */}
          <div className="flex-1 text-center lg:text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
                <Smartphone size={16} className="text-green-400" />
                <span className="text-xs font-bold tracking-widest uppercase">Available on iOS & Android</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold leading-tight">
              The world of NearLink,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">now pocket-sized.</span>
            </h2>
            
            <p className="text-lg text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Experience seamless hosting and booking. Manage reservations, chat with guests, and track your revenue in real-time—all from our award-winning mobile app.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              {/* Apple Store Button */}
              <button className="group flex items-center gap-3 bg-white text-black px-6 py-3 rounded-xl hover:scale-105 transition duration-300">
                <Apple size={28} fill="currentColor" />
                <div className="text-left">
                  <div className="text-[10px] font-bold uppercase tracking-wide opacity-60">Download on the</div>
                  <div className="text-lg font-bold leading-none">App Store</div>
                </div>
              </button>

              {/* Google Play Button */}
              <button className="group flex items-center gap-3 bg-transparent border border-white/20 text-white px-6 py-3 rounded-xl hover:bg-white/10 hover:border-white transition duration-300">
                <Play size={28} fill="currentColor" />
                <div className="text-left">
                  <div className="text-[10px] font-bold uppercase tracking-wide opacity-60">Get it on</div>
                  <div className="text-lg font-bold leading-none">Google Play</div>
                </div>
              </button>
            </div>

            {/* Social Proof / Rating */}
            <div className="flex items-center justify-center lg:justify-start gap-4 pt-4 text-sm font-medium text-gray-400">
                <div className="flex gap-1 text-yellow-400">
                    {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor"/>)}
                </div>
                <span>4.9/5 Rating from 12k+ users</span>
            </div>
          </div>

          {/* RIGHT: Phone Mockup Visual */}
          <div className="flex-1 relative flex justify-center lg:justify-end">
             {/* Abstract Phone Container */}
             <div className="relative w-[300px] h-[600px] bg-gray-900 rounded-[3rem] border-[8px] border-gray-800 shadow-2xl overflow-hidden ring-1 ring-white/10 rotate-[-6deg] hover:rotate-0 transition duration-700">
                {/* Simulated Screen Content */}
                <div className="absolute inset-0 bg-gray-800">
                    {/* Placeholder for your actual app screenshot */}
                    <img 
                        src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1000&auto=format&fit=crop" 
                        className="w-full h-full object-cover opacity-80 hover:opacity-100 transition"
                        alt="App Screen"
                    />
                    
                    {/* UI Overlay Animation */}
                    <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 animate-pulse">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center font-bold">N</div>
                            <div>
                                <div className="h-2 w-24 bg-white/50 rounded mb-2"></div>
                                <div className="h-2 w-16 bg-white/30 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
             
             {/* Floating Elements behind */}
             <div className="absolute top-20 -right-10 w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl rotate-12 blur-sm opacity-60 animate-bounce delay-700" />
             <div className="absolute bottom-20 -left-10 w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full blur-md opacity-60 animate-bounce" />
          </div>

        </div>
      </div>
    </section>
  );
}