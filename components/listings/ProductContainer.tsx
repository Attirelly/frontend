"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/axios";
import ProductCard from "./ProductCard";
import { useProductFilterStore } from "@/store/filterStore";
import { ProductCardType } from "@/types/ProductTypes";
import { useHeaderStore } from "@/store/listing_header_store";
import ProductGridSkeleton from "./skeleton/catalogue/ProductGridSkeleton";

interface ProductContainerProps {
  storeId?: string;
  colCount?: number;
}

export default function ProductContainer({
  storeId = "",
  colCount = 3,
}: ProductContainerProps) {
  const {
    priceBounds,
    selectedFilters,
    setFacets,
    facets,
    setPriceRange,
    priceRange,
    setPriceBounds,
    setResults,
    facetInit,
    setFacetInit,
    category,
    activeFacet,
  } = useProductFilterStore();

  const { query, storeTypeString, priceRangeType, sortBy } = useHeaderStore();
  const [products, setProducts] = useState<ProductCardType[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const prevStoreTypeRef = useRef<string>("");
  const [skipFilters, setSkipFilters] = useState(false);

  const buildFacetFilters = (
    facets: Record<string, string[]>,
    category?: string,
    storeTypeString?: string
  ): string => {
    const filters: string[][] = [];
    for (const key in facets) {
      if (facets[key].length > 0) {
        filters.push(
          facets[key].map(
            (value) =>
              `${
                key === "prices"
                  ? "variants.price"
                  : key === "size"
                  ? "variants.size_name"
                  : key === "colours"
                  ? "variants.color_name"
                  : key
              }:${value}`
          )
        );
      }
    }
    if (category) {
      filters.push([`categories:${category}`]);
    }
    if (storeTypeString) {
      filters.push([`store_types:${storeTypeString}`]);
    }

    return encodeURIComponent(JSON.stringify(filters));
  };

  const fetchProducts = async (currentPage: number) => {
    setLoading(true);
    const facetFilters = buildFacetFilters(
      selectedFilters,
      category,
      storeTypeString
    );
    console.log(facetFilters);
    try {
      // setIsFacetLoading(true);
      const filterParam = skipFilters ? "" : filters;
      console.log("activefacets", activeFacet);
      const res = await api.get(
        `/search/search_product?query=${storeId} ${query}&page=${currentPage}&limit=12&filters=${filterParam}&facetFilters=${facetFilters}&activeFacet=${activeFacet}&sort_by=${sortBy}`
      );

      const data = res.data;
      console.log("algolia_data", data);
      setResults(data.hits.length);

      const formattedProducts: ProductCardType[] = data.hits.map(
        (item: any) => {
          const price = item.price || 500;
          const originalPrice = item.mrp || item.price || 500;
          const desc = colCount === 4 ? item.store_name : "";
          const discount =
            originalPrice > price
              ? Math.round(((originalPrice - price) / originalPrice) * 100)
              : 0;

          return {
            id: item.id,
            imageUrl: item.image || [],
            title: item.title || "Untitled Product",
            description: desc,
            price,
            originalPrice,
            discountPercentage: discount.toString(),
          };
        }
      );

      if (data.facets?.prices) {
        const priceKeys = Object.keys(data.facets.prices)
          .map(Number)
          .filter((n) => !isNaN(n));
        if (priceKeys.length > 0) {
          const min = Math.min(...priceKeys);
          const max = Math.max(...priceKeys);

          if (priceBounds[0] > min || priceBounds[1] < max) {
            setPriceBounds([
              Math.min(priceBounds[0], min),
              Math.max(priceBounds[1], max),
            ]);
          }
          if (priceRange[0] === 0 && priceRange[1] === 0) {
            setPriceRange([min, max]);
          }
        }
      }
      // if (Object.keys(facets).length === 0) {
        setFacets(data.facets);
      // }
      // if (!facetInit) {
      //   setFacets(data.facets);
      //   setFacetInit(true);
      // }
      // setIsFacetLoading(false);

      if (currentPage === 0) {
        setProducts(formattedProducts);
      } else {
        setProducts((prev) => [...prev, ...formattedProducts]);
      }

      setTotalPages(data.total_pages || 1);
      setHasMore(currentPage < (data.total_pages || 1) - 1);

      if (skipFilters) setSkipFilters(false);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const [min, max] = priceRange;
    const newFilter = `price >= ${min} AND price <= ${max}`;
    if (filters !== newFilter) {
      setFilters(newFilter);
    }
  }, [priceRange]);

  useEffect(() => {
    if (prevStoreTypeRef.current !== storeTypeString) {
      setSkipFilters(true);
      prevStoreTypeRef.current = storeTypeString;
    }
  }, [storeTypeString]);

useEffect(() => {
  const debounce = setTimeout(() => {
    setPage(0);
    fetchProducts(0);
  }, 100);

  return () => clearTimeout(debounce);
}, [selectedFilters, priceRange, query, storeTypeString, sortBy, category]);

  useEffect(() => {
    if (page !== 0) fetchProducts(page);
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.5 }
    );
    const currentRef = loaderRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [loaderRef.current, hasMore, loading]);

  return (
    <>
      {loading && products.length === 0 ? (
        <ProductGridSkeleton />
      ) : (
        // <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${colCount} gap-4 p-2`}>
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
