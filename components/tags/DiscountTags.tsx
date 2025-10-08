"use client";

import { useFilterStore } from "@/store/filterStore";
import { useEffect } from "react";

/**
 * A component that fetches and displays active discount tags.
 * It allows users to filter the store list by selecting a tag.
 */
export default function DiscountTags() {
  // Destructure the new state and action from the updated filter store
  const { 
    discountTags, 
    fetchDiscountTags, 
    selectedDiscount, // ✅ Use the new dedicated state for discounts
    setDiscountFilter, // ✅ Use the new dedicated action
    isFetchingTags 
  } = useFilterStore();

  // Fetch the tags from the API only when the component mounts
  useEffect(() => {
    fetchDiscountTags();
  }, [fetchDiscountTags]);

  /**
   * Handles the click event on a tag.
   * If the clicked tag is already selected, it deselects it (by passing null).
   * Otherwise, it sets the clicked tag as the active filter.
   */
  const handleTagClick = (title: string) => {
    const isCurrentlySelected = selectedDiscount === title;
    
    // ✅ Call the correct action with either the new title or null to clear it
    setDiscountFilter(isCurrentlySelected ? null : title);
    // console.log(selectedDiscount);
  };

  // While fetching, you can show a subtle loading state or nothing.
  if (isFetchingTags) {
    // You could return a skeleton loader here for better UX
    return null; 
  }

  // If there are no tags after fetching, don't render the component.
  if (!discountTags || discountTags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
      <h3 className="text-sm font-semibold text-gray-800">Popular Offers:</h3>
      {discountTags.map((tag) => {
        // ✅ The active state is now determined by the dedicated `selectedDiscount` state
        const isActive = selectedDiscount === tag.title;
        return (
          <button
            key={tag.title}
            onClick={() => handleTagClick(tag.title)}
            className={`px-4 py-1.5 text-sm rounded-full transition-all duration-200 ease-in-out transform active:scale-95 border ${
              isActive
                ? 'bg-black text-white border-black' // Styles for the active/selected button.
                : 'bg-white text-[#878787] border-[#878787] hover:border-black hover:text-black'
            }`}
          >
            {tag.title}
          </button>
        );
      })}
    </div>
  );
}

