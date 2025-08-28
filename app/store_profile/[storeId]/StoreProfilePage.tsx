"use client";
import ListingPageHeader from "@/components/listings/ListingPageHeader";
import { useHeaderStore } from "@/store/listing_header_store";
import { useEffect, useState } from "react";
import StoreInfoContainer from "@/components/listings/StoreInforContainer";
import PostCatalogueButton from "@/components/listings/PostCatalogueButton";
import PostGalleryContainer from "@/components/listings/PostsContainer";
import ListingFooter from "@/components/listings/ListingFooter";
import Catalogue from "@/components/listings/Catalogue";
import DynamicFilter from "@/components/listings/DynamicFilter";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useProductFilterStore } from "@/store/filterStore";
import ProductContainer from "@/components/listings/ProductContainer";
import SortByDropdown from "@/components/listings/SortByDropdown";

export default function StoreProfilePage() {
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
    viewType,
  } = useHeaderStore();
  const {
    initializeFilters,
    selectedFilters,
    selectedPriceRange,
    setFacetInit,
  } = useProductFilterStore();

  const [showFilters, setShowFilters] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const params = useParams();
  const storeId = params?.storeId as string;

  const defaultButton = searchParams.get("defaultButton");

  useEffect(() => {
    setFacetInit(false);
  }, []);

  //  initialise the state using url
  useEffect(() => {
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
        key !== "price" &&
        key !== "city" &&
        key !== "area" &&
        key !== "store_type" &&
        key !== "defaultButton"
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
    let initialPriceRange: [number, number] | null = null;
    const priceParam = params.get("price");
    if (priceParam) {
      const [min, max] = priceParam.split("-").map(Number);
      if (!isNaN(min) && !isNaN(max)) {
        initialPriceRange = [min, max];
      }
    }
    if (storeTypeName) {
      const storeTypeObject = allStoreType.find(
        (st) => st.store_type === storeTypeName
      );
      if (storeTypeObject) {
        setStoreType(storeTypeObject);
      }
    }

    setQuery(search);
    initializeFilters({
      selectedFilters: initialSelectedFilters,
      priceRange: initialPriceRange,
    });
  }, [searchParams, initializeFilters, setQuery, setStoreType]);

  useEffect(() => {
    const oldparams = new URLSearchParams(searchParams);
    const newparams = new URLSearchParams();
    if (query) {
      newparams.set("search", query);
    }
    if (oldparams.get("categories")) {
      newparams.set("categories", oldparams.get("categories") || "");
    }
    // if (sortBy) {
    //   params.set("sortBy", sortBy);
    // }

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
    selectedPriceRange,
    pathname,
    city,
    area,
    storeType,
    router,
  ]);

  return (
    <div className="flex flex-col bg-[#FFFFFF]">
      {/* Full-width header */}
      {/* <ListingPageHeader /> */}

      {/* Centered content container */}
      <div className="flex flex-col items-center w-full">
        <div className="mt-8 w-full max-w-4xl px-4">
          <StoreInfoContainer storeId={storeId} />
          {/* <hr className="border border-[#D9D9D9]" />
          {defaultButton ? (
            <PostCatalogueButton
              storeId={storeId}
              defaultValue={defaultButton}
            />
          ) : (
            <PostCatalogueButton storeId={storeId} />
          )} */}
        </div>
        <div
          className={`w-full px-4 mt-6 md:mt-8
            ${viewType === "Posts" ? "max-w-[950px]" : "max-w-[1350px]"}
          `}
        >
          <hr className="border border-[#D9D9D9]" />
        </div>

        {defaultButton ? (
          <PostCatalogueButton storeId={storeId} defaultValue={defaultButton} />
        ) : (
          <PostCatalogueButton storeId={storeId} />
        )}
        {viewType === "Posts" && (
          <div className="mt-8 flex justify-center w-full">
            <div className="w-full max-w-4xl mx-auto">
              <PostGalleryContainer storeId={storeId} />
            </div>
          </div>
        )}

        {viewType === "Products" && (
          <div className="mt-8 w-full max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
              {/* Filter Column (Desktop) */}
              <div className="hidden lg:block lg:col-span-1 sticky top-4">
                <DynamicFilter context="product" />
              </div>

              {/* Product Grid (Mobile & Desktop) */}
              <div className="lg:col-span-3">
                {/* Mobile 'Filters' button */}
                <div className="flex  mb-4 lg:hidden">
                  <button
                    onClick={() => setIsFilterOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md lg:hidden"
                  >
                    <span>Filters</span>
                    <img
                      src="/ListingPageHeader/FilterIcon.svg"
                      alt="Filter button"
                      className={`w-4 h-4 transform transition-transform`}
                    />
                  </button>
                </div>
                {/* ✅ 4. Removed the outdated 'colCount' prop */}
                <ProductContainer storeId={storeId} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-10">
        <ListingFooter />
      </div>

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
              context="product"
              onClose={() => setIsFilterOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
