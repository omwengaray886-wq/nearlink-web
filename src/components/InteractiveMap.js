'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Loader2, X, Navigation, Star, Users, BedDouble, ArrowRight, MapPin } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

// --- 1. CONFIGURATION ---
const containerStyle = {
  width: '100%',
  height: '100%',
};

// Default center (Nairobi)
const defaultCenter = { lat: -1.2921, lng: 36.8219 };

// --- CUSTOM MAP STYLES (Clean & Modern) ---
// Hides default business labels so your pins stand out
const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    styles: [
        { "featureType": "poi", "elementType": "labels", "stylers": [{ "visibility": "off" }] },
        { "featureType": "transit", "elementType": "labels", "stylers": [{ "visibility": "off" }] }
    ]
};

// --- CUSTOM MARKER ICONS (SVG Data URLs) ---
const MARKER_ICONS = {
    stay: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="#0f172a" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3" fill="white"/>
            </svg>`),
        scaledSize: { width: 45, height: 45 },
        anchor: { x: 22.5, y: 45 } // Center bottom of the pin
    },
    experience: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="#f97316" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3" fill="white"/>
            </svg>`),
        scaledSize: { width: 45, height: 45 },
        anchor: { x: 22.5, y: 45 }
    }
};

// --- HELPER: Distance Calc ---
const getDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 99999; 
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1*(Math.PI/180)) * Math.cos(lat2*(Math.PI/180)) * Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; 
};

export default function InteractiveMap({ onClose }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "" 
  });

  const [map, setMap] = useState(null);
  const [center, setCenter] = useState(defaultCenter);
  const [userLocation, setUserLocation] = useState(null);
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);

  // --- DATA FETCHING ---
  useEffect(() => {
    // 1. Get User Location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = { lat: position.coords.latitude, lng: position.coords.longitude };
          setCenter(userPos);
          setUserLocation(userPos);
        },
        (err) => console.warn("Location error:", err)
      );
    }

    // 2. Fetch from Firebase
    const fetchProperties = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "properties"));
        const fetchedProps = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Support all field variations
          const lat = data.location?.lat || data.lat || data.latitude;
          const lng = data.location?.lng || data.lng || data.longitude;

          if (lat && lng) {
             fetchedProps.push({ 
               id: doc.id, ...data, 
               location: { lat: parseFloat(lat), lng: parseFloat(lng) } 
             });
          }
        });
        setProperties(fetchedProps);
      } catch (error) { console.error("Error fetching properties:", error); }
    };
    fetchProperties();
  }, []);

  // --- FILTERING (50km) ---
  const visibleProperties = useMemo(() => {
    if (!userLocation) return properties.slice(0, 50);
    return properties.filter(prop => getDistance(userLocation.lat, userLocation.lng, prop.location.lat, prop.location.lng) < 50);
  }, [properties, userLocation]);

  const onLoad = useCallback((map) => setMap(map), []);
  const onUnmount = useCallback(() => setMap(null), []);

  if (!isLoaded) return <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-gray-100 rounded-3xl"><Loader2 className="animate-spin text-gray-400 mb-2" size={32} /><p className="text-sm text-gray-500 font-medium">Loading Maps...</p></div>;

  return (
    <div className="relative w-full h-full min-h-[500px] bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-200 animate-in fade-in duration-300">
      
      {/* MAP CONTROLS */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
         {userLocation && (
            <button onClick={() => map?.panTo(userLocation)} className="bg-white text-black p-3 rounded-full shadow-md hover:bg-gray-100 transition border border-gray-100" title="Go to my location">
              <Navigation size={18} className="fill-blue-500 text-blue-500"/>
            </button>
         )}
         <button onClick={onClose} className="bg-white text-black px-5 py-2.5 rounded-full shadow-md font-bold text-sm flex items-center gap-2 hover:bg-gray-100 transition border border-gray-100">
           <X size={18} /> Close Map
         </button>
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
      >
        {/* User Marker */}
        {userLocation && (
           <Marker
              position={userLocation}
              zIndex={999}
              icon={{
                  path: window.google.maps.SymbolPath.CIRCLE,
                  scale: 8,
                  fillColor: "#3b82f6",
                  fillOpacity: 1,
                  strokeWeight: 2,
                  strokeColor: "white",
              }}
           />
        )}

        {/* Property Markers */}
        {visibleProperties.map((prop) => (
           <Marker 
              key={prop.id}
              position={prop.location}
              onClick={() => setSelectedProperty(prop)}
              // Select Icon based on type
              icon={prop.type === 'experience' ? MARKER_ICONS.experience : MARKER_ICONS.stay} 
           />
        ))}

        {/* --- ADVANCED INFO CARD --- */}
        {selectedProperty && (
          <InfoWindow
            position={selectedProperty.location}
            onCloseClick={() => setSelectedProperty(null)}
            options={{ maxWidth: 320 }} // Force a wider card
          >
            <div className="p-0 w-[260px] font-sans">
              
              {/* IMAGE HEADER */}
              <div className="relative h-36 w-full bg-gray-200 rounded-xl overflow-hidden mb-3 group">
                 <img 
                    src={selectedProperty.imageUrl || selectedProperty.images?.[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700"
                    alt={selectedProperty.title}
                 />
                 {/* Type Badge */}
                 <div className="absolute top-2 left-2 bg-white/95 backdrop-blur px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-black shadow-sm">
                    {selectedProperty.category || selectedProperty.type || "Stay"}
                 </div>
                 {/* Rating Badge */}
                 <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur px-2 py-1 rounded-full text-white text-xs font-bold flex items-center gap-1 shadow-sm">
                    <Star size={10} className="fill-yellow-400 text-yellow-400" />
                    {selectedProperty.rating || "New"}
                 </div>
              </div>

              {/* CONTENT */}
              <div className="px-1">
                  <div className="mb-1">
                      <h3 className="font-bold text-base text-gray-900 leading-tight line-clamp-1">{selectedProperty.title}</h3>
                  </div>
                  
                  <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                      <MapPin size={10} /> {selectedProperty.location?.city || "Nairobi"}, {selectedProperty.location?.state || "Kenya"}
                  </p>

                  {/* Specs Row (Only if data exists) */}
                  <div className="flex gap-2 mb-3 text-gray-600 text-[10px] font-medium uppercase tracking-wide">
                      {selectedProperty.details?.guests && (
                          <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                              <Users size={10}/> {selectedProperty.details.guests} Guests
                          </span>
                      )}
                      {selectedProperty.details?.bedrooms && (
                          <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                              <BedDouble size={10}/> {selectedProperty.details.bedrooms} Bds
                          </span>
                      )}
                  </div>

                  {/* FOOTER: Price & Action */}
                  <div className="flex items-end justify-between border-t border-gray-100 pt-3 mt-2">
                     <div>
                        <div className="flex items-baseline gap-1">
                            <span className="font-black text-lg text-gray-900">KES {selectedProperty.price?.toLocaleString()}</span>
                            <span className="text-[10px] text-gray-500 font-medium">
                                {selectedProperty.type === 'stay' ? '/night' : '/person'}
                            </span>
                        </div>
                     </div>
                     
                     <button className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-800 hover:scale-110 transition shadow-lg group">
                        <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform"/>
                     </button>
                  </div>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}