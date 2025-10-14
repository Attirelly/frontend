"use client";

import React, { useState } from "react";
import { useMakeupArtistStore } from "@/store/makeUpArtistStore";

interface ComponentProps {
  onNext: () => void;
  isLastStep?: boolean;
}

const SocialLinks: React.FC<ComponentProps> = ({ onNext, isLastStep }) => {
  const { socialLinks, updateSocialLinks } = useMakeupArtistStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ===== Validation =====
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const hasAnyLink = Object.values(socialLinks.socialLinks).some((val) => val.trim() !== "");

    if (!hasAnyLink) {
      newErrors.socialLinks = "Please add at least one social media link.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ===== Handlers =====
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) onNext();
  };

  // ===== Helper to update individual links =====
  const handleLinkChange = (platform: string, value: string) => {
    updateSocialLinks({
      socialLinks: { ...socialLinks.socialLinks, [platform]: value },
    });
  };

  // List of common social media platforms
  const platforms = ["Instagram", "Facebook", "YouTube", "LinkedIn", "Twitter", "Pinterest"];

  return (
    <form
      onSubmit={handleNext}
      className="bg-white p-8 rounded-lg shadow-sm border animate-fade-in text-black"
    >
      <h2 className="text-2xl font-semibold mb-2">Social Links</h2>
      <p className="text-gray-500 mb-8">
        Add links to your social media profiles and any notable features or publications.
      </p>

      <div className="space-y-6">
        {/* Social Media Links */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Social Media Links <span className="text-red-500">*</span>
          </label>
          {platforms.map((platform) => (
            <div key={platform} className="mb-3">
              <input
                type="url"
                placeholder={`Your ${platform} profile URL`}
                value={socialLinks.socialLinks[platform] || ""}
                onChange={(e) => handleLinkChange(platform, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
          ))}
          {errors.socialLinks && (
            <p className="text-sm text-red-500 mt-1">{errors.socialLinks}</p>
          )}
        </div>

        {/* Featured On */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Featured On (Optional)
          </label>
          <input
            type="text"
            placeholder="Comma separated list e.g., Vogue, Harper's Bazaar"
            value={socialLinks.featuredOn.join(", ")}
            onChange={(e) =>
              updateSocialLinks({ featuredOn: e.target.value.split(",").map((s) => s.trim()) })
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

export default SocialLinks;
