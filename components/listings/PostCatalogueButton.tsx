'use client';

import { useHeaderStore } from '@/store/listing_header_store';
import React, { useEffect, useState } from 'react';
import { event } from '@/lib/gtag';
import { manrope } from '@/font';
import Image from 'next/image';

export default function PostCatalogueButton() {
  const [selected, setSelected] = useState<'Posts' | 'Catalogue'>('Posts');
  const { setViewType } = useHeaderStore();

  useEffect(() => {
    setViewType(selected);
    // event({
    //   action: 'Store Mode',
    //   params: { value: selected },
    // });
  }, [selected]);

  const options: ('Posts' | 'Catalogue')[] = ['Posts', 'Catalogue'];

  const getIconPath = (option: 'Posts' | 'Catalogue') => {
    if (option === 'Posts') return '/ListingPageHeader/post_icon.svg';
    if (option === 'Catalogue') return '/ListingPageHeader/catalogue_logo.svg';
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
            <Image
              src={getIconPath(option)}
              alt={option}
              width={16}
              height={16}
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
