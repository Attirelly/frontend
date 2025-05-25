'use client';

import { useEffect, useState } from 'react';
import { useFormActions, useFormData } from '@/store/product_upload_store';
import { api } from '@/lib/axios';

interface AttributeValue {
  id: string;
  value: string;
}

interface Attribute {
  name: string;
  values: AttributeValue[];
}

interface FormAttributes {
  [key: string]: {
    value: string;
    id: string;
  };
}

interface FormState {
  productName: string;
  productDescription: string;
  attributes: FormAttributes;
}

const ProductAttributes = () => {
  const { attributes: formAttributes } = useFormData();
  const { updateFormData } = useFormActions();

  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [formState, setFormState] = useState<FormState>({
    productName: formAttributes?.productName || '',
    productDescription: formAttributes?.productDescription || '',
    attributes: formAttributes?.attributes || {}
  });

  // Fetch attributes from API
  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const response = await api.get('attributes/attributes_category/90b9eef7-d5d4-429e-bb14-77f0f2c3c0c5');
        const data = await response.data;
        console.log("API Response:", data);
        
        setAttributes(data);
        
        // Initialize form state with both value and valueId
        const initialAttributes = data.reduce((acc: FormAttributes, attr: Attribute) => {
          acc[attr.name] = {
            value: formAttributes?.attributes?.[attr.name]?.value || '',
            id: formAttributes?.attributes?.[attr.name]?.id || ''
          };
          return acc;
        }, {});
        
        setFormState(prev => ({
          ...prev,
          attributes: initialAttributes
        }));
      } catch (error) {
        console.error('Error fetching attributes:', error);
      }
    };
    
    fetchAttributes();
  }, []);

  // Save to Zustand store when form changes
  useEffect(() => {
    updateFormData('attributes', formState);
  }, [formState, updateFormData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'productName' || name === 'productDescription') {
      setFormState(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      // For select elements, get the selected option's data-id
      const selectElement = e.target as HTMLSelectElement;
      const selectedOption = selectElement.selectedOptions[0];
      const id = selectedOption.getAttribute('data-id') || '';
      
      setFormState(prev => ({
        ...prev,
        attributes: {
          ...prev.attributes,
          [name]: {
            value,
            id
          }
        }
      }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-1">Attributes</h3>
        <p className="text-sm text-gray-500 mb-4">This is for internal data, your customers won't see this.</p>
        <p className="text-base text-gray-700 mb-2">Product Attributes</p>
        <div className="border-b border-gray-200 mb-4"></div>
      </div>
      
      {/* Dynamic Attribute Dropdowns */}
      {attributes.map((attribute) => (
        <div key={attribute.name} className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
            {attribute.name}
          </label>
          <select
            name={attribute.name}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={formState.attributes[attribute.name]?.value || ''}
            onChange={handleChange}
          >
            <option value="">Select {attribute.name}</option>
            {attribute.values.map((val) => (
              <option 
                key={val.id} 
                value={val.value}
                data-id={val.id}
              >
                {val.value}
              </option>
            ))}
          </select>
        </div>
      ))}
      
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
    </div>
  );
};

export default ProductAttributes;