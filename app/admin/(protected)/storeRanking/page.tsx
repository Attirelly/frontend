// pages/admin/StoreRankingPage.tsx

"use client";

import { AddToCuration } from "@/components/admin/productCRM/AddToCuration";
import { StoreFacets, AlgoliaStorehit, Curation } from "@/types/algolia";
import { useState, useEffect, useCallback, useMemo } from "react";
import { DynamicFilters } from "@/components/admin/storeRanking/DynamicFilters";
import { StoreContainer } from "@/components/admin/storeRanking/StoreContainer";
import { api } from "@/lib/axios";
import Image from "next/image";
import { SelectionSidebar } from "@/components/admin/productCRM/SelectionSidebar";

// Debounce hook... (no changes here)
const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

export default function StoreRankingPage() {
  const [selectedCurations, setSelectedCurations] = useState<Curation[]>([]);
  const [selectedStores, setSelectedStores] = useState<AlgoliaStorehit[]>([]);

  // State for API data and filters
  const [stores, setStores] = useState<AlgoliaStorehit[]>([]);
  const [facets, setFacets] = useState<Partial<StoreFacets>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [query, setQuery] = useState<string>("");
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});
  const [page, setPage] = useState<number>(0); // Current page (0-indexed)
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const debouncedQuery = useDebounce(query, 500);

  const fetchStores = useCallback(async () => {
    // This function remains the same
    setIsLoading(true);
    const facetFiltersArray: string[][] = Object.entries(selectedFilters).map(
      ([facet, values]) => values.map((value) => `${facet}:${value}`)
    );
    const params: any = {
      query: debouncedQuery,
      page: page.toString(),
      limit: "20",
      only_active : "true"
    };
    if (facetFiltersArray.length > 0) {
      params.facetFilters = JSON.stringify(facetFiltersArray);
    }
    try {
      const response = await api.get("/search/search_store", { params }); // Ensure this is your correct API endpoint
      const data = response.data;
      setStores(data.hits || []);
      setTotalPages(data.total_pages || 0);
      if (Object.keys(facets).length === 0 && data.facets) {
        setFacets(data.facets);
      }
    } catch (err: any) {
      console.error("Failed to fetch stores:", err);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedQuery, page, selectedFilters, facets]);

  console.log(selectedStores);
  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleFilterChange = (facet: string, value: string) => {
    // This function remains the same
    setSelectedFilters((prevFilters) => {
      const currentValues = prevFilters[facet] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];

      if (newValues.length === 0) {
        const { [facet]: _, ...rest } = prevFilters;
        return rest;
      }

      return { ...prevFilters, [facet]: newValues };
    });
    setPage(0);
  };

  const handleStoreSelectionChange = (store: AlgoliaStorehit) => {
    // This function remains the same
    setSelectedStores((prevSelected) =>
      prevSelected.some((s) => s.id === store.id)
        ? prevSelected.filter((s) => s.id !== store.id)
        : [...prevSelected, store]
    );
  };

  // **NEW**: Handler for changing the page
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // NEW: Handler for selecting/deselecting all stores on the current page
  const handleBulkSelect = (
    pageStores: AlgoliaStorehit[],
    shouldSelect: boolean
  ) => {
    setSelectedStores((prevSelected) => {
      const pageStoreIds = new Set(pageStores.map((s) => s.id));

      if (shouldSelect) {
        // Add all stores from the current page that aren't already selected
        const newStoresToAdd = pageStores.filter(
          (s) => !prevSelected.some((ps) => ps.id === s.id)
        );
        return [...prevSelected, ...newStoresToAdd];
      } else {
        // Remove all stores from the current page from the selection
        return prevSelected.filter((s) => !pageStoreIds.has(s.id));
      }
    });
  };

  const memoizedSelectedStores = useMemo(
    () => selectedStores,
    [selectedStores]
  );

  // Define a function that describes how to render a STORE
const renderStoreItem = (store: AlgoliaStorehit) => (
  <div className="flex items-center">
    <Image
      src={store.profile_image || "/placeholder.png"}
      alt={`${store.store_name} logo`}
      width={60}
      height={60}
      className="w-16 h-16 object-contain rounded-md mr-4"
    />
    <div>
      <p className="text-sm font-semibold">{store.store_name}</p>
      <p className="text-xs text-gray-500">{store.city}</p>
    </div>
  </div>
);

const handleRemoveFromMasterList = (storeId: string) => {
    setSelectedStores(prev => prev.filter(p => p.id !== storeId));
  };

  const handleClearAllSelections = () => {
    setSelectedStores([]);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen text-black">
      <h1 className="text-2xl font-bold mb-6">Store Ranking and Curation</h1>


      {selectedStores.length > 0 && (
<div className="mt-4 mb-4">
        <AddToCuration
        selectedCurations={selectedCurations}
          onSelectionChange={setSelectedCurations}
          selectedObjects={memoizedSelectedStores}
        />
      </div>
      )}
      

      <div className="mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for stores..."
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <DynamicFilters
            facets={facets}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
          />
        </div>
        <div className="md:col-span-3">
          {/* **MODIFIED**: Pass new pagination props to StoreContainer */}
          <StoreContainer
            stores={stores}
            selectedStores={selectedStores}
            onSelectionChange={handleStoreSelectionChange}
            isLoading={isLoading}
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onBulkSelect={handleBulkSelect}
          />
        </div>
      </div>

      {selectedStores.length>0 && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white py-3 px-5 rounded-full shadow-lg flex items-center space-x-3 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 z-30"
        >
            <span className="font-semibold text-lg">{selectedStores.length}</span>
          <span className="hidden sm:inline">View Selections</span>
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
           </svg>
        </button>
      )}
      <SelectionSidebar
  isOpen={isSidebarOpen}
  onClose={() => setIsSidebarOpen(false)}
  items={selectedStores}
  onRemoveItem={handleRemoveFromMasterList} // Your function to remove a store
  onClearAll={handleClearAllSelections} // Your function to clear stores
  title="Selected Stores"
  emptyStateMessage="No stores selected yet."
  getKey={(store) => store.id}
  renderItem={renderStoreItem}
/>

      
    </div>
  );
}
