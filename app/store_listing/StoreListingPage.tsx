"use client";
import DynamicFilter from "@/components/listings/DynamicFilter";
import ListingPageHeader from "@/components/listings/ListingPageHeader";
import TwoOptionToggle from "@/components/listings/OnlineOffline";

import StoreContainerPage from "@/components/listings/StoreContainer";
import StoreTypeTabs from "@/components/listings/StoreTypes";
import { useHeaderStore } from "@/store/listing_header_store";
import { useEffect, useState } from "react";
import { manrope } from "@/font";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useFilterStore } from "@/store/filterStore";

export default function StoreListingPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const {
    query,
    city,
    storeType,
    setStoreType,
    allStoreType ,
    setQuery,
    area,
    setCity,
    setArea,
    allArea,
    allCity,
  } = useHeaderStore();
  const [showFilters, setShowFilters] = useState(false);
  const { results, initializeFilters, selectedFilters, selectedPriceRange } =
    useFilterStore();

  // url to state update
  useEffect(() => {
    // return;
    console.log(searchParams);
    const params = new URLSearchParams(searchParams);
    const initialSelectedFilters: Record<string, string[]> = {};
    const search = params.get("search") || "";
    const cityName = params.get("city");
    const areaName = params.get("area");
    const storeTypeName = params.get("store_type") ; 

    params.forEach((value, key) => {
      if (
        key !== "search" &&
        key !== "sortBy" &&
        key !== "city" &&
        key !== "area"
      ) {
        initialSelectedFilters[key] = value.split(",");
      }
    });
    // Only perform the lookup if the master lists have been loaded
    if (allCity && allCity.length > 0 && cityName) {
      console.log("all city", allCity, cityName);
      const cityObject = allCity.find((c) => c.name === cityName);
      console.log("url_city", cityObject);
      if (cityObject) setCity(cityObject);
    }

    if (allArea && allArea.length > 0 && areaName) {
      const areaObject = allArea.find((a) => a.name === areaName);
      console.log(areaObject);
      if (areaObject) setArea(areaObject);
    }
    if (search) {
      setQuery(search);
      console.log("query1", search);
    }
    if(storeTypeName){
      const storeTypeObject = allStoreType.find((st)=> st.store_type === storeTypeName)
      if(storeTypeObject){
        setStoreType(storeTypeObject);
      }

    }
    initializeFilters({
      selectedFilters: initialSelectedFilters,
    });
  }, [searchParams, initializeFilters, setQuery, setCity, setArea]);

  // state to url

  useEffect(() => {
    const newparams = new URLSearchParams();
    if (query) {
      newparams.set("search", query);
    }

    Object.entries(selectedFilters).forEach(([key, values]) => {
      if (values && values.length > 0) {
        newparams.set(key, values.join(","));
      }
    });

    if (city) {
      newparams.set("city", city.name);
    }
    if (area) {
      newparams.set("area", area.name);
    }
    if(storeType){
      newparams.set("store_type" , storeType.store_type)
    }
    router.replace(`${pathname}?${newparams.toString()}`);
  }, [selectedFilters, query, city, area, storeType,  pathname, router]);

  const getHeading = () => {
    // if (storeType && query && city) {
    //   return `Showing ${storeType.store_type} for ${query} in ${city.name}`;
    // }
    // else if (storeType && query) {
    //   return `Showing ${storeType.store_type} for ${query}`;
    // }
    // else if (storeType && city) {
    //   return `Showing ${storeType.store_type} in ${city.name}`;
    // }
    // else
    if (query && city) {
      return `Showing stores for ${query} in ${city.name}`;
    }
    // else if (storeType) {
    //   return `Showing ${storeType.store_type}`;
    // }
    else if (query) {
      return `Showing stores for ${query}`;
    } else if (city) {
      return `Showing stores in ${city.name}`;
    } else {
      return "";
    }
  };

  return (
    <div className="bg-[#FFFFFF]">
      <ListingPageHeader />
      <div className="mx-[85px] mt-8 gap-10 flex flex-col">
        {/* <h1 className="text-2xl font-bold text-gray-800">{getHeading()}</h1> */}
        <h1
          className={`${manrope.className} text-[32px] text-black`}
          style={{ fontWeight: 500 }}
        >
          {getHeading()}
        </h1>
        {/* <StoreTypeTabs defaultValue={storeType?.id || process.env.NEXT_PUBLIC_RETAIL_BRANDS_ID || ''}/> */}
        <StoreTypeTabs
          // defaultValue={process.env.NEXT_PUBLIC_RETAIL_STORE_TYPE || ""}
          context="stores"
        />
        <div className="border-t border-[#D9D9D9]" />
        <div className="grid grid-cols-[1fr_3fr] gap-[40px]">
          {/* <div className="self-start"> */}
          <div>
            <DynamicFilter context="store" />
          </div>
          <div className="flex flex-col gap-5">
            <TwoOptionToggle
              options={["Online Shopping", "In Store Shopping"]}
              defaultValue="Online Shopping"
              context="store"
            />
            <div className="w-full">
              <StoreContainerPage />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
