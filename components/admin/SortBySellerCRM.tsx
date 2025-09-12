'use client';
import React, { useState } from "react";
import { manrope } from "@/font";
import { useAdminStore } from "@/store/admin_store";

// A static map of available sort options.
// `label` is the user-friendly text, and `value` is the key sent to the API.
const optionsMap: { label: string; value: string }[] = [
  { label: "Creation Date: Latest First", value: "date_desc" },
  { label: "Creation Date: Oldest First", value: "date_asc" },
  { label: "Progress: Low to High", value: "progress_asc" },
  { label: "Progress: High to Low", value: "progress_desc" },
];

/**
 * A dropdown component specifically for selecting the sort order on the Seller CRM page.
 *
 * This component displays the currently selected sort option and, when clicked, reveals a
 * list of available sorting methods. The component's state is managed through a combination of
 * local state for UI visibility and a global Zustand store for the selected sort value.
 *
 * ### State Management
 * - **Zustand (`useAdminStore`)**: The component reads the current `sortBy` value from this global
 * store and calls the `setSortBy` action to update it. This allows the parent component (the CRM page)
 * to react to sort changes and re-fetch data accordingly.
 * - **React `useState`**: A simple boolean state (`isOpen`) is used to control the
 * visibility of the dropdown menu itself.
 *
 * @returns {JSX.Element} A dropdown menu for sorting the seller list.
 * @see {@link https://react.dev/reference/react/useState | React useState Hook}
 * @see {@link https://docs.pmnd.rs/zustand/getting-started/introduction | Zustand Documentation}
 */
const SortBySellerCRM: React.FC = () => {
  // --- Global State ---
  // Gets the current sort value and the setter function from the admin Zustand store.
  const { sortBy, setSortBy } = useAdminStore();
  
  // --- Local State ---
  // Manages the open/closed visibility of the dropdown menu.
  const [isOpen, setIsOpen] = useState(false);

  // --- Derived State ---
  // Finds the user-friendly label corresponding to the current `sortBy` value from the store.
  // This separates the internal state value (e.g., 'date_desc') from what the user sees.
  const selectedLabel =
    optionsMap.find((option) => option.value === sortBy)?.label || "Creation Date: Latest First";

  return (
    <div className="relative inline-block text-left">
      {/* The main button that displays the current selection and toggles the dropdown. */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`${manrope.className} flex items-center space-x-1 text-base text-gray-500`}
        style={{fontWeight:500}}
      >
        <span>Sort by:</span>
        <span className="text-gray-800" style={{fontWeight:600}}>{selectedLabel}</span>
        <img
          src="/ListingPageHeader/dropdown.svg"
          alt="Dropdown"
          // The icon rotates to provide a visual cue for the open/closed state.
          className={`ml-1 w-3 h-3 transform transition-transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* The dropdown menu is conditionally rendered based on the `isOpen` state. */}
      {isOpen && (
        <div className="absolute z-10 mt-2 w-52 bg-white border rounded-lg shadow-lg">
          {optionsMap.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                // When an option is clicked:
                // 1. Update the global state in the Zustand store.
                setSortBy(option.value);
                // 2. Close the dropdown menu.
                setIsOpen(false);
              }}
              // Dynamically apply classes to highlight the currently selected option.
              className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
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

export default SortBySellerCRM;
