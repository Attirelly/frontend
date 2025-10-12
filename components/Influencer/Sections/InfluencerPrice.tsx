
'use client';
import React from 'react';
import { useInfluencerStore } from '@/store/influencerStore'; // 👈 Correct path

interface ComponentProps {
  onNext: () => void;
  isLastStep?: boolean;
}

// This reusable component remains the same. It's a great pattern!
const PriceInput = ({
  value,
  onChange,
  label,
  placeholder,
}: {
  value: string | number; // Can accept number directly from store
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  placeholder?: string;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label} <span className="text-red-500">*</span></label>
    <div className="relative">
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

// ✨ Component is now a standard functional component
export default function InfluencerPrice({ onNext, isLastStep }: ComponentProps) {
  // ✨ Get state and actions directly from the Zustand store
  const { pricingStructure, updatePricingStructure } = useInfluencerStore();

  // ✨ A helper to handle input changes and update the nested state
  const handlePriceChange = (field: 'reel' | 'campaign_min' | 'campaign_max', value: string) => {
    // Convert empty string to null, otherwise convert to number
    const numericValue = value === '' ? null : Number(value);
    
    updatePricingStructure({
      // Keep other properties in pricingStructure intact
      ...pricingStructure,
      pricing: {
        // Keep other prices intact
        ...pricingStructure.pricing,
        [field]: numericValue,
      },
    });
  };
  
  // ✨ Validation now checks the store's state
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    const { reel, campaign_min, campaign_max } = pricingStructure.pricing;
    if (reel === null || campaign_min === null || campaign_max === null) {
      alert('All pricing fields are mandatory. Please fill them out to continue.');
      return;
    }
    onNext();
  };

  return (
    <form onSubmit={handleNext} className="bg-white p-8 rounded-lg shadow-sm border animate-fade-in text-black">
      <h2 className="text-2xl font-semibold mb-2">Pricing</h2>
      <p className="text-gray-500 mb-8">
        Provide details about your service charges.
      </p>

      <div className="space-y-6">
        <PriceInput
          label="Expected price for a single reel"
          // ✨ Read value from store, fallback to empty string if null
          value={pricingStructure.pricing.reel ?? ''}
          onChange={(e) => handlePriceChange('reel', e.target.value)}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expected price for a campaign <span className="text-red-500">*</span>
            <p className="text-gray-500 text-xs mt-1">(More than 3 reels + collaborations)</p>
          </label>
          <div className="flex items-center space-x-4 mt-2">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                Rs
              </span>
              <input
                type="number"
                value={pricingStructure.pricing.campaign_min ?? ''}
                onChange={(e) => handlePriceChange('campaign_min', e.target.value)}
                className="w-full rounded-md border-gray-300 py-2 pl-9 pr-3 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                placeholder="Min Price"
              />
            </div>
            <span className="text-gray-500">-</span>
            <div className="relative flex-1">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                Rs
              </span>
              <input
                type="number"
                value={pricingStructure.pricing.campaign_max ?? ''}
                onChange={(e) => handlePriceChange('campaign_max', e.target.value)}
                className="w-full rounded-md border-gray-300 py-2 pl-9 pr-3 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                placeholder="Max Price"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-12 pt-6 border-t">
        <button
          type="submit"
          className="px-8 py-3 bg-black text-white rounded-md font-semibold hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
        >
          {isLastStep ? 'Submit' : 'Next →'}
        </button>
      </div>
    </form>
  );
}