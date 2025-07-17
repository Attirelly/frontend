'use client';

import { useHeaderStore } from '@/store/listing_header_store';
import React, { useEffect, useState } from 'react';
import { manrope } from '@/font';
import Image from 'next/image';
import { api } from '@/lib/axios'; // assuming you have api instance configured

type PostCatalogueButtonProps = {
  defaultValue?: string;
  storeId: string;
};

export default function PostCatalogueButton({
  defaultValue = 'Posts',
  storeId,
}: PostCatalogueButtonProps) {
  const [selected, setSelected] = useState(defaultValue);
  const [hasProducts, setHasProducts] = useState(false);
  const { setViewType } = useHeaderStore();

  // Fetch product availability for this store
  useEffect(() => {
    async function checkProducts() {
      try {
        const res = await api.get(`products/check_product_available/${storeId}`);
        console.log('asasasas', res.data);
        setHasProducts(res.data.is_available); // true or false
      } catch (err) {
        console.error('Error checking products availability', err);
        setHasProducts(false);
      }
    }
    if (storeId) {
      checkProducts();
    }
  }, [storeId]);

  useEffect(() => {
    setViewType(selected);
  }, [selected]);

  // Build options based on availability
  const options: ('Posts' | 'Catalogue')[] = hasProducts
    ? ['Posts', 'Catalogue']
    : ['Posts'];

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

          {selected === option && (
            <div className="absolute -top-[1px] left-0 w-full h-[2px] bg-black rounded-t-sm" />
          )}
        </button>
      ))}
    </div>
  );
}
