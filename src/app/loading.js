export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      
      {/* 1. Search Bar / Filter Skeleton */}
      <div className="w-full h-16 bg-gray-100 rounded-full mb-8 mx-auto max-w-3xl" />

      {/* 2. Hero Section Skeleton */}
      <div className="w-full h-64 md:h-80 bg-gray-100 rounded-2xl mb-12" />

      {/* 3. Property Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* We create an array of 8 items to simulate cards */}
        {[...Array(8)].map((_, index) => (
          <div key={index} className="space-y-3">
            {/* Image Placeholder */}
            <div className="aspect-square w-full bg-gray-100 rounded-xl" />
            
            {/* Title Placeholder */}
            <div className="h-4 bg-gray-100 rounded w-3/4" />
            
            {/* Price/Rating Placeholder */}
            <div className="flex justify-between">
              <div className="h-4 bg-gray-100 rounded w-1/3" />
              <div className="h-4 bg-gray-100 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}