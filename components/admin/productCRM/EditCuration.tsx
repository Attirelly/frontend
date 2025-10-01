"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/axios";
import { Curation } from "@/types/algolia";

interface EditCurationProps {
  onCurationSelect: (curation: Curation) => void;
  // A loading flag to disable the button while a curation is being processed
  isProcessing: boolean; 
}

export function EditCuration({ onCurationSelect, isProcessing }: EditCurationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [curations, setCurations] = useState<Curation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch curations only when the modal is opened for the first time
    if (isOpen && curations.length === 0) {
      const fetchCurations = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await api.get('/homepage/section');
          // Filter for product curations, as this page is for product management
          const productCurations = response.data.filter(
            (c: Curation) => c.section_type === "product"
          );
          setCurations(productCurations);
        } catch (err) {
          setError('Failed to load curations.');
          console.error('Error fetching curations:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchCurations();
    }
  }, [isOpen]);

  const handleSelect = (curation: Curation) => {
    onCurationSelect(curation);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        disabled={isProcessing}
        className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-wait"
      >
        {isProcessing ? "Loading Curation..." : "Edit Curation"}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Select a Curation to Edit</h2>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            
            <div className="max-h-80 overflow-y-auto">
              {curations.map((curation) => (
                <button
                  key={curation.section_id}
                  onClick={() => handleSelect(curation)}
                  className="w-full text-left p-3 mb-2 rounded-md hover:bg-gray-100 border"
                >
                  <p className="font-semibold">{curation.section_name}</p>
                  <p className="text-sm text-gray-600">
                    ID: {curation.section_id} | Type: {curation.section_type}
                  </p>
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="mt-4 w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}