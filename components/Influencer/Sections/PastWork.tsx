'use client';

import { useState, forwardRef, useImperativeHandle, KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface ComponentProps {
  onNext: () => void;
  isLastStep?: boolean;
}

// Predefined brand options for quick selection
const predefinedBrands = ['H&M', 'Zara', 'Myntra', 'Nykaa', 'Sephora', 'Mamaearth'];

// A reusable UI component for displaying tags
const Tag = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
  <span className="flex items-center bg-gray-200 text-gray-800 text-sm font-medium mr-2 mb-2 px-2.5 py-1 rounded-md">
    {label}
    <button onClick={onRemove} className="ml-1.5 text-gray-500 hover:text-gray-800">
      <X size={14} />
    </button>
  </span>
);

const PastWork = forwardRef(({ onNext, isLastStep }: ComponentProps, ref) => {
  // State for all form fields
  const [brands, setBrands] = useState<string[]>([]);
  const [currentBrand, setCurrentBrand] = useState('');
  const [link1, setLink1] = useState('');
  const [link2, setLink2] = useState('');
  const [achievements, setAchievements] = useState('');

  // Expose data to the parent component
  useImperativeHandle(ref, () => ({
    getData: () => ({
      brands_worked_with: brands,
      campaign_link_1: link1,
      campaign_link_2: link2,
      achievements: achievements,
    }),
  }));

  // Validation logic for the mandatory 'brands' field
  const handleNext = () => {
    if (brands.length === 0) {
      alert('Please add at least one brand you have worked with.');
      return;
    }
    onNext();
  };
  
  // --- Handlers for the tag input ---

  const handleBrandToggle = (brand: string) => {
    setBrands((prev) => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const handleCustomBrandKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentBrand.trim() !== '') {
      e.preventDefault();
      const newBrand = currentBrand.trim();
      if (!brands.includes(newBrand)) {
        setBrands([...brands, newBrand]);
      }
      setCurrentBrand('');
    }
  };

  const removeBrand = (brandToRemove: string) => {
    setBrands(brands.filter(brand => brand !== brandToRemove));
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border animate-fade-in text-black">
      <h2 className="text-2xl font-semibold mb-2">Past Work & Credibility</h2>
      <p className="text-gray-500 mb-8">Showcase your experience and achievements.</p>

      <div className="space-y-6">
        {/* Brands Worked With */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brands Worked With <span className="text-red-500">*</span>
          </label>
          {/* Predefined brand buttons */}
          <div className="flex flex-wrap mb-2">
            {predefinedBrands.map(brand => (
              <button 
                key={brand} 
                onClick={() => handleBrandToggle(brand)}
                className={`m-1 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${brands.includes(brand) ? 'bg-black text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              >
                {brand}
              </button>
            ))}
          </div>
          {/* Custom brand tag input */}
          <div className="w-full flex flex-wrap items-center p-2 border border-gray-300 rounded-md">
            {brands.map(brand => <Tag key={brand} label={brand} onRemove={() => removeBrand(brand)} />)}
            <input
              type="text"
              value={currentBrand}
              onChange={(e) => setCurrentBrand(e.target.value)}
              onKeyDown={handleCustomBrandKeyDown}
              className="flex-grow p-1 outline-none bg-transparent"
              placeholder="Add other brands and press Enter..."
            />
          </div>
        </div>

        {/* Campaign Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="link1" className="block text-sm font-medium text-gray-700">Best Campaign Link 1 (Optional)</label>
            <p className="text-xs text-gray-500 mb-1">Paste a reel/post link as proof of work</p>
            <input type="url" id="link1" value={link1} onChange={(e) => setLink1(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="https://instagram.com/p/..." />
          </div>
          <div>
            <label htmlFor="link2" className="block text-sm font-medium text-gray-700">Best Campaign Link 2 (Optional)</label>
            <p className="text-xs text-gray-500 mb-1">Paste another reel/post link</p>
            <input type="url" id="link2" value={link2} onChange={(e) => setLink2(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="https://youtube.com/watch?v=..." />
          </div>
        </div>

        {/* Achievements / Features */}
        <div>
          <label htmlFor="achievements" className="block text-sm font-medium text-gray-700">Achievements / Features (Optional)</label>
          <p className="text-xs text-gray-500 mb-1">e.g., Featured in Vogue, Walked LFW, awards, etc.</p>
          <textarea
            id="achievements"
            value={achievements}
            onChange={(e) => setAchievements(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            placeholder="List any notable achievements here..."
          />
        </div>
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

export default PastWork;