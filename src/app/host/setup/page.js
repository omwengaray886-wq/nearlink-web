// src/app/host/setup/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db, auth } from '../../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from '../../../components/Navbar';
import { 
  Home, Camera, MapPin, DollarSign, CheckCircle, 
  ChevronRight, ChevronLeft, Loader2, Image as ImageIcon,
  Umbrella, Mountain, Tent, Castle, Palmtree, Ghost, Warehouse, Gem, Coffee 
} from 'lucide-react';

// Categories matching your homepage
const CATEGORIES = [
  { label: 'Trending', icon: Gem },
  { label: 'Beachfront', icon: Umbrella },
  { label: 'Cabins', icon: Tent },
  { label: 'Amazing Views', icon: Mountain },
  { label: 'Mansions', icon: Castle },
  { label: 'Tropical', icon: Palmtree },
  { label: 'Luxe', icon: Coffee },
  { label: 'OMG!', icon: Ghost },
  { label: 'Farms', icon: Warehouse },
];

export default function HostSetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Form Data State
  const [formData, setFormData] = useState({
    category: 'Trending',
    title: '',
    description: '',
    location: '',
    price: '',
    guests: 2,
    bedrooms: 1,
    beds: 1,
    baths: 1,
    images: ['', '', '', ''], // 4 Image Slots
    amenities: ['Wifi', 'Kitchen', 'Free Parking']
  });

  // Auth Check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        // In a real app, redirect to login. For demo, we warn.
        // router.push('/login');
      }
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    handleChange('images', newImages);
  };

  const handlePublish = async () => {
    setLoading(true);
    try {
      // 1. Clean up data
      const finalData = {
        ...formData,
        price: Number(formData.price),
        rating: 0, // New listings have no rating
        reviews: 0,
        host: {
            uid: user?.uid || 'guest_host',
            name: user?.displayName || 'New Host',
            image: user?.photoURL || null,
            joined: new Date().getFullYear().toString()
        },
        createdAt: serverTimestamp(),
        // Use default image if none provided
        image: formData.images[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80" 
      };

      // 2. Save to Firebase
      await addDoc(collection(db, "listings"), finalData);

      // 3. Success
      alert("Listing published successfully!");
      router.push('/'); // Or redirect to Host Dashboard later
    } catch (error) {
      console.error("Error publishing:", error);
      alert("Failed to publish listing.");
    } finally {
      setLoading(false);
    }
  };

  // --- WIZARD STEPS RENDERERS ---

  const renderStep1_Category = () => (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <h2 className="text-3xl font-bold mb-2">Which of these best describes your place?</h2>
      <p className="text-gray-500 mb-8">Choose a category so guests can find you easily.</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {CATEGORIES.map((cat) => (
          <div 
            key={cat.label}
            onClick={() => handleChange('category', cat.label)}
            className={`p-6 border rounded-xl flex flex-col items-center gap-3 cursor-pointer transition hover:border-black ${formData.category === cat.label ? 'border-2 border-black bg-gray-50' : 'border-gray-200'}`}
          >
            <cat.icon size={32} strokeWidth={1.5} />
            <span className="font-bold text-sm">{cat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep2_Basics = () => (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Let's give your place a name.</h2>
        <p className="text-gray-500 mb-6">Short titles work best. Have fun with it.</p>
        <input 
          type="text" 
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="e.g. Cozy Cottage in Karen" 
          className="w-full text-2xl font-bold border-b border-gray-300 py-2 focus:outline-none focus:border-black placeholder-gray-300"
          autoFocus
        />
      </div>
      
      <div>
        <h2 className="text-3xl font-bold mb-2 pt-8">Where is it located?</h2>
        <p className="text-gray-500 mb-6">Guests will only get your exact address after they book.</p>
        <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="e.g. Westlands, Nairobi" 
              className="w-full text-lg border border-gray-300 rounded-xl py-4 pl-12 focus:outline-none focus:ring-2 focus:ring-black"
            />
        </div>
      </div>
    </div>
  );

  const renderStep3_Details = () => (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">Share some details.</h2>
        <p className="text-gray-500 mb-6">You can add more amenities later.</p>
        
        <textarea 
           value={formData.description}
           onChange={(e) => handleChange('description', e.target.value)}
           placeholder="Describe your place... (e.g. 'Modern apartment with great views...')"
           rows={5}
           className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-black mb-8"
        />

        <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
                <span className="text-lg">Guests</span>
                <div className="flex items-center gap-4">
                    <button onClick={() => handleChange('guests', Math.max(1, formData.guests - 1))} className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center hover:border-black">-</button>
                    <span className="font-bold w-4 text-center">{formData.guests}</span>
                    <button onClick={() => handleChange('guests', formData.guests + 1)} className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center hover:border-black">+</button>
                </div>
            </div>
            <div className="flex justify-between items-center border-b pb-4">
                <span className="text-lg">Bedrooms</span>
                <div className="flex items-center gap-4">
                    <button onClick={() => handleChange('bedrooms', Math.max(0, formData.bedrooms - 1))} className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center hover:border-black">-</button>
                    <span className="font-bold w-4 text-center">{formData.bedrooms}</span>
                    <button onClick={() => handleChange('bedrooms', formData.bedrooms + 1)} className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center hover:border-black">+</button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );

  const renderStep4_Price = () => (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
       <h2 className="text-3xl font-bold mb-2">Now, set your price.</h2>
       <p className="text-gray-500 mb-8">You can change this at any time.</p>
       
       <div className="flex items-center justify-center mb-8">
           <span className="text-6xl font-bold text-gray-900 mr-2">KES</span>
           <input 
              type="number" 
              value={formData.price}
              onChange={(e) => handleChange('price', e.target.value)}
              placeholder="0"
              className="text-6xl font-bold text-gray-900 w-48 text-center border-none focus:ring-0 placeholder-gray-200"
              autoFocus
           />
       </div>
       <div className="text-center text-gray-500 border border-gray-200 rounded-xl p-4 max-w-md mx-auto">
           <p className="mb-1"><strong>Guest price before taxes</strong></p>
           <p>KES {formData.price ? (parseInt(formData.price) * 1.15).toFixed(0) : 0}</p>
       </div>
    </div>
  );

  const renderStep5_Photos = () => (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
        <h2 className="text-3xl font-bold mb-2">Add some photos.</h2>
        <p className="text-gray-500 mb-8">Paste image URLs for now (e.g. from Unsplash).</p>
        
        <div className="space-y-4">
            {formData.images.map((url, idx) => (
                <div key={idx} className="flex gap-4 items-center">
                    <div className="w-16 h-12 bg-gray-100 rounded-md shrink-0 overflow-hidden border border-gray-300 flex items-center justify-center">
                        {url ? <img src={url} className="w-full h-full object-cover" /> : <ImageIcon size={20} className="text-gray-400"/>}
                    </div>
                    <input 
                       type="text" 
                       value={url}
                       onChange={(e) => handleImageChange(idx, e.target.value)}
                       placeholder={`Image URL #${idx + 1} (https://...)`}
                       className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:border-black focus:outline-none"
                    />
                </div>
            ))}
            <div className="bg-blue-50 text-blue-800 text-xs p-3 rounded-lg">
                <strong>Tip:</strong> Search Unsplash.com for "Apartment", right click an image, select "Copy Image Address", and paste it here.
            </div>
        </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-white flex flex-col">
      {/* 1. Setup Navbar */}
      <div className="h-20 border-b border-gray-200 flex items-center justify-between px-8 bg-white fixed top-0 w-full z-50">
         <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center font-bold">N</div>
             <span className="font-bold hidden md:block">NearLink Setup</span>
         </div>
         <button className="text-xs font-bold border border-gray-200 px-4 py-2 rounded-full hover:border-black transition">
             Save & Exit
         </button>
      </div>

      {/* 2. Main Wizard Content */}
      <div className="flex-1 pt-32 pb-32 max-w-2xl mx-auto w-full px-6">
          
          {step === 1 && renderStep1_Category()}
          {step === 2 && renderStep2_Basics()}
          {step === 3 && renderStep3_Details()}
          {step === 4 && renderStep4_Price()}
          {step === 5 && renderStep5_Photos()}

      </div>

      {/* 3. Bottom Navigation Bar */}
      <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 p-6 z-50">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
              
              {/* Back Button */}
              <button 
                 onClick={() => setStep(step - 1)}
                 disabled={step === 1}
                 className="font-bold underline text-gray-900 disabled:text-gray-300 disabled:no-underline"
              >
                  Back
              </button>

              {/* Progress Dots */}
              <div className="flex gap-2">
                  {[1,2,3,4,5].map(s => (
                      <div key={s} className={`w-2 h-2 rounded-full ${s <= step ? 'bg-black' : 'bg-gray-200'}`}></div>
                  ))}
              </div>

              {/* Next / Publish Button */}
              {step < 5 ? (
                  <button 
                     onClick={() => setStep(step + 1)}
                     className="bg-black text-white font-bold px-8 py-3 rounded-xl hover:bg-gray-800 transition"
                  >
                      Next
                  </button>
              ) : (
                  <button 
                     onClick={handlePublish}
                     disabled={loading}
                     className="bg-nearlink text-white font-bold px-8 py-3 rounded-xl hover:bg-nearlink-dark transition flex items-center gap-2 shadow-lg shadow-nearlink/30"
                  >
                      {loading ? <Loader2 className="animate-spin" /> : "Publish Listing"}
                  </button>
              )}
          </div>
      </div>
    </main>
  );
}