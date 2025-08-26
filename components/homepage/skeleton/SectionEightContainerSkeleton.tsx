// components/SectionEightContainerSkeleton.tsx
import { manrope } from "@/font";
import { useEffect, useState } from "react";

export default function SectionEightContainerSkeleton() {
  const [screenSize, setScreenSize] = useState('sm');

  useEffect(() => {
        const updateVisibleCount = () => {
            if (window.innerWidth < 768) {
                setScreenSize('sm');
            } else if (window.innerWidth < 1024) {
                setScreenSize('md');
            } else if (window.innerWidth < 1300) {
                setScreenSize('lg');
            } else {
                setScreenSize('xl');
            }
        };

        updateVisibleCount();
        window.addEventListener("resize", updateVisibleCount);
        return () => window.removeEventListener("resize", updateVisibleCount);
    }, []);

  return (
    <div className="w-full mx-auto space-y-4 lg:space-y-8 animate-pulse">
      {/* Title + View All Placeholder */}
      <div className="flex justify-between px-4 lg:px-0">
        <div className="bg-gray-200 h-8 w-48 rounded-md"></div>
        <div className="bg-gray-200 h-6 w-20 rounded-md"></div>
      </div>

      {/* Main Grid Placeholder */}
      <div className="flex flex-col">
        <div className={`grid gap-y-6 
          ${screenSize === 'sm' ? "grid-cols-2 gap-x-2" : ""}
          ${screenSize === 'md' ? "grid-cols-4 gap-x-10" : ""}
          ${screenSize === 'lg' || screenSize === 'xl' ? "grid-cols-4 gap-x-12" : ""}`}>
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              {/* Card Image Placeholder */}
              <div className="w-full h-[150px] md:h-[200px] lg:h-[250px] bg-gray-300 rounded-lg"></div>
              {/* Card Title Placeholder */}
              <div className="bg-gray-300 mt-2 h-4 w-3/4 rounded-md"></div>
              {/* Card Description Placeholder */}
              <div className="bg-gray-300 mt-1 h-3 w-1/2 rounded-md"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}