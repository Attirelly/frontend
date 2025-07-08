'use client';

import { useFilterStore, useProductFilterStore } from '@/store/filterStore';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { playfair_display, manrope } from '@/font';
import DynamicFilterSkeleton from './skeleton/DynamicFilterSkeleton';
import { Range } from 'react-range';

type DynamicFilterProps = {
  context: 'store' | 'product';
};

const DynamicFilter = ({ context }: DynamicFilterProps) => {
  const filterStore =
    context === 'store' ? useFilterStore() : useProductFilterStore();
  const {
    facets,
    selectedFilters,
    toggleFilter,
    resetFilters,
    setPriceRange,
    priceRange,
    priceBounds,
  } = filterStore;

  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});
  const [openFacets, setOpenFacets] = useState<Record<string, boolean>>({});
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>([0,1]);

  useEffect(() => {
    if (context === 'product' && priceBounds) {
      setLocalPriceRange(priceBounds);
    }
  }, [context,priceBounds]);
  
  console.log("price bound, local, range", priceBounds, priceRange);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (
        context === 'product' &&
        priceRange &&
        (localPriceRange[0] !== priceRange[0] || localPriceRange[1] !== priceRange[1])
      ) {
        setPriceRange(localPriceRange);
      }
    }, 100); // 100ms delay

    return () => clearTimeout(timeout);   
  }, [localPriceRange]);

  useEffect(() => {
    const defaultOpen: Record<string, boolean> = {};
    Object.keys(facets).forEach((facetName) => {
      defaultOpen[facetName] = true;
    });
    setOpenFacets(defaultOpen);
  }, [facets]);
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

  const formatFacetName = (name: string) =>
    name
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');


  const handleResetFilters = () => {
    resetFilters();
    setLocalPriceRange(priceBounds);
  }

  if (loading) return <DynamicFilterSkeleton />;

  if (isCollapsed) {
    return (
      <div className="sticky top-2 z-10">
        <div className="w-fit px-3 py-2 bg-[#FFFAFA] rounded-lg shadow-sm border border-gray-200 flex items-center">
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
  console.log("priceBounds", priceBounds);  
  return (
    <div className="sticky top-2 z-10">
      <div
        className={`${manrope.className} h-[calc(100vh-5rem)] overflow-y-auto max-w-xs p-4 bg-[#FFFAFA] rounded-lg shadow-sm border border-gray-200 relative`}
        style={{ fontWeight: 500 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h1 className={`${playfair_display.className}`}>Refine</h1>
          <button onClick={() => setIsCollapsed(true)}>
            <Image
              src="/ListingPageHeader/left_pointing_arrow.svg"
              alt="collapse"
              width={20}
              height={20}
            />
          </button>
        </div>
        <hr className="my-4 border-[#D9D9D9]" />

        {Object.entries(facets).map(([facetName, values]) => {
          const isOpen = openFacets[facetName];
          const fName = formatFacetName(facetName);
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
                  <h2 className={`${playfair_display.className}`}>
                    {fName === 'Area' ? 'Location' : fName}
                  </h2>
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
                    {context === 'product' && fName === 'Prices' ? (
                      <div className="mb-3">
                        <label className="text-sm text-gray-600 mb-1 block">Range</label>

                        <Range
                          step={100}
                          min={0}
                          max={priceBounds?.[1] || 10000}
                          values={localPriceRange}
                          onChange={(values) => setLocalPriceRange([values[0], values[1]])}
                          renderTrack={({ props, children }) => (
                            <div
                              {...props}
                              className="h-1 bg-gray-300 rounded-full"
                              style={{ ...props.style }}
                            >
                              <div
                                className="h-1 bg-black rounded-full"
                                style={{
                                  position: 'absolute',
                                  left: `${((localPriceRange[0] - (priceBounds?.[0] || 0)) / ((priceBounds?.[1] || 10000) - (priceBounds?.[0] || 0))) * 100}%`,
                                  width: `${((localPriceRange[1] - localPriceRange[0]) / ((priceBounds?.[1] || 10000) - (priceBounds?.[0] || 0))) * 100}%`,
                                  top: 0,
                                  bottom: 0,
                                }}
                              />
                              {children}
                            </div>
                          )}
                          renderThumb={({ props }) => (
                            <div
                              {...props}
                              className="w-3 h-3 bg-black border border-white rounded-full shadow-md"
                            />
                          )}
                        />

                        <div className="text-sm text-gray-600 mt-2">
                          ₹{localPriceRange[0]} – ₹{localPriceRange[1]}
                        </div>
                      </div>
                    ) : (
                      <>
                        {fName !== 'Genders' && fName !== 'Price Ranges' && (
                          <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerms[facetName] || ''}
                            onChange={(e) =>
                              handleSearchChange(facetName, e.target.value)
                            }
                            className="mb-3 w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                          />
                        )}

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
                                    onChange={() =>
                                      toggleFilter(facetName, facet.name)
                                    }
                                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                  />
                                  <div className='flex gap-4'>
                                    <span className='text-sm' style={{ fontWeight: 400 }}>{facet.name}</span>
                                    {fName === 'Price Ranges' && (<span className='text-sm text-[#666666]' style={{ fontWeight: 400 }}>{facet.name === 'Affordable' ? 'starts from 2000/-' : facet.name === 'Premium' ? 'start from 5000/-' : 'starts from 25000/-'}</span>)}
                                  </div>
                                </div>
                              </label>
                            ))
                          ) : (
                            <div className="text-gray-400 text-sm italic">
                              No options found
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
              <hr className="my-4 border-[#D9D9D9]" />
            </React.Fragment>
          );
        })}

        <button
          onClick={() => handleResetFilters()}
          className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default DynamicFilter;


