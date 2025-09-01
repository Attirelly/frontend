"use client";
import { api } from "@/lib/axios";
import StoreCard from "./StoreCard";
import { useHeaderStore } from "@/store/listing_header_store";
import { useEffect, useRef, useState } from "react";
import { BrandType, City, StoreCardType } from "@/types/SellerTypes";
import { useFilterStore } from "@/store/filterStore";
import { event } from "@/lib/gtag";
import StoreCardSkeleton from "./skeleton/StoreCardSkeleton";
import NoResultFound from "./NoResultFound";
import { log } from "console";

const ITEMS_PER_PAGE = 10;
const BUFFER_SIZE = 60; // Fetch 60 stores at a time from the backend
const REFETCH_THRESHOLD = Math.round(BUFFER_SIZE * 0.2);

export default function StoreContainerPage() {
  const { facets, setFacets, selectedFilters, activeFacet } = useFilterStore();
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
  const [differentLocationStoreIndex, setDifferentLocationStoreIndex] =
    useState<number>(-1);

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

    // // 4. Process the city filter
    // if (city && city.name) {
    //   const cityFilter = `city='${city.name}'`;
    //   filterClauses.push(cityFilter);
    // }

    // // 5. Process the area filter (CORRECTION: use .push(), not .findLastIndex())
    // if (area && area.name) {
    //   const areaFilter = `area='${area.name}'`;
    //   filterClauses.push(areaFilter); // Use .push() to add the filter
    // }

    // 6. Combine all clauses into a single string
    const finalFilterString = filterClauses.join(" AND ");

    const facetFilters = buildFacetFilters(selectedFilters, storeType);

    let searchUrl = `/search/search_store?query=${query}&page=${currentPage}&limit=${BUFFER_SIZE}&filters=${finalFilterString}&facetFilters=${facetFilters}`;

    if (area) {
      searchUrl += `&area=${area.name}`;
    }
    if (city) {
      searchUrl += `&city=${city.name}`;
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

      let firstDifferentIndex = -1;

      if (differentLocationStoreIndex === -1) {
        for (let index = 0; index < data.hits.length; index++) {
          const sc = data.hits[index];
          const absoluteIndex = currentPage * BUFFER_SIZE + index;

          if (
            (city &&
              sc.city &&
              city.name.toLowerCase() !== sc.city.toLowerCase()) ||
            (area &&
              sc.area &&
              area.name.toLowerCase() !== sc.area.toLowerCase())
          ) {
            setDifferentLocationStoreIndex(absoluteIndex);
            break; // ✅ stop at the first mismatch
          }
        }
      }

      if (differentLocationStoreIndex === -1 && firstDifferentIndex !== -1) {
        setDifferentLocationStoreIndex(firstDifferentIndex);
      }

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

  // Trigger initial fetch or re-fetch on filter/search changes
  useEffect(() => {
    const controller = new AbortController();
    setPage(0);
    setStores([]);
    setBuffer([]);
    setApiHasMore(true);
    fetchStores(0, controller);
    return () => {
      controller.abort();
    };
  }, [query, storeType, selectedFilters, city, area, filters]);

  // Handle delivery type filter
  useEffect(() => {
    if (deliveryType == "In Store Shopping") {
      setFilters("is_online:'false' OR is_both:'true'");
    } else if (deliveryType == "Online Shopping") {
      setFilters("is_online:'true' OR is_both:'true'");
    } else {
      setFilters("");
    }
  }, [deliveryType]);

  // retrigger api when 80% of buffer is reached
  useEffect(() => {
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

  // Logic for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
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
