'use client';
import DynamicFilter from "@/components/listings/DynamicFilter";
import ListingPageHeader from "@/components/listings/ListingPageHeader";
import TwoOptionToggle from "@/components/listings/OnlineOffline";

import StoreContainerPage from "@/components/listings/StoreContainer";
import StoreTypeTabs from "@/components/listings/StoreTypes";
import { useHeaderStore } from "@/store/listing_header_store";
import { useEffect, useState } from "react";
import {manrope} from "@/font";
import { useSearchParams } from "next/navigation";

export default function StoreListingPage() {
  const searchParams = useSearchParams();
  const { query, city, storeType , setQuery} = useHeaderStore();
  const [showFilters, setShowFilters] = useState(false);

  const search = searchParams.get("search");
   useEffect(() => {
    
    if (search) {
      setQuery(search);
    }
  }, [search]);

  const getHeading = () => {
  // if (storeType && query && city) {
  //   return `Showing ${storeType.store_type} for ${query} in ${city.name}`;
  // } 
  // else if (storeType && query) {
  //   return `Showing ${storeType.store_type} for ${query}`;
  // } 
  // else if (storeType && city) {
  //   return `Showing ${storeType.store_type} in ${city.name}`;
  // } 
  // else 
  if (query && city) {
    return `Showing stores for ${query} in ${city.name}`;
  } 
  // else if (storeType) {
  //   return `Showing ${storeType.store_type}`;
  // } 
  else if (query) {
    return `Showing stores for ${query}`;
  } else if (city) {
    return `Showing stores in ${city.name}`;
  } else {
    return '';
  }
};



  return (
    <div className="bg-[#FFFFFF]">
      <ListingPageHeader />
      <div className="mx-[85px] mt-8 gap-10 flex flex-col">
       {/* <h1 className="text-2xl font-bold text-gray-800">{getHeading()}</h1> */}
       <h1 className={`${manrope.className} text-[32px] text-black`} style={{fontWeight:500}}>{getHeading()}</h1>
        {/* <StoreTypeTabs defaultValue={storeType?.id || process.env.NEXT_PUBLIC_RETAIL_BRANDS_ID || ''}/> */}
        <StoreTypeTabs defaultValue={process.env.NEXT_PUBLIC_RETAIL_STORE_TYPE || ''}/>
        <div className="border-t border-[#D9D9D9]"/>
        <div className="grid grid-cols-[1fr_3fr] gap-[40px]">
          {/* <div className="self-start"> */}
          <div>
            <DynamicFilter context="store"/>
          </div>
          <div className="flex flex-col gap-5">
            <TwoOptionToggle options={['Online Shopping', 'In Store Shopping']} defaultValue="Online Shopping" context="store"/>
            <div className="w-full">
              <StoreContainerPage />
            </div>
          </div>


        </div>
      </div>

    </div>
  );
}
