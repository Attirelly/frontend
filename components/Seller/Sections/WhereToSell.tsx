'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSellerStore } from '@/store/sellerStore';

type Option = {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
};

const OPTIONS: Option[] = [
  {
    id: 'both',
    title: 'Both online and offline',
    description: 'Sell outfits through your physical store & Attirelly. You will upload inventory on Attirelly.',
    icon: (
      <Image
        src="/OnboardingSections/both_online_offline.png"
        alt="both"
        width={40}
        height={40}
        className="object-contain w-8 h-8 sm:w-10 sm:h-10"
      />
    ),
  },
  {
    id: 'online',
    title: 'Online only',
    description: 'Sell your products only through Attirelly. You don’t have a physical store.',
    icon: (
      <Image
        src="/OnboardingSections/online_only.png"
        alt="online"
        width={40}
        height={40}
        className="object-contain w-8 h-8 sm:w-10 sm:h-10"
      />
    ),
  },
  {
    id: 'offline',
    title: 'Offline only',
    description: 'Sell your products only through your physical store. You won’t be uploading your inventory on Attirelly. You just want offline footfall.',
    icon: (
      <Image
        src="/OnboardingSections/offline_only.png"
        alt="offline"
        width={40}
        height={40}
        className="object-contain w-8 h-8 sm:w-10 sm:h-10"
      />
    ),
  },
];

export default function WhereToSellComponent() {
  const { setWhereToSellData, whereToSellData } = useSellerStore();
  const [selected, setSelected] = useState(
    whereToSellData?.isBoth === true
      ? 'both'
      : whereToSellData?.isOnline === true
      ? 'online'
      : 'offline'
  );

  useEffect(() => {
    if (selected === 'both') {
      setWhereToSellData({ isOnline: false, isBoth: true });
    } else {
      if (selected === 'online')
        setWhereToSellData({ isOnline: true, isBoth: false });
      else setWhereToSellData({ isOnline: false, isBoth: false });
    }
  }, [selected, setWhereToSellData]);

  return (
    <div className="rounded-2xl p-4 sm:p-6 space-y-4 w-full max-w-3xl mx-auto shadow-sm bg-white text-black">
      <div>
        <h2 className="text-base sm:text-lg font-semibold">Select where you want to sell</h2>
      </div>

      <div className="-mx-4 sm:-mx-6 border-t border-gray-300"></div>

      <div className="space-y-4">
        {OPTIONS.map((option) => (
          <label
            key={option.id}
            htmlFor={option.id}
            className={`flex items-center justify-between border p-3 sm:p-4 rounded-lg cursor-pointer transition-all duration-200 ${
              selected === option.id ? 'border-black bg-gray-50' : 'border-gray-300'
            }`}
          >
            <div className="flex items-start sm:items-center gap-3">
              <input
                type="radio"
                name="sellLocation"
                id={option.id}
                checked={selected === option.id}
                onChange={() => setSelected(option.id)}
                className="accent-black mt-1 sm:mt-0"
              />
              <div>
                <p className="font-medium text-sm sm:text-base">{option.title}</p>
                <p className="text-xs sm:text-sm text-gray-600">{option.description}</p>
              </div>
            </div>
            <div className="ml-2">{option.icon}</div>
          </label>
        ))}
      </div>
    </div>
  );
}

