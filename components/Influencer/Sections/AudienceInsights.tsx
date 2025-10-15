'use client';

import React, { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { useInfluencerStore } from '@/store/influencerStore' ; // 👈 Adjust this import path

// These can be defined outside the component
const ageGroupOptions = ['13-17', '18-24', '25-34', '35-44', '45-54', '55-64', '65+'];
// ⚠️ NOTE: This data doesn't map to your store's `audienceType`. I am assuming a new store property `audienceInterests: string[]`.
const audienceInterestOptions = ['Students', 'Working Professionals', 'Parents', 'Fashion Enthusiasts', 'Gamers', 'Techies', 'Entrepreneurs'];

interface ComponentProps {
  onNext: () => void;
  isLastStep?: boolean;
}

const Tag = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
  <span className="flex items-center bg-gray-200 text-gray-800 text-sm font-medium mr-2 mb-2 px-2.5 py-1 rounded-md">
    {label}
    <button onClick={onRemove} className="ml-1.5 text-gray-500 hover:text-gray-800">
      <X size={14} />
    </button>
  </span>
);

const AudienceInsights: React.FC<ComponentProps> = ({ onNext, isLastStep }) => {
  // ✨ Get state and actions from the Zustand store
  const { audienceInsights, updateAudienceInsights } = useInfluencerStore();

  // ✨ Keep UI-specific state local. This doesn't need to be in the global store.
  const [currentLocation, setCurrentLocation] = useState('');

  // --- Handlers that update the store ---

  const handleToggle = (option: string, key: 'topAgeGroups' | 'audienceInterests') => {
    const currentValues = audienceInsights[key] || [];
    const newValues = currentValues.includes(option)
      ? currentValues.filter((item: string) => item !== option)
      : [...currentValues, option];
    updateAudienceInsights({ [key]: newValues });
  };
  
  const handleLocationKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentLocation.trim() !== '') {
      e.preventDefault();
      const newLocations = [...audienceInsights.topLocations, currentLocation.trim()];
      // Prevent duplicates
      if (!audienceInsights.topLocations.includes(currentLocation.trim())) {
        updateAudienceInsights({ topLocations: newLocations });
      }
      setCurrentLocation('');
    }
  };

  const removeLocation = (locationToRemove: string) => {
    const newLocations = audienceInsights.topLocations.filter(location => location !== locationToRemove);
    updateAudienceInsights({ topLocations: newLocations });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    // ✨ Validation now checks the store's state
    if (
      !audienceInsights.followers.instagram ||
      !audienceInsights.engagementMetrics.engagementRate ||
      !audienceInsights.engagementMetrics.avgLikesPerReel ||
      !audienceInsights.engagementMetrics.avgCommentsPerReel ||
      audienceInsights.topAgeGroups.length === 0 ||
      audienceInsights.topLocations.length === 0
      // !audienceInsights.audienceInterests || audienceInsights.audienceInterests.length === 0
    ) {
      alert('Please fill out all mandatory fields marked with an asterisk (*).');
      return;
    }
    onNext();
  };

  return (
    <form onSubmit={handleNext} className="bg-white p-8 rounded-lg shadow-sm border animate-fade-in text-black">
      <h2 className="text-2xl font-semibold mb-2">Audience Insights</h2>
      <p className="text-gray-500 mb-8">Provide details about your audience demographics and engagement.</p>

      <div className="space-y-6">
        {/* Followers & Engagement Rate */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="followers" className="block text-sm font-medium text-gray-700 mb-1">Cumulative Follower Count <span className="text-red-500">*</span></label>
            {/* ⚠️ NOTE: Mapping this to 'instagram' followers. Adjust if needed. */}
            <input 
              type="number" id="followers" 
              value={audienceInsights.followers.instagram || ''} 
              onChange={(e) => updateAudienceInsights({ followers: { ...audienceInsights.followers, instagram: Number(e.target.value) } })} 
              className="w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="e.g., 150000" 
            />
          </div>
          <div>
            <label htmlFor="engagement-rate" className="block text-sm font-medium text-gray-700 mb-1">Engagement Rate % <span className="text-red-500">*</span></label>
            <input 
              type="number" id="engagement-rate" 
              value={audienceInsights.engagementMetrics.engagementRate || ''} 
              onChange={(e) => updateAudienceInsights({ engagementMetrics: { ...audienceInsights.engagementMetrics, engagementRate: Number(e.target.value) } })} 
              className="w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="e.g., 3.5" 
            />
          </div>
        </div>
        
        {/* Engagement Metrics */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Engagement Metrics (Average per post) <span className="text-red-500">*</span></label>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
               <input 
                 type="number" 
                 value={audienceInsights.engagementMetrics.avgLikesPerReel || ''} 
                 onChange={(e) => updateAudienceInsights({ engagementMetrics: { ...audienceInsights.engagementMetrics, avgLikesPerReel: Number(e.target.value) } })} 
                 className="w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="Avg. Likes" 
               />
             </div>
             <div>
               <input 
                 type="number" 
                 value={audienceInsights.engagementMetrics.avgCommentsPerReel || ''} 
                 onChange={(e) => updateAudienceInsights({ engagementMetrics: { ...audienceInsights.engagementMetrics, avgCommentsPerReel: Number(e.target.value) } })} 
                 className="w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="Avg. Comments" 
               />
             </div>
           </div>
        </div>

        {/* Gender Split */}
        <div>
          <label htmlFor="gender-split" className="block text-sm font-medium text-gray-700 mb-2">Audience Gender Split % <span className="text-red-500">*</span></label>
          <input 
            type="range" id="gender-split" min="0" max="100" 
            value={audienceInsights.audienceGenderSplit.male || 50} 
            onChange={(e) => {
              const male = Number(e.target.value);
              updateAudienceInsights({ audienceGenderSplit: { male, female: 100 - male, other: 0 } });
            }} 
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
          />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>Male: {audienceInsights.audienceGenderSplit.male || 50}%</span>
            <span>Female: {audienceInsights.audienceGenderSplit.female || 50}%</span>
          </div>
        </div>

        {/* Top Age Groups */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Top Age Groups <span className="text-red-500">*</span></label>
          <div className="flex flex-wrap">
            {ageGroupOptions.map(option => (
              <button type="button" key={option} onClick={() => handleToggle(option, 'topAgeGroups')}
                className={`m-1 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${audienceInsights.topAgeGroups.includes(option) ? 'bg-black text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Top Locations */}
        <div>
          <label htmlFor="top-locations" className="block text-sm font-medium text-gray-700 mb-1">Top Locations <span className="text-red-500">*</span></label>
          <div className="w-full flex flex-wrap items-center p-2 border border-gray-300 rounded-md">
            {audienceInsights.topLocations.map(location => <Tag key={location} label={location} onRemove={() => removeLocation(location)} />)}
            <input
              type="text" id="top-locations"
              value={currentLocation}
              onChange={(e) => setCurrentLocation(e.target.value)}
              onKeyDown={handleLocationKeyDown}
              className="flex-grow p-1 outline-none bg-transparent"
              placeholder="Type a city and press Enter..."
            />
          </div>
        </div>

        {/* Audience Interests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Audience Interests <span className="text-red-500">*</span></label>
          <div className="flex flex-wrap">
            {/* ⚠️ This maps to a new 'audienceInterests' field you should add to your store */}
            
            {/* {audienceInterestOptions.map(option => (
              <button type="button" key={option} onClick={() => handleToggle(option, 'audienceInterests')}
                className={`m-1 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  (audienceInsights.audienceInterests || []).includes(option) ? 'bg-black text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}>
                {option}
              </button>
            ))} */}
           
          </div>
        </div>
      </div>

      {/* Navigation Button */}
      <div className="flex justify-end mt-12 pt-6 border-t">
        <button type="submit" className="px-8 py-3 bg-black text-white rounded-md font-semibold">
          {isLastStep ? 'Submit' : 'Next →'}
        </button>
      </div>
    </form>
  );
};

export default AudienceInsights;