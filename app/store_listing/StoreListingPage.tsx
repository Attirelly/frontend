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

export default function StoreListingPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
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
  const [showFilters, setShowFilters] = useState(false);
  const { results, initializeFilters, selectedFilters, selectedPriceRange } =
    useFilterStore();

  const [isReadyFlag, setIsReadyFlag] = useState<boolean>(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // url to state update
  useEffect(() => {
    // return;
    if (
      !(
        allCity &&
        allCity.length > 0 &&
        allArea &&
        allArea.length > 0 &&
        allStoreType &&
        allStoreType.length > 0
      )
    )
      return;

    console.log(searchParams);
    const params = new URLSearchParams(searchParams);
    const initialSelectedFilters: Record<string, string[]> = {};
    const search = params.get("search") || "";
    const cityName = params.get("city");
    const areaName = params.get("area");
    const storeTypeName = params.get("store_type");

    params.forEach((value, key) => {
      if (
        key !== "search" &&
        key !== "sortBy" &&
        key !== "city" &&
        key !== "area" &&
        key !== "store_type"
      ) {
        initialSelectedFilters[key] = value.split(",");
      }
    });
    // Only perform the lookup if the master lists have been loaded
    if (allCity && allCity.length > 0 && cityName) {
      const cityObject = allCity.find((c) => c.name === cityName);
      if (cityObject) setCity(cityObject);
    }

    if (allArea && allArea.length > 0 && areaName) {
      const areaObject = allArea.find((a) => a.name === areaName);
      if (areaObject) setArea(areaObject);
    }
    if (search) {
      setQuery(search);
    }
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

  // state to url

  useEffect(() => {
    if (!isReadyFlag) return;

    const newparams = new URLSearchParams();
    if (query) {
      newparams.set("search", query);
    }

    Object.entries(selectedFilters).forEach(([key, values]) => {
      if (values && values.length > 0) {
        newparams.set(key, values.join(","));
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

  const getHeading = () => {
    // if (storeType && query && city) {
    //   return `Showing ${storeType.store_type} for ${query} in ${city.name}`;
    // }
    // else if (storeType && query) {
    //   return `Showing ${storeType.store_type} for ${query}`;
    // }
    // else if (storeType && city) {
    //   return `Showing ${storeType.store_type} in ${city.name}`;
    // }
    // else
    if (query && city) {
      return `Showing stores for ${query} in ${city.name}`;
    }
    // else if (storeType) {
    //   return `Showing ${storeType.store_type}`;
    // }
    else if (query) {
      return `Showing stores for ${query}`;
    } else if (city) {
      return `Showing stores in ${city.name}`;
    } else {
      return "";
    }
  };

  return (
    <div className="bg-[#FFFFFF]">
      <ListingPageHeader />
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
                  options={["Online Shopping", "In Store Shopping"]}
                  defaultValue="Online Shopping"
                  context="store"
                />
              </div>
              <button
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-md lg:hidden"
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
          options={["Online Shopping", "In Store Shopping"]}
          defaultValue="Online Shopping"
          context="store"
        />
      </div>

      {/* Mobile Filter Overlay Panel */}
      {isFilterOpen && (
        <div
          onClick={() => setIsFilterOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="fixed top-0 left-0 z-50 h-full w-full max-w-xs bg-white shadow-xl"
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
