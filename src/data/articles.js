export const CATEGORIES = [
  "All", 
  "Destinations", 
  "Host Tips", 
  "Culture", 
  "Food & Drink", 
  "News",
  "Wellness"
];

export const AUTHORS = {
  sarah: {
    name: "Sarah N.",
    role: "Travel Editor",
    avatar: "https://i.pravatar.cc/150?u=sarah",
    bio: "Exploring the corners of East Africa one coffee shop at a time.",
    socials: { twitter: "@sarah_travels", instagram: "@sarah_snaps" }
  },
  brian: {
    name: "Brian K.",
    role: "Superhost & Interior Designer",
    avatar: "https://i.pravatar.cc/150?u=brian",
    bio: "Helping hosts turn spare rooms into 5-star experiences.",
    socials: { linkedin: "brian-k-design" }
  },
  nearlink: {
    name: "NearLink Team",
    role: "Official Updates",
    avatar: "/logo.png",
    bio: "Building the operating system for African travel.",
    verified: true
  }
};

export const ARTICLES = [
  {
    id: 1,
    slug: "hidden-gems-diani",
    category: "Destinations",
    title: "The Hidden Gems of Diani: Beyond the Beach",
    excerpt: "Discover the secret caves, local eateries, and cultural spots that most tourists miss when visiting Kenya's south coast.",
    image: "https://images.unsplash.com/photo-1534768314-9966d51025a1?auto=format&fit=crop&w=1600&q=80",
    author: AUTHORS.sarah,
    date: "Oct 12, 2025",
    readTime: "8 min",
    size: "large", 
    
    // SEO Data
    seo: {
      metaTitle: "Hidden Gems in Diani Beach | NearLink Travel Guide",
      keywords: ["Diani", "Kenya Coast", "Ali Barbour", "Kaya Kinondo"],
      ogImage: "https://images.unsplash.com/photo-1534768314-9966d51025a1"
    },

    // Engagement Stats
    stats: {
      views: 2450,
      likes: 124,
      shares: 45
    },

    // Properties mentioned in this article
    relatedListings: ["prop_101", "prop_105"],

    // BLOCK-BASED CONTENT
    content: [
      {
        type: "paragraph",
        text: "Diani Beach is famous for its powder-white sands and turquoise waters, but the real magic often lies just a few kilometers inland. While most tourists stick to the beach resorts, the savvy traveler knows that Diani has a soul that goes deeper than the coastline."
      },
      {
        type: "heading",
        level: 2,
        text: "The Sacred Kaya Kinondo Forest",
        id: "kaya-forest"
      },
      {
        type: "paragraph",
        text: "Just south of the main strip lies one of the oldest forests on the coast. The Kaya Kinondo is a sacred site for the Digo people. Walking through here isn't just a nature trail; it's a spiritual journey."
      },
      {
        type: "quote",
        text: "You don't just walk through the Kaya. You ask permission from the ancestors first.",
        author: "Mzee Juma, Local Guide"
      },
      {
        type: "map_location", 
        lat: -4.3964,
        lng: 39.5534,
        name: "Kaya Kinondo Sacred Forest"
      },
      {
        type: "image_grid",
        images: [
          "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1596324683526-0e1215b24479?auto=format&fit=crop&w=800&q=80"
        ],
        caption: "The ancient baobabs of Kaya Kinondo"
      },
      {
        type: "heading",
        level: 2,
        text: "Dining in a Cave",
        id: "cave-dining"
      },
      {
        type: "pros_cons",
        pros: ["Unique atmosphere (180,000 year old cave)", "Starlit sky view", "Excellent seafood"],
        cons: ["Requires advance booking", "Pricey (High-end)"]
      },
      {
        type: "paragraph",
        text: "Ali Barbour's Cave Restaurant is estimated to be between 120,000 and 180,000 years old. The natural hole in the ceiling opens up to the starlit sky."
      },
      {
        type: "booking_card", 
        title: "Diani Cave Dinner Experience",
        price: "KES 5,500",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80",
        link: "/experiences/diani-cave-dinner"
      }
    ]
  },

  {
    id: 2,
    slug: "styling-airbnb-5-star",
    category: "Host Tips",
    title: "Styling Your Airbnb for 5-Star Reviews",
    excerpt: "Small design touches that make a huge difference in guest satisfaction.",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    author: AUTHORS.brian,
    date: "Oct 10, 2025",
    readTime: "5 min",
    size: "tall",
    
    seo: {
      metaTitle: "Airbnb Styling Tips | NearLink Host Academy",
      keywords: ["Interior Design", "Hosting", "Airbnb Tips", "Nairobi Homes"]
    },

    stats: {
      views: 850,
      likes: 45,
      shares: 120 
    },

    content: [
      {
        type: "paragraph",
        text: "Lighting is everything. We interviewed top interior designers in Nairobi to understand how warm lighting, local textiles, and scent marketing can turn a simple apartment into a luxury experience."
      },
      {
        type: "heading",
        level: 3,
        text: "The 'Golden Hour' Rule"
      },
      {
        type: "paragraph",
        text: "Avoid cool white bulbs (6000K) in bedrooms. They feel clinical. Switch to warm white (2700K-3000K) to instantly make the space feel cozy and expensive."
      },
      {
        type: "checklist",
        title: "The 5-Star Checklist",
        items: [
          "Four pillows per bed (two soft, two firm)",
          "Universal power adapters",
          "Local artwork (support local artists!)",
          "High-speed WiFi QR code on the fridge"
        ]
      }
    ]
  },

  {
    id: 5,
    slug: "introducing-experiences",
    category: "News",
    title: "Introducing 'Experiences': Do More Than Just Stay",
    excerpt: "We are launching a new way to book local tours and adventures directly in the app.",
    image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80",
    author: AUTHORS.nearlink,
    date: "Oct 01, 2025",
    readTime: "3 min",
    size: "wide",
    
    stats: {
      views: 5020,
      likes: 500,
      shares: 200
    },

    content: [
      {
        type: "paragraph",
        text: "Travel isn't just about where you sleep; it's about what you do. Today, we are thrilled to announce NearLink Experiences."
      },
      {
        type: "video_embed",
        src: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder video
        caption: "Watch the launch trailer"
      },
      {
        type: "paragraph",
        text: "You can now book a cooking class in Lamu, a graffiti tour in Kibera, or a tea farm visit in Limuru directly through the NearLink app, with instant confirmation."
      }
    ]
  },

  {
    id: 3,
    slug: "nairobi-coffee-scene",
    category: "Culture",
    title: "Nairobi's Evolving Coffee Scene",
    excerpt: "A tour through the best new cafes in Kilimani and Westlands.",
    image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800&q=80",
    author: { ...AUTHORS.sarah, role: "Coffee Enthusiast" },
    date: "Oct 08, 2025",
    readTime: "4 min",
    size: "normal",
    
    stats: {
      views: 1200,
      likes: 89,
      shares: 12
    },

    content: [
      {
        type: "paragraph",
        text: "Kenyan coffee is the best in the world, yet for years it was hard to find a good brew locally. That has changed. We visit Connect Coffee, Spring Valley Coffee, and more."
      }
    ]
  },

  {
    id: 4,
    slug: "naivasha-couples-getaway",
    category: "Destinations",
    title: "Weekend Getaway: Naivasha for Couples",
    excerpt: "Where to stay, eat, and relax just 2 hours from the city.",
    image: "https://images.unsplash.com/photo-1517823382935-51bf1dd11d43?auto=format&fit=crop&w=800&q=80",
    author: { name: "Lucy M.", role: "Contributor", avatar: "https://i.pravatar.cc/150?u=lucy" },
    date: "Oct 05, 2025",
    readTime: "6 min",
    size: "normal",
    stats: { views: 3000, likes: 210, shares: 80 },
    content: [{ type: "paragraph", text: "Escape the hustle. From boat rides on the lake to wine tasting at Morendat." }]
  },

  {
    id: 6,
    slug: "pricing-strategies-december",
    category: "Host Tips",
    title: "Smart Pricing Strategies for December",
    excerpt: "Maximize your earnings during the holiday peak season.",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
    author: AUTHORS.brian,
    date: "Sep 28, 2025",
    readTime: "7 min",
    size: "normal",
    stats: { views: 600, likes: 32, shares: 5 },
    content: [{ type: "paragraph", text: "Don't leave money on the table." }]
  },

  {
    id: 7,
    slug: "swahili-street-food",
    category: "Food & Drink",
    title: "The Ultimate Guide to Swahili Street Food",
    excerpt: "From Viazi Karai to Mahamri, here is what to eat on the coast.",
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80",
    author: { name: "Fatuma A.", role: "Local Guide", avatar: "https://i.pravatar.cc/150?u=fatuma" },
    date: "Sep 25, 2025",
    readTime: "5 min",
    size: "tall", 
    stats: { views: 1800, likes: 150, shares: 90 },
    content: [{ type: "paragraph", text: "Walking through Old Town Mombasa is a sensory explosion." }]
  },

  {
    id: 8,
    slug: "hiking-mt-longonot",
    category: "Destinations",
    title: "Hiking Mt. Longonot: A Beginner's Guide",
    excerpt: "Everything you need to know before tackling the crater.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    author: { name: "John D.", role: "Adventure Lead", avatar: "https://i.pravatar.cc/150?u=john" },
    date: "Sep 20, 2025",
    readTime: "6 min",
    size: "normal",
    stats: { views: 900, likes: 75, shares: 20 },
    content: [{ type: "paragraph", text: "It takes about 4 hours, bring lots of water." }]
  }
];