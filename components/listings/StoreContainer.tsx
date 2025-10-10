"use client";
import { api } from "@/lib/axios";
import StoreCard from "./StoreCard";
import { useHeaderStore } from "@/store/listing_header_store";
import { useEffect, useMemo, useRef, useState } from "react";
import { BrandType, City, StoreCardType } from "@/types/SellerTypes";
import { useFilterStore } from "@/store/filterStore";
import { event } from "@/lib/gtag";
import StoreCardSkeleton from "./skeleton/StoreCardSkeleton";
import NoResultFound from "./NoResultFound";

// --- Infinite Scroll & Buffering Configuration ---
const ITEMS_PER_PAGE = 10;
const BUFFER_SIZE = 60; // Fetch 60 stores at a time from the backend
const REFETCH_THRESHOLD = Math.round(BUFFER_SIZE * 0.2); // Refetch when 80% of buffer is used

/**
 * A container that fetches and displays stores in a list with a buffered infinite scroll mechanism.
 *
 * This component orchestrates the entire store listing experience. It listens to filter and search states
 * from global Zustand stores, constructs and executes API requests, and renders the results.
 * It is highly optimized for a smooth user experience by pre-fetching and buffering data.
 *
 * ### Buffered Infinite Scroll
 * To avoid loading spinners while scrolling, this component uses a client-side buffer:
 * 1.  **API Fetch**: It fetches stores from the API in large chunks (`BUFFER_SIZE`) and stores them in an invisible `buffer` state.
 * 2.  **UI Display**: A smaller, visible list of `stores` is shown to the user.
 * 3.  **Infinite Scroll**: An `IntersectionObserver` watches a loader element at the bottom of the list. When this element is scrolled into view, a chunk of items (`ITEMS_PER_PAGE`) is moved instantly from the `buffer` to the `stores` list, creating a seamless scrolling effect.
 * 4.  **Proactive Refetch**: When the `buffer` depletes to the `REFETCH_THRESHOLD`, a background API call is automatically made to fetch the next chunk of stores, refilling the buffer before the user runs out of items.
 *
 * ### State Management
 * - It is a major consumer of the `useFilterStore` and `useHeaderStore`, reading all filter/search criteria to build its API requests.
 * - It is also a producer, as it calls `setFacets` to update the global state with the latest filter data from the API.
 *
 * ### API Endpoint
 * **`GET /search/search_store`**
 * This endpoint is used to search and filter stores.
 * **Query Parameters:**
 * - `query`: The main text search string.
 * - `page`: The page number for pagination.
 * - `limit`: The number of items to return (`BUFFER_SIZE`).
 * - `filters`: A string of `AND`/`OR`-separated filter clauses (e.g., for delivery type or discounts).
 * - `facetFilters`: A URL-encoded JSON string for multi-select facet filtering.
 * - `area` (optional): Filters results by a specific area.
 * - `city` (optional): Filters results by a specific city.
 *
 * @returns {JSX.Element} A list of stores, a skeleton loader, or a "no results" message.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API | Intersection Observer API}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/AbortController | AbortController}
 * @see {@link https://docs.pmnd.rs/zustand/getting-started/introduction | Zustand Documentation}
 * @see {@link StoreCard}
 * @see {@link NoResultFound}
 */

export default function StoreContainerPage() {
  const { facets, setFacets, selectedFilters, activeFacet, selectedDiscount  } = useFilterStore();
  const { city, area, query, storeType, deliveryType } = useHeaderStore();

  const [stores, setStores] = useState<StoreCardType[]>([]);
  const [buffer, setBuffer] = useState<StoreCardType[]>([]);
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [apiHasMore, setApiHasMore] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [noResultFound, setNoResultFound] = useState(false);

  /**
   * This memoized value calculates the index of the first store in the list that does NOT match the
   * currently selected city or area. It's used to render a "More From Other Locations" heading
   * in the list, separating local results from others.
   */
  const differentLocationStoreIndex = useMemo(() => {
    // findIndex is a cleaner version of your loop.
    // It stops as soon as it finds a match.
    return stores.findIndex((store) => {
      const selectedCity = city?.name.toLowerCase();
      const selectedArea = area?.name.toLowerCase();

      const areaMismatch =
        selectedArea &&
        store.location.toLowerCase().includes(selectedArea) === false;
      const cityMismatch =
        selectedCity &&
        store.location.toLowerCase().includes(selectedCity) === false;

      return (selectedCity && cityMismatch) || (selectedArea && areaMismatch);
    });
  }, [stores, city, area]);

  /**
   * A helper function to build the facet filter string required by the backend API.
   * @param facets - The selected filters from the Zustand store.
   * @param storeType - The currently selected store type.
   * @returns An encoded string for the API request.
   */
  const buildFacetFilters = (
    facets: Record<string, string[]>,
    storeType?: BrandType | null
  ): string => {
    const facetFilters: string[][] = [];
    for (const key in facets) {
      if (facets[key].length > 0 && key.toLowerCase() !== "discount") {
        facetFilters.push(facets[key].map((value) => `${key}:${value}`));
      }
    }
    if (storeType) {
      facetFilters.push([`store_types:${storeType.store_type}`]);
    }
    return encodeURIComponent(JSON.stringify(facetFilters));
  };

  /**
   * Fetches a chunk of stores from the API and populates the buffer.
   * @param currentPage - The page number to fetch.
   * @param controller - An optional AbortController to cancel the request.
   */
  const fetchStores = async (
    currentPage: number,
    controller?: AbortController
  ) => {
    setLoading(true);

    let filterClauses = [];

    // 2. Use .push() and check if the string is not empty
    if (filters) {
      filterClauses.push(filters);
    }

    // 3. Process the discount filter
    const discountArray = selectedFilters["discount"] || [];
    if (discountArray.length > 0) {
      const discountStr = discountArray
        .map((val) => `discount >= ${parseInt(val, 10)}`)
        .join(" OR ");

      // Wrap OR conditions in parentheses for correct logic
      filterClauses.push(`(${discountStr})`);
    }

    const finalFilterString = filterClauses.join(" AND ");

    const facetFilters = buildFacetFilters(selectedFilters, storeType);

        let searchUrl = `/search/search_store?query=${query}&page=${currentPage}&limit=${BUFFER_SIZE}&filters=${finalFilterString}&facetFilters=${facetFilters}`;

    // let searchUrl = `/search/search_store?query=${query}&page=${currentPage}&limit=${BUFFER_SIZE}&filters=${finalFilterString}&facetFilters=${facetFilters}&only_active=true`;

    if (area) {
      searchUrl += `&area=${area.name}`;
    }
    if (city) {
      searchUrl += `&city=${city.name}`;
    }

    // ✅ 2. ADD the new `selectedDiscount` parameter to the API request URL.
    if (selectedDiscount) {
      searchUrl += `&discount=${encodeURIComponent(selectedDiscount)}`;
    }

    try {
      const res = await api.get(
        searchUrl,
        controller ? { signal: controller.signal } : {}
      );

      event({
        action: "Fiter_applied",
        params: {
          filter_location: selectedFilters.area,
          filter_gender: selectedFilters.genders,
          filter_category: selectedFilters.categories,
          filter_pricerange: selectedFilters.price_ranges,
          filter_bestselling: selectedFilters.categories,
          filter_discounts: selectedFilters.discount,
        },
      });

      const data = res.data;

      if (data.hits.length === 0 && currentPage === 0) {
        setNoResultFound(true);
        setLoading(false);
        setBuffer([]);
        setStores([]);
        setApiHasMore(false);
        setHasMore(false);
        return;
      } else {
        setNoResultFound(false);
      }

      setFacets(data.facets, activeFacet);
      setTotalPages(data.total_pages);

      const storeCards: StoreCardType[] = data.hits.map(
        (sc: any, index: number) => {
          // return the mapped store

          return {
            id: sc.id,
            imageUrl: sc.profile_image || "/OnboardingSections/qr.png",
            storeName: sc.store_name,
            location:
              sc.area?.toLowerCase() === "others"
                ? `${sc.city}`
                : `${sc.area}, ${sc.city}`,
            storeTypes: sc.store_types || [],
            priceRanges: [
              ...new Set(
                sc.store_type_price_range
                  .filter((item) => item.store_type === storeType?.store_type)
                  .map((item) => item.price_range)
              ),
            ],
            bestSelling: sc.categories,
            discount: sc.discount,
            instagramFollowers: sc.followers_count || "1K",
          };
        }
      );

      if (currentPage === 0) {
        setStores(storeCards.slice(0, ITEMS_PER_PAGE));
        setBuffer(storeCards.slice(ITEMS_PER_PAGE));
      } else {
        setBuffer((prev) => [...prev, ...storeCards]);
      }

      if (currentPage >= data.total_pages - 1) {
        setApiHasMore(false);
      } else {
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to fetch stores:", error);
      // Handle error state
    } finally {
      setLoading(false);
    }
  };

  /**
   * Main effect to trigger a reset and re-fetch whenever any filter dependency changes.
   */
  useEffect(() => {
    const controller = new AbortController();
    setPage(0);
    setStores([]);
    setBuffer([]);
    setApiHasMore(true);
    fetchStores(0, controller);
    // The cleanup function aborts the fetch request if dependencies change before it completes.

    return () => {
      controller.abort();
    };
  }, [query, storeType, selectedFilters, city, area, selectedDiscount, filters]);
  /**
   * Effect to handle changes from the "Online" / "In Store" toggle.
   * It translates the user-friendly selection into the filter string the API expects.
   */
  useEffect(() => {
    if (deliveryType == "In Store") {
      setFilters("is_online:'false' OR is_both:'true'");
    } else if (deliveryType == "Online") {
      setFilters("is_online:'true' OR is_both:'true'");
    } else {
      setFilters("");
    }
  }, [deliveryType]);

  /**
   * Effect for proactive re-fetching when the client-side buffer is running low.
   */
  useEffect(() => {
    // Condition to pre-fetch: buffer is below threshold, not currently loading, and API has more pages.
    if (
      stores.length > 0 &&
      buffer.length <= REFETCH_THRESHOLD &&
      !loading &&
      apiHasMore
    ) {
      const controller = new AbortController();
      setLoading(true);
      fetchStores(page, controller);

      return () => {
        controller.abort();
      };
    }
  }, [buffer.length, apiHasMore]);

  /**
   * Effect to set up the IntersectionObserver for infinite scrolling.
   */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // When the loader is intersecting (visible) and we're not loading...
        if (entries[0].isIntersecting && !loading) {
          if (buffer.length > ITEMS_PER_PAGE) {
            // Take from buffer
            setStores((prev) => [...prev, ...buffer.slice(0, ITEMS_PER_PAGE)]);
            setBuffer((prev) => prev.slice(ITEMS_PER_PAGE));
          }
        }
      },
      { threshold: 0.5 }
    );

    const currentRef = loaderRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [loaderRef.current, stores, loading, buffer]);
  
  /**
   * Effect to determine when to stop the infinite scroll.
   */
  useEffect(() => {
    if (!apiHasMore && buffer.length === 0) {
      setHasMore(false);
    }
  }, [apiHasMore, buffer]);

  if (loading && page === 0) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex items-center">
            <StoreCardSkeleton />
          </div>
        ))}
      </div>
    );
  }

  return noResultFound ? (
    <div className="min-h-screen">
      <NoResultFound />
    </div>
  ) : (
    <div className="flex flex-col gap-4 min-h-screen">
      {stores.map((store, index) => (
        <div key={`${store.id}-${index}`}>
          {index === differentLocationStoreIndex && (
            <div className="flex items-center mt-2 mb-4">
              <span className="mx-4 text-[20px] text-[#5F5F5F]">
                More From Other Locations
              </span>
              {/* <div className="mx-4 flex-grow border-t border-[#5F5F5F]"></div> */}
            </div>
          )}

          <StoreCard
            imageUrl={store.imageUrl}
            storeName={store.storeName}
            location={store.location}
            storeTypes={store.storeTypes}
            priceRanges={store.priceRanges}
            bestSelling={store.bestSelling}
            discount={store.discount}
            instagramFollowers={store.instagramFollowers}
            id={store.id}
          />
        </div>
      ))}
      {loading && page !== 0 && (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center">
              <StoreCardSkeleton />
            </div>
          ))}
        </div>
      )}
      {hasMore && <div ref={loaderRef} className="h-10" />}
    </div>
  );
}
