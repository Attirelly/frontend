'use client';

import React, { useState } from 'react';
import clsx from 'clsx';
// Assuming these types and store are correctly defined elsewhere
// import { SelectOption, BrandType } from '@/types/SellerTypes';
import { useHeaderStore } from '@/store/listing_header_store';
// import { event } from '@/lib/gtag';
import { manrope } from '@/font';

interface StoreTypeTabsProps {
  defaultValue: string;
}

const hardcodedStoreTypes = [
  { store_type: 'Students' },
  { store_type: 'Influencers' },
  { store_type: 'Fashion' }, // Changed to match the image
  { store_type: 'House makers' },
];

export default function StoreTypeTabs({ defaultValue }: StoreTypeTabsProps) {
  const { setAmbassadorType } = useHeaderStore();
  const [selectedAmbassadorType, setSelectedAmbassadorType] =
    useState<string | null>(defaultValue);

  const handleTabClick = (value: string) => {
    // event({ ... });
    setSelectedAmbassadorType(value);
    setAmbassadorType(value);
  };

  return (
    // Main container: grid on mobile, flex on desktop
    <div className="grid w-full max-w-sm grid-cols-2 gap-y-4 md:flex md:w-fit md:max-w-fit md:items-center md:rounded-full md:bg-[#F5F5F5] md:p-2">
      {hardcodedStoreTypes.map((tab, index) => (
        <React.Fragment key={tab.store_type}>
          {/* Wrapper for button and mobile divider */}
          <div className="relative flex w-full justify-center">
            <button
              className={clsx(
                manrope.className,
                'py-2 rounded-full transition-all duration-200 text-base text-center font-medium',
                // Mobile-first sizing
                'w-[150px]',
                // Desktop sizing overrides
                'md:py-2 md:px-4 md:mx-0',
                // Conditional styling based on selection
                selectedAmbassadorType === tab.store_type
                  ? // Selected styles: black on mobile, white w/ shadow on desktop
                    'bg-black text-white md:bg-white md:text-black md:shadow'
                  : // Default styles: white w/ border on mobile, transparent on desktop
                    'bg-[#F5F5F5] text-black border border-gray-300 md:border-none md:bg-transparent md:text-[#565656] hover:md:text-black'
              )}
              onClick={() => handleTabClick(tab.store_type)}
            >
              {tab.store_type}
            </button>

            {/* --- Mobile Divider --- */}
            {/* This divider is only visible on mobile (md:hidden) */}
            {/* It appears on the right of the first item in each row (index 0 and 2) */}
            {index % 2 === 0 && (
              <div className="absolute right-0 top-0 h-full w-px bg-gray-300 md:hidden" />
            )}
          </div>

          {/* --- Desktop Divider --- */}
          {/* This divider is only visible on desktop (hidden md:block) */}
          {/* It appears between all flex items, except the last one */}
          {index !== hardcodedStoreTypes.length - 1 && (
            <div className="hidden h-6 w-px bg-gray-300 md:block md:mx-2" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}



// {hardcodedStoreTypes.map((tab, index) => (
//         <div className="flex items-center">
//           <button
//             className={clsx(
//               manrope.className,
//               'px-4 py-2 rounded-full transition-all duration-200 mx-2 text-base',
//               selectedAmbassadorType === tab.store_type
//                 ? 'bg-white shadow text-black'
//                 : 'text-[#565656] hover:text-black'
//             )}
//             style={{ fontWeight: 500 }}
//             onClick={() => handleTabClick(tab.store_type)}
//           >
//             {tab.store_type}
//           </button>

//           {/* {index !== hardcodedStoreTypes.length - 1 && (
//             <div className="h-6 border-r border-gray-300 mx-2" />
//           )} */}
//         </div>
//       ))}