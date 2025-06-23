'use client';

import { useHeaderStore } from '@/store/listing_header_store';
import React, { useEffect, useState } from 'react';
import {event} from '@/lib/gtag';
import {manrope} from '@/font';

type TwoOptionToggleProps = {
  options: [string, string];
};

export default function TwoOptionToggle({ options }: TwoOptionToggleProps) {
  const [selected, setSelected] = useState<string>('Home Delivery');
  const { setDeliveryType } = useHeaderStore();
  //   console.log(selected)
  useEffect(() => {
    setDeliveryType(selected);
    event({
      action: "Store Mode",
      params: {
         value : selected
      }
    });
  }, [selected]);

  return (
    <div className="flex space-x-2">
      {options.map((option) => (
        <button
          key={option}
          className={`${manrope.className} px-4 py-2 rounded-full border transition ${selected === option
              ? 'bg-black text-white border-black'
              : 'bg-white text-[#878787] border-[#878787] hover:border-black hover:text-black'
            }`}
          onClick={() => setSelected(option)}
          style={{fontWeight:500}}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
