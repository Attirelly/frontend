'use client';

import { useState, forwardRef, useImperativeHandle, KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface ComponentProps {
  onNext: () => void;
  isLastStep?: boolean;
}

// Options for the multi-select fields
const ageGroupOptions = ['13-17', '18-24', '25-34', '35-44', '45-54', '55-64', '65+'];
const audienceTypeOptions = ['Students', 'Working Professionals', 'Parents', 'Fashion Enthusiasts', 'Gamers', 'Techies', 'Entrepreneurs'];

// A small component for displaying tags (for Top Locations)
const Tag = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
  <span className="flex items-center bg-gray-200 text-gray-800 text-sm font-medium mr-2 mb-2 px-2.5 py-1 rounded-md">
    {label}
    <button onClick={onRemove} className="ml-1.5 text-gray-500 hover:text-gray-800">
      <X size={14} />
    </button>
  </span>
);

const AudienceInsights = forwardRef(({ onNext, isLastStep }: ComponentProps, ref) => {
  // State for all form fields
  const [followers, setFollowers] = useState('');
  const [engagementRate, setEngagementRate] = useState('');
  const [avgLikes, setAvgLikes] = useState('');
  const [avgComments, setAvgComments] = useState('');
  const [genderSplit, setGenderSplit] = useState(50); // Represents male percentage
  const [topAgeGroups, setTopAgeGroups] = useState<string[]>([]);
  const [topLocations, setTopLocations] = useState<string[]>([]);
  const [currentLocation, setCurrentLocation] = useState(''); // Temp state for the location input
  const [audienceTypes, setAudienceTypes] = useState<string[]>([]);

  // Expose data to the parent component
  useImperativeHandle(ref, () => ({
    getData: () => ({
      cumulative_follower_count: followers,
      engagement_rate: engagementRate,
      avg_likes: avgLikes, // Part of "Engagement metrics"
      avg_comments: avgComments, // Part of "Engagement metrics"
      audience_gender_split: { male: genderSplit, female: 100 - genderSplit },
      top_age_groups: topAgeGroups,
      top_locations: topLocations,
      audience_types: audienceTypes,
    }),
  }));

  // Validation logic
  const handleNext = () => {
    if (!followers || !engagementRate || !avgLikes || !avgComments || topAgeGroups.length === 0 || topLocations.length === 0 || audienceTypes.length === 0) {
      alert('Please fill out all mandatory fields marked with an asterisk (*).');
      return;
    }
    onNext();
  };
  
  // --- Handlers for multi-select and tag inputs ---

  const handleToggle = (option: string, state: string[], setState: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (state.includes(option)) {
      setState(state.filter(item => item !== option));
    } else {
      setState([...state, option]);
    }
  };

  const handleLocationKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentLocation.trim() !== '') {
      e.preventDefault();
      if (!topLocations.includes(currentLocation.trim())) {
        setTopLocations([...topLocations, currentLocation.trim()]);
      }
      setCurrentLocation('');
    }
  };

  const removeLocation = (locationToRemove: string) => {
    setTopLocations(topLocations.filter(location => location !== locationToRemove));
  };


  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border animate-fade-in text-black">
      <h2 className="text-2xl font-semibold mb-2">Audience Insights</h2>
      <p className="text-gray-500 mb-8">Provide details about your audience demographics and engagement.</p>

      <div className="space-y-6">
        {/* Followers & Engagement Rate */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="followers" className="block text-sm font-medium text-gray-700 mb-1">Cumulative Follower Count <span className="text-red-500">*</span></label>
            <input type="number" id="followers" value={followers} onChange={(e) => setFollowers(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="e.g., 150000" />
          </div>
          <div>
            <label htmlFor="engagement-rate" className="block text-sm font-medium text-gray-700 mb-1">Engagement Rate % <span className="text-red-500">*</span></label>
            <input type="number" id="engagement-rate" value={engagementRate} onChange={(e) => setEngagementRate(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="e.g., 3.5" />
          </div>
        </div>
        
        {/* Engagement Metrics */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Engagement Metrics (Average per post) <span className="text-red-500">*</span></label>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <input type="number" value={avgLikes} onChange={(e) => setAvgLikes(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="Avg. Likes" />
              </div>
              <div>
                <input type="number" value={avgComments} onChange={(e) => setAvgComments(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="Avg. Comments" />
              </div>
           </div>
        </div>

        {/* Gender Split */}
        <div>
          <label htmlFor="gender-split" className="block text-sm font-medium text-gray-700 mb-2">Audience Gender Split % <span className="text-red-500">*</span></label>
          <input type="range" id="gender-split" min="0" max="100" value={genderSplit} onChange={(e) => setGenderSplit(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>Male: {genderSplit}%</span>
            <span>Female: {100 - genderSplit}%</span>
          </div>
        </div>

        {/* Top Age Groups */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Top Age Groups <span className="text-red-500">*</span></label>
          <div className="flex flex-wrap">
            {ageGroupOptions.map(option => (
              <button key={option} onClick={() => handleToggle(option, topAgeGroups, setTopAgeGroups)}
                className={`m-1 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${topAgeGroups.includes(option) ? 'bg-black text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Top Locations */}
        <div>
          <label htmlFor="top-locations" className="block text-sm font-medium text-gray-700 mb-1">Top Locations <span className="text-red-500">*</span></label>
          <div className="w-full flex flex-wrap items-center p-2 border border-gray-300 rounded-md">
            {topLocations.map(location => <Tag key={location} label={location} onRemove={() => removeLocation(location)} />)}
            <input
              type="text"
              id="top-locations"
              value={currentLocation}
              onChange={(e) => setCurrentLocation(e.target.value)}
              onKeyDown={handleLocationKeyDown}
              className="flex-grow p-1 outline-none bg-transparent"
              placeholder="Type a city and press Enter..."
            />
          </div>
        </div>

        {/* Audience Types */}
         <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Audience Types <span className="text-red-500">*</span></label>
          <div className="flex flex-wrap">
            {audienceTypeOptions.map(option => (
              <button key={option} onClick={() => handleToggle(option, audienceTypes, setAudienceTypes)}
                className={`m-1 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${audienceTypes.includes(option) ? 'bg-black text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Button */}
      <div className="flex justify-end mt-12 pt-6 border-t">
        <button onClick={handleNext} className="px-8 py-3 bg-black text-white rounded-md font-semibold">
          {isLastStep ? 'Submit' : 'Next →'}
        </button>
      </div>
    </div>
  );
});

export default AudienceInsights;