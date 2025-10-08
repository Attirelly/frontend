"use client";

import { StoreFacets } from "@/types/algolia";
import React from "react";

// Define the component's props
interface DynamicFiltersProps {
  facets: Partial<StoreFacets>;
  selectedFilters: Record<string, string[]>;
  onFilterChange: (facet: string, value: string) => void;
}

// A mapping for more user-friendly, hardcoded titles
const facetTitles: Record<string, string> = {
  city: "City",
  store_types: "Store Type",
  country: "Country",
  // Add other specific store facet keys here for custom titles
};

// A utility to format facet keys for display
// It first checks the map, then falls back to generic formatting.
const formatFacetTitle = (title: string): string => {
  if (facetTitles[title]) {
    return facetTitles[title];
  }
  return title
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const DynamicFilters: React.FC<DynamicFiltersProps> = ({
  facets,
  selectedFilters,
  onFilterChange,
}) => {
  const selectedFilterCount = Object.values(selectedFilters).flat().length;
  const hasFacets = Object.keys(facets).length > 0;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Filters</h2>

      {/* Display Applied Filters as removable pills */}
      {selectedFilterCount > 0 && (
        <div className="mb-6 pb-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-600 mb-2 text-sm">Applied Filters:</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(selectedFilters).map(([facet, values]) =>
              values.map(value => (
                <div key={`${facet}-${value}`} className="flex items-center bg-gray-200 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
                  <span>{value}</span>
                  <button
                    onClick={() => onFilterChange(facet, value)}
                    className="ml-2 text-gray-500 hover:text-gray-900 focus:outline-none"
                    aria-label={`Remove filter ${value}`}
                  >
                    &times;
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Facet Checkbox Lists */}
      <div className="space-y-4">
        {!hasFacets && <p className="text-sm text-gray-500">No filters available for the current search.</p>}
        
        {Object.entries(facets).map(([facetKey, facetValues]) => {
          if (!facetValues || Object.keys(facetValues).length === 0) return null;

          return (
            <div key={facetKey}>
              <h3 className="font-semibold text-gray-600 mb-2">{formatFacetTitle(facetKey)}</h3>
              <div className="max-h-60 overflow-y-auto pr-2 space-y-1">
                {Object.entries(facetValues).map(([value, count]) => (
                  <label key={value} className="flex items-center p-2 rounded-md hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      checked={selectedFilters[facetKey]?.includes(value) || false}
                      onChange={() => onFilterChange(facetKey, value)}
                    />
                    <span className="ml-3 text-sm text-gray-700">{value}</span>
                    <span className="ml-auto text-xs text-gray-400">{count}</span>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};