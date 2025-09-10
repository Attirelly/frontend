"use client";
import DynamicFilter from "@/components/listings/DynamicFilter";
import ListingFooter from "@/components/listings/ListingFooter";
import ListingPageHeader from "@/components/listings/ListingPageHeader";
import ProductContainer from "@/components/listings/ProductContainer";
import SortByDropdown from "@/components/listings/SortByDropdown";
import StoreTypeButtons from "@/components/listings/StoreTypeButtons";
import { manrope } from "@/font";
import { useProductFilterStore } from "@/store/filterStore";
import { useHeaderStore } from "@/store/listing_header_store";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Fuse from "fuse.js";
import StoreTypeTabs from "@/components/listings/StoreTypes";
import { BrandType } from "@/types/SellerTypes";
import { Filter } from "lucide-react";
import ListingMobileHeader from "@/components/mobileListing/ListingMobileHeader";

// const STORE_TYPE_OPTIONS = [
//   { store_type: "Retail Store", id: process.env.NEXT_PUBLIC_RETAIL_STORE_TYPE },
//   {
//     store_type: "Designer Label",
//     id: process.env.NEXT_PUBLIC_DESIGNER_STORE_TYPE,
//   },
// ];

const STORE_TYPE_OPTIONS: BrandType[] = [
  { id: "f923d739-4c06-4472-9bfd-bb848b32594b", store_type: "Retail Store" },
  { id: "9e5bbe6d-f2a4-40f0-89b0-8dac6026bd17", store_type: "Designer Label" },
];

export default function ProductListPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {
    setQuery,
    query,
    setStoreType,
    area,
    allArea,
    city,
    allCity,
    setArea,
    setCity,
    storeType,
    allStoreType,
  } = useHeaderStore();
  const {
    results,
    initializeFilters,
    selectedFilters,
    selectedPriceRange,
    activeFacet,
    isResultsLoading,
  } = useProductFilterStore();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [matchedStoreType, setMatchedStoreType] = useState<string | null>(null);
  const [isReadyFlag, setIsReadyFlag] = useState<Boolean>(false);
  const fuse = new Fuse(STORE_TYPE_OPTIONS, {
    keys: ["store_type"],
    threshold: 0.4,
  });

  // url to state
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const initialSelectedFilters: Record<string, string[]> = {};
    const search = params.get("search") || "";
    const cityName = params.get("city");
    const areaName = params.get("area");
    const storeTypeName = params.get("store_type");

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

    params.forEach((value, key) => {
      if (
        key !== "search" &&
        key !== "sortBy" &&
        key !== "price" &&
        key !== "city" &&
        key !== "area" &&
        key !== "store_type"
      ) {
        initialSelectedFilters[key] = value.split(",");
      }
    });

    // Only perform the lookup if the master lists have been loaded
    console.log("all city", allCity);
    if (allCity && allCity.length > 0 && cityName) {
      const cityObject = allCity.find((c) => c.name === cityName);
      console.log("url_city", cityObject);
      if (cityObject) setCity(cityObject);
    }

    if (allArea && allArea.length > 0 && areaName) {
      const areaObject = allArea.find((a) => a.name === areaName);
      console.log(areaObject);
      if (areaObject) setArea(areaObject);
    }
    let initialPriceRange: [number, number] | null = null;
    const priceParam = params.get("price");
    if (priceParam) {
      const [min, max] = priceParam.split("-").map(Number);
      if (!isNaN(min) && !isNaN(max)) {
        initialPriceRange = [min, max];
      }
    }
    if (storeTypeName) {
      console.log(storeTypeName);
      const storeTypeObject = allStoreType.find(
        (st) => st.store_type === storeTypeName
      );
      if (storeTypeObject) {
        console.log("storetypeobject", storeTypeObject);
        setStoreType(storeTypeObject);
      }
    }

    setQuery(search);
    initializeFilters({
      selectedFilters: initialSelectedFilters,
      priceRange: initialPriceRange,
    });

    // C. Perform fuzzy search based on the search term
    const match = fuse.search(search);
    if (match.length > 0) {
      const matchedType = match[0].item;
      setStoreType(matchedType);
      setMatchedStoreType(matchedType.store_type);
    }

    setIsReadyFlag(true);
  }, [
    searchParams,
    allCity,
    allArea,
    allStoreType,
    initializeFilters,
    setQuery,
    setStoreType,
  ]);

  useEffect(() => {
    if (!isReadyFlag) return;
    const oldparams = new URLSearchParams(searchParams);
    const newparams = new URLSearchParams();
    if (query) {
      newparams.set("search", query);
    }
    if (oldparams.get("categories")) {
      newparams.set("categories", oldparams.get("categories") || "");
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

    if (selectedPriceRange) {
      const [min, max] = selectedPriceRange;
      newparams.set("price", `${min}-${max}`);
    }
    if (storeType) {
      newparams.set("store_type", storeType.store_type);
    }

    router.replace(`${pathname}?${newparams.toString()}`);
  }, [
    selectedFilters,
    isReadyFlag,
    selectedPriceRange,
    city,
    area,
    storeType,
    pathname,
    router,
  ]);

  const displayCategory = selectedFilters.categories?.[0] || "";

  useEffect(() => {
    console.log("results changed", results);
  }, [results]);

  return (
    <div className="flex flex-col bg-[#FFFFFF]">
      <ListingMobileHeader className="block lg:hidden" />
      <ListingPageHeader className="hidden lg:block" />
      <div className="flex flex-col px-4 pb-24 md:pb-0 lg:px-20">
        <span
          className={`${manrope.className} text-[#101010] mt-4 text-2xl lg:text-[32px]`}
          style={{ fontWeight: 500 }}
        >
          {isResultsLoading
            ? "" // or "Loading..."
            : results > 0
            ? query
              ? `Showing Results for "${query}"`
              : displayCategory
              ? `Showing Results for "${displayCategory}"`
              : ""
            : "Sorry, no result found for your search"}
        </span>

        {/* Store Type Selection */}
        <div className="hidden md:block mt-10">
          <StoreTypeTabs
            defaultValue={storeType?.store_type ?? matchedStoreType ?? ""}
            context="products"
          />
        </div>

        {/* Content Section */}
        <div className="flex flex-col mt-5 items-center">
          <hr className="border-t border-[#D9D9D9] w-full mt-2 mb-2 md:mt-4 md:mb-4" />
          <div className="flex flex-col items-center w-full mt-4 md:mt-8">
            <div className="w-full px-2">
              <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Filter Column */}
                <div className="hidden lg:block lg:col-span-1 sticky top-2">
                  <DynamicFilter context="product" />
                </div>

                {/* Product Content Column */}
                <div className="lg:col-span-3">
                  <div className="flex justify-between items-center mb-4">
                    <div
                      onClick={() => setIsFilterOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500 rounded-md lg:hidden"
                    >
                      <span>Filters</span>
                      <img
                        src="/ListingPageHeader/FilterIcon.svg"
                        alt="Filter button"
                        className={`w-4 h-4 transform transition-transform`}
                      />
                    </div>
                    <SortByDropdown />
                  </div>
                  <ProductContainer />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white p-2 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-30 flex justify-center items-center">
          <StoreTypeTabs
            defaultValue={storeType?.store_type ?? matchedStoreType ?? ""}
            context="products"
          />
        </div>
      </div>
      <div className="mt-10">
        <ListingFooter />
      </div>

      {isFilterOpen && (
        // Backdrop
        <div
          onClick={() => setIsFilterOpen(false)}
          className="fixed inset-0 z-100 bg-black/40 lg:hidden"
        >
          {/* Panel */}
          <div
            onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside the panel
            className="fixed top-0 left-0 z-50 h-full w-full max-w-xs bg-white shadow-xl mx-auto"
          >
            {/* The filter component is rendered here for mobile, with the 'onClose' prop */}
            <DynamicFilter
              context="product"
              onClose={() => setIsFilterOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
