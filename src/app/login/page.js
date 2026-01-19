'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation'; 
import { useAuth } from '@/context/AuthContext'; 
import { 
  Eye, EyeOff, ArrowRight, Lock, Mail, Chrome, Smartphone, 
  X, Loader2, AlertCircle, Quote, Sparkles, Globe, LogIn
} from 'lucide-react';

// --- QUOTES DATA ---
const WELCOME_QUOTES = [
  { text: "To travel is to live.", author: "Hans Christian Andersen" },
  { text: "Welcome home to everywhere.", author: "NearLink Philosophy" },
  { text: "Travel brings power and love back into your life.", author: "Rumi" },
  { text: "We connect you to the places that matter.", author: "NearLink Host" }
];

// 1. We moved the main logic into this inner component
function LoginContent() {
  // --- STATE ---
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [focusedField, setFocusedField] = useState(null);
  const [error, setError] = useState('');
  const [currentQuote, setCurrentQuote] = useState(0);

  // --- HOOKS ---
  const { user, login, googleLogin, appleLogin } = useAuth() || {};
  const router = useRouter();
  const searchParams = useSearchParams(); // This is what caused the build error before

  // Get the return URL or default to Home ('/')
  const returnUrl = searchParams.get('returnUrl') || '/';

  // --- AUTO-REDIRECT ---
  useEffect(() => {
    if (user) {
      router.push(returnUrl); 
    }
  }, [user, router, returnUrl]);

  // --- QUOTE ROTATION ---
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % WELCOME_QUOTES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // --- HELPER: ERROR MESSAGE FORMATTER ---
  const handleAuthError = (err) => {
    console.error("Auth Error:", err);
    if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
      setError("Incorrect email or password.");
    } else if (err.code === 'auth/too-many-requests') {
      setError("Too many attempts. Try again later.");
    } else if (err.code === 'auth/network-request-failed') {
      setError("Network error. Check your connection.");
    } else {
      setError(err.message || "Failed to sign in.");
    }
  };

  // --- EMAIL LOGIN HANDLER ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!login) throw new Error("Auth system is initializing. Please wait...");
      await login(formData.email, formData.password);
      router.push(returnUrl); 
    } catch (err) {
      handleAuthError(err);
      setIsLoading(false); 
    }
  };

  // --- SOCIAL LOGIN HANDLER ---
  const handleSocialLogin = async (provider) => {
    setError('');
    setIsLoading(true);
    try {
      if (provider === 'google') {
         if (!googleLogin) throw new Error("Google Login not ready");
         await googleLogin();
      }
      if (provider === 'apple') {
         if (!appleLogin) throw new Error("Apple Login not ready");
         await appleLogin();
      }
      router.push(returnUrl); 
    } catch (err) {
      handleAuthError(err);
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white grid grid-cols-1 lg:grid-cols-2 font-sans overflow-hidden">
      
      {/* 1. LEFT SIDE: IMMERSIVE BRANDING (Dark Mode) */}
      <div className="hidden lg:flex relative bg-gray-900 flex-col justify-between p-12 overflow-hidden order-2 lg:order-1">
          
          {/* Animated Background */}
          <div className="absolute inset-0 z-0">
              <img 
                src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2000" 
                className="w-full h-full object-cover opacity-40 hover:scale-105 transition-transform duration-[40s] ease-linear" 
                alt="Luxury Interior"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/80"></div>
          </div>

          {/* Top Bar */}
          <div className="relative z-10 flex justify-between items-center w-full">
              <div className="flex items-center gap-2 text-white font-black text-3xl tracking-tighter">
                  <div className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center shadow-lg">N</div>
                  NearLink
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-xs font-bold text-white flex items-center gap-2 shadow-xl animate-pulse">
                 <Sparkles size={14} className="text-yellow-400" /> Secure Login
              </div>
          </div>

          {/* Middle: Rotating Quotes */}
          <div className="relative z-10 max-w-lg mt-auto mb-20">
             <Quote size={40} className="text-white/20 mb-6" />
             <div className="h-32 transition-all duration-700 ease-in-out">
                <h2 className="text-4xl font-black text-white leading-tight mb-4 drop-shadow-lg">
                   "{WELCOME_QUOTES[currentQuote].text}"
                </h2>
                <p className="text-lg text-gray-300 font-medium tracking-wide">
                   — {WELCOME_QUOTES[currentQuote].author}
                </p>
             </div>
             {/* Progress Dots */}
             <div className="flex gap-2 mt-4">
                {WELCOME_QUOTES.map((_, idx) => (
                  <div key={idx} className={`h-1 rounded-full transition-all duration-500 ${currentQuote === idx ? 'w-8 bg-white' : 'w-2 bg-white/30'}`}></div>
                ))}
             </div>
          </div>

          {/* Footer */}
          <div className="relative z-10 flex justify-between items-center text-xs text-gray-400 font-bold tracking-widest uppercase">
              <p>Host & Guest Portal</p>
              <div className="flex gap-6">
                 <span className="flex items-center gap-1"><Globe size={12}/> Global Access</span>
              </div>
          </div>
      </div>

      {/* 2. RIGHT SIDE: HIGH CONTRAST FORM */}
      <div className="flex items-center justify-center p-6 sm:p-12 lg:p-16 relative order-1 lg:order-2 bg-gray-50">
          
          <div className="w-full max-w-[500px] bg-white p-8 sm:p-10 rounded-[2rem] shadow-2xl border border-gray-100 relative overflow-hidden">
              
              {/* Decorative Gradient Line */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-black via-gray-700 to-black"></div>

              {/* Header */}
              <div className="mb-8">
                  <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Welcome Back</h1>
                  <p className="text-gray-600 text-lg font-medium">Please enter your details to sign in.</p>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-bold p-4 mb-6 rounded-r flex items-center gap-3 shadow-sm animate-in fade-in slide-in-from-top-2">
                   <AlertCircle size={20}/> {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-6">
                  
                  {/* Email Input */}
                  <div className={`relative group transition-all duration-300 ${focusedField === 'email' ? '-translate-y-1' : ''}`}>
                      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'email' ? 'text-black' : 'text-gray-400'}`}>
                          <Mail size={22}/>
                      </div>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full bg-gray-50 border-2 rounded-xl px-4 pt-6 pb-2 text-gray-900 text-lg font-bold outline-none transition-all placeholder-transparent ${focusedField === 'email' ? 'border-black bg-white shadow-lg pl-4' : 'border-gray-200 pl-14 hover:border-gray-300'}`}
                      />
                      <label className={`absolute left-4 transition-all pointer-events-none font-bold text-xs tracking-wider uppercase ${focusedField === 'email' || formData.email ? 'top-3 text-gray-500' : 'top-1/2 -translate-y-1/2 ml-10 text-gray-500 text-sm'}`}>
                          Email Address
                      </label>
                  </div>

                  {/* Password Input */}
                  <div className={`relative group transition-all duration-300 ${focusedField === 'password' ? '-translate-y-1' : ''}`}>
                      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'password' ? 'text-black' : 'text-gray-400'}`}>
                          <Lock size={22}/>
                      </div>
                      <input 
                        type={showPassword ? "text" : "password"} 
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full bg-gray-50 border-2 rounded-xl px-4 pt-6 pb-2 text-gray-900 text-lg font-bold outline-none transition-all placeholder-transparent ${focusedField === 'password' ? 'border-black bg-white shadow-lg pl-4' : 'border-gray-200 pl-14 hover:border-gray-300'}`}
                      />
                      <label className={`absolute left-4 transition-all pointer-events-none font-bold text-xs tracking-wider uppercase ${focusedField === 'password' || formData.password ? 'top-3 text-gray-500' : 'top-1/2 -translate-y-1/2 ml-10 text-gray-500 text-sm'}`}>
                          Password
                      </label>
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition p-2"
                      >
                          {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                      </button>
                  </div>

                  {/* Extras (Remember Me / Forgot Password) */}
                  <div className="flex justify-between items-center">
                      <label className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative flex items-center">
                            <input type="checkbox" className="peer w-5 h-5 rounded border-2 border-gray-300 checked:bg-black checked:border-black transition-all appearance-none cursor-pointer" />
                            <Chrome size={12} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                          </div>
                          <span className="text-sm font-bold text-gray-500 group-hover:text-black transition">Remember me</span>
                      </label>
                      <a href="#" className="text-sm font-bold text-black hover:underline underline-offset-4 decoration-2">
                          Forgot password?
                      </a>
                  </div>

                  {/* Submit Button */}
                  <button 
                    disabled={isLoading}
                    className="w-full bg-black text-white h-16 rounded-xl font-black text-xl shadow-xl hover:bg-gray-900 hover:scale-[1.02] hover:shadow-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group"
                  >
                      {isLoading ? (
                          <Loader2 className="animate-spin" />
                      ) : (
                          <>Sign In <LogIn size={24} className="group-hover:translate-x-1 transition"/></>
                      )}
                  </button>

              </form>

              {/* Divider */}
              <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                  <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-500 font-bold uppercase text-[10px] tracking-widest">Or continue with</span></div>
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-4">
                  <button 
                    type="button" 
                    onClick={() => handleSocialLogin('google')}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-3 h-14 border-2 border-gray-100 rounded-xl hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 transition font-bold text-gray-700 text-base group disabled:opacity-50"
                  >
                      <Chrome size={22} className="text-gray-500 group-hover:text-blue-600 transition"/> Google
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleSocialLogin('apple')}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-3 h-14 border-2 border-gray-100 rounded-xl hover:border-black hover:bg-gray-50 hover:text-black transition font-bold text-gray-700 text-base group disabled:opacity-50"
                  >
                      <Smartphone size={22} className="text-gray-500 group-hover:text-black transition"/> Apple
                  </button>
              </div>

              <p className="text-center text-gray-600 text-base font-medium mt-6">
                  Don't have an account? <Link href="/signup" className="text-black font-black hover:underline">Create free account</Link>
              </p>

          </div>
          
          {/* Mobile Home Button */}
          <Link href="/" className="absolute top-6 right-6 lg:hidden bg-white p-3 rounded-full shadow-lg text-black">
              <X size={24}/>
          </Link>
      </div>

    </main>
  );
}

// 2. This Main Component Wraps the Content in Suspense
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="animate-spin w-10 h-10 text-black" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}