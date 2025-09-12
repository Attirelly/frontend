"use client";

import { useEffect, useState } from "react";
import {
  useCurrentStep,
  useFormActions,
  useFormData,
  useIsLoading,
} from "@/store/product_upload_store";
import { api } from "@/lib/axios";
import LoadingSpinner from "../ui/LoadingSpinner";

/**
 * @interface Category
 * @description Defines the structure for a single category item as returned by the API.
 */
interface Category {
  category_id: string;
  name: string;
  parent_id: string | null;
  children: Category[];
  level?: number;
}

/**
 * A component for selecting a multi-level product category using cascading dropdowns.
 *
 * This component constitutes a step in the product upload form. It fetches a complete hierarchy
 * of categories from the backend and presents the user with a series of dependent dropdowns.
 * Selecting a category at one level populates the options for the next level. The component
 * validates that a complete, four-level category path has been selected before allowing the user to proceed.
 *
 * ### State Management
 * - **Local State (`useState`)**: Manages the complete list of categories fetched from the API, the user's current selections at each level, and the visibility state of each dropdown.
 * - **Global State (`product_upload_store`)**: It reads the initial category state from the store (`useFormData`) and continuously updates the store with the user's selections (`updateFormData`). It also updates the step's validation status (`setStepValidation`).
 *
 * ### API Endpoint
 * **`GET /categories/`**
 * This endpoint is called once on component mount to fetch the entire category tree. The component then handles the parent-child relationships and filtering on the client side.
 * - **Returns**: `Category[]` - A flat array of all category objects.
 *
 * @returns {JSX.Element} The category selection interface for the product upload form.
 * @see {@link https://docs.pmnd.rs/zustand/getting-started/introduction | Zustand Documentation}
 * @see {@link https://axios-http.com/docs/intro | Axios Documentation}
 */
export default function CategorySelector() {
  const { category } = useFormData();
  const { updateFormData, setStepValidation } = useFormActions();
  const currentStep = useCurrentStep();
  const isLoading = useIsLoading();
  // Holds the entire flat list of categories fetched from the API.
  const [categories, setCategories] = useState<Category[]>([]);
  // Holds the categories filtered for the top-level search input.
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  // The value of the search input for the main category.
  const [categorySearch, setCategorySearch] = useState("");
  // Manages the open/closed state of each level's dropdown menu.
  const [showCategoryDropdown, setShowCategoryDropdown] = useState({
    level1: false,
    level2: false,
    level3: false,
    level4: false,
  });

  // Stores the user's selected category object for each of the four levels.
  const [selectedCategories, setSelectedCategories] = useState({
    level1: category?.level1 || null,
    level2: category?.level2 || null,
    level3: category?.level3 || null,
    level4: category?.level4 || null,
  });

  /**
   * Closes all category dropdown menus.
   */
  const closeAllDropdowns = () => {
    setShowCategoryDropdown({
      level1: false,
      level2: false,
      level3: false,
      level4: false,
    });
  };

  /**
   * This effect checks for the validity of the current step.
   * The step is considered valid only if all four category levels have been selected.
   * It then updates the global validation state in the Zustand store.
   */
  useEffect(() => {
    const isValid =
      !!selectedCategories.level1 &&
      !!selectedCategories.level2 &&
      !!selectedCategories.level3 &&
      !!selectedCategories.level4;

    setStepValidation(currentStep, isValid);
  }, [selectedCategories, currentStep, setStepValidation]);
  /**
   * This effect fetches the complete list of categories from the API when the component mounts.
   */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories/");
        setCategories(response.data);
        setFilteredCategories(
          response.data.filter((cat: Category) => cat.parent_id === null)
        );
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);
  /**
   * This effect continuously syncs the local `selectedCategories` state with the global Zustand store.
   * This ensures the form data is always up-to-date.
   */
  useEffect(() => {
    updateFormData("category", selectedCategories);
  }, [selectedCategories, updateFormData]);

  /**
   * Handles the selection of a category from a dropdown.
   * @param {Category} category The category object that was selected.
   * @param {number} level The level of the category being selected (1-4).
   */
  const handleCategorySelect = (category: Category, level: number) => {
    setSelectedCategories((prev) => {
      const newState: any = {
        ...prev,
        [`level${level}`]: {
          category_id: category.category_id,
          name: category.name,
        },
      };
      // Reset subsequent levels when a parent category changes
      for (let i = level + 1; i <= 4; i++) {
        newState[`level${i}`] = null;
      }
      return newState;
    });
    if (level === 1) {
      setCategorySearch(category.name);
    }
    closeAllDropdowns();
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (!(e.target as HTMLElement).closest(".category-dropdown-container")) {
      closeAllDropdowns();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

    /**
   * Gets the list of subcategories for a given level, based on the parent selection.
   * @param {number} level The level for which to get subcategories (e.g., level 2 needs the parent from level 1).
   * @returns {Category[]} An array of category objects.
   */
  const getSubcategories = (level: number): Category[] => {
    if (level === 1) return categories.filter((cat) => cat.parent_id === null);

    const parentId =
      selectedCategories[`level${level - 1}` as keyof typeof selectedCategories]
        ?.category_id;
    if (!parentId) return [];
    return categories.filter((cat) => cat.parent_id === parentId);
  };

  const getSelectedCategoryName = (level: number): string => {
    return (
      selectedCategories[`level${level}` as keyof typeof selectedCategories]
        ?.name || ""
    );
  };

  useEffect(() => {
    if (selectedCategories.level1 && !categorySearch) {
      const prefilledName = getSelectedCategoryName(1);
      setCategorySearch(prefilledName);
    }
  }, [categories, selectedCategories.level1]);

  return isLoading ? (
    <LoadingSpinner />
  ) : (
    <div className="bg-white rounded-lg self-start">
      <h1 className="text-base sm:text-lg font-bold mb-2">
        Category and sub-category
      </h1>
      <p className="text-xs sm:text-sm text-gray-600 mb-6 pb-4 border-b border-gray-200">
        Select the appropriate categories for your product
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Level 1 */}
        <div className="category-dropdown-container relative">
          <label className="block text-xs sm:text-sm font-medium mb-1">
            Main Category
          </label>
          <input
            type="text"
            value={categorySearch}
            onChange={(e) => {
              const val = e.target.value;
              setCategorySearch(val);
              if (val === "")
                setSelectedCategories({
                  level1: null,
                  level2: null,
                  level3: null,
                  level4: null,
                });
              setFilteredCategories(
                categories.filter(
                  (cat) =>
                    cat.parent_id === null &&
                    cat.name.toLowerCase().includes(val.toLowerCase())
                )
              );
              setShowCategoryDropdown((prev) => ({ ...prev, level1: true }));
            }}
            onFocus={() =>
              setShowCategoryDropdown((prev) => ({ ...prev, level1: true }))
            }
            className="w-full border border-gray-300 rounded-md p-2 text-sm"
            placeholder="Search Main Category"
          />
          {showCategoryDropdown.level1 && (
            <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto scrollbar-thin">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <div
                    key={category.category_id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleCategorySelect(category, 1)}
                  >
                    <div className="font-medium text-sm">{category.name}</div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500 text-sm">
                  No categories found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Level 2 */}
        {selectedCategories.level1 && getSubcategories(2).length > 0 && (
          <div className="category-dropdown-container relative">
            <label className="block text-xs sm:text-sm font-medium mb-1">
              Sub-category (Level 1)
            </label>
            <input
              type="text"
              value={getSelectedCategoryName(2)}
              readOnly
              className="w-full border border-gray-300 rounded-md p-2 bg-gray-50 cursor-pointer text-sm"
              placeholder="Select Sub-category"
              onClick={() =>
                setShowCategoryDropdown((prev) => ({ ...prev, level2: true }))
              }
            />
            {showCategoryDropdown.level2 && (
              <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto scrollbar-thin">
                {getSubcategories(2).map((category) => (
                  <div
                    key={category.category_id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleCategorySelect(category, 2)}
                  >
                    <div className="font-medium text-sm">{category.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Level 3 */}
        {selectedCategories.level2 && getSubcategories(3).length > 0 && (
          <div className="category-dropdown-container relative">
            <label className="block text-xs sm:text-sm font-medium mb-1">
              Sub-category (Level 2)
            </label>
            <input
              type="text"
              value={getSelectedCategoryName(3)}
              readOnly
              className="w-full border border-gray-300 rounded-md p-2 bg-gray-50 cursor-pointer text-sm"
              placeholder="Select Sub-category"
              onClick={() =>
                setShowCategoryDropdown((prev) => ({ ...prev, level3: true }))
              }
            />
            {showCategoryDropdown.level3 && (
              <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto scrollbar-thin">
                {getSubcategories(3).map((category) => (
                  <div
                    key={category.category_id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleCategorySelect(category, 3)}
                  >
                    <div className="font-medium text-sm">{category.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Level 4 */}
        {selectedCategories.level3 && getSubcategories(4).length > 0 && (
          <div className="category-dropdown-container relative">
            <label className="block text-xs sm:text-sm font-medium mb-1">
              Sub-category (Level 3)
            </label>
            <input
              type="text"
              value={getSelectedCategoryName(4)}
              readOnly
              className="w-full border border-gray-300 rounded-md p-2 bg-gray-50 cursor-pointer text-sm"
              placeholder="Select Sub-category"
              onClick={() =>
                setShowCategoryDropdown((prev) => ({ ...prev, level4: true }))
              }
            />
            {showCategoryDropdown.level4 && (
              <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto scrollbar-thin">
                {getSubcategories(4).map((category) => (
                  <div
                    key={category.category_id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleCategorySelect(category, 4)}
                  >
                    <div className="font-medium text-sm">{category.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
