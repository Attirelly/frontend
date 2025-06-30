"use client";

import { api } from "@/lib/axios";
import { useHeaderStore } from "@/store/listing_header_store";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";


interface StoreType{
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [storeTypesList , setStoreTypesList] = useState<StoreType[]>([]) ; 
  const { setStoreType } = useHeaderStore();
  const router = useRouter()

  const fetchStoreTypes = async () => {
    try {
      const res = await api.get("/stores/store_types");
      const storeTypes = res.data;  
      setStoreTypesList(storeTypes);
    } catch (error) {
      console.error("Error fetching store types:", error);
    }
  };

  useEffect(()=>{
    fetchStoreTypes();
  },[])

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
    // Handle the search type click logic here
    setStoreType({id: type.id, store_type: type.store_type});
    router.push('/store_listing');
  };


  return (
    <div
      ref={containerRef}
      className="absolute top-[70px] left-1/2 transform -translate-x-1/2 bg-white shadow-2xl rounded-xl p-6 w-[90%] max-w-lg z-50"
    >
      <h1 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        Explore Store Types
      </h1>

      <div className="grid grid-cols-2 gap-4">
        {storeTypesList.map((type, idx) => (
          <div
            key={idx}
            className="bg-[#F8F8F8] hover:bg-[#e7e7e7] py-3 px-4 rounded-2xl text-center text-gray-700 font-medium cursor-pointer transition-all"
            onClick={() => {
              handleSearchTypeClick(type);
            }}
          >
            {type.store_type}
          </div>
        ))}
      </div>
    </div>
  );
}
