'use client';
import ListingPageHeader from "@/components/listings/ListingPageHeader";
import StoreCard from "@/components/listings/StoreCard";
import StoreContainerPage from "@/components/listings/StoreContainer";
import StoreTypeTabs from "@/components/listings/StoreTypes";
import { api } from "@/lib/axios";
import { useHeaderStore } from "@/store/listing_header_store";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function StoreListingPage() {

  const { query, city } = useHeaderStore();

  // useEffect(() => {
  //     const fetchStoreTypes = async () => {
  //         try{
  //             const res = await api.get("stores/store_types");
  //             console.log(res.data);
  //         }
  //         catch(error){
  //             toast.error("Failed to fetch store types");
  //         }
  //     }
  //     fetchStoreTypes();
  // }, []);
  //   const tabs = [
  //   { label: 'Designer Labels', value: 'designer' },
  //   { label: 'Retail Stores', value: 'retail' },
  //   { label: 'Rental Outfits', value: 'rental' },
  //   { label: 'Boutiques', value: 'boutiques' },
  // ];

  // const handleTabChange = (val: string) => {
  //   console.log('Selected:', val);
  // };

  return (
    <div className="bg-gray-50">
      <ListingPageHeader />
      <div className="mx-30 mt-8 gap-10 flex flex-col">
        <h1 className="text-2xl font-bold text-gray-800">Showing stores for {query} in {city?.name}</h1>
        <StoreTypeTabs />
        <div className="border-t border-gray-300"></div>
        <div className="flex">

          <div>Filter Bar</div>
          <div className="w-full">
            <StoreContainerPage />
          </div>

        </div>
        {/* <StoreCard
          imageUrl="/OnboardingSections/qr.png"
          storeName="Sample Store"
          location="New York, NY"
          storeTypes={["Designer Label", "Boutique"]}
          priceRanges={["Affordable", "Luxury"]}
          bestSelling={["Saree", "Kurta"]}
          discount={20}
          instagramFollowers="520K"
        /> */}
      </div>

      {/* Other components or content for the store listing page */}
    </div>
  );
}
