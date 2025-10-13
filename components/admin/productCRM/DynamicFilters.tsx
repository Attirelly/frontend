import { ProductFacets } from "@/types/algolia";

type SelectedFilters = Record<string, string[]>;

interface DynamicFiltersProps {
    facets: Partial<ProductFacets>;
    selectedFilters: SelectedFilters;
    onFilterChange: (category: string, value: string) => void;
}

// A mapping for user-friendly titles
const facetTitles: Record<string, string> = {
    genders: "Gender",
    primary_category: "Category",
    prices: "Price Range",
    "variants.size_name": "Size",
    colours: "Color",
};

export function DynamicFilters({ facets, selectedFilters, onFilterChange }: DynamicFiltersProps) {
  const selectedFilterCount = Object.values(selectedFilters).flat().length;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Filters</h2>

      {/* Display Selected Filters */}
      {selectedFilterCount > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-600 mb-2">Applied Filters:</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(selectedFilters).map(([category, values]) =>
              values.map(value => (
                <div key={`${category}-${value}`} className="flex items-center bg-gray-200 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
                  <span>{value}</span>
                  <button
                    onClick={() => onFilterChange(category, value)}
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

      {/* Facet Dropdowns */}
      <div className="space-y-4">
        {Object.entries(facets).map(([facetKey, facetValues]) => {
          if (Object.keys(facetValues).length === 0) return null;

          // Special handling for prices
          if (facetKey === "prices") {
            const numericValues = Object.keys(facetValues).map(v => parseFloat(v)).filter(v => !isNaN(v));
            const minPrice = Math.min(...numericValues);
            const maxPrice = Math.max(...numericValues);

            return (
              <div key={facetKey}>
                <h3 className="font-semibold text-gray-600 mb-2">{facetTitles[facetKey] || facetKey}</h3>
                <div className="flex gap-4 items-center">
                  <input
                    type="number"
                    defaultValue={minPrice}
                    className="w-1/2 border border-gray-300 rounded-md px-3 py-2 text-sm"
                    placeholder="Min"
                    onBlur={(e) => onFilterChange("min_price", e.target.value)}
                  />
                  <input
                    type="number"
                    defaultValue={maxPrice}
                    className="w-1/2 border border-gray-300 rounded-md px-3 py-2 text-sm"
                    placeholder="Max"
                    onBlur={(e) => onFilterChange("max_price", e.target.value)}
                  />
                </div>
              </div>
            );
          }

          // Default facet rendering
          return (
            <div key={facetKey}>
              <h3 className="font-semibold text-gray-600 mb-2">{facetTitles[facetKey] || facetKey}</h3>
              <div className="max-h-60 overflow-y-auto scrollbar-thin pr-2 space-y-1">
                {Object.entries(facetValues).map(([value, count]) => (
                  <label key={value} className="flex items-center p-2 rounded-md hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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
}