'use client';
import ListingPageHeader from "@/components/ui/ListingPageHeader";
import StoreTypeTabs from "@/components/ui/StoreTypes";
import { api } from "@/lib/axios";
import { useHeaderStore } from "@/store/listing_header_store";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function StoreListingPage() {
    const {city, query, defaultStoreType} = useHeaderStore();
    const {} = useState
    console.log(city, query);

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
    const tabs = [
    { label: 'Designer Labels', value: 'designer' },
    { label: 'Retail Stores', value: 'retail' },
    { label: 'Rental Outfits', value: 'rental' },
    { label: 'Boutiques', value: 'boutiques' },
  ];

  const handleTabChange = (val: string) => {
    console.log('Selected:', val);
  };
    return (
        <div className="bg-gray-50">
            <ListingPageHeader />
            <div className="mx-30 mt-8 gap-10 flex flex-col">
<h1 className="text-2xl font-bold text-gray-800">Showing stores for {query} in {city?.name}</h1>
<StoreTypeTabs defaultValue={defaultStoreType?.id}/>
<div className="border-t border-gray-300"></div>
            </div>

            
            {/* Other components or content for the store listing page */}
        </div>
    );
}
