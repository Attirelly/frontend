"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { City, SelectOption } from "@/types/SellerTypes";
import { useHeaderStore } from "@/store/listing_header_store";
import { rubik, manrope } from "@/font";
import StoreSearchType from "./StoreSearchType";
import { useRouter } from "next/navigation";
import MenWomenNavbar from "./MenWomenNavbar";

const Select = dynamic(() => import("react-select"), { ssr: false });

export default function ListingPageHeader() {
  const router = useRouter();
  const { setCity, setQuery, setStoreType, setSearchFocus, searchFocus } = useHeaderStore();
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [tempQuery, setTempQuery] = useState<string>("");

  const [storeSuggestions, setStoreSuggestions] = useState<string[]>([]);
  const [productSuggestions, setProductSuggestions] = useState<string[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showStoreType, setShowStoreType] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setQuery(tempQuery);
      setShowDropdown(false);
      setShowStoreType(false);
    }
  };

  const handleSearchQuerySuggestion = async () => {
    try {
      const response = await api.post("/search/search_suggestion", {
        query: tempQuery
      });

      const data = response.data;
      setStoreSuggestions(data.store_search_suggestion || []);
      setProductSuggestions(data.product_search_suggestion || []);
      setStores(data.stores || []);
      setProducts(data.products || []);
      setShowDropdown(true);
    } catch (error) {
      toast.error("Failed to fetch search suggestions");
    }
  };

  useEffect(() => {
    router.prefetch("/store_listing");
    router.prefetch("/homepage");
  }, [router]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await api.get("/location/cities/");
        setCities(res.data);
      } catch {
        toast.error("Failed to fetch cities");
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    if (selectedCity){
      
      setCity(selectedCity);
    }
    else{
      setCity(null);
    }
     
  }, [selectedCity]);

  useEffect(() => {
    if (tempQuery.length < 4) {
      setStoreSuggestions([]);
      setProductSuggestions([]);
      setStores([]);
      setProducts([]);
      setShowDropdown(false);
      setShowStoreType(tempQuery === "");
      return;
    }

    const debounce = setTimeout(() => {
      handleSearchQuerySuggestion();
    }, 400);

    return () => clearTimeout(debounce);
  }, [tempQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
        // setShowStoreType(false);
        setSearchFocus(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setSearchFocus]);

  const handleSuggestionClick = (value: string) => {
    setQuery(value);
    router.push("/store_listing");
  };

  const handleProductClick = (value: string) => {
    router.push(`product_detail/${value}`)
  };

  const handleStoreClick = (storeID :string) => {
    router.push('/store_profile/'+storeID);
  };

  const cityOptions: SelectOption[] = [
    { value: "", label: "All Cities", name: "All Cities", country: "" },
    ...cities.map((c) => ({
      value: c.id,
      label: c.name,
      name: c.name,
      country: "India",
    })),
  ];

  const selectedOption: SelectOption =
    selectedCity != null
      ? {
        value: selectedCity.id,
        label: selectedCity.name,
        name: selectedCity.name,
        country: "India",
      }
      : cityOptions[0];

  return (
    <div>
      <header className="bg-white shadow h-[70px]">
        <div className="grid grid-cols-[0.5fr_0.5fr_2fr_1fr] items-center px-20 h-full">
          <div className="flex justify-between items-center">
            <div className={`${rubik.className} text-[32px] font-bold cursor-pointer`}
            onClick={()=>router.push("/homepage")}>
              Attirelly
            </div>
            

          </div>
<div className="flex h-full items-center">
             <MenWomenNavbar/>
            </div>
          <div className="flex justify-center">
            <div className="flex border border-gray-300 rounded-full items-center gap-4 w-full max-w-[600px] px-4 relative">
              <div className="flex items-center gap-2 w-[250px] h-[24px]">
                <img
                  src="/ListingPageHeader/location_pin.svg"
                  alt="Location"
                  className="opacity-80"
                />
                <Select
                  options={cityOptions}
                  value={selectedOption}
                  onChange={(val) => {
                    const v = val as SelectOption | null;
                    const city = cities.find((c) => c.id === v?.value);
                    setSelectedCity(city || null);
                  }}
                  getOptionValue={(e) => e.value}
                  formatOptionLabel={(data, { context }) =>
                    context === "menu" ? (
                      <div>
                        <div className="font-semibold text-base">
                          {data.name}
                        </div>
                        <div className="text-gray-500 text-sm">
                          {data.country}
                        </div>
                      </div>
                    ) : (
                      <span>{data.name}</span>
                    )
                  }
                  className={`${manrope.className} w-full`}
                  classNamePrefix="city-select"
                  placeholder="City Name"
                  isSearchable
                />
              </div>

              <div className="border-l-2 border-gray-300 h-5 my-2" />

              <div
                className="flex items-center px-4 py-2 w-full relative"
                ref={dropdownRef}
              >
                <img
                  src="/ListingPageHeader/search_lens.svg"
                  alt="Search"
                  className="mr-2 opacity-80"
                />
                <input
                  type="text"
                  placeholder="Find your style..."
                  className={`${manrope.className} w-[118px] h-[22px] text-[16px] focus:outline-none`}
                  style={{ fontWeight: 400 }}
                  value={tempQuery}
                  onChange={(e) => {
                    setTempQuery(e.target.value);
                  }}
                  onKeyDown={handleKeyDown}
                  onFocus={()=>setSearchFocus(true)}
                  
                />

                {showDropdown && (
                  <div className="absolute top-10 mt-2 bg-white rounded-md shadow-lg max-h-[480px] overflow-y-auto z-50 max-w-[500px] w-full">
                    {(storeSuggestions.length > 0 ||
                      productSuggestions.length > 0) && (
                        <div className="px-4 py-3">
                          <div className="text-gray-500 text-sm mb-2">
                            SUGGESTIONS
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            {[...storeSuggestions, ...productSuggestions].map(
                              (suggestion, i) => (
                                <button
                                  key={i}
                                  className="text-sm bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200"
                                  onClick={() => handleSuggestionClick(suggestion)}
                                >
                                  {suggestion}
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {products.length > 0 && (
                      <div className="px-4 py-3">
                        <div className="text-gray-500 text-sm mb-2">
                          PRODUCTS
                        </div>
                        {products.map((product, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer"
                            onClick={() => handleProductClick(product.product_id)}
                          >
                            <img
                              src={product.image || "/placeholder.png"}
                              alt={product.product_name}
                              className="w-10 h-10 rounded-md object-cover bg-gray-200"
                            />
                            <span className="font-medium text-sm">
                              {product.product_name}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {stores.length > 0 && (
                      <div className="p-4">
                        <div className="text-gray-500 text-sm mb-1">STORES</div>
                        {stores.map((store, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer"
                            onClick={() => handleStoreClick(store.store_id)}
                          >
                            <img
                              src={store.profile_image || "/placeholder.png"}
                              alt={store.store_name}
                              className="w-10 h-10 rounded-md object-cover bg-gray-200"
                            />
                            <div className="flex flex-col">
                              <span className="font-medium text-sm">
                                {store.store_name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {store.area}, {store.city}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="flex items-center gap-6 text-sm w-full max-w-[200px]">
              <img
                src="/ListingPageHeader/shopping_cart_2.svg"
                alt="Cart"
                className="opacity-100 w-[32px] h-[32px]"
              />
              <div className="w-px h-10 bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <img
                  src="/ListingPageHeader/user_logo.svg"
                  alt="User"
                  className="opacity-100"
                />
                <span
                  className={`${manrope.className}`}
                  style={{ fontWeight: 400 }}
                >
                  Archit
                </span>

              </div>

            </div>
          </div>
        </div>
      </header>

      <StoreSearchType
        visible={showStoreType}
        onClose={() => setShowStoreType(false)}
      />
    </div>
  );
}


