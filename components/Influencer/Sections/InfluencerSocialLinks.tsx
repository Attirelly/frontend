

'use client';

import React from 'react';
import { useInfluencerStore } from '@/store/influencerStore'; // 👈 Correct path
import { Instagram } from 'lucide-react';

interface ComponentProps {
  onNext: () => void;
  isLastStep?: boolean;
}

export default function InfluencerSocialLinks({ onNext, isLastStep }: ComponentProps) {
  // ✨ Get state and actions directly from the Zustand store
  const { socialPresence, updateSocialPresence } = useInfluencerStore();

  // ✨ A helper to handle input changes for the nested socialLinks object
  const handleLinkChange = (field: 'instagram' | 'website' | 'facebook', value: string) => {
    updateSocialPresence({
      socialLinks: {
        // Keep other links in the object intact
        ...socialPresence.socialLinks,
        [field]: value,
      },
    });
  };

  // ✨ Validation now checks the store's state
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    const { instagram, website, facebook } = socialPresence.socialLinks;
    if (!instagram || !website || !facebook) {
      alert('All social link fields are mandatory. Please fill them to continue.');
      return;
    }
    onNext();
  };

  return (
    <form onSubmit={handleNext} className="bg-white p-8 rounded-lg shadow-sm border animate-fade-in text-black">
      {/* Social Links Section */}
      <h2 className="text-2xl font-semibold mb-2">Social Links</h2>
      <p className="text-sm text-gray-500 mb-8">
        Customers will see these details on Attirelly.
      </p>

      <div className="space-y-6">
        {/* Instagram Username Field */}
        <div>
          <label htmlFor="instagramUsername" className="block text-sm font-medium text-gray-700">
            Instagram username <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
              instagram.com/
            </span>
            <input
              type="text"
              id="instagramUsername"
              autoComplete="off"
              // ✨ Read value from the store
              value={socialPresence.socialLinks.instagram}
              // ✨ On change, call the store's update action
              onChange={(e) => handleLinkChange('instagram', e.target.value)}
              className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
              placeholder="influencer_name"
            />
          </div>
        </div>

        {/* Website URL Field */}
        <div>
          <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700">
            Website URL <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <input
              type="url"
              id="websiteUrl"
              autoComplete="off"
              value={socialPresence.socialLinks.website}
              onChange={(e) => handleLinkChange('website', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
              placeholder="https://yourwebsite.com"
            />
          </div>
        </div>

        {/* Facebook URL Field */}
        <div>
          <label htmlFor="facebookUrl" className="block text-sm font-medium text-gray-700">
            Facebook URL <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <input
              type="url"
              id="facebookUrl"
              autoComplete="off"
              value={socialPresence.socialLinks.facebook}
              onChange={(e) => handleLinkChange('facebook', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
              placeholder="https://facebook.com/yourpage"
            />
          </div>
        </div>
      </div>

      <hr className="my-10" />

      {/* Integrate Section */}
      <h2 className="text-2xl font-semibold mb-8">Integrate</h2>

      {/* Integration Card */}
      <div className="flex w-full items-center justify-between p-6 border rounded-lg text-left transition-all duration-200">
        <div className="flex-grow">
          <h3 className="font-semibold text-gray-900">
            Integrate with Instagram
          </h3>
          <p className="text-gray-600 text-sm">
            Connect your Instagram, so Attirelly can engage with you.
          </p>
          <button type="button" className="mt-4 px-6 py-2 bg-black text-white rounded-md font-semibold hover:bg-gray-800">
            Disconnect
          </button>
        </div>
        <div className="flex-shrink-0">
          <Instagram className="h-10 w-10 text-pink-500" />
        </div>
      </div>

      {/* Navigation Button */}
      <div className="flex justify-end mt-12 pt-6 border-t">
        <button
          type="submit"
          className="px-8 py-3 bg-black text-white rounded-md font-semibold hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
        >
          {isLastStep ? 'Submit' : 'Next →'}
        </button>
      </div>
    </form>
  );
}