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

/**
 * WhereToSellComponent component
 * 
 * A form component for the seller onboarding/dashboard where sellers specify their
 * sales model: online-only, offline-only, or both.
 *
 * ## Features
 * - Presents three clear, mutually exclusive options using styled radio buttons.
 * - Each option includes an icon, a title, and a detailed description to help the user make an informed choice.
 * - **Data Hydration**: On mount, it initializes its selection based on the existing `whereToSellData` from the global `useSellerStore`.
 * - **Real-time State Sync**: A `useEffect` hook watches for changes in the user's selection and immediately updates the `useSellerStore` with the corresponding boolean flags (`isOnline`, `isBoth`).
 *
 * ## Logic Flow
 * 1.  The component mounts and reads the `whereToSellData` from the Zustand store to set its initial `selected` state. It correctly maps the `isBoth` and `isOnline` boolean flags to one of three string options ('both', 'online', 'offline').
 * 2.  It renders a list of styled radio button options by mapping over the `OPTIONS` constant array.
 * 3.  When a user clicks on an option, the `onChange` handler calls `setSelected`, updating the component's local state.
 * 4.  A `useEffect` hook is triggered by this change in the `selected` state.
 * 5.  Inside the hook, it determines the correct boolean flags (`isOnline`, `isBoth`) that correspond to the user's choice and calls `setWhereToSellData` to update the global Zustand store.
 *
 * ## Imports
 * - **Core/Libraries**: `useState`, `useEffect` from `react`; `Image` from `next/image`.
 * - **State (Zustand Stores)**:
 *    - `useSellerStore`: For both reading and writing the `whereToSellData`.
 *
 * ## Key Data Structures
 * - **OPTIONS**: A local constant array of objects, where each object defines the content for one of the three choices, including an `id`, `title`, `description`, and a JSX `icon`.
 *
 * ## API Calls
 * - This component does not make any API calls.
 *
 * ## Props
 * - This component does not accept any props.
 *
 * @returns {JSX.Element} The rendered "Where to Sell" selection form.
 */
export default function WhereToSellComponent() {
  const { setWhereToSellData, whereToSellData } = useSellerStore();
  const [selected, setSelected] = useState(
    whereToSellData?.isBoth === true
      ? 'both'
      : whereToSellData?.isOnline === true
      ? 'online'
      : 'offline'
  );

  /**
   * we have two states : isOnline and isBoth
   * if isOnline is true : products are sold online only
   * if isOffline is false : products are sold offline only
   * if isBoth is true : products are sold both online and offline
   */
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

