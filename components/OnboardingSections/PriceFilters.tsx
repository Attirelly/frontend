'use client';
import React, { useState } from 'react';

const PRICE_TIERS = [
  { label: 'Affordable', range: 'Rs 2,000 – 25,000' },
  { label: 'Premium', range: 'Rs 25,000 – 75,000' },
  { label: 'Luxury', range: 'Rs 75,000 & above' },
];

const DesignerPriceRange = ({
  selectedRanges,
  setSelectedRanges,
  sectionIndex,
}: {
  selectedRanges: string[];
  setSelectedRanges: (index: number, values: string[]) => void;
  sectionIndex: number;
}) => {
  const toggleCheckbox = (label: string) => {
    const updated = selectedRanges.includes(label)
      ? selectedRanges.filter((item) => item !== label)
      : [...selectedRanges, label];

    setSelectedRanges(sectionIndex, updated);
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">Designer label</p>
      {PRICE_TIERS.map((tier) => (
        <label
          key={tier.label}
          className={`flex items-center gap-2 p-3 rounded-md border ${
            selectedRanges.includes(tier.label)
              ? 'bg-black text-white border-black'
              : 'bg-white text-gray-700 border-gray-300'
          } cursor-pointer`}
        >
          <input
            type="checkbox"
            checked={selectedRanges.includes(tier.label)}
            onChange={() => toggleCheckbox(tier.label)}
            className="hidden"
          />
          <span className="font-medium">{tier.label}:</span>
          <span>{tier.range}</span>
        </label>
      ))}
    </div>
  );
};

export default function PriceFiltersComponent() {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sections, setSections] = useState<string[][]>([['Luxury']]);

  const setSelectedRanges = (index: number, values: string[]) => {
    const updated = [...sections];
    updated[index] = values;
    setSections(updated);
  };

  return (
    <div className="border p-6 rounded-lg shadow-sm space-y-6 max-w-xl bg-white">
      <div>
        <h2 className="text-lg font-semibold">Price filters</h2>
        <p className="text-sm text-gray-500">
          Define product tiers in affordable, premium and luxury for easy filtering.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Average price for brand</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="2000"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
            <span className="self-center">-</span>
            <input
              type="text"
              placeholder="25000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {sections.map((selected, idx) => (
          <DesignerPriceRange
            key={idx}
            selectedRanges={selected}
            setSelectedRanges={setSelectedRanges}
            sectionIndex={idx}
          />
        ))}
      </div>
    </div>
  );
}
