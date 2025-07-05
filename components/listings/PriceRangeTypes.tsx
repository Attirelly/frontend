// 'use client';

// import React, { useEffect, useState } from 'react';
// import { SelectOption, PriceRangeType } from '@/types/SellerTypes';
// import { api } from '@/lib/axios';
// import { toast } from 'sonner';
// import { useHeaderStore } from '@/store/listing_header_store';
// import { manrope } from '@/font';
// import StoreTypeTabsSkeleton from './skeleton/StoreTypeHeaderSkeleton';
// import Image from 'next/image';

// interface PriceRangeProps {
//   defaultValue?: string;
// }

// // Optional icons for each price range label (adjust path or add more if needed)
// const priceRangeIcons = [
//   { label: 'Affordableio', icon: '/ListingPageHeader/affordable.svg' },
//   { label: 'Premiumio', icon: '/ListingPageHeader/premium.svg' },
//   { label: 'Luxuryio', icon: '/ListingPageHeader/luxury.svg' }
// ];

// export default function PriceRangeTabs({ defaultValue }: PriceRangeProps) {
//   const { setPriceRangeType } = useHeaderStore();
//   const [priceRanges, setPriceRange] = useState<PriceRangeType[]>([]);
//   const [tabs, setTabs] = useState<SelectOption[]>([]);
//   const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRangeType | null>(null);
//   const [loading, setLoading] = useState(true);

//   const handleTabClick = (value: SelectOption) => {
//     const priceRange: PriceRangeType = {
//       id: value.value,
//       label: value.label,
//     };
//     setSelectedPriceRange(priceRange);
//     setPriceRangeType(priceRange);
//   };

//   useEffect(() => {
//     const fetchPriceRanges = async () => {
//       try {
//         setLoading(true);
//         const res = await api.get(`/stores/ price_ranges`);
//         setPriceRange(res.data);
//         const options: SelectOption[] = res.data.map((t: PriceRangeType) => ({
//           label: t.label,
//           value: t.id,
//         }));
//         setTabs(options);
//       } catch (error) {
//         toast.error('Failed to fetch price ranges');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPriceRanges();
//   }, []);

//   if (loading) {
//     return <StoreTypeTabsSkeleton />;
//   }

//   return (
//     <div className="flex space-x-2">
//       {tabs.map((tab) => {
//         const icon = priceRangeIcons.find((p) => p.label === tab.label)?.icon;
//         const subtitle =
//           tab.label === 'Affordable'
//             ? '< ₹10,000'
//             : tab.label === 'Premium'
//             ? '₹10,000 - ₹25,000'
//             : '> ₹25,000';

//         const isSelected = selectedPriceRange?.id === tab.value;

//         return (
//           <button
//             key={tab.value}
//             className={`
//               ${manrope.className}
//               px-4 py-2 rounded-3xl transition text-base flex items-center gap-2
//               ${isSelected
//                 ? 'bg-[#F2F2F2] border-black font-semibold'
//                 : 'bg-white text-[#717171] font-normal'}
//             `}
//             onClick={() => handleTabClick(tab)}
//           >
//             {icon && (
//               <Image
//                 src={icon}
//                 alt={tab.label}
//                 width={20}
//                 height={20}
//                 className="object-contain"
//               />
//             )}
//             <div className="flex flex-col items-center">
//               <span className="text-sm">{tab.label.toUpperCase()}</span>
//               <span className="text-xs text-[#8E8E8E] leading-none">{subtitle}</span>
//             </div>
//           </button>
//         );
//       })}
//     </div>
//   );
// }



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
    <div className="flex space-x-2">
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
                ? 'bg-[#F2F2F2] border border-[#717171] font-semibold'
                : 'bg-white text-[#717171] font-normal border border-transparent'}
            `}
            onClick={() => handleTabClick(range)}
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
              <span className="text-sm">{range.label.toUpperCase()}</span>
              <span className="text-xs text-[#8E8E8E] leading-none">{subtitle}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
