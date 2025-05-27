'use client';
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Smartphone, Store } from 'lucide-react';
import { useSellerStore } from '@/store/sellerStore';

type Option = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
};

const OPTIONS: Option[] = [
  {
    id: 'both',
    title: 'Both online and offline',
    description: 'Sell your products on your website and in your physical store.',
    icon: <ShoppingBag className="w-6 h-6 text-pink-500" />,
  },
  {
    id: 'online',
    title: 'Online only',
    description: 'List your products only on your website.',
    icon: <Smartphone className="w-6 h-6 text-black" />,
  },
  {
    id: 'offline',
    title: 'Offline only',
    description: 'Sell your products only in your physical store.',
    icon: <Store className="w-6 h-6 text-gray-600" />,
  },
];

export default function WhereToSellComponent() {
  
  const { setWhereToSellData , whereToSellData} = useSellerStore();
  const [selected, setSelected] = useState(whereToSellData?.isBoth === true ? 'both' : whereToSellData?.isOnline === true ? 'online' : 'offline');
  console.log(whereToSellData)
  // ⬇️ Set isOnline based on selection
  useEffect(() => {
    if(selected == 'both'){
      setWhereToSellData({ isOnline : true, isBoth : true});
    }
    else{
      if(selected === 'online') setWhereToSellData({ isOnline:true, isBoth:false});
      else setWhereToSellData({ isOnline:false, isBoth:false});
    }
  }, [selected, setWhereToSellData]);

  return (
    <div className="rounded-2xl p-6 space-y-6 max-w-2xl shadow-sm bg-white">
      <div>
        <h2 className="text-lg font-semibold">Select where you want to sell</h2>
        <p className="text-sm text-gray-500">
          Define product tiers in affordable, premium and luxury for easy filtering.
        </p>
      </div>

      <div className="space-y-4">
        {OPTIONS.map((option) => (
          <label
            key={option.id}
            htmlFor={option.id}
            className={`flex items-center justify-between border p-4 rounded-lg cursor-pointer ${
              selected === option.id ? 'border-black bg-gray-100' : 'border-gray-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="radio"
                name="sellLocation"
                id={option.id}
                checked={selected === option.id}
                onChange={() => setSelected(option.id)}
                className="mt-1"
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
