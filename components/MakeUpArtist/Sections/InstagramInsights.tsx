"use client";

import React, { useState } from "react";
import { useMakeupArtistStore } from "@/store/makeUpArtistStore";

interface ComponentProps {
  onNext: () => void;
  isLastStep?: boolean;
}

const InstagramInsights: React.FC<ComponentProps> = ({ onNext, isLastStep }) => {
  const { instagramInsights, updateInstagramInsights } = useMakeupArtistStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ===== Validation =====
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!instagramInsights.instagramHandle.trim()) {
      newErrors.instagramHandle = "Instagram handle is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) onNext();
  };

  // Helper to update numeric fields
  const handleNumberChange = (field: keyof typeof instagramInsights, value: string) => {
    const parsed = value === "" ? null : Number(value);
    updateInstagramInsights({ [field]: parsed });
  };

  // Helper to update string array fields
  const handleArrayChange = (field: keyof typeof instagramInsights, value: string) => {
    updateInstagramInsights({ [field]: value.split(",").map((s) => s.trim()) });
  };

  return (
    <form
      onSubmit={handleNext}
      className="bg-white p-8 rounded-lg shadow-sm border animate-fade-in text-black"
    >
      <h2 className="text-2xl font-semibold mb-2">Instagram Insights</h2>
      <p className="text-gray-500 mb-8">
        Share your Instagram performance metrics to help us understand your audience and reach.
      </p>

      <div className="space-y-6">
        {/* Instagram Handle */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Instagram Handle <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="@yourhandle"
            value={instagramInsights.instagramHandle}
            onChange={(e) =>
              updateInstagramInsights({ instagramHandle: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          {errors.instagramHandle && (
            <p className="text-sm text-red-500 mt-1">{errors.instagramHandle}</p>
          )}
        </div>

        {/* Numeric Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Followers</label>
            <input
              type="number"
              placeholder="e.g., 12000"
              value={instagramInsights.totalFollowers ?? ""}
              onChange={(e) => handleNumberChange("totalFollowers", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Posts</label>
            <input
              type="number"
              placeholder="e.g., 350"
              value={instagramInsights.totalPosts ?? ""}
              onChange={(e) => handleNumberChange("totalPosts", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Engagement Rate (%)</label>
            <input
              type="number"
              placeholder="e.g., 3.5"
              value={instagramInsights.engagementRate ?? ""}
              onChange={(e) => handleNumberChange("engagementRate", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Audience Gender Split */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Audience Gender Split (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g., Male: 60, Female: 40"
            value={
              instagramInsights.audienceGenderSplit
                ? Object.entries(instagramInsights.audienceGenderSplit)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(", ")
                : ""
            }
            onChange={(e) => {
              const obj: Record<string, number> = {};
              e.target.value.split(",").forEach((item) => {
                const [k, v] = item.split(":").map((s) => s.trim());
                if (k && v) obj[k] = Number(v);
              });
              updateInstagramInsights({ audienceGenderSplit: obj });
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Top Locations */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Top Audience Locations (Optional)
          </label>
          <input
            type="text"
            placeholder="Comma separated, e.g., Delhi, Mumbai"
            value={instagramInsights.topAudienceLocations.join(", ")}
            onChange={(e) => handleArrayChange("topAudienceLocations", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Content Niche */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content Niche (Optional)
          </label>
          <input
            type="text"
            placeholder="Comma separated, e.g., Bridal, Tutorials"
            value={instagramInsights.contentNiche.join(", ")}
            onChange={(e) => handleArrayChange("contentNiche", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Avg Story & Reel Views */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Avg Story Views (Optional)
            </label>
            <input
              type="number"
              value={instagramInsights.avgStoryViews ?? ""}
              onChange={(e) => handleNumberChange("avgStoryViews", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Avg Reel Views (Optional)
            </label>
            <input
              type="number"
              value={instagramInsights.avgReelViews ?? ""}
              onChange={(e) => handleNumberChange("avgReelViews", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Best Performing Content Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Best Performing Content Type (Optional)
          </label>
          <input
            type="text"
            value={instagramInsights.bestPerformingContentType}
            onChange={(e) =>
              updateInstagramInsights({ bestPerformingContentType: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Audience Insight Summary */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Audience Insight Summary (Optional)
          </label>
          <textarea
            rows={4}
            placeholder="Comma separated key points"
            value={instagramInsights.audienceInsightSummary.join(", ")}
            onChange={(e) =>
              handleArrayChange("audienceInsightSummary", e.target.value)
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      {/* Navigation Button */}
      <div className="flex justify-end mt-12 pt-6 border-t">
        <button
          type="submit"
          className="px-8 py-3 bg-black text-white rounded-md font-semibold"
        >
          {isLastStep ? "Submit" : "Next →"}
        </button>
      </div>
    </form>
  );
};

export default InstagramInsights;
