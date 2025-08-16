// "use client";
// import { useEffect, useRef, useState } from "react";
// import { api } from "@/lib/axios";
// import ProductCard from "./ProductCard";
// import { useProductFilterStore } from "@/store/filterStore";
// import { ProductCardType } from "@/types/ProductTypes";
// import { useHeaderStore } from "@/store/listing_header_store";
// import ProductGridSkeleton from "./skeleton/catalogue/ProductGridSkeleton";
// import NoResultFound from "./NoResultFound";

// interface ProductContainerProps {
//   storeId?: string;
//   colCount?: number;
// }

// export default function ProductContainer({
//   storeId = "",
//   colCount = 4,
// }: ProductContainerProps) {
//   const {
//     priceBounds,
//     selectedFilters,
//     setFacets,
//     facets,
//     setPriceRange,
//     priceRange,
//     setResults,
//     facetInit,
//     setFacetInit,
//     category,
//     activeFacet,
//   } = useProductFilterStore();

//   const { query, city, storeTypeString, priceRangeType, sortBy } =
//     useHeaderStore();
//   const [products, setProducts] = useState<ProductCardType[]>([]);
//   const [page, setPage] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);
//   const [filters, setFilters] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const loaderRef = useRef<HTMLDivElement>(null);
//   const prevStoreTypeRef = useRef<string>("");
//   const [skipFilters, setSkipFilters] = useState(false);
//   const [noResultFound, setNoResultFound] = useState(false);

//   const buildFacetFilters = (
//     facets: Record<string, string[]>,
//     category?: string,
//     storeTypeString?: string
//   ): string => {
//     const filters: string[][] = [];
//     for (const key in facets) {
//       if (facets[key].length > 0) {
//         filters.push(
//           facets[key].map(
//             (value) =>
//               `${
//                 key === "prices"
//                   ? "variants.price"
//                   : key === "size"
//                   ? "variants.size_name"
//                   : key === "colours"
//                   ? "variants.color_name"
//                   : key
//               }:${value}`
//           )
//         );
//       }
//     }
//     if (category) {
//       filters.push([`categories:${category}`]);
//     }
//     if (storeTypeString) {
//       filters.push([`store_types:${storeTypeString}`]);
//     }
//     if (city) {
//       filters.push([`city:${city.name}`]);
//     }

//     return encodeURIComponent(JSON.stringify(filters));
//   };

//   const fetchProducts = async (currentPage: number , controller: AbortController) => {
//     setLoading(true);
//     const facetFilters = buildFacetFilters(
//       selectedFilters,
//       category,
//       storeTypeString
//     );

//     try {
//       // setIsFacetLoading(true);
//       const filterParam = skipFilters ? "" : filters;

//       const res = await api.get(
//         `/search/search_product?query=${storeId} ${query}&page=${currentPage}&limit=12&filters=${filterParam}&facetFilters=${facetFilters}&activeFacet=${activeFacet}&sort_by=${sortBy}`,
//         {signal:controller.signal}
//       );

//       const data = res.data;
//       if (data.hits.length === 0 && currentPage === 0) {
//       setNoResultFound(true);
//       setLoading(false);
//       return;
//     } else {
//       setNoResultFound(false);
//     }

//       setResults(data.hits.length);

//       const formattedProducts: ProductCardType[] = data.hits.map(
//         (item: any) => {
//           const price = item.price || 500;
//           const originalPrice = item.mrp || item.price || 500;
//           const desc = item.title;
//           const discount =
//             originalPrice > price
//               ? Math.round(((originalPrice - price) / originalPrice) * 100)
//               : 0;

//           return {
//             id: item.id,
//             imageUrl: item.image || [],
//             title: item.store_name || "Untitled Product",
//             description: desc,
//             price,
//             originalPrice,
//             discountPercentage: discount.toString(),
//           };
//         }
//       );

//       // if (data.facets?.prices) {
//       //   const priceKeys = Object.keys(data.facets.prices)
//       //     .map(Number)
//       //     .filter((n) => !isNaN(n));
//       //   if (priceKeys.length > 0) {
//       //     const min = Math.min(...priceKeys);
//       //     const max = Math.max(...priceKeys);

//       //     if (priceBounds[0] > min || priceBounds[1] < max) {
//       //       setPriceBounds([
//       //         Math.min(priceBounds[0], min),
//       //         Math.max(priceBounds[1], max),
//       //       ]);
//       //     }
//       //     if (priceRange[0] === 0 && priceRange[1] === 0) {
//       //       setPriceRange([min, max]);
//       //     }
//       //   }
//       // }
//       // if (Object.keys(facets).length === 0) {
//       setFacets(data.facets, activeFacet);
//       // }
//       // if (!facetInit) {
//       //   setFacets(data.facets);
//       //   setFacetInit(true);
//       // }
//       // setIsFacetLoading(false);

//       if (currentPage === 0) {
//         setProducts(formattedProducts);
//       } else {
//         setProducts((prev) => [...prev, ...formattedProducts]);
//       }

//       setTotalPages(data.total_pages || 1);
//       setHasMore(currentPage < (data.total_pages || 1) - 1);

//       if (skipFilters) setSkipFilters(false);
//     } catch (error:any) {
//       if (error.name !== "CanceledError" && error.name !== "AbortError") {
//         console.error("Error fetching products:", error);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const [min, max] = priceRange;

//     const newFilter =
//       max >= 100000 ? `price >= ${min}` : `price >= ${min} AND price <= ${max}`;
//     if (filters !== newFilter) {
//       setFilters(newFilter);
//     }
//   }, [priceRange]);

//   useEffect(() => {
//     if (prevStoreTypeRef.current !== storeTypeString) {
//       setSkipFilters(true);
//       prevStoreTypeRef.current = storeTypeString;
//     }
//   }, [storeTypeString]);

//   useEffect(() => {
//     setPage(0);
//     const controller = new AbortController();
//     fetchProducts(0, controller);
//     return () => {
//       controller.abort();
//     };
//   }, [
//     selectedFilters,
//     filters,
//     query,
//     storeTypeString,
//     sortBy,
//     category,
//     city,
//   ]);

//   useEffect(() => {
//     if (page !== 0) {
//       const controller = new AbortController();
//       fetchProducts(page, controller);
//       return () => controller.abort();
//     }
//   }, [page]);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting && hasMore && !loading) {
//           setPage((prev) => prev + 1);
//         }
//       },
//       { threshold: 0.5 }
//     );
//     const currentRef = loaderRef.current;
//     if (currentRef) observer.observe(currentRef);
//     return () => {
//       if (currentRef) observer.unobserve(currentRef);
//     };
//   }, [loaderRef.current, hasMore, loading]);

//   return noResultFound ? (
//     <NoResultFound />
//   ) : (
//     <>
//       {loading && products.length === 0 ? (
//         <ProductGridSkeleton />
//       ) : (
//         // <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${colCount} gap-4 p-2`}>
//         <div
//           className={`grid grid-cols-1 sm:grid-cols-2 ${
//             colCount === 4 ? "md:grid-cols-4" : "md:grid-cols-3"
//           } gap-4 p-2`}
//         >
//           {products.map((product, index) => (
//             <ProductCard key={`${product.id}`} {...product} />
//           ))}
//         </div>
//       )}
//       {hasMore && (
//         <div ref={loaderRef} className="h-12 flex justify-center items-center">
//           {loading && products.length > 0 ? (
//             <span className="text-gray-500 text-sm">
//               Loading more products...
//             </span>
//           ) : null}
//         </div>
//       )}
//     </>
//   );
// }

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
    category,
    activeFacet,
    priceRange,
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
  const [skipFilters, setSkipFilters] = useState(false);
  const [noResultFound, setNoResultFound] = useState(false);

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
      filters.push([`primary_category:${category}`]);
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
    controller: AbortController
  ) => {
    setLoading(true);
    const facetFilters = buildFacetFilters(
      selectedFilters,
      category,
      storeTypeString
    );

    try {
      const filterParam = skipFilters ? "" : filters;

      const res = await api.get(
        `/search/search_product?query=${storeId} ${query}&page=${currentPage}&limit=${BUFFER_SIZE}&filters=${filterParam}&facetFilters=${facetFilters}&activeFacet=${activeFacet}&sort_by=${sortBy}`,
        { signal: controller.signal }
      );

      const data = res.data;
      if (data.hits.length === 0 && currentPage === 0) {
        setNoResultFound(true);
        setLoading(false);
        setProducts([]);
        setBuffer([]);
        setHasMore(false);
        return;
      } else {
        setNoResultFound(false);
      }

      setResults(data.hits.length);
      setFacets(data.facets, activeFacet);

      const formattedProducts: ProductCardType[] = data.hits.map(
        (item: any) => {
          const price = item.price || 500;
          const originalPrice = item.mrp || item.price || 500;
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

      // Check if we've fetched all available pages
      if (currentPage >= data.total_pages - 1) {
        setHasMore(false);
      }

      if (skipFilters) setSkipFilters(false);
    } catch (error: any) {
      if (error.name !== "CanceledError" && error.name !== "AbortError") {
        console.error("Error fetching products:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Trigger re-fetch on filter changes
  useEffect(() => {
    const [min, max] = priceRange; // Assuming priceRange is not being used to filter, so setting a default
    // If you need to use priceRange, the logic here should be updated.
    const newFilter =
      max >= 100000 ? `price >= ${min}` : `price >= ${min} AND price <= ${max}`;
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
    const controller = new AbortController();
    setPage(0);
    setProducts([]);
    setBuffer([]);
    setHasMore(true);
    fetchProducts(0, controller);
    return () => {
      controller.abort();
    };
  }, [
    selectedFilters,
    filters,
    query,
    storeTypeString,
    sortBy,
    category,
    city,
    area,
  ]);

  useEffect(() => {
    if (buffer.length <= REFETCH_THRESHOLD && !loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [buffer, loading, hasMore]);

  useEffect(() => {
    if (page !== 0) {
      const controller = new AbortController();
      fetchProducts(page, controller);
      return () => controller.abort();
    }
  }, [page]);

  // Existing scroll observer logic (now only consumes from buffer)
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
  }, [loaderRef.current, loading, buffer]);

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
