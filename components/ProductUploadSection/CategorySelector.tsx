'use client';

import { useEffect, useState } from 'react';
import { useFormActions, useFormData } from '@/store/product_upload_store';
import { api } from '@/lib/axios';
import { log } from 'console';

interface Category {
  category_id: string;
  name: string;
  parent_id: string | null;
  children: Category[];
}

const CategorySelector = () => {
  // Get form data and actions from Zustand store
  const { category } = useFormData();
  const { updateFormData } = useFormActions();

  // State for categories and selections
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState({
    level1: category?.level1||'',
    level2: category?.level2||'',
    level3: category?.level3||'',
    level4: category?.level4||'',
    level5: category?.level5||'',
  });

  // Load categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories/descendants/');
        console.log("my_response" , response)
        const data = await response.data;
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Helper function to find category by ID
  const findCategoryById = (id: string, categoryList: Category[]): Category | undefined => {
    for (const category of categoryList) {
      if (category.category_id === id) return category;
      if (category.children.length > 0) {
        const found = findCategoryById(id, category.children);
        if (found) return found;
      }
    }
    return undefined;
  };

  // Get subcategories for a given level
  const getSubcategories = (level: number): { id: string; name: string }[] => {
    if (level === 1) {
      return categories
        .filter(cat => cat.parent_id === null)
        .map(cat => ({ id: cat.category_id, name: cat.name }));
    }

    const parentLevel = level - 1;
    const parentId = selectedCategories[`level${parentLevel}` as keyof typeof selectedCategories];
    if (!parentId) return [];

    const parentCategory = findCategoryById(parentId, categories);
    if (!parentCategory) return [];

    return parentCategory.children.map(child => ({
      id: child.category_id,
      name: child.name
    }));
  };

  const handleCategoryChange = (level: string, categoryId: string) => {
    setSelectedCategories(prev => {
      const newState = { ...prev, [level]: categoryId };
      
      // Reset all lower levels when a higher level changes
      const levels = ['level1', 'level2', 'level3', 'level4', 'level5'];
      const currentIndex = levels.indexOf(level);
      
      for (let i = currentIndex + 1; i < levels.length; i++) {
        newState[levels[i] as keyof typeof newState] = '';
      }
      
      return newState;
    });
  };

  // Save to Zustand store when categories change
  useEffect(() => {
    updateFormData('category', selectedCategories);
  }, [selectedCategories, updateFormData]);

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
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Level 2 Subcategory */}
      {selectedCategories.level1 && getSubcategories(2).length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Sub-category</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={selectedCategories.level2}
            onChange={(e) => handleCategoryChange('level2', e.target.value)}
          >
            <option value="">Select Sub-category</option>
            {getSubcategories(2).map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Render additional levels as needed (level3, level4, etc.) */}
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
              <option key={category.id} value={category.id}>
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