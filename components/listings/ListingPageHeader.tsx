"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { Area, City, SelectOption } from "@/types/SellerTypes";
import { useHeaderStore } from "@/store/listing_header_store";
import { rubik, manrope, rosario } from "@/font";
import StoreSearchType from "./StoreSearchType";
import { useRouter } from "next/navigation";
import MenWomenNavbar from "./MenWomenNavbar";
import CustomerSignIn from "../Customer/CustomerSignIn";
import useAuthStore from "@/store/auth";
import customStyles from "@/utils/selectStyles";
import Image from "next/image";
import { logout } from "@/utils/logout";
import { useProductFilterStore } from "@/store/filterStore";

const Select = dynamic(() => import("react-select"), { ssr: false });

export default function ListingPageHeader() {
  const router = useRouter();
  const {
    city,
    setCity,
    area,
    setArea,
    query,
    setQuery,
    setStoreType,
    setSearchFocus,
    searchFocus,
    storeType,
  } = useHeaderStore();

  const { setCategory } = useProductFilterStore();
  const { user } = useAuthStore();
  const [signIn, setSignIn] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(city || null);
  const [selectedArea, setSelectedArea] = useState<Area | null>(area || null);
  const [tempQuery, setTempQuery] = useState<string>(query || "");

  const [storeSuggestions, setStoreSuggestions] = useState<string[]>([]);
  const [productSuggestions, setProductSuggestions] = useState<string[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showStoreType, setShowStoreType] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [locationSearchInput, setLocationSearchInput] = useState("");

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    console.log("showDropdown changed:", showDropdown);
  }, [showDropdown]);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = tempQuery.trim();

      // Only search if query is not empty
      
      setShowDropdown(false);
      setShowStoreType(false);
      setCategory("");
      setQuery("");
      setSearchFocus(false);
      if (trimmed !== "") {
        router.push("/product_directory?search=" + encodeURIComponent(trimmed));
      }
    }
  };

  const handleSearchQuerySuggestion = async () => {
    try {
      let tempStr = "";
      console.log("selectedcity", selectedCity);
      if (selectedCity) {
        tempStr = `city:${selectedCity.name}`;
      }
      if (selectedArea) {
        tempStr = `area:${selectedArea.name}`;
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
    router.prefetch("/store_listing");
    router.prefetch("/product_directory");
    router.prefetch("/homepage");
    router.prefetch("/");
  }, [router]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await api.get("/location/cities/");
        console.log("cities data", res.data);
        setCities(res.data);
      } catch {
        toast.error("Failed to fetch cities");
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const res = await api.get("/location/areas/");
        console.log("areas data", res.data);
        setAreas(res.data);
      } catch {
        toast.error("Failed to fetch areas");
      }
    };
    fetchAreas();
  }, []);

  useEffect(() => {
    if (selectedCity) {
      setCity(selectedCity);
    } else {
      setCity(null);
    }
  }, [selectedCity]);

  useEffect(() => {
    if (selectedArea) {
      setArea(selectedArea);
    } else {
      setArea(null);
    }
  }, [selectedArea]);

  useEffect(() => {
    if (tempQuery.length < 4) {
      setStoreSuggestions([]);
      setProductSuggestions([]);
      setStores([]);
      setProducts([]);
      setShowDropdown(false);
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

  useEffect(() => {
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
  }, [searchFocus]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowLogout(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSuggestionClick = (value: string) => {
    setQuery(value);
    setSearchFocus(false);
    setShowDropdown(false);
    setCategory("");
    setQuery("");
    router.push("/product_directory?search=" + encodeURIComponent(value));
  };

  const handleCategoryClick = (category: string) => {
    setSearchFocus(false);
    setShowDropdown(false);
    setQuery("");
    router.push(`/product_directory?category=${encodeURIComponent(category)}`);
  };
  const handleProductClick = (value: string) => {
    setSearchFocus(false);
    setShowDropdown(false);
    router.push(`product_detail/${value}`);
  };

  const handleStoreClick = (storeID: string) => {
    setSearchFocus(false);
    setShowDropdown(false);
    router.push("/store_profile/" + storeID);
  };

  const handleStoreListRoute = () => {
    setSearchFocus(false);
    setQuery("");
    setShowDropdown(false);
    router.push("/store_listing?search=" + encodeURIComponent(tempQuery));
  };

  // const cityOptions: SelectOption[] = [
  //   { value: "", label: "All Cities", name: "All Cities", country: "" },
  //   ...cities.map((c) => ({
  //     value: c.id,
  //     label: c.name,
  //     name: c.name,
  //     country: "India",
  //   })),
  // ];

  const groupedOptions: SelectOption[] = [
    { value: "", label: "All Cities", name: "All Cities", country: "" },
    ...cities.map((c) => ({
      value: c.id,
      label: c.name,
      name: c.name,
      country: "India",
      type: "city",
    })),
    ...areas.map((a) => ({
      value: a.id,
      label: a.name,
      name: a.name,
      country: "India",
      type: "area",
      city: a.city_name,
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
      : selectedArea != null
      ? {
          value: selectedArea.id,
          label: selectedArea.name,
          name: selectedArea.name,
          city: selectedArea.city_name,
        }
      : // : cityOptions[0];
        groupedOptions[0];

  function highlightMatch(text: string, query: string) {
    const defaultClasses = `${manrope.className} text-base text-gray-400`;

    if (!query) {
      return (
        <div className={defaultClasses} style={{ fontWeight: 400 }}>
          {text}
        </div>
      );
    }

    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) {
      return (
        <div className={defaultClasses} style={{ fontWeight: 400 }}>
          {text}
        </div>
      );
    }

    return (
      <div className={defaultClasses} style={{ fontWeight: 400 }}>
        {text.slice(0, index)}
        <span className="text-black">
          {text.slice(index, index + query.length)}
        </span>
        <span className="text-gray-400">
          {text.slice(index + query.length)}
        </span>
      </div>
    );
  }

  return (
    <div>
      <header className="bg-white shadow h-[72px]">
        <div className="grid grid-cols-[0.5fr_0.5fr_2fr_1fr] items-center px-[83px] h-full">
          <div className="flex justify-center items-center">
            <div
              className={`${rosario.className} text-[34px] text-[#373737] font-bold cursor-pointer`}
              // onClick={() => router.push("/homepage")}
              onClick={() => {
                setQuery("");
                router.push("/");
              }}
              style={{ fontWeight: 600 }}
            >
              Attirelly
            </div>
          </div>
          <div className="flex h-full items-center justify-center">
            <MenWomenNavbar />
          </div>
          <div className="flex justify-center">
            <div className="flex border border-gray-300 rounded-full items-center gap-4 w-full max-w-[611px] px-4 relative">
              <div className="flex items-center gap-2 w-[280px] h-[24px]">
                <img
                  src="/ListingPageHeader/location_pin.svg"
                  alt="Location"
                  className="opacity-100"
                />
                <Select
                  options={
                    locationSearchInput.trim() === ""
                      ? groupedOptions.slice(0, 6)
                      : groupedOptions
                  }
                  value={selectedOption}
                  onChange={(val) => {
                    const v = val as SelectOption | null;
                    const city = cities.find((c) => c.id === v?.value);
                    setSelectedCity(city || null);
                    const area = areas.find((a) => a.id === v?.value);
                    setSelectedArea(area || null);
                  }}
                  onInputChange={(value) => setLocationSearchInput(value)} // capture search text
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
                  className={`${manrope.className} w-full scrollbar-thin `}
                  styles={customStyles}
                  classNamePrefix="city-select"
                  placeholder="City Name"
                  isSearchable
                />
              </div>

              <div className="border-l-2 border-gray-300 h-5 my-2" />

              <div
                className="flex items-center px-2 py-2 w-full relative"
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
                  className={`${manrope.className} w-full h-[22px] text-[16px] focus:outline-none text-[#0F0F0F]`}
                  style={{ fontWeight: 400 }}
                  value={tempQuery}
                  onChange={(e) => {
                    setTempQuery(e.target.value);
                  }}
                  onKeyDown={handleKeyDown}
                  onFocus={() => {
                    if (tempQuery.length == 0) {
                      setShowStoreType(true);
                    }
                    setShowDropdown(true);
                    setSearchFocus(true);
                  }}
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
                              src="/SuggestionBox/search_lens.svg"
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
                      <div
                        className={`${manrope.className} px-4 py-3`}
                        style={{ fontWeight: 600 }}
                      >
                        <div className="text-[#1F2937] text-base mb-2">
                          CATEGORY
                        </div>
                        <div
                          className="flex gap-2 flex-wrap"
                          style={{ fontWeight: 400 }}
                        >
                          {categories.map((cat, i) => (
                            <button
                              key={i}
                              className={
                                "flex items-center gap-2 px-4 py-2 rounded-full text-sm text-black transition-all bg-gray-100 hover:bg-gray-200 cursor-pointer"
                              }
                              onClick={() =>
                                handleCategoryClick(cat.subcategory3)
                              }
                            >
                              {cat?.subcategory3}
                              <img
                                src="/SuggestionBox/top_right_arrow.svg"
                                alt="Arrow"
                                className="w-3 h-3"
                              />
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
                      <div
                        className={`${manrope.className} p-4`}
                        style={{ fontWeight: 500 }}
                      >
                        <div className="flex justify-between mb-1">
                          <span
                            className="text-base text-[#1F2937]"
                            style={{ fontWeight: 600 }}
                          >
                            STORES
                          </span>
                          <span
                            className="text-sm text-[#3A3A3A] cursor-pointer"
                            style={{ fontWeight: 400 }}
                            onClick={handleStoreListRoute}
                          >
                            View all
                          </span>
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

          {/* <div className="flex justify-center"> */}
          <div className="flex items-center gap-6 text-sm w-full justify-end">
            {/* <img
                src="/ListingPageHeader/shopping_cart_2.svg"
                alt="Cart"
                className="opacity-100 w-[32px] h-[32px]"
              />
              <div className="w-px h-10 bg-gray-300"></div> */}
            {!user ? (
              <div className="flex items-center gap-2">
                {/* <img
                  src="/ListingPageHeader/user_logo.svg"
                  alt="User"
                  className="opacity-100"
                /> */}
                <span
                  className={`${manrope.className} text-base text-[#373737] cursor-pointer`}
                  style={{ fontWeight: 400 }}
                  onClick={() => setSignIn(true)}
                >
                  Login
                </span>
              </div>
            ) : (
              <div className="relative" ref={userMenuRef}>
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => setShowLogout((prev) => !prev)}
                >
                  <Image
                    src="/ListingPageHeader/user_logo.svg"
                    alt="User"
                    width={24}
                    height={24}
                    className="opacity-100"
                  />
                  <span
                    className={`${manrope.className} text-base text-[#373737] cursor-pointer`}
                    style={{ fontWeight: 400 }}
                    onClick={() => setSignIn(true)}
                  >
                    {user.name}
                  </span>
                </div>
                {showLogout && (
                  <div className="absolute top-full right-0 mt-2 bg-white border rounded shadow-md z-50 p-2 w-32">
                    <button
                      className="w-full text-left text-[#373737] hover:bg-gray-100 px-2 py-1 text-sm"
                      onClick={() => {
                        logout(); // replace with your logout function
                        setShowLogout(false);
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          {/* </div> */}
        </div>
      </header>

      <StoreSearchType
        visible={showStoreType}
        onClose={() => setShowStoreType(false)}
      />
      {signIn && !user?.id && (
        <CustomerSignIn
          onClose={() => setSignIn(false)}
          onSuccess={() => setSignIn(false)}
        />
      )}
    </div>
  );
}
