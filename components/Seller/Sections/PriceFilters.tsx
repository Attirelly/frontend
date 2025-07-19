"use client";
import React, { useState, useEffect } from "react";
import { useSellerStore } from "@/store/sellerStore";
import { api } from "@/lib/axios";

interface StoreType {
  id: string;
  store_type: string;
}

interface PriceRange {
  id: string;
  label: string;
  lower_value: number;
  upper_value: number;
  active: boolean;
}

type StoreTypePriceRange = {
  store_type_id: string;
  price_range_id: string;
  store_type?: string;
  price_range?: string;
};

export default function PriceFiltersComponent() {
  const {
    storeId,
    setPriceFiltersData,
    setPriceFiltersValid,
    priceFiltersData,
  } = useSellerStore();

  const [minPrice, setMinPrice] = useState(
    priceFiltersData?.avgPriceMin?.toString() || ""
  );
  const [maxPrice, setMaxPrice] = useState(
    priceFiltersData?.avgPriceMax?.toString() || ""
  );
  const [storeTypes, setStoreTypes] = useState<StoreType[]>([]);
  const [storeTypePriceMap, setStoreTypePriceMap] = useState<
    Record<string, PriceRange[]>
  >({});
  const [selectedPrices, setSelectedPrices] = useState<StoreTypePriceRange[]>(
    priceFiltersData?.priceRanges || []
  );

  useEffect(() => {
    if (!storeId) return;

    const fetchData = async () => {
      try {
        const storeRes = await api.get(`/stores/${storeId}`);
        const storeData = storeRes.data;

        if (storeData?.store_types) {
          const fetchedStoreTypes: StoreType[] = storeData.store_types;
          setStoreTypes(fetchedStoreTypes);

          const storeTypeIds = fetchedStoreTypes.map((st) => st.id);

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
  }, [storeId]);

  const handleSelect = (
    storeTypeId: string,
    priceRangeId: string,
    store_type: string,
    price_range: string
  ) => {
    setSelectedPrices((prev) => {
      const exists = prev.some(
        (item) =>
          item.store_type_id === storeTypeId &&
          item.price_range_id === priceRangeId
      );

      if (exists) {
        // Remove if already selected
        return prev.filter(
          (item) =>
            !(
              item.store_type_id === storeTypeId &&
              item.price_range_id === priceRangeId
            )
        );
      } else {
        // Add new selection
        return [
          ...prev,
          {
            store_type_id: storeTypeId,
            store_type,
            price_range_id: priceRangeId,
            price_range,
          },
        ];
      }
    });
  };

  useEffect(() => {
    const allStoreTypesSelected = storeTypes.every((storeType) =>
      selectedPrices.some((entry) => entry.store_type_id === storeType.id)
    );

    const isValid =
      minPrice.trim() !== "" && maxPrice.trim() !== "" && allStoreTypesSelected;

    setPriceFiltersValid(isValid);

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
  }, [minPrice, maxPrice, selectedPrices, storeTypes]);

  return (
    <div className="p-6 rounded-2xl shadow-sm space-y-4 w-3xl bg-white">
      <div>
        <h2 className="text-lg font-semibold">Price filters</h2>
        <p className="text-sm text-gray-500">
          Define product tiers in affordable, premium and luxury for easy
          filtering.
        </p>
      </div>

      <div className="-mx-6 border-t border-gray-300"></div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">
            Average price for brand
          </label>
          <div className="flex gap-2">
            <div className="flex w-full border border-gray-300 rounded-md overflow-hidden">
              <span className="bg-gray-100 px-3 py-2 text-gray-500 select-none border-r border-gray-300">
                Rs
              </span>
              <input
                type="number"
                placeholder="2000"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-3"
              />
            </div>

            <span className="self-center">-</span>

            <div className="flex w-full border border-gray-300 rounded-md overflow-hidden">
              <span className="bg-gray-100 px-3 py-2 text-gray-500 select-none border-r border-gray-300">
                Rs
              </span>
              <input
                type="number"
                placeholder="25000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-3"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-grow border-t border-dotted border-gray-300"></div>

      <div className="space-y-6">
        {storeTypes.map((storeType) => (
          <div key={storeType.id}>
            <h3 className="text-lg font-semibold mb-2">
              {storeType.store_type}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(storeTypePriceMap[storeType.id] || []).map((price) => {
                const isSelected = selectedPrices.some(
                  (entry) =>
                    entry.store_type_id === storeType.id &&
                    entry.price_range_id === price.id
                );
                return (
                  <label
                    key={price.id}
                    className={`border rounded-lg p-4 cursor-pointer transition ${
                      isSelected ? "bg-gray-200" : "border-gray-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      name={`price-${storeType.id}`}
                      value={price.id}
                      checked={isSelected}
                      onChange={() =>
                        handleSelect(
                          storeType.id,
                          price.id,
                          storeType.store_type,
                          price.label
                        )
                      }
                      className="accent-black"
                    />
                    <div>
                      <div className="font-medium">{price.label}</div>
                      <div className="text-sm text-gray-600">
                        Rs {price.lower_value.toLocaleString()} -{" "}
                        {price.upper_value.toLocaleString()}
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
