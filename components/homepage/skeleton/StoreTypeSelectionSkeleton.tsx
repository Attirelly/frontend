// components/StoreTypeSelectionSkeleton.tsx
import { manrope } from "@/font";

export default function StoreTypeSelectionSkeleton() {
  const numberOfSkeletons = 4; // Matches the number of store types
  const skeletonItems = Array.from({ length: numberOfSkeletons });

  return (
    <div className={`${manrope.className} flex flex-col items-center`} style={{ fontWeight: 500 }}>
      <div className="bg-gray-200 h-8 w-64 animate-pulse rounded"></div>
      <div className="grid grid-cols-2 gap-x-10 gap-y-15 mt-8 md:flex lg:gap-23">
        {skeletonItems.map((_, index) => (
          <div key={index} className="flex flex-col items-center gap-[18px] lg:gap-[24px]">
            <div className="relative w-[75px] h-[75px] lg:w-[95px] lg:h-[95px] flex items-center justify-center rounded-full bg-gray-200 animate-pulse"></div>
            <div className="bg-gray-200 h-6 w-20 animate-pulse rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}