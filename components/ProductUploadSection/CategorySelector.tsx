// "use client";

// import { useEffect, useState } from "react";
// import {
//   useCurrentStep,
//   useFormActions,
//   useFormData,
//   useIsLoading,
// } from "@/store/product_upload_store";
// import { api } from "@/lib/axios";
// import LoadingSpinner from "../ui/LoadingSpinner";

// interface Category {
//   category_id: string;
//   name: string;
//   parent_id: string | null;
//   children: Category[];
//   level?: number;
// }

// export default function CategorySelector() {
//   const { category } = useFormData();
//   const { updateFormData, setStepValidation, setLoading } = useFormActions();
//   const currentStep = useCurrentStep();
//   const isLoading = useIsLoading();

//   // State for categories and selections
//   const [categories, setCategories] = useState<Category[]>([]);

//   const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
//   const [categorySearch, setCategorySearch] = useState("");
//   const [showCategoryDropdown, setShowCategoryDropdown] = useState({
//     level1: false,
//     level2: false,
//     level3: false,
//     level4: false,
//     // level5: false,
//   });

//   const [selectedCategories, setSelectedCategories] = useState({
//     level1: category?.level1 || null,
//     level2: category?.level2 || null,
//     level3: category?.level3 || null,
//     level4: category?.level4 || null,
//     // level5: category?.level5 || null,
//   });

//   const closeAllDropdowns = () => {
//     setShowCategoryDropdown({
//       level1: false,
//       level2: false,
//       level3: false,
//       level4: false,
//       // level5: false,
//     });
//   };

//   useEffect(() => {
//     const isValid =
//       !!selectedCategories?.level1 &&
//       !!selectedCategories?.level2 &&
//       !!selectedCategories?.level3 &&
//       !!selectedCategories?.level4;
//       // ###

//     setStepValidation(currentStep, isValid);
//   }, [selectedCategories, currentStep]);

//   // Load categories from API
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         // setLoading(true);
//         const response = await api.get("/categories/");
//         setCategories(response.data);
//         setFilteredCategories(response.data);
//         setLoading(false);
//       } catch (error) {
//         setLoading(false);
//         console.error("Error fetching categories:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCategories();
//   }, []);

//   // Filter categories based on search input
//   useEffect(() => {
//     if (categorySearch) {
//       setFilteredCategories(
//         categories.filter(
//           (cat) =>
//             cat.name.toLowerCase().includes(categorySearch.toLowerCase()) &&
//             cat.parent_id === null // Only show top-level categories initially
//         )
//       );
//     } else {
//       setFilteredCategories(categories.filter((cat) => cat.parent_id === null));
//     }
//   }, [categorySearch, categories]);

//   // Save to Zustand store when component unmounts
//   useEffect(() => {
//     return () => {
//       console.log(selectedCategories);
//       updateFormData("category", selectedCategories);
//     };
//   }, [selectedCategories, updateFormData]);

//   const handleCategorySelect = (category: Category, level: number) => {
//     setSelectedCategories((prev) => {
//       const newState = {
//         ...prev,
//         [`level${level}`]: {
//           category_id: category.category_id,
//           name: category.name,
//         },
//       };

//       // Reset all lower levels when a higher level changes
//       for (let i = level + 1; i <= 5; i++) {
//         newState[`level${i}` as keyof typeof newState] = null;
//       }

//       return newState;
//     });

//     setCategorySearch(category.name);
//     closeAllDropdowns();
//   };

//   const handleClickOutside = (e: MouseEvent) => {
//     if (!(e.target as HTMLElement).closest(".category-dropdown-container")) {
//       closeAllDropdowns();
//     }
//   };

//   useEffect(() => {
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [showCategoryDropdown]);

//   // Get subcategories for a selected level
//   const getSubcategories = (level: number): Category[] => {
//     if (level === 1) return categories.filter((cat) => cat.parent_id === null);

//     const parentId =
//       selectedCategories[`level${level - 1}` as keyof typeof selectedCategories]
//         ?.category_id;
//     if (!parentId) return [];
//     return categories.filter((cat) => cat.parent_id === parentId);
//   };

//   // Get display name for selected category at a level
//   const getSelectedCategoryName = (level: number): string => {
//     const categoryId =
//       selectedCategories[`level${level}` as keyof typeof selectedCategories]
//         ?.category_id;
//     if (!categoryId) return "";

//     const category = categories.find((cat) => cat.category_id === categoryId);
//     return category?.name || "";
//   };

//   console.log(showCategoryDropdown);

//   return (
//     isLoading ? (
//         <LoadingSpinner />
//       ) : (
//     <div className="max-w-4xl mx-auto bg-white rounded-lg self-start">
//       <h1 className="text-lg font-bold mb-2">Category and sub-category</h1>
//       <p className="text-gray-600 mb-6 border-b border-gray-200">
//         Select the appropriate categories for your product
//       </p>


//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Column 1 */}
//           <div className="flex flex-col gap-4">
//             {/* Level 1 Category */}
//             <div className="category-dropdown-container relative">
//               <label className="block text-sm font-medium mb-1">
//                 Main Category
//               </label>
//               <input
//                 type="text"
//                 value={getSelectedCategoryName(1) || categorySearch}
//                 onChange={(e) => {
//                   setCategorySearch(e.target.value);
//                   setShowCategoryDropdown((prev) => ({
//                     ...prev,
//                     [`level1`]: true,
//                   }));
//                 }}
//                 onFocus={() => {
//                   setCategorySearch("");
//                   setShowCategoryDropdown((prev) => ({
//                     ...prev,
//                     [`level1`]: true,
//                   }));
//                 }}
//                 className="w-full border border-gray-300 rounded-md p-2"
//                 placeholder="Search and select category"
//               />

//               {showCategoryDropdown.level1 && (
//                 <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
//                   {filteredCategories.length > 0 ? (
//                     filteredCategories.map((category) => (
//                       <div
//                         key={category.category_id}
//                         className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                         onClick={() => handleCategorySelect(category, 1)}
//                       >
//                         <div className="font-medium">{category.name}</div>
//                       </div>
//                     ))
//                   ) : (
//                     <div className="px-4 py-2 text-gray-500">
//                       No categories found
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Level 3 Category (if level 2 is selected) */}
//             {selectedCategories.level2 && getSubcategories(3).length > 0 && (
//               <div className="category-dropdown-container relative">
//                 <label className="block text-sm font-medium mb-1">
//                   Sub-category Level 3
//                 </label>
//                 <input
//                   type="text"
//                   value={getSelectedCategoryName(3)}
//                   readOnly
//                   className="w-full border border-gray-300 rounded-md p-2 bg-gray-50"
//                   placeholder="Select level 2 first"
//                   onClick={() => {
//                     setCategorySearch("");
//                     setFilteredCategories(getSubcategories(3));
//                     setShowCategoryDropdown((prev) => ({
//                       ...prev,
//                       [`level3`]: true,
//                     }));
//                   }}
//                 />
//                 {showCategoryDropdown.level3 && (
//                   <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
//                     {getSubcategories(3).map((category) => (
//                       <div
//                         key={category.category_id}
//                         className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                         onClick={() => handleCategorySelect(category, 3)}
//                       >
//                         <div className="font-medium">{category.name}</div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Column 2 */}
//           <div className="flex flex-col gap-4">
//             {/* Level 2 Category (if level 1 is selected) */}
//             {selectedCategories.level1 && getSubcategories(2).length > 0 && (
//               <div className="category-dropdown-container relative">
//                 <label className="block text-sm font-medium mb-1">
//                   Sub-category Level 2
//                 </label>
//                 <input
//                   type="text"
//                   value={getSelectedCategoryName(2)}
//                   readOnly
//                   className="w-full border border-gray-300 rounded-md p-2 bg-gray-50"
//                   placeholder="Select level 1 first"
//                   onClick={() => {
//                     setCategorySearch("");
//                     setFilteredCategories(getSubcategories(2));
//                     setShowCategoryDropdown((prev) => ({
//                       ...prev,
//                       [`level2`]: true,
//                     }));
//                   }}
//                 />
//                 {showCategoryDropdown.level2 && (
//                   <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
//                     {getSubcategories(2).map((category) => (
//                       <div
//                         key={category.category_id}
//                         className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                         onClick={() => handleCategorySelect(category, 2)}
//                       >
//                         <div className="font-medium">{category.name}</div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Level 4 Category (if level 3 is selected) */}
//             {selectedCategories.level3 && getSubcategories(4).length > 0 && (
//               <div className="category-dropdown-container relative">
//                 <label className="block text-sm font-medium mb-1">
//                   Sub-category Level 4
//                 </label>
//                 <input
//                   type="text"
//                   value={getSelectedCategoryName(4)}
//                   readOnly
//                   className="w-full border border-gray-300 rounded-md p-2 bg-gray-50"
//                   placeholder="Select level 3 first"
//                   onClick={() => {
//                     setCategorySearch("");
//                     setFilteredCategories(getSubcategories(4));
//                     setShowCategoryDropdown((prev) => ({
//                       ...prev,
//                       [`level4`]: true,
//                     }));
//                   }}
//                 />
//                 {showCategoryDropdown.level4 && (
//                   <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
//                     {getSubcategories(4).map((category) => (
//                       <div
//                         key={category.category_id}
//                         className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                         onClick={() => handleCategorySelect(category, 4)}
//                       >
//                         <div className="font-medium">{category.name}</div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>

//     </div>
//   )
//   );
// }


'use client';

import { useEffect, useState } from "react";
import {
  useCurrentStep,
  useFormActions,
  useFormData,
  useIsLoading,
} from "@/store/product_upload_store";
import { api } from "@/lib/axios";
import LoadingSpinner from "../ui/LoadingSpinner";

interface Category {
  category_id: string;
  name: string;
  parent_id: string | null;
  children: Category[];
  level?: number;
}

export default function CategorySelector() {
  const { category } = useFormData();
  const { updateFormData, setStepValidation, setLoading } = useFormActions();
  const currentStep = useCurrentStep();
  const isLoading = useIsLoading();

  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [categorySearch, setCategorySearch] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState({
    level1: false,
    level2: false,
    level3: false,
    level4: false,
  });
  console.log(category);
  const [selectedCategories, setSelectedCategories] = useState({
    level1: category?.level1 || null,
    level2: category?.level2 || null,
    level3: category?.level3 || null,
    level4: category?.level4 || null,
  });

  const closeAllDropdowns = () => {
    setShowCategoryDropdown({
      level1: false,
      level2: false,
      level3: false,
      level4: false,
    });
  };

  useEffect(() => {
    const isValid =
      !!selectedCategories.level1 &&
      !!selectedCategories.level2 &&
      !!selectedCategories.level3 &&
      !!selectedCategories.level4;

    setStepValidation(currentStep, isValid);
  }, [selectedCategories, currentStep]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories/");
        setCategories(response.data);
        setFilteredCategories(response.data.filter((cat: Category) => cat.parent_id === null));
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    return () => {
      updateFormData("category", selectedCategories);
    };
  }, [selectedCategories, updateFormData]);

  

  const handleCategorySelect = (category: Category, level: number) => {
    setSelectedCategories((prev) => {
      const newState = {
        ...prev,
        [`level${level}`]: {
          category_id: category.category_id,
          name: category.name,
        },
      };
      for (let i = level + 1; i <= 5; i++) {
        newState[`level${i}` as keyof typeof newState] = null;
      }
      return newState;
    });
    if (level === 1) {
      setCategorySearch(category.name); // Only update search input for level 1
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

  const getSubcategories = (level: number): Category[] => {
    if (level === 1) return categories.filter((cat) => cat.parent_id === null);

    const parentId = selectedCategories[`level${level - 1}` as keyof typeof selectedCategories]?.category_id;
    if (!parentId) return [];
    return categories.filter((cat) => cat.parent_id === parentId);
  };

  const getSelectedCategoryName = (level: number): string => {
    const categoryId = selectedCategories[`level${level}` as keyof typeof selectedCategories]?.category_id;
    if (!categoryId) return "";
    console.log(categoryId, level);
    console.log(categories);
    return categories.find((cat) => cat.category_id === categoryId)?.name || "";
  };

  useEffect(() => {
    if (selectedCategories.level1 && !categorySearch) {
      console.log(selectedCategories.level1);
      const prefilledName = getSelectedCategoryName(1);
      console.log(prefilledName);
      setCategorySearch(prefilledName);
    }
  }, [categories,selectedCategories.level1, categorySearch]);

  return isLoading ? (
    <LoadingSpinner />
  ) : (
    <div className="max-w-4xl mx-auto bg-white rounded-lg self-start">
      <h1 className="text-lg font-bold mb-2">Category and sub-category</h1>
      <p className="text-gray-600 mb-6 border-b border-gray-200">
        Select the appropriate categories for your product
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Column 1 */}
        <div className="flex flex-col gap-4">
          {/* Level 1 */}
          <div className="category-dropdown-container relative">
            <label className="block text-sm font-medium mb-1">
              Main Category
            </label>
            <input
              type="text"
              value={categorySearch}
              onChange={(e) => {
                const val = e.target.value;
                setCategorySearch(val);

                if (val === "") {
                  setSelectedCategories({
                    level1: null,
                    level2: null,
                    level3: null,
                    level4: null,
                  });
                }

                setFilteredCategories(
                  categories.filter(
                    (cat) =>
                      cat.parent_id === null &&
                      cat.name.toLowerCase().includes(val.toLowerCase())
                  )
                );

                setShowCategoryDropdown((prev) => ({
                  ...prev,
                  level1: true,
                }));
              }}
              onFocus={() =>
                setShowCategoryDropdown((prev) => ({ ...prev, level1: true }))
              }
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Main Category"
            />
            {showCategoryDropdown.level1 && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <div
                      key={category.category_id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleCategorySelect(category, 1)}
                    >
                      <div className="font-medium">{category.name}</div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500">
                    No categories found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Level 3 */}
          {selectedCategories.level2 && getSubcategories(3).length > 0 && (
            <div className="category-dropdown-container relative">
              <label className="block text-sm font-medium mb-1">
                Sub-category Level 3
              </label>
              <input
                type="text"
                value={getSelectedCategoryName(3)}
                readOnly
                className="w-full border border-gray-300 rounded-md p-2 bg-gray-50"
                placeholder="Sub-category Level 3"
                onClick={() => {
                  setShowCategoryDropdown((prev) => ({
                    ...prev,
                    level3: true,
                  }));
                }}
              />
              {showCategoryDropdown.level3 && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {getSubcategories(3).map((category) => (
                    <div
                      key={category.category_id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleCategorySelect(category, 3)}
                    >
                      <div className="font-medium">{category.name}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-4">
          {/* Level 2 */}
          {selectedCategories.level1 && getSubcategories(2).length > 0 && (
            <div className="category-dropdown-container relative">
              <label className="block text-sm font-medium mb-1">
                Sub-category Level 2
              </label>
              <input
                type="text"
                value={getSelectedCategoryName(2)}
                readOnly
                className="w-full border border-gray-300 rounded-md p-2 bg-gray-50"
                placeholder="Sub-category Level 2"
                onClick={() => {
                  setShowCategoryDropdown((prev) => ({
                    ...prev,
                    level2: true,
                  }));
                }}
              />
              {showCategoryDropdown.level2 && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {getSubcategories(2).map((category) => (
                    <div
                      key={category.category_id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleCategorySelect(category, 2)}
                    >
                      <div className="font-medium">{category.name}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Level 4 */}
          {selectedCategories.level3 && getSubcategories(4).length > 0 && (
            <div className="category-dropdown-container relative">
              <label className="block text-sm font-medium mb-1">
                Sub-category Level 4
              </label>
              <input
                type="text"
                value={getSelectedCategoryName(4)}
                readOnly
                className="w-full border border-gray-300 rounded-md p-2 bg-gray-50"
                placeholder="Sub-category Level 4"
                onClick={() => {
                  setShowCategoryDropdown((prev) => ({
                    ...prev,
                    level4: true,
                  }));
                }}
              />
              {showCategoryDropdown.level4 && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {getSubcategories(4).map((category) => (
                    <div
                      key={category.category_id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleCategorySelect(category, 4)}
                    >
                      <div className="font-medium">{category.name}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
