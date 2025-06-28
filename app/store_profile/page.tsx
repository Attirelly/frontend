'use client';
import ListingPageHeader from "@/components/listings/ListingPageHeader";
import { useHeaderStore } from "@/store/listing_header_store";
import { useState } from "react";
import StoreInfoContainer from "@/components/listings/StoreInforContainer";
import PostCatalogueButton from "@/components/listings/PostCatalogueButton";
import PostGalleryContainer from "@/components/listings/PostsContainer";
import ListingFooter from "@/components/listings/ListingFooter";
import Catalogue from "@/components/listings/Catalogue";
import DynamicFilter from "@/components/listings/DynamicFilter";
import InstagramFeed from "@/components/InstagramFeed";

export default function StoreProfilePage() {
  const { query, city, storeType, viewType } = useHeaderStore();
  const [showFilters, setShowFilters] = useState(false);


  return (
    <div className="flex flex-col bg-[#FFFFFF]">
      {/* Full-width header */}
      <ListingPageHeader />

      {/* Centered content container */}
      <div className="flex flex-col items-center w-full">
        <div className="mt-8 w-full max-w-4xl px-4">
          <StoreInfoContainer />
          <hr className="border border-[#D9D9D9]" />
          <PostCatalogueButton />
        </div>

        {viewType === 'Posts' && (
          <div className="mt-8 flex justify-center w-full">
            <div className="w-full max-w-[926px] px-4">
              <PostGalleryContainer />
            </div>
          </div>
        )}

        {viewType === 'Catalogue' && (
          <div className="mt-8 w-full px-4">
            <div className="px-20 w-full grid grid-cols-[300px_1fr] gap-6">
              <DynamicFilter context="product" />
              <Catalogue />
            </div>
          </div>
        )}
      </div>

      <div className="mt-10">
        <ListingFooter />
      </div>
    </div>
  );
}
