'use client';

import React, { useState } from 'react';
import clsx from 'clsx';
import { SelectOption, BrandType } from '@/types/SellerTypes';
import { useHeaderStore } from '@/store/listing_header_store';
import { event } from '@/lib/gtag';
import { manrope } from '@/font';

interface StoreTypeTabsProps {
  defaultValue: string;
}

const hardcodedStoreTypes = [
  { store_type: 'Students' },
  { store_type: 'House Makers' },
  { store_type: 'Influencers' },
  { store_type: 'Fashion Enthusiasts' },
];

export default function StoreTypeTabs({ defaultValue }: StoreTypeTabsProps) {
  const { setAmbassadorType } = useHeaderStore();
  const [selectedAmbassadorType, setSelectedAmbassadorType] = useState<string | null>(defaultValue);

  const handleTabClick = (value: string) => {
    // event({
    //   action: 'Store Type Select',
    //   params: {
    //     'Store Type': value.store_type,
    //   },
    // });
    setSelectedAmbassadorType(value);
    setAmbassadorType(value);
  };

  return (
    <div className="flex bg-[#F5F5F5] rounded-full overflow-hidden w-fit px-2 py-2">
      {hardcodedStoreTypes.map((tab, index) => (
        <div className="flex items-center">
          <button
            className={clsx(
              manrope.className,
              'px-4 py-2 rounded-full transition-all duration-200 mx-2 text-base',
              selectedAmbassadorType === tab.store_type
                ? 'bg-white shadow text-black'
                : 'text-[#565656] hover:text-black'
            )}
            style={{ fontWeight: 500 }}
            onClick={() => handleTabClick(tab.store_type)}
          >
            {tab.store_type}
          </button>

          {index !== hardcodedStoreTypes.length - 1 && (
            <div className="h-6 border-r border-gray-300 mx-2" />
          )}
        </div>
      ))}
    </div>
  );
}