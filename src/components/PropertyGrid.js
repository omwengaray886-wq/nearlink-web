// src/components/PropertyGrid.js
'use client';

import { useState, useEffect } from 'react';
import ListingCard from './ListingCard';
import SkeletonCard from './SkeletonCard';

// Enhanced Mock Data
const PROPERTIES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop",
    location: "Imara Daima, Nairobi",
    distance: "5 kilometers away",
    dates: "Jan 12 - 17",
    price: "2,150",
    rating: 4.85,
    guestFavorite: true,
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1600596542815-22b8c153bd30?q=80&w=2600&auto=format&fit=crop",
    location: "Westlands, Nairobi",
    distance: "8 kilometers away",
    dates: "Jan 20 - 25",
    price: "8,500",
    rating: 4.98,
    guestFavorite: false,
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2600&auto=format&fit=crop",
    location: "Kilimani, Nairobi",
    distance: "3 kilometers away",
    dates: "Feb 1 - 6",
    price: "4,200",
    rating: 4.75,
    guestFavorite: true,
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2600&auto=format&fit=crop",
    location: "Mombasa, Coast",
    distance: "480 kilometers away",
    dates: "Mar 10 - 15",
    price: "12,000",
    rating: 4.92,
    guestFavorite: true,
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?q=80&w=2600&auto=format&fit=crop",
    location: "Naivasha, Rift Valley",
    distance: "90 kilometers away",
    dates: "Apr 5 - 7",
    price: "6,500",
    rating: 4.88,
    guestFavorite: false,
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2565&auto=format&fit=crop",
    location: "Nanyuki, Mt Kenya",
    distance: "150 kilometers away",
    dates: "Feb 14 - 16",
    price: "9,000",
    rating: 4.95,
    guestFavorite: true,
  },
   {
    id: 7,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2670&auto=format&fit=crop",
    location: "Karen, Nairobi",
    distance: "15 kilometers away",
    dates: "Jan 25 - 30",
    price: "15,000",
    rating: 5.0,
    guestFavorite: true,
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1448630360428-65456885c650?q=80&w=2667&auto=format&fit=crop",
    location: "Watamu, Coast",
    distance: "500 kilometers away",
    dates: "May 1 - 10",
    price: "7,800",
    rating: 4.82,
    guestFavorite: false,
  }
];

export default function PropertyGrid() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); 
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <SkeletonCard key={n} />
            ))}
        </div>
      );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {PROPERTIES.map((property) => (
        <ListingCard key={property.id} data={property} />
      ))}
    </div>
  );
}