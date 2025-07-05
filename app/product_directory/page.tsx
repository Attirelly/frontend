// "use client";
// import DynamicFilter from "@/components/listings/DynamicFilter";
// import ListingFooter from "@/components/listings/ListingFooter";
// import ListingPageHeader from "@/components/listings/ListingPageHeader";
// import TwoOptionToggle from "@/components/listings/OnlineOffline";
// import PriceRangeTabs from "@/components/listings/PriceRangeTypes";
// import ProductContainer from "@/components/listings/ProductContainer";
// import SortByDropdown from "@/components/listings/SortByDropdown";
// import StoreTypeButtons from "@/components/listings/StoreTypeButtons";
// import StoreTypeTabs from "@/components/listings/StoreTypes";
// import { manrope } from "@/font";
// import { useProductFilterStore } from "@/store/filterStore";
// import { useHeaderStore } from "@/store/listing_header_store";
// import { useState } from "react";

// export default function StoreProfilePage() {
//   const { query, city, storeType, viewType } = useHeaderStore();
//   const { results } = useProductFilterStore();
//   const [showFilters, setShowFilters] = useState(false);

//   // const getHeading = () => {
//   //   if (storeType && query && city) {
//   //     return `Showing ${storeType.store_type} for ${query} in ${city.name}`;
//   //   } else if (storeType && query) {
//   //     return `Showing ${storeType.store_type} for ${query}`;
//   //   } else if (storeType && city) {
//   //     return `Showing ${storeType.store_type} in ${city.name}`;
//   //   } else if (query && city) {
//   //     return `Showing stores for ${query} in ${city.name}`;
//   //   } else if (storeType) {
//   //     return `Showing ${storeType.store_type}`;
//   //   } else if (query) {
//   //     return `Showing stores for ${query}`;
//   //   } else if (city) {
//   //     return `Showing stores in ${city.name}`;
//   //   } else {
//   //     return '';
//   //   }
//   // };

//   return (
//     <div className="flex flex-col bg-[#FFFFFF]">
//       {/* Full-width header */}
//       <ListingPageHeader />
//       <div className="flex flex-col mx-20">
//         {/* <BreadCrums/> */}
//         <span
//           className={`${manrope.className} text-xl mt-4`}
//           style={{ fontWeight: 500 }}
//         >
//           {results > 0 ? query : "Sorry, no result found for your search"}
//         </span>
//         <div className="mt-10">
//           <StoreTypeButtons
//             options={["Retail Stores", "Designer Labels"]}
//             defaultValue="Retail Stores"
//             context="product"
//           />
//         </div>

//         <div className="flex flex-col mt-5 items-center">
//           <hr className="border border-[#D9D9D9] w-full mt-5 mb-4" />

//           {/* Centered content container */}
//           <div className="flex flex-col items-center w-full mt-8">
//             <div className="w-full px-4">
//               <div className="w-full grid grid-cols-[300px_1fr] gap-6">
//                 <div>
//                   <DynamicFilter context="product" />
//                 </div>
//                 <div>
//                   <div className="flex justify-between items-center">
//                     <PriceRangeTabs defaultValue="Affordable" />
//                     <SortByDropdown />
//                   </div>
//                   <div className="overflow-y-auto scrollbar-none h-498">
//                     <ProductContainer colCount={4} />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="mt-10">
//         <ListingFooter />
//       </div>
//     </div>
//   );
// }


'use client';

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
import { useEffect, useState } from "react";

const STORE_TYPE_OPTIONS = [
  { store_type: 'Retail Stores', id: 'e8742683-412c-4fb3-a1f1-5afba79981f8' }, // replace with actual ID
  { store_type: 'Designer Labels', id: '943bec15-4210-40ad-bd88-322b3d354486' }, // replace with actual ID
];

export default function StoreProfilePage() {
  const { query, city, storeType, viewType } = useHeaderStore();
  const { results } = useProductFilterStore();
  const [showFilters, setShowFilters] = useState(false);


  return (
    <div className="flex flex-col bg-[#FFFFFF]">
      <ListingPageHeader />

      <div className="flex flex-col mx-20">
        <span className={`${manrope.className} text-xl mt-4`} style={{ fontWeight: 500 }}>
          {results > 0 ? query : 'Sorry, no result found for your search'}
        </span>

        {/* Store Type Selection */}
        <div className="mt-10">
          <StoreTypeButtons
            options={STORE_TYPE_OPTIONS}
            defaultValue="Designer Labels"
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
                      <PriceRangeTabs storeTypeId={storeType.id} />
                    )}
                    <SortByDropdown />
                  </div>
                  <div className="overflow-y-auto scrollbar-none h-498">
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
