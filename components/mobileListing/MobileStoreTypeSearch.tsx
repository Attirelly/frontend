// components/listings/MobileStoreTypeSearch.tsx

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

  // Fetch store types when the component mounts
  useEffect(() => {
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

  const handleSearchTypeClick = (type: StoreType) => {
    setQuery("");
    const redirect_url = type?.store_type
      ? "/store_listing?store_type=" + type.store_type
      : "/store_listing";
    router.push(redirect_url);
    onClose(); // Close the component after a selection is made
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