// src/components/SkeletonCard.js
export default function SkeletonCard() {
  return (
    <div className="animate-pulse">
      {/* Image Skeleton */}
      <div className="bg-gray-200 aspect-square rounded-xl mb-3"></div>
      
      {/* Text Lines */}
      <div className="flex justify-between mb-2">
         <div className="h-4 bg-gray-200 rounded w-2/3"></div>
         <div className="h-4 bg-gray-200 rounded w-8"></div>
      </div>
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
      <div className="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
    </div>
  );
}