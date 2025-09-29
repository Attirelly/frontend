import React from 'react';

// --- (Optional) It's good practice to keep icons as separate components ---
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const ClearIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>;


// --- Filters Component ---
export default function Filters({ filters, setFilters }) {
  // --- UX IMPROVEMENT: Helper to check if any filter is currently active ---
  const isFilterActive = filters.q || filters.status || filters.type;

  const handleClearFilters = () => {
    setFilters({ q: "", status: "", type: "" });
  };

  return (
    // --- UI IMPROVEMENT: Main container with better padding and layout ---
    <div className="flex items-center justify-between gap-4 px-6 py-4 bg-white border-b border-gray-200">
      <div className="flex items-center gap-4">

        {/* --- UI/UX IMPROVEMENT: Search Input with embedded icons --- */}
        <div className="relative">
          <label htmlFor="search-campaign" className="sr-only">Search Campaigns</label>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <SearchIcon />
          </div>
          <input
            id="search-campaign"
            type="text"
            placeholder="Search campaigns..."
            value={filters.q}
            onChange={(e) => setFilters((s) => ({ ...s, q: e.target.value }))}
            className="block w-64 pl-10 pr-10 py-2 border border-gray-300 rounded-md bg-white text-gray-900 text-sm focus:border-gray-800 focus:ring-gray-800"
          />
          {/* --- Conditionally show a clear button inside the input --- */}
          {filters.q && (
            <button
              onClick={() => setFilters((s) => ({ ...s, q: "" }))}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <ClearIcon />
            </button>
          )}
        </div>

        {/* Status Select Filter with hidden label for accessibility */}
        <div>
          <label htmlFor="status-filter" className="sr-only">Filter by Status</label>
          <select
            id="status-filter"
            value={filters.status}
            onChange={(e) => setFilters((s) => ({ ...s, status: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 text-sm focus:border-gray-800 focus:ring-gray-800"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        {/* Type Select Filter with hidden label for accessibility */}
        <div>
          <label htmlFor="type-filter" className="sr-only">Filter by Targeting Type</label>
          <select
            id="type-filter"
            value={filters.type}
            onChange={(e) => setFilters((s) => ({ ...s, type: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 text-sm focus:border-gray-800 focus:ring-gray-800"
          >
            <option value="">All Types</option>
            <option value="keyword">Keyword</option>
            <option value="category">Category</option>
            <option value="auto">Automatic</option>
          </select>
        </div>

        {/* --- UX IMPROVEMENT: Conditionally render a 'Clear All' button --- */}
        {isFilterActive && (
          <button
            onClick={handleClearFilters}
            className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            Clear All
          </button>
        )}
      </div>
      
      {/* --- UI IMPROVEMENT: A more subtle right-aligned element --- */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>Campaign Type:</span>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Sponsored
        </span>
      </div>
    </div>
  );
}