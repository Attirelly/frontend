'use client';

import React, { useEffect, useState } from 'react';
import { PriceRangeType } from '@/types/SellerTypes';
import { api } from '@/lib/axios';
import { toast } from 'sonner';
import { useHeaderStore } from '@/store/listing_header_store';
import { manrope } from '@/font';
import StoreTypeTabsSkeleton from './skeleton/StoreTypeHeaderSkeleton';
import Image from 'next/image';
import { useProductFilterStore } from '@/store/filterStore';

interface PriceRangeProps {
  storeTypeId: string;
}

const priceRangeIcons: Record<string, string> = {
  Affordable: '/ListingPageHeader/affordable.svg',
  Premium: '/ListingPageHeader/premium.svg',
  Luxury: '/ListingPageHeader/luxury.svg',
};

export default function PriceRangeTabs({ storeTypeId }: PriceRangeProps) {
  const { setPriceRangeType } = useHeaderStore();
  const { setPriceRange } = useProductFilterStore();
  const [priceRanges, setPriceRanges] = useState<PriceRangeType[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRangeType | null>(null);
  const [loading, setLoading] = useState(true);
  

  const handleTabClick = (priceRange: PriceRangeType) => {
    setSelectedPriceRange(priceRange);
    setPriceRangeType(priceRange);
    setPriceRange([priceRange.lower_value, priceRange.upper_value]);
  };

  useEffect(() => {
    const fetchPriceRanges = async () => {
      if (!storeTypeId) return;

      try {
        setLoading(true);
        const res = await api.post(`/stores/store_types/price-range-ids`, {
          store_type_ids: [storeTypeId],
        });

        const storeRanges = res.data?.[0]?.price_ranges || [];
        setPriceRanges(storeRanges);

        // if (storeRanges.length > 0) {
        //   setSelectedPriceRange(storeRanges[0]);
        //   setPriceRangeType(storeRanges[0]);
        // }
      } catch (error) {
        toast.error('Failed to fetch price ranges');
      } finally {
        setLoading(false);
      }
    };

    fetchPriceRanges();
  }, [storeTypeId]);

  if (loading) return <StoreTypeTabsSkeleton />;

  return (
    <div className="flex space-x-2 bg-[#F5F5F5] rounded-full px-2 py-1">
      {priceRanges.map((range) => {
        const icon = priceRangeIcons[range.label|| 'Affordable'] || null;
        const subtitle =
          range.upper_value > 999999
            ? `> ₹${range.lower_value.toLocaleString()}`
            : `₹${range.lower_value.toLocaleString()} - ₹${range.upper_value.toLocaleString()}`;
        const isSelected = selectedPriceRange?.id === range.id;

        return (
          <button
            key={range.id}
            className={`
              ${manrope.className}
              px-4 py-2 rounded-3xl transition text-base flex items-center gap-2
              ${isSelected
                ? 'bg-white font-normal text-black'
                : 'bg-[#F5F5F5] text-[#717171] font-normal'}
            `}
            onClick={() => handleTabClick(range)}
            style={{fontWeight:500}}
          >
            {/* {icon && (
              <Image
                src={icon}
                alt={range.label}
                width={20}
                height={20}
                className="object-contain"
              />
            )} */}
            <div className="flex flex-col items-center">
              <span className="text-base">{range.label.toUpperCase()}</span>
              <span className="text-xs leading-none">{subtitle}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
