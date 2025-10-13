'use client';

import { useState, forwardRef, useImperativeHandle } from 'react';

interface ComponentProps {
  onNext: () => void;
  isLastStep?: boolean;
}

const InstaInsights = forwardRef(({ onNext, isLastStep }: ComponentProps, ref) => {
  // State for all the form fields
  const [totalFollowers, setTotalFollowers] = useState('');
  const [totalPosts, setTotalPosts] = useState('');
  const [engagementRate, setEngagementRate] = useState('');
  const [avgStoryViews, setAvgStoryViews] = useState('');
  const [avgReelViews, setAvgReelViews] = useState('');

  // Expose data to the parent component
  useImperativeHandle(ref, () => ({
    getData: () => ({
      total_followers: totalFollowers,
      total_posts: totalPosts,
      engagement_rate: engagementRate,
      average_story_views: avgStoryViews,
      average_reel_views: avgReelViews,
    }),
  }));

  // Validation for mandatory fields
  const handleNext = () => {
    if (!totalFollowers || !totalPosts || !engagementRate || !avgStoryViews || !avgReelViews) {
      alert('Please fill out all mandatory fields.');
      return;
    }
    onNext();
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border animate-fade-in text-black">
      <h2 className="text-2xl font-semibold mb-2">Insta Insights</h2>
      <p className="text-gray-500 mb-8">Provide key metrics from your primary Instagram account.</p>

      <div className="space-y-6">
        {/* Total Followers & Total Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="total-followers" className="block text-sm font-medium text-gray-700 mb-1">
              Total Followers <span className="text-red-500">*</span>
            </label>
            <input type="number" id="total-followers" value={totalFollowers} onChange={(e) => setTotalFollowers(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="e.g., 25000" />
          </div>
          <div>
            <label htmlFor="total-posts" className="block text-sm font-medium text-gray-700 mb-1">
              Total Posts <span className="text-red-500">*</span>
            </label>
            <input type="number" id="total-posts" value={totalPosts} onChange={(e) => setTotalPosts(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="e.g., 500" />
          </div>
        </div>

        {/* Engagement Rate */}
        <div>
          <label htmlFor="engagement-rate" className="block text-sm font-medium text-gray-700 mb-1">
            Engagement Rate (%) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
             <input type="number" id="engagement-rate" value={engagementRate} onChange={(e) => setEngagementRate(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md pr-8" placeholder="e.g., 2.5" />
             <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">%</span>
          </div>
        </div>

        {/* Average Story Views & Reel Views */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="avg-story-views" className="block text-sm font-medium text-gray-700 mb-1">
              Average Story Views <span className="text-red-500">*</span>
            </label>
            <input type="number" id="avg-story-views" value={avgStoryViews} onChange={(e) => setAvgStoryViews(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="e.g., 1500" />
          </div>
          <div>
            <label htmlFor="avg-reel-views" className="block text-sm font-medium text-gray-700 mb-1">
              Average Reel Views <span className="text-red-500">*</span>
            </label>
            <input type="number" id="avg-reel-views" value={avgReelViews} onChange={(e) => setAvgReelViews(e.text-sm.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="e.g., 30000" />
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-12 pt-6 border-t">
        <button onClick={handleNext} className="px-8 py-3 bg-black text-white rounded-md font-semibold">
          {isLastStep ? 'Submit' : 'Next →'}
        </button>
      </div>
    </div>
  );
});

export default InstaInsights;