import { useEffect } from "react";
import {api} from '@/lib/axios'
import StoreInfoPage from "./StoreInfoHeader";
import PostCatalogueButton from "./PostCatalogueButton";

export default function StoreInfoContainer(){
    useEffect(() => {
      const fetchStore = async () => {
        const storeRes = await api.get('/stores/446e5536-4531-4440-94d0-11438558baac');
        console.log(storeRes.data);

      }
      fetchStore();
    }, []);
    return(
       <div className="">
        <StoreInfoPage
         id="nf"
         imageUrl="/OnboardingSections/qr.png"
         priceRanges={['Luxury', 'Premium', 'Affordable']}
         post_count="22"
         bio="dsadas"
         product_count="432"
         locationUrl="https://www.google.com/"
         storeTypes={['Designer Labels', 'Boutiques']}
         instagramFollowers="222"
         storeName="dsadas"
         key={123}/>
         <div className="flex flex-col">
<hr className="border border-[#D9D9D9]"/>
<PostCatalogueButton options={['Posts', 'Catalogue']} />
         </div>
         
       </div>
    )
}