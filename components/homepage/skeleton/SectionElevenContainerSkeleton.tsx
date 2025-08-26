// components/SectionElevenContainerSkeleton.tsx
import { manrope } from "@/font";
import { useEffect, useState } from "react";

const DESKTOP_VISIBLE_COUNT = 6;
const TAB_VISIBLE_COUNT = 4;
const MOBILE_VISIBLE_COUNT = 2;

export default function SectionElevenContainerSkeleton() {
  const [screenSize, setScreenSize] = useState("sm");

  useEffect(() => {
    const updateScreenSize = () => {
      if (window.innerWidth < 768) {
        setScreenSize("sm");
      } else if (window.innerWidth < 1024) {
        setScreenSize("md");
      } else if (window.innerWidth < 1300) {
        setScreenSize("lg");
      } else {
        setScreenSize("xl");
      }
    };
    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);
    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  let cardCount = DESKTOP_VISIBLE_COUNT;
  if (screenSize === 'sm') {
    cardCount = MOBILE_VISIBLE_COUNT;
  } else if (screenSize === 'md') {
    cardCount = TAB_VISIBLE_COUNT;
  }

  return (
    <div className='w-full mx-auto space-y-4 lg:space-y-8 animate-pulse'>
      {/* Title + View All Placeholder */}
      <div className='flex justify-between px-4 lg:px-2'>
        <div className="bg-gray-200 h-8 w-48 rounded-md"></div>
        <div className="bg-gray-200 h-6 w-20 rounded-md"></div>
      </div>

      {/* Main Grid Placeholder */}
      <div className="relative flex items-center">
        {/* Navigation Arrows Placeholder */}
        <div className="absolute z-50 -left-0 -translate-x-1/4 top-1/2 -translate-y-1/2 bg-gray-300 rounded-full w-10 h-10"></div>

        {/* Card Grid Placeholder */}
        <div className={`w-full grid 
          ${screenSize === 'sm' ? "grid-cols-2 pl-1" : ""}
          ${screenSize === 'md' ? "grid-cols-4 px-10 ml-2" : ""}
          ${screenSize === 'lg' || screenSize === 'xl' ? "grid-cols-6 px-10 ml-2" : ""}
          gap-y-6`}>
          {Array.from({ length: cardCount }).map((_, index) => (
            <div key={index} className="flex flex-col items-center" style={{ minWidth: `184px` }}>
              {/* Image Placeholder */}
              <div className="bg-gray-300 rounded-lg w-full h-[150px] md:h-[200px] lg:h-[250px]"></div>
              {/* Text Placeholders */}
              <div className="bg-gray-300 mt-2 h-4 w-3/4 rounded-md"></div>
              <div className="bg-gray-300 mt-1 h-3 w-1/2 rounded-md"></div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows Placeholder */}
        <div className="absolute z-10 -right-0 translate-x-1/4 top-1/2 -translate-y-1/2 bg-gray-300 rounded-full w-10 h-10"></div>
      </div>
    </div>
  );
}