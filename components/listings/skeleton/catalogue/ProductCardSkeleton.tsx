// components/skeleton/ProductCardSkeleton.tsx
import React from 'react';

export default function ProductCardSkeleton() {
  return (
    <div className="w-[279px] rounded-xl bg-white p-2 animate-pulse">
      <div className="w-full h-[321px] bg-gray-200 rounded-xl mb-2" />
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-full mb-1" />
      <div className="flex items-center gap-2">
        <div className="h-4 w-16 bg-gray-200 rounded" />
        <div className="h-4 w-16 bg-gray-200 rounded" />
        <div className="h-4 w-20 bg-gray-200 rounded" />
      </div>
    </div>
  );
}
