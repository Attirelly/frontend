// src/components/AddToCuration.tsx

'use client';

import { useState, useEffect, useMemo } from 'react';
import { api } from '@/lib/axios'; // Assuming your axios instance is here
import { MultiSelectDropdown } from './MultiSelectDropdown'; // Assuming the dropdown is in the same folder
import { ChevronDown, Section } from 'lucide-react';
import { AlgoliaHit, Curation } from '@/types/algolia';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

/**
 * @interface AddToCurationProps
 * @description Defines the props for the AddToCuration component.
 */
interface AddToCurationProps {
  // Pass a callback to get the full selected Curation objects
  onSelectionChange: (selectedCurations: Curation[]) => void;
  selectedProducts?:AlgoliaHit[]
  // Pre-populate selection using initial IDs
  initialSelectedIds?: (string | number)[];
}

/**
 * A collapsible component that allows users to select one or more curations
 * from a multi-select dropdown. The list of available curations is fetched
 * from the backend.
 *
 * This component manages its own state for:
 * - Expansion (collapsed/expanded view)
 * - Fetching curations (loading, error, data)
 * - Selected curation IDs
 *
 * It reuses the provided `MultiSelectDropdown` for the selection UI.
 *
 * @param {AddToCurationProps} props - The props for the component.
 * @returns {JSX.Element} A collapsible UI section for selecting curations.
 */
export function AddToCuration({
  onSelectionChange,
  selectedProducts = [],
  initialSelectedIds = [],
}: AddToCurationProps) {
  const [isExpanded, setIsExpanded] = useState(true); // Default to expanded
  const [allCurations, setAllCurations] = useState<Curation[]>([]);
  const [selectedCurationIds, setSelectedCurationIds] = useState<(string | number)[]>(initialSelectedIds);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCurations, setSelectedCurations] = useState<Curation[]>([]);

  /**
   * Fetches the list of all available curations from the API on component mount.
   */
  useEffect(() => {
    async function fetchCurations() {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/homepage/section');
        // We only need the ID and name for the dropdown
        // setAllCurations(response.data.map(({ section_number, section_name }: CurationOption) => ({
        //   section_number,
        //   section_name,
        // })));
        setAllCurations(response.data);
      } catch (err) {
        setError('Failed to load curations.');
        console.error('Error fetching curations:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCurations();
  }, []);


  useEffect(() => {
    setSelectedCurationIds(initialSelectedIds);

    if (allCurations.length > 0) {
      const selectedObjects = allCurations.filter((curation) =>
        initialSelectedIds.includes(curation.section_id)
      );
      setSelectedCurations(selectedObjects);
    }
    // We can also remove onSelectionChange from the dependency array now.
  }, [initialSelectedIds, allCurations]);

  /**
   * Transforms the fetched curations data into the format required by the
   * `MultiSelectDropdown` component ({ id, name }).
   * `useMemo` prevents this transformation from running on every render.
   */
  const dropdownOptions = useMemo(() => {
    return allCurations.map((curation) => ({
      id: curation.section_id,
      name: `${curation.section_number}, ${curation.section_type}, ${curation.section_name} `,
    }));
  }, [allCurations]);

  /**
   * Handles selection changes from the dropdown. It updates the local state
   * and calls the parent's onSelectionChange callback.
   */
  const handleSelection = (newSelectedIds: (string | number)[]) => {
    setSelectedCurationIds(newSelectedIds);
    const selectedObjects = allCurations.filter((curation) =>
      newSelectedIds.includes(curation.section_id)
    );
    setSelectedCurations(selectedObjects);
    onSelectionChange(selectedObjects);
  };

  const handleAddToCuration = async () => {
const payload = {
      section_name: selectedCurations[0].section_name,
      section_number: selectedCurations[0].section_number,
      section_type: selectedCurations[0].section_type,
      section_url: selectedCurations[0].section_url,
      store_ids: selectedProducts.map((products) => products.store_id),
      product_ids: selectedProducts.map((products) => products.id),
    };
    console.log(payload);
    try {
      await api.put(`/homepage/section/${selectedCurations[0].section_id}`, payload);
      toast.success("Curation submitted successfully!");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Failed to update section.");
    }
  }

  console.log("selected products", selectedProducts);

  return (
    <div className="w-full border border-gray-200 rounded-lg">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 focus:outline-none"
      >
        <label className="font-semibold text-gray-800 text-lg">
          Add to:
        </label>
        <ChevronDown
          className={`w-6 h-6 text-gray-600 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Collapsible Content */}
      {isExpanded && (
        
          <div className="p-4 border-t border-gray-200">
            {loading && <p className="text-gray-500">Loading curations...</p>}
            {error && <p className="text-red-600">{error}</p>}
            {!loading && !error && (
              <div className='flex gap-3 items-center'>
              <div className='flex-grow'>
                <MultiSelectDropdown
                  options={dropdownOptions}
                  selectedIds={selectedCurationIds}
                  onSelectionChange={handleSelection}
                  placeholder="Select curations..."
                //   disabled={products.length > 0}
                />
              </div>
              <button
  onClick={handleAddToCuration}
  disabled={selectedCurationIds.length === 0}
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