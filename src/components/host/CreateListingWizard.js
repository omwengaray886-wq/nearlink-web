'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Building, Hotel, ChevronRight, ChevronLeft, 
  Upload, Check, X, Wifi, Coffee, Tv, Car, Wind, MapPin, Image as ImageIcon 
} from 'lucide-react';
import { db } from '@/lib/firebase';
// 👇 Added 'doc' and 'updateDoc' for editing
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import ImageUpload from '@/components/ImageUpload';

// --- CONFIGURATION ---
const CATEGORIES = [
  { id: 'apartment', label: 'Apartment', icon: Building, desc: 'A rented unit in a multi-unit building.' },
  { id: 'house', label: 'House', icon: Home, desc: 'A standalone residential building.' },
  { id: 'hotel', label: 'Hotel', icon: Hotel, desc: 'A room in a boutique hotel or hostel.' },
];

const AMENITIES_LIST = [
  { id: 'wifi', label: 'Fast Wifi', icon: Wifi },
  { id: 'kitchen', label: 'Kitchen', icon: Coffee },
  { id: 'tv', label: 'Smart TV', icon: Tv },
  { id: 'parking', label: 'Free Parking', icon: Car },
  { id: 'ac', label: 'Air Conditioning', icon: Wind },
];

// 👇 Now accepts 'initialData' prop
export default function CreateListingWizard({ onClose, onSuccess, initialData }) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // 👇 Initialize state with existing data if available
  const [data, setData] = useState({
    category: initialData?.category || '',
    title: initialData?.title || '',
    description: initialData?.description || '',
    location: initialData?.location || { city: '', street: '' },
    details: initialData?.details || { guests: 1, bedrooms: 1, bathrooms: 1 },
    amenities: initialData?.amenities || [],
    price: initialData?.pricePerNight || '', 
    imageUrl: initialData?.images?.[0] || ''
  });

  const updateData = (key, value) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const toggleAmenity = (id) => {
    setData(prev => {
      const exists = prev.amenities.includes(id);
      return {
        ...prev,
        amenities: exists 
          ? prev.amenities.filter(a => a !== id) 
          : [...prev.amenities, id]
      };
    });
  };

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // 1. Prepare Payload
      const payload = {
        ...data,
        pricePerNight: Number(data.price),
        images: data.imageUrl ? [data.imageUrl] : ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"],
        // Only set these on creation, not update
        ...(initialData ? {} : {
            hostId: user.uid,
            host: {
                name: user.name || "Host",
                image: user.image || "https://github.com/shadcn.png",
                joined: new Date().getFullYear().toString(),
            },
            rating: "New",
            reviewCount: 0,
            status: 'active',
            createdAt: serverTimestamp(),
            views: 0
        }),
      };

      // 2. Determine Action (Create vs Update)
      if (initialData) {
        await updateDoc(doc(db, "properties", initialData.id), payload);
      } else {
        await addDoc(collection(db, "properties"), payload);
      }
      
      onSuccess(); 
    } catch (err) {
      console.error(err);
      alert("Error saving listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-[200] flex flex-col animate-in fade-in duration-300">
      
      {/* 1. WIZARD HEADER */}
      <div className="h-20 border-b flex items-center justify-between px-8 bg-white">
        <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={20}/></button>
            <div className="h-10 w-[1px] bg-gray-200"></div>
            {/* 👇 Dynamic Title */}
            <h2 className="font-bold text-lg">{initialData ? 'Edit Listing' : 'Create Listing'}</h2>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-sm font-medium text-gray-500">Step {step} of 5</span>
        </div>
      </div>

      {/* 2. PROGRESS BAR */}
      <div className="w-full bg-gray-100 h-1">
        <motion.div 
            className="h-full bg-black" 
            initial={{ width: 0 }} 
            animate={{ width: `${(step/5)*100}%` }}
        />
      </div>

      {/* 3. MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto py-12 px-6">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: CATEGORY */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h1 className="text-3xl font-black mb-2">Which of these best describes your place?</h1>
                <p className="text-gray-500 mb-8">Guests can filter by category to find exactly what they need.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {CATEGORIES.map(cat => (
                    <div 
                      key={cat.id}
                      onClick={() => updateData('category', cat.id)}
                      className={`p-6 border-2 rounded-2xl cursor-pointer transition-all hover:border-black ${data.category === cat.id ? 'border-black bg-gray-50' : 'border-gray-200'}`}
                    >
                      <cat.icon size={32} className="mb-4 text-gray-800"/>
                      <h3 className="font-bold text-lg">{cat.label}</h3>
                      <p className="text-xs text-gray-500 mt-2">{cat.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 2: BASICS */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h1 className="text-3xl font-black mb-8">Share some basics about your place</h1>
                
                {/* LOCATION */}
                <div className="space-y-4 mb-8">
                    <label className="text-sm font-bold uppercase text-gray-500">Location</label>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="border p-4 rounded-xl flex items-center gap-3">
                            <MapPin size={20} className="text-gray-400"/>
                            <input 
                                className="w-full outline-none font-medium" 
                                placeholder="City (e.g. Nairobi)" 
                                value={data.location.city}
                                onChange={(e) => updateData('location', {...data.location, city: e.target.value})}
                            />
                        </div>
                        <input 
                            className="border p-4 rounded-xl w-full outline-none font-medium" 
                            placeholder="Street / Area" 
                            value={data.location.street}
                            onChange={(e) => updateData('location', {...data.location, street: e.target.value})}
                        />
                    </div>
                </div>

                <hr className="my-8"/>

                {/* COUNTERS */}
                <div className="space-y-6">
                    {['guests', 'bedrooms', 'bathrooms'].map(key => (
                        <div key={key} className="flex items-center justify-between">
                            <span className="font-bold text-lg capitalize">{key}</span>
                            <div className="flex items-center gap-4">
                                <button onClick={() => updateData('details', {...data.details, [key]: Math.max(1, data.details[key]-1)})} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-black">-</button>
                                <span className="w-4 text-center font-medium">{data.details[key]}</span>
                                <button onClick={() => updateData('details', {...data.details, [key]: data.details[key]+1})} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-black">+</button>
                            </div>
                        </div>
                    ))}
                </div>
              </motion.div>
            )}

            {/* STEP 3: IMAGES */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h1 className="text-3xl font-black mb-2">Add some photos of your place</h1>
                <p className="text-gray-500 mb-8">You'll need at least one photo to get started.</p>

                <ImageUpload 
                    initialImage={data.imageUrl} 
                    onImageUploaded={(url) => updateData('imageUrl', url)} 
                />
                
                <div className="mt-4 p-4 bg-blue-50 text-blue-800 text-sm rounded-lg flex items-start gap-3">
                    <ImageIcon size={18} className="shrink-0 mt-0.5"/>
                    <span><strong>Pro Tip:</strong> High-quality photos increase earnings by 40%. Use natural light and landscape orientation.</span>
                </div>
              </motion.div>
            )}

            {/* STEP 4: AMENITIES */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h1 className="text-3xl font-black mb-2">What does your place offer?</h1>
                <p className="text-gray-500 mb-8">These are the most common amenities guests look for.</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {AMENITIES_LIST.map(item => (
                    <div 
                      key={item.id}
                      onClick={() => toggleAmenity(item.id)}
                      className={`p-4 border rounded-xl flex flex-col gap-3 cursor-pointer transition ${data.amenities.includes(item.id) ? 'border-black bg-gray-50 ring-1 ring-black' : 'border-gray-200 hover:border-gray-400'}`}
                    >
                      <item.icon size={24}/>
                      <span className="font-medium">{item.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 5: TITLE & PRICE */}
            {step === 5 && (
               <motion.div key="step5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                 <h1 className="text-3xl font-black mb-8">Now, let's finish up</h1>
                 
                 <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-500 mb-2 uppercase">Title</label>
                        <input 
                            value={data.title}
                            onChange={(e) => updateData('title', e.target.value)}
                            className="w-full text-2xl font-bold p-4 border rounded-xl outline-none focus:ring-2 ring-black/10"
                            placeholder="e.g. Cozy Cottage near CBD"
                            maxLength={50}
                        />
                    </div>

                    <div>
                         <label className="block text-sm font-bold text-gray-500 mb-2 uppercase">Price per night (KES)</label>
                         <input 
                            type="number" 
                            value={data.price}
                            onChange={(e) => updateData('price', e.target.value)}
                            className="w-full text-4xl font-black p-4 border rounded-xl outline-none focus:ring-2 ring-black/10"
                            placeholder="0"
                        />
                    </div>
                 </div>
               </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* 4. FOOTER ACTIONS */}
      <div className="h-24 border-t px-8 flex items-center justify-between bg-white z-10">
        <button 
            onClick={() => setStep(s => s - 1)} 
            disabled={step === 1}
            className="font-bold underline text-sm disabled:opacity-30 hover:bg-gray-100 px-4 py-2 rounded-lg"
        >
            Back
        </button>

        {step < 5 ? (
             <button 
                onClick={() => setStep(s => s + 1)}
                className="bg-black text-white px-8 py-3 rounded-xl font-bold text-sm hover:scale-105 transition flex items-center gap-2"
             >
                Next <ChevronRight size={16}/>
             </button>
        ) : (
             <button 
                onClick={handleSubmit}
                disabled={loading || !data.price || !data.title}
                className="bg-[#005871] text-white px-8 py-3 rounded-xl font-bold text-sm hover:scale-105 transition flex items-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
             >
                {loading ? 'Saving...' : (initialData ? 'Save Changes' : 'Publish Listing')}
             </button>
        )}
      </div>

    </div>
  );
}