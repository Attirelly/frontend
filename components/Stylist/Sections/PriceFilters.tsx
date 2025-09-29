"use client";
import React, { useState, useEffect } from "react";
import { useStylist } from "@/store/stylist";
import { api } from "@/lib/axios";

interface StylistType {
  id: string;
  stylist_type: string;
}

interface PriceRange {
  id: string;
  label: string;
  lower_value: number;
  upper_value: number;
  active: boolean;
}

type StylistTypePriceRange = {
  stylist_type_id: string;
  price_range_id: string;
  stylist_type?: string;
  price_range?: string;
};

/**
 * PriceFiltersComponent component
 * 
 * A form component for the seller onboarding/dashboard that allows sellers to define
 * their pricing information. This includes a general price range for their products and specific
 * price tiers for each of their selected store types.
 *
 * ## Features
 * - **Dynamic Form Generation**: The form's structure is not static. It first fetches the seller's chosen store types (e.g., "Designer Label", "Boutiques") and then dynamically fetches the available price ranges for each of those types.
 * - **Average Price Range**: Provides inputs for the seller to specify the minimum and maximum average price of their products.
 * - **Grouped Price Tiers**: Displays checkboxes for price ranges, logically grouped under each of the seller's store types.
 * - **Data Hydration**: On mount, it populates its fields with any existing data from the `priceFiltersData` slice of the global `useSellerStore`.
 * - **Real-time Validation & State Sync**: A `useEffect` hook continuously validates the form. It requires the min/max prices to be set and at least one price range to be selected for *every* store type. When valid, it syncs the data back to the `useSellerStore`.
 *
 * ## Logic Flow
 * 1.  On component mount, a `useEffect` hook triggers a `fetchData` function.
 * 2.  `fetchData` first calls the `GET /stores/{storeId}` API to retrieve the seller's previously selected `store_types`.
 * 3.  It then makes a `POST /stores/store_types/price-range-ids` API call, sending the IDs of those store types. The backend returns a map of all relevant price ranges, grouped by store type.
 * 4.  This map is stored in the `storeTypePriceMap` state, which is crucial for rendering the form.
 * 5.  The component renders, mapping over the seller's `storeTypes`. For each store type, it renders a heading and then maps over the corresponding price ranges from `storeTypePriceMap` to create the checkboxes.
 * 6.  When a user interacts with the form (changes prices or checks/unchecks boxes), the local state is updated.
 * 7.  A master `useEffect` hook watches for changes in all input states. It validates the form's completeness and, if valid, packages the data and updates the `priceFiltersData` slice in the global `useSellerStore`.
 *
 * ## Imports
 * - **Core/Libraries**: `useEffect`, `useState` from `react`.
 * - **State (Zustand Stores)**:
 *    - `useSellerStore`: For reading the `storeId` and for both reading and writing the `priceFiltersData`.
 * - **Utilities**:
 *    - `api` from `@/lib/axios`: The configured Axios instance for API calls.
 *
 * ## Key Data Structures
 * - **StoreTypePriceRange**: A type that represents the link between a specific store type and a specific price range.
 * - **storeTypePriceMap**: A state variable (`Record<string, PriceRange[]>`) that holds the available price ranges for each of the seller's store types, mapping the store type ID to an array of its price ranges.
 *
 * ## API Calls
 * - GET `/stores/{storeId}`: Fetches the seller's basic store information, including their selected store types.
 * - POST `/stores/store_types/price-range-ids`: Fetches the available price ranges for a given list of store type IDs.
 *
 * ## Props
 * - This component does not accept any props.
 *
 * @returns {JSX.Element} The rendered price filters form.
 */
export default function PriceFiltersComponent() {
  const {
    stylistId,
    setPriceFiltersData,
    setPriceFiltersValid,
    priceFiltersData,
  } = useStylist();

  const [minPrice, setMinPrice] = useState(
    priceFiltersData?.avgPriceMin?.toString() || ""
  );
  const [maxPrice, setMaxPrice] = useState(
    priceFiltersData?.avgPriceMax?.toString() || ""
  );
  const [stylistTypes, setStylistTypes] = useState<StylistType[]>([]);
  const [stylistTypePriceMap, setStylistTypePriceMap] = useState<
    Record<string, PriceRange[]>
  >({});
  const [selectedPrices, setSelectedPrices] = useState<StylistTypePriceRange[]>(
    priceFiltersData?.priceRanges || []
  );


  useEffect(() => {
    if (!stylistId) return;
    const fetchData = async () => {
      try {
        // fetch store data
        const storeRes = await api.get(`/stores/${storeId}`);
        const storeData = storeRes.data;

        if (storeData?.store_types) {
          // get stores types related to particular store
          const fetchedStoreTypes: StylistType[] = storeData.store_types;
          setStylistTypes(fetchedStoreTypes);

          const storeTypeIds = fetchedStoreTypes.map((st) => st.id);

          // fetch price ranges corresponding to store types
          const priceRangeRes = await api.post(
            `/stores/store_types/price-range-ids`,
            {
              store_type_ids: storeTypeIds,
            }
          );

          const priceMap: Record<string, PriceRange[]> = {};
          priceRangeRes.data.forEach((entry: any) => {
            priceMap[entry.store_type_id] = entry.price_ranges;
          });

          setStoreTypePriceMap(priceMap);

          // Remove invalid selections
          const validStoreTypeIds = new Set(storeTypeIds);
          setSelectedPrices((prev) =>
            prev.filter((item) => validStoreTypeIds.has(item.store_type_id))
          );
        }
      } catch (error) {
        console.error("Error fetching store types or price ranges", error);
      }
    };

    fetchData();
  }, [stylistId]);

  const handleSelect = (
    stylistTypeId: string,
    priceRangeId: string,
    stylist_type: string,
    price_range: string
  ) => {
    setSelectedPrices((prev) => {
      const exists = prev.some(
        (item) =>
          item.stylist_type_id === stylistTypeId &&
          item.price_range_id === priceRangeId
      );

      if (exists) {
        // Remove if already selected
        return prev.filter(
          (item) =>
            !(
              item.stylist_type_id === stylistTypeId &&
              item.price_range_id === priceRangeId
            )
        );
      } else {
        // Add new selection
        return [
          ...prev,
          {
            stylist_type_id: stylistTypeId,
            stylist_type,
            price_range_id: priceRangeId,
            price_range,
          },
        ];
      }
    });
  };

  useEffect(() => {
    const allStoreTypesSelected = stylistTypes.every((stylistType) =>
      selectedPrices.some((entry) => entry.stylist_type_id === stylistType.id)
    );

    // set isValid = true if all mandatory selection are made, else false
    const isValid =
      minPrice.trim() !== "" && maxPrice.trim() !== "" && allStoreTypesSelected;

    setPriceFiltersValid(isValid);

    // if isValid = true, set zustand Price Filtes state
    if (isValid) {
      setPriceFiltersData({
        avgPriceMin: Number(minPrice),
        avgPriceMax: Number(maxPrice),
        priceRanges: selectedPrices,
        priceRangesStr: selectedPrices.map((item) => ({
          id: item.price_range_id,
          label: item.price_range ?? "",
        })),
      });
    }
  }, [minPrice, maxPrice, selectedPrices, stylistTypes]);

  return (
    <div className="p-4 sm:p-6 rounded-2xl shadow-sm space-y-4 mx-auto bg-white text-black">
      <div>
        <h2 className="text-base sm:text-lg font-semibold">Price filters</h2>
        <p className="text-xs sm:text-sm text-gray-500">
          Select price range you mostly sell your outfits at:
        </p>
      </div>

      <div className="-mx-4 sm:-mx-6 border-t border-gray-300"></div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 w-full">
          <label className="block text-xs sm:text-sm font-medium mb-1">
            Price Range of Most Sold Products<span className="text-red-500">*</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <div className="flex w-full border border-gray-300 rounded-md overflow-hidden">
              <span className="bg-gray-100 px-3 py-2 text-gray-500 select-none border-r border-gray-300 text-sm">
                Rs
              </span>
              <input
                type="number"
                placeholder="2000"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-3 text-sm"
              />
            </div>

            <span className="self-center hidden sm:block">-</span>

            <div className="flex w-full border border-gray-300 rounded-md overflow-hidden">
              <span className="bg-gray-100 px-3 py-2 text-gray-500 select-none border-r border-gray-300 text-sm">
                Rs
              </span>
              <input
                type="number"
                placeholder="25000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-3 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-grow border-t border-dotted border-gray-300"></div>

      <div className="space-y-6">
        {stylistTypes.map((stylistType) => (
          <div key={stylistType.id}>
            <h3 className="text-sm sm:text-base font-semibold mb-2">
              {stylistType.stylist_type}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
              {(stylistTypePriceMap[stylistType.id] || []).map((price) => {
                const isSelected = selectedPrices.some(
                  (entry) =>
                    entry.stylist_type_id === stylistType.id &&
                    entry.price_range_id === price.id
                );
                return (
                  <label
                    key={price.id}
                    className={`border rounded-lg p-3 sm:p-4 cursor-pointer transition ${
                      isSelected ? "bg-gray-100 border-gray-400" : "border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <input
                        type="checkbox"
                        name={`price-${stylistType.id}`}
                        value={price.id}
                        checked={isSelected}
                        onChange={() =>
                          handleSelect(
                            stylistType.id,
                            price.id,
                            stylistType.stylist_type,
                            price.label
                          )
                        }
                        className="accent-black h-4 w-4"
                      />
                      <div>
                        <div className="font-medium text-sm">{price.label}</div>
                        <div className="text-xs sm:text-sm text-gray-600">
                          Rs {price.lower_value.toLocaleString()} -{" "}
                          {price.upper_value.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

