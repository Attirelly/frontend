'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';

// Define the props passed from the parent page
interface ComponentProps {
  onNext: () => void;
}

// Define the possible label options for type safety
type LabelOption = 'Affordable' | 'Premium' | 'Luxury';

// Data for our selectable cards, now including price ranges
const labelOptions: { name: LabelOption; range: string }[] = [
  { name: 'Affordable', range: 'Rs 2,000 - 25,000' },
  { name: 'Premium', range: 'Rs 20,000 - 50,000' },
  { name: 'Luxury', range: 'Rs 50,000 - 2,00,000' },
];

// A reusable component for an input field with the "Rs" prefix
const PriceInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="relative">
    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
      Rs
    </span>
    <input
      type="number"
      value={value}
      onChange={onChange}
      className="w-full rounded-md border-gray-300 py-2 pl-9 pr-3 shadow-sm focus:border-black focus:ring-black sm:text-sm"
    />
  </div>
);

export default function Price({ onNext }: ComponentProps) {
  // State for the form fields
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedLabel, setSelectedLabel] = useState<LabelOption | null>(null);

  // Validation function to be called on button click
  const handleNext = () => {
    if (!minPrice || !maxPrice || !selectedLabel) {
      alert('All fields are mandatory. Please fill them out to continue.');
      return;
    }
    onNext();
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border animate-fade-in">
      <h2 className="text-2xl font-semibold mb-2">Price filters</h2>
      <p className="text-gray-500 mb-8">
        Provide details about charges per service
      </p>

      {/* Section 1: Price Range */}
      <div className="mb-10">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Average Price charged <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <PriceInput value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
          </div>
          <span className="text-gray-500 font-bold">-</span>
          <div className="flex-1">
            <PriceInput value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Section 2: Designer Label */}
      <div>
        <label className="block text-base font-semibold text-gray-800 mb-4">
          Designer Label <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {labelOptions.map((option) => {
            const isSelected = selectedLabel === option.name;
            return (
              <button
                key={option.name}
                onClick={() => setSelectedLabel(option.name)}
                className={`flex items-start text-left p-4 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black
                  ${isSelected ? 'border-black bg-gray-50' : 'border-gray-200 bg-white hover:border-gray-400'}`}
              >
                {/* Custom Checkbox */}
                <div className={`mt-1 flex-shrink-0 h-5 w-5 border-2 flex items-center justify-center rounded-sm ${isSelected ? 'bg-black border-black' : 'border-gray-400'}`}>
                  {isSelected && <Check className="h-4 w-4 text-white" />}
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-900">{option.name}</h3>
                  <p className="text-gray-600 text-sm">{option.range}</p>
                </div>
              </button>
            );
          })}
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