// components/DynamicFilter.tsx
import { useFilterStore } from '@/store/filterStore';
import React, { useEffect } from 'react';


const DynamicFilter = () => {
  const { facets,selectedFilters ,  toggleFilter, resetFilters } = useFilterStore();
  
  // Format facet name for display (optional)
  const formatFacetName = (name: string) => {
    return name.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  useEffect(()=>{
    console.log("facets" , facets)
    console.log("selectedfacets" , selectedFilters)
  },[facets , selectedFilters])

  return (
    <div className="max-w-xs p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      {Object.entries(facets).map(([facetName, values]) => (
        <React.Fragment key={facetName}>
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">
              {formatFacetName(facetName)}
            </h2>
            <div className="space-y-2">
              {values.map((facet) => (
                <label key={facet.name} className="flex items-center justify-between space-x-2 cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={facet.selected}
                      onChange={() => toggleFilter(facetName, facet.name)}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span>{facet.name}</span>
                  </div>
                  <span className="text-gray-500 text-sm">{facet.count}</span>
                </label>
              ))}
            </div>
          </div>
          <hr className="my-4 border-gray-200" />
        </React.Fragment>
      ))}

      <button
        onClick={resetFilters}
        className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default DynamicFilter;