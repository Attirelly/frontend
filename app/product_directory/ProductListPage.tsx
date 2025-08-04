"use client";

import DynamicFilter from "@/components/listings/DynamicFilter";
import ListingFooter from "@/components/listings/ListingFooter";
import ListingPageHeader from "@/components/listings/ListingPageHeader";
import PriceRangeTabs from "@/components/listings/PriceRangeTypes";
import ProductContainer from "@/components/listings/ProductContainer";
import SortByDropdown from "@/components/listings/SortByDropdown";
import StoreTypeButtons from "@/components/listings/StoreTypeButtons";
import { manrope } from "@/font";
import { useProductFilterStore } from "@/store/filterStore";
import { useHeaderStore } from "@/store/listing_header_store";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Fuse from "fuse.js";

const STORE_TYPE_OPTIONS = [
  { store_type: "Retail Brand", id: process.env.NEXT_PUBLIC_RETAIL_STORE_TYPE },
  { store_type: "Designer Label", id: process.env.NEXT_PUBLIC_DESIGNER_STORE_TYPE },
];

export default function ProductListPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const search = searchParams.get("search");
 

  const { setQuery, query, city, storeType, viewType, setStoreType } = useHeaderStore();
  const { results, setCategory } = useProductFilterStore();

  const [showFilters, setShowFilters] = useState(false);
  const [matchedStoreType, setMatchedStoreType] = useState<string | null>(null);

  const fuse = new Fuse(STORE_TYPE_OPTIONS, {
    keys: ["store_type"],
    threshold: 0.4, // Adjust sensitivity as needed
  });

  useEffect(() => {
    if (category) setCategory(category);
    if (search) {
      setQuery(search);
      
      // Run fuzzy matching to infer store type
      
      const match = fuse.search(search);
      if (match.length > 0) {
        const matchedType = match[0].item;
        setStoreType(matchedType); // update global store
        setMatchedStoreType(matchedType.store_type); // update local default for buttons
        
      }
    }
  }, [category, search]);

  return (
    <div className="flex flex-col bg-[#FFFFFF]">
      <ListingPageHeader />

      <div className="flex flex-col mx-20">
        <span
          className={`${manrope.className} text-[#101010] mt-4 text-[32px]`}
          style={{ fontWeight: 500 }}
        >
          {results > 0 ? query : "Sorry, no result found for your search"}
        </span>

        {/* Store Type Selection */}
        <div className="mt-10">
          <StoreTypeButtons
            options={STORE_TYPE_OPTIONS}
            defaultValue={matchedStoreType || "Retail Brand"} // use fuzzy match or fallback
            context="product"
          />
        </div>

        {/* Content Section */}
        <div className="flex flex-col mt-5 items-center">
          <hr className="border border-[#D9D9D9] w-full mt-5 mb-4" />

          <div className="flex flex-col items-center w-full mt-8">
            <div className="w-full px-4">
              <div className="w-full grid grid-cols-[300px_1fr] gap-6">
                <div>
                  <DynamicFilter context="product" />
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    {storeType?.id && (
                      // <PriceRangeTabs storeTypeId={storeType.id} />
                    )}
                    <SortByDropdown />
                  </div>
                  <div className="overflow-y-auto scrollbar-none h-498 scrollbar-thin">
                    <ProductContainer colCount={4} />
                  </div>
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
