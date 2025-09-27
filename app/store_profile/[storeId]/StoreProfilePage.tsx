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
import ListingMobileHeader from "@/components/mobileListing/ListingMobileHeader";

/**
 * The main page component for displaying a single store's profile.
 *
 * This component acts as a central orchestrator, combining store information, posts, and
 * a filterable product catalogue into a single view. It manages the state for which view
 * is active ("Posts" or "Products") and handles the complex synchronization of filter
 * states between the UI, global Zustand stores, and the URL's search parameters.
 *
 * ### View Management
 * The page can display one of two main content sections at a time, controlled by the `viewType`
 * state from the `useHeaderStore`:
 * - **Posts View**: Renders the `PostGalleryContainer`.
 * - **Products View**: Renders the `ProductContainer` along with the `DynamicFilter` sidebar.
 *
 * ### State & URL Synchronization
 * A key feature of this component is its robust two-way data binding with the URL:
 * 1.  **URL to State**: On initial load or when the URL changes (e.g., browser back/forward),
 * an effect reads all relevant search parameters (`search`, `city`, `price`, etc.) and
 * initializes the `useHeaderStore` and `useProductFilterStore` with these values.
 * 2.  **State to URL**: A second effect listens for any changes in the global filter stores.
 * When a filter is applied or changed, it constructs a new URL query string reflecting the
 * current state and updates the URL using `router.replace()`. This ensures the page state
 * is always bookmarkable and shareable.
 *
 * @returns {JSX.Element} The fully rendered store profile page.
 * @see {@link StoreInfoContainer}
 * @see {@link PostCatalogueButton}
 * @see {@link PostGalleryContainer}
 * @see {@link ProductContainer}
 * @see {@link DynamicFilter}
 * @see {@link https://nextjs.org/docs/app/api-reference/functions/use-router | Next.js useRouter}
 * @see {@link https://docs.pmnd.rs/zustand/getting-started/introduction | Zustand Documentation}
 */
export default function StoreProfilePage() {
  const router = useRouter();
  const pathname = usePathname();
  // State from the global product filter store (Zustand).
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
    productQuery,     // ✨ ADDED: Get the productQuery state from the store
    setProductQuery,  // ✨ ADDED: Get the setter function for the search input
  } = useProductFilterStore();

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const params = useParams();
  const storeId = params?.storeId as string;

  const defaultButton = searchParams.get("defaultButton");

  useEffect(() => {
    setFacetInit(false);
  }, []);

  /**
   * This effect synchronizes the application's state FROM the URL's search parameters.
   * It runs on initial load and whenever the URL changes, parsing all relevant query parameters
   * and populating the Zustand stores to reflect the URL's state.
   */
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const initialSelectedFilters: Record<string, string[]> = {};
    const search = params.get("search") || "";
    const productSearch = params.get("product_search") || ""; // ✨ ADDED: Get the store-specific search query from the URL
    const cityName = params.get("city");
    const areaName = params.get("area");
    const storeTypeName = params.get("store_type");

    params.forEach((value, key) => {
      if (
        key !== "search" &&
        key !== "product_search" && // ✨ ADDED: Exclude our new param from the general filter object
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
      productQuery: productSearch, // ✨ ADDED: Initialize the product query state from the URL
    });
  }, [searchParams, initializeFilters, setQuery, setStoreType, allCity, allArea, allStoreType, setArea, setCity]); // ✨ MODIFIED: Added missing dependencies for robustness

  /**
   * This effect synchronizes the URL's search parameters FROM the application's state.
   * It listens for changes in the filter stores and constructs a new URL query string
   * to match the current state, ensuring the URL is always the source of truth.
   */
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
    //   params.set("sortBy", sortBy);
    // }

    // ✨ ADDED: If there's a store-specific search query, add it to the URL
    if (productQuery) {
      newparams.set("product_search", productQuery);
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
    selectedPriceRange,
    pathname,
    city,
    area,
    storeType,
    router,
    productQuery, // ✨ ADDED: This effect now runs when the product query changes
    query,        // ✨ MODIFIED: Added missing dependencies for robustness
    searchParams  // ✨ MODIFIED: Added missing dependencies for robustness
  ]);

  return (
    <div className="flex flex-col bg-[#FFFFFF]">
      {/* Full-width header */}
      <ListingMobileHeader className="block lg:hidden" />
      <ListingPageHeader className="hidden lg:block" />

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
          className={`w-full px-4 md:mt-8
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
                <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center"> {/* ✨ MODIFIED: Changed layout for search bar */}
                  <div className="flex lg:hidden"> {/* ✨ MODIFIED: Wrapped button for layout */}
                    <button
                      onClick={() => setIsFilterOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md"
                    >
                      <span>Filters</span>
                      <img
                        src="/ListingPageHeader/FilterIcon.svg"
                        alt="Filter button"
                        className={`w-4 h-4 transform transition-transform`}
                      />
                    </button>
                  </div>
                  
                  {/* ✨ ADDED: The product search bar JSX is now directly in this file */}
                  <div className="relative w-full sm:max-w-xs md:max-w-sm">
                    <img
                      src="/ListingPageHeader/search_lens.svg"
                      alt="Search"
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                    />
                    <input
                      type="text"
                      placeholder="Search products in this store..."
                      value={productQuery}
                      onChange={(e) => setProductQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition-shadow"
                    />
                  </div>
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
          className="fixed inset-0 z-102 bg-black/40 lg:hidden"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="fixed top-0 left-0 z-102 h-full w-full max-w-xs bg-white shadow-xl"
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