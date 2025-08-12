'use client';

import { useHeaderStore } from '@/store/listing_header_store';
import React, { useEffect, useState } from 'react';
import { event } from '@/lib/gtag';
import { manrope } from '@/font';
import Image from 'next/image';

interface TwoOptionToggleProps {
  options: [string, string];
  defaultValue: string;
  context: string;
}

export default function TwoOptionToggle({ options, defaultValue, context }: TwoOptionToggleProps) {
  const [selected, setSelected] = useState<string>(defaultValue);
  const { setDeliveryType } = useHeaderStore();

  useEffect(() => {
    if (context === 'store') {
      setDeliveryType(selected);
      event({
        action: 'Store Mode',
        params: {
          value: selected,
        },
      });
    }
  }, [selected, context, setDeliveryType]);

  // Map option to icon based on selection state
  const getIconPath = (option: string, isSelected: boolean) => {
    const optionKey = option.toLowerCase().replace(/\s+/g, '_');
    if (optionKey === 'in_store_shopping') {
      return isSelected
        ? '/ListingPageHeader/white_instore.png'
        : '/ListingPageHeader/gray_instore.png';
    } else if (optionKey === 'online_shopping') {
      return isSelected
        ? '/ListingPageHeader/white_online.png'
        : '/ListingPageHeader/gray_online.png';
    }
    return '';
  };

  return (
    <div className="flex space-x-2">
      {options.map((option) => {
        const isSelected = selected === option;
        const iconPath = getIconPath(option, isSelected);

        return (
          <button
            key={option}
            onClick={() => setSelected(option)}
            className={`${manrope.className} flex items-center space-x-2 px-4 py-2 rounded-full border transition ${
              isSelected
                ? 'bg-black text-white border-black'
                : 'bg-white text-[#878787] border-[#878787] hover:border-black hover:text-black'
            }`}
            style={{ fontWeight: 500 }}
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <Image
                src={iconPath}
                alt={option}
                width={20}
                height={20}
                className="object-contain"
              />
            </div>
            <span>{option}</span>
          </button>
        );
      })}
    </div>
  );
}
