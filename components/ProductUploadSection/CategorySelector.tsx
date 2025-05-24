// import React, { useState } from 'react';

// const CategorySelector = () => {
//   // Sample category data structure
//   const categoryData = {
//     saree: {
//       name: 'Saree',
//       subcategories: {
//         kanjeevaram: {
//           name: 'Kanjeevaram',
//           subcategories: {
//             silk: {
//               name: 'Silk',
//               subcategories: {
//                 pure: { name: 'Pure Silk' },
//                 blended: { name: 'Blended Silk' }
//               }
//             },
//             cotton: { name: 'Cotton' }
//           }
//         },
//         banarasi: {
//           name: 'Banarasi',
//           subcategories: {
//             heavy: { name: 'Heavy Work' },
//             light: { name: 'Light Work' }
//           }
//         }
//       }
//     },
//     dress: {
//       name: 'Dress',
//       subcategories: {
//         casual: { name: 'Casual' },
//         formal: { name: 'Formal' }
//       }
//     }
//   };

//   // State for each category level
//   const [selectedCategories, setSelectedCategories] = useState({
//     level1: '',
//     level2: '',
//     level3: '',
//     level4: '',
//     level5: ''
//   });

//   const handleCategoryChange = (level: string, value: string) => {
//     setSelectedCategories(prev => {
//       const newState = { ...prev, [level]: value };
      
//       // Reset all lower levels when a higher level changes
//       const levels = ['level1', 'level2', 'level3', 'level4', 'level5'];
//       const currentIndex = levels.indexOf(level);
      
//       for (let i = currentIndex + 1; i < levels.length; i++) {
//         newState[levels[i]] = '';
//       }
      
//       return newState;
//     });
//   };

//   // Helper function to get subcategories for a given level
//   const getSubcategories = (level: number) => {
//     if (level === 1) return Object.entries(categoryData).map(([key, value]) => ({ key, name: value.name }));
    
//     let current = categoryData;
//     for (let i = 1; i < level; i++) {
//       const currentKey = selectedCategories[`level${i}` as keyof typeof selectedCategories];
//       if (!currentKey || !current[currentKey]?.subcategories) return [];
//       current = current[currentKey].subcategories;
//     }
    
//     return Object.entries(current).map(([key, value]) => ({ key, name: value.name }));
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm">
//       <div className="mb-6">
//         <h3 className="text-lg font-bold text-gray-900 mb-1">Category and sub-category detail</h3>
//         <p className="text-sm text-gray-500 mb-4">This is for internal data, your customers won't see this.</p>
//         <div className="border-b border-gray-200 mb-4"></div>
//       </div>

//       {/* Level 1 Category */}
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
//         <select
//           className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//           value={selectedCategories.level1}
//           onChange={(e) => handleCategoryChange('level1', e.target.value)}
//         >
//           <option value="">Select Category</option>
//           {getSubcategories(1).map((category) => (
//             <option key={category.key} value={category.key}>
//               {category.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Level 2 Subcategory */}
//       {selectedCategories.level1 && (
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700 mb-1">Sub-category</label>
//           <select
//             className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//             value={selectedCategories.level2}
//             onChange={(e) => handleCategoryChange('level2', e.target.value)}
//           >
//             <option value="">Select Sub-category</option>
//             {getSubcategories(2).map((category) => (
//               <option key={category.key} value={category.key}>
//                 {category.name}
//               </option>
//             ))}
//           </select>
//         </div>
//       )}

//       {/* Level 3 Subcategory */}
//       {selectedCategories.level2 && getSubcategories(3).length > 0 && (
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700 mb-1">Sub-category Level 3</label>
//           <select
//             className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//             value={selectedCategories.level3}
//             onChange={(e) => handleCategoryChange('level3', e.target.value)}
//           >
//             <option value="">Select Sub-category</option>
//             {getSubcategories(3).map((category) => (
//               <option key={category.key} value={category.key}>
//                 {category.name}
//               </option>
//             ))}
//           </select>
//         </div>
//       )}

//       {/* Level 4 Subcategory */}
//       {selectedCategories.level3 && getSubcategories(4).length > 0 && (
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700 mb-1">Sub-category Level 4</label>
//           <select
//             className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//             value={selectedCategories.level4}
//             onChange={(e) => handleCategoryChange('level4', e.target.value)}
//           >
//             <option value="">Select Sub-category</option>
//             {getSubcategories(4).map((category) => (
//               <option key={category.key} value={category.key}>
//                 {category.name}
//               </option>
//             ))}
//           </select>
//         </div>
//       )}

//       {/* Level 5 Subcategory */}
//       {selectedCategories.level4 && getSubcategories(5).length > 0 && (
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700 mb-1">Sub-category Level 5</label>
//           <select
//             className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//             value={selectedCategories.level5}
//             onChange={(e) => handleCategoryChange('level5', e.target.value)}
//           >
//             <option value="">Select Sub-category</option>
//             {getSubcategories(5).map((category) => (
//               <option key={category.key} value={category.key}>
//                 {category.name}
//               </option>
//             ))}
//           </select>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CategorySelector;


'use client';

import { useEffect, useState } from 'react';
import { useFormActions, useFormData } from '@/store/product_upload_store';

const CategorySelector = () => {
  // Sample category data structure
  const categoryData = {
    saree: {
      name: 'Saree',
      subcategories: {
        kanjeevaram: {
          name: 'Kanjeevaram',
          subcategories: {
            silk: {
              name: 'Silk',
              subcategories: {
                pure: { name: 'Pure Silk' },
                blended: { name: 'Blended Silk' }
              }
            },
            cotton: { name: 'Cotton' }
          }
        },
        banarasi: {
          name: 'Banarasi',
          subcategories: {
            heavy: { name: 'Heavy Work' },
            light: { name: 'Light Work' }
          }
        }
      }
    },
    dress: {
      name: 'Dress',
      subcategories: {
        casual: { name: 'Casual' },
        formal: { name: 'Formal' }
      }
    }
  };

  // Get form data and actions from Zustand store
  const { category } = useFormData();
  const { updateFormData } = useFormActions();

  // Initialize local state with stored values or defaults
  const [selectedCategories, setSelectedCategories] = useState({
    level1: category?.level1 || '',
    level2: category?.level2 || '',
    level3: category?.level3 || '',
    level4: category?.level4 || '',
    level5: category?.level5 || ''
  });

  // Save to Zustand store when categories change
  useEffect(() => {
    updateFormData('category', selectedCategories);
  }, [selectedCategories, updateFormData]);

  const handleCategoryChange = (level: string, value: string) => {
    setSelectedCategories(prev => {
      const newState = { ...prev, [level]: value };
      
      // Reset all lower levels when a higher level changes
      const levels = ['level1', 'level2', 'level3', 'level4', 'level5'];
      const currentIndex = levels.indexOf(level);
      
      for (let i = currentIndex + 1; i < levels.length; i++) {
        newState[levels[i] as keyof typeof newState] = '';
      }
      
      return newState;
    });
  };

  // Helper function to get subcategories for a given level
  const getSubcategories = (level: number) => {
    if (level === 1) return Object.entries(categoryData).map(([key, value]) => ({ key, name: value.name }));
    
    let current = categoryData;
    for (let i = 1; i < level; i++) {
      const currentKey  = selectedCategories[`level${i}` as keyof typeof selectedCategories];
      if (!currentKey || !current[currentKey]?.subcategories) return [];
      current = current[currentKey].subcategories;
    }
    
    return Object.entries(current).map(([key, value]) => ({ key, name: value.name }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-1">Category and sub-category detail</h3>
        <p className="text-sm text-gray-500 mb-4">This is for internal data, your customers won't see this.</p>
        <div className="border-b border-gray-200 mb-4"></div>
      </div>

      {/* Level 1 Category */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          value={selectedCategories.level1}
          onChange={(e) => handleCategoryChange('level1', e.target.value)}
        >
          <option value="">Select Category</option>
          {getSubcategories(1).map((category) => (
            <option key={category.key} value={category.key}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Level 2 Subcategory */}
      {selectedCategories.level1 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Sub-category</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={selectedCategories.level2}
            onChange={(e) => handleCategoryChange('level2', e.target.value)}
          >
            <option value="">Select Sub-category</option>
            {getSubcategories(2).map((category) => (
              <option key={category.key} value={category.key}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Level 3 Subcategory */}
      {selectedCategories.level2 && getSubcategories(3).length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Sub-category Level 3</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={selectedCategories.level3}
            onChange={(e) => handleCategoryChange('level3', e.target.value)}
          >
            <option value="">Select Sub-category</option>
            {getSubcategories(3).map((category) => (
              <option key={category.key} value={category.key}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Level 4 Subcategory */}
      {selectedCategories.level3 && getSubcategories(4).length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Sub-category Level 4</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={selectedCategories.level4}
            onChange={(e) => handleCategoryChange('level4', e.target.value)}
          >
            <option value="">Select Sub-category</option>
            {getSubcategories(4).map((category) => (
              <option key={category.key} value={category.key}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Level 5 Subcategory */}
      {selectedCategories.level4 && getSubcategories(5).length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Sub-category Level 5</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={selectedCategories.level5}
            onChange={(e) => handleCategoryChange('level5', e.target.value)}
          >
            <option value="">Select Sub-category</option>
            {getSubcategories(5).map((category) => (
              <option key={category.key} value={category.key}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default CategorySelector;