// components/skeleton/GridPostGallerySkeleton.tsx
import React from "react";

export default function GridPostGallerySkeleton() {
  const skeletons = Array(9).fill(0); // For 3x3 grid

  return (
    <div className="grid grid-cols-3 gap-[2px] animate-pulse">
      {skeletons.map((_, index) => (
        <div
          key={index}
          className="aspect-square bg-gray-200"
        />
      ))}
    </div>
  );
}
