"use client";

import { useFilterStore, useProductFilterStore } from "@/store/filterStore";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { playfair_display, manrope } from "@/font";
import DynamicFilterSkeleton from "./skeleton/DynamicFilterSkeleton";
import { Range } from "react-range";
import { useHeaderStore } from "@/store/listing_header_store";

type DynamicFilterProps = {
  context: "store" | "product";
};

const priceRangeOrder = [
  { name: "Affordable", text: "starts from 2,000/-" },
  { name: "Premium", text: "start from 20,000/-" },
  { name: "Luxury", text: "starts from 50,000/-" },
];

const priceStartMap: { [storeType: string]: { [priceRange: string]: string } } =
  {
    "Designer Label": {
      Affordable: "starts from 2,000/-",
      Premium: "starts from 20,000/-",
      Luxury: "starts from 50,000/-",
    },
    "Retail Store": {
      Affordable: "starts from 500/-",
      Premium: "starts from 2,500/-",
      Luxury: "starts from 25,000/-",
    },
    Tailor: {
      Affordable: "starts from 500/-",
      Premium: "starts from 1,500/-",
      Luxury: "starts from 5,000/-",
    },
    Stylist: {
      Affordable: "starts from 500/-",
      Premium: "starts from 2,000/-",
      Luxury: "starts from 5,000/-",
    },
    // Add other store types here...
  };

const DynamicFilter = ({ context }: DynamicFilterProps) => {
  const filterStore =
    context === "store" ? useFilterStore() : useProductFilterStore();
  const {
    facets,
    selectedFilters,
    toggleFilter,
    resetFilters,
    setPriceRange,
    selectedPriceRange,
    priceBounds,
  } = filterStore;
  const { storeType } = useHeaderStore();

  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});
  const [openFacets, setOpenFacets] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [localPriceRange, setLocalPriceRange] = useState(
    selectedPriceRange || priceBounds
  );

  useEffect(() => {
    if (context === "product" && priceBounds) {
      setLocalPriceRange(priceBounds);
    }
  }, [context, priceBounds]);

  useEffect(() => {
    const currentGlobalPrice = selectedPriceRange || priceBounds;
    if (
      currentGlobalPrice[0] !== localPriceRange[0] ||
      currentGlobalPrice[1] !== localPriceRange[1]
    ) {
      setLocalPriceRange(currentGlobalPrice);
    }
  }, [selectedPriceRange, priceBounds]);

  useEffect(() => {
    if (context !== "product") return;

    const handler = setTimeout(() => {
      const currentGlobalPrice = selectedPriceRange || priceBounds;

      if (
        localPriceRange[0] !== currentGlobalPrice[0] ||
        localPriceRange[1] !== currentGlobalPrice[1]
      ) {
        setPriceRange(localPriceRange);
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [
    localPriceRange,
    selectedPriceRange,
    priceBounds,
    setPriceRange,
    context,
  ]);

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
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const handleResetFilters = () => {
    resetFilters();
    setLocalPriceRange(priceBounds);
  };

  if (loading) return <DynamicFilterSkeleton />;

  // if (isCollapsed) {
  //   return (
  //     <div className="sticky top-2 z-10">
  //       <div className="w-fit px-3 py-2 bg-white flex items-center">
  //         <button
  //           className="flex items-center gap-2 text-sm font-medium text-gray-700"
  //           onClick={() => setIsCollapsed(false)}
  //         >
  //           <span>Refine</span>
  //           <Image
  //             src="/ListingPageHeader/left_pointing_arrow.svg"
  //             alt="expand"
  //             width={16}
  //             height={16}
  //             className="rotate-180"
  //           />
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }
  return (
    <div className="sticky top-2 z-10 max-h-[100vh] overflow-y-auto scrollbar-thin">
      <div
        className={`${manrope.className} h-fit max-w-xs p-4 bg-white relative`}
        style={{ fontWeight: 600 }}
      >
        {/* <div className="flex items-center justify-between mb-3">
          <h1 className="text-[#1F2937]">Refine</h1>
          <button onClick={() => setIsCollapsed(true)}>
            <Image
              src="/ListingPageHeader/left_pointing_arrow.svg"
              alt="collapse"
              width={20}
              height={20}
            />
          </button>
        </div> */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-[#1F2937]">FILTERS</h1>
            <button
              onClick={() => handleResetFilters()}
              className="px-4 py-2 text-gray-700 rounded hover:bg-gray-200 cursor-pointer transition-colors"
            >
              RESET
            </button>
          </div>
          <div className="flex flex-wrap gap-2 max-w-xs mb-4">
            {Object.entries(selectedFilters).map(([key, values]) =>
              values.map((value) => (
                <div
                  key={`${key}-${value}`}
                  className="flex items-center gap-1 px-2 py-1 border-[1.25px] border-[#858585] text-sm text-gray-800 rounded-full"
                >
                  <span
                    className={`${manrope.className} text-sm`}
                    style={{ fontWeight: 400 }}
                  >
                    {value}
                  </span>
                  <button
                    onClick={() => toggleFilter(key, value)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* <hr className="my-4 border-[#D9D9D9]" /> */}
        <div className="flex flex-col gap-5">
          {Object.entries(facets).map(([facetName, values]) => {
            const fName = formatFacetName(facetName);
            if (fName === "Store Types" || fName === "Discount") return null;
            const isOpen = openFacets[facetName];

            const searchValue = searchTerms[facetName]?.toLowerCase() || "";
            const filteredValues = values.filter((facet) =>
              facet.name.toLowerCase().includes(searchValue)
            );
            if (filteredValues.length <= 0) return null;

            return (
              <React.Fragment key={facetName}>
                <div className="flex flex-col gap-2">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleFacet(facetName)}
                  >
                    <h2
                      className={`${manrope.className} text-base uppercase text-[#1F2937]`}
                      style={{ fontWeight: 600 }}
                    >
                      {fName === "Area"
                        ? "Location"
                        : fName === "Primary Category"
                        ? "Category"
                        : fName}
                    </h2>
                    <Image
                      src="/ListingPageHeader/dropdown.svg"
                      alt="toggle"
                      width={20}
                      height={20}
                      className={`transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {isOpen && (
                    <>
                      {context === "product" && fName === "Prices" ? (
                        <div className="mb-3">
                          <label className="text-sm text-gray-600 mb-1 block">
                            Range
                          </label>

                          <Range
                            step={100}
                            min={priceBounds[0]}
                            max={priceBounds[1]}
                            values={localPriceRange}
                            onChange={(values) =>
                              setLocalPriceRange([values[0], values[1]])
                            }
                            renderTrack={({ props, children }) => (
                              <div
                                {...props}
                                className="h-1 bg-gray-300 rounded-full"
                                style={{ ...props.style }}
                              >
                                <div
                                  className="h-1 bg-black rounded-full"
                                  style={{
                                    position: "absolute",
                                    left: `${
                                      ((localPriceRange[0] - priceBounds[0]) /
                                        (priceBounds[1] - priceBounds[0])) *
                                      100
                                    }%`,
                                    width: `${
                                      ((localPriceRange[1] -
                                        localPriceRange[0]) /
                                        (priceBounds[1] - priceBounds[0])) *
                                      100
                                    }%`,
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
                          {fName !== "Genders" && fName !== "Price Ranges" && (
                            <div className="flex items-center border border-black rounded">
                              <input
                                type="text"
                                placeholder="Search"
                                value={searchTerms[facetName] || ""}
                                onChange={(e) =>
                                  handleSearchChange(facetName, e.target.value)
                                }
                                className="w-full px-2 py-1 text-sm text-[#AFAFAF] focus:outline-none focus:border-none"
                                style={{ fontWeight: 400 }}
                              />
                              <Image
                                src="/ListingPageHeader/search_lens.svg"
                                alt="Search Lens"
                                width={20}
                                height={20}
                                className="mr-2 ml-2"
                              />
                            </div>
                          )}

                          <div className="space-y-2 max-h-40 overflow-y-auto pr-2 scrollbar-thin">
                            {filteredValues.length > 0 ? (
                              // Sort the filteredValues array based on a predefined order
                              filteredValues
                                // .filter((tempFilter) => {
                                //   return (
                                //     tempFilter.name.toLowerCase() !== "others"
                                //   );
                                // })
                                .slice() // Create a copy to avoid mutating the original array
                                .sort((a, b) => {
                                  // Define the order of price ranges
                                  const order: { [key: string]: number } = {
                                    Affordable: 1,
                                    Premium: 2,
                                    Luxury: 3,
                                  };
                                  // If it's the Price Ranges facet, use our custom order
                                  if (fName === "Price Ranges") {
                                    return (
                                      (order[a.name] || 0) -
                                      (order[b.name] || 0)
                                    );
                                  }
                                  // Otherwise maintain original order
                                  return 0;
                                })
                                .map((facet) => (
                                  <label
                                    key={facet.name}
                                    className="flex items-center justify-between cursor-pointer"
                                  >
                                    <div className="flex justify-between items-center w-full space-x-2">
                                      <input
                                        type="checkbox"
                                        checked={facet.selected}
                                        onChange={() =>
                                          toggleFilter(facetName, facet.name)
                                        }
                                        // className="h-4 w-4 accent-black rounded border-gray-300 dark:bg-white"
                                        // className="h-4 w-4 rounded border-gray-300 dark:border-black dark:bg-white accent-white dark:accent-white"
                                        className=" h-4 w-4 rounded
                                                    border border-gray-300
                                                    bg-white
                                                    checked:bg-black checked:border-black
                                                    accent-black
                                                    transition-colors duration-200"
                                      />
                                      <div className="flex justify-between w-full">
                                        <span
                                          className="text-sm text-[#1F2937]"
                                          style={{ fontWeight: 400 }}
                                        >
                                          {facet.name}
                                        </span>
                                        <span
                                          className="text-sm text-[#666666] mr-4"
                                          style={{ fontWeight: 400 }}
                                        >
                                          {fName === "Price Ranges"
                                            ? storeType?.store_type &&
                                              priceStartMap[
                                                storeType.store_type
                                              ]?.[facet.name]
                                              ? priceStartMap[
                                                  storeType.store_type
                                                ][facet.name]
                                              : ""
                                            : ""}
                                        </span>
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
                {/* <hr className="my-4 border-[#D9D9D9]" /> */}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DynamicFilter;
