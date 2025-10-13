"use client";

import React from "react";
import { useMakeupArtistStore } from "@/store/makeUpArtistStore";

// Helper component for a styled number input with a currency prefix
interface PriceInputProps {
  id: string;
  label: string;
  description: string;
  value: number | null;
  onChange: (value: number | null) => void;
  placeholder: string;
}

const PriceInput: React.FC<PriceInputProps> = ({ id, label, description, value, onChange, placeholder }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val === '' ? null : Number(val));
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label} <span className="text-red-500">*</span>
      </label>
      <p className="text-xs text-gray-500 mb-1">{description}</p>
      <div className="relative mt-1 rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <span className="text-gray-500 sm:text-sm">₹</span>
        </div>
        <input
          type="number"
          id={id}
          value={value ?? ''}
          onChange={handleChange}
          className="block w-full rounded-md border-gray-300 pl-7 pr-4 py-2 focus:border-black focus:ring-black sm:text-sm"
          placeholder={placeholder}
          min="0"
        />
      </div>
    </div>
  );
};

// Main Component
interface ComponentProps {
  onNext: () => void;
  isLastStep?: boolean;
}

const PricingPackages: React.FC<ComponentProps> = ({ onNext, isLastStep }) => {
  const { pricingPackages, updatePricingPackages } = useMakeupArtistStore();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (pricingPackages.basePrice === null || pricingPackages.basePrice <= 0) {
      alert("Please enter a valid Base Price to continue.");
      return;
    }
    onNext();
  };

  return (
    <form
      onSubmit={handleNext}
      className="bg-white p-8 rounded-lg shadow-sm border animate-fade-in text-black"
    >
      <h2 className="text-2xl font-semibold mb-2">Pricing & Packages</h2>
      <p className="text-gray-500 mb-8">
        Define your rates. A clear pricing structure helps clients make faster decisions.
      </p>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Base Price */}
          <PriceInput
            id="base-price"
            label="Base Price"
            description="Your starting price for a single person's party makeup."
            placeholder="e.g., 3000"
            value={pricingPackages.basePrice}
            onChange={(value) => updatePricingPackages({ basePrice: value })}
          />

          {/* Travel Charges */}
           <div>
              <label htmlFor="travel-charges" className="block text-sm font-medium text-gray-700">
                Travel Charges
              </label>
              <p className="text-xs text-gray-500 mb-1">Price for travelling to the venue, if applicable.</p>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">₹</span>
                </div>
                <input
                  type="number"
                  id="travel-charges"
                  value={pricingPackages.travelCharges ?? ''}
                  onChange={(e) => updatePricingPackages({ travelCharges: e.target.value === '' ? null : Number(e.target.value) })}
                  className="block w-full rounded-md border-gray-300 pl-7 pr-4 py-2 focus:border-black focus:ring-black sm:text-sm"
                  placeholder="e.g., 500 or 0 for free"
                  min="0"
                />
              </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bridal Package Price */}
          <div>
            <label htmlFor="bridal-package" className="block text-sm font-medium text-gray-700">
              Bridal Package Price (Optional)
            </label>
            <p className="text-xs text-gray-500 mb-1">Your all-inclusive price for a full bridal look.</p>
            <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">₹</span>
                </div>
                <input
                  type="number"
                  id="bridal-package"
                  value={pricingPackages.bridalPackage ?? ''}
                  onChange={(e) => updatePricingPackages({ bridalPackage: e.target.value === '' ? null : Number(e.target.value) })}
                  className="block w-full rounded-md border-gray-300 pl-7 pr-4 py-2 focus:border-black focus:ring-black sm:text-sm"
                  placeholder="e.g., 15000"
                  min="0"
                />
              </div>
          </div>

          {/* Party Package Price */}
          <div>
            <label htmlFor="party-package" className="block text-sm font-medium text-gray-700">
              Party Package Price (Optional)
            </label>
            <p className="text-xs text-gray-500 mb-1">Price for groups or multiple people (e.g., 3 people).</p>
            <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">₹</span>
                </div>
                <input
                  type="number"
                  id="party-package"
                  value={pricingPackages.partyPackage ?? ''}
                  onChange={(e) => updatePricingPackages({ partyPackage: e.target.value === '' ? null : Number(e.target.value) })}
                  className="block w-full rounded-md border-gray-300 pl-7 pr-4 py-2 focus:border-black focus:ring-black sm:text-sm"
                  placeholder="e.g., 8000"
                  min="0"
                />
              </div>
          </div>
        </div>

        {/* Pricing Notes */}
        <div>
          <label htmlFor="pricing-notes" className="block text-sm font-medium text-gray-700">
            Pricing Notes (Optional)
          </label>
          <p className="text-xs text-gray-500 mb-1">
            Add any extra details about your pricing, like what's included in packages, trial costs, etc.
          </p>
          <textarea
            id="pricing-notes"
            rows={4}
            value={pricingPackages.pricingNotes}
            onChange={(e) => updatePricingPackages({ pricingNotes: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            placeholder="e.g., Bridal package includes HD makeup, hairstyling, and draping. Trial sessions are available for an additional cost."
          />
        </div>
      </div>

      {/* Navigation Button */}
      <div className="flex justify-between items-center mt-12 pt-6 border-t">
        <div></div> {/* Placeholder for a 'Back' button */}
        <button
          type="submit"
          className="px-8 py-3 bg-black text-white rounded-md font-semibold"
        >
          {isLastStep ? "Submit" : "Next →"}
        </button>
      </div>
    </form>
  );
};

export default PricingPackages;