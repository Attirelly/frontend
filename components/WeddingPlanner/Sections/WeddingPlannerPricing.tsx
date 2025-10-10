'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';

// Define the props passed from the parent page
interface ComponentProps {
  onNext: () => void;
}

// Define the segment options
const segments = [
  { id: 'affordable', label: 'Affordable', range: 'Below ₹1 Lakh' },
  { id: 'premium', label: 'Premium', range: '₹1 Lakh - ₹5 Lakh' },
  { id: 'luxury', label: 'Luxury', range: 'Greater than ₹5 Lakh' },
];

export default function WeddingPlannerPricing({ onNext }: ComponentProps) {
  // State for the two required fields
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);

  // Validation function
  const handleNext = () => {
    if (!minPrice || !maxPrice || !selectedSegment) {
      alert('Both the average price range and segment selection are mandatory. Please fill them out to continue.');
      return;
    }
    
    // Optional: Add logic to ensure minPrice < maxPrice

    onNext();
  };

  // A reusable component for an input field with the "Rs" prefix
  const PriceInput = ({
    value,
    onChange,
    placeholder,
    label,
  }: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    label?: string;
  }) => (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
          ₹
        </span>
        <input
          type="number"
          value={value}
          onChange={onChange}
          className="w-full rounded-md border-gray-300 py-2 pl-7 pr-3 shadow-sm focus:border-black focus:ring-black sm:text-sm"
          placeholder={placeholder}
        />
      </div>
    </div>
  );

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border animate-fade-in text-black">
      <h2 className="text-2xl font-semibold mb-2">Pricing</h2>
      <p className="text-gray-500 mb-8">
        Set your general price range and target segment.
      </p>

      {/* Average Prices Charged (Range) */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Average prices charged <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center space-x-4">
            <PriceInput
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Min Price"
            />
            <span className="text-gray-500">-</span>
            <PriceInput
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max Price"
            />
          </div>
        </div>

        {/* Segment Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Segment <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {segments.map((segment) => {
              const isSelected = selectedSegment === segment.id;
              return (
                <button
                  key={segment.id}
                  onClick={() => setSelectedSegment(segment.id)}
                  className={`p-4 border rounded-lg text-left transition-all duration-200 shadow-sm
                    ${isSelected ? 'border-black bg-gray-50 ring-2 ring-black' : 'border-gray-200 bg-white hover:border-gray-400'}`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">{segment.label}</h3>
                    {isSelected && <Check className="h-4 w-4 text-black" />}
                  </div>
                  <p className="text-black-500 text-sm mt-1">{segment.range}</p>
                </button>
              );
            })}
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