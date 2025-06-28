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
import BreadCrums from "@/components/listings/BreadCrums";
import StoreTypeTabs from "@/components/listings/StoreTypes";
import ProductContainer from "@/components/listings/ProductContainer";
import PriceRangeTabs from "@/components/listings/PriceRangeTypes";
import { manrope } from "@/font";

export default function StoreProfilePage() {
    const { query, city, storeType, viewType } = useHeaderStore();
    const [showFilters, setShowFilters] = useState(false);

    // const getHeading = () => {
    //   if (storeType && query && city) {
    //     return `Showing ${storeType.store_type} for ${query} in ${city.name}`;
    //   } else if (storeType && query) {
    //     return `Showing ${storeType.store_type} for ${query}`;
    //   } else if (storeType && city) {
    //     return `Showing ${storeType.store_type} in ${city.name}`;
    //   } else if (query && city) {
    //     return `Showing stores for ${query} in ${city.name}`;
    //   } else if (storeType) {
    //     return `Showing ${storeType.store_type}`;
    //   } else if (query) {
    //     return `Showing stores for ${query}`;
    //   } else if (city) {
    //     return `Showing stores in ${city.name}`;
    //   } else {
    //     return '';
    //   }
    // };

    return (
        <div className="flex flex-col bg-[#FFFFFF]">
            {/* Full-width header */}
            <ListingPageHeader />
            <div className="flex flex-col mx-20">
                {/* <BreadCrums/> */}
                <span className={`${manrope.className} text-xl mt-4`} style={{ fontWeight: 500 }}>{query}</span>
                <div className="flex flex-col mt-4 items-center">
                    <StoreTypeTabs />
                    <hr className="border border-[#D9D9D9] w-full mt-5 mb-4" />
                    <PriceRangeTabs />
                    {/* Centered content container */}
                    <div className="flex flex-col items-center w-full">
                        <div className="mt-8 w-full px-4">
                            <div className="w-full grid grid-cols-[300px_1fr] gap-6">
                                <div>
                                    <DynamicFilter context="product" />
                                </div>

                                <div className="overflow-y-auto scrollbar-none h-498">
                                    <ProductContainer colCount={4} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>


            <div className="mt-10">
                <ListingFooter />
            </div>
        </div>
    );
}
