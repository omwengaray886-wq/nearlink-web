'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Building, Hotel, ChevronRight, ChevronLeft, 
  Upload, Check, X, Wifi, Coffee, Tv, Car, Wind, MapPin, 
  Image as ImageIcon, Utensils, Calendar, Map, Bus, Tent, 
  Music, Briefcase, Key, Shield, Info, DollarSign, Clock, 
  Users, Fuel, Globe, Award, AlertCircle, Dumbbell, Waves, 
  Mountain, Camera, Compass
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import ImageUpload from '@/components/ImageUpload';

// --- 1. LISTING TYPES ---
const LISTING_TYPES = [
  { id: 'stay', label: 'Stays', icon: Home, desc: 'Homes, hotels, & apartments' },
  { id: 'experience', label: 'Experiences', icon: Tent, desc: 'Tours, hikes, & adventures' },
  { id: 'transport', label: 'Transport', icon: Car, desc: 'Car rentals & shuttles' },
  { id: 'food', label: 'Food & Drink', icon: Utensils, desc: 'Restaurants & home chefs' },
  { id: 'event', label: 'Events', icon: Calendar, desc: 'Parties, concerts, & meetups' },
  { id: 'guide', label: 'Travel Guide', icon: Map, desc: 'Local experts & fixers' },
];

// --- 2. SUB-CATEGORIES ---
const SUB_CATEGORIES = {
  stay: [
    { id: 'apartment', label: 'Apartment' }, { id: 'house', label: 'Entire House' }, 
    { id: 'villa', label: 'Luxury Villa' }, { id: 'guesthouse', label: 'Guesthouse' },
    { id: 'hotel', label: 'Boutique Hotel' }, { id: 'cabin', label: 'Cabin / Cottage' }
  ],
  experience: [
    { id: 'hiking', label: 'Hiking / Trekking' }, { id: 'safari', label: 'Safari / Game Drive' }, 
    { id: 'culture', label: 'Cultural Tour' }, { id: 'workshop', label: 'Class / Workshop' },
    { id: 'water', label: 'Water Sports' }, { id: 'nightlife', label: 'Nightlife Tour' }
  ],
  transport: [
    { id: 'suv', label: 'SUV / 4x4' }, { id: 'sedan', label: 'Saloon / Sedan' }, 
    { id: 'van', label: 'Safari Van' }, { id: 'bus', label: 'Bus / Coach' },
    { id: 'bike', label: 'Motorbike' }
  ],
  food: [
    { id: 'restaurant', label: 'Restaurant' }, { id: 'cafe', label: 'Cafe / Bistro' }, 
    { id: 'bar', label: 'Bar / Lounge' }, { id: 'chef', label: 'Private Chef' }
  ],
  event: [
    { id: 'concert', label: 'Concert / Show' }, { id: 'party', label: 'Nightlife / Party' }, 
    { id: 'conference', label: 'Business / Networking' }
  ],
  guide: [
    { id: 'tour_guide', label: 'Certified Tour Guide' }, { id: 'driver_guide', label: 'Driver Guide' }, 
    { id: 'translator', label: 'Translator / Fixer' }
  ]
};

// --- 3. AMENITIES MAP (Category Specific) ---
const AMENITY_MAP = {
    stay: [
        { id: 'wifi', label: 'Fast Wifi', icon: Wifi }, 
        { id: 'kitchen', label: 'Full Kitchen', icon: Coffee },
        { id: 'ac', label: 'Air Conditioning', icon: Wind },
        { id: 'workspace', label: 'Dedicated Workspace', icon: Briefcase },
        { id: 'pool', label: 'Swimming Pool', icon: Waves },
        { id: 'gym', label: 'Gym Access', icon: Dumbbell },
        { id: 'parking', label: 'Free Parking', icon: Car },
        { id: 'tv', label: 'Smart TV', icon: Tv },
        { id: 'washer', label: 'Washer/Dryer', icon: Info },
        { id: 'security', label: '24/7 Security', icon: Shield }
    ],
    experience: [
        { id: 'transport', label: 'Transport Included', icon: Car }, 
        { id: 'food', label: 'Food & Drinks', icon: Utensils }, 
        { id: 'gear', label: 'Equipment Provided', icon: Briefcase }, 
        { id: 'photos', label: 'Photography Included', icon: Camera },
        { id: 'ticket', label: 'Park Fees Included', icon: Key }, 
        { id: 'guide', label: 'Expert Guide', icon: Users } 
    ],
    transport: [
        { id: 'ac', label: 'AC', icon: Wind }, { id: 'bluetooth', label: 'Bluetooth Audio', icon: Music }, 
        { id: 'leather', label: 'Leather Seats', icon: Star }, { id: 'tinted', label: 'Tinted Windows', icon: Shield },
        { id: 'rack', label: 'Roof Rack', icon: Briefcase }, { id: 'driver', label: 'Chauffeur Included', icon: Users }
    ],
    food: [
        { id: 'wifi', label: 'Wifi', icon: Wifi }, { id: 'outdoor', label: 'Outdoor Seating', icon: Info }, 
        { id: 'parking', label: 'Parking', icon: Car }, { id: 'delivery', label: 'Delivery', icon: Car },
        { id: 'vegan', label: 'Vegan Options', icon: Check }, { id: 'alcohol', label: 'Alcohol Served', icon: Info }
    ],
    event: [
        { id: 'vip', label: 'VIP Area', icon: Star }, { id: 'parking', label: 'Secure Parking', icon: Car }, 
        { id: 'food', label: 'Food Available', icon: Utensils }, { id: '18plus', label: '18+ Only', icon: AlertCircle }
    ],
    guide: [
        { id: 'licensed', label: 'Licensed', icon: Award }, { id: 'vehicle', label: 'Has Vehicle', icon: Car }, 
        { id: 'firstaid', label: 'First Aid Trained', icon: Shield }
    ]
};

// --- 4. HOUSE RULES (Specific to Stays) ---
const HOUSE_RULES = [
    { id: 'petsAllowed', label: 'Pets Allowed' },
    { id: 'smokingAllowed', label: 'Smoking Allowed' },
    { id: 'partiesAllowed', label: 'Events/Parties Allowed' },
    { id: 'selfCheckIn', label: 'Self Check-in (Keybox/Smartlock)' },
    { id: 'quietHours', label: 'Quiet Hours (10PM - 8AM)' }
];

// --- 5. EXPERIENCE SPECIFIC OPTIONS ---
const ACTIVITY_LEVELS = ['Easy', 'Moderate', 'Strenuous', 'Extreme'];
const AGE_GROUPS = ['All Ages', 'Kids Friendly', '12+', '18+', 'Seniors'];

export default function CreateListingWizard({ onClose, onSuccess, initialData }) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // --- ROBUST STATE ---
  const [data, setData] = useState({
    type: initialData?.type || '', 
    category: initialData?.category || '',
    title: initialData?.title || '',
    description: initialData?.description || '',
    location: initialData?.location || { street: '', city: '', state: '' },
    // Expanded Details
    details: initialData?.details || { 
      // Stay
      buildingName: '',
      guests: 2, bedrooms: 1, beds: 1, bathrooms: 1, size: '',
      checkInTime: '14:00', checkOutTime: '11:00',
      petsAllowed: false, smokingAllowed: false, partiesAllowed: false, selfCheckIn: false, quietHours: false,
      // Transport
      make: '', model: '', year: '', fuelType: 'Petrol', transmission: 'Automatic', seats: 4, withDriver: false,
      // Food
      cuisine: '', dietary: [], openingTime: '', closingTime: '',
      // Experience & Guide (ENHANCED)
      startTime: '08:00', endTime: '17:00', duration: 4, 
      meetingPoint: '', groupSize: 10, activityLevel: 'Moderate',
      minAge: 'All Ages', whatToBring: '', itinerary: '',
      // Event
      date: '', ageLimit: '18+',
      // Common
      cleaningFee: '', securityDeposit: ''
    },
    amenities: initialData?.amenities || [],
    price: initialData?.price || '', 
    // Image Logic
    imageUrl: initialData?.images?.[0] || '', // Main image
    gallery: initialData?.images || [] // Full gallery array
  });

  const updateData = (key, value) => setData(prev => ({ ...prev, [key]: value }));
  
  const updateDetail = (key, value) => {
    setData(prev => ({ ...prev, details: { ...prev.details, [key]: value } }));
  };

  const updateLocation = (key, value) => {
    setData(prev => ({ ...prev, location: { ...prev.location, [key]: value } }));
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

  // --- NEW IMAGE HANDLER FOR GALLERY ---
  const handleMainImageUpload = (url) => {
      // Set as main image AND add to gallery if not present
      setData(prev => ({
          ...prev,
          imageUrl: url,
          gallery: prev.gallery.includes(url) ? prev.gallery : [url, ...prev.gallery]
      }));
  };

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const payload = {
        ...data,
        price: Number(data.price),
        // Use gallery if available, otherwise fallback to single image array
        images: data.gallery.length > 0 ? data.gallery : [data.imageUrl], 
        ...(initialData ? {} : {
            hostId: user.uid,
            hostName: user.name || "Host",
            hostImage: user.image || "https://github.com/shadcn.png",
            status: 'active',
            createdAt: serverTimestamp(),
            rating: 0,
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

  // --- 1. STAY FORM ---
  const renderStayDetails = () => (
    <div className="space-y-6">
       <h3 className="font-bold text-black flex items-center gap-2"><Home size={18}/> Property Details</h3>
       
       <div>
          <label className="text-xs font-bold text-gray-500 uppercase">Building / Complex Name</label>
          <input 
             placeholder="e.g. Sunrise Apartments, Block B" 
             value={data.details.buildingName} 
             onChange={e => updateDetail('buildingName', e.target.value)} 
             className="w-full p-3 border border-gray-300 rounded-xl text-black"
          />
       </div>

       <div className="grid grid-cols-2 gap-4">
          {['guests', 'bedrooms', 'beds', 'bathrooms'].map(key => (
             <div key={key} className="border border-gray-200 p-3 rounded-xl bg-gray-50">
                <span className="text-xs text-gray-500 uppercase font-bold">{key}</span>
                <div className="flex items-center justify-between mt-2">
                    <button onClick={() => updateDetail(key, Math.max(0, data.details[key]-1))} className="w-8 h-8 rounded-full bg-white border border-gray-200 text-black hover:border-black transition">-</button>
                    <span className="font-bold text-black text-lg">{data.details[key]}</span>
                    <button onClick={() => updateDetail(key, data.details[key]+1)} className="w-8 h-8 rounded-full bg-black text-white hover:bg-gray-800 transition">+</button>
                </div>
             </div>
          ))}
       </div>

       <div className="grid grid-cols-2 gap-4">
          <div><label className="text-xs font-bold text-gray-500 uppercase">Check-in After</label><input type="time" value={data.details.checkInTime} onChange={e => updateDetail('checkInTime', e.target.value)} className="w-full p-2 border rounded-lg text-black bg-white"/></div>
          <div><label className="text-xs font-bold text-gray-500 uppercase">Check-out Before</label><input type="time" value={data.details.checkOutTime} onChange={e => updateDetail('checkOutTime', e.target.value)} className="w-full p-2 border rounded-lg text-black bg-white"/></div>
       </div>

       <div>
          <h4 className="font-bold text-black mb-3 text-sm uppercase flex items-center gap-2"><Key size={14}/> House Rules</h4>
          <div className="space-y-2">
            {HOUSE_RULES.map(rule => (
                <div key={rule.id} 
                    onClick={() => updateDetail(rule.id, !data.details[rule.id])}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${data.details[rule.id] ? 'border-black bg-green-50' : 'border-gray-200 hover:border-gray-400'}`}
                >
                    <div className={`w-5 h-5 rounded flex items-center justify-center border ${data.details[rule.id] ? 'bg-black border-black text-white' : 'border-gray-300'}`}>
                        {data.details[rule.id] && <Check size={12}/>}
                    </div>
                    <span className="text-sm font-medium text-black">{rule.label}</span>
                </div>
            ))}
          </div>
       </div>
    </div>
  );

  // --- 2. TRANSPORT FORM ---
  const renderTransportDetails = () => (
    <div className="space-y-6">
       <h3 className="font-bold text-black flex items-center gap-2"><Car size={18}/> Vehicle Specs</h3>
       <div className="grid grid-cols-2 gap-4">
          <div><label className="text-xs font-bold text-gray-500 uppercase">Brand / Make</label><input placeholder="e.g. Toyota" value={data.details.make} onChange={e => updateDetail('make', e.target.value)} className="w-full p-2 border rounded-lg text-black"/></div>
          <div><label className="text-xs font-bold text-gray-500 uppercase">Model</label><input placeholder="e.g. Prado" value={data.details.model} onChange={e => updateDetail('model', e.target.value)} className="w-full p-2 border rounded-lg text-black"/></div>
       </div>
       <div className="grid grid-cols-3 gap-4">
          <div><label className="text-xs font-bold text-gray-500 uppercase">Year</label><input type="number" placeholder="2018" value={data.details.year} onChange={e => updateDetail('year', e.target.value)} className="w-full p-2 border rounded-lg text-black"/></div>
          <div>
             <label className="text-xs font-bold text-gray-500 uppercase">Fuel</label>
             <select value={data.details.fuelType} onChange={e => updateDetail('fuelType', e.target.value)} className="w-full p-2 border rounded-lg text-black bg-white">
                <option>Petrol</option><option>Diesel</option><option>Electric</option>
             </select>
          </div>
          <div>
             <label className="text-xs font-bold text-gray-500 uppercase">Gearbox</label>
             <select value={data.details.transmission} onChange={e => updateDetail('transmission', e.target.value)} className="w-full p-2 border rounded-lg text-black bg-white">
                <option>Automatic</option><option>Manual</option>
             </select>
          </div>
       </div>
       <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <span className="font-bold text-black">Chauffeur / Driver Included?</span>
          <input type="checkbox" checked={data.details.withDriver} onChange={e => updateDetail('withDriver', e.target.checked)} className="w-6 h-6 accent-black"/>
       </div>
    </div>
  );

  // --- 3. FOOD FORM ---
  const renderFoodDetails = () => (
    <div className="space-y-6">
       <h3 className="font-bold text-black flex items-center gap-2"><Utensils size={18}/> Dining Details</h3>
       <div><label className="text-xs font-bold text-gray-500 uppercase">Primary Cuisine</label><input placeholder="e.g. Italian, Swahili, Steakhouse" value={data.details.cuisine} onChange={e => updateDetail('cuisine', e.target.value)} className="w-full p-3 border rounded-lg text-black"/></div>
       <div className="grid grid-cols-2 gap-4">
          <div><label className="text-xs font-bold text-gray-500 uppercase">Opening Time</label><input type="time" value={data.details.openingTime} onChange={e => updateDetail('openingTime', e.target.value)} className="w-full p-2 border rounded-lg text-black"/></div>
          <div><label className="text-xs font-bold text-gray-500 uppercase">Closing Time</label><input type="time" value={data.details.closingTime} onChange={e => updateDetail('closingTime', e.target.value)} className="w-full p-2 border rounded-lg text-black"/></div>
       </div>
    </div>
  );

  // --- 4. EVENT FORM ---
  const renderEventDetails = () => (
    <div className="space-y-6">
       <h3 className="font-bold text-black flex items-center gap-2"><Calendar size={18}/> Event Logistics</h3>
       <div><label className="text-xs font-bold text-gray-500 uppercase">Event Date</label><input type="date" value={data.details.date} onChange={e => updateDetail('date', e.target.value)} className="w-full p-3 border rounded-lg text-black"/></div>
       <div className="grid grid-cols-2 gap-4">
          <div><label className="text-xs font-bold text-gray-500 uppercase">Start Time</label><input type="time" value={data.details.startTime} onChange={e => updateDetail('startTime', e.target.value)} className="w-full p-2 border rounded-lg text-black"/></div>
          <div><label className="text-xs font-bold text-gray-500 uppercase">Age Restriction</label><select value={data.details.ageLimit} onChange={e => updateDetail('ageLimit', e.target.value)} className="w-full p-2 border rounded-lg text-black bg-white"><option>All Ages</option><option>18+</option><option>21+</option></select></div>
       </div>
    </div>
  );

  // --- 5. GUIDE/EXPERIENCE FORM (EXPANDED FOR 20 IMAGES & DETAILS) ---
  const renderExperienceDetails = () => (
    <div className="space-y-8">
       {/* 1. TIMING & LOGISTICS */}
       <div className="bg-white p-5 rounded-2xl border border-gray-200">
          <h3 className="font-bold text-black mb-4 flex items-center gap-2"><Clock size={18}/> Timing & Location</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
             <div><label className="text-xs font-bold text-gray-500 uppercase">Start Time</label><input type="time" value={data.details.startTime} onChange={e => updateDetail('startTime', e.target.value)} className="w-full p-2 border rounded-lg text-black"/></div>
             <div><label className="text-xs font-bold text-gray-500 uppercase">End Time</label><input type="time" value={data.details.endTime} onChange={e => updateDetail('endTime', e.target.value)} className="w-full p-2 border rounded-lg text-black"/></div>
          </div>
          <div>
             <label className="text-xs font-bold text-gray-500 uppercase">Meeting Point</label>
             <input placeholder="Exact location where guests should arrive" value={data.details.meetingPoint} onChange={e => updateDetail('meetingPoint', e.target.value)} className="w-full p-3 border rounded-lg text-black"/>
          </div>
       </div>

       {/* 2. REQUIREMENTS */}
       <div className="bg-white p-5 rounded-2xl border border-gray-200">
          <h3 className="font-bold text-black mb-4 flex items-center gap-2"><AlertCircle size={18}/> Rules & Requirements</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
             <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Activity Level</label>
                <select value={data.details.activityLevel} onChange={e => updateDetail('activityLevel', e.target.value)} className="w-full p-2 border rounded-lg text-black bg-white">
                    {ACTIVITY_LEVELS.map(l => <option key={l}>{l}</option>)}
                </select>
             </div>
             <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Age Suitability</label>
                <select value={data.details.minAge} onChange={e => updateDetail('minAge', e.target.value)} className="w-full p-2 border rounded-lg text-black bg-white">
                    {AGE_GROUPS.map(a => <option key={a}>{a}</option>)}
                </select>
             </div>
          </div>
          <div>
             <label className="text-xs font-bold text-gray-500 uppercase">Max Group Size</label>
             <input type="number" value={data.details.groupSize} onChange={e => updateDetail('groupSize', e.target.value)} className="w-full p-2 border rounded-lg text-black"/>
          </div>
       </div>

       {/* 3. ITINERARY & GEAR */}
       <div className="bg-white p-5 rounded-2xl border border-gray-200">
          <h3 className="font-bold text-black mb-4 flex items-center gap-2"><Compass size={18}/> The Experience</h3>
          <div className="space-y-4">
             <div>
                <label className="text-xs font-bold text-gray-500 uppercase">What to Bring</label>
                <input placeholder="e.g. Sunscreen, Hiking Boots, Water" value={data.details.whatToBring} onChange={e => updateDetail('whatToBring', e.target.value)} className="w-full p-3 border rounded-lg text-black"/>
             </div>
             <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Full Itinerary / Description</label>
                <textarea 
                    value={data.description} // Using main description for itinerary
                    onChange={e => updateData('description', e.target.value)}
                    className="w-full h-40 p-3 border rounded-lg text-black resize-none"
                    placeholder="Describe the day plan. Hour 1: Meetup... Hour 2: The Hike..."
                />
             </div>
          </div>
       </div>
    </div>
  );

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
        <div className="max-w-4xl mx-auto py-12 px-6">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: TYPE */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h1 className="text-3xl font-black mb-2 text-black">What are you listing?</h1>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
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

            {/* STEP 2: DETAILS */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h1 className="text-3xl font-black mb-6 text-black">Property Details</h1>
                
                {/* SUB-CATEGORY */}
                <div className="mb-8">
                   <label className="text-sm font-bold uppercase text-gray-500 mb-3 block">Sub-Category</label>
                   <div className="flex flex-wrap gap-3">
                      {(SUB_CATEGORIES[data.type] || SUB_CATEGORIES['stay']).map(sub => (
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* LEFT: DYNAMIC FORM */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-200">
                        {data.type === 'stay' && renderStayDetails()}
                        {data.type === 'transport' && renderTransportDetails()}
                        {data.type === 'food' && renderFoodDetails()}
                        {data.type === 'event' && renderEventDetails()}
                        {(data.type === 'experience' || data.type === 'guide') && renderExperienceDetails()}
                    </div>

                    {/* RIGHT: LOCATION & DESC */}
                    <div className="space-y-6">
                        <div className="bg-white p-5 rounded-2xl border border-gray-200">
                            <h3 className="font-bold text-black mb-4 flex items-center gap-2"><MapPin size={18}/> Location</h3>
                            <div className="space-y-3">
                                <input placeholder="Street Address" value={data.location.street} onChange={e => updateLocation('street', e.target.value)} className="w-full p-2 border rounded-lg text-black"/>
                                <div className="grid grid-cols-2 gap-3">
                                    <input placeholder="City" value={data.location.city} onChange={e => updateLocation('city', e.target.value)} className="w-full p-2 border rounded-lg text-black"/>
                                    <input placeholder="State/County" value={data.location.state} onChange={e => updateLocation('state', e.target.value)} className="w-full p-2 border rounded-lg text-black"/>
                                </div>
                            </div>
                        </div>
                        {/* Only show simple description box if NOT an experience (since Exp has itinerary) */}
                        {data.type !== 'experience' && (
                            <div className="bg-white p-5 rounded-2xl border border-gray-200">
                                <h3 className="font-bold text-black mb-4">Description</h3>
                                <textarea value={data.description} onChange={e => updateData('description', e.target.value)} className="w-full h-32 p-3 border rounded-lg text-black resize-none" placeholder="Describe the vibe..."/>
                            </div>
                        )}
                    </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: IMAGES (UPDATED FOR GALLERY) */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h1 className="text-3xl font-black mb-2 text-black">Visuals</h1>
                <p className="text-gray-500 mb-8">Add high-quality photos. For experiences, upload up to 20 images.</p>
                <ImageUpload initialImage={data.imageUrl} onImageUploaded={handleMainImageUpload} />
                
                {/* GALLERY PREVIEW */}
                {data.gallery.length > 0 && (
                    <div className="mt-6 grid grid-cols-4 gap-2">
                        {data.gallery.map((img, i) => (
                            <div key={i} className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                                <img src={img} className="w-full h-full object-cover"/>
                            </div>
                        ))}
                    </div>
                )}
              </motion.div>
            )}

            {/* STEP 4: AMENITIES */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h1 className="text-3xl font-black mb-2 text-black">Features</h1>
                <p className="text-gray-500 mb-8">What is included?</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {(AMENITY_MAP[data.type] || AMENITY_MAP['stay']).map(item => (
                    <div 
                      key={item.id}
                      onClick={() => toggleAmenity(item.id)}
                      className={`p-4 border rounded-xl flex flex-col gap-3 cursor-pointer transition ${data.amenities.includes(item.id) ? 'border-black bg-gray-900 text-white' : 'border-gray-200 hover:border-gray-400 text-black'}`}
                    >
                      <item.icon size={24}/>
                      <span className="font-medium">{item.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 5: FINAL */}
            {step === 5 && (
               <motion.div key="step5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                 <h1 className="text-3xl font-black mb-8 text-black">Final Details</h1>
                 <div className="max-w-lg mx-auto space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-500 mb-2 uppercase">Listing Title</label>
                        <input value={data.title} onChange={(e) => updateData('title', e.target.value)} className="w-full text-2xl font-bold p-4 border border-gray-300 rounded-xl text-black" placeholder="e.g. Modern Loft in CBD" />
                    </div>
                    <div>
                         <label className="block text-sm font-bold text-gray-500 mb-2 uppercase">Price (KES)</label>
                         <div className="relative">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold">KES</span>
                            <input type="number" value={data.price} onChange={(e) => updateData('price', e.target.value)} className="w-full text-4xl font-black p-4 pl-20 border border-gray-300 rounded-xl text-black outline-none focus:ring-2 ring-black/10" placeholder="0" />
                         </div>
                         <p className="text-sm text-gray-500 mt-2 text-center">
                           {data.type === 'stay' ? 'per night' : data.type === 'transport' ? 'per day' : 'per person'}
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