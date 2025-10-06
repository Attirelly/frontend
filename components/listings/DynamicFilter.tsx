"use client";

import { useFilterStore, useProductFilterStore } from "@/store/filterStore";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { manrope } from "@/font";
import DynamicFilterSkeleton from "./skeleton/DynamicFilterSkeleton";
import { Range } from "react-range";
import { useHeaderStore } from "@/store/listing_header_store";
import { X } from "lucide-react";

/**
 * @interface DynamicFilterProps
 * @description Defines the props for the DynamicFilter component.
 */
type DynamicFilterProps = {
  context: "store" | "product";
  onClose?: () => void;
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

/**
 * A versatile and context-aware component for displaying and managing filters.
 *
 * This component dynamically renders a list of filterable attributes (facets) based on the
 * provided `context`. It can function as a standard sidebar for desktop or as a closable
 * panel for mobile. It integrates deeply with Zustand stores to manage filter state globally.
 *
 * ### State Management
 * - **Contextual Store**: Based on the `context` prop, it dynamically hooks into either `useFilterStore` (for stores) or `useProductFilterStore` (for products). This allows the component to be reused across different parts of the application.
 * - **Local State**: It uses local React state to manage UI concerns like the open/closed state of accordion sections, search terms within facets, and the value of the price range slider.
 *
 * ### Price Range Slider
 * For the `'product'` context, the component includes a price range slider. To prevent excessive API calls while the user is dragging the slider, it uses a debouncing technique. The slider's value is held in a local state (`localPriceRange`) and is only synced to the global Zustand store 500ms after the user has stopped making changes.
 *
 * ### Conditional Rendering
 * The component's appearance and functionality change based on its props:
 * - The `context` prop determines which facets are shown (e.g., the price slider only appears for 'product').
 * - The presence of the `onClose` prop transforms the component into a modal-like view with a dedicated header and footer.
 *
 * @param {DynamicFilterProps} props - The props for the component.
 * @returns {JSX.Element} The rendered filter component or a skeleton loader.
 * @see {@link https://docs.pmnd.rs/zustand/getting-started/introduction | Zustand Documentation}
 * @see {@link https://github.com/react-component/slider | react-range (Range Slider) Documentation}
 * @see {@link https://lucide.dev/ | Lucide React (Icons)}
 * @see {@link https://nextjs.org/docs/pages/api-reference/components/image | Next.js Image Component}
 */
const DynamicFilter = ({ context, onClose }: DynamicFilterProps) => {
  const filterStore =
    context === "store" ? useFilterStore() : useProductFilterStore();
  const {
    facets,
    dynamic_facets: dynamicFacets,
    selectedFilters,
    toggleFilter,
    resetFilters,
    setPriceRange,
    selectedPriceRange,
    priceBounds,
    storeTypes,
  } = filterStore;
  const { storeType } = useHeaderStore();

  const combinedFacets = { ...facets, ...dynamicFacets };

  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});
  const [openFacets, setOpenFacets] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [localPriceRange, setLocalPriceRange] = useState(
    selectedPriceRange || priceBounds
  );

  useEffect(() => {
    console.log("Facets updated:", facets);
  }, [facets]);
  useEffect(() => {
    if (context === "product" && priceBounds) {
      setLocalPriceRange(priceBounds);
    }
  }, [context, priceBounds]);
  /**
   * this useEffect is use to keep the local price range and global price range in sync
   * if global selectedPrice range is changed
   * local price range is also change to make it in sync
   */
  useEffect(() => {
    const currentGlobalPrice = selectedPriceRange || priceBounds;
    if (
      currentGlobalPrice[0] !== localPriceRange[0] ||
      currentGlobalPrice[1] !== localPriceRange[1]
    ) {
      setLocalPriceRange(currentGlobalPrice);
    }
  }, [selectedPriceRange, priceBounds]);
  /**
   * if local price range is change
   * global price range is updated
   * setTimeout is used so that its not trigger
   * at every moment the user slide the price range
   */
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

  const selectedFilterCount = Object.values(selectedFilters).reduce(
    (acc, filters) => acc + filters.length,
    0
  );

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
  /**
   * if dynamic filter is loading set the skimmer effect
   */
  if (loading) return <DynamicFilterSkeleton />;

  return (
    //filter is sticky , always visible on screen
    <div className="sticky top-1 flex flex-col h-full max-h-[100vh] bg-white">
      {onClose && (
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <h1
              className={`${manrope.className} text-lg font-bold text-[#1F2937]`}
            >
              Filters
            </h1>
            {selectedFilterCount > 0 && (
              <span className="flex items-center justify-center bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full">
                {selectedFilterCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-600 hover:text-black"
          >
            <X size={24} />
          </button>
        </div>
      )}
      <div
        className={`${manrope.className} flex-grow p-4 overflow-y-auto scrollbar-thin`}
        style={{ fontWeight: 600 }}
      >
        <div className="flex flex-col">
          {!onClose && (
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {" "}
                {/* Use Flexbox for alignment */}
                <h1 className="text-[#1F2937]">FILTERS</h1>
                {selectedFilterCount > 0 && (
                  <span className="flex items-center justify-center bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full">
                    {selectedFilterCount}
                  </span>
                )}
              </div>

              <button
                onClick={() => handleResetFilters()}
                className="px-4 py-2 text-gray-700 rounded hover:bg-gray-200 cursor-pointer transition-colors"
              >
                RESET
              </button>
            </div>
          )}
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
                    onClick={() => {
                      context === "store"
                        ? toggleFilter(key, value, "stores")
                        : toggleFilter(key, value, "products");
                    }}
                    className="text-gray-500 hover:text-red-500"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {Object.entries(combinedFacets).map(([facetName, values]) => {
            const fName = formatFacetName(facetName);
            if (fName === "Store Types") {
              return null;
            } else if (fName === "Discount") {
              return null;
            }

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
                          {/* range component from react-range */}
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
                              filteredValues
                                .slice()
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
                                        id={facet.name}
                                        type="checkbox"
                                        // checked={facet.selected}
                                        checked={(
                                          selectedFilters[facetName] || []
                                        ).includes(facet.name)}
                                        onChange={() =>
                                          context === "store"
                                            ? toggleFilter(
                                                facetName,
                                                facet.name,
                                                "stores"
                                              )
                                            : toggleFilter(
                                                facetName,
                                                facet.name,
                                                "products"
                                              )
                                        }
                                        // className="h-4 w-4 accent-black rounded border-gray-300 dark:bg-white"
                                        // className="h-4 w-4 rounded border-gray-300 dark:border-black dark:bg-white accent-white dark:accent-white"
                                        className="
                                            h-4 w-4 rounded
                                            [color-scheme:light] 
                                            bg-white dark:bg-white 
                                            border border-gray-300 dark:border-gray-600
                                            checked:bg-white checked:border-black
                                            accent-black
                                            transition-colors duration-200
                                        "
                                      />
                                      <div className="flex justify-between w-full">
                                        <div className="flex-grow">
                                          {fName === "Area" ||
                                          fName === "City" ||
                                          fName === "Primary Category" ? (
                                            // Case 1: Display name and count with special styling
                                            <div className="flex items-center justify-between">
                                              <span
                                                className="text-sm text-[#1F2937]"
                                                style={{ fontWeight: 400 }}
                                              >
                                                {facet.name}
                                              </span>
                                              <span
                                                className="
                                                  flex items-center justify-center 
                                                  h-5 min-w-[1.25rem] px-1.5 
                                                  bg-gray-200 rounded-full 
                                                  text-xs font-medium text-gray-700
                                                "
                                              >
                                                {facet.count}
                                              </span>
                                            </div>
                                          ) : (
                                            // Case 2: Display only the name
                                            <span
                                              className="text-sm text-[#1F2937]"
                                              style={{ fontWeight: 400 }}
                                            >
                                              {facet.name}
                                            </span>
                                          )}
                                        </div>
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
      {onClose && (
        <div className="flex items-center gap-4 p-4 border-t bg-white">
          <button
            onClick={handleResetFilters}
            className="flex-1 px-4 py-3 font-semibold text-center border border-gray-300 rounded-md"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 font-semibold text-center text-white bg-black rounded-md"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
};

export default DynamicFilter;
