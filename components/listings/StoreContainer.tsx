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

  const buildFacetFilters = (
    facets: Record<string, string[]>,
    city?: City | null,
    storeType?: BrandType | null
  ): string => {
    const filters: string[][] = [];
    for (const key in facets) {
      if (facets[key].length > 0 && key.toLowerCase() !== "discount") {
        filters.push(facets[key].map((value) => `${key}:${value}`));
      }
    }
    if (city) {
      filters.push([`city:${city.name}`]);
    }
    if (area) {
      filters.push([`area:${area.name}`]);
    }
    if (storeType) {
      filters.push([`store_types:${storeType.store_type}`]);
    }
    return encodeURIComponent(JSON.stringify(filters));
  };

  const fetchStores = async (
    currentPage: number,
    controller?: AbortController
  ) => {
    setLoading(true);

    let discountArray = selectedFilters["discount"] || [];
    let discountStr = discountArray
      .map((val) => `discount >= ${val.slice(0, 2)}`)
      .join(" OR ");
    let tempFilterStr = "";
    if (filters.length > 0 && discountStr.length > 0) {
      tempFilterStr = filters + " AND " + discountStr;
    } else if (filters.length > 0) {
      tempFilterStr = filters;
    } else {
      tempFilterStr = discountStr;
    }

    const facetFilters = buildFacetFilters(selectedFilters, city, storeType);

    try {
      const res = await api.get(
        `/search/search_store?query=${query}&page=${currentPage}&limit=${BUFFER_SIZE}&filters=${tempFilterStr}&facetFilters=${facetFilters}&activeFacet=${activeFacet}`,
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

      const storeCards: StoreCardType[] = data.hits.map((sc: any) => ({
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
      }));

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
    setHasMore(true);
    setStores([]);
    setBuffer([]);
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
  }, [loading, buffer]);

  useEffect(() => {
    const fillViewport = () => {
      if (loaderRef.current && buffer.length > 0 && !loading) {
        const { top } = loaderRef.current.getBoundingClientRect();
        const isLoaderVisible = top <= window.innerHeight;

        // If loader is visible and we have items in buffer, load them
        if (isLoaderVisible) {
          const nextItems = buffer.slice(0, ITEMS_PER_PAGE);
          setStores((prev) => [...prev, ...nextItems]);
          setBuffer((prev) => prev.slice(ITEMS_PER_PAGE));
        }
      }
    };
    fillViewport();
  }, [stores, buffer, loading]);


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
        <StoreCard
          key={`${store.id}-${index}`}
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
