"use client";

import React, { useState } from "react";
import { useMakeupArtistStore } from "@/store/makeUpArtistStore";

interface ComponentProps {
  onNext: () => void;
  isLastStep?: boolean;
}

const MediaBio: React.FC<ComponentProps> = ({ onNext, isLastStep }) => {
  const { mediaBio, updateMediaBio } = useMakeupArtistStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!mediaBio.shortBio) newErrors.shortBio = "Short bio is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) onNext();
  };

  return (
    <form
      onSubmit={handleNext}
      className="bg-white p-8 rounded-lg shadow-sm border animate-fade-in text-black"
    >
      <h2 className="text-2xl font-semibold mb-2">Media & Bio</h2>
      <p className="text-gray-500 mb-8">
        Add your profile photo, portfolio, and a short bio for clients to know you better.
      </p>

      <div className="space-y-6">
        {/* Profile Photo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Profile Photo
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                updateMediaBio({ profilePhoto: URL.createObjectURL(e.target.files[0]) });
              }
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          {mediaBio.profilePhoto && (
            <img
              src={mediaBio.profilePhoto}
              alt="Profile Preview"
              className="mt-2 w-32 h-32 object-cover rounded-full border"
            />
          )}
        </div>

        {/* Portfolio File */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Portfolio File
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                updateMediaBio({ portfolioFile: e.target.files[0].name });
              }
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          {mediaBio.portfolioFile && (
            <p className="mt-2 text-gray-700 text-sm">Selected: {mediaBio.portfolioFile}</p>
          )}
        </div>

        {/* Short Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Short Bio <span className="text-red-500">*</span>
          </label>
          <textarea
            value={mediaBio.shortBio}
            onChange={(e) => updateMediaBio({ shortBio: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            placeholder="Write a brief bio about yourself..."
          />
          {errors.shortBio && <p className="text-sm text-red-500 mt-1">{errors.shortBio}</p>}
        </div>

        {/* Published Toggle */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="published"
            checked={mediaBio.published}
            onChange={(e) => updateMediaBio({ published: e.target.checked })}
            className="h-4 w-4 border-gray-300 rounded"
          />
          <label htmlFor="published" className="text-sm text-gray-700">
            Publish my profile
          </label>
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

export default MediaBio;
