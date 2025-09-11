'use client';

import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useHeaderStore } from "@/store/listing_header_store";
import { useEffect, useRef, useState } from "react";
import { manrope } from "@/font";
import Image from "next/image";

const StoreTypeImage = [
  { name: "Designer Label", url: "/Homepage/designer_labels.svg" },
  { name: "Retail Store", url: "/Homepage/retail_stores.svg" },
  { name: "Boutiques", url: "/ListingPageHeader/boutiques.svg" },
  { name: "Tailor", url: "/Homepage/tailor.svg" },
  { name: "Stylist", url: "/Homepage/styler.svg" },
];

interface StoreType {
  store_type: string;
  id: string;
  description?: string;
}

/**
 * MobileStoreTypeSearch Component
 *
 * A mobile-friendly dropdown/popup component for exploring stores by type.
 *
 * ## Features
 * - Fetches available store types from the API (`/stores/store_types`)
 * - Displays store types in a **grid layout** with icons
 * - Supports click-outside detection to close the component
 * - On selecting a store type:
 *   - Clears the global search query (`useHeaderStore`)
 *   - Navigates to `/store_listing?store_type=<type>`
 *   - Calls the `onClose` callback to close the dropdown
 * - Visibility is fully controlled by the parent component
 *
 * ## Imports
 * - **Next.js**:
 *   - `useRouter` from `next/navigation` for programmatic navigation
 *   - `Image` for optimized images
 * - **React**: `useEffect`, `useState`, `useRef`
 * - **State Management**: `useHeaderStore` from `@/store/listing_header_store`
 * - **API Client**: `api` from `@/lib/axios`
 * - **Fonts**: `manrope` from `@/font`
 *
 * ## APIs
 * - `GET /stores/store_types` → Fetches store types from backend
 *
 * ## Props
 * @param {object} props - Component props
 * @param {boolean} [props.visible=false] - Controls visibility of the component
 * @param {() => void} props.onClose - Callback to close the component
 *
 * @returns {JSX.Element | null} The rendered component, or `null` if not visible
 */

export default function MobileStoreTypeSearch({
  visible = false,
  onClose,
}: {
  visible?: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const {setQuery} = useHeaderStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [storeTypesList, setStoreTypesList] = useState<StoreType[]>([]);

  
  useEffect(() => {
  
    //  Api to fetch store types store in database
    const fetchStoreTypes = async () => {
      try {
        const res = await api.get("/stores/store_types");
        setStoreTypesList(res.data);
      } catch (error) {
        console.error("Error fetching store types:", error);
      }
    };
    fetchStoreTypes();
  }, []);

  // Handle clicks outside of this component to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // This component's visibility is controlled entirely by the parent
  if (!visible) {
    return null;
  }

  /**
   * When user clicks any store type button
   * query is set to empty string
   * redirect url is created with route to store listing with default store type
   * onClose is called to close the store types dropdown
   */
  const handleSearchTypeClick = (type: StoreType) => {
    setQuery("");
    const redirect_url = type?.store_type
      ? "/store_listing?store_type=" + type.store_type
      : "/store_listing";
    router.push(redirect_url);
    onClose();
  };

  return (
    <div
      ref={containerRef}
      className={`${manrope.className} bg-white shadow-xl rounded-xl p-6 w-full mt-2`}
      style={{ fontWeight: 600 }}
    >
      <h1 className="text-[18px] text-[#363636] mb-4 text-center">
        Explore by Category
      </h1>

      <div className="grid grid-cols-2 gap-4">
        {storeTypesList.map((type, idx) => {
          const storeImage = StoreTypeImage.find(
            (item) => item.name.toLowerCase() === type.store_type.toLowerCase()
          );
          return (
            <div
              key={idx}
              className="flex items-center gap-2 bg-[#F8F8F8] hover:bg-[#e7e7e7] py-3 px-2 md:px-4 rounded-2xl cursor-pointer transition-all"
              onClick={() => handleSearchTypeClick(type)}
            >
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image
                  src={storeImage?.url || "/Homepage/tailor.svg"}
                  alt={type.store_type}
                  fill
                  sizes="30px md:40px"
                />
              </div>
              <span className="text-xs md:text-base text-black" style={{ fontWeight: 400 }}>
                {type.store_type}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}