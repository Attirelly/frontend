"use client";
import DynamicFilter from "@/components/listings/DynamicFilter";
import ListingFooter from "@/components/listings/ListingFooter";
import ListingPageHeader from "@/components/listings/ListingPageHeader";
import ProductContainer from "@/components/listings/ProductContainer";
import SortByDropdown from "@/components/listings/SortByDropdown";
import StoreTypeButtons from "@/components/listings/StoreTypeButtons";
import { manrope } from "@/font";
import { useProductFilterStore } from "@/store/filterStore";
import { useHeaderStore } from "@/store/listing_header_store";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Fuse from "fuse.js";

const STORE_TYPE_OPTIONS = [
  { store_type: "Retail Store", id: process.env.NEXT_PUBLIC_RETAIL_STORE_TYPE },
  {
    store_type: "Designer Label",
    id: process.env.NEXT_PUBLIC_DESIGNER_STORE_TYPE,
  },
];

export default function ProductListPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { setQuery, query, setStoreType , area , allArea , city , allCity , setArea , setCity  } = useHeaderStore();
  const { results, initializeFilters, selectedFilters, selectedPriceRange , activeFacet} =
    useProductFilterStore();
  const [matchedStoreType, setMatchedStoreType] = useState<string | null>(null);

  const fuse = new Fuse(STORE_TYPE_OPTIONS, {
    keys: ["store_type"],
    threshold: 0.4,
  });


  //  initialise the state using url 
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const initialSelectedFilters: Record<string, string[]> = {};
    const search = params.get("search") || "";
    const cityName = params.get("city");
    const areaName = params.get("area");

    params.forEach((value, key) => {
      if (key !== "search" && key !== "sortBy" && key !== "price" && key !== "city" && key !== "area") {
        initialSelectedFilters[key] = value.split(",");
      }
    });


    // Only perform the lookup if the master lists have been loaded
    if (allCity && allCity.length > 0 && cityName) {
      const cityObject = allCity.find(c => c.name === cityName);
      console.log("url_city" , cityObject)
      if (cityObject) setCity(cityObject);
    }
    
    if (allArea && allArea.length > 0 && areaName) {
      const areaObject = allArea.find(a => a.name === areaName);
      console.log(areaObject)
      if (areaObject) setArea(areaObject);
    }
    let initialPriceRange: [number, number] | null = null;
    const priceParam = params.get("price");
    if (priceParam) {
      const [min, max] = priceParam.split("-").map(Number);
      if (!isNaN(min) && !isNaN(max)) {
        initialPriceRange = [min, max];
      }
    }

    setQuery(search);
    initializeFilters({
      selectedFilters: initialSelectedFilters,
      priceRange: initialPriceRange,
    });

    // C. Perform fuzzy search based on the search term
    const match = fuse.search(search);
    if (match.length > 0) {
      const matchedType = match[0].item;
      setStoreType(matchedType);
      setMatchedStoreType(matchedType.store_type);
    }
  }, [searchParams, initializeFilters, setQuery ,  setStoreType]);

  useEffect(() => {
    const oldparams = new URLSearchParams(searchParams);
    const newparams = new URLSearchParams();
    if (query) {
      newparams.set("search", query);
    }
    if (oldparams.get("categories")) {
      newparams.set("categories", oldparams.get("categories") || "");
    }
    // if (sortBy) {
    //   params.set("sortBy", sortBy);
    // }
    console.log("select filter" , selectedFilters)
    console.log("city and area", city, area);
    Object.entries(selectedFilters).forEach(([key, values]) => {
      if (values && values.length > 0) {
        newparams.set(key, values.join(","));
      }
    });
    
    
    if(city){
      newparams.set("city" , city.name) ; 
    }
    if(area){
      newparams.set("area" , area.name)
    }

    if (selectedPriceRange) {
      const [min, max] = selectedPriceRange;
      newparams.set("price", `${min}-${max}`);
    }
    console.log("params" , newparams.toString())
    router.replace(`${pathname}?${newparams.toString()}`);
  }, [selectedFilters, selectedPriceRange ,pathname, city, area, router]);

  const displayCategory = selectedFilters.categories?.[0] || "";

  return (
    <div className="flex flex-col bg-[#FFFFFF]">
      <ListingPageHeader />
      <div className="flex flex-col mx-20">
        <span
          className={`${manrope.className} text-[#101010] mt-4 text-[32px]`}
          style={{ fontWeight: 500 }}
        >
          {results > 0
            ? query
              ? `Showing Results for "${query}"`
              : displayCategory
              ? `Showing Results for "${displayCategory}"`
              : ""
            : "Sorry, no result found for your search"}
        </span>

        {/* Store Type Selection */}
        <div className="mt-10">
          <StoreTypeButtons
            options={STORE_TYPE_OPTIONS}
            context="product"
            // defaultValue={matchedStoreType || "Retail Store"}
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
