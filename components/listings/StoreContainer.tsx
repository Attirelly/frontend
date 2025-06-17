
import StoreCard from "./StoreCard";
import { useHeaderStore } from "@/store/listing_header_store";
import { useEffect } from "react";

export default function StoreContainerPage(){
      const { city, query, storeType } = useHeaderStore();
      

      useEffect(() => {
        console.log(city, query, storeType);
      }, [query]);
      return(
        <StoreCard
          imageUrl="/OnboardingSections/qr.png"
          storeName="Sample Store"
          location="New York, NY"
          storeTypes={["Designer Label", "Boutique"]}
          priceRanges={["Affordable", "Luxury"]}
          bestSelling={["Saree", "Kurta"]}
          discount={20}
          instagramFollowers="520K"
        />
      )
}