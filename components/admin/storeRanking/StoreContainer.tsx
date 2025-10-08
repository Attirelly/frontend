// components/admin/storeRanking/StoreContainer.tsx

"use client";

import { AlgoliaStorehit } from "@/types/algolia";
import React, { useEffect, useRef } from "react";
import { usePagination, DOTS } from "@/lib/hooks/usePagination"; // Adjust the import path

interface StoreContainerProps {
  stores: AlgoliaStorehit[];
  selectedStores: AlgoliaStorehit[];
  onSelectionChange: (store: AlgoliaStorehit) => void;
  onBulkSelect: (pageStores: AlgoliaStorehit[], shouldSelect: boolean) => void; // For "Select All"
  isLoading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export const StoreContainer: React.FC<StoreContainerProps> = ({
  stores,
  selectedStores,
  onSelectionChange,
  onBulkSelect, // Destructure the new prop
  isLoading,
  page,
  totalPages,
  onPageChange,
}) => {

  const headerCheckboxRef = useRef<HTMLInputElement>(null);

  const isStoreSelected = (storeId: string) => {
    return selectedStores.some((s) => s.id === storeId);
  };

  // --- LOGIC for Header Checkbox ---
  const currentPageStoreIds = new Set(stores.map(s => s.id));
  const selectedOnCurrentPageCount = selectedStores.filter(s => currentPageStoreIds.has(s.id)).length;
  
  const allOnPageSelected = stores.length > 0 && selectedOnCurrentPageCount === stores.length;
  const someOnPageSelected = stores.length > 0 && selectedOnCurrentPageCount > 0 && !allOnPageSelected;

  // This effect handles the "indeterminate" state of the checkbox
  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = someOnPageSelected;
    }
  }, [someOnPageSelected]);

  // The handler for the header checkbox click
  const handleSelectAllClick = () => {
    onBulkSelect(stores, !allOnPageSelected);
  };

  const paginationRange = usePagination({
    currentPage: page + 1, // The hook is 1-indexed, your state is 0-indexed
    totalPages,
    siblingCount: 1,
  });

  if (isLoading) {
    return <div className="p-4 text-center text-gray-500">Loading stores...</div>;
  }

  return (
    <div className="p-4 border rounded-md shadow-sm bg-white">
      <h2 className="text-xl font-bold mb-4">Stores</h2>
      <div className="overflow-x-auto">
        {/* Your table code remains here... */}
        <table className="min-w-full divide-y divide-gray-200">
          {/* thead and tbody */}
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  ref={headerCheckboxRef}
                  checked={allOnPageSelected}
                  onChange={handleSelectAllClick}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stores.map((store) => (
              <tr key={store.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input type="checkbox" checked={isStoreSelected(store.id)} onChange={() => onSelectionChange(store)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{store.store_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{store.city}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{store.area}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {stores.length === 0 && !isLoading && (
        <p className="text-center py-4 text-gray-500">No stores found.</p>
      )}

      {/* **NEW**: Advanced Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-700">
            Page {page + 1} of {totalPages}
          </span>
          <nav>
            <ul className="inline-flex items-center -space-x-px text-sm">
              <li>
                <button
                  onClick={() => onPageChange(page - 1)}
                  disabled={page === 0}
                  className="flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  &lt;
                </button>
              </li>

              {paginationRange?.map((pageNumber, index) => {
                if (pageNumber === DOTS) {
                  return (
                    <li key={`dots-${index}`} className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300">
                      ...
                    </li>
                  );
                }

                const isCurrent = page + 1 === pageNumber;
                return (
                  <li key={pageNumber}>
                    <button
                      onClick={() => onPageChange(Number(pageNumber) - 1)}
                      className={`flex items-center justify-center px-3 h-8 leading-tight border border-gray-300 ${
                        isCurrent
                          ? "text-white bg-blue-600 hover:bg-blue-700"
                          : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  </li>
                );
              })}

              <li>
                <button
                  onClick={() => onPageChange(page + 1)}
                  disabled={page >= totalPages - 1}
                  className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  &gt;
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};