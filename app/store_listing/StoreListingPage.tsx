"use client";
import DynamicFilter from "@/components/listings/DynamicFilter";
import ListingPageHeader from "@/components/listings/ListingPageHeader";
import TwoOptionToggle from "@/components/listings/OnlineOffline";

import StoreContainerPage from "@/components/listings/StoreContainer";
import StoreTypeTabs from "@/components/listings/StoreTypes";
import { useHeaderStore } from "@/store/listing_header_store";
import { useEffect, useState } from "react";
import { manrope } from "@/font";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useFilterStore } from "@/store/filterStore";
import ListingMobileHeader from "@/components/mobileListing/ListingMobileHeader";

/**
 * The main component for displaying a filterable and searchable list of stores.
 *
 * This component serves as the central hub for the store listing experience. Its primary responsibility
 * is to manage a two-way synchronization between the application's state (held in Zustand stores)
 * and the browser's URL search parameters. This ensures that the page's state is always shareable,
 * bookmarkable, and correctly handled by the browser's history.
 *
 * ### State Management
 * The component's state is managed by two global Zustand stores:
 * - **`useHeaderStore`**: Controls the global search query, location (city/area), and selected store type.
 * - **`useFilterStore`**: Manages the detailed filter facets applied to the store list.
 *
 * ### URL Synchronization
 * Two `useEffect` hooks create a robust synchronization mechanism:
 * 1.  **URL to State**: On initial load or when the URL changes (e.g., browser back/forward), it parses the `searchParams` and populates the Zustand stores. A guard clause prevents this from running until all necessary data (like city/area lists) is available.
 * 2.  **State to URL**: After the initial state is hydrated, this effect listens for any changes in the Zustand stores and updates the URL's search parameters accordingly using `router.replace()`. This keeps the URL as the single source of truth for the page's state.
 *
 * ### API Calls
 * This component does not make direct API calls to fetch store data. It delegates this responsibility to its child component, {@link StoreContainerPage}, which consumes the state managed here.
 *
 * @returns {JSX.Element} The fully rendered store listing page.
 * @see {@link https://nextjs.org/docs/app/api-reference/functions/use-router | Next.js useRouter}
 * @see {@link https://nextjs.org/docs/app/api-reference/functions/use-pathname | Next.js usePathname}
 * @see {@link https://nextjs.org/docs/app/api-reference/functions/use-search-params | Next.js useSearchParams}
 * @see {@link https://docs.pmnd.rs/zustand/getting-started/introduction | Zustand Documentation}
 * @see {@link DynamicFilter}
 * @see {@link StoreContainerPage}
 * @see {@link StoreTypeTabs}
 */
export default function StoreListingPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // --- State from global Zustand stores ---
  const {
    query,
    city,
    storeType,
    setStoreType,
    allStoreType,
    setQuery,
    area,
    setCity,
    setArea,
    allArea,
    allCity,
  } = useHeaderStore();
  const { initializeFilters, selectedFilters } = useFilterStore();

  const [isReadyFlag, setIsReadyFlag] = useState<boolean>(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  /**
   * This effect synchronizes the application's state FROM the URL's search parameters.
   * It runs on component mount and whenever `searchParams` change. It parses all relevant
   * query parameters and uses them to initialize the Zustand stores.
   */
  useEffect(() => {
    // Guard clause: Do not proceed until the master lists of cities, areas, and store types are loaded into the store.
    // This prevents trying to match URL params against empty lists, avoiding race conditions.
    if (
      !(
        allCity &&
        allCity.length > 0 &&
        allArea &&
        allArea.length > 0 &&
        allStoreType &&
        allStoreType.length > 0
      )
    ) {
      return;
    }

    const params = new URLSearchParams(searchParams);
    const initialSelectedFilters: Record<string, string[]> = {};
    const search = params.get("search") || "";
    const cityName = params.get("city");
    const areaName = params.get("area");
    const storeTypeName = params.get("store_type");

    // Iterate over all URL parameters to build the initial filter state object.
    params.forEach((value, key) => {
      // Exclude special, non-facet parameters that are handled separately.
      if (
        key !== "search" &&
        key !== "sortBy" &&
        key !== "city" &&
        key !== "area" &&
        key !== "store_type"
      ) {
        if (key === "selectedCity") {
          initialSelectedFilters["city"] = value.split(",");
        } else if (key === "selectedArea") {
          initialSelectedFilters["area"] = value.split(",");
        } else {
          initialSelectedFilters[key] = value.split(",");
        }
      }
    });
    // Find and set the full City object based on the name from the URL.
    if (allCity && allCity.length > 0 && cityName) {
      const cityObject = allCity.find((c) => c.name === cityName);
      if (cityObject) setCity(cityObject);
    }
    // Find and set the full Area object based on the name from the URL.
    if (allArea && allArea.length > 0 && areaName) {
      const areaObject = allArea.find((a) => a.name === areaName);
      if (areaObject) setArea(areaObject);
    }
    if (search) {
      setQuery(search);
    }
    // Find and set the full StoreType object based on the name from the URL.
    if (storeTypeName) {
      const storeTypeObject = allStoreType.find(
        (st) => st.store_type === storeTypeName
      );
      if (storeTypeObject) {
        setStoreType(storeTypeObject);
      }
    }
    initializeFilters({
      selectedFilters: initialSelectedFilters,
    });
    setIsReadyFlag(true);
  }, [
    searchParams,
    allCity,
    allArea,
    allStoreType,
    initializeFilters,
    setQuery,
    setCity,
    setArea,
  ]);

  /**
   * This effect synchronizes the URL's search parameters FROM the application's state.
   * It runs whenever a filter, location, or search term changes, but only after the
   * `isReadyFlag` is true. It constructs a new URL and updates the browser's address bar.
   */

  useEffect(() => {
    // Guard clause: Do not run this effect until the state has been initialized from the URL.
    if (!isReadyFlag) return;

    const newparams = new URLSearchParams();
    if (query) {
      newparams.set("search", query);
    }

    Object.entries(selectedFilters).forEach(([key, values]) => {
      if (values && values.length > 0) {
        // Handle special key names for selected cities/areas from the filter panel.
        if (key === "city") {
          newparams.set("selectedCity", values.join(","));
        } else if (key === "area") {
          newparams.set("selectedArea", values.join(","));
        } else {
          newparams.set(key, values.join(","));
        }
      }
    });

    if (city) {
      newparams.set("city", city.name);
    }
    if (area) {
      newparams.set("area", area.name);
    }
    if (storeType) {
      newparams.set("store_type", storeType.store_type);
    }
    router.replace(`${pathname}?${newparams.toString()}`);
  }, [
    selectedFilters,
    isReadyFlag,
    query,
    city,
    area,
    storeType,
    pathname,
    router,
  ]);
  /**
   * Dynamically generates the main page heading based on the current filter and search state.
   * @returns {string} A formatted heading string.
   */
  const getHeading = () => {
    if (storeType && query && city) {
      return `Showing ${storeType.store_type} for ${query} in ${city.name}`;
    } else if (storeType && query) {
      return `Showing ${storeType.store_type} for ${query}`;
    } else if (storeType && city) {
      return `Showing ${storeType.store_type} in ${city.name}`;
    } else if (query && city) {
      return `Showing stores for ${query} in ${city.name}`;
    } else if (storeType) {
      return `Showing ${storeType.store_type}`;
    } else if (query) {
      return `Showing stores for ${query}`;
    } else if (city) {
      return `Showing stores in ${city.name}`;
    } else {
      return "";
    }
  };

  return (
    <div className="bg-[#FFFFFF] text-black">
      <ListingMobileHeader className="block lg:hidden" />
      <ListingPageHeader className="hidden lg:block" />
      {/* ✅ 3. Corrected responsive padding for the main container */}
      <div className="px-4 lg:px-20 mt-8 gap-10 flex flex-col pb-16 md:pb-0">
        <h1
          className={`${manrope.className} text-2xl lg:text-[32px] text-black`}
          style={{ fontWeight: 500 }}
        >
          {getHeading()}
        </h1>
        <StoreTypeTabs context="stores" />
        <div className="border-t border-[#D9D9D9]" />

        {/* ✅ 4. Re-introduced the main responsive grid container */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Filter Column for Desktop */}
          <div className="hidden lg:block lg:col-span-1 sticky top-4">
            <DynamicFilter context="store" />
          </div>

          {/* Store Content Column */}
          <div className="lg:col-span-3 flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <div className="hidden md:block">
                <TwoOptionToggle
                  options={["Online", "In Store"]}
                  defaultValue="Online"
                  context="store"
                />
              </div>
              <button
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-transform active:scale-95 rounded-md lg:hidden"
              >
                <span>Filters</span>
                <img
                  src="/ListingPageHeader/FilterIcon.svg"
                  alt="Filter button"
                  className={`w-4 h-4 transform transition-transform`}
                />
              </button>
            </div>
            <div className="w-full">
              <StoreContainerPage />
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white p-3 flex justify-center shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-30">
        <TwoOptionToggle
          options={["Online", "In Store"]}
          defaultValue="Online"
          context="store"
        />
      </div>

      {/* Mobile Filter Overlay Panel */}
      {isFilterOpen && (
        <div
          onClick={() => setIsFilterOpen(false)}
          className="fixed inset-0 z-102 bg-black/40 lg:hidden"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="fixed top-0 left-0 z-102 h-full w-full max-w-xs bg-white shadow-xl"
          >
            <DynamicFilter
              context="store"
              onClose={() => setIsFilterOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
