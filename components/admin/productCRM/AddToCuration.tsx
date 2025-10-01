// src/components/admin/productCRM/AddToCuration.tsx (or your shared path)

'use client';

import { useState, useEffect, useMemo } from 'react';
import { api } from '@/lib/axios';
import { MultiSelectDropdown } from './MultiSelectDropdown'; // Adjusted path if needed
import { ChevronDown } from 'lucide-react';
import { AlgoliaHit, AlgoliaStorehit, Curation } from '@/types/algolia';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

interface AddToCurationProps {
  // The component is now fully controlled by these two props
  selectedCurations: Curation[];
  onSelectionChange: (selectedCurations: Curation[]) => void;
  
  // These props remain the same
  selectedObjects?: AlgoliaHit[] | AlgoliaStorehit[];
}

export function AddToCuration({
  selectedCurations, // The full array of selected objects from the parent
  onSelectionChange,
  selectedObjects = [],
}: AddToCurationProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [allCurations, setAllCurations] = useState<Curation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // This logic for fetching all curations is perfect
  useEffect(() => {
    async function fetchCurations() {
      try {
        setLoading(true);
        const response = await api.get('/homepage/section');
        setAllCurations(response.data);
      } catch (err) {
        setError('Failed to load curations.');
      } finally {
        setLoading(false);
      }
    }
    fetchCurations();
  }, []);

  const dropdownOptions = useMemo(() => {
    return allCurations.map((curation) => ({
      id: curation.section_id,
      name: `${curation.section_number}, ${curation.section_type}, ${curation.section_name}`,
    }));
  }, [allCurations]);

  // DERIVED STATE: The selected IDs are now derived directly from the props.
  // This ensures the dropdown always reflects the parent's state.
  const selectedIds = useMemo(
    () => selectedCurations.map((c) => c.section_id),
    [selectedCurations]
  );

  const handleSelection = (newSelectedIds: (string | number)[]) => {
    // When the user makes a change, find the full objects...
    const newSelectedObjects = allCurations.filter((curation) =>
      newSelectedIds.includes(curation.section_id)
    );
    // ...and pass the entire new array up to the parent. The parent will update its state.
    onSelectionChange(newSelectedObjects);
  };

  // // The submission logic remains the same
  // const handleAddToCuration = async () => {
  //   // ... your existing submission logic here ...
  //   if (selectedCurations.length === 0) {
  //       toast.error("Please select a curation first.");
  //       return;
  //   }
  //   const targetCuration = selectedCurations[0];
  //   // ... rest of the function
  // };

   const handleAddToCuration = async () => {
// const payload = {
//       section_name: selectedCurations[0].section_name,
//       section_number: selectedCurations[0].section_number,
//       section_type: selectedCurations[0].section_type,
//       section_url: selectedCurations[0].section_url,
//       store_ids: selectedObjects.map((stores) => stores.store_id),
//       product_ids: selectedObjects.map((products) => products.id),
//     };
//     console.log(payload);

// Base payload with details from the selected curation
    const payloadBase = {
      section_name: selectedCurations[0].section_name,
      section_number: selectedCurations[0].section_number,
      section_type: selectedCurations[0].section_type,
      section_url: selectedCurations[0].section_url,
    };

    let finalPayload;
    const firstObject = selectedObjects[0];

    // **Check if the objects are stores by looking for a unique property like `store_name`**
    if ('product_name' in firstObject) {
      // Case 2: Payload for PRODUCTS (AlgoliaHit[])
      finalPayload = {
        ...payloadBase,
        // Get unique store IDs from the products
        store_ids: selectedObjects.map((stores) => (stores as AlgoliaHit).store_id),
        product_ids: selectedObjects.map((product) => product.id),
      };
    } else {
      // Case 1: Payload for STORES (AlgoliaStorehit[])
      finalPayload = {
        ...payloadBase,
        store_ids: selectedObjects.map((store) => store.id),
        product_ids: [], 
      };
    }

    console.log("Submitting Payload:", finalPayload);
    try {
      await api.put(`/homepage/section/${selectedCurations[0].section_id}`, finalPayload);
      toast.success("Curation submitted successfully!");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Failed to update section.");
    }
  }

  return (
    <div className="w-full border border-gray-200 rounded-lg">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 focus:outline-none"
      >
        <label className="font-semibold text-gray-800 text-lg">Add to:</label>
        <ChevronDown
          className={`w-6 h-6 text-gray-600 transform transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isExpanded && (
        <div className="p-4 border-t border-gray-200">
          {!loading && !error && (
            <div className='flex gap-3 items-center'>
              <div className='flex-grow'>
                <MultiSelectDropdown
                  options={dropdownOptions}
                  selectedIds={selectedIds} // Use the derived IDs
                  onSelectionChange={handleSelection}
                  placeholder="Select one or more curations..."
                />
              </div>
              <button
                onClick={handleAddToCuration}
                disabled={selectedIds.length === 0 || selectedObjects.length === 0}
                className="bg-blue-500 text-white rounded-lg px-3 py-2 h-fit flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Add
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}