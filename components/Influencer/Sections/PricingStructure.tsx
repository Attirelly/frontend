
'use client';

import React from 'react';
import { useInfluencerStore } from '@/store/influencerStore'; // 👈 Correct path

interface ComponentProps {
  onNext: () => void;
  isLastStep?: boolean;
}

// Reusable sub-component remains the same
const PriceInput = ({
  label,
  value,
  onChange,
  placeholder,
  isMandatory = true,
  subLabel,
}: {
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  isMandatory?: boolean;
  subLabel?: string;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">
      {label} {isMandatory && <span className="text-red-500">*</span>}
    </label>
    {subLabel && <p className="text-xs text-gray-500 mb-1">{subLabel}</p>}
    <div className="relative mt-1">
      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
        Rs
      </span>
      <input
        type="number"
        value={value}
        onChange={onChange}
        className="w-full rounded-md border-gray-300 py-2 pl-9 pr-3 shadow-sm focus:border-black focus:ring-black sm:text-sm"
        placeholder={placeholder}
      />
    </div>
  </div>
);

const PricingStructure: React.FC<ComponentProps> = ({ onNext, isLastStep }) => {
  // ✨ Get state and actions from the Zustand store
  const { pricingStructure, updatePricingStructure } = useInfluencerStore();

  // ✨ A helper to handle input changes for both nested and top-level properties
  const handlePriceChange = (
    field: keyof typeof pricingStructure.pricing | 'barterValueMin',
    value: string
  ) => {
    const numericValue = value === '' ? null : Number(value);

    if (field === 'barterValueMin') {
      updatePricingStructure({ barterValueMin: numericValue });
    } else {
      updatePricingStructure({
        pricing: {
          ...pricingStructure.pricing,
          [field]: numericValue,
        },
      });
    }
  };
  
  // ✨ Validation now checks the store's state
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    const { reel, story, post, campaign_min, campaign_max } = pricingStructure.pricing;
    if (reel === null || story === null || post === null || campaign_min === null || campaign_max === null) {
      alert('Please fill out all mandatory pricing fields marked with an asterisk (*).');
      return;
    }
    onNext();
  };

  return (
    <form onSubmit={handleNext} className="bg-white p-8 rounded-lg shadow-sm border animate-fade-in text-black">
      <h2 className="text-2xl font-semibold mb-2">Pricing Structure</h2>
      <p className="text-gray-500 mb-8">Define your charges for different types of content.</p>

      <div className="space-y-6">
        {/* Single Deliverable Prices */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PriceInput label="Single Reel Price" value={pricingStructure.pricing.reel ?? ''} onChange={(e) => handlePriceChange('reel', e.target.value)} />
          <PriceInput label="Story Price" value={pricingStructure.pricing.story ?? ''} onChange={(e) => handlePriceChange('story', e.target.value)} />
          <PriceInput label="Post Price" value={pricingStructure.pricing.post ?? ''} onChange={(e) => handlePriceChange('post', e.target.value)} />
        </div>

        {/* Full Campaign Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full Campaign Price (3+ deliverables) <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <PriceInput label="" value={pricingStructure.pricing.campaign_min ?? ''} onChange={(e) => handlePriceChange('campaign_min', e.target.value)} placeholder="Min Price" isMandatory={false} />
            <span className="text-gray-500 font-bold text-center hidden md:block">-</span>
            <PriceInput label="" value={pricingStructure.pricing.campaign_max ?? ''} onChange={(e) => handlePriceChange('campaign_max', e.target.value)} placeholder="Max Price" isMandatory={false} />
          </div>
        </div>

        {/* Barter Collaboration Value */}
        <PriceInput 
            label="Barter Collaboration Value (Optional)" 
            value={pricingStructure.barterValueMin ?? ''} 
            onChange={(e) => handlePriceChange('barterValueMin', e.target.value)}
            isMandatory={false}
            subLabel="Minimum product value acceptable in exchange for barter — e.g., Rs 3,000+"
        />
      </div>

      {/* Navigation Button */}
      <div className="flex justify-end mt-12 pt-6 border-t">
        <button
          type="submit"
          className="px-8 py-3 bg-black text-white rounded-md font-semibold"
        >
          {isLastStep ? 'Submit' : 'Next →'}
        </button>
      </div>
    </form>
  );
};

export default PricingStructure;