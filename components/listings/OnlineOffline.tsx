'use client';

import { useHeaderStore } from '@/store/listing_header_store';
import React, { useEffect, useState } from 'react';
import {event} from '@/lib/gtag';
import {manrope} from '@/font';

interface TwoOptionToggleProps  {
  options: [string, string],
  defaultValue: string,
  context:string,
};

export default function TwoOptionToggle({ options, defaultValue, context }: TwoOptionToggleProps) {
  const [selected, setSelected] = useState<string>(defaultValue);
  const { setDeliveryType} = useHeaderStore();
  //   console.log(selected)
  useEffect(() => {
    if(context === 'store'){
setDeliveryType(selected);
    event({
      action: "Store Mode",
      params: {
         value : selected
      }
    });
    }
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
