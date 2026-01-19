'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Building, Hotel, ChevronRight, ChevronLeft, 
  Upload, Check, X, Wifi, Coffee, Tv, Car, Wind, MapPin, 
  Image as ImageIcon, Utensils, Calendar, Map, Bus, Tent, Music, Briefcase
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import ImageUpload from '@/components/ImageUpload';

// --- 1. DEFINE THE 6 MAIN LISTING TYPES ---
const LISTING_TYPES = [
  { id: 'stay', label: 'Stays', icon: Home, desc: 'Homes, hotels, & apartments' },
  { id: 'experience', label: 'Experiences', icon: Tent, desc: 'Tours, hikes, & activities' },
  { id: 'transport', label: 'Transport', icon: Car, desc: 'Car rentals & shuttles' },
  { id: 'food', label: 'Food', icon: Utensils, desc: 'Restaurants & home chefs' },
  { id: 'guide', label: 'Travel Guide', icon: Map, desc: 'Local experts & fixers' },
  { id: 'event', label: 'Events', icon: Calendar, desc: 'Parties, meetups, & shows' },
];

// --- 2. DEFINE SUB-CATEGORIES (Dynamic based on Type) ---
const SUB_CATEGORIES = {
  stay: [
    { id: 'apartment', label: 'Apartment' }, { id: 'house', label: 'House' }, { id: 'hotel', label: 'Hotel' }
  ],
  experience: [
    { id: 'adventure', label: 'Adventure' }, { id: 'cultural', label: 'Cultural' }, { id: 'workshop', label: 'Workshop' }
  ],
  transport: [
    { id: 'suv', label: 'SUV' }, { id: 'sedan', label: 'Sedan' }, { id: 'bus', label: 'Bus/Van' }
  ],
  food: [
    { id: 'restaurant', label: 'Restaurant' }, { id: 'delivery', label: 'Delivery Only' }, { id: 'private_chef', label: 'Private Chef' }
  ],
  guide: [
    { id: 'tour', label: 'Tour Guide' }, { id: 'translator', label: 'Translator' }, { id: 'driver', label: 'Driver/Guide' }
  ],
  event: [
    { id: 'party', label: 'Party' }, { id: 'conference', label: 'Conference' }, { id: 'concert', label: 'Concert' }
  ]
};

// --- 3. AMENITIES (General) ---
const COMMON_AMENITIES = [
  { id: 'wifi', label: 'Wifi', icon: Wifi },
  { id: 'parking', label: 'Parking', icon: Car },
  { id: 'ac', label: 'AC', icon: Wind },
];

export default function CreateListingWizard({ onClose, onSuccess, initialData }) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // --- STATE MANAGEMENT ---
  const [data, setData] = useState({
    type: initialData?.type || '', // New field: 'stay', 'food', etc.
    category: initialData?.category || '',
    title: initialData?.title || '',
    description: initialData?.description || '',
    location: initialData?.location || { city: '', street: '' },
    // Dynamic details object to handle different needs
    details: initialData?.details || { 
      guests: 1, bedrooms: 1, bathrooms: 1, // Stay
      seats: 4, transmission: 'Auto', // Transport
      date: '', capacity: 100, // Event
      cuisine: '', openingTime: '' // Food
    },
    amenities: initialData?.amenities || [],
    price: initialData?.pricePerNight || '', // Generic price field
    imageUrl: initialData?.images?.[0] || ''
  });

  const updateData = (key, value) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const updateDetail = (key, value) => {
    setData(prev => ({ ...prev, details: { ...prev.details, [key]: value } }));
  };

  const toggleAmenity = (id) => {
    setData(prev => {
      const exists = prev.amenities.includes(id);
      return {
        ...prev,
        amenities: exists ? prev.amenities.filter(a => a !== id) : [...prev.amenities, id]
      };
    });
  };

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const payload = {
        ...data,
        pricePerNight: Number(data.price), // Keeping db field consistent for now
        images: data.imageUrl ? [data.imageUrl] : ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"],
        ...(initialData ? {} : {
            hostId: user.uid,
            host: {
               name: user.name || "Host",
               image: user.image || "https://github.com/shadcn.png",
               joined: new Date().getFullYear().toString(),
            },
            status: 'active',
            createdAt: serverTimestamp(),
            rating: "New",
            reviewCount: 0,
            views: 0
        }),
      };

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

  // --- DYNAMIC RENDERERS ---

  // Renders the specific inputs for Step 2 based on Listing Type
  const renderDetailsStep = () => {
    switch (data.type) {
      case 'stay':
        return (
          <div className="space-y-6">
             <h3 className="font-bold text-black">Accommodation Details</h3>
             {['guests', 'bedrooms', 'bathrooms'].map(key => (
                <div key={key} className="flex items-center justify-between">
                    <span className="capitalize text-black font-medium">{key}</span>
                    <div className="flex items-center gap-4">
                        <button onClick={() => updateDetail(key, Math.max(0, data.details[key]-1))} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-black hover:bg-gray-100">-</button>
                        <span className="w-4 text-center text-black font-bold">{data.details[key]}</span>
                        <button onClick={() => updateDetail(key, data.details[key]+1)} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-black hover:bg-gray-100">+</button>
                    </div>
                </div>
             ))}
          </div>
        );
      case 'transport':
        return (
          <div className="space-y-4">
             <h3 className="font-bold text-black">Vehicle Details</h3>
             <div>
               <label className="text-xs font-bold text-gray-500 uppercase">Seats</label>
               <input type="number" value={data.details.seats} onChange={e => updateDetail('seats', e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl text-black bg-white"/>
             </div>
             <div>
               <label className="text-xs font-bold text-gray-500 uppercase">Transmission</label>
               <select value={data.details.transmission} onChange={e => updateDetail('transmission', e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl text-black bg-white">
                 <option>Automatic</option><option>Manual</option>
               </select>
             </div>
          </div>
        );
      case 'event':
        return (
          <div className="space-y-4">
             <h3 className="font-bold text-black">Event Details</h3>
             <div>
               <label className="text-xs font-bold text-gray-500 uppercase">Event Date</label>
               <input type="date" value={data.details.date} onChange={e => updateDetail('date', e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl text-black bg-white"/>
             </div>
             <div>
               <label className="text-xs font-bold text-gray-500 uppercase">Capacity (People)</label>
               <input type="number" value={data.details.capacity} onChange={e => updateDetail('capacity', e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl text-black bg-white"/>
             </div>
          </div>
        );
      case 'food':
        return (
           <div className="space-y-4">
             <h3 className="font-bold text-black">Restaurant Details</h3>
             <div>
               <label className="text-xs font-bold text-gray-500 uppercase">Cuisine Type</label>
               <input placeholder="e.g. Italian, Swahili, Sushi" value={data.details.cuisine} onChange={e => updateDetail('cuisine', e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl text-black bg-white"/>
             </div>
             <div>
               <label className="text-xs font-bold text-gray-500 uppercase">Opening Hours</label>
               <input placeholder="e.g. 8AM - 10PM" value={data.details.openingTime} onChange={e => updateDetail('openingTime', e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl text-black bg-white"/>
             </div>
           </div>
        );
      default:
        return <p className="text-gray-500 italic">No specific details required for this category. Continue to photos.</p>;
    }
  };

  return (
    <div className="fixed inset-0 bg-white text-black z-[200] flex flex-col animate-in fade-in duration-300">
      
      {/* HEADER */}
      <div className="h-20 border-b flex items-center justify-between px-8 bg-white">
        <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} className="text-black"/></button>
            <div className="h-10 w-[1px] bg-gray-200"></div>
            <h2 className="font-bold text-lg text-black">{initialData ? 'Edit Listing' : 'Create Listing'}</h2>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-sm font-medium text-gray-500">Step {step} of 5</span>
        </div>
      </div>

      {/* PROGRESS */}
      <div className="w-full bg-gray-100 h-1">
        <motion.div className="h-full bg-black" initial={{ width: 0 }} animate={{ width: `${(step/5)*100}%` }} />
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto py-12 px-6">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: SELECT LISTING TYPE (NEW) */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h1 className="text-3xl font-black mb-2 text-black">What are you listing today?</h1>
                <p className="text-gray-500 mb-8">Choose the category that best describes your service.</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {LISTING_TYPES.map(type => (
                    <div 
                      key={type.id}
                      onClick={() => updateData('type', type.id)}
                      className={`p-6 border-2 rounded-2xl cursor-pointer transition-all hover:border-black ${data.type === type.id ? 'border-black bg-gray-50' : 'border-gray-200'}`}
                    >
                      <type.icon size={32} className="mb-4 text-gray-800"/>
                      <h3 className="font-bold text-lg text-black">{type.label}</h3>
                      <p className="text-xs text-gray-500 mt-2">{type.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 2: SUB-CATEGORY & DETAILS (DYNAMIC) */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h1 className="text-3xl font-black mb-6 text-black">Tell us more about your {data.type || 'listing'}</h1>
                
                {/* 1. Sub-Category Selector */}
                <div className="mb-8">
                   <label className="text-sm font-bold uppercase text-gray-500 mb-3 block">Category</label>
                   <div className="flex flex-wrap gap-3">
                      {(SUB_CATEGORIES[data.type] || []).map(sub => (
                        <button
                          key={sub.id}
                          onClick={() => updateData('category', sub.id)}
                          className={`px-4 py-2 rounded-full border font-medium text-sm transition ${data.category === sub.id ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300 hover:border-black'}`}
                        >
                          {sub.label}
                        </button>
                      ))}
                   </div>
                </div>

                {/* 2. Dynamic Details Form */}
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-8">
                    {renderDetailsStep()}
                </div>

                {/* 3. Location */}
                <div>
                   <label className="text-sm font-bold uppercase text-gray-500 mb-3 block">Location</label>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border border-gray-300 p-4 rounded-xl flex items-center gap-3 bg-white">
                          <MapPin size={20} className="text-gray-400"/>
                          <input 
                             placeholder="City" 
                             value={data.location.city} 
                             onChange={e => updateData('location', {...data.location, city: e.target.value})} 
                             className="w-full outline-none font-medium text-black placeholder:text-gray-400"
                          />
                      </div>
                      <input 
                         placeholder="Street/Area" 
                         value={data.location.street} 
                         onChange={e => updateData('location', {...data.location, street: e.target.value})} 
                         className="p-4 border border-gray-300 rounded-xl text-black bg-white placeholder:text-gray-400"
                      />
                   </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: IMAGES */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h1 className="text-3xl font-black mb-2 text-black">Showcase your {data.type}</h1>
                <p className="text-gray-500 mb-8">Add photos to attract customers.</p>
                <ImageUpload initialImage={data.imageUrl} onImageUploaded={(url) => updateData('imageUrl', url)} />
              </motion.div>
            )}

            {/* STEP 4: AMENITIES/FEATURES */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h1 className="text-3xl font-black mb-2 text-black">Features & Amenities</h1>
                <p className="text-gray-500 mb-8">What comes included?</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                  {COMMON_AMENITIES.map(item => (
                    <div 
                      key={item.id}
                      onClick={() => toggleAmenity(item.id)}
                      className={`p-4 border rounded-xl flex flex-col gap-3 cursor-pointer transition ${data.amenities.includes(item.id) ? 'border-black bg-gray-50 ring-1 ring-black' : 'border-gray-200 hover:border-gray-400'}`}
                    >
                      <item.icon size={24} className="text-black"/>
                      <span className="font-medium text-black">{item.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 5: FINALIZE */}
            {step === 5 && (
               <motion.div key="step5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                 <h1 className="text-3xl font-black mb-8 text-black">Review & Price</h1>
                 
                 <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-500 mb-2 uppercase">Listing Title</label>
                        <input 
                            value={data.title}
                            onChange={(e) => updateData('title', e.target.value)}
                            className="w-full text-2xl font-bold p-4 border border-gray-300 rounded-xl text-black bg-white"
                            placeholder="e.g. Luxury Beach Villa / City Tour"
                        />
                    </div>

                    <div>
                         <label className="block text-sm font-bold text-gray-500 mb-2 uppercase">Price (KES)</label>
                         <div className="relative">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold">KES</span>
                            <input 
                                type="number" 
                                value={data.price}
                                onChange={(e) => updateData('price', e.target.value)}
                                className="w-full text-4xl font-black p-4 pl-20 border border-gray-300 rounded-xl text-black bg-white outline-none focus:ring-2 ring-black/10"
                                placeholder="0"
                            />
                         </div>
                         <p className="text-sm text-gray-500 mt-2">
                           {data.type === 'stay' ? 'per night' : data.type === 'event' ? 'per ticket' : 'per booking'}
                         </p>
                    </div>
                 </div>
               </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* FOOTER */}
      <div className="h-24 border-t border-gray-200 px-8 flex items-center justify-between bg-white z-10">
        <button onClick={() => setStep(s => s - 1)} disabled={step === 1} className="font-bold underline text-sm text-black disabled:opacity-30 hover:bg-gray-100 px-4 py-2 rounded-lg">Back</button>
        {step < 5 ? (
             <button onClick={() => setStep(s => s + 1)} disabled={step === 1 && !data.type} className="bg-black text-white px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 disabled:opacity-50 hover:scale-105 transition">Next <ChevronRight size={16}/></button>
        ) : (
             <button onClick={handleSubmit} disabled={loading || !data.price} className="bg-[#005871] text-white px-8 py-3 rounded-xl font-bold text-sm disabled:opacity-50 hover:scale-105 transition">{loading ? 'Saving...' : 'Publish Listing'}</button>
        )}
      </div>
    </div>
  );
}