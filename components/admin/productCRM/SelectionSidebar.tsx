// src/components/shared/SelectionSidebar.tsx
"use client";

import React from "react";

// Use a generic type 'T' for the items in the list
type SelectionSidebarProps<T> = {
  isOpen: boolean;
  onClose: () => void;
  items: T[];
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
  // --- Props to make the component truly generic ---
  title: string; // e.g., "Selected Products" or "Selected Stores"
  emptyStateMessage: string; // e.g., "No products selected yet."
  getKey: (item: T) => string; // Function to get a unique key for each item
  renderItem: (item: T) => React.ReactNode; // Function to render the content of each list item
};

export function SelectionSidebar<T>({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onClearAll,
  title,
  emptyStateMessage,
  getKey,
  renderItem,
}: SelectionSidebarProps<T>) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-full bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold">{`${title} (${items.length})`}</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-200"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Item List */}
          {items.length > 0 ? (
            <div className="flex-grow overflow-y-auto p-4 space-y-3">
              {items.map((item) => (
                <div key={getKey(item)} className="flex items-center p-2 border rounded-lg shadow-sm">
                  {/* The specific content for the item is rendered here */}
                  <div className="flex-grow">
                    {renderItem(item)}
                  </div>
                  {/* The remove button is consistent */}
                  <button
                    onClick={() => onRemoveItem(getKey(item))}
                    className="ml-4 p-1 text-red-500 rounded-full hover:bg-red-100 flex-shrink-0"
                    aria-label={`Remove item`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-grow flex items-center justify-center">
              <p className="text-gray-500">{emptyStateMessage}</p>
            </div>
          )}

          {/* Footer with Actions */}
          {items.length > 0 && (
            <div className="p-4 border-t">
              <button
                onClick={onClearAll}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
              >
                Clear All Selections
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}