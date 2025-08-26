// components/SectionTwoContainerSkeleton.tsx
'use client';
import { useEffect, useState } from "react";

export default function SectionTwoContainerSkeleton() {
    const DESKTOP_VISIBLE_COUNT = 4;
    const TAB_VISIBLE_COUNT = 3;
    const MOBILE_VISIBLE_COUNT = 2;

    const [visibleCount, setVisibleCount] = useState(DESKTOP_VISIBLE_COUNT);

    useEffect(() => {
        const updateVisibleCount = () => {
            if (window.innerWidth < 768) {
                setVisibleCount(MOBILE_VISIBLE_COUNT);
            } else if (window.innerWidth < 1024) {
                setVisibleCount(TAB_VISIBLE_COUNT);
            } else if (window.innerWidth < 1300) {
                setVisibleCount(DESKTOP_VISIBLE_COUNT);
            } else {
                setVisibleCount(DESKTOP_VISIBLE_COUNT);

            }
        };

        updateVisibleCount();
        window.addEventListener("resize", updateVisibleCount);
        return () => window.removeEventListener("resize", updateVisibleCount);
    }, []);

    return (
        <div className="w-full mx-auto space-y-4 lg:space-y-8 animate-pulse">
            {/* Title + View All Placeholders */}
            <div className="flex justify-between px-4 lg:px-0">
                <div className="bg-gray-200 h-8 w-48 rounded-md"></div>
                <div className="bg-gray-200 h-6 w-20 rounded-md"></div>
            </div>

            {/* Main Card Grid Placeholder */}
            <div className="relative flex items-center">
                {/* Prev Button Placeholder (visible on sm/md screens) */}
                <div className="absolute z-10 left-0 top-1/2 -translate-x-1/4 md:-translate-x-1/2 -translate-y-1/2 bg-gray-300 rounded-full w-8 h-8 lg:hidden"></div>

                {/* Responsive Grid for Cards */}
                <div className="w-full grid grid-cols-2 gap-x-2 md:grid-cols-3 md:gap-x-10 lg:grid-cols-4 lg:gap-x-12">
                    {Array.from({ length: visibleCount }).map((_, index) => (
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

                {/* Next Button Placeholder (visible on sm/md screens) */}
                <div className="absolute z-10 right-0 top-1/2 translate-x-1/4 md:translate-x-1/2 -translate-y-1/2 bg-gray-300 rounded-full w-8 h-8 lg:hidden"></div>
            </div>
        </div>
    );
}