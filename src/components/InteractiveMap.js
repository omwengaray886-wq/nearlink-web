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

// Default center (Nairobi) if user denies location
const defaultCenter = {
  lat: -1.2921,
  lng: 36.8219
};

// --- 2. HELPER: Calculate Distance (Haversine Formula) ---
const getDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 99999; // Return huge distance if missing coords
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

const deg2rad = (deg) => deg * (Math.PI / 180);

export default function InteractiveMap({ onClose }) {
  // --- 3. GOOGLE MAPS LOADER ---
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "" 
  });

  // --- 4. STATE MANAGEMENT ---
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState(defaultCenter);
  const [userLocation, setUserLocation] = useState(null);
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  // --- 5. ON LOAD: Get Location & Data ---
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
        (error) => {
          console.warn("User denied location or error:", error);
          // Keep default center (Nairobi)
        }
      );
    }

    // B. Fetch Properties from Firebase
    const fetchProperties = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "properties"));
        const fetchedProps = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Support both nested 'location.lat' and flat 'lat' structures
          const lat = data.location?.lat || data.lat;
          const lng = data.location?.lng || data.lng;

          if (lat && lng) {
             fetchedProps.push({ 
               id: doc.id, 
               ...data, 
               // Normalize location structure
               location: { lat: parseFloat(lat), lng: parseFloat(lng) } 
             });
          }
        });
        setProperties(fetchedProps);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchProperties();
  }, []);

  // --- 6. FILTERING LOGIC ---
  const visibleProperties = useMemo(() => {
    // If we don't know where the user is, show everything (or top 20 to avoid clutter)
    if (!userLocation) return properties.slice(0, 50);

    return properties.filter(prop => {
        const dist = getDistance(
            userLocation.lat, userLocation.lng,
            prop.location.lat, prop.location.lng
        );
        return dist < 50; // <--- ADJUST RADIUS HERE (50km)
    });
  }, [properties, userLocation]);

  // --- 7. MAP HANDLERS ---
  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  // --- 8. RENDER ---
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
      
      {/* --- CLOSE BUTTON --- */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
         {/* Recenter Button (Only shows if we have user location) */}
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
            // Custom simplified map style
            styles: [
                {
                    "featureType": "poi",
                    "elementType": "labels",
                    "stylers": [{ "visibility": "off" }]
                }
            ]
        }}
      >
        {/* --- A. USER MARKER (Blue Dot) --- */}
        {userLocation && (
           <Marker
              position={userLocation}
              zIndex={999} // Always on top
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

        {/* --- B. PROPERTY MARKERS --- */}
        {visibleProperties.map((prop) => (
           <Marker 
              key={prop.id}
              position={prop.location}
              onClick={() => setSelectedProperty(prop)}
              // Note: You can replace these URLs with your own custom pin images
              icon={prop.type === 'experience' 
                 ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png" 
                 : "http://maps.google.com/mapfiles/ms/icons/red-dot.png"} 
           />
        ))}

        {/* --- C. INFO WINDOW (Popup) --- */}
        {selectedProperty && (
          <InfoWindow
            position={selectedProperty.location}
            onCloseClick={() => setSelectedProperty(null)}
          >
            <div className="p-1 min-w-[200px] max-w-[250px]">
              {/* Image Thumbnail */}
              <div className="w-full h-32 bg-gray-200 rounded-lg mb-2 overflow-hidden relative">
                 {(selectedProperty.imageUrl || selectedProperty.images?.[0]) ? (
                    <img 
                       src={selectedProperty.imageUrl || selectedProperty.images[0]} 
                       className="w-full h-full object-cover" 
                       alt={selectedProperty.title}
                    />
                 ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-xs">No Image</div>
                 )}
                 <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                    {selectedProperty.type}
                 </div>
              </div>

              {/* Details */}
              <h3 className="font-bold text-black text-sm leading-tight mb-1">{selectedProperty.title}</h3>
              <p className="text-xs text-gray-500 mb-2 truncate">{selectedProperty.location?.city || "Unknown Location"}</p>
              
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