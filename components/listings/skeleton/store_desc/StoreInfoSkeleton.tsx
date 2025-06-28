// components/skeleton/StoreInfoSkeleton.tsx
import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function StoreInfoSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 p-6 animate-pulse">
      {/* Left Image Skeleton */}
      <div className="flex justify-center items-center w-76.5 h-63.75 bg-[#F8F8F8] p-4 rounded-2xl">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 rounded-full bg-gray-300 mb-4" />
          <div className="h-4 w-20 bg-gray-300 rounded mt-4" />
        </div>
      </div>

      {/* Right Info Skeleton */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="h-6 w-40 bg-gray-300 rounded" />
          <div className="flex gap-2.5">
            <div className="h-10 w-10 bg-gray-300 rounded-full" />
            <div className="h-10 w-20 bg-gray-300 rounded-full" />
          </div>
        </div>

        <div className="flex gap-14 mt-4">
          {[1, 2, 3].map((_, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              <div className="h-5 w-10 bg-gray-300 rounded" />
              <div className="h-4 w-12 bg-gray-200 rounded" />
            </div>
          ))}
        </div>

        <div className="h-4 w-full bg-gray-300 rounded mt-6" />
        <div className="flex flex-wrap gap-2 mt-4">
          {[1, 2, 3].map((_, idx) => (
            <div key={idx} className="h-6 w-24 bg-gray-200 rounded-full" />
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {[1, 2].map((_, idx) => (
            <div key={idx} className="h-6 w-20 bg-gray-200 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
