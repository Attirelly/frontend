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
import { useFilterStore, useProductFilterStore } from "@/store/filterStore";

const Select = dynamic(() => import("react-select"), { ssr: false });

type Props = {
  className?: string;
};

/**
 * ListingPageHeader Component
 *
 * The primary header component for the desktop version of the website.
 *
 * ## Features
 * - Displays a multi-section header bar with:
 * - **Logo** (links to the homepage).
 * - **Main Navigation** using the {@link MenWomenNavbar} component.
 * - **Combined Search Bar** with location and text search capabilities.
 * - Location filtering by City or Area using a searchable dropdown.
 * - Debounced, real-time search suggestions for products, stores, and categories.
 * - Highlights matching text in search results for better visibility.
 * - **User Authentication** status, showing a "Login" button or the user's name
 * with a logout dropdown.
 * - Manages state for:
 * - Search focus and suggestion dropdown visibility.
 * - Customer sign-in modal.
 * - User menu (logout) dropdown.
 *
 * ## Imports
 * - **Fonts**: `rubik`, `manrope`, `rosario` from `@/font`
 * - **State (Zustand Stores)**:
 *    - `useHeaderStore` for managing location and search query state.
 *    - `useProductFilterStore` for filter-related actions.
 *    - `useAuthStore` for user authentication state.
 * - **Key Components**:
 *    - {@link MenWomenNavbar} (main category navigation)
 *    - {@link CustomerSignIn} (login modal)
 *    - {@link StoreSearchType} (UI element for search)
 * - `react-select` (for the location dropdown, loaded dynamically)
 * - **Libraries**:
 *    - `next/dynamic`, `next/link`, `next/image`, `next/navigation` (Next.js utilities)
 *    - `sonner` (`toast`) for notifications
 * - **Types**:
 *    - {@link Area}, {@link City}, {@link SelectOption} from `@/types/SellerTypes`
 * - **Utilities**:
 *    - `api` from `@/lib/axios` for API calls
 *    - `logout` from `@/utils/logout`
 *    - `customStyles` for styling the `react-select` component
 *
 * ## API Calls
 * - `POST /search/search_suggestion`: Fetches dynamic search suggestions based on user input and location filters.
 * - `GET /location/cities/`: Fetches the list of all available cities on mount.
 * - `GET /location/areas/`: Fetches the list of all available areas on mount.
 *
 * ## Props
 * @param {object} props - Component props
 * @param {string} [props.className] - Optional CSS class for styling the root container.
 *
 * @returns {JSX.Element} The rendered desktop header component.
 */
export default function ListingPageHeader({ className }: Props) {
  const router = useRouter();
  const {
    city,
    setCity,
    area,
    setArea,
    setSearchFocus,
    searchFocus,
    allCity,
    setAllCity,
    allArea,
    setAllArea,
    setQuery,
  } = useHeaderStore();
  const { resetFilters } = useProductFilterStore();

  const { user } = useAuthStore();
  const [signIn, setSignIn] = useState(false);
  const [tempQuery, setTempQuery] = useState<string>("");

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


  /**
   * Prefetches key routes for faster navigation.
   */
  useEffect(() => {
    router.prefetch("/store_listing");
    router.prefetch("/product_directory");
    router.prefetch("/homepage");
    router.prefetch("/");
  }, [router]);

  /**
   * Handles the "Enter" key press in the search input.
   * if pressed and the search input is not empty, it navigates to the product directory with the current search query.
   * Also resets relevant states and filters.
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = tempQuery.trim();
      setShowDropdown(false);
      setShowStoreType(false);
      setTempQuery("");
      setSearchFocus(false);

      if (trimmed !== "") {
        setQuery("");
        router.push("/product_directory?search=" + encodeURIComponent(trimmed));
      }
    }
  };

  /**
   * Fetches search suggestions based on the current temporary query and selected location filters.
   * Updates the state with the fetched suggestions and shows the dropdown.
   * If there's an error during the fetch, it logs the error to the console.
   *
   * This function is debounced in the `useEffect` hook to limit API calls while typing.
   */
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
      console.log("data", data);
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

  /**
   * Fetches all cities for the location filter.
   */
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
  }, []);

  /**
   * Fetches all areas for the location filter.
   */
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const res = await api.get("/location/areas/");
        setAllArea(res.data);
      } catch {
        toast.error("Failed to fetch areas");
      }
    };
    fetchAreas();
  }, []);

  /**
   * Effect hook that triggers search suggestions fetching when the temporary query changes.
   * - If the query length is less than 4, it clears suggestions and hides the dropdown.
   * - If the query length is exactly 4, it fetches suggestions immediately.
   * - For longer queries, it debounces the fetch by 100ms to limit API calls while typing.
   */
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

  /**
   * Effect hook that handles clicks outside the dropdown.
   * If a click occurs outside, it hides the dropdown, store type selector, and removes focus from the search input.
   */
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


  /**
   * Effect hook that handles clicks outside the user menu to close it.
   * If a click occurs outside, it hides the logout dropdown.
   */
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

  /**
   * Handles clicks on search suggestions.
   * If a suggestion is clicked, it navigates to the product directory with the selected suggestion.
   */
  const handleSuggestionClick = (value: string) => {
    setSearchFocus(false);
    setShowDropdown(false);
    setTempQuery("");
    router.push("/product_directory?search=" + encodeURIComponent(value));
  };

  /**
   * Handles clicks on category suggestions.
   * If a category is clicked, it navigates to the product directory with the selected category.
   */
  const handleCategoryClick = (category: string) => {
    setSearchFocus(false);
    setShowDropdown(false);
    setTempQuery("");

    router.push(
      `/product_directory?categories=${encodeURIComponent(category)}`
    );
  };


  /**
   * Handles clicks on store suggestions.
   * If a store is clicked, it navigates to the store profile page of the selected store.
   */
  const handleStoreClick = (storeID: string) => {
    setSearchFocus(false);
    setShowDropdown(false);
    router.push("/store_profile/" + storeID);
  };

  /**
   * Handles navigation to the store listing page with the current search query.
   * Resets relevant states and filters before navigating.
   */
  const handleStoreListRoute = () => {
    setSearchFocus(false);
    setShowDropdown(false);
    const value = tempQuery;
    router.push("/store_listing?search=" + encodeURIComponent(value));
  };

  /**
   * Groups options for the location selector.
   * Includes "All Cities", individual cities, and areas with their respective metadata.
   */
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

  /* Determines the currently selected option in the location selector based on the selected area or city.
   * Defaults to "All Cities" if neither is selected.
   */
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
      : // : cityOptions[0];
        groupedOptions[0];
      
  /**
   * Highlights matching text within a string based on a query.
   * @param text - The text to search within.
   * @param query - The query string to match.
   * @returns A JSX element with highlighted matching text.
   */
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
    <div className={`${className} sticky top-0 z-1000`}>
      <header className="bg-white shadow-[0_2px_1px_-1px_rgba(0,0,0,0.1)] h-[72px]">
        <div className="grid grid-cols-[0.5fr_0.5fr_2fr_1fr] items-center px-[83px] h-full">
          <div className="flex justify-center items-center">
            <div
              className={`${rosario.className} text-[34px] text-[#373737] font-bold cursor-pointer`}
              onClick={() => {
                router.push("/");
              }}
              style={{ fontWeight: 600 }}
            >
              Attirelly
            </div>
          </div>
          <div
            className="flex h-full items-center justify-center"
            onMouseEnter={() => setSearchFocus(false)}
          >
            <MenWomenNavbar />
          </div>
          <div className="flex justify-center">
            <div className="flex border border-gray-300 rounded-full items-center gap-4 w-full max-w-[611px] px-4 relative">
              <div className="flex items-center w-[380px] h-[24px]">
                <img
                  src="/ListingPageHeader/location_pin.svg"
                  alt="Location"
                  className="opacity-100"
                />
                {/* show only 7 options when not searched */}
                <Select
                  options={
                    locationSearchInput.trim() === ""
                      ? groupedOptions.slice(0, 7)
                      : groupedOptions
                  }
                  value={selectedOption}
                  onChange={(val: SelectOption | null) => {
                    if (!val || !val.value) {
                      // "All Cities" is selected
                      setCity(null);
                      setArea(null);
                    } else if (val.type === "area") {
                      // When an area is selected, find its parent city to keep the state consistent
                      const parentCity = allCity.find(
                        (c) => c.name === val.city
                      );
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
                  <div className="absolute top-10 transform -translate-x-10 mt-2 bg-white rounded-md shadow-lg max-h-[480px] overflow-y-auto scrollbar-none z-50 max-w-[500px] w-[400px]">
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
                              {cat?.subcategory3.includes("Kurta")
                                ? `${cat?.subcategory3} (${cat?.category})`
                                : cat?.subcategory3}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

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
            </div>
          </div>

          {/* <div className="flex justify-center"> */}
          <div className="flex items-center gap-6 text-sm w-full justify-end">
            {!user ? (
              <div className="flex items-center gap-2">
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
