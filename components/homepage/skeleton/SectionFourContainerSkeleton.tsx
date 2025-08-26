// components/CardStackSkeleton.tsx
import { manrope } from "@/font";
import { useState, useEffect } from "react";

export default function CardStackSkeleton() {
  const [visibleCount, setVisibleCount] = useState(5); // Default to desktop count

  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth < 768) {
        setVisibleCount(1); // Only the center card
      } else if (window.innerWidth < 1024) {
        setVisibleCount(3); // 3 cards for tablet
      } else {
        setVisibleCount(5); // 5 cards for desktop
      }
    };
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  return (
    <div className="flex flex-col gap-8 items-center animate-pulse">
      {/* Title Placeholder */}
      <div className="bg-gray-200 h-8 w-64 rounded-md"></div>
      <div className="relative w-full flex items-center justify-center px-20 h-[588px]">
        {/* Left Arrow Placeholder */}
        <div className="absolute left-4 z-30 bg-gray-300 rounded-full w-10 h-10"></div>

        {/* Card Stack Placeholders */}
        <div className="relative flex items-center justify-center w-full h-[588px]">
          {Array.from({ length: visibleCount }).map((_, index) => {
            const offset = index - Math.floor(visibleCount / 2);
            const zIndex = 10 - Math.abs(offset);
            const cardWidth = 392;
            const overlap = cardWidth * 0.3;
            const translateX = offset * overlap;
            const scale = offset === 0 ? 1 : 0.9;
            const heightClass =
              offset === 0
                ? "h-[588px]"
                : Math.abs(offset) === 1
                ? "h-[530px]"
                : "h-[480px]";

            const isMobile = visibleCount === 1;

            return (
              <div
                key={index}
                className={`${isMobile ? "relative mx-auto" : "absolute"} w-[392px] ${heightClass}`}
                style={
                  isMobile
                    ? { zIndex: 10 }
                    : {
                        transform: `translateX(${translateX}px) scale(${scale})`,
                        zIndex,
                      }
                }
              >
                <div className="bg-gray-300 w-full h-full rounded-lg flex flex-col justify-end p-4">
                  <div className="bg-gray-400 h-6 w-3/4 rounded-md mb-2"></div>
                  <div className="bg-gray-400 h-4 w-1/2 rounded-md"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Arrow Placeholder */}
        <div className="absolute right-4 z-30 bg-gray-300 rounded-full w-10 h-10"></div>
      </div>
    </div>
  );
}