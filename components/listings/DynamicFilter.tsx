'use client';

import { useFilterStore } from '@/store/filterStore';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const DynamicFilter = () => {
  const { facets, selectedFilters, toggleFilter, resetFilters } = useFilterStore();

  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});
  const [openFacets, setOpenFacets] = useState<Record<string, boolean>>({});
  const [isCollapsed, setIsCollapsed] = useState(false); // main toggle

  const handleSearchChange = (facetName: string, value: string) => {
    setSearchTerms((prev) => ({
      ...prev,
      [facetName]: value,
    }));
  };

  const toggleFacet = (facetName: string) => {
    setOpenFacets((prev) => ({
      ...prev,
      [facetName]: !prev[facetName],
    }));
  };

  const formatFacetName = (name: string) => {
    return name
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  useEffect(() => {
    // Auto-expand all facets by default
    const defaultOpen: Record<string, boolean> = {};
    Object.keys(facets).forEach((facetName) => {
      defaultOpen[facetName] = true;
    });
    setOpenFacets(defaultOpen);
  }, [facets]);

  if (isCollapsed) {
    return (
      <div className="sticky top-20 z-10 ">

      
      <div className="max-w-xs p-4 bg-[#FFFAFA] rounded-lg shadow-sm border border-gray-200 flex justify-between items-center">
        <button
          className="flex items-center gap-2 text-sm font-medium text-gray-700"
          onClick={() => setIsCollapsed(false)}
        >
          <span>Refine</span>
          <Image
            src="/ListingPageHeader/left_pointing_arrow.svg"
            alt="expand"
            width={16}
            height={16}
            className="rotate-180"
          />
        </button>
      </div>
      </div>
    );
  }

  return (
    <div className="sticky top-20 z-10 ">
    <div className="h-[calc(100vh-5rem)] overflow-y-auto max-w-xs p-4 bg-[#FFFAFA] rounded-lg shadow-sm border border-gray-200 relative">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-lg font-semibold">Refine</h1>
        <button onClick={() => setIsCollapsed(true)}>
          <Image
            src="/ListingPageHeader/left_pointing_arrow.svg"
            alt="collapse"
            width={20}
            height={20}
          />
        </button>
      </div>
      <hr className="my-4 border-gray-200" />

      {Object.entries(facets).map(([facetName, values]) => {
        const isOpen = openFacets[facetName];
        const searchValue = searchTerms[facetName]?.toLowerCase() || '';
        const filteredValues = values.filter((facet) =>
          facet.name.toLowerCase().includes(searchValue)
        );

        return (
          <React.Fragment key={facetName}>
            <div className="mb-4">
              <div
                className="flex items-center justify-between mb-2 cursor-pointer"
                onClick={() => toggleFacet(facetName)}
              >
                <h2 className="text-lg font-semibold">{formatFacetName(facetName)}</h2>
                <Image
                  src="/ListingPageHeader/dropdown.svg"
                  alt="toggle"
                  width={20}
                  height={20}
                  className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
              </div>

              {isOpen && (
                <>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerms[facetName] || ''}
                    onChange={(e) => handleSearchChange(facetName, e.target.value)}
                    className="mb-3 w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />

                  <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                    {filteredValues.length > 0 ? (
                      filteredValues.map((facet) => (
                        <label
                          key={facet.name}
                          className="flex items-center justify-between space-x-2 cursor-pointer"
                        >
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
                      ))
                    ) : (
                      <div className="text-gray-400 text-sm italic">No options found</div>
                    )}
                  </div>
                </>
              )}
            </div>
            <hr className="my-4 border-gray-200" />
          </React.Fragment>
        );
      })}

      <button
        onClick={resetFilters}
        className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
      >
        Reset Filters
      </button>
    </div>
    </div>
  );
};

export default DynamicFilter;
