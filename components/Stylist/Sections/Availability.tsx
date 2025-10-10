'use client';

import { useState, forwardRef, useImperativeHandle } from 'react';
import type { LucideIcon } from 'lucide-react';
import { ShoppingBag, Smartphone, Store } from 'lucide-react';

// Define the props passed from the parent page
interface ComponentProps {
  onNext: () => void;
  isLastStep?: boolean;
}

// Define the type for our selling options for better type safety
type SellingOption = 'both' | 'online' | 'offline';

// An array of objects to hold the data for the selectable cards
const options: {
  id: SellingOption;
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    id: 'both',
    title: 'Both online and offline',
    description: 'You have an offline outlet and will also provide online consultation.',
    icon: ShoppingBag,
  },
  {
    id: 'online',
    title: 'Online only',
    description: "You will only provide online consultations",
    icon: Smartphone,
  },
  {
    id: 'offline',
    title: 'Offline only',
    description: "You have an offline outlet.",
    icon: Store,
  },
];

// export default function Availability({ onNext }: ComponentProps) {
  // State to track the selected selling option, initialized to 'null'
const Availability = forwardRef(({ onNext, isLastStep }: ComponentProps, ref) => {
  const [selectedOption, setSelectedOption] = useState<SellingOption | null>(null);

  useImperativeHandle(ref, () => ({
    getData: () => ({
      mode_of_service: selectedOption,
    }),
  }));

  const handleNext = () => {
    if (!selectedOption) {
      alert('Please select a mode of service to continue.');
      return;
    }
    onNext();
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border animate-fade-in text-black">
      <h2 className="text-2xl font-semibold mb-8">
        Select your mode of service <span className="text-red-500">*</span>
      </h2>

      <div className="space-y-4">
        {options.map((option) => {
          const isSelected = selectedOption === option.id;
          const Icon = option.icon;

          return (
            <button
              key={option.id}
              onClick={() => setSelectedOption(option.id)}
              className={`flex w-full items-center p-6 border-2 rounded-lg text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black
                ${isSelected ? 'border-black bg-gray-50' : 'border-gray-200 bg-white hover:border-gray-400'}`}
            >
              {/* Custom Radio Button */}
              <div className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 ${isSelected ? 'border-black' : 'border-gray-400'}`}>
                {isSelected && <div className="h-3 w-3 rounded-full bg-black" />}
              </div>

              {/* Text Content */}
              <div className="ml-5 flex-grow">
                <h3 className="font-semibold text-gray-900">{option.title}</h3>
                <p className="text-gray-600 text-sm">{option.description}</p>
              </div>

              {/* Icon on the right */}
              <div className="ml-5 flex-shrink-0">
                <Icon className="h-8 w-8 text-pink-500" />
              </div>
            </button>
          );
        })}
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
});

export default Availability;