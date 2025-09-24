"use client";

import { api } from "@/lib/axios";
import { useHeaderStore } from "@/store/listing_header_store";
import { useRouter } from "next/navigation";
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
 * StoreSearchType Component
 *
 * A UI component that displays a list of store categories for users to select from.
 * It typically appears as a modal or dropdown when the main search bar is focused but empty.
 *
 * ## Features
 * - Renders a grid of store types (e.g., "Boutiques", "Designer Label") with corresponding icons.
 * - Fetches the list of store types dynamically from an API on component mount.
 * - Navigates the user to a filtered store listing page when a type is selected.
 * - Automatically closes when the user clicks outside of its container.
 * - Manages state for:
 * - The list of store types fetched from the API.
 * - Its own visibility, controlled by props and global state.
 *
 * ## Data Flow
 * 1.  On component mount, `useEffect` triggers a data fetch for store types.
 * 2.  An API call is made to get the list of available store types.
 * 3.  The fetched data is stored in the `storeTypesList` state, triggering a re-render.
 * 4.  The component maps over this state to render the list, matching each type with a local image from the `StoreTypeImage` constant.
 * 5.  A click on a store type triggers `handleSearchTypeClick`, which constructs a URL and navigates the user.
 * 6.  A separate `useEffect` hook listens for clicks outside the component to call the `onClose` prop and hide it.
 *
 * ## Imports
 * - **Core/Libraries**: `useEffect`, `useRef`, `useState` from `react`; `useRouter` from `next/navigation`; `Image` from `next/image`.
 * - **State (Zustand Stores)**:
 *    - `useHeaderStore` for managing global header and search state.
 * - **Utilities**:
 *    - `api` from `@/lib/axios` for API calls.
 *    - `manrope` from `@/font` for styling.
 *
 * ## API Calls
 * - `GET /stores/store_types`: Fetches the list of all available store types on mount.
 *
 * ## Props
 * @param {object} props - The props for the component.
 * @param {boolean} [props.visible=false] - Controls the visibility of the component.
 * @param {() => void} props.onClose - A callback function invoked to signal that the component should be closed.
 *
 * @returns {JSX.Element | null} The rendered component, or null if it is not visible.
 */
export default function StoreSearchType({
  visible = false,
  onClose,
}: {
  visible?: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [storeTypesList, setStoreTypesList] = useState<StoreType[]>([]);
  const { searchFocus, setQuery } = useHeaderStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchType, setShowSearchType] = useState(false);

  const handleSearchFocus = () => {
    if (searchQuery.trim() === "") {
      setShowSearchType(true);
    }
  };

  const fetchStoreTypes = async () => {
    try {
      const res = await api.get("/stores/store_types");
      const storeTypes = res.data;
      setStoreTypesList(storeTypes);
    } catch (error) {
      console.error("Error fetching store types:", error);
    }
  };

  useEffect(() => {
    fetchStoreTypes();
  }, []);

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

  if (!visible) return null;


  const handleSearchTypeClick = (type: StoreType) => {
    setQuery("");
    let redirect_url = type && type.store_type ? "/store_listing?store_type="+ type.store_type : "/store_listing"
    console.log(redirect_url) ;
    router.push(redirect_url);
  };

  return (
    <>
      {searchFocus && (
        <div
          ref={containerRef}
          className={`${manrope.className} lg:absolute lg:top-[70px] lg:left-1/2 lg:transform lg:-translate-x-1/4 bg-white shadow-2xl rounded-xl p-6 w-[90%] max-w-lg z-50`}
          style={{fontWeight:600}}
        >
          <h1 className="text-[18px] text-[#363636] mb-4 text-center">
            Category Type
          </h1>

          <div className="grid grid-cols-2 gap-4">
            {storeTypesList.map((type, idx) => {
              // ✅ UPDATED PART: match store type with image
              const storeImage = StoreTypeImage.find(
                (item) =>
                  item.name.toLowerCase() === type.store_type.toLowerCase()
              );
              return (
                <div
                  key={idx}
                  className="flex items-center gap-3 bg-[#F8F8F8] hover:bg-[#e7e7e7] py-3 px-4 rounded-2xl cursor-pointer transition-all"
                  onClick={() => handleSearchTypeClick(type)}
                >
                  <div className="relative w-10 h-10 flex-shrink-0">
                    <Image
                      src={storeImage?.url || "/Homepage/tailor.svg"}
                      alt="Store Type"
                      fill
                      sizes="40px"
                    />
                  </div>
                  <span className="text-base text-black" style={{fontWeight:400}}>
                    {type.store_type}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
