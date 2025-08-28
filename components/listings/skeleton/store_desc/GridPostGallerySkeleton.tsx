// components/skeleton/GridPostGallerySkeleton.tsx
import React from "react";

export default function GridPostGallerySkeleton() {
  // ✅ Increased skeleton count for larger screens
  const skeletons = Array(15).fill(0); 

  return (
    // ✅ Grid now changes columns based on screen size
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1 md:gap-2 animate-pulse">
      {skeletons.map((_, index) => (
        <div
          key={index}
          className="aspect-square bg-gray-200 rounded-md" // Added rounded corners
        />
      ))}
    </div>
  );
}