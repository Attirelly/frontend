// src/components/StoreFilter.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { MultiSelectDropdown } from './MultiSelectDropdown';
import { api } from '@/lib/axios'; // Import your pre-configured axios instance

// --- Type Definitions ---

// Kept for City and StoreType dropdowns which still use mock data
export interface City {
  id: number;
  name: string;
}

export interface StoreType {
  id: number;
  name: string;
}

// CHANGED: This interface now reflects the essential fields for the component's logic.
// The 'id' is mapped from 'store_id' and 'name' from 'store_name' from the API response.
export interface Store {
  id: string; // Changed from number to string to match 'store_id'
  name: string;
  // cityId and storeTypeId are removed for now as per the new API structure.
  // Filtering logic will need to be updated later.
}

// NEW: A type representing the raw store data from the API



interface StoreFilterProps {
  selectedStores: Store[];
  allFetchedStores:Store[];
  onStoresChange: (stores: Store[]) => void;
}

// --- Mock Data (for unimplemented filters) ---
// These are kept temporarily until their API endpoints are integrated.
const mockCities: City[] = [
    { id: 1, name: 'Delhi' },
    { id: 2, name: 'Mumbai' },
    { id: 3, name: 'Bengaluru' },
    { id: 4, name: 'Chennai' },
];
const mockStoreTypes: StoreType[] = [
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Grocery' },
    { id: 3, name: 'Apparel' },
    { id: 4, name: 'Hardware' },
];


// --- The Main Component ---
export const StoreFilter: React.FC<StoreFilterProps> = ({ selectedStores, allFetchedStores, onStoresChange }) => {
  // Master data state
  const [allCities, setAllCities] = useState<City[]>([]);
  const [allStoreTypes, setAllStoreTypes] = useState<StoreType[]>([]);
  const [allStores, setAllStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for filter selections
  const [selectedCityIds, setSelectedCityIds] = useState<number[]>([]);
  const [selectedStoreTypeIds, setSelectedStoreTypeIds] = useState<number[]>([]);
  
  const [isSectionExpanded, setIsSectionExpanded] = useState(true);

  console.log("allfetchedstores", allFetchedStores);
  // CHANGED: useEffect now fetches real data from the API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch stores from the API
        // const response = await api.get<StoreApiResponse[]>('/stores/'); 
        
        // // Transform API data to match the component's expected 'Store' interface
        // const formattedStores = response.data.map(store => ({
        //   id: store.store_id,
        //   name: store.store_name,
        // }));
        setAllStores(allFetchedStores);


        // TODO: Replace with API calls for cities and store types later
        setAllCities(mockCities);
        setAllStoreTypes(mockStoreTypes);

      } catch (error) {
        console.error("Failed to fetch data:", error);
        // Handle error state appropriately in a real app (e.g., show a toast notification)
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [allFetchedStores]);

  
  
  // TODO: This logic needs to be updated when City/StoreType data comes from the API.
  // The current filtering is disabled as the new 'Store' object doesn't have cityId/storeTypeId.
  const availableStores = useMemo(() => {
    let filteredStores = allStores;
    
    // if (selectedCityIds.length > 0) {
    //   // This part needs reimplementation based on the new API response structure,
    //   // e.g., store.city.city_id
    // }
    // if (selectedStoreTypeIds.length > 0) {
    //   // This part also needs reimplementation, e.g., by checking the
    //   // store.store_types array.
    // }

    return filteredStores;
  }, [allStores]); // Removed dependency on city/store type selections for now

  const handleStoreSelection = (selectedStoreIds: (number | string)[]) => {
      const newlySelectedStores = allStores.filter(store => 
          selectedStoreIds.includes(store.id) && !selectedStores.some(s => s.id === store.id)
      );
      onStoresChange([...selectedStores, ...newlySelectedStores]);
  };

  // CHANGED: The 'storeId' parameter is now a string to match the updated Store interface.
  const removeStore = (storeId: string) => {
    const updatedStores = selectedStores.filter((store) => store.id !== storeId);
    onStoresChange(updatedStores);
  };
  
  const handleShowResults = () => {
      alert(`You have selected ${selectedStores.length} stores:\n${selectedStores.map(s => s.name).join(',\n')}`);
  };

  if (isLoading) {
    return <div className="text-center p-10">Loading filters...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div 
          className="flex justify-between items-center p-6 cursor-pointer"
          onClick={() => setIsSectionExpanded(!isSectionExpanded)}
        >
          <h1 className="text-2xl font-bold text-gray-800">Store Locator & Filter 🗺️</h1>
          <svg 
            className={`w-6 h-6 text-gray-500 transform transition-transform duration-300 ${isSectionExpanded ? 'rotate-180' : ''}`}
            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isSectionExpanded ? 'max-h-[1000px]' : 'max-h-0'}`}>
            <div className="px-6 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {/* These dropdowns still use mock data as placeholders */}
                  <MultiSelectDropdown
                    options={allCities}
                    selectedIds={selectedCityIds}
                    onSelectionChange={(ids) => setSelectedCityIds(ids as number[])}
                    placeholder="Select Cities"
                  />
                  <MultiSelectDropdown
                    options={allStoreTypes}
                    selectedIds={selectedStoreTypeIds}
                    onSelectionChange={(ids) => setSelectedStoreTypeIds(ids as number[])}
                    placeholder="Select Store Types"
                  />
                  {/* This dropdown now shows stores from the API */}
                  <MultiSelectDropdown
                    options={availableStores}
                    selectedIds={[]}
                    onSelectionChange={handleStoreSelection}
                    placeholder="Select Stores to Add"
                  />
                </div>

                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-700 mb-3">Selected Stores ({selectedStores.length})</h2>
                    {selectedStores.length > 0 ? (
                        <div className="flex flex-wrap gap-2 p-4 border border-dashed rounded-lg bg-gray-50">
                            {selectedStores.map(store => (
                                <div key={store.id} className="flex items-center bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1.5 rounded-full">
                                    <span>{store.name}</span>
                                    <button 
                                        onClick={() => removeStore(store.id)}
                                        className="ml-2 w-5 h-5 flex items-center justify-center bg-indigo-200 rounded-full text-indigo-600 hover:bg-indigo-300 hover:text-indigo-800 focus:outline-none"
                                    >
                                        &#x2715;
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-6 border border-dashed rounded-lg bg-gray-50">
                            <p>No stores selected yet. Pick a store from the dropdown above.</p>
                        </div>
                    )}
                </div>
                
                <div className="text-right">
                    <button
                        onClick={handleShowResults}
                        disabled={selectedStores.length === 0}
                        className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Show Results
                    </button>
                </div>
            </div>
        </div>
      </div>
  );
};