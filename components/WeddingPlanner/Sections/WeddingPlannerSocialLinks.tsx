'use client';

import { useState } from 'react';
import { Instagram } from 'lucide-react';

interface ComponentProps {
  onNext: () => void;
}

export default function WeddingPlannerSocialLinks({ onNext }: ComponentProps) {
  // State for the social media link fields
  const [instagramUsername, setInstagramUsername] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');

  // Validation function
  const handleNext = () => {
    // Making all fields mandatory as per previous component logic
    if (!instagramUsername || !websiteUrl || !facebookUrl) {
      alert('All social link fields are mandatory. Please fill them to continue.');
      return;
    }
    onNext();
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border animate-fade-in text-black">
      {/* Social Links Section */}
      <h2 className="text-2xl font-semibold mb-2">Social Links</h2>
      <p className="text-sm text-gray-500 mb-8">
        Customers will see these details on your Wedding Planner profile.
      </p>

      <div className="space-y-6">
        {/* Instagram Username Field */}
        <div>
          <label
            htmlFor="instagramUsername"
            className="block text-sm font-medium text-gray-700"
          >
            Instagram username
            <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
              instagram.com/
            </span>
            <input
              type="text"
              name="instagramUsername"
              id="instagramUsername"
              autoComplete="off"
              value={instagramUsername}
              onChange={(e) => setInstagramUsername(e.target.value)}
              className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-black sm:text-sm"
              placeholder="planner_name"
            />
          </div>
        </div>

        {/* Website URL Field */}
        <div>
          <label
            htmlFor="websiteUrl"
            className="block text-sm font-medium text-gray-700"
          >
            Website URL <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <input
              type="url"
              name="websiteUrl"
              id="websiteUrl"
              autoComplete="off"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              placeholder="https://youragencywebsite.com"
            />
          </div>
        </div>

        {/* Facebook URL Field */}
        <div>
          <label
            htmlFor="facebookUrl"
            className="block text-sm font-medium text-gray-700"
          >
            Facebook URL <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <input
              type="url"
              name="facebookUrl"
              id="facebookUrl"
              autoComplete="off"
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              placeholder="https://facebook.com/youragency"
            />
          </div>
        </div>
      </div>

      <hr className="my-10" />

      {/* Integrate Section (Retained for consistency, though platform-specific wording is used) */}
      <h2 className="text-2xl font-semibold mb-8">Integrate</h2>

      {/* Integration Card */}
      <div className="flex w-full items-center justify-between p-6 border rounded-lg text-left shadow-sm transition-all duration-200">
        <div className="flex-grow">
          <h3 className="font-semibold text-gray-900">
            Integrate with Instagram
          </h3>
          <p className="text-gray-600 text-sm">
            Connect your Instagram to showcase your recent wedding work.
          </p>
          <button className="mt-4 px-6 py-2 bg-black text-white rounded-md font-semibold hover:bg-gray-800">
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
          onClick={handleNext}
          className="px-8 py-3 bg-black text-white rounded-md font-semibold hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
        >
          Next →
        </button>
      </div>
    </div>
  );
}