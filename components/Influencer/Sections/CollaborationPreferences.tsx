'use client';

import React from 'react';
import { useInfluencerStore } from '@/store/influencerStore'; // 👈 Correct path as provided

// Define types for clarity, matching your store's types where possible
type CollabType = 'Reels' | 'Stories' | 'Posts' | 'UGC' | 'Try-ons' | 'Live Sessions' | 'Product Shoots' | 'Event Walks';
const collabTypeOptions: CollabType[] = ['Reels', 'Stories', 'Posts', 'UGC', 'Try-ons', 'Live Sessions', 'Product Shoots', 'Event Walks'];
const frequencyOptions = ['Weekly', 'Bi-Weekly', 'Monthly', 'Project-based'];

interface ComponentProps {
  onNext: () => void;
  isLastStep?: boolean;
}

// ✨ Component is now a standard React functional component
const CollaborationPreferences: React.FC<ComponentProps> = ({ onNext, isLastStep }) => {
  // ✨ Get state and actions directly from the Zustand store
  const { collaborationPreferences, updateCollaborationPreferences } = useInfluencerStore();

  // ✨ Handler now updates the store
  const handleCollabToggle = (option: CollabType) => {
    const currentTypes = collaborationPreferences.preferredCollabTypes;
    const newTypes = currentTypes.includes(option)
      ? currentTypes.filter(item => item !== option)
      : [...currentTypes, option];
    updateCollaborationPreferences({ preferredCollabTypes: newTypes });
  };

  // ✨ Validation now uses data from the store
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      collaborationPreferences.preferredCollabTypes.length === 0 ||
      !collaborationPreferences.openToBarter
      // || !collaborationPreferences.collabFrequency // ⚠️ Uncomment after adding `collabFrequency` to store
    ) {
      alert('Please fill out all mandatory fields marked with an asterisk (*).');
      return;
    }
    onNext();
  };

  return (
    <form onSubmit={handleNext} className="bg-white p-8 rounded-lg shadow-sm border animate-fade-in text-black">
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
                type="button"
                key={option}
                onClick={() => handleCollabToggle(option)}
                className={`m-1 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  // ✨ Check active state against the store
                  collaborationPreferences.preferredCollabTypes.includes(option) ? 'bg-black text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
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
              type="button"
              // ✨ Update store with the correct string value
              onClick={() => updateCollaborationPreferences({ openToBarter: 'Yes' })}
              className={`flex-1 p-3 border rounded-lg text-center transition-all duration-200 ${
                // ✨ Check active state against the store's string value
                collaborationPreferences.openToBarter === 'Yes' ? 'border-black bg-gray-50 font-semibold' : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              // ✨ Update store with the correct string value
              onClick={() => updateCollaborationPreferences({ openToBarter: 'No' })}
              className={`flex-1 p-3 border rounded-lg text-center transition-all duration-200 ${
                // ✨ Check active state against the store's string value
                collaborationPreferences.openToBarter === 'No' ? 'border-black bg-gray-50 font-semibold' : 'border-gray-200 bg-white hover:border-gray-300'
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
            {/* ⚠️ NOTE: This requires adding `collabFrequency: string` to your store's `CollaborationPreferences` type. */}
            {/*
            {frequencyOptions.map((option) => (
              <button
                type="button"
                key={option}
                onClick={() => updateCollaborationPreferences({ collabFrequency: option })}
                className={`p-3 border rounded-lg text-center transition-all duration-200 ${
                  collaborationPreferences.collabFrequency === option ? 'border-black bg-gray-50 font-semibold' : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {option}
              </button>
            ))}
            */}
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

export default CollaborationPreferences;