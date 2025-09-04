'use client';

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { useHeaderStore } from "@/store/listing_header_store";
import { SelectOption } from "@/types/SellerTypes";
import customStyles from "@/utils/selectStyles";
import { manrope } from "@/font";
import StoreSearchType from "../listings/StoreSearchType";
import MobileStoreTypeSearch from "./MobileStoreTypeSearch";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { api } from "@/lib/axios";

const Select = dynamic(() => import("react-select"), { ssr: false });

type Props = {
  onClose: () => void;
};

export default function MobileSearchContainer({ onClose }: Props) {
  const router = useRouter();
  const {
    city,
    setCity,
    area,
    setArea,
    allCity,
    setAllCity,
    allArea,
    setAllArea,
    searchFocus,
    setSearchFocus,
  } = useHeaderStore();

  const [tempQuery, setTempQuery] = useState<string>("");
  const [showStoreType, setShowStoreType] = useState(false);
  const [storeSuggestions, setStoreSuggestions] = useState<string[]>([]);
  const [productSuggestions, setProductSuggestions] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [locationSearchInput, setLocationSearchInput] = useState("");

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await api.get("/location/cities/");
        setAllCity(res.data);
      } catch {
        toast.error("Failed to fetch cities");
      }
    };
    fetchCities();

    const fetchAreas = async () => {
      try {
        const res = await api.get("/location/areas/");
        setAllArea(res.data);
      } catch {
        toast.error("Failed to fetch areas");
      }
    };
    fetchAreas();
  }, [setAllCity, setAllArea]);

  useEffect(() => {
    console.log("on close use effect");
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, [onClose]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = tempQuery.trim();
      onClose();
      if (trimmed !== "") {
        router.push("/product_directory?search=" + encodeURIComponent(trimmed));
      }
    }
  };

  const handleSearchClick = () => {
      const trimmed = tempQuery.trim();
      onClose();
      if (trimmed !== "") {
        router.push("/product_directory?search=" + encodeURIComponent(trimmed));
      }
  };
  

  const handleSearchQuerySuggestion = async () => {
    try {
      let tempStr = "";
      if (city) {
        tempStr = `city:${city.name}`;
      }
      if (area) {
        tempStr = `area:${area.name}`;
      }
      const response = await api.post(`/search/search_suggestion`, {
        query: tempQuery,
        filters: tempStr,
      });

      const data = response.data;
      setShowStoreType(false);
      setStoreSuggestions(data.store_search_suggestion || []);
      setProductSuggestions(data.product_search_suggestion || []);
      setCategories(data.categories || []);
      setStores(data.stores || []);
      setProducts(data.products || []);
      setShowDropdown(true);
    } catch (error) {
      console.error("Failed to fetch search suggestions");
    }
  };

  useEffect(() => {
    console.log("temp query use effect");
    if (tempQuery.length < 4) {
      setStoreSuggestions([]);
      setProductSuggestions([]);
      setStores([]);
      setProducts([]);
      setShowDropdown(false);
      if (tempQuery.length === 0 && searchFocus) {
        setShowStoreType(true);
      } else {
        setShowStoreType(false);
      }
      return;
    }
    
    if (tempQuery.length === 4) {
      handleSearchQuerySuggestion();
      return;
    }

    const debounce = setTimeout(() => {
      handleSearchQuerySuggestion();
    }, 100);

    return () => clearTimeout(debounce);
  }, [tempQuery]);

   useEffect(() => {
    console.log("handle outside click use effect");
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
        setShowStoreType(false);
        setSearchFocus(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showStoreType]);


  const groupedOptions: SelectOption[] = [
    { value: "", label: "All Cities", name: "All Cities", country: "" },
    ...(allCity ?? []).map((c) => ({
      value: c.id,
      label: c.name,
      name: c.name,
      country: "India",
      type: "city",
    })),
    ...(allArea ?? []).map((a) => ({
      value: a.id,
      label: a.name,
      name: a.name,
      country: "India",
      type: "area",
      city: a.city_name,
    })),
  ];


  const selectedOption: SelectOption =
    area != null
      ? {
        value: area.id,
        label: area.name,
        name: area.name,
        city: area.city_name,
      }
      : city != null
        ? {
          value: city.id,
          label: city.name,
          name: city.name,
          country: "India",
        }
        : groupedOptions[0];

  function highlightMatch(text: string, query: string) {
    const defaultClasses = `${manrope.className} text-base text-[#464646]`;

    if (!query) {
      return (
        <span className={defaultClasses} style={{ fontWeight: 400 }}>
          {text}
        </span>
      );
    }

    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) {
      return (
        <span className={defaultClasses} style={{ fontWeight: 400 }}>
          {text}
        </span>
      );
    }

    return (
      <span className={defaultClasses} style={{ fontWeight: 400 }}>
        {text.slice(0, index)}
        <span className="text-black font-semibold">
          {text.slice(index, index + query.length)}
        </span>
        <span className="text-[#464646]">
          {text.slice(index + query.length)}
        </span>
      </span>
    );
  }

  const handleSuggestionClick = (value: string) => {
    onClose();
    setTempQuery("");
    setSearchFocus(false);
    console.log("SC");
    router.push("/product_directory?search=" + encodeURIComponent(value));
  };

  const handleCategoryClick = (category: string) => {
    onClose();
    setTempQuery("");
    setSearchFocus(false);
    console.log("CC");
    router.push(`/product_directory?categories=${encodeURIComponent(category)}`);
  };

  const handleStoreClick = (storeID: string) => {
    onClose();
    setSearchFocus(false);
    console.log("StC");
    router.push("/store_profile/" + storeID);
  };

  const handleStoreListRoute = () => {
    onClose();
    setSearchFocus(false);
    const value = tempQuery;
    console.log("StLR");
    router.push("/store_listing?search=" + encodeURIComponent(value));
  };



  return (
    <div
      className="fixed inset-0 z-[100] bg-[#F2F2F2] text-black p-[14px] flex flex-col"
      ref={searchContainerRef}
    >
      <div className="flex justify-end">
        <Image
          src="/ListingMobileHeader/cross_button.svg"
          alt="Cross button"
          width={20}
          height={20}
          className="p-[5px] cursor-pointer"
          onClick={onClose}
        />
      </div>

      <div className="flex flex-col gap-4 px-4">
        {/* City/Area Select */}
        <div className="w-full flex items-center bg-white border-[1px] border-[#D7D7D7] rounded-full px-2">
          <Image
            src="/ListingPageHeader/location_pin.svg"
            alt="Location"
            width={24}
            height={24}
            className="opacity-100"
          />
          <Select
            options={
                    locationSearchInput.trim() === ""
                      ? groupedOptions.slice(0, 7)
                      : groupedOptions
                  }
            value={selectedOption}
            onChange={(val: SelectOption | null) => {
              if (!val || !val.value) {
                setCity(null);
                setArea(null);
              } else if (val.type === "area") {
                const parentCity = allCity.find((c) => c.name === val.city);
                if (parentCity) {
                  setArea({
                    id: val.value,
                    name: val.name,
                    city_name: val.city,
                  });
                  setCity(parentCity || null);
                }
              } else if (val.type === "city") {
                setCity({ id: val.value, name: val.name });
                setArea(null);
              }
            }}
            onInputChange={(inputValue) => {
              setLocationSearchInput(inputValue);
            }}
            getOptionValue={(e) => e.value}
            formatOptionLabel={(data: SelectOption, { context }) =>
              context === "menu" ? (
                <div>
                  <div className="font-semibold text-base text-[#0F0F0F]">
                    {data.name}
                  </div>
                  <div className="text-[#646464] text-sm">
                    {data.type === "city" ? data.country : data.city}
                  </div>
                </div>
              ) : (
                <span className="text-[#0F0F0F]">{data.name}</span>
              )
            }
            className={`${manrope.className} w-full rounded-full`}
            styles={customStyles}
            classNamePrefix="city-select"
            placeholder="City Name"
            isSearchable
          />
        </div>

        {/* Search Input */}
        <div className="flex items-center w-full bg-white border-[1px] border-[#D7D7D7] px-4 rounded-full"
          ref={dropdownRef}>
          <input
            type="text"
            placeholder="Saree for Mehndi"
            className={`${manrope.className} w-full h-[40px] text-[16px] focus:outline-none text-[#0F0F0F] px-2`}
            style={{ fontWeight: 400 }}
            value={tempQuery}
            onChange={(e) => setTempQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (tempQuery.length === 0 ) {
                setSearchFocus(true);
                setShowStoreType(true);
              }
            }}
          />
          <Image
            src="/ListingMobileHeader/search_lens.svg"
            alt="Search Lens"
            width={20}
            height={20}
            className="opacity-80 cursor-pointer"
            onClick={handleSearchClick}
          />
        </div>
        {showStoreType && (
          <MobileStoreTypeSearch
            visible={showStoreType}
            onClose={() => setShowStoreType(false)}
          />
        )}
      </div>

      {/* Conditional Content */}

      {/* <AnimatePresence> */}

      {showDropdown && (
        <div className="flex-grow overflow-y-auto scrollbar-none mt-2 bg-white rounded-xl px-2">
          {/* Search Suggestions */}
            <div className="flex flex-col mt-2">
              {/* ... (Existing suggestion mapping logic) ... */}
              {[...storeSuggestions, ...productSuggestions].map((suggestion, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 py-1 px-4 rounded-md hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <Image
                    src="/SuggestionBox/search_lens.svg"
                    alt="search"
                    width={13}
                    height={13}
                    className="opacity-80"
                  />
                  <span className="text-[14px]" style={{fontWeight: 400}}>
                    {highlightMatch(suggestion, tempQuery)}
                  </span>
                </div>
              ))}
            </div>


          {/* Categories */}
          {categories.length > 0 && (
            <div className={`${manrope.className} px-4 py-3`} style={{fontWeight:600}}>
              <div className="text-[#1F2937] text-[12px] mb-2 font-semibold">
                CATEGORY
              </div>
              <div className="flex gap-2 flex-wrap" style={{fontWeight:400}}>
                {categories.map((cat, i) => (
                  <button
                    key={i}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-[12px] text-black transition-all bg-gray-100 hover:bg-gray-200 cursor-pointer"
                    onClick={() => handleCategoryClick(cat.subcategory3)}
                  >
                    {cat?.subcategory3.includes("Kurta")
                      ? `${cat?.subcategory3} (${cat?.category})`
                      : cat?.subcategory3}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stores */}
          {stores.length > 0 && (
            <div className={`${manrope.className} px-4 py-2`}>
              <div className="flex justify-between items-center mb-1" style={{fontWeight:600}}>
                <span className="text-[12px] text-[#1F2937]">
                  STORES
                </span>
                <button
                  className="text-[12px] text-[#3A3A3A] font-normal cursor-pointer"
                  onClick={handleStoreListRoute}
                  style={{fontWeight:400}}
                >
                  View all
                </button>
              </div>
              {stores.map((store, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer"
                  onClick={() => handleStoreClick(store.store_id)}
                >
                  <img
                    src={store.profile_image || "/globe.svg"}
                    alt={store.store_name}
                    className="w-10 h-10 rounded-md object-cover bg-gray-200"
                  />
                  <div className="flex flex-col" style={{fontWeight:500}}>
                    <span className="text-[13px] text-[#1E1E1E]">
                      {store.store_name}
                    </span>
                    <span className="text-[11px] text-[#A6A6A6]">
                      {store.area &&
                        store.area.toLowerCase() === "others"
                        ? `${store.city}`
                        : `${store.area}, ${store.city}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}