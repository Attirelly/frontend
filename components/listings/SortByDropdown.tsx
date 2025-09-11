import React, { useState } from "react";
import { useHeaderStore } from "@/store/listing_header_store";
import { manrope } from "@/font";

const optionsMap: { label: string; value: string }[] = [
  { label: "New Arrivals", value: "date_desc" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Discount: Low to High", value: "discount_asc" },
  { label: "Discount: High to Low", value: "discount_desc" },
];


/**
 * A dropdown component that allows users to select a sort order for a list.
 *
 * This component displays the currently selected sort option and, when clicked, reveals a
 * list of available options. The component's state is managed through a combination of
 * local state for UI visibility and a global Zustand store for the selected sort value.
 *
 * ### State Management
 * - **Zustand (`useHeaderStore`)**: The component reads the current `sortBy` value from this global
 * store and calls the `setSortBy` action to update it. This makes the sort state accessible
 * to other components, such as the one responsible for fetching and displaying the sorted data.
 * - **React `useState`**: A simple boolean state (`isOpen`) is used to control the
 * visibility of the dropdown menu itself.
 *
 * ### Behavior
 * - Clicking the main button toggles the dropdown's visibility.
 * - Clicking an option within the dropdown updates the global `sortBy` state via Zustand and
 * immediately closes the dropdown.
 *
 * @returns {JSX.Element} A dropdown menu for sorting.
 * @see {@link https://react.dev/reference/react/useState | React useState Hook}
 * @see {@link https://docs.pmnd.rs/zustand/getting-started/introduction | Zustand Documentation}
 */

const SortByDropdown: React.FC = () => {
  // Global state for getting and setting the sort-by value.
  const { sortBy, setSortBy } = useHeaderStore();
  // Local state to manage the dropdown's open/closed status.
  const [isOpen, setIsOpen] = useState(false);

  // Find the display label corresponding to the currently selected sortBy value from the store.
  // This cleanly separates the logical value (e.g., 'date_desc') from the user-friendly text.
  const selectedLabel =
    optionsMap.find((option) => option.value === sortBy)?.label || "date_desc";

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`${manrope.className} flex items-center space-x-1 text-sm md:text-base  text-gray-500`}
        style={{fontWeight:500}}
      >
        <span>Sort by:</span>
        <span className="text-gray-800"
        style={{fontWeight:600}}>{selectedLabel}</span>
        <img
          src="/ListingPageHeader/dropdown.svg"
          alt="Dropdown"
          className={`ml-1 w-3 h-3 transform transition-transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>
      {/* The dropdown menu is conditionally rendered based on the `isOpen` state. */}
      {isOpen && (
        <div className="absolute z-20 mt-2 w-full bg-white border rounded-lg shadow-lg">
          {optionsMap.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                setSortBy(option.value);
                setIsOpen(false);
              }}
              className={`px-4 py-2 text-[12px] md:text-sm cursor-pointer hover:bg-gray-100 ${
                sortBy === option.value ? "font-semibold text-black" : "text-gray-600"
              }`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortByDropdown;
