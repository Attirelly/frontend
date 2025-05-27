'use client';
import React, { useState, useEffect } from 'react';
import { useSellerStore } from '@/store/sellerStore'

import { api } from '@/lib/axios';

interface StoreType {
  id: string;
  store_type: string;
}

interface PriceRange {
  id: string;
  label: string;
}

type StoreTypePriceRange = {
  store_type: string;
  price_range: string;
}

const PRICE_RANGE_TEXT: Record<string, string> = {
  Affordable: "Rs 2,000 - 25,000",
  Premium: "Rs 25,000 - 75,000",
  Luxury: "Rs 75,000 & above",
};

export default function PriceFiltersComponent() {
  const { storeId, setPriceFiltersData, setPriceFiltersValid, priceFiltersData } = useSellerStore();
  console.log(priceFiltersData)

  const [minPrice, setMinPrice] = useState(priceFiltersData?.avgPriceMin.toString() || '');
  const [maxPrice, setMaxPrice] = useState(priceFiltersData?.avgPriceMax.toString() || '');
  const [storeTypes, setStoreTypes] = useState<StoreType[]>([]);
  const [priceRanges, setPriceRanges] = useState<PriceRange[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<StoreTypePriceRange[]>(priceFiltersData?.priceRanges || []);
  console.log(storeId, storeTypes, priceRanges)
  useEffect(() => {
    if (!storeId) return;

    const fetchData = async () => {
      try {
        const [storeRes, priceRangeRes] = await Promise.all([
          api.get(`/stores/${storeId}`),
          api.get(`/stores/price_ranges`)
        ]);
        const storeData = storeRes.data;
        if (storeData?.store_types) {
          setStoreTypes(storeData.store_types);
        }
        setPriceRanges(priceRangeRes.data);
      } catch (error) {
        console.error("Error fetching store types or price ranges", error);
      }
    };

    fetchData();
  }, [storeId]);


  

  const handleSelect = (storeTypeId: string, priceRangeId: string) => {
    setSelectedPrices((prev) => {
      const updated = prev.filter((item) => item.store_type !== storeTypeId);
      return [...updated, { store_type: storeTypeId, price_range: priceRangeId }];
    });
  };
  console.log(selectedPrices)

  useEffect(() => {
  const allStoreTypesSelected = storeTypes.every((storeType) =>
    selectedPrices.some((entry) => entry.store_type === storeType.id)
  );

  const isValid =
    minPrice.trim() !== "" &&
    maxPrice.trim() !== "" &&
    allStoreTypesSelected;

  setPriceFiltersValid(isValid);

  if (isValid) {
    setPriceFiltersData({
      avgPriceMin: Number(minPrice),
      avgPriceMax: Number(maxPrice),
      priceRanges: selectedPrices,
    });
  }
}, [minPrice, maxPrice, selectedPrices, storeTypes]);


  return (
    <div className="p-6 rounded-2xl shadow-sm space-y-6 max-w-xl bg-white">
      <div>
        <h2 className="text-lg font-semibold">Price filters</h2>
        <p className="text-sm text-gray-500">
          Define product tiers in affordable, premium and luxury for easy filtering.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Average price for brand</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="2000"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
            <span className="self-center">-</span>
            <input
              type="number"
              placeholder="25000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {storeTypes.map((storeType) => (
          <div key={storeType.id}>
            <h3 className="text-lg font-semibold mb-2">{storeType.store_type}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {priceRanges.map((price) => {
                const isSelected = selectedPrices.some(
                  (entry) => entry.store_type === storeType.id && entry.price_range === price.id
                );
                return (
                  <label
                    key={price.id}
                    className={`border rounded-lg p-4 cursor-pointer transition ${isSelected ? "border-blue-600 bg-blue-100" : "border-gray-300"
                      }`}
                  >
                    <input
                      type="radio"
                      name={`price-${storeType.id}`}  // group by store type
                      value={price.id}
                      checked={isSelected}
                      onChange={() => handleSelect(storeType.id, price.id)}
                      className="hidden"
                    />
                    <div className="font-medium">{price.label}</div>
                    <div className="text-sm text-gray-600">
                      {PRICE_RANGE_TEXT[price.label] || "N/A"}
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
