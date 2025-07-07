import { useEffect, useState } from "react";
import { api } from '@/lib/axios'
import StoreInfoPage from "./StoreInfoHeader";
import { StoreInfoType } from "@/types/SellerTypes";
import { useHeaderStore } from "@/store/listing_header_store";
import { toast } from "sonner";
import StoreInfoSkeleton from "./skeleton/store_desc/StoreInfoSkeleton";

type StoreInfoContainerProps = {
  storeId: string;
};

export default function StoreInfoContainer({ storeId }: StoreInfoContainerProps) {
  const { setInstaMedia, setProfilePic, setInstaMediaLoading } = useHeaderStore();
  const [store, setStore] = useState<StoreInfoType>();
  const [loading, setLoading] = useState(true); // ✅ Loading state

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const storeRes = await api.get(`/stores/${storeId}`);
        const storeData = storeRes.data;
        const sellerId = storeData.store_owner_id;

        const storeFinal: StoreInfoType = {
          id: storeData.store_id,
          // imageUrl: storeData.profile_image,
          imageUrl: storeData.profile_image,
          locationUrl: storeData.store_address,
          storeName: storeData.store_name,
          post_count: "",
          product_count: "",
          bio: "",
          storeTypes: storeData.store_types.map((item: any) => item.store_type),
          priceRanges: storeData.price_ranges.map((item: any) => item.label),
          instagramFollowers: "",
          city: storeData.city.name,
          area: storeData.area.name,
        };
        setStore(storeFinal);
        console.log(storeFinal);
        setInstaMediaLoading(true);
        setInstaMedia([]);
        const instaRes = await api.get(`instagram/seller/${storeId}/data`);
        const instaData = instaRes.data;
        setInstaMedia(instaData.media);
        setProfilePic(instaData.profile_picture);


        const storeFinal2: StoreInfoType = {
          id: storeData.store_id,
          // imageUrl: storeData.profile_image,
          imageUrl: instaData.profile_picture,
          locationUrl: storeData.store_address,
          storeName: storeData.store_name,
          post_count: instaData.media_count,
          product_count: "345",
          bio: instaData.biography,
          storeTypes: storeData.store_types.map((item: any) => item.store_type),
          priceRanges: storeData.price_ranges.map((item: any) => item.label),
          instagramFollowers: instaData.followers_count,
          city: storeData.city.name,
          area: storeData.area.name,
        };
        setStore(storeFinal2);
        console.log(storeFinal2);


      } catch (error) {
        // toast.error('failed to fetch data');
      } finally {
        setInstaMediaLoading(false);
        setLoading(false);

      }

    };
    fetchStore();
  }, []);
  return (
    <div>
      {loading ? (
        <StoreInfoSkeleton /> // ✅ Show skeleton while loading
      ) : (
        store && (
          <StoreInfoPage
            id={store.id}
            imageUrl={store.imageUrl}
            priceRanges={store.priceRanges}
            post_count={store.post_count}
            bio={store.bio}
            product_count={store.product_count}
            locationUrl={store.locationUrl}
            storeTypes={store.storeTypes}
            instagramFollowers={store.instagramFollowers}
            storeName={store.storeName}
            city={store.city}
            area={store.area}
            key={store.id}
          />
        )
      )}
    </div>
  )
}