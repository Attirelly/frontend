'use client';

import React from 'react';
import { useInfluencerStore } from '@/store/influencerStore'; // 👈 Correct path

interface ComponentProps {
  onNext: () => void;
  isLastStep?: boolean;
}

// Define types for clarity, matching your store's types
type TravelReadinessOption = "Local Only" | "State-wide" | "Pan-India";

const cityOptions = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Chandigarh', 'Lucknow', 'Indore'];
const travelOptions: TravelReadinessOption[] = ['Local Only', 'State-wide', 'Pan-India'];

const LocationAvailability: React.FC<ComponentProps> = ({ onNext, isLastStep }) => {
  // ✨ Get state and actions directly from the Zustand store
  const { locationAndAvailability, updateLocationAndAvailability } = useInfluencerStore();

  // ✨ Validation now checks the store's state
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    // Note: The store type for `attendEvents` is boolean, so it won't be null after initialization.
    // The validation ensures the required fields have non-empty values.
    if (!locationAndAvailability.city || !locationAndAvailability.travelReadiness) {
      alert('Please fill out all mandatory fields marked with an asterisk (*).');
      return;
    }
    onNext();
  };

  return (
    <form onSubmit={handleNext} className="bg-white p-8 rounded-lg shadow-sm border animate-fade-in text-black">
      <h2 className="text-2xl font-semibold mb-2">Location & Availability</h2>
      <p className="text-gray-500 mb-8">Let brands know where you are based and your availability.</p>

      <div className="space-y-6">
        {/* Location Fields */}
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City <span className="text-red-500">*</span></label>
          <input 
            list="city-options" 
            id="city" 
            name="city" 
            // ✨ Read value from the store
            value={locationAndAvailability.city}
            // ✨ On change, call the store's update action
            onChange={(e) => updateLocationAndAvailability({ city: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            placeholder="Type or select a city"
          />
          <datalist id="city-options">
            {cityOptions.map(option => <option key={option} value={option} />)}
          </datalist>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">Area (Optional)</label>
            <p className="text-xs text-gray-500 mb-1">For hyperlocal brand targeting</p>
            <input type="text" id="area" value={locationAndAvailability.area} onChange={(e) => updateLocationAndAvailability({ area: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">Pincode (Optional)</label>
            <p className="text-xs text-gray-500 mb-1">To map with nearby boutiques & designers</p>
            <input type="text" id="pincode" value={locationAndAvailability.pincode} onChange={(e) => updateLocationAndAvailability({ pincode: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>
        </div>
        
        {/* Travel Readiness */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Travel Readiness <span className="text-red-500">*</span></label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {travelOptions.map((option) => (
              <button
                type="button"
                key={option}
                onClick={() => updateLocationAndAvailability({ travelReadiness: option })}
                className={`p-3 border rounded-lg text-center transition-all duration-200 ${
                  locationAndAvailability.travelReadiness === option ? 'border-black bg-gray-50 font-semibold' : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Willingness to attend events / shoots */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Willingness to attend events / shoots <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => updateLocationAndAvailability({ attendEvents: true })}
              className={`flex-1 p-3 border rounded-lg text-center transition-all duration-200 ${
                locationAndAvailability.attendEvents === true ? 'border-black bg-gray-50 font-semibold' : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => updateLocationAndAvailability({ attendEvents: false })}
              className={`flex-1 p-3 border rounded-lg text-center transition-all duration-200 ${
                locationAndAvailability.attendEvents === false ? 'border-black bg-gray-50 font-semibold' : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              No
            </button>
          </div>
        </div>
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

export default LocationAvailability;