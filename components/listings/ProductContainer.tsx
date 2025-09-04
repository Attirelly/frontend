"use client";
import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/axios";
import ProductCard from "./ProductCard";
import { useProductFilterStore } from "@/store/filterStore";
import { ProductCardType } from "@/types/ProductTypes";
import { useHeaderStore } from "@/store/listing_header_store";
import ProductGridSkeleton from "./skeleton/catalogue/ProductGridSkeleton";
import NoResultFound from "./NoResultFound";

interface ProductContainerProps {
  storeId?: string;
  colCount?: number;
}

const ITEMS_PER_PAGE = 20;
const BUFFER_SIZE = 60; // Fetch 60 products at a time from the backend
const REFETCH_THRESHOLD = Math.round(BUFFER_SIZE * 0.2); // Refetch when 80% of buffer is used

export default function ProductContainer({
  storeId = "",
}: ProductContainerProps) {
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
    return encodeURIComponent(JSON.stringify(filters));
  };

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
      // setIsResultsLoading(false);
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

  return noResultFound ? (
    <NoResultFound />
  ) : (
    <>
      {loading && products.length === 0 ? (
        <ProductGridSkeleton />
      ) : (
        <div
         className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-2"
        >
          {products.map((product, index) => (
            <ProductCard key={`${product.id}`} {...product} />
          ))}
        </div>
      )}
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
