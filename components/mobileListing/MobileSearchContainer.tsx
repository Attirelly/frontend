'use client';

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { useHeaderStore } from "@/store/listing_header_store";
import { SelectOption } from "@/types/SellerTypes";
import customStyles from "@/utils/selectStyles";
import { manrope } from "@/font";
import StoreSearchType from "../listings/StoreSearchType";
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

  const searchContainerRef = useRef<HTMLDivElement>(null);

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
      toast.error("Failed to fetch search suggestions");
    }
  };

  useEffect(() => {
    if (tempQuery.length < 4) {
      setStoreSuggestions([]);
      setProductSuggestions([]);
      setStores([]);
      setProducts([]);
      setShowStoreType(true);
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


  const groupedOptions: SelectOption[] = [
    { value: "", label: "City Name", name: "City Name", country: "" },
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
    router.push("/product_directory?search=" + encodeURIComponent(value));
  };

  const handleCategoryClick = (category: string) => {
    onClose();
    setTempQuery("");
    setSearchFocus(false);
    router.push(`/product_directory?categories=${encodeURIComponent(category)}`);
  };

  const handleStoreClick = (storeID: string) => {
    onClose();
    setSearchFocus(false);
    router.push("/store_profile/" + storeID);
  };

  const handleStoreListRoute = () => {
    onClose();
    setSearchFocus(false);
    const value = tempQuery;
    router.push("/store_listing?search=" + encodeURIComponent(value));
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-white text-black p-[14px] flex flex-col"
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

      <div className="flex flex-col gap-4">
        {/* City/Area Select */}
        <div className="w-full flex items-center border border-gray-300 rounded-lg px-2">
          <Image
            src="/ListingMobileHeader/location_pin.svg"
            alt="Location"
            width={12}
            height={12}
            className="opacity-100"
          />
          <Select
            options={groupedOptions}
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
            className={`${manrope.className} w-full`}
            styles={customStyles}
            classNamePrefix="city-select"
            placeholder="City Name"
            isSearchable
          />
        </div>

        {/* Search Input */}
        <div className="flex items-center w-full border border-gray-300 rounded-lg px-4">
          <Image
            src="/ListingMobileHeader/search_lens.svg"
            alt="Search Lens"
            width={20}
            height={20}
            className="opacity-80"
          />
          <input
            type="text"
            placeholder="Saree for Mhendi"
            className={`${manrope.className} w-full h-[40px] text-[16px] focus:outline-none text-[#0F0F0F] px-2`}
            style={{ fontWeight: 400 }}
            value={tempQuery}
            onChange={(e) => setTempQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (tempQuery.length === 0) {
                setShowStoreType(true);
                setSearchFocus(true);
              }
              // setShowDropdown(true);
              
            }}
          />
        </div>
      </div>

      {/* Conditional Content */}
      <div className="flex-grow overflow-y-auto scrollbar-none mt-4">
        {/* <AnimatePresence> */}
          {searchFocus && tempQuery.length === 0 && (
              <StoreSearchType visible={showStoreType} onClose={() => setShowStoreType(false)} />
          )}

        <AnimatePresence>
          {tempQuery.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Search Suggestions */}
              {storeSuggestions.length > 0 || productSuggestions.length > 0 ? (
                <div className="flex flex-col gap-1">
                  {/* ... (Existing suggestion mapping logic) ... */}
                  {[...storeSuggestions, ...productSuggestions].map((suggestion, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 py-3 px-4 rounded-md hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <Image
                        src="/SuggestionBox/search_lens.svg"
                        alt="search"
                        width={16}
                        height={16}
                        className="opacity-80"
                      />
                      <span className="text-sm">
                        {highlightMatch(suggestion, tempQuery)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-grow flex flex-col items-center justify-center p-8 text-center text-gray-500">
                  <Image
                    src="/ListingMobileHeader/no-results.svg"
                    alt="No results found"
                    width={150}
                    height={150}
                    className="mb-4"
                  />
                  <h3 className="text-lg font-semibold">Sorry, Nothing to show here</h3>
                  <p className="text-sm mt-1">
                    Probably a wrong search or typo, please try again.
                  </p>
                </div>
              )}

              {/* Categories */}
              {categories.length > 0 && (
                <div className={`${manrope.className} px-4 py-3 mt-4`}>
                  <div className="text-[#1F2937] text-base mb-2 font-semibold">
                    CATEGORY
                  </div>
                  <div className="flex gap-2 flex-wrap font-normal">
                    {categories.map((cat, i) => (
                      <button
                        key={i}
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm text-black transition-all bg-gray-100 hover:bg-gray-200 cursor-pointer"
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
                <div className={`${manrope.className} p-4 mt-4`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-base text-[#1F2937] font-semibold">
                      STORES
                    </span>
                    <button
                      className="text-sm text-[#3A3A3A] font-normal cursor-pointer"
                      onClick={handleStoreListRoute}
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
                      <div className="flex flex-col">
                        <span className="text-base text-[#1E1E1E]">
                          {store.store_name}
                        </span>
                        <span className="text-sm text-[#A6A6A6]">
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}