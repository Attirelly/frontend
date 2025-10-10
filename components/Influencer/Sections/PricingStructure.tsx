'use client';

import { useState, forwardRef, useImperativeHandle } from 'react';

interface ComponentProps {
  onNext: () => void;
  isLastStep?: boolean;
}

// A reusable sub-component for price inputs to maintain consistent styling
const PriceInput = ({
  label,
  value,
  onChange,
  placeholder,
  isMandatory = true,
  subLabel,
}: {
  label: string;
  value: string;
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


const PricingStructure = forwardRef(({ onNext, isLastStep }: ComponentProps, ref) => {
  // State for all form fields
  const [reelPrice, setReelPrice] = useState('');
  const [storyPrice, setStoryPrice] = useState('');
  const [postPrice, setPostPrice] = useState('');
  const [campaignMin, setCampaignMin] = useState('');
  const [campaignMax, setCampaignMax] = useState('');
  const [barterValue, setBarterValue] = useState('');

  // Expose data to the parent component
  useImperativeHandle(ref, () => ({
    getData: () => ({
      price_per_reel: reelPrice,
      price_per_story: storyPrice,
      price_per_post: postPrice,
      campaign_price_min: campaignMin,
      campaign_price_max: campaignMax,
      barter_value: barterValue,
    }),
  }));

  // Validation logic for mandatory fields
  const handleNext = () => {
    if (!reelPrice || !storyPrice || !postPrice || !campaignMin || !campaignMax) {
      alert('Please fill out all mandatory fields marked with an asterisk (*).');
      return;
    }
    onNext();
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border animate-fade-in text-black">
      <h2 className="text-2xl font-semibold mb-2">Pricing Structure</h2>
      <p className="text-gray-500 mb-8">Define your charges for different types of content.</p>

      <div className="space-y-6">
        {/* Single Deliverable Prices */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PriceInput label="Single Reel Price" value={reelPrice} onChange={(e) => setReelPrice(e.target.value)} />
          <PriceInput label="Story Price" value={storyPrice} onChange={(e) => setStoryPrice(e.target.value)} />
          <PriceInput label="Post Price" value={postPrice} onChange={(e) => setPostPrice(e.target.value)} />
        </div>

        {/* Full Campaign Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full Campaign Price (3+ deliverables) <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <PriceInput label="" value={campaignMin} onChange={(e) => setCampaignMin(e.target.value)} placeholder="Min Price" isMandatory={false} />
            <span className="text-gray-500 font-bold text-center hidden md:block">-</span>
            <PriceInput label="" value={campaignMax} onChange={(e) => setCampaignMax(e.target.value)} placeholder="Max Price" isMandatory={false} />
          </div>
        </div>

        {/* Barter Collaboration Value */}
        <PriceInput 
            label="Barter Collaboration Value (Optional)" 
            value={barterValue} 
            onChange={(e) => setBarterValue(e.target.value)}
            isMandatory={false}
            subLabel="Minimum product value acceptable in exchange for barter — e.g., Rs 3,000+"
        />
      </div>

      {/* Navigation Button */}
      <div className="flex justify-end mt-12 pt-6 border-t">
        <button
          onClick={handleNext}
          className="px-8 py-3 bg-black text-white rounded-md font-semibold"
        >
          {isLastStep ? 'Submit' : 'Next →'}
        </button>
      </div>
    </div>
  );
});

export default PricingStructure;