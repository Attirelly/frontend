"use client";
import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/axios";
import ProductCard from "./ProductCard";
import { useProductFilterStore } from "@/store/filterStore";
import { ProductCardType } from "@/types/ProductTypes";
import { useHeaderStore } from "@/store/listing_header_store";
import ProductGridSkeleton from "./skeleton/catalogue/ProductGridSkeleton";
import NoResultFound from "./NoResultFound";

/**
 * @interface ProductContainerProps
 * @description Defines the props for the ProductContainer component.
 */
interface ProductContainerProps {
  storeId?: string;
  colCount?: number;
}
/**
 * @const {number} ITEMS_PER_PAGE
 * @description The number of items to move from the buffer to the visible product list at a time when the user scrolls down.
 */
const ITEMS_PER_PAGE = 20;

/**
 * @const {number} BUFFER_SIZE
 * @description The total number of products to fetch from the backend in a single API call. A larger buffer reduces the number of API calls.
 */
const BUFFER_SIZE = 60;

/**
 * @const {number} REFETCH_THRESHOLD
 * @description When the number of items in the buffer drops to this level, a new API call is triggered to fetch the next page of products.
 * This ensures new data is fetched proactively before the user runs out of items to see. It's set to 20% of the buffer size.
 */
const REFETCH_THRESHOLD = Math.round(BUFFER_SIZE * 0.2); // Refetch when 80% of buffer is used

/**
 * A container that fetches and displays products in a grid with a buffered infinite scroll mechanism.
 *
 * This component is the core of the product listing page. It listens to filter and search states
 * from global Zustand stores, constructs and executes API requests, and renders the results.
 * It is highly optimized for a smooth user experience, even with large datasets.
 *
 * ### Buffered Infinite Scroll
 * To avoid jank and loading spinners while scrolling, this component uses a client-side buffer:
 * 1.  **API Fetch**: It fetches products from the API in large chunks (`BUFFER_SIZE`) and stores them in an invisible `buffer` state.
 * 2.  **UI Display**: A smaller, visible list of `products` is shown to the user.
 * 3.  **Infinite Scroll**: An `IntersectionObserver` watches a loader element at the bottom of the list. When the user scrolls this element into view, a chunk of items (`ITEMS_PER_PAGE`) is moved instantly from the `buffer` to the `products` list, creating a seamless scrolling effect.
 * 4.  **Proactive Refetch**: When the `buffer` depletes to a certain `REFETCH_THRESHOLD`, a background API call is automatically made to fetch the next chunk of products, ensuring the buffer is refilled before the user ever reaches the end of it.
 *
 * ### State Management
 * - It is a major consumer of the `useProductFilterStore` and `useHeaderStore`, reading all filter/search criteria to build its API requests.
 * - It is also a producer, as it calls actions like `setFacets`, `setResults`, and `setIsResultsLoading` to update the global state with the data it receives from the API.
 *
 * ### API Interaction
 * - The `fetchProducts` method handles all API communication.
 * - It uses an `AbortController` to cancel previous, outdated API requests whenever a filter changes. This is a crucial feature to prevent race conditions and ensure only the latest data is displayed.
 *
 *  * ### API Endpoint
 * **`GET /search/search_product`**
 * This endpoint is used to search and filter products.
 * **Query Parameters:**
 * - `query`: The main text search string.
 * - `page`: The page number for pagination.
 * - `limit`: The number of items to return (`BUFFER_SIZE`).
 * - `filters`: A string of `AND`-separated filter clauses (e.g., for price range).
 * - `facetFilters`: A URL-encoded JSON string of arrays for multi-select facet filtering.
 * - `activeFacet`: The name of the currently active facet to get precise counts.
 * - `sort_by`: The key to sort the results by (e.g., `price_asc`).
 * - `area` (optional): Filters results by a specific area.
 * - `city` (optional): Filters results by a specific city.
 *
 * @param {ProductContainerProps} props - The props for the component.
 * @returns {JSX.Element} A grid of products, a skeleton loader, or a "no results" message.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API | Intersection Observer API}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/AbortController | AbortController}
 * @see {@link https://docs.pmnd.rs/zustand/getting-started/introduction | Zustand Documentation}
 * @see {@link https://axios-http.com/docs/intro | Axios Documentation}
 */
export default function ProductContainer({
  storeId = "",
}: ProductContainerProps) {
  // --- State from Zustand Stores ---
  const {
    selectedFilters,
    setFacets,
    setResults,
    activeFacet,
    selectedPriceRange,
    priceBounds,
    setIsResultsLoading,
  } = useProductFilterStore();

  const { query, city, area, storeType, sortBy } = useHeaderStore();
  const [products, setProducts] = useState<ProductCardType[]>([]);
  const [buffer, setBuffer] = useState<ProductCardType[]>([]); // New buffer state
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [skipFilters, setSkipFilters] = useState(false);
  const [noResultFound, setNoResultFound] = useState(false);
  const [apiHasMore, setApiHasMore] = useState(true);

  /**
   * A helper function to build the facet filter string required by the backend API.
   * It transforms the `selectedFilters` object into a URL-encoded JSON string.
   * @param {Record<string, string[]>} facets - The selected filters from the Zustand store.
   * @param {string} [storeTypeString] - The currently selected store type.
   * @returns {string} An encoded string for the API request.
   */
  const buildFacetFilters = (
    facets: Record<string, string[]>,
    storeTypeString?: string
  ): string => {
    const facetFilters: string[][] = [];
    for (const key in facets) {
      if (facets[key].length > 0) {
        if (key === "price") continue;
        facetFilters.push(
          facets[key].map(
            (value) =>
              `${
                key === "size"
                  ? "variants.size_name"
                  : key === "colours"
                  ? "variants.color_name"
                  : key
              }:${value}`
          )
        );
      }
    }
    if (storeTypeString) {
      facetFilters.push([`store_types:${storeTypeString}`]);
    }
    return encodeURIComponent(JSON.stringify(facetFilters));
  };

  /**
   * Fetches a chunk of products from the API and populates the buffer.
   * @param {number} currentPage - The page number to fetch.
   * @param {AbortController} [controller] - An optional AbortController to cancel the request.
   */

  const fetchProducts = async (
    currentPage: number,
    controller?: AbortController
  ) => {
    const facetFilters = buildFacetFilters(
      selectedFilters,
      storeType?.store_type
    );

    try {
      let filterClauses: string[] = [];
      if (filters && !skipFilters) {
        filterClauses.push(filters);
      }

      let priceFilterString = "";
      if (selectedPriceRange) {
        const [min, max] = selectedPriceRange;
        if (min > priceBounds[0] || max < priceBounds[1]) {
          priceFilterString = `price > ${min} AND price < ${max}`;
        }
      }
      filterClauses.push(priceFilterString);
      setIsResultsLoading(true);

      const finalFilterString = filterClauses.join(" AND ");
      let searchUrl = `/search/search_product?query=${storeId} ${query}&page=${currentPage}&limit=${BUFFER_SIZE}&filters=${finalFilterString}&facetFilters=${facetFilters}&activeFacet=${activeFacet}&sort_by=${sortBy}`;

      // let searchUrl = `/search/search_product?query=${storeId} ${query}&page=${currentPage}&limit=${BUFFER_SIZE}&filters=${finalFilterString}&facetFilters=${facetFilters}&activeFacet=${activeFacet}&sort_by=${sortBy}&only_active=true`;

      if (area) {
        searchUrl += `&area=${area.name}`;
      }
      if (city) {
        searchUrl += `&city=${city.name}`;
      }
      const res = await api.get(
        searchUrl,
        controller ? { signal: controller.signal } : {}
      );

      const data = res.data;
      if (data.total_hits === 0 && currentPage == 0) {
        setNoResultFound(true);
        setApiHasMore(false);
        setHasMore(false);
        setLoading(false);
        setProducts([]);
        setBuffer([]);
        setResults(0);
        setIsResultsLoading(false);
        return;
      } else {
        setNoResultFound(false);
      }
      setResults(data.total_hits);
      setFacets(data.facets, activeFacet);

      const formattedProducts: ProductCardType[] = data.hits.map(
        (item: any) => {
          const price = item.price;
          const originalPrice = item.mrp || item.price;
          const desc = item.title;
          const discount =
            originalPrice > price
              ? Math.round(((originalPrice - price) / originalPrice) * 100)
              : 0;

          return {
            id: item.id,
            imageUrl: item.image || [],
            title: item.store_name || "Untitled Product",
            description: desc,
            price,
            originalPrice,
            discountPercentage: discount.toString(),
          };
        }
      );

      if (currentPage === 0) {
        setProducts(formattedProducts.slice(0, ITEMS_PER_PAGE));
        setBuffer(formattedProducts.slice(ITEMS_PER_PAGE));
      } else {
        setBuffer((prev) => [...prev, ...formattedProducts]);
      }

      if (currentPage >= data.total_pages - 1) {
        setApiHasMore(false);
      } else if (currentPage < data.total_pages - 1) {
        setPage((prev) => prev + 1);
      }
      setLoading(false);
      setIsResultsLoading(false);
    } catch (error: any) {
      if (error.name !== "CanceledError" && error.name !== "AbortError") {
        console.error("Error fetching products:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    setPage(0);
    setProducts([]);
    setBuffer([]);
    setHasMore(true);
    setApiHasMore(true);
    fetchProducts(0, controller);
    return () => {
      controller.abort();
    };
  }, [selectedFilters, filters, query, storeType, sortBy, city, area]);

  /**
   * Fetch more products when the user scrolls down
   * It will trigger when the user reaches the 80% of the bottom of the page.
   */
  useEffect(() => {
    if (
      page > 0 &&
      buffer.length <= REFETCH_THRESHOLD &&
      !loading &&
      apiHasMore
    ) {
      const controller = new AbortController();
      setLoading(true);
      fetchProducts(page, controller);
      return () => {
        controller.abort();
      };
    }
  }, [buffer.length, apiHasMore]);

  useEffect(() => {
    const currentRef = loaderRef.current;

    // If there's no element to observe, or if we are in a loading state, we do nothing.
    if (!currentRef || loading) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          if (buffer.length > 0) {
            const nextItems = buffer.slice(0, ITEMS_PER_PAGE);
            setProducts((prev) => [...prev, ...nextItems]);
            setBuffer((prev) => prev.slice(ITEMS_PER_PAGE));
          }
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(currentRef);

    // The cleanup function uses the same `currentRef` variable
    return () => {
      observer.unobserve(currentRef);
    };
  }, [hasMore, buffer, loading]);

  useEffect(() => {
    if (!apiHasMore && buffer.length === 0) {
      setHasMore(false);
    }
  }, [apiHasMore, buffer]);

  // Render the "No Result Found" component if the API returns no hits.
  return noResultFound ? (
    <NoResultFound />
  ) : (
    <>
      {/* Show an initial skeleton loader on the first fetch. */}
      {loading && products.length === 0 ? (
        <ProductGridSkeleton />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
          {products.map((product, index) => (
            <ProductCard key={`${product.id}`} {...product} />
          ))}
        </div>
      )}
      {/* This loader element is the trigger for the IntersectionObserver. */}
      {hasMore && (
        <div ref={loaderRef} className="h-12 flex justify-center items-center">
          {loading && products.length > 0 && (
            <span className="text-gray-500 text-sm">
              Loading more products...
            </span>
          )}
        </div>
      )}
    </>
  );
}
