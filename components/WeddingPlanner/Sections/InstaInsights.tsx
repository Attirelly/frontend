'use client';

import { forwardRef, useImperativeHandle } from 'react';
import { useWeddingPlannerStore, InstagramInsights as InstagramInsightsType } from '@/store/weddingPlannerStore'; // Import store and type

interface ComponentProps {
  onNext: () => void;
  isLastStep?: boolean;
}

const InstaInsights = forwardRef(({ onNext, isLastStep }: ComponentProps, ref) => {
  // Get state and updater from Zustand
  const { instaInsights, updateInstaInsights } = useWeddingPlannerStore();

  // --- LOCAL STATE REMOVED ---

  // Expose data to the parent component (reads from Zustand)
  useImperativeHandle(ref, () => ({
    getData: () => ({
      total_followers: instaInsights.totalFollowers,
      total_posts: instaInsights.totalPosts,
      engagement_rate: instaInsights.engagementRate,
      average_story_views: instaInsights.averageStoryViews,
      average_reel_views: instaInsights.averageReelViews,
    }),
  }));

  // Validation for mandatory fields (reads from Zustand)
  const handleNext = () => {
    const { totalFollowers, totalPosts, engagementRate, averageStoryViews, averageReelViews } = instaInsights;
    
    // Check if any value is null or undefined (0 is valid)
    if (
      totalFollowers === null || totalFollowers === undefined ||
      totalPosts === null || totalPosts === undefined ||
      engagementRate === null || engagementRate === undefined ||
      averageStoryViews === null || averageStoryViews === undefined ||
      averageReelViews === null || averageReelViews === undefined
    ) {
      alert('Please fill out all mandatory fields.');
      return;
    }
    onNext();
  };

  /**
   * Handles changes for all numeric inputs, converting string to number or null
   */

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
            <input 
              type="text" 
              id="total-followers" 
              value={instaInsights.totalFollowers ?? ''} 
              onChange={(e) => updateInstaInsights({ totalFollowers: e.target.value })} 
              className="w-full px-4 py-2 border border-gray-300 rounded-md" 
              placeholder="e.g., 25000" />
          </div>
          <div>
            <label htmlFor="total-posts" className="block text-sm font-medium text-gray-700 mb-1">
              Total Posts <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              id="total-posts" 
              value={instaInsights.totalPosts ?? ''} 
              onChange={(e) => updateInstaInsights({ totalPosts: e.target.value })} 
              className="w-full px-4 py-2 border border-gray-300 rounded-md" 
              placeholder="e.g., 500" />
          </div>
        </div>

        {/* Engagement Rate */}
        <div>
          <label htmlFor="engagement-rate" className="block text-sm font-medium text-gray-700 mb-1">
            Engagement Rate (%) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
             <input 
              type="text" 
              id="engagement-rate" 
              value={instaInsights.engagementRate ?? ''} 
              onChange={(e) => updateInstaInsights({ engagementRate: e.target.value })} 
              className="w-full px-4 py-2 border border-gray-300 rounded-md pr-8" 
              placeholder="e.g., 2.5" 
              step="0.1"
             />
             <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">%</span>
          </div>
        </div>

        {/* Average Story Views & Reel Views */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="avg-story-views" className="block text-sm font-medium text-gray-700 mb-1">
              Average Story Views <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              id="avg-story-views" 
              value={instaInsights.averageStoryViews ?? ''} 
              onChange={(e) => updateInstaInsights({ averageStoryViews: e.target.value })} 
              className="w-full px-4 py-2 border border-gray-300 rounded-md" 
              placeholder="e.g., 1500" />
          </div>
          <div>
            <label htmlFor="avg-reel-views" className="block text-sm font-medium text-gray-700 mb-1">
              Average Reel Views <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              id="avg-reel-views" 
              value={instaInsights.averageReelViews ?? ''} 
              onChange={(e) => updateInstaInsights({ averageReelViews: e.target.value })} 
              className="w-full px-4 py-2 border border-gray-300 rounded-md" 
              placeholder="e.g., 30000" />
          </div>
        </div>
      </div>

      {/* Navigation button is in the parent component, so handleNext is passed */}
      {/* This component no longer needs to render its own button */}
    </div>
  );
});

export default InstaInsights;