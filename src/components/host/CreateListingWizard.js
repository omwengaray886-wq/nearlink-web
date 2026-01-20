'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Building, Hotel, ChevronRight, ChevronLeft, 
  Upload, Check, X, Wifi, Coffee, Tv, Car, Wind, MapPin, 
  Image as ImageIcon, Utensils, Calendar, Map as MapIcon, Bus, Tent, 
  Music, Briefcase, Key, Shield, Info, DollarSign, Clock, 
  Users, Fuel, Globe, Award, AlertCircle, Dumbbell, Waves, 
  Mountain, Camera, Compass, Star
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import ImageUpload from '@/components/ImageUpload';
// --- NEW IMPORTS FOR GOOGLE PLACES ---
import { useLoadScript, Autocomplete } from '@react-google-maps/api';

// Define libraries outside component to prevent infinite reloads
const libraries = ['places'];

// --- 1. LISTING TYPES ---
const LISTING_TYPES = [
  { id: 'stay', label: 'Stays', icon: Home, desc: 'Homes, hotels, & apartments' },
  { id: 'experience', label: 'Experiences', icon: Tent, desc: 'Tours, hikes, & adventures' },
  { id: 'transport', label: 'Transport', icon: Car, desc: 'Car rentals & shuttles' },
  { id: 'food', label: 'Food & Drink', icon: Utensils, desc: 'Restaurants, cafes & bars' }, 
  { id: 'event', label: 'Events', icon: Calendar, desc: 'Parties, concerts, & meetups' },
  { id: 'guide', label: 'Travel Guide', icon: MapIcon, desc: 'Local experts & fixers' },
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
    { id: 'bar', label: 'Bar / Lounge' } 
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

// --- 3. AMENITIES MAP ---
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

const HOUSE_RULES = [
    { id: 'petsAllowed', label: 'Pets Allowed' },
    { id: 'smokingAllowed', label: 'Smoking Allowed' },
    { id: 'partiesAllowed', label: 'Events/Parties Allowed' },
    { id: 'selfCheckIn', label: 'Self Check-in (Keybox/Smartlock)' },
    { id: 'quietHours', label: 'Quiet Hours (10PM - 8AM)' }
];

const ACTIVITY_LEVELS = ['Easy', 'Moderate', 'Strenuous', 'Extreme'];
const AGE_GROUPS = ['All Ages', 'Kids Friendly', '12+', '18+', 'Seniors'];

export default function CreateListingWizard({ onClose, onSuccess, initialData }) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // --- LOAD GOOGLE SCRIPT ---
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  // --- AUTOCOMPLETE REF ---
  const autocompleteRef = useRef(null);

  // --- STATE ---
  const [data, setData] = useState({
    type: initialData?.type || '', 
    category: initialData?.category || '',
    title: initialData?.title || '',
    description: initialData?.description || '',
    // Updated Location Structure with Lat/Lng
    location: initialData?.location || { 
        street: '', city: '', state: '', lat: null, lng: null 
    },
    details: initialData?.details || { 
      buildingName: '', guests: 2, bedrooms: 1, beds: 1, bathrooms: 1,
      checkInTime: '14:00', checkOutTime: '11:00',
      petsAllowed: false, smokingAllowed: false, partiesAllowed: false, selfCheckIn: false, quietHours: false,
      make: '', model: '', year: '', fuelType: 'Petrol', transmission: 'Automatic', seats: 4, withDriver: false,
      cuisine: '', dietary: [], openingTime: '', closingTime: '',
      startTime: '08:00', endTime: '17:00', duration: 4, 
      meetingPoint: '', groupSize: 10, activityLevel: 'Moderate',
      minAge: 'All Ages', whatToBring: '', itinerary: '',
      date: '', ageLimit: '18+',
      cleaningFee: '', securityDeposit: ''
    },
    amenities: initialData?.amenities || [],
    price: initialData?.price || '', 
    imageUrl: initialData?.images?.[0] || '', 
    gallery: initialData?.images || [] 
  });

  // --- GOOGLE PLACES HANDLER ---
  const handlePlaceSelect = () => {
    if (autocompleteRef.current) {
        const place = autocompleteRef.current.getPlace();
        
        // 1. Get Lat/Lng
        const lat = place.geometry?.location?.lat();
        const lng = place.geometry?.location?.lng();

        // 2. Extract City/State from Address Components
        let city = '';
        let state = '';
        
        if (place.address_components) {
            place.address_components.forEach(comp => {
                if (comp.types.includes("locality")) city = comp.long_name;
                if (comp.types.includes("administrative_area_level_1")) state = comp.long_name;
                if (!city && comp.types.includes("administrative_area_level_2")) city = comp.long_name;
            });
        }

        // 3. Update State
        setData(prev => ({
            ...prev,
            location: {
                street: place.formatted_address || '', // Full address
                city: city || prev.location.city,
                state: state || prev.location.state,
                lat: lat || null,
                lng: lng || null
            }
        }));
    }
  };

  const updateData = (key, value) => setData(prev => ({ ...prev, [key]: value }));
  const updateDetail = (key, value) => setData(prev => ({ ...prev, details: { ...prev.details, [key]: value } }));
  const updateLocation = (key, value) => setData(prev => ({ ...prev, location: { ...prev.location, [key]: value } }));
  
  const toggleAmenity = (id) => {
    setData(prev => {
      const exists = prev.amenities.includes(id);
      return { ...prev, amenities: exists ? prev.amenities.filter(a => a !== id) : [...prev.amenities, id] };
    });
  };

  const handleMainImageUpload = (url) => {
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
        images: data.gallery.length > 0 ? data.gallery : [data.imageUrl],
        
        // SAVE ROOT LOCATION FIELDS FOR MAP COMPATIBILITY
        latitude: data.location.lat,
        longitude: data.location.lng,
        city: data.location.city,
         
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

  // --- RENDER HELPERS ---
  const renderStayDetails = () => (
    <div className="space-y-6">
       <h3 className="font-bold text-black flex items-center gap-2"><Home size={18}/> Property Details</h3>
       <div>
          <label className="text-xs font-bold text-gray-500 uppercase">Building / Complex Name</label>
          <input placeholder="e.g. Sunrise Apartments, Block B" value={data.details.buildingName} onChange={e => updateDetail('buildingName', e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl text-black"/>
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

  const renderExperienceDetails = () => (
    <div className="space-y-8">
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
                   value={data.description} 
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
                    <div key={type.id} onClick={() => updateData('type', type.id)} className={`p-6 border-2 rounded-2xl cursor-pointer transition-all hover:border-black ${data.type === type.id ? 'border-black bg-gray-50' : 'border-gray-200'}`}>
                      <type.icon size={32} className="mb-4 text-gray-800"/>
                      <h3 className="font-bold text-lg text-black">{type.label}</h3>
                      <p className="text-xs text-gray-500 mt-2">{type.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 2: DETAILS (WITH SMART MAPS) */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h1 className="text-3xl font-black mb-6 text-black">Property Details</h1>
                
                {/* SUB-CATEGORY */}
                <div className="mb-8">
                   <label className="text-sm font-bold uppercase text-gray-500 mb-3 block">Sub-Category</label>
                   <div className="flex flex-wrap gap-3">
                      {(SUB_CATEGORIES[data.type] || SUB_CATEGORIES['stay']).map(sub => (
                        <button key={sub.id} onClick={() => updateData('category', sub.id)} className={`px-4 py-2 rounded-full border font-medium text-sm transition ${data.category === sub.id ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300 hover:border-black'}`}>
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
                                {/* GOOGLE AUTOCOMPLETE INPUT */}
                                <div className="relative">
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Search Address</label>
                                    {isLoaded ? (
                                        <Autocomplete
                                            onLoad={ref => (autocompleteRef.current = ref)}
                                            onPlaceChanged={handlePlaceSelect}
                                        >
                                            <input 
                                                placeholder="Start typing location (e.g. Westlands)..." 
                                                className="w-full p-3 border rounded-lg text-black bg-gray-50 focus:bg-white transition"
                                                defaultValue={data.location.street}
                                            />
                                        </Autocomplete>
                                    ) : (
                                        <div className="p-3 bg-gray-100 rounded-lg text-gray-400 text-sm">Loading Maps...</div>
                                    )}
                                </div>

                                <input placeholder="Street / Building" value={data.location.street} onChange={e => updateLocation('street', e.target.value)} className="w-full p-2 border rounded-lg text-black"/>
                                
                                <div className="grid grid-cols-2 gap-3">
                                    <input placeholder="City" value={data.location.city} onChange={e => updateLocation('city', e.target.value)} className="w-full p-2 border rounded-lg text-black"/>
                                    <input placeholder="State/County" value={data.location.state} onChange={e => updateLocation('state', e.target.value)} className="w-full p-2 border rounded-lg text-black"/>
                                </div>
                                
                                {/* Coordinates Display (For Verification) */}
                                <div className="text-[10px] text-gray-400 flex gap-2">
                                    <span>Lat: {data.location.lat ? data.location.lat.toFixed(5) : 'N/A'}</span>
                                    <span>Lng: {data.location.lng ? data.location.lng.toFixed(5) : 'N/A'}</span>
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

            {/* STEP 3, 4, 5 (Kept Standard) */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h1 className="text-3xl font-black mb-2 text-black">Visuals</h1>
                <p className="text-gray-500 mb-8">Add high-quality photos.</p>
                <ImageUpload initialImage={data.imageUrl} onImageUploaded={handleMainImageUpload} />
                {data.gallery.length > 0 && (
                    <div className="mt-6 grid grid-cols-4 gap-2">
                        {data.gallery.map((img, i) => (<div key={i} className="aspect-square rounded-lg overflow-hidden border border-gray-200"><img src={img} className="w-full h-full object-cover"/></div>))}
                    </div>
                )}
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h1 className="text-3xl font-black mb-2 text-black">Features</h1>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {(AMENITY_MAP[data.type] || AMENITY_MAP['stay']).map(item => (
                    <div key={item.id} onClick={() => toggleAmenity(item.id)} className={`p-4 border rounded-xl flex flex-col gap-3 cursor-pointer transition ${data.amenities.includes(item.id) ? 'border-black bg-gray-900 text-white' : 'border-gray-200 hover:border-gray-400 text-black'}`}>
                      <item.icon size={24}/>
                      <span className="font-medium">{item.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

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