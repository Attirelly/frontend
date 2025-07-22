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

  // helper to get image path
  const getImageForOption = (option: string, isSelected: boolean) => {
    const lower = option.toLowerCase().replace(/\s+/g, '_'); // e.g. "in store shopping" -> "in_store_shopping"
    return isSelected
      ? `/${lower}_white.svg`
      : `/${lower}_gray.svg`;
  };

  return (
    <div className="flex space-x-2">
      {options.map((option) => {
        const isSelected = selected === option;
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
            <div className="relative w-5 h-5">
              <Image
                src={getImageForOption(option, isSelected)}
                alt={option}
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
            <span>{option}</span>
          </button>
        );
      })}
    </div>
  );
}
