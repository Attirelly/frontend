"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
// ✅ 1. Import the Zustand store
import { useProductFilterStore } from '@/store/filterStore';

// ✅ 2. The component no longer needs to accept props for state management
export default function TopDynamicFilterBar() {
  // ✅ 3. Get all required state and actions directly from the store
  const {
    dynamic_facets: dynamicFacets,
    selectedFilters,
    toggleFilter
  } = useProductFilterStore();

  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const node = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (node.current && !node.current.contains(e.target as Node)) {
        setOpenFilter(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleFilter = (facetName: string) => {
    setOpenFilter(currentOpen => (currentOpen === facetName ? null : facetName));
  };

  const handleCheckboxChange = (facetName: string, value: string) => {
    toggleFilter(facetName, value , "products");
    setOpenFilter(null);
  };

  const hasFacets = dynamicFacets && Object.values(dynamicFacets).some(options => options.length > 0);

  if (!hasFacets) {
    return null;
  }

  return (
    <div className="hidden md:flex flex-wrap items-center gap-3" ref={node}>
      {Object.entries(dynamicFacets).map(([facetName, options]) => {
        if (!options || options.length === 0) return null;

        const selectionCount = selectedFilters[facetName]?.length || 0;
        const isActive = selectionCount > 0;
        const isOpen = openFilter === facetName;

        return (
          <div key={facetName} className="relative">
            <button
              data-active={isActive}
              onClick={() => handleToggleFilter(facetName)}
              className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 data-[active=true]:border-black data-[active=true]:bg-gray-100 data-[active=true]:text-black"
            >
              {facetName}
              {isActive && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs font-semibold text-white">
                  {selectionCount}
                </span>
              )}
              <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isOpen && (
              <div className="absolute left-0 top-full z-10 mt-2 min-w-[240px] max-h-72 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                <div className="p-2">
                  {options.map((option) => (
                    console.log("Rendering option:", option),
                    <label key={option.name} className="flex w-full cursor-pointer items-center rounded-md px-3 py-2 text-sm hover:bg-gray-100">
                      <input
                        type="checkbox"
                        checked={option.selected}
                        onChange={() => handleCheckboxChange(facetName, option.name)}
                        className="mr-3 h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                      />
                      <span className="flex-grow text-gray-800">{option.name}</span>
                      <span className="ml-3 text-xs text-gray-500">{option.count}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

