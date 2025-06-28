"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Select = dynamic(() => import("react-select"), { ssr: false });
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { City, SelectOption } from "@/types/SellerTypes";
import { useHeaderStore } from "@/store/listing_header_store";
import { rubik, manrope } from "@/font";
import StoreSearchType from "./StoreSearchType";

export default function ListingPageHeader() {
  const sampleData = {
    categories: ["Trending Lehenga", "Bridal Lehenga", "Wedding Lehenga"],
    stores: [
      { name: "Amar Vilam Collection", location: "Ludhiana" },
      { name: "Nobel kaur collection", location: "Ludhiana" },
    ],
  };

  const { setCity, setQuery } = useHeaderStore();
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [tempQuery, setTempQuery] = useState<string>("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setQuery(tempQuery);
    }
  };

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
    if (selectedCity) setCity(selectedCity);
  }, [selectedCity]);

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
      <header className="bg-white shadow">
        <div className="grid grid-cols-[1fr_2fr_1fr] items-center px-20 py-4">
          {/* Left: Logo */}
          <div className="flex justify-start">
            <div className={`${rubik.className} text-[32px] font-bold`}>
              Attirelly
            </div>
          </div>

          {/* Center: City Select + Search Input */}
          <div className="flex justify-center">
            <div className="flex border border-gray-300 rounded-full items-center gap-4 w-full max-w-[600px] px-4 relative">
              {/* City Selector */}
              <div className="flex items-center gap-2 w-[250px] h-[24px]">
                <div className="opacity-80">
                  <img
                    src="/ListingPageHeader/location_pin.svg"
                    alt="Location"
                  />
                </div>
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

              {/* Search Input */}
              <div className="flex items-center px-4 py-2 w-full relative">
                <div className="mr-2 opacity-80">
                  <img src="/ListingPageHeader/search_lens.svg" alt="Search" />
                </div>
                <input
                  type="text"
                  placeholder="Find your style..."
                  className={`${manrope.className} w-[118px] h-[22px] text-[16px] focus:outline-none`}
                  style={{ fontWeight: 400 }}
                  value={tempQuery}
                  onChange={(e) => setTempQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />

                {tempQuery && (
                  <div className="absolute top-10 mt-2 bg-white border rounded-md shadow-lg max-h-[480px] overflow-y-auto z-50 max-w-[500px]">
                    {/* Suggestions */}
                    

                    {/* Categories */}
                    <div className="px-4">
                      <div className="text-gray-500 text-sm mb-2">CATEGORY</div>
                      <div className="flex gap-2 flex-wrap">
                        {sampleData.categories.map((cat, i) => (
                          <button
                            key={i}
                            className="text-sm bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200"
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Stores */}
                    <div className="p-4">
                      <div className="text-gray-500 text-sm mb-1">STORES</div>
                      {sampleData.stores.map((store, i) => (
                        <div
                          key={i}
                          className="flex items-start flex-col py-2 hover:bg-gray-100 rounded-md cursor-pointer"
                        >
                          <span className="font-medium text-sm">
                            {store.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {store.location}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: User & Cart */}
          <div className="flex justify-center">
            <div className="flex items-center justify-between gap-10 text-sm w-full max-w-[200px]">
              <div className="flex items-center gap-2">
                <span
                  className={`${manrope.className}`}
                  style={{ fontWeight: 400 }}
                >
                  Archit
                </span>
                <div className="opacity-100">
                  <img src="/ListingPageHeader/user_logo.svg" alt="User" />
                </div>
              </div>
              <div className="opacity-100 w-[32px] h-[32px]">
                <img src="/ListingPageHeader/shopping_cart.svg" alt="Cart" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex justify-center gap-8 py-2 text-sm text-gray-600">
          <a className={manrope.className} style={{ fontWeight: 400 }}>
            Men
          </a>
          <a className={manrope.className} style={{ fontWeight: 400 }}>
            Women
          </a>
        </nav>
      </header>

      {/* <StoreSearchType /> */}
    </div>
  );
}
