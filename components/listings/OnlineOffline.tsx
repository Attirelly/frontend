'use client';

import { useHeaderStore } from '@/store/listing_header_store';
import React, { useEffect, useState } from 'react';
import { event } from '@/lib/gtag';
import { manrope } from '@/font';
import Image from 'next/image';

/**
 * @interface TwoOptionToggleProps
 * @description Defines the props for the TwoOptionToggle component.
 */
interface TwoOptionToggleProps {
  /**
   * @description An array containing exactly two string options to be displayed on the toggle buttons.
   * @example ['Online', 'In Store']
   */
  options: [string, string];
  /**
   * @description The default option to be selected when the component first renders.
   */
  defaultValue: string;
  /**
   * @description A context string that determines the component's behavior. If the context is 'store',
   * the component will sync its state with the global `useHeaderStore`.
   */
  context: string;
}

/**
 * A toggle component that allows the user to select between two mutually exclusive options.
 *
 * This component renders two buttons, each with an icon, representing the provided options.
 * It manages its own selection state and can optionally sync the selected value to a global
 * Zustand store, specifically for filtering stores by delivery type ('Online' vs. 'In Store').
 *
 * ### State Management
 * - **Local State (`useState`)**: Manages the currently selected option to control the UI's active state.
 * - **Global State (`useHeaderStore`)**: When the `context` prop is set to `'store'`, a `useEffect`
 * hook is triggered on selection change, which calls the `setDeliveryType` action from the
 * Zustand store to update the global application state.
 *
 * ### Analytics
 * - The component fires a Google Analytics event whenever the selection changes within the 'store'
 * context, allowing for tracking of user engagement with this filter.
 *
 * @param {TwoOptionToggleProps} props - The props for the component.
 * @returns {JSX.Element} A set of two toggle buttons.
 * @see {@link https://react.dev/reference/react/useState | React useState Hook}
 * @see {@link https://react.dev/reference/react/useEffect | React useEffect Hook}
 * @see {@link https://docs.pmnd.rs/zustand/getting-started/introduction | Zustand Documentation}
 */
export default function TwoOptionToggle({ options, defaultValue, context }: TwoOptionToggleProps) {
  // Local state to track the currently selected option for UI styling.
  const [selected, setSelected] = useState<string>(defaultValue);
  // Hook to access the setter function from the global Zustand store.
  const { setDeliveryType } = useHeaderStore();

  /**
   * This effect synchronizes the component's selection with the global state and
   * fires an analytics event, but only when the component is used in the 'store' context.
   */
  useEffect(() => {
    // Guard clause: Only proceed if the context is 'store'.
    if (context === 'store') {
      // Update the global state with the selected delivery type.
      setDeliveryType(selected);
      // Fire a Google Analytics event to track the interaction.
      event({
        action: 'Store Mode',
        params: {
          value: selected,
        },
      });
    }
    // This effect runs whenever the selected option, context, or the store's setter function changes.
  }, [selected, context, setDeliveryType]);

  /**
   * A helper function to determine the correct icon path based on the option name and its selection state.
   * @param {string} option - The name of the option (e.g., 'In Store').
   * @param {boolean} isSelected - Whether the option is currently selected.
   * @returns {string} The path to the appropriate icon image.
   */
  const getIconPath = (option: string, isSelected: boolean) => {
    const optionKey = option.toLowerCase().replace(/\s+/g, '_'); // e.g., 'in_store'
    if (optionKey === 'in_store') {
      return isSelected
        ? '/ListingPageHeader/white_instore.png'
        : '/ListingPageHeader/gray_instore.png';
    } else if (optionKey === 'online') {
      return isSelected
        ? '/ListingPageHeader/white_online.png'
        : '/ListingPageHeader/gray_online.png';
    }
    return ''; // Return an empty string as a fallback.
  };

  return (
    <div className="flex space-x-1.5">
      {options.map((option) => {
        // Determine if the current option in the loop is the selected one.
        const isSelected = selected === option;
        // Get the corresponding icon path for the current state.
        const iconPath = getIconPath(option, isSelected);

        return (
          <button
            key={option}
            onClick={() => setSelected(option)}
            // Dynamically apply classes for selected vs. unselected states.
            className={`${manrope.className} flex items-center justify-center space-x-2 px-3 md:px-4 py-2 text-sm md:text-base w-[130px] rounded-full border transition ${
              isSelected
                ? 'bg-black text-white border-black' // Styles for the active/selected button.
                : 'bg-white text-[#878787] border-[#878787] hover:border-black hover:text-black' // Styles for the inactive button.
            }`}
            style={{ fontWeight: 500 }}
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <Image
                src={iconPath}
                alt={option}
                width={20}
                height={20}
                className="object-contain"
              />
            </div>
            <span>{option}</span>
          </button>
        );
      })}
    </div>
  );
}
