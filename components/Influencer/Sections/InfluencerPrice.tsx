'use client';

import { useState } from 'react';

// Define the props passed from the parent page
interface ComponentProps {
  onNext: () => void;
}

// A reusable component for an input field with the "Rs" prefix
const PriceInput = ({
  value,
  onChange,
  label,
  placeholder,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  placeholder?: string;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label} <span className="text-red-500">*</span></label>
    <div className="relative">
      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-black-500">
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

export default function InfluencerPrice({ onNext }: ComponentProps) {
  // State for the new form fields
  const [singleReelPrice, setSingleReelPrice] = useState('');
  const [campaignMinPrice, setCampaignMinPrice] = useState('');
  const [campaignMaxPrice, setCampaignMaxPrice] = useState('');

  // Validation function to be called on button click
  const handleNext = () => {
    if (!singleReelPrice || !campaignMinPrice || !campaignMaxPrice) {
      alert('All pricing fields are mandatory. Please fill them out to continue.');
      return;
    }
    onNext();
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border animate-fade-in text-black">
      <h2 className="text-2xl font-semibold mb-2">Pricing</h2>
      <p className="text-black-500 mb-8">
        Provide details about your service charges.
      </p>

      {/* Pricing Fields */}
      <div className="space-y-6">
        <PriceInput
          label="Expected price for a single reel"
          value={singleReelPrice}
          onChange={(e) => setSingleReelPrice(e.target.value)}
        />
        <div>
          <label className="block text-sm font-medium text-black-700 mb-1">
            Expected price for a campaign <span className="text-red-500">*</span>
            <p className="text-gray-500 text-xs mt-1">(More than 3 reels + collaborations)</p>
          </label>
          <div className="flex items-center space-x-4 mt-2">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-black-500">
                Rs
              </span>
              <input
                type="number"
                value={campaignMinPrice}
                onChange={(e) => setCampaignMinPrice(e.target.value)}
                className="w-full rounded-md border-gray-300 py-2 pl-9 pr-3 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                placeholder="Min Price"
              />
            </div>
            <span className="text-black-500">-</span>
            <div className="relative flex-1">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-black-500">
                Rs
              </span>
              <input
                type="number"
                value={campaignMaxPrice}
                onChange={(e) => setCampaignMaxPrice(e.target.value)}
                className="w-full rounded-md border-gray-300 py-2 pl-9 pr-3 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                placeholder="Max Price"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Button */}
      <div className="flex justify-end mt-12 pt-6 border-t">
        <button
          onClick={handleNext}
          className="px-8 py-3 bg-black text-white rounded-md font-semibold hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
        >
          Next →
        </button>
      </div>
    </div>
  );
}