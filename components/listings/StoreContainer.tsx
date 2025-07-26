"use client";


import { api } from "@/lib/axios";
import StoreCard from "./StoreCard";
import { useHeaderStore } from "@/store/listing_header_store";
import { useEffect, useRef, useState } from "react";
import { BrandType, City, StoreCardType } from "@/types/SellerTypes";
import { useFilterStore } from "@/store/filterStore";
import { event } from "@/lib/gtag";
import StoreCardSkeleton from "./skeleton/StoreCardSkeleton";

export default function StoreContainerPage() {
  const { facets, setFacets, getSelectedFilters, selectedFilters , activeFacet} =
    useFilterStore();
  const { city, query, storeType, deliveryType } = useHeaderStore();

  const [stores, setStores] = useState<StoreCardType[]>([]);
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const [scrollMilestones, setScrollMilestones] = useState<number[]>([]);

  const buildFacetFilters = (
  facets: Record<string, string[]>,
  city?: City | null,
  storeType?: BrandType | null
): string => {
  const filters: string[][] = [];

  // selected filters (e.g. gender, price range, category)
  for (const key in facets) {
    if (facets[key].length > 0 && key.toLowerCase() !== 'discount') {
      filters.push(facets[key].map((value) => `${key}:${value}`));
    }
  }

  // city facet
  if (city) {
    filters.push([`city:${city.name}`]);
  }

  // storeType facet
  if (storeType) {
    filters.push([`store_types:${storeType.store_type}`]);
  }

  
  return encodeURIComponent(JSON.stringify(filters));
};

  const fetchStores = async (currentPage: number) => {
    setLoading(true);
    
    // adding discount to filter 
    let discountArray = selectedFilters['discount'] || []; 
    let discountStr = discountArray.map((val)=>`discount >= ${val.slice(0,2)}`).join(' OR ') ; 
    let tempFilterStr = ""
    if(filters.length > 0 && discountStr.length > 0 ){
      tempFilterStr = filters + " AND " + discountStr
    }
    else if(filters.length > 0 ){
      tempFilterStr = filters 
    }
    else{
      tempFilterStr = discountStr
    }
     

    const facetFilters = buildFacetFilters(selectedFilters, city, storeType);
    
    const res = await api.get(
      `/search/search_store?query=${query}&page=${currentPage}&limit=10&filters=${tempFilterStr}&facetFilters=${facetFilters}`
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
    
    // setFacets(data.facets);

    // if (currentPage === 0 && Object.keys(facets).length === 0) {
    //   setFacets(data.facets);
    // }

    setFacets(data.facets , activeFacet) ; 
    // if (currentPage === 0) {
    //   setFacets(data.facets);
    // }

    const storeCards: StoreCardType[] = data.hits.map((sc: any) => ({
      id: sc.id,
      imageUrl: sc.profile_image || "/OnboardingSections/qr.png",
      storeName: sc.store_name,
      location: `${sc.area}, ${sc.city}`,
      storeTypes: sc.store_types || [],
      priceRanges: [
        ...new Set(sc.store_type_price_range
          .filter(item=> item.store_type === storeType?.store_type)
          .map((item) => item.price_range)),
      ],
      bestSelling: sc.categories,
      discount: sc.discount,
      instagramFollowers: "220k",
    }));

    if (currentPage === 0) {
      setStores(storeCards);
    } else {
      setStores((prev) => [...prev, ...storeCards]);
    }

    setTotalPages(data.total_pages || 1);

    if (currentPage >= data.total_pages - 1) {
      setHasMore(false);
    }

    setLoading(false);
  };

  // Trigger fetch on filter/search changes
  useEffect(() => {
    setPage(0);
    setHasMore(true);
    setStores([]);
    fetchStores(0);
  }, [query, storeType, selectedFilters, city, filters]);

  useEffect(() => {
    if (deliveryType == "In Store Shopping") {
      setFilters("is_online:'false' OR is_both:'true'");
    } else if (deliveryType == "Online Shopping") {
      setFilters("is_online:'true' OR is_both:'true'");
    } else {
      setFilters("");
    }
  }, [deliveryType]);

  // Trigger fetch on scroll
  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    const currentLoader = loaderRef.current;
    observer.observe(currentLoader);

    return () => {
      observer.unobserve(currentLoader);
    };
  }, [loaderRef, hasMore, loading]);

  // Fetch next page when page changes (except page=0 which is handled above)

  useEffect(() => {
    if (page !== 0) {
      
      fetchStores(page);
    }
  }, [page]);

  // Track milestones
  useEffect(() => {
    if (totalPages == 0) return;
    const percent = Math.round(((page + 1) / totalPages) * 100); // +1 because page is 0-based
    const thresholds = [25, 50, 75, 100];

    thresholds.forEach((threshold) => {
      if (percent >= threshold && !scrollMilestones.includes(threshold)) {
        
        setScrollMilestones((prev) => [...prev, threshold]);
        event({
          action: "page_scroll",
          params: {
            scroll_percentage: threshold,
          },
        });
      }
    });
  }, [page, totalPages, scrollMilestones]);

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
  return (
    <div className="flex flex-col gap-4">
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
      {hasMore && (
      <div ref={loaderRef} className="h-10" />
    )}
    </div>
  );
}
