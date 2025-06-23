'use client';
import ListingPageHeader from "@/components/listings/ListingPageHeader";
import { api } from "@/lib/axios";
import { useHeaderStore } from "@/store/listing_header_store";
import { useEffect, useState } from "react";
import StoreInfoPage from "@/components/listings/StoreInfoHeader";
import StoreInfoContainer from "@/components/listings/StoreInforContainer";

export default function StoreProfilePage() {

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

  return (
    <div className="bg-[#FFFFFF]">
      <ListingPageHeader />
      <div className="flex flex-col items-center">
        <div className="mt-8">
          {/* <StoreInfoPage /> */}
          <StoreInfoContainer/>
        </div>

      </div>
    </div>
  );
}
