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
        console.log(storeRes.data);
        const storeData = storeRes.data;
        const storeFinal : StoreInfoType = {
          id: storeData.store_id,
          imageUrl: storeData.profile_image,
          locationUrl: storeData.store_address,
          storeName: storeData.store_name,
          post_count: "1,234",
          product_count: "345",
          bio: "lala ausbfbojandfn  ❤️💫 sdgfaefa",
          storeTypes: storeData.store_types.map((item : any) => item.store_type),
          priceRanges: storeData.price_ranges.map((item:any) => item.label),
          instagramFollowers:"234"
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