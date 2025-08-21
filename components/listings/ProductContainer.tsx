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

const ITEMS_PER_PAGE = 12;
const BUFFER_SIZE = 60; // Fetch 60 products at a time from the backend
const REFETCH_THRESHOLD = Math.round(BUFFER_SIZE * 0.2); // Refetch when 80% of buffer is used

export default function ProductContainer({
  storeId = "",
  colCount = 4,
}: ProductContainerProps) {
  const {
    selectedFilters,
    setFacets,
    setResults,
    activeFacet,
    selectedPriceRange,
    priceBounds,
  } = useProductFilterStore();

  const { query, city, area, storeTypeString, sortBy } = useHeaderStore();
  const [products, setProducts] = useState<ProductCardType[]>([]);
  const [buffer, setBuffer] = useState<ProductCardType[]>([]); // New buffer state
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const prevStoreTypeRef = useRef<string>("");
  const isObserverTriggered = useRef(false);
  const [skipFilters, setSkipFilters] = useState(false);
  const [noResultFound, setNoResultFound] = useState(false);
  const [apiHasMore, setApiHasMore] = useState(true);

  const buildFacetFilters = (
    facets: Record<string, string[]>,
    storeTypeString?: string
  ): string => {
    const filters: string[][] = [];
    for (const key in facets) {
      if (facets[key].length > 0) {
        if (key === "price") continue;
        filters.push(
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
      filters.push([`store_types:${storeTypeString}`]);
    }
    if (city) {
      filters.push([`city:${city.name}`]);
    }
    if (area) {
      filters.push([`area:${area.name}`]);
    }

    return encodeURIComponent(JSON.stringify(filters));
  };

  const fetchProducts = async (
    currentPage: number,
    controller?: AbortController
  ) => {
    const facetFilters = buildFacetFilters(selectedFilters, storeTypeString);

    try {
      let filterParam = skipFilters ? "" : filters;

      let priceFilterString = "";
      if (selectedPriceRange) {
        const [min, max] = selectedPriceRange;
        // Only add the filter if it's not the default full range.
        if (min > priceBounds[0] || max < priceBounds[1]) {
          priceFilterString = `price > ${min} AND price < ${max}`;
        }
      }
      filterParam += priceFilterString;

      let encodedFilterParam = encodeURIComponent(filterParam);

      // console.log("ajsdf sdjf ",currentPage, BUFFER_SIZE, controller.signal);
      // if(currentPage === 1 )return;
      const res = await api.get(
        `/search/search_product?query=${storeId} ${query}&page=${currentPage}&limit=${BUFFER_SIZE}&filters=${encodedFilterParam}&facetFilters=${facetFilters}&activeFacet=${activeFacet}&sort_by=${sortBy}`,
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
    } catch (error: any) {
      if (error.name !== "CanceledError" && error.name !== "AbortError") {
        console.error("Error fetching products:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  //   useEffect(() => {
  // fetchProducts(0);
  //   }, []);
  useEffect(() => {
    console.log(
      "changes",
      selectedFilters,
      filters,
      query,
      storeTypeString,
      sortBy,
      city,
      area
    );
    const controller = new AbortController();
    setPage(0);
    setProducts([]);
    setBuffer([]);
    setHasMore(true);
    fetchProducts(0, controller);
    return () => {
      controller.abort();
    };
  }, [selectedFilters, filters, query, storeTypeString, sortBy, city, area]);

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
      { threshold: 0.5 }
    );
    const currentRef = loaderRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [buffer, loading]);

  useEffect(() => {

    const fillViewport = () => {
      if (loaderRef.current && buffer.length > 0 && !loading) {
        const { top } = loaderRef.current.getBoundingClientRect();
        const isLoaderVisible = top <= window.innerHeight;

        // If loader is visible and we have items in buffer, load them
        if (isLoaderVisible) {
          const nextItems = buffer.slice(0, ITEMS_PER_PAGE);
          setProducts((prev) => [...prev, ...nextItems]);
          setBuffer((prev) => prev.slice(ITEMS_PER_PAGE));
        }
      }
    };
    fillViewport();
  }, [products, buffer, loading]);

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
          className={`grid grid-cols-1 sm:grid-cols-2 ${
            colCount === 4 ? "md:grid-cols-4" : "md:grid-cols-3"
          } gap-4 p-2`}
        >
          {products.map((product, index) => (
            <ProductCard key={`${product.id}`} {...product} />
          ))}
        </div>
      )}
      {hasMore && (
        <div ref={loaderRef} className="h-12 flex justify-center items-center">
          {loading && products.length > 0 ? (
            <span className="text-gray-500 text-sm">
              Loading more products...
            </span>
          ) : null}
        </div>
      )}
    </>
  );
}
