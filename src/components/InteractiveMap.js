'use client';

import { useState, useCallback, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Loader2, X, MapPin } from 'lucide-react';

// Default Styles for the Map Container
const containerStyle = {
  width: '100%',
  height: '100%',
};

// Default Center (Nairobi - change this to your default location)
const defaultCenter = {
  lat: -1.2921,
  lng: 36.8219
};

export default function InteractiveMap({ onClose, properties = [] }) {
  // 1. Load the Google Maps Script
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    // ⚠️ IMPORTANT: You must add this key to your .env.local file
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "" 
  });

  const [map, setMap] = useState(null);

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  // If script is loading, show spinner
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
      
      {/* --- CLOSE BUTTON (Overlay) --- */}
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={onClose}
          className="bg-white text-black px-5 py-2.5 rounded-full shadow-lg font-bold text-sm flex items-center gap-2 hover:bg-gray-100 transition border border-gray-100"
        >
          <X size={16} /> Close Map
        </button>
      </div>

      {/* --- THE ACTUAL MAP --- */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={13}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
            disableDefaultUI: false, // Keep zoom controls
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            styles: [ // Optional: Custom "Clean" Map Style
                {
                    "featureType": "poi",
                    "elementType": "labels",
                    "stylers": [{ "visibility": "off" }]
                }
            ]
        }}
      >
        {/* Render Markers for Properties */}
        {/* If no properties passed, show default marker */}
        {properties.length === 0 ? (
             <Marker position={defaultCenter} />
        ) : (
             properties.map((prop) => (
                <Marker 
                    key={prop.id}
                    position={{ 
                        lat: prop.location?.lat || defaultCenter.lat, 
                        lng: prop.location?.lng || defaultCenter.lng 
                    }} 
                />
             ))
        )}
      </GoogleMap>
    </div>
  );
}