'use client';
import DynamicFilter from "@/components/listings/DynamicFilter";
import ListingPageHeader from "@/components/listings/ListingPageHeader";
import TwoOptionToggle from "@/components/listings/OnlineOffline";

import StoreCard from "@/components/listings/StoreCard";
import StoreContainerPage from "@/components/listings/StoreContainer";
import StoreTypeTabs from "@/components/listings/StoreTypes";
import { api } from "@/lib/axios";
import { useHeaderStore } from "@/store/listing_header_store";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {manrope} from "@/font";

export default function StoreListingPage() {

  const { query, city, storeType } = useHeaderStore();
  const [showFilters, setShowFilters] = useState(false);

  const getHeading = () => {
  if (storeType && query && city) {
    return `Showing ${storeType.store_type} for ${query} in ${city.name}`;
  } else if (storeType && query) {
    return `Showing ${storeType.store_type} for ${query}`;
  } else if (storeType && city) {
    return `Showing ${storeType.store_type} in ${city.name}`;
  } else if (query && city) {
    return `Showing stores for ${query} in ${city.name}`;
  } else if (storeType) {
    return `Showing ${storeType.store_type}`;
  } else if (query) {
    return `Showing stores for ${query}`;
  } else if (city) {
    return `Showing stores in ${city.name}`;
  } else {
    return '';
  }
};

console.log(process.env.NEXT_PUBLIC_RETAIL_BRANDS_ID);

  return (
    <div className="bg-[#FFFFFF]">
      <ListingPageHeader />
      <div className="mx-45 mt-8 gap-10 flex flex-col">
       {/* <h1 className="text-2xl font-bold text-gray-800">{getHeading()}</h1> */}
       <h1 className={`${manrope.className} text-4xl`} style={{fontWeight:500}}>{getHeading()}</h1>
        <StoreTypeTabs defaultValue={storeType?.id || process.env.NEXT_PUBLIC_RETAIL_BRANDS_ID || ''}/>
        <div className="border-t border-gray-300"/>
        <div className="grid grid-cols-[1fr_3fr] gap-3">
          {/* <div className="self-start"> */}
          <div>
            <DynamicFilter context="store"/>
          </div>
          <div className="flex flex-col gap-5">
            <TwoOptionToggle options={['Home Delivery', 'In Store']} defaultValue="Home Delivery" context="store"/>
            <div className="w-full">
              <StoreContainerPage />
            </div>
          </div>


        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-3 relative">
          <div
            className={`z-50 bg-white shadow-lg border-r border-gray-200 transform transition-transform duration-300 fixed top-0 left-0 h-full w-80 p-4 ${
              showFilters ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-lg font-semibold">Refine</h1>
              <button onClick={() => setShowFilters(false)}>
                <img
                  src="/ListingPageHeader/left_pointing_arrow.svg"
                  alt="close"
                  className="w-5 h-5 rotate-180"
                />
              </button>
            </div>
            <DynamicFilter />
          </div>

          <div className="flex flex-col gap-5 w-full">
            <TwoOptionToggle options={["In Store", "Home Delivery"]} />
            <StoreContainerPage />
          </div>
        </div> */}
      </div>

      {/* Other components or content for the store listing page */}
    </div>
  );
}
