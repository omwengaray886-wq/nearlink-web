// src/app/host/create/page.js
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Image as ImageIcon, MapPin, DollarSign, Home, 
  Check, ChevronRight, Minus, Plus, Tent, Building, Warehouse, Castle 
} from 'lucide-react';

// Categories for Step 1
const CATEGORIES = [
  { id: 'apartment', label: 'Apartment', icon: Building },
  { id: 'house', label: 'House', icon: Home },
  { id: 'villa', label: 'Villa', icon: Castle },
  { id: 'cabin', label: 'Cabin', icon: Tent },
  { id: 'farm', label: 'Farm', icon: Warehouse },
];

export default function CreateListingWizard() {
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  
  // Complex State Management for the Listing
  const [formData, setFormData] = useState({
    category: '',
    location: '',
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    title: '',
    description: '',
    price: 5000,
    images: []
  });

  // Navigation Handlers
  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // Counter Handler
  const updateCount = (field, operation) => {
    setFormData(prev => ({
      ...prev,
      [field]: operation === 'inc' ? prev[field] + 1 : Math.max(1, prev[field] - 1)
    }));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      
      {/* 1. TOP BAR: Navigation & Logo */}
      <div className="bg-white px-8 py-4 flex justify-between items-center sticky top-0 z-50">
          <Link href="/host/dashboard" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition">
             <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
          </Link>
          <div className="flex-1 px-8 hidden md:block">
              {/* Progress Bar */}
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-nearlink h-full transition-all duration-500 ease-out"
                    style={{ width: `${(step / totalSteps) * 100}%` }}
                  ></div>
              </div>
          </div>
          <Link href="/host/dashboard">
            <button className="text-sm font-bold border border-gray-200 rounded-full px-4 py-2 hover:border-black transition">
                Exit / Save Draft
            </button>
          </Link>
      </div>

      {/* 2. MAIN CONTENT AREA (Dynamic based on Step) */}
      <div className="flex-1 flex flex-col justify-center items-center max-w-2xl mx-auto w-full px-6 py-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* STEP 1: Category Selection */}
          {step === 1 && (
            <div className="w-full">
                <h1 className="text-3xl font-bold mb-8 fade-in">Which of these best describes your place?</h1>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {CATEGORIES.map((cat) => (
                        <div 
                            key={cat.id}
                            onClick={() => setFormData({...formData, category: cat.id})}
                            className={`
                                cursor-pointer border-2 rounded-xl p-4 flex flex-col gap-3 hover:border-black transition
                                ${formData.category === cat.id ? 'border-black bg-gray-50' : 'border-gray-200'}
                            `}
                        >
                            <cat.icon size={32} className="text-gray-700" />
                            <span className="font-bold text-gray-700">{cat.label}</span>
                        </div>
                    ))}
                </div>
            </div>
          )}

          {/* STEP 2: Location & Basics */}
          {step === 2 && (
            <div className="w-full space-y-8">
                <div>
                   <h1 className="text-3xl font-bold mb-2">Where's your place located?</h1>
                   <p className="text-gray-500 mb-6">Your address is only shared with guests after they make a reservation.</p>
                   <div className="relative">
                       <MapPin className="absolute top-4 left-4 text-gray-900" />
                       <input 
                          type="text" 
                          placeholder="Start typing your address..." 
                          className="w-full border border-gray-400 rounded-xl p-4 pl-12 text-lg outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                       />
                   </div>
                </div>
                
                <hr className="border-gray-200" />

                <div>
                   <h1 className="text-2xl font-bold mb-6">Share some basics about your place</h1>
                   {['guests', 'bedrooms', 'bathrooms'].map((item) => (
                       <div key={item} className="flex justify-between items-center py-4 border-b border-gray-100 last:border-0">
                           <span className="text-lg capitalize text-gray-700">{item}</span>
                           <div className="flex items-center gap-4">
                               <button 
                                  onClick={() => updateCount(item, 'dec')}
                                  className={`w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-black ${formData[item] <= 1 ? 'opacity-20 cursor-not-allowed' : ''}`}
                                  disabled={formData[item] <= 1}
                               >
                                   <Minus size={16} />
                               </button>
                               <span className="text-lg font-medium w-4 text-center">{formData[item]}</span>
                               <button 
                                  onClick={() => updateCount(item, 'inc')}
                                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-black"
                               >
                                   <Plus size={16} />
                               </button>
                           </div>
                       </div>
                   ))}
                </div>
            </div>
          )}

          {/* STEP 3: Photos */}
          {step === 3 && (
            <div className="w-full">
                <h1 className="text-3xl font-bold mb-2">Add some photos of your house</h1>
                <p className="text-gray-500 mb-8">You'll need 5 photos to get started. You can add more or make changes later.</p>
                
                <div className="border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl h-[300px] flex flex-col items-center justify-center cursor-pointer hover:border-black hover:bg-gray-100 transition">
                    <ImageIcon size={64} className="text-gray-400 mb-4" />
                    <div className="font-bold text-lg">Drag your photos here</div>
                    <div className="text-sm text-gray-500 underline">Choose from your device</div>
                </div>
            </div>
          )}

          {/* STEP 4: Title & Description */}
          {step === 4 && (
             <div className="w-full space-y-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Now, let's give your house a title</h1>
                    <p className="text-gray-500 mb-6">Short titles work best. Have fun with it—you can always change it later.</p>
                    <textarea 
                        className="w-full border border-gray-400 rounded-xl p-4 text-2xl font-bold outline-none focus:border-black h-32 resize-none"
                        placeholder="e.g. Modern Villa in Westlands"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                    <div className="text-xs text-gray-500 mt-2">{formData.title.length}/32</div>
                </div>
                <div>
                    <h1 className="text-2xl font-bold mb-2">Create your description</h1>
                    <p className="text-gray-500 mb-6">Share what makes your place special.</p>
                    <textarea 
                        className="w-full border border-gray-400 rounded-xl p-4 text-lg outline-none focus:border-black h-40 resize-none"
                        placeholder="You'll have a great time at this comfortable place to stay..."
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                </div>
             </div>
          )}

           {/* STEP 5: Price */}
           {step === 5 && (
             <div className="w-full text-center">
                <h1 className="text-3xl font-bold mb-2">Now, set your price</h1>
                <p className="text-gray-500 mb-12">You can change it anytime.</p>
                
                <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-sm mx-auto shadow-lg relative">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <button onClick={() => updateCount('price', 'dec')} className="p-3 bg-gray-100 rounded-full hover:bg-gray-200"><Minus size={20}/></button>
                        <div className="relative">
                            <span className="absolute top-2 left-0 text-3xl font-bold">KSh</span>
                            <input 
                                type="number" 
                                className="text-6xl font-bold w-48 text-center outline-none pl-8"
                                value={formData.price}
                                onChange={(e) => setFormData({...formData, price: parseInt(e.target.value) || 0})}
                            />
                        </div>
                        <button onClick={() => updateCount('price', 'inc')} className="p-3 bg-gray-100 rounded-full hover:bg-gray-200"><Plus size={20}/></button>
                    </div>
                    <div className="text-gray-500">per night</div>
                    
                    <div className="mt-6 bg-gray-50 p-4 rounded-xl flex justify-between text-sm">
                         <span>Guest Price</span>
                         <span className="font-bold">KSh {formData.price + 500}</span>
                    </div>
                    <div className="mt-2 bg-gray-50 p-4 rounded-xl flex justify-between text-sm">
                         <span>You Earn</span>
                         <span className="font-bold text-green-600">KSh {formData.price}</span>
                    </div>
                </div>
             </div>
          )}

      </div>

      {/* 3. FOOTER: Navigation Controls */}
      <div className="bg-white border-t border-gray-200 p-4 fixed bottom-0 w-full z-50">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
              <button 
                 onClick={prevStep}
                 className={`font-bold underline text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-100 transition ${step === 1 ? 'invisible' : 'visible'}`}
              >
                 Back
              </button>
              
              {step < totalSteps ? (
                  <button 
                    onClick={nextStep}
                    className="bg-gray-900 text-white font-bold text-lg px-8 py-3 rounded-lg hover:bg-black transition flex items-center gap-2"
                  >
                    Next
                  </button>
              ) : (
                  <Link href="/host/dashboard">
                    <button 
                      className="bg-nearlink hover:bg-nearlink-dark text-white font-bold text-lg px-8 py-3 rounded-lg transition flex items-center gap-2 shadow-lg shadow-nearlink/30"
                    >
                        <Check size={20} /> Publish Listing
                    </button>
                  </Link>
              )}
          </div>
      </div>
      
      {/* Spacer for fixed footer */}
      <div className="h-24"></div>
    </div>
  );
}