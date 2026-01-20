'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Loader2, X, Navigation } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

// --- 1. CONFIGURATION ---
const containerStyle = {
  width: '100%',
  height: '100%',
};

// Default center (Nairobi)
const defaultCenter = {
  lat: -1.2921,
  lng: 36.8219
};

// --- 2. HELPER: Calculate Distance (Haversine Formula) ---
const getDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 99999; 
  const R = 6371; // Earth radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; 
};

const deg2rad = (deg) => deg * (Math.PI / 180);

export default function InteractiveMap({ onClose }) {
  // --- 3. GOOGLE MAPS LOADER ---
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "" 
  });

  // --- 4. STATE ---
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState(defaultCenter);
  const [userLocation, setUserLocation] = useState(null);
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);

  // --- 5. DATA FETCHING ---
  useEffect(() => {
    // A. Get User Location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(userPos);
          setUserLocation(userPos);
        },
        (error) => console.warn("Location access denied or error:", error)
      );
    }

    // B. Fetch Properties
    const fetchProperties = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "properties"));
        const fetchedProps = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          
          // --- THE FIX: Check ALL possible field names ---
          const lat = data.location?.lat || data.lat || data.latitude;
          const lng = data.location?.lng || data.lng || data.longitude;

          if (lat && lng) {
             fetchedProps.push({ 
               id: doc.id, 
               ...data, 
               // Standardize to simple lat/lng numbers
               location: { lat: parseFloat(lat), lng: parseFloat(lng) } 
             });
          }
        });
        setProperties(fetchedProps);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, []);

  // --- 6. FILTERING (50km Radius) ---
  const visibleProperties = useMemo(() => {
    if (!userLocation) return properties.slice(0, 50); // Show top 50 if no location

    return properties.filter(prop => {
        const dist = getDistance(
            userLocation.lat, userLocation.lng,
            prop.location.lat, prop.location.lng
        );
        return dist < 50; 
    });
  }, [properties, userLocation]);

  // --- 7. MAP HANDLERS ---
  const onLoad = useCallback((map) => setMap(map), []);
  const onUnmount = useCallback(() => setMap(null), []);

  if (!isLoaded) {
    return (
      <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-gray-100 rounded-3xl">
        <Loader2 className="animate-spin text-gray-400 mb-2" size={32} />
        <p className="text-sm text-gray-500 font-medium">Loading Maps...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[500px] bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-200 animate-in fade-in duration-300">
      
      {/* CONTROLS */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
         {userLocation && (
            <button 
              onClick={() => map?.panTo(userLocation)}
              className="bg-white text-black p-2.5 rounded-full shadow-lg hover:bg-gray-100 transition border border-gray-100"
              title="Go to my location"
            >
              <Navigation size={16} className="fill-blue-500 text-blue-500"/>
            </button>
         )}
         <button 
           onClick={onClose}
           className="bg-white text-black px-5 py-2.5 rounded-full shadow-lg font-bold text-sm flex items-center gap-2 hover:bg-gray-100 transition border border-gray-100"
         >
           <X size={16} /> Close Map
         </button>
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
            disableDefaultUI: false,
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            styles: [{ "featureType": "poi", "elementType": "labels", "stylers": [{ "visibility": "off" }] }]
        }}
      >
        {/* User Marker */}
        {userLocation && (
           <Marker
              position={userLocation}
              zIndex={999}
              icon={{
                  path: window.google.maps.SymbolPath.CIRCLE,
                  scale: 8,
                  fillColor: "#4285F4",
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
              icon={prop.type === 'experience' 
                 ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png" 
                 : "http://maps.google.com/mapfiles/ms/icons/red-dot.png"} 
           />
        ))}

        {/* Info Window */}
        {selectedProperty && (
          <InfoWindow
            position={selectedProperty.location}
            onCloseClick={() => setSelectedProperty(null)}
          >
            <div className="p-1 min-w-[200px] max-w-[250px]">
              <div className="w-full h-32 bg-gray-200 rounded-lg mb-2 overflow-hidden relative">
                 {(selectedProperty.imageUrl || selectedProperty.images?.[0]) ? (
                    <img 
                       src={selectedProperty.imageUrl || selectedProperty.images?.[0]} 
                       className="w-full h-full object-cover" 
                       alt={selectedProperty.title}
                    />
                 ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-xs">No Image</div>
                 )}
                 <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-black">
                    {selectedProperty.type || "Stay"}
                 </div>
              </div>
              <h3 className="font-bold text-black text-sm leading-tight mb-1">{selectedProperty.title}</h3>
              <p className="text-xs text-gray-500 mb-2 truncate">{selectedProperty.location?.city || "Nairobi"}</p>
              <div className="flex items-center justify-between border-t pt-2">
                 <span className="font-black text-black">KES {selectedProperty.price}</span>
                 <button className="bg-black text-white text-[10px] px-3 py-1.5 rounded-full font-bold hover:opacity-80 transition">
                    View
                 </button>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}