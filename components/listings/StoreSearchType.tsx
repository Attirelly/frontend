"use client";

import { api } from "@/lib/axios";
import { useHeaderStore } from "@/store/listing_header_store";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { manrope } from "@/font";
import Image from "next/image";
import { styleText } from "util";

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

export default function StoreSearchType({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [storeTypesList, setStoreTypesList] = useState<StoreType[]>([]);
  const { setStoreType, searchFocus } = useHeaderStore();
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
  console.log("StoreSearchType rendered");

  const handleSearchTypeClick = (type: StoreType) => {
    let redirect_url = type && type.store_type ? "/store_listing?store_type="+ type.store_type : "/store_listing"
    console.log(redirect_url) ;
    router.push(redirect_url);
  };

  return (
    <>
      {searchFocus && (
        <div
          ref={containerRef}
          className={`${manrope.className} absolute top-[70px] left-1/2 transform -translate-x-1/4 bg-white shadow-2xl rounded-xl p-6 w-[90%] max-w-lg z-50`}
          style={{fontWeight:600}}
        >
          <h1 className="text-[18px] text-[#363636] mb-4 text-center">
            Store Type
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
