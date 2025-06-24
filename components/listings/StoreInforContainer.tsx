import { useEffect, useState } from "react";
import {api} from '@/lib/axios'
import StoreInfoPage from "./StoreInfoHeader";
import PostCatalogueButton from "./PostCatalogueButton";
import { StoreInfoType } from "@/types/SellerTypes";

export default function StoreInfoContainer(){
  const [store, setStore] = useState<StoreInfoType>();
    useEffect(() => {
      const fetchStore = async () => {
        const storeRes = await api.get('/stores/446e5536-4531-4440-94d0-11438558baac');
        const instaRes = await api.get('instagram/seller/2ba895ad-55c5-4e81-a0aa-e0f43962a685/data');
        console.log(storeRes.data);
        console.log(instaRes.data.media);
        const instaData = instaRes.data;
        const storeData = storeRes.data;
        const storeFinal : StoreInfoType = {
          id: storeData.store_id,
          // imageUrl: storeData.profile_image,
          imageUrl: instaData.profile_picture,
          locationUrl: storeData.store_address,
          storeName: storeData.store_name,
          post_count: instaData.media_count,
          product_count: "345",
          bio: instaData.biography,
          storeTypes: storeData.store_types.map((item : any) => item.store_type),
          priceRanges: storeData.price_ranges.map((item:any) => item.label),
          instagramFollowers:instaData.followers_count

        }
        setStore(storeFinal);
      }
      fetchStore();
    }, []);
    return(
       <div className="">
        {store && (
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
         key={store.id}/>
        )}
         
       </div>
    )
}