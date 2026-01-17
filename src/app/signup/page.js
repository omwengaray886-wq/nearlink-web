'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  Eye, EyeOff, ArrowRight, Lock, Mail, User, Chrome, Smartphone,
  Loader2, AlertCircle, Quote, Sparkles, Globe, X 
} from 'lucide-react'; // ✅ Added 'X' here

// --- QUOTES DATA ---
const WELCOME_QUOTES = [
  { text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
  { text: "Travel is the only thing you buy that makes you richer.", author: "Anonymous" },
  { text: "Life is short and the world is wide.", author: "Simon Raven" },
  { text: "Adventure is worthwhile in itself.", author: "Amelia Earhart" }
];

export default function SignupPage() {
  // --- STATE ---
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [focusedField, setFocusedField] = useState(null);
  const [error, setError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  // Quote Carousel State
  const [currentQuote, setCurrentQuote] = useState(0);

  // --- HOOKS ---
  const { user, signup, googleLogin, appleLogin } = useAuth() || {};
  const router = useRouter();

  // --- AUTO-REDIRECT ---
  useEffect(() => {
    if (user) router.push('/');
  }, [user, router]);

  // --- QUOTE ROTATION EFFECT ---
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % WELCOME_QUOTES.length);
    }, 5000); // Change quote every 5 seconds
    return () => clearInterval(timer);
  }, []);

  // --- PASSWORD LOGIC ---
  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setFormData({...formData, password: val});
    
    let score = 0;
    if (val.length > 5) score++;
    if (val.length > 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    setPasswordStrength(Math.min(score, 4));
  };

  const getStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-200';
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength === 3) return 'bg-yellow-500';
    return 'bg-emerald-500';
  };

  // --- HANDLERS ---
  const handleSocialSignup = async (provider) => {
    setError('');
    setIsLoading(true);
    try {
      if (provider === 'google') await googleLogin();
      if (provider === 'apple') await appleLogin();
      router.push('/'); 
    } catch (err) {
      console.error(err);
      setError("Unable to connect. Please try again.");
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!agreedToTerms) {
      setError("Please accept the Terms & Privacy Policy.");
      setIsLoading(false);
      return;
    }

    if (passwordStrength < 2) {
      setError("Your password is too weak.");
      setIsLoading(false);
      return;
    }

    try {
      await signup(formData.email, formData.password, formData.name, 'traveler');
      router.push('/'); 
    } catch (err) {
      console.error("Signup Error:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError("This email is already in use.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white grid grid-cols-1 lg:grid-cols-2 font-sans overflow-hidden">
      
      {/* 1. LEFT SIDE: IMMERSIVE BRANDING (Dark Mode Aesthetic) */}
      <div className="hidden lg:flex relative bg-gray-900 flex-col justify-between p-12 overflow-hidden order-2 lg:order-1">
          
          {/* Animated Background */}
          <div className="absolute inset-0 z-0">
              <img 
                src="https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?q=80&w=2000" 
                className="w-full h-full object-cover opacity-40 hover:scale-105 transition-transform duration-[40s] ease-linear" 
                alt="Luxury Travel"
              />
              {/* Stronger overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/80"></div>
          </div>

          {/* Top Bar: Logo & Badge */}
          <div className="relative z-10 flex justify-between items-center w-full">
              <div className="flex items-center gap-2 text-white font-black text-3xl tracking-tighter">
                  <div className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center shadow-lg hover:rotate-3 transition duration-300">N</div>
                  NearLink
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-xs font-bold text-white flex items-center gap-2 shadow-xl animate-pulse">
                 <Sparkles size={14} className="text-yellow-400" /> Member Access
              </div>
          </div>

          {/* Middle: Rotating Quotes */}
          <div className="relative z-10 max-w-lg mt-auto mb-20">
             <Quote size={40} className="text-white/20 mb-6" />
             <div className="h-32 transition-all duration-700 ease-in-out">
                <h2 className="text-4xl font-black text-white leading-tight mb-4 drop-shadow-lg transition-all duration-500">
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

          {/* Bottom Footer */}
          <div className="relative z-10 flex justify-between items-center text-xs text-gray-400 font-bold tracking-widest uppercase">
              <p>Crafted for Explorers</p>
              <div className="flex gap-6">
                 <span className="flex items-center gap-1"><Globe size={12}/> Global</span>
              </div>
          </div>
      </div>

      {/* 2. RIGHT SIDE: HIGH CONTRAST FORM */}
      <div className="flex items-center justify-center p-6 sm:p-12 lg:p-16 relative order-1 lg:order-2 bg-gray-50">
          
          <div className="w-full max-w-[500px] bg-white p-8 sm:p-10 rounded-[2rem] shadow-2xl border border-gray-100 relative overflow-hidden">
              
              {/* Decorative Top Gradient */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-black via-gray-700 to-black"></div>

              {/* Header */}
              <div className="mb-8">
                  <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Start your journey</h1>
                  <p className="text-gray-600 text-lg font-medium">Join our community of hosts and travelers.</p>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-bold p-4 mb-6 rounded-r flex items-center gap-3 shadow-sm animate-in fade-in slide-in-from-top-2">
                   <AlertCircle size={20}/> {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Name Input */}
                  <div className={`relative group transition-all duration-300 ${focusedField === 'name' ? '-translate-y-1' : ''}`}>
                      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'name' ? 'text-black' : 'text-gray-400'}`}>
                          <User size={22}/>
                      </div>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full bg-gray-50 border-2 rounded-xl px-4 pt-6 pb-2 text-gray-900 text-lg font-bold outline-none transition-all placeholder-transparent ${focusedField === 'name' ? 'border-black bg-white shadow-lg pl-4' : 'border-gray-200 pl-14 hover:border-gray-300'}`}
                      />
                      <label className={`absolute left-4 transition-all pointer-events-none font-bold text-xs tracking-wider uppercase ${focusedField === 'name' || formData.name ? 'top-3 text-gray-500' : 'top-1/2 -translate-y-1/2 ml-10 text-gray-500 text-sm'}`}>
                          Full Name
                      </label>
                  </div>

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

                  {/* Password Input + Strength Meter */}
                  <div className={`relative group transition-all duration-300 ${focusedField === 'password' ? '-translate-y-1' : ''}`}>
                      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'password' ? 'text-black' : 'text-gray-400'}`}>
                          <Lock size={22}/>
                      </div>
                      <input 
                        type={showPassword ? "text" : "password"} 
                        required
                        value={formData.password}
                        onChange={handlePasswordChange}
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

                  {/* High Visibility Strength Bar */}
                  <div className="flex gap-1 h-1.5 mt-2 px-1">
                     <div className={`flex-1 rounded-full transition-all duration-500 ${passwordStrength >= 1 ? getStrengthColor() : 'bg-gray-200'}`}></div>
                     <div className={`flex-1 rounded-full transition-all duration-500 ${passwordStrength >= 2 ? getStrengthColor() : 'bg-gray-200'}`}></div>
                     <div className={`flex-1 rounded-full transition-all duration-500 ${passwordStrength >= 3 ? getStrengthColor() : 'bg-gray-200'}`}></div>
                     <div className={`flex-1 rounded-full transition-all duration-500 ${passwordStrength >= 4 ? getStrengthColor() : 'bg-gray-200'}`}></div>
                  </div>

                  {/* Terms Checkbox */}
                  <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-gray-300 transition cursor-pointer" onClick={() => setAgreedToTerms(!agreedToTerms)}>
                      <div className="flex items-center h-5 mt-0.5">
                          <input 
                            id="terms" 
                            type="checkbox" 
                            checked={agreedToTerms}
                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                            className="w-5 h-5 rounded border-gray-300 accent-black cursor-pointer" 
                          />
                      </div>
                      <label className="text-sm text-gray-600 font-medium leading-tight cursor-pointer">
                          I agree to NearLink's <span className="font-bold text-black underline">Terms of Service</span> and <span className="font-bold text-black underline">Privacy Policy</span>.
                      </label>
                  </div>

                  {/* Submit Button */}
                  <button 
                    disabled={isLoading}
                    className="w-full bg-black text-white h-16 rounded-xl font-black text-xl shadow-xl hover:bg-gray-900 hover:scale-[1.02] hover:shadow-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group"
                  >
                      {isLoading ? (
                          <Loader2 className="animate-spin" />
                      ) : (
                          <>Create Account <ArrowRight size={24} className="group-hover:translate-x-1 transition"/></>
                      )}
                  </button>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                  <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-500 font-bold uppercase text-[10px] tracking-widest">Or continue with</span></div>
              </div>

              {/* Social Signup (Bottom Placement) */}
              <div className="grid grid-cols-2 gap-4">
                  <button 
                    type="button" 
                    onClick={() => handleSocialSignup('google')}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-3 h-14 border-2 border-gray-100 rounded-xl hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 transition font-bold text-gray-700 text-base group disabled:opacity-50"
                  >
                      <Chrome size={22} className="text-gray-500 group-hover:text-blue-600 transition"/> Google
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleSocialSignup('apple')}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-3 h-14 border-2 border-gray-100 rounded-xl hover:border-black hover:bg-gray-50 hover:text-black transition font-bold text-gray-700 text-base group disabled:opacity-50"
                  >
                      <Smartphone size={22} className="text-gray-500 group-hover:text-black transition"/> Apple
                  </button>
              </div>

              <p className="text-center text-gray-600 text-base font-medium mt-6">
                  Already have an account? <Link href="/login" className="text-black font-black hover:underline">Log In</Link>
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