import { api } from "@/lib/axios";
import StoreCard from "./StoreCard";
import { useHeaderStore } from "@/store/listing_header_store";
import { useEffect, useState } from "react";
import { StoreCardType } from "@/types/SellerTypes";
import { toast } from "sonner";

import { useFilterStore } from "@/store/filterStore";

export default function StoreContainerPage() {
  const { facets, setFacets, getSelectedFilters, selectedFilters } =
    useFilterStore();
  const { city, query, storeType } = useHeaderStore();
  const [stores, setStores] = useState<StoreCardType[]>([]);

  const buildFacetFilters = (facets: Record<string, string[]>): string => {
    const filters: string[][] = [];

    for (const key in facets) {
      if (facets[key].length > 0) {
        filters.push(facets[key].map((value) => `${key}:${value}`));
      }
    }

    console.log(filters);
    const encoded = encodeURIComponent(JSON.stringify(filters));
    return encoded;
  };
  useEffect(() => {
    console.log(city, query, storeType);
    const fetchStores = async () => {

      const algoia_facets = buildFacetFilters(selectedFilters) ;   
      
      const res = await api.get(`/search/search_store?query=${query}&page=0&limit=20&facetFilters=${algoia_facets}`);
      console.log("fasfdasdasf", res.data)



      const data = res.data;
      // apply check to only call one time
      if (Object.keys(facets).length === 0) {
        setFacets(res.data.facets);
      }
      console.log("listing data", data);

      const storeCards: StoreCardType[] = data.hits.map((sc: any) => ({
        id: sc.id,
        imageUrl: sc.profile_image || "/OnboardingSections/qr.png",
        storeName: sc.store_name,
        location: `${sc.area}, ${sc.city}`,
        storeTypes: sc.store_types || [],
        priceRanges: ["Affordable", "Luxury"],
        bestSelling: ["Tshirt", "Shoes"],
        discount: 15,
        instagramFollowers: "220k",
      }));
      console.log(data.hits);
      console.log(storeCards);
      setStores(storeCards);
    };

    fetchStores();
  }, [query, storeType, selectedFilters]);
  return (
    // <div className="grid lg:grid-cols-1 sm:grid-cols-2  gap-4">
    <div className="flex gap-2 flex-row justify-around">
      <div className="flex flex-col gap 4">
        {stores.map((store, index) => (
          <StoreCard
            key={store.id}
            imageUrl={store.imageUrl}
            storeName={store.storeName}
            location={store.location}
            storeTypes={store.storeTypes}
            priceRanges={store.priceRanges}
            bestSelling={store.bestSelling}
            discount={store.discount}
            instagramFollowers={store.instagramFollowers}
          />
        ))}
      </div>
    </div>
  );

    useEffect(() => {
        console.log(city, query, storeType);
        const fetchStores = async () => {
            const params = new URLSearchParams();
            if (query) params.append("query", query);
            if (city) params.append("city", city.name);
            if (storeType) params.append("store_types", storeType.store_type);
            try {
                const res = await api.get(
                    `/search/search_store?${params.toString()}`
                );
                const data = res.data;
                const storeCards: StoreCardType[] = data.hits.map((sc: any) => ({
                    id: sc.id,
                    imageUrl: sc.profile_image || "/OnboardingSections/qr.png",
                    storeName: sc.store_name,
                    location: `${sc.area}, ${sc.city}`,
                    storeTypes: sc.store_types || [],
                    priceRanges: ["Affordable", "Luxury"],
                    bestSelling: ["Tshirt", "Shoes"],
                    discount: 15,
                    instagramFollowers: "220k",
                }));
                console.log(data.hits);
                console.log(storeCards);
                setStores(storeCards);
            } catch (error) {
                toast.error("Failed to fetch stores");
            }
        }
        fetchStores();
    }, [query, storeType, city]);
    return (
        <div className="grid lg:grid-cols-1 sm:grid-cols-2  gap-4">
            {stores.map((store, index) => (
                <StoreCard
                    key={store.id}
                    imageUrl={store.imageUrl}
                    storeName={store.storeName}
                    location={store.location}
                    storeTypes={store.storeTypes}
                    priceRanges={store.priceRanges}
                    bestSelling={store.bestSelling}
                    discount={store.discount}
                    instagramFollowers={store.instagramFollowers}
                />
            ))}
        </div>

    )
}
