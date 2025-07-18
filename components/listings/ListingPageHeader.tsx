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
  const {
    city,
    setCity,
    query,
    setQuery,
    setStoreType,
    setSearchFocus,
    searchFocus,
  } = useHeaderStore();
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(city || null);
  const [tempQuery, setTempQuery] = useState<string>(query || "");

  const [storeSuggestions, setStoreSuggestions] = useState<string[]>([]);
  const [productSuggestions, setProductSuggestions] = useState<string[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showStoreType, setShowStoreType] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  console.log(city);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setQuery(tempQuery);
      setShowDropdown(false);
      setShowStoreType(false);
      router.push("/product_directory?search=" + encodeURIComponent(tempQuery));
    }
  };

  const handleSearchQuerySuggestion = async () => {
    try {
      let tempStr = "";
      console.log("selectedcity" , selectedCity)
      if (selectedCity) {
        tempStr = `city:${selectedCity.name}`;
      }
      const response = await api.post(`/search/search_suggestion`, {
        query: tempQuery,
        filters: tempStr
      });

      const data = response.data;
      console.log("stores", data.stores);
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
    router.prefetch("/store_listing");
    router.prefetch("/product_directory");
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
    if (selectedCity) {
      setCity(selectedCity);
    } else {
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
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [setSearchFocus]);

  const handleSuggestionClick = (value: string) => {
    setQuery(value);
    setSearchFocus(false);
    router.push("/product_directory?search=" + encodeURIComponent(value));
  };

  const handleCategoryClick = (category: string) => {
    setSearchFocus(false);
    router.push(`/product_directory?category=${encodeURIComponent(category)}`);
  };
  const handleProductClick = (value: string) => {
    setSearchFocus(false);
    router.push(`product_detail/${value}`);
  };

  const handleStoreClick = (storeID: string) => {
    setSearchFocus(false);
    router.push("/store_profile/" + storeID);
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

  function highlightMatch(text: string, query: string) {
    if (!query) return text;

    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text;

    return (
      <>
        {text.slice(0, index)}
        <span className="font-semibold text-black">
          {text.slice(index, index + query.length)}
        </span>
        <span className="text-gray-400">
          {text.slice(index + query.length)}
        </span>
      </>
    );
  }

  return (
    <div>
      <header className="bg-white shadow h-[70px]">
        <div className="grid grid-cols-[0.5fr_0.5fr_2fr_1fr] items-center px-20 h-full">
          <div className="flex justify-between items-center">
            <div
              className={`${rubik.className} text-[32px] font-bold cursor-pointer`}
              onClick={() => router.push("/homepage")}
            >
              Attirelly
            </div>
          </div>
          <div className="flex h-full items-center">
            <MenWomenNavbar />
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
                  className={`${manrope.className} w-full h-[22px] text-[16px] focus:outline-none`}
                  style={{ fontWeight: 400 }}
                  value={tempQuery}
                  onChange={(e) => {
                    setTempQuery(e.target.value);
                  }}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setSearchFocus(true)}
                />

                {showDropdown && (
                  <div className="absolute top-10 mt-2 bg-white rounded-md shadow-lg max-h-[480px] overflow-y-auto z-50 max-w-[500px] w-full">
                    <div className="flex flex-col gap-1">
                      {[...storeSuggestions, ...productSuggestions].map(
                        (suggestion, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 py-3 px-4 rounded-md hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            <img
                              src="/search.png"
                              alt="search"
                              className="w-4 h-4 opacity-80"
                            />
                            <span className="text-sm">
                              {highlightMatch(suggestion, tempQuery)}
                            </span>
                          </div>
                        )
                      )}
                    </div>

                    {/* categories */}
                    {categories.length > 0 && (
                      <div className="px-4 py-3">
                        <div className="text-gray-500 text-sm mb-2">
                          CATEGORIES
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {categories.map((cat, i) => (
                            <button
                              key={i}
                              className={
                                "flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all bg-gray-100 hover:bg-gray-200"
                              }
                              onClick={() =>
                                handleCategoryClick(cat.subcategory3)
                              }
                            >
                              {cat?.subcategory3}
                              <span className="text-lg">↗</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* products and stores */}

                    {/* {products.length > 0 && (
                      <div className="px-4 py-3">
                        <div className="text-gray-500 text-sm mb-2">
                          PRODUCTS
                        </div>
                        {products.map((product, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer"
                            onClick={() =>
                              handleProductClick(product.product_id)
                            }
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
                    )} */}

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
                              src={store.profile_image || "/globe.svg"}
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
