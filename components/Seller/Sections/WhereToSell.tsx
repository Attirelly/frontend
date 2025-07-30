'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image'; // ✅ Import Next.js Image
import { useSellerStore } from '@/store/sellerStore';

type Option = {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element; // updated type
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
        width={24}
        height={24}
        className="object-contain"
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
        width={24}
        height={24}
        className="object-contain"
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
        width={24}
        height={24}
        className="object-contain"
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
    if (selected == 'both') {
      setWhereToSellData({ isOnline: false, isBoth: true });
    } else {
      if (selected === 'online')
        setWhereToSellData({ isOnline: true, isBoth: false });
      else setWhereToSellData({ isOnline: false, isBoth: false });
    }
  }, [selected, setWhereToSellData]);

  return (
    <div className="rounded-2xl p-6 space-y-4 w-3xl shadow-sm bg-white text-black">
      <div>
        <h2 className="text-lg font-semibold">Select where you want to sell</h2>
      </div>

      <div className="-mx-6 border-t border-gray-300"></div>

      <div className="space-y-4">
        {OPTIONS.map((option) => (
          <label
            key={option.id}
            htmlFor={option.id}
            className={`flex items-center justify-between border p-4 rounded-lg cursor-pointer ${
              selected === option.id ? 'border-black bg-gray-100' : 'border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="sellLocation"
                id={option.id}
                checked={selected === option.id}
                onChange={() => setSelected(option.id)}
                className="accent-black"
              />
              <div>
                <p className="font-medium">{option.title}</p>
                <p className="text-sm text-gray-600">{option.description}</p>
              </div>
            </div>
            <div>{option.icon}</div>
          </label>
        ))}
      </div>
    </div>
  );
}
