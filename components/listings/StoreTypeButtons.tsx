'use client';

import { useHeaderStore } from '@/store/listing_header_store';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { manrope } from '@/font';

interface StoreTypesButtonProps {
  options: { store_type: string; id: string }[];
  defaultValue: string;
  context: string;
}

const StoreTypeImages = {
  'Retail Store': {
    selected: '/ListingPageHeader/white_retail.svg',
    unselected: '/ListingPageHeader/black_retail.svg',
  },
  'Designer Label': {
    selected: '/ListingPageHeader/white_designer.svg',
    unselected: '/ListingPageHeader/black_designer.svg',
  },
};

export default function StoreTypeButtons({
  options,
  defaultValue,
  context,
}: StoreTypesButtonProps) {
  const { setStoreTypeString, setStoreType } = useHeaderStore();

  const [selected, setSelected] = useState<{ store_type: string; id: string } | undefined>(
    options.find((opt) => opt.store_type === defaultValue)
  );

  // Sync local state when defaultValue changes
  useEffect(() => {
    const newDefault = options.find((opt) => opt.store_type === defaultValue);
    if (newDefault && newDefault.store_type !== selected?.store_type) {
      setSelected(newDefault);
    }
  }, [defaultValue, options]);

  // Update global store when local selection changes
  useEffect(() => {
    if (selected) {
      setStoreTypeString(selected.store_type);
      setStoreType({ store_type: selected.store_type, id: selected.id });
    }
  }, [selected, setStoreType, setStoreTypeString]);

  return (
    <div className="flex space-x-2">
      {options.map((option) => {
        const isSelected = selected?.store_type === option.store_type;

        // Choose the correct image path
        const imagePath =
          StoreTypeImages[option.store_type as keyof typeof StoreTypeImages]?.[
            isSelected ? 'selected' : 'unselected'
          ];

        return (
          <button
            key={option.id}
            className={`
              ${manrope.className}
              px-4 py-2 rounded-full transition text-base flex items-center gap-2
              ${isSelected
                ? 'bg-black text-white font-semibold'
                : 'bg-white text-black border border-[#878787] font-normal'}
            `}
            onClick={() => setSelected(option)}
          >
            {imagePath && (
              <Image
                src={imagePath}
                alt={option.store_type}
                width={18}
                height={18}
                className="object-contain"
              />
            )}
            <span>{option.store_type.toUpperCase()}</span>
          </button>
        );
      })}
    </div>
  );
}
