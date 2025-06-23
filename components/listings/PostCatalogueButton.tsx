'use client';

import { useHeaderStore } from '@/store/listing_header_store';
import React, { useEffect, useState } from 'react';
import { event } from '@/lib/gtag';
import { manrope } from '@/font';

type TwoOptionToggleProps = {
  options: [string, string];
};

export default function PostCatalogueButton({ options }: TwoOptionToggleProps) {
  const [selected, setSelected] = useState<string>('Posts');
  const { setViewType } = useHeaderStore();

  useEffect(() => {
    setViewType(selected);
    event({
      action: 'Store Mode',
      params: { value: selected },
    });
  }, [selected]);

  const getIconPath = (option: string) => {
    if (option === 'Posts') return '/ListingPageHeader/posts.svg';
    if (option === 'Catalogue') return '/ListingPageHeader/catalogue.svg';
    return '';
  };

  return (
    <div className="flex justify-center border-t border-gray-200">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => setSelected(option)}
          className={`${manrope.className} relative px-6 pt-4 pb-3 flex flex-col items-center text-sm transition-colors duration-200`}
        >
          <div className="flex items-center gap-2">
            <img
              src={getIconPath(option)}
              alt={option}
              className="w-4 h-4"
            />
            <span
              className={`uppercase ${
                selected === option ? 'text-black font-semibold' : 'text-[#878787]'
              }`}
            >
              {option}
            </span>
          </div>

          {/* Top border indicator */}
          {selected === option && (
            <div className="absolute -top-[1px] left-0 w-full h-[2px] bg-black rounded-t-sm" />
          )}
        </button>
      ))}
    </div>
  );
}
