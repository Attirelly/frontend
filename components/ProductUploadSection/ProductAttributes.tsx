'use client';

import { useEffect, useState } from 'react';
import { useFormActions, useFormData } from '@/store/product_upload_store';

const ProductAttributes = () => {
  // Get form data and actions from Zustand store
  const { attributes } = useFormData();
  const { updateFormData } = useFormActions();

  // Initialize local state with stored values or defaults
  const [formState, setFormState] = useState({
    productName: attributes?.productName || '',
    productDescription: attributes?.productDescription || '',
    selectedFit: attributes?.selectedFit || 'straight',
    selectedFabric: attributes?.selectedFabric || ''
  });

  // Save to Zustand store when form changes
  useEffect(() => {
    updateFormData('attributes', formState);
  }, [formState, updateFormData]);

  const fitOptions = [
    { value: 'narrow', label: 'Narrow' },
    { value: 'loose', label: 'Loose fit' },
    { value: 'straight', label: 'Straight' },
    { value: 'exhibition', label: 'Exhibition' },
  ];

  const fabricOptions = [
    { value: '', label: 'Choose the fabric type', disabled: true },
    { value: 'cotton', label: 'Cotton' },
    { value: 'polyester', label: 'Polyester' },
    { value: 'wool', label: 'Wool' },
    { value: 'silk', label: 'Silk' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-1">Attributes</h3>
        <p className="text-sm text-gray-500 mb-4">This is for internal data, your customers won't see this.</p>
        <p className="text-base text-gray-700 mb-2">Product Attributes</p>
        <div className="border-b border-gray-200 mb-4"></div>
      </div>
      
      {/* Fit Dropdown */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Fit</label>
        <select
          name="selectedFit"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          value={formState.selectedFit}
          onChange={handleChange}
        >
          {fitOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
      {/* Product Name Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Product name</label>
        <input
          type="text"
          name="productName"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Please enter your product name"
          value={formState.productName}
          onChange={handleChange}
        />
      </div>
      
      {/* Product Description Textarea */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Product description</label>
        <textarea
          name="productDescription"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Please enter product description"
          rows={4}
          value={formState.productDescription}
          onChange={handleChange}
        />
      </div>
      
      {/* Fabric Dropdown */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Fabric</label>
        <select
          name="selectedFabric"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          value={formState.selectedFabric}
          onChange={handleChange}
        >
          {fabricOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ProductAttributes;