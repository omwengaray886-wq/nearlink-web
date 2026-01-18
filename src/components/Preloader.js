'use client';

import { Zap } from 'lucide-react';

export default function Preloader() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center">
      
      {/* 1. Animated Logo Container */}
      <div className="relative mb-8">
        {/* Outer Glow */}
        <div className="absolute inset-0 bg-[#005871] blur-2xl opacity-20 rounded-full animate-pulse"></div>
        
        {/* Logo Icon */}
        <div className="relative z-10 w-20 h-20 bg-black border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl">
           <Zap size={40} className="text-white fill-white animate-bounce-slow" />
        </div>
      </div>

      {/* 2. Brand Name with Typing Effect */}
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-black text-white tracking-tight">
          NearLink
        </h1>
        
        {/* 3. Sleek Loading Bar */}
        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-[#005871] animate-progress-indeterminate"></div>
        </div>

        {/* 4. Dynamic Loading Status */}
        <p className="text-xs font-mono text-gray-500 uppercase tracking-widest animate-pulse">
          Establishing Secure Connection...
        </p>
      </div>

      {/* CSS Animation Styles (Inline for simplicity) */}
      <style jsx>{`
        @keyframes progress-indeterminate {
          0% { width: 0%; margin-left: 0%; }
          50% { width: 70%; margin-left: 30%; }
          100% { width: 0%; margin-left: 100%; }
        }
        .animate-progress-indeterminate {
          animation: progress-indeterminate 1.5s infinite ease-in-out;
        }
        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(-5%); }
          50% { transform: translateY(5%); }
        }
      `}</style>
    </div>
  );
}