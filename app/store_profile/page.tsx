'use client';
import ListingPageHeader from "@/components/listings/ListingPageHeader";
import { useHeaderStore } from "@/store/listing_header_store";
import { useState } from "react";
import StoreInfoContainer from "@/components/listings/StoreInforContainer";
import PostCatalogueButton from "@/components/listings/PostCatalogueButton";
import PostGalleryContainer from "@/components/listings/PostsContainer";
import ListingFooter from "@/components/listings/ListingFooter";

export default function StoreProfilePage() {
  const { query, city, storeType, viewType } = useHeaderStore();
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
    <div className="flex flex-col min-h-screen bg-[#FFFFFF]">
      {/* Top fixed content */}
      <ListingPageHeader />
      <div className="flex-1 flex flex-col items-center w-full">
        <div className="mt-8 w-full max-w-4xl px-4">
          <StoreInfoContainer />
          <hr className="border border-[#D9D9D9]" />
          <PostCatalogueButton />

          {viewType === 'Posts' && (
            <div className="mt-8">
              <PostGalleryContainer />
              </div>
          )}
        </div>
      </div>
      <div className="mt-10">
<ListingFooter />
      </div>
      
    </div>
  );
}
