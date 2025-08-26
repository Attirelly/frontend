// 'use client';

// import React, { use, useEffect, useState } from 'react';
// import clsx from 'clsx';
// import { SelectOption, BrandType } from '@/types/SellerTypes';
// import { api } from '@/lib/axios';
// import { toast } from 'sonner';
// import { useHeaderStore } from '@/store/listing_header_store';
// import { event } from '@/lib/gtag';
// import { manrope } from '@/font';
// import StoreTypeTabsSkeleton from './skeleton/StoreTypeHeaderSkeleton';

// interface StoreTypeTabsProps {
//     //   tabs: SelectOption[];
//     //   onChange: (value: string) => void;
//     defaultValue?: string;
// }

// export default function StoreTypeTabs({
//     //   tabs,
//     //   onChange,
//     defaultValue,
// }: StoreTypeTabsProps) {
//     const { setStoreType, storeType } = useHeaderStore();
//     const [storeTypes, setStoreTypes] = useState<BrandType[]>([]);
//     const [tabs, setTabs] = useState<SelectOption[]>([]);
//     const [selectedStoreType, setSelectedStoreType] = useState<BrandType | null>(null);
//     const [loading, setLoading] = useState(true);
//     const handleTabClick = (value: SelectOption) => {
//         const storeType: BrandType = {
//             id: value.value,
//             store_type: value.label
//         }
//         event({
//             action: "Store Type Select",
//             params: {
//                 "Store Type": value.label
//             }
//         });
//         setSelectedStoreType(storeType);
//         setStoreType(storeType);
//         // onChange(value);
//     };
//     //

//     useEffect(() => {
//     const fetchStoreTypes = async () => {
//         try {
//             setLoading(true);
//             const res = await api.get("stores/store_types");

//             setStoreTypes(res.data);
//             const options: SelectOption[] = res.data.map((t: BrandType) => ({
//                 label: t.store_type,
//                 value: t.id
//             }));
//             setTabs(options);

//             // Prefer storeType from Zustand, fallback to defaultValue
//             const initialId = storeType?.id ?? defaultValue;

//             if (initialId) {
//                 const initialOption = res.data.find((t: BrandType) => t.id === initialId);
//                 if (initialOption) {
//                     const storeTypeObj: BrandType = {
//                         id: initialOption.id,
//                         store_type: initialOption.store_type,
//                     };
//                     setSelectedStoreType(storeTypeObj);
//                     setStoreType(storeTypeObj); // update Zustand
//                 }
//             }
//         }
//         catch (error) {
//             toast.error("Failed to fetch store types");
//         }
//         finally {
//             setLoading(false);
//         }
//     };

//     fetchStoreTypes();
// }, [defaultValue, storeType?.id, setStoreType]);

//     if(loading){
//         return <StoreTypeTabsSkeleton/>
//     }
//     return (
//         <div className="flex bg-[#F5F5F5] rounded-full overflow-hidden w-fit px-2 py-2">
//             {tabs.map((tab, index) => (
//                 <div key={tab.value} className="flex items-center">
//                     <button
//                         className={clsx(
//                             manrope.className,
//                             'px-4 py-2 rounded-full transition-all duration-200 mx-2 text-base',
//                             selectedStoreType?.id === tab.value
//                                 ? 'bg-white shadow text-black'
//                                 : 'text-[#565656] hover:text-black'
//                         )}
//                         style={{fontWeight:500}}
//                         onClick={() => handleTabClick(tab)}
//                     >
//                         {tab.label}
//                     </button>

//                     {index !== tabs.length - 1 && (
//                         <div className="h-6 border-r border-gray-300 mx-2" />
//                     )}
//                 </div>
//             ))}
//         </div>
//     );
// }

"use client";

import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { SelectOption, BrandType } from "@/types/SellerTypes";
import { toast } from "sonner";
import { useHeaderStore } from "@/store/listing_header_store";
import { event } from "@/lib/gtag";
import { manrope } from "@/font";
import StoreTypeTabsSkeleton from "./skeleton/StoreTypeHeaderSkeleton";

interface StoreTypeTabsProps {
  defaultValue?: string;
  context?: string;
}

const HARD_CODED_STORE_TYPES: BrandType[] = [
  { id: "f923d739-4c06-4472-9bfd-bb848b32594b", store_type: "Retail Store" },
  { id: "9e5bbe6d-f2a4-40f0-89b0-8dac6026bd17", store_type: "Designer Label" },
  { id: "33f514c5-4896-46b7-ae74-139aece3d295", store_type: "Tailor" },
  { id: "7339638e-e60a-4547-9c68-2c46169ea480", store_type: "Stylist" },
];

export default function StoreTypeTabs({
  defaultValue,
  context,
}: StoreTypeTabsProps) {
  const { setStoreType, storeType } = useHeaderStore();
  const [storeTypes, setStoreTypes] = useState<BrandType[]>([]);
  const [tabs, setTabs] = useState<SelectOption[]>([]);
  const [selectedStoreType, setSelectedStoreType] = useState<BrandType | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const handleTabClick = (value: SelectOption) => {
    console.log("store_type_select", value);
    const storeTypeObj: BrandType = {
      id: value.value,
      store_type: value.label,
    };

    event({
      action: "Store Type Select",
      params: { "Store Type": value.label },
    });

    setSelectedStoreType(storeTypeObj);
    setStoreType(storeTypeObj);
  };

  //   useEffect(() => {
  //     try {
  //       setLoading(true);
  //       setStoreTypes(HARD_CODED_STORE_TYPES);

  //       if (context?.toLowerCase() === "products") {
  //         const options: SelectOption[] = HARD_CODED_STORE_TYPES.filter(st => st.store_type === "Retail Store" ||
  //             st.store_type == "Designer Label"
  //         ).map((t) => ({
  //           label: t.store_type,
  //           value: t.id,
  //         }));
  //         setTabs(options);
  //       }
  //       else{
  //         const options: SelectOption[] = HARD_CODED_STORE_TYPES.map((t) => ({
  //           label: t.store_type,
  //           value: t.id,
  //         }));
  //         setTabs(options);
  //       }

  //       // Set initial selected store type
  //       const initialId = storeType?.id ?? defaultValue;
  //       if (initialId) {
  //         const initialOption = HARD_CODED_STORE_TYPES.find(
  //           (t) => t.id === initialId
  //         );
  //         if (initialOption) {
  //           const storeTypeObj: BrandType = {
  //             id: initialOption.id,
  //             store_type: initialOption.store_type,
  //           };
  //           setSelectedStoreType(storeTypeObj);
  //           setStoreType(storeTypeObj);
  //         }
  //       }
  //     } catch (err) {
  //       toast.error("Failed to load store types");
  //     } finally {
  //       setLoading(false);
  //     }
  //   }, [defaultValue, storeType, setStoreType]);

  useEffect(() => {
    setLoading(true);
    setStoreTypes(HARD_CODED_STORE_TYPES);

    let options: SelectOption[];

    if (context?.toLowerCase() === "products") {
      options = HARD_CODED_STORE_TYPES.filter(
        (st) =>
          st.store_type === "Retail Store" || st.store_type === "Designer Label"
      ).map((t) => ({ label: t.store_type, value: t.id }));
    } else {
      options = HARD_CODED_STORE_TYPES.map((t) => ({
        label: t.store_type,
        value: t.id,
      }));
    }

    setTabs(options);

    // Set initial selected store type
    const initialId = storeType?.id ?? defaultValue;
    if (initialId) {
      const initialOption = HARD_CODED_STORE_TYPES.find(
        (t) => t.id === initialId
      );
      if (initialOption) {
        const storeTypeObj: BrandType = {
          id: initialOption.id,
          store_type: initialOption.store_type,
        };
        setSelectedStoreType(storeTypeObj);

        // safe call: only if exists
        if (setStoreType) {
          setStoreType(storeTypeObj);
        }
      }
    }

    setLoading(false);
  }, [defaultValue, storeType?.id, setStoreType, context]);

  if (loading) return <StoreTypeTabsSkeleton />;

  return (
    // <div className="mx-auto md:mx-0 flex bg-[#F5F5F5] rounded-full overflow-hidden w-fit px-2 py-2 ">
    //   {tabs.map((tab, index) => (
    //     <div key={tab.value} className="flex items-center">
    //       <button
    //         className={clsx(
    //           manrope.className,
    //           "px-4 py-2 rounded-full transition-all duration-200 mx-2 text-base",
    //           selectedStoreType?.id === tab.value
    //             ? "bg-white shadow text-black"
    //             : "text-[#565656] hover:text-black"
    //         )}
    //         style={{ fontWeight: 500 }}
    //         onClick={() => handleTabClick(tab)}
    //       >
    //         {tab.label}
    //       </button>
    //       {index !== tabs.length - 1 && (
    //         <div className="h-6 border-r border-gray-300 mx-2" />
    //       )}
    //     </div>
    //   ))}
    // </div>

    <div className="flex flex-wrap justify-around items-center bg-[#F5F5F5] rounded-full w-fit p-1">
      {tabs.map((tab, index) => (
        // ✅ Added flex-shrink-0 to prevent buttons from being squished
        <div key={tab.value} className="flex items-center flex-shrink-0">
          <button
            className={clsx(
              manrope.className,
              // ✅ Made padding and text size responsive
              "px-2 py-1.5 md:px-4 md:py-2 rounded-full transition-all duration-200 mx-1 text-sm md:text-base",
              selectedStoreType?.id === tab.value
                ? "bg-white shadow text-black"
                : "text-[#565656] hover:text-black"
            )}
            style={{ fontWeight: 500 }}
            onClick={() => handleTabClick(tab)}
          >
            {tab.label}
          </button>

          {/* ✅ Divider is now hidden on mobile */}
          {index !== tabs.length - 1 && (
            <div className="h-6 border-r border-gray-300 hidden md:block" />
          )}
        </div>
      ))}
    </div>
  );
}
