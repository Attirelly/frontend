// src/app/product-crm/components/ActionSection.tsx
"use client";
import React from 'react';

interface ActionSectionProps {
  selectedProductCount: number;
}

export const ActionSection: React.FC<ActionSectionProps> = ({ selectedProductCount }) => {
  const isDisabled = selectedProductCount === 0;

  return (
    <div className="pt-4 flex items-center gap-4">
      <button 
        className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed" 
        disabled={isDisabled}>
        Add to Label
      </button>
      <select 
        className="p-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isDisabled}>
        <option>Select Curation...</option>
      </select>
      <select 
        className="p-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isDisabled}>
        <option>Select Campaign...</option>
      </select>
    </div>
  );
};