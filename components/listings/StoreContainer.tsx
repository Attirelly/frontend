
import { api } from "@/lib/axios";
import StoreCard from "./StoreCard";
import { useHeaderStore } from "@/store/listing_header_store";
import { useEffect, useState } from "react";
import { StoreCardType } from "@/types/SellerTypes";

export default function StoreContainerPage() {
    const { city, query, storeType } = useHeaderStore();
    const [stores, setStores] = useState<StoreCardType[]>([]);


    useEffect(() => {
        console.log(city, query, storeType);
        const fetchStores = async () => {
            const res = await api.get(
                `/search/search_store?query=${query}`
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
        }

        fetchStores();
    }, [query, storeType]);
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