import React, { useState } from "react";
import { useHeaderStore } from "@/store/listing_header_store";

const optionsMap: { label: string; value: string }[] = [
  { label: "New Arrivals", value: "date_desc" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Discount: Low to High", value: "discount_asc" },
  { label: "Discount: High to Low", value: "discount_desc" },
];

const SortByDropdown: React.FC = () => {
  const { sortBy, setSortBy } = useHeaderStore();
  const [isOpen, setIsOpen] = useState(false);

  const selectedLabel =
    optionsMap.find((option) => option.value === sortBy)?.label || "New Arrivals";

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 text-sm font-medium text-gray-600"
      >
        <span>Sort by:</span>
        <span className="text-black">{selectedLabel}</span>
        <img
          src="/ListingPageHeader/dropdown.svg"
          alt="Dropdown"
          className={`ml-1 w-3 h-3 transform transition-transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-52 bg-white border rounded-lg shadow-lg">
          {optionsMap.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                setSortBy(option.value);
                setIsOpen(false);
              }}
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

export default SortByDropdown;
