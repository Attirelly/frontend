// src/components/SellerFilterSidebar.tsx

import React, { useState } from "react";
import {
  Filter,
  ChevronDown,
  X,
  MapPin,
  Users,
  UserPlus,
  DollarSign,
  Tag,
  Eye,
  Search,
} from "lucide-react";

// --- MODIFICATION: Added Slider component and its CSS ---
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

// --- TYPE DEFINITIONS (Unchanged) ---
export interface FilterOptions {
  locations: string[];
  genders: string[];
  categories: string[];
}
export interface SelectedFilters {
  location: string[];
  genders: string[];
  followers_instagram: [number, number];
  followers_facebook: [number, number];
  followers_youtube: [number, number];
  price_story: [number, number];
  price_reel: [number, number];
  price_post: [number, number];
  category: string[];
  avg_views: [number, number];
}
interface SellerFilterSidebarProps {
  options: FilterOptions;
  selectedFilters: SelectedFilters;
  onFilterChange: (
    key: keyof SelectedFilters,
    value: string | [number, number]
  ) => void;
  onClearFilters: () => void;
}

// --- MAIN SIDEBAR COMPONENT (Mostly Unchanged) ---
export function InfluencerFilterSidebar({
  options,
  selectedFilters,
  onFilterChange,
  onClearFilters,
}: SellerFilterSidebarProps) {
  const [showFilters, setShowFilters] = useState(true);

  const hasActiveFilters =
    Object.values(selectedFilters).some(
      (v) => Array.isArray(v) && v.length > 0
    ) ||
    Object.values(selectedFilters).some(
      (v) =>
        Array.isArray(v) &&
        typeof v[0] === "number" && // Ensure it's a number array
        (v[0] !== 0 || v[1] !== 10000000)
    );

  return (
    <div
      className={`transition-all duration-300 lg:w-60 ${
        showFilters ? "h-full lg:h-72" : "h-16"
      }`}
    >
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-2 sticky top-6">
        {/* --- Header (Unchanged) --- */}
        <div className="flex items-center justify-between mb-4">
          <div
            className={`flex items-center gap-2`}
          >
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 hover:bg-gray-100 rounded-lg"
            // aria-label={showFilters ? "Collapse filters" : "Expand filters"}
          >
            {showFilters ? (
              <ChevronDown className="w-5 h-5 text-black" />
            ) : (
              <ChevronDown className="w-5 h-5 text-black" />
            )}
          </button>
        </div>

        {/* --- Content Area (Unchanged wrapper) --- */}
        

        <div
          className={`transition-opacity ${
            showFilters ? "opacity-100" : "opacity-0 hidden"
          }`}
        >

          <SelectedFiltersChips
            selectedFilters={selectedFilters}
            onFilterChange={onFilterChange}
            onClearFilters={onClearFilters}
            hasActiveFilters={hasActiveFilters}
          />

          { /* --- MODIFICATION: Using new Collapsible components --- */ }
          <div className="space-y-4">
            <CollapsibleCheckboxGroup // Renamed
              title="Location (City)"
              icon={MapPin}
              options={options.locations}
              selected={selectedFilters.location}
              onChange={(value) => onFilterChange("location", value)}
            />

            <CollapsibleCheckboxGroup // Renamed
              title="Genders"
              icon={Users}
              options={options.genders}
              selected={selectedFilters.genders}
              onChange={(value) => onFilterChange("genders", value)}
            />

            <CollapsibleCheckboxGroup // Renamed
              title="Category Niche"
              icon={Tag}
              options={options.categories}
              selected={selectedFilters.category}
              onChange={(value) => onFilterChange("category", value)}
            />

            <CollapsibleRangeSliderGroup // Renamed
              title="Followers"
              icon={UserPlus}
              sliders={[
                {
                  label: "Instagram",
                  key: "followers_instagram",
                  values: selectedFilters.followers_instagram,
                },
                {
                  label: "Facebook",
                  key: "followers_facebook",
                  values: selectedFilters.followers_facebook,
                },
                {
                  label: "YouTube",
                  key: "followers_youtube",
                  values: selectedFilters.followers_youtube,
                },
              ]}
              onFilterChange={onFilterChange}
            />

            <CollapsibleRangeSliderGroup // Renamed
              title="Price Range"
              icon={DollarSign}
              sliders={[
                {
                  label: "Story",
                  key: "price_story",
                  values: selectedFilters.price_story,
                },
                {
                  label: "Reel",
                  key: "price_reel",
                  values: selectedFilters.price_reel,
                },
                {
                  label: "Post",
                  key: "price_post",
                  values: selectedFilters.price_post,
                },
              ]}
              onFilterChange={onFilterChange}
            />

            <CollapsibleRangeSliderGroup // Renamed
              title="Average Views"
              icon={Eye}
              sliders={[
                {
                  label: "Avg. Views",
                  key: "avg_views",
                  values: selectedFilters.avg_views,
                },
              ]}
              onFilterChange={onFilterChange}
            />
          </div>
      </div>
    

    </div>
    </div>
  );
}

// --- 2. REUSABLE SUB-COMPONENTS ---

/**
 * --- MODIFICATION: Header is now a button to toggle collapse ---
 * Header for each filter group
 */
function FilterGroupHeader({
  title,
  icon: Icon,
  isOpen,
  onClick,
}: {
  title: string;
  icon: React.ElementType;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between w-full"
    >
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5 text-gray-500" />
        <h3 className="text-base font-semibold text-gray-700">{title}</h3>
      </div>
      <ChevronDown
        className={`w-5 h-5 text-gray-400 transition-transform ${
          isOpen ? "rotate-180" : ""
        }`}
      />
    </button>
  );
}

/**
 * --- MODIFICATION: Renamed and made collapsible ---
 * A searchable, collapsible checkbox group
 */
function CollapsibleCheckboxGroup({
  title,
  icon,
  options,
  selected,
  onChange,
}: {
  title: string;
  icon: React.ElementType;
  options: string[];
  selected: string[];
  onChange: (value: string) => void;
}) {
  // --- MODIFICATION: Added isOpen state, default false ---
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewAll, setViewAll] = useState(false);

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const displayedOptions = viewAll
    ? filteredOptions
    : filteredOptions.slice(0, 5);

  return (
    <div className="border-b border-gray-200 pb-4">
      {/* --- MODIFICATION: Using new button header --- */}
      <FilterGroupHeader
        title={title}
        icon={icon}
        isOpen={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      />

      {/* --- MODIFICATION: Content is now conditional on isOpen --- */}
      {isOpen && (
        <div className="mt-4 space-y-3">
          {/* Search Input */}
          {options.length > 7 && (
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          )}

          {/* Options List */}
          <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
            {displayedOptions.map((option) => (
              <label
                key={option}
                className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(option)}
                  onChange={() => onChange(option)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 flex-1">{option}</span>
              </label>
            ))}
          </div>

          {/* View All Button */}
          {filteredOptions.length > 5 && (
            <button
              onClick={() => setViewAll(!viewAll)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2"
            >
              {viewAll ? "Show Less" : `View All (${filteredOptions.length})`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * --- MODIFICATION: Renamed and added visual slider ---
 * A group of range sliders (using simple number inputs AND a visual slider)
 */
function CollapsibleRangeSliderGroup({
  title,
  icon,
  sliders,
  onFilterChange,
}: {
  title: string;
  icon: React.ElementType;
  sliders: { label: string; key: string; values: [number, number] }[];
  onFilterChange: (key: any, value: [number, number]) => void;
}) {
  // --- MODIFICATION: Added isOpen state, default false ---
  const [isOpen, setIsOpen] = useState(false);

  const handleMinChange = (key: any, newMin: string, oldMax: number) => {
    const min = Number(newMin) || 0;
    onFilterChange(key, [min, Math.max(min, oldMax)]);
  };

  const handleMaxChange = (key: any, oldMin: number, newMax: string) => {
    const max = Number(newMax) || 0;
    // Ensure max isn't less than min, and default to a high number if 0
    const newMaxValue = max <= oldMin ? oldMin : max === 0 ? 10000000 : max;
    onFilterChange(key, [oldMin, newMaxValue]);
  };

  const formatNumber = (num: number) => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`;
    return num.toString();
  };

  // Define a reasonable max for the sliders, can be dynamic later
  const SLIDER_MAX = 10000000;

  return (
    <div className="border-b border-gray-200 pb-4">
      {/* --- MODIFICATION: Using new button header --- */}
      <FilterGroupHeader
        title={title}
        icon={icon}
        isOpen={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      />

      {/* --- MODIFICATION: Content is now conditional on isOpen --- */}
      {isOpen && (
        <div className="mt-4 space-y-4">
          {sliders.map(({ label, key, values }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                {label}
              </label>

              {/* --- MODIFICATION: Added rc-slider component --- */}
              <div className="px-2 pt-2 pb-1">
                <Slider
                  range
                  min={0}
                  max={SLIDER_MAX}
                  step={1000}
                  value={values}
                  onChange={(newValues) =>
                    onFilterChange(key, newValues as [number, number])
                  }
                  trackStyle={{ backgroundColor: "#2563eb" }} // blue-600
                  handleStyle={[
                    {
                      backgroundColor: "#2563eb",
                      borderColor: "#2563eb",
                      opacity: 1,
                      boxShadow: "none",
                    },
                    {
                      backgroundColor: "#2563eb",
                      borderColor: "#2563eb",
                      opacity: 1,
                      boxShadow: "none",
                    },
                  ]}
                  railStyle={{ backgroundColor: "#d1d5db" }} // gray-300
                />
              </div>

              {/* Text Inputs (Unchanged logic, sync with slider) */}
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="number"
                  value={values[0]}
                  onChange={(e) =>
                    handleMinChange(key, e.target.value, values[1])
                  }
                  placeholder="Min"
                  className="w-full text-sm border border-gray-300 rounded-md p-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  value={values[1] === SLIDER_MAX ? "" : values[1]} // Show placeholder if max
                  onChange={(e) =>
                    handleMaxChange(key, values[0], e.target.value)
                  }
                  placeholder="Max"
                  className="w-full text-sm border border-gray-300 rounded-md p-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="text-center text-xs text-gray-500 mt-1">
                {formatNumber(values[0])} - {formatNumber(values[1])}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * --- MODIFICATION: Updated chip removal logic to be more robust ---
 * Displays active filters as "chips" that can be clicked to remove
 */
function SelectedFiltersChips({
  selectedFilters,
  onFilterChange,
  onClearFilters,
  hasActiveFilters,
}: {
  selectedFilters: SelectedFilters;
  onFilterChange: (key: any, value: any) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}) {
  const chips: { key: string; filterKey: keyof SelectedFilters; label: string; value: string }[] =
    [];

  // Create chips for array filters (location, genders, category)
  Object.entries(selectedFilters).forEach(([key, values]) => {
    if (
      Array.isArray(values) &&
      (key === "location" || key === "genders" || key === "category")
    ) {
      const title = key.replace(/_/g, " ");
      values.forEach((value) => {
        chips.push({
          key: `${key}-${value}`,
          filterKey: key as keyof SelectedFilters, // Store the original key
          label: title,
          value: value,
        });
      });
    }
  });

  if (!hasActiveFilters) return null;

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-gray-600">Active Filters</h4>
        <button
          onClick={onClearFilters}
          className="text-xs text-blue-600 hover:text-blue-800"
        >
          Clear All
        </button>
      </div>
      <div className="flex flex-wrap gap-2 max-w-xs">
        {chips.map((chip) => (
          <div
            key={chip.key}
            className="flex items-center text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
          >
            <span className="capitalize mr-1">
              {chip.label}: {chip.value}
            </span>
            <button
              // --- MODIFICATION: Use the stored filterKey ---
              onClick={() => onFilterChange(chip.filterKey, chip.value)} // This triggers a toggle
              className="ml-1 text-blue-500 hover:text-blue-700 focus:outline-none"
              aria-label={`Remove ${chip.value} filter`}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
      <hr className="my-4" />
    </div>
  );
}