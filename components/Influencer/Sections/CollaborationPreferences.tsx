'use client';

import { useState, forwardRef, useImperativeHandle } from 'react';

interface ComponentProps {
  onNext: () => void;
  isLastStep?: boolean;
}

// Options for the multi-select and single-select fields
const collabTypeOptions = ['Reels', 'Stories', 'Posts', 'UGC', 'Try-ons', 'Live Sessions', 'Product Shoots', 'Event Walks'];
const frequencyOptions = ['Weekly', 'Bi-Weekly', 'Monthly', 'Project-based'];

const CollaborationPreferences = forwardRef(({ onNext, isLastStep }: ComponentProps, ref) => {
  // State for all form fields
  const [preferredCollabs, setPreferredCollabs] = useState<string[]>([]);
  const [acceptsBarter, setAcceptsBarter] = useState<boolean | null>(null);
  const [collabFrequency, setCollabFrequency] = useState('');

  // Expose data to the parent component
  useImperativeHandle(ref, () => ({
    getData: () => ({
      preferred_collab_types: preferredCollabs,
      accepts_barter: acceptsBarter,
      collab_frequency: collabFrequency,
    }),
  }));

  // Validation logic for mandatory fields
  const handleNext = () => {
    if (preferredCollabs.length === 0 || acceptsBarter === null || !collabFrequency) {
      alert('Please fill out all mandatory fields marked with an asterisk (*).');
      return; // Stop if validation fails
    }
    onNext(); // Proceed if validation passes
  };
  
  // Handler for the multi-select collaboration types
  const handleCollabToggle = (option: string) => {
    setPreferredCollabs((prev) => 
      prev.includes(option) ? prev.filter(item => item !== option) : [...prev, option]
    );
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border animate-fade-in text-black">
      <h2 className="text-2xl font-semibold mb-2">Collaboration Preferences</h2>
      <p className="text-gray-500 mb-8">Let brands know what kind of collaborations you're interested in.</p>

      <div className="space-y-8">
        {/* Preferred Collaboration Types */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Collaboration Types <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap">
            {collabTypeOptions.map(option => (
              <button 
                key={option} 
                onClick={() => handleCollabToggle(option)}
                className={`m-1 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${preferredCollabs.includes(option) ? 'bg-black text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Open to Barter Collaborations */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Open to Barter Collaborations <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4">
            <button
              onClick={() => setAcceptsBarter(true)}
              className={`flex-1 p-3 border rounded-lg text-center transition-all duration-200 ${
                acceptsBarter === true ? 'border-black bg-gray-50 font-semibold' : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              Yes
            </button>
            <button
              onClick={() => setAcceptsBarter(false)}
              className={`flex-1 p-3 border rounded-lg text-center transition-all duration-200 ${
                acceptsBarter === false ? 'border-black bg-gray-50 font-semibold' : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              No
            </button>
          </div>
        </div>
        
        {/* Frequency Preferences */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Frequency Preferences <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {frequencyOptions.map((option) => (
              <button
                key={option}
                onClick={() => setCollabFrequency(option)}
                className={`p-3 border rounded-lg text-center transition-all duration-200 ${
                  collabFrequency === option ? 'border-black bg-gray-50 font-semibold' : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {option}
              </button>
            ))}
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

export default CollaborationPreferences;