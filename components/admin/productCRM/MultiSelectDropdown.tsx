// src/components/MultiSelectDropdown.tsx

import React, { useState, useEffect, useRef, useMemo } from 'react';

// Define the shape of each option
interface DropdownOption {
  id: number | string;
  name: string;
}

// Define the props for the component
interface MultiSelectDropdownProps {
  options: DropdownOption[];
  selectedIds: (number | string)[];
  onSelectionChange: (selectedIds: (number | string)[]) => void;
  placeholder: string;
  disabled?:boolean;
}

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  selectedIds,
  onSelectionChange,
  placeholder,
  disabled=false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // State for the search input
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      searchInputRef.current?.focus();
    }
  }, [isOpen]);

  // Close the dropdown if clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Clear search term when dropdown is closed
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);

  // Memoize the filtered options to avoid re-calculating on every render
  const filteredOptions = useMemo(() => {
    if (!searchTerm) {
      return options;
    }
    return options.filter((option) =>
      option.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  const handleOptionToggle = (optionId: number | string) => {
    const newSelectedIds = selectedIds.includes(optionId)
      ? selectedIds.filter((id) => id !== optionId)
      : [...selectedIds, optionId];
    onSelectionChange(newSelectedIds);
  };

  const getButtonLabel = () => {
    if (selectedIds.length === 0) {
      return placeholder;
    }
    if (selectedIds.length === 1) {
      const selectedOption = options.find((opt) => opt.id === selectedIds[0]);
      return selectedOption?.name || placeholder;
    }
    return `${selectedIds.length} selected`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-gray-300 rounded-md shadow-sm px-4 py-3 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        disabled={disabled}
      >
        <div className="flex items-center justify-between">
          <span className="truncate text-gray-700">{getButtonLabel()}</span>
          <svg
            className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white shadow-lg max-h-60 rounded-md ring-1 ring-black ring-opacity-5 flex flex-col">
          {/* Search Input Field */}
          <div className="p-2 border-b border-gray-200">
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              // Prevent dropdown from closing when clicking the search bar
              onClick={(e) => e.stopPropagation()} 
            />
          </div>
          
          {/* Options List */}
          <div className="overflow-auto py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.id}
                  onClick={() => handleOptionToggle(option.id)}
                  className="px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 flex items-center"
                >
                  <input
                    type="checkbox"
                    readOnly
                    checked={selectedIds.includes(option.id)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                  />
                  <span className="ml-3 truncate">{option.name}</span>
                </div>
              ))
            ) : (
              // Message for no results
              <div className="px-4 py-2 text-sm text-gray-500">
                No results found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};