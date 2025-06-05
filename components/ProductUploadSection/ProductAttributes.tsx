'use client';

import { useEffect, useState } from 'react';
import { useCurrentStep, useFormActions, useFormData } from '@/store/product_upload_store';
import { api } from '@/lib/axios';

interface AttributeIDValue {
  attribute_id: string;
  value: string;
}

interface AttributeResponse {
  name: string;
  values: AttributeIDValue[];
}

export interface AttributeValue {
  attribute_id?: string;
  name?: string;
  value?: string;
}

export interface FormState {
  attributes?: AttributeValue[];
}

const ProductAttributes = () => {
  const { attributes: globalAttributes , category} = useFormData();
  const { updateFormData, setStepValidation } = useFormActions();
  const currentStep = useCurrentStep();

  const [attributes, setAttributes] = useState<AttributeResponse[]>([]);
  const [filteredAttributes, setFilteredAttributes] = useState<AttributeResponse[]>([]);
  const [formState, setFormState] = useState<FormState>({
    attributes: globalAttributes?.attributes || []
  });

  // Dropdown visibility state
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

   useEffect(() => {
    const isValid =
      !!globalAttributes?.attributes

    setStepValidation(currentStep, isValid);
  }, [globalAttributes, currentStep]);

  // Fetch attributes from API
  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const response = await api.get(`attributes/attributes_category/${category?.level4?.category_id}`);
        setAttributes(response.data);
        setFilteredAttributes(response.data);
      } catch (error) {
        console.error('Error fetching attributes:', error);
      }
    };
    fetchAttributes();
  }, []);

  // Filter attributes based on search term
  useEffect(() => {
    if (searchTerm && activeDropdown) {
      const filtered = attributes.map(attr => {
        if (attr.name === activeDropdown) {
          return {
            ...attr,
            values: attr.values.filter(val => 
              val.value.toLowerCase().includes(searchTerm.toLowerCase())
            )
          };
        }
        return attr;
      });
      setFilteredAttributes(filtered);
    } else {
      setFilteredAttributes(attributes);
    }
  }, [searchTerm, activeDropdown, attributes]);

  // Save to Zustand store when form changes
  useEffect(() => {
    updateFormData('attributes', formState);
  }, [formState, updateFormData]);

  const toggleDropdown = (attributeName: string) => {
    setActiveDropdown(activeDropdown === attributeName ? null : attributeName);
    setSearchTerm('');
  };

  const handleAttributeSelect = (attributeName: string, value: string, attribute_id: string) => {
    setFormState(prev => {
      // Check if attribute already exists
      const existingIndex = prev.attributes?.findIndex(attr => attr.name === attributeName) ?? -1;
      
      let newAttributes = [...(prev.attributes || [])];
      
      if (existingIndex >= 0) {
        // Update existing attribute
        newAttributes[existingIndex] = { 
          ...newAttributes[existingIndex],
          attribute_id,
          value,
          name: attributeName
        };
      } else {
        // Add new attribute
        newAttributes.push({
          attribute_id,
          value,
          name: attributeName
        });
      }
      
      return {
        ...prev,
        attributes: newAttributes
      };
    });
    setActiveDropdown(null);
  };

  const getCurrentValue = (attributeName: string) => {
    const attribute = formState.attributes?.find(attr => attr.name === attributeName);
    return attribute?.value || '';
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (!(e.target as HTMLElement).closest('.attribute-dropdown-container')) {
      setActiveDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg self-start">
      <h1 className="text-lg font-bold text-gray-900 mb-2">Attributes</h1>
      <p className="text-sm text-gray-500 mb-4 border-b border-gray-200">
        This is for internal data, your customers won't see this.
      </p>
      <p className="text-base text-gray-600 mb-4">Product Attributes</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAttributes.map((attribute) => (
          <div key={attribute.name} className="attribute-dropdown-container">
            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
              {attribute.name}
            </label>
            <div className="relative">
              <input
                type="text"
                value={
                  activeDropdown === attribute.name
                    ? searchTerm
                    : getCurrentValue(attribute.name)
                }
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (activeDropdown !== attribute.name) {
                    setActiveDropdown(attribute.name);
                  }
                }}
                onFocus={() => {
                  setSearchTerm(getCurrentValue(attribute.name));
                  setActiveDropdown(attribute.name);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={`Search ${attribute.name}`}
              />
              {activeDropdown === attribute.name && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {attribute.values.length > 0 ? (
                    attribute.values.map((val) => (
                      <div
                        key={val.attribute_id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleAttributeSelect(attribute.name, val.value, val.attribute_id)}
                      >
                        <div className="font-medium">{val.value}</div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-500">No options found</div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductAttributes;