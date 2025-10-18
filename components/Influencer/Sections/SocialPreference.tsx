'use client';

import React from 'react';
import { useInfluencerStore } from '@/store/influencerStore'; // 👈 Correct path

interface ComponentProps {
  onNext: () => void;
  isLastStep?: boolean;
}

// Define types for clarity
type PlatformOption = "Instagram" | "YouTube" | "Facebook" | "Snapchat" | "Other";

const platformOptions: PlatformOption[] = ['Instagram', 'YouTube', 'Facebook', 'Snapchat', 'Other'];
const nicheOptions = ['Fashion', 'Beauty', 'Lifestyle', 'Travel', 'Fitness', 'Ethnic Wear', 'Wedding'];
const styleOptions = ['Trendy', 'Luxury', 'Traditional', 'Informative', 'Humorous', 'Minimalist', 'Roasting', 'Dance'];

const SocialPreference: React.FC<ComponentProps> = ({ onNext, isLastStep }) => {
  // ✨ Get state and actions from the Zustand store
  const { socialPresence, updateSocialPresence } = useInfluencerStore();

  // ✨ A helper to handle input changes for the nested socialLinks object
  const handleLinkChange = (field: 'instagram' | 'facebook' | 'snapchat' | 'website', value: string) => {
    updateSocialPresence({
      socialLinks: {
        ...socialPresence.socialLinks,
        [field]: value,
      },
    });
  };

  // ✨ Validation now checks the store's state
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !socialPresence.primaryPlatform ||
      !socialPresence.socialLinks.instagram ||
      socialPresence.categoryNiche.length === 0 ||
      socialPresence.contentStyle.length === 0
    ) {
      alert('Please fill out all mandatory fields marked with an asterisk (*).');
      return;
    }
    onNext();
  };

  return (
    <form onSubmit={handleNext} className="bg-white p-8 rounded-lg shadow-sm animate-fade-in text-black">
      <h2 className="text-2xl font-semibold mb-2">Social Preference</h2>
      <p className="text-gray-500 mb-8">Tell us about your platforms, niche, and style.</p>

      <div className="space-y-6">
        {/* Primary Platform */}
        <div>
          <label htmlFor="primary-platform" className="block text-sm font-medium text-gray-700 mb-1">
            Primary Platform <span className="text-red-500">*</span>
          </label>
          <select
            id="primary-platform"
            value={socialPresence.primaryPlatform || ''}
            onChange={(e) => updateSocialPresence({ primaryPlatform: e.target.value as PlatformOption })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="" disabled>Select a platform</option>
            {platformOptions.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>

        {/* Insta Handle */}
        <div>
          <label htmlFor="insta-handle" className="block text-sm font-medium text-gray-700">
            Instagram Handle <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
              instagram.com/
            </span>
            <input
              type="text"
              id="insta-handle"
              value={socialPresence.socialLinks.instagram}
              onChange={(e) => handleLinkChange('instagram', e.target.value)}
              className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border border-gray-300 px-3 py-2 sm:text-sm"
              placeholder="yourhandle"
            />
          </div>
        </div>

        {/* Other URLs (Optional) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="facebook-url" className="block text-sm font-medium text-gray-700">Facebook Page URL (Optional)</label>
            <input type="url" id="facebook-url" value={socialPresence.socialLinks.facebook} onChange={(e) => handleLinkChange('facebook', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="https://facebook.com/yourpage" />
          </div>
          <div>
            <label htmlFor="snapchat-url" className="block text-sm font-medium text-gray-700">Snapchat URL (Optional)</label>
            <input type="url" id="snapchat-url" value={socialPresence.socialLinks.snapchat} onChange={(e) => handleLinkChange('snapchat', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="https://snapchat.com/add/yourusername" />
          </div>
        </div>
        
        <div>
          <label htmlFor="website-url" className="block text-sm font-medium text-gray-700">Website URL (Optional)</label>
          <input type="url" id="website-url" value={socialPresence.socialLinks.website} onChange={(e) => handleLinkChange('website', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="https://yourwebsite.com" />
        </div>

        {/* Category Niche & Content Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="category-niche" className="block text-sm font-medium text-gray-700 mb-1">
              Category Niche <span className="text-red-500">*</span>
            </label>
            <select
              id="category-niche"
              // ✨ Read the first item from the store's array for the select value
              value={socialPresence.categoryNiche[0] || ''}
              // ✨ On change, save the value as a single-item array in the store
              onChange={(e) => updateSocialPresence({ categoryNiche: [e.target.value] })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="" disabled>Select a niche</option>
              {nicheOptions.map(option => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="content-style" className="block text-sm font-medium text-gray-700 mb-1">
              Content Style <span className="text-red-500">*</span>
            </label>
            <select
              id="content-style"
              value={socialPresence.contentStyle[0] || ''}
              onChange={(e) => updateSocialPresence({ contentStyle: [e.target.value] })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="" disabled>Select a style</option>
              {styleOptions.map(option => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Navigation Button */}
      {/* <div className="flex justify-end mt-12 pt-6">
        <button
          type="submit"
          className="px-8 py-3 bg-black text-white rounded-md font-semibold"
        >
          {isLastStep ? 'Submit' : 'Next →'}
        </button>
      </div> */}
    </form>
  );
};

export default SocialPreference;