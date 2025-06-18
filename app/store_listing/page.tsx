'use client';
import DynamicFilter from "@/components/listings/DynamicFilter";
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

  return (
    <div className="bg-gray-50">
      <ListingPageHeader />
      <div className="mx-30 mt-8 gap-10 flex flex-col">
        <h1 className="text-2xl font-bold text-gray-800">Showing stores for {query} in {city?.name}</h1>
        <StoreTypeTabs />
        <div className="border-t border-gray-300"></div>
        <div className="flex">

          <DynamicFilter/>
          <div className="w-full">
            <StoreContainerPage />
          </div>

        </div>
      </div>

      {/* Other components or content for the store listing page */}
    </div>
  );
}
