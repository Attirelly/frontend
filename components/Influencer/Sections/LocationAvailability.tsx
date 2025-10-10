'use client';

import { useState, forwardRef, useImperativeHandle } from 'react';

interface ComponentProps {
  onNext: () => void;
  isLastStep?: boolean;
}

// Options for the fields
const cityOptions = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Chandigarh', 'Lucknow', 'Indore'];
const travelOptions = ['Local Only', 'State-wide', 'Pan-India'];

const LocationAvailability = forwardRef(({ onNext, isLastStep }: ComponentProps, ref) => {
  // State for all form fields
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [pincode, setPincode] = useState('');
  const [travelReadiness, setTravelReadiness] = useState('');
  const [attendsEvents, setAttendsEvents] = useState<boolean | null>(null);

  // Expose data to the parent component
  useImperativeHandle(ref, () => ({
    getData: () => ({
      city: city,
      area: area,
      pincode: pincode,
      travel_readiness: travelReadiness,
      attends_events: attendsEvents,
    }),
  }));

  // Validation logic for mandatory fields
  const handleNext = () => {
    if (!city || !travelReadiness || attendsEvents === null) {
      alert('Please fill out all mandatory fields.');
      return;
    }
    onNext();
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border animate-fade-in text-black">
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
            value={city}
            onChange={(e) => setCity(e.target.value)}
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
            <input type="text" id="area" value={area} onChange={(e) => setArea(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">Pincode (Optional)</label>
            <p className="text-xs text-gray-500 mb-1">To map with nearby boutiques & designers</p>
            <input type="text" id="pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>
        </div>
        
        {/* Travel Readiness */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Travel Readiness <span className="text-red-500">*</span></label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {travelOptions.map((option) => (
              <button
                key={option}
                onClick={() => setTravelReadiness(option)}
                className={`p-3 border rounded-lg text-center transition-all duration-200 ${
                  travelReadiness === option ? 'border-black bg-gray-50 font-semibold' : 'border-gray-200 bg-white hover:border-gray-300'
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
              onClick={() => setAttendsEvents(true)}
              className={`flex-1 p-3 border rounded-lg text-center transition-all duration-200 ${
                attendsEvents === true ? 'border-black bg-gray-50 font-semibold' : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              Yes
            </button>
            <button
              onClick={() => setAttendsEvents(false)}
              className={`flex-1 p-3 border rounded-lg text-center transition-all duration-200 ${
                attendsEvents === false ? 'border-black bg-gray-50 font-semibold' : 'border-gray-200 bg-white hover:border-gray-300'
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
          onClick={handleNext}
          className="px-8 py-3 bg-black text-white rounded-md font-semibold"
        >
          {isLastStep ? 'Submit' : 'Next →'}
        </button>
      </div>
    </div>
  );
});

export default LocationAvailability;