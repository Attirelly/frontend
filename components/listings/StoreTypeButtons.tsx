'use client';

import { useHeaderStore } from '@/store/listing_header_store';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { event } from '@/lib/gtag';
import { manrope } from '@/font';

interface StoreTypesButtonProps {
  options: [string, string];
  defaultValue: string;
  context: string;
}

const StoreTypeImage = [
  { name: 'Designer Labels', url: '/ListingPageHeader/designer_labels.svg' },
  { name: 'Retail Stores', url: '/ListingPageHeader/retail_stores.svg' },
  { name: 'Boutiques', url: '/ListingPageHeader/boutiques.svg' },
];

export default function StoreTypeButtons({
  options,
  defaultValue,
  context,
}: StoreTypesButtonProps) {
  const [selected, setSelected] = useState<string>(defaultValue);
  const { setStoreTypeString, storeTypeString } = useHeaderStore();

  useEffect(() => {
    setStoreTypeString(selected);
  }, [selected]);

  // console.log(storeTypeString)
  return (
    <div className="flex space-x-2">
      {options.map((option) => {
        const storeImage = StoreTypeImage.find(
          (item) => item.name.toLowerCase() === option.toLowerCase()
        );

        return (
          <button
            key={option}
            className={`
              ${manrope.className}
              px-4 py-2 rounded-2xl transition text-sm flex items-center gap-2
              ${selected === option
                ? 'bg-[#F2F2F2] font-semibold shadow-xl'
                : 'bg-white text-black border-[#878787] font-normal'}
            `}
            onClick={() => setSelected(option)}
          >
            {storeImage && (
              <Image
                src={storeImage.url}
                alt={option}
                width={18}
                height={18}
                className="object-contain"
              />
            )}
            <span>{option.toUpperCase()}</span>
          </button>
        );
      })}
    </div>
  );
}
