import React, { useState } from "react";
import { manrope } from "@/font";
import { useAdminStore } from "@/store/admin_store";

const optionsMap: { label: string; value: string }[] = [
  { label: "Creation Date: Latest First", value: "date_desc" },
  { label: "Creation Date: Oldest First", value: "date_asc" },
  { label: "Progress: Low to High", value: "progress_asc" },
  { label: "Progress: High to Low", value: "progress_desc" },
];

const SortBySellerCRM: React.FC = () => {
  const { sortBy, setSortBy } = useAdminStore();
  const [isOpen, setIsOpen] = useState(false);

  const selectedLabel =
    optionsMap.find((option) => option.value === sortBy)?.label || "date_desc";

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`${manrope.className} flex items-center space-x-1 text-base  text-gray-500`}
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

export default SortBySellerCRM;
