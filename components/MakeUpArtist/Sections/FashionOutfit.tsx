"use client";

import React, { useState } from "react";
import { useMakeupArtistStore } from "@/store/makeUpArtistStore";

interface ComponentProps {
  onNext: () => void;
  isLastStep?: boolean;
}

const FashionOutfitInfluence: React.FC<ComponentProps> = ({ onNext, isLastStep }) => {
  const { fashionOutfitInfluence, updateFashionOutfitInfluence } = useMakeupArtistStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const guidanceOptions = [
    "Color Palette Suggestions",
    "Jewelry Recommendations",
    "Outfit Styling Tips",
    "Hair Accessory Pairing",
    "Makeup & Outfit Coordination",
  ];

  const trendOptions = [
    "Bridal Trends",
    "Seasonal Makeup Trends",
    "Editorial Looks",
    "Celebrity-Inspired Styles",
    "Minimalist Makeup Trends",
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!fashionOutfitInfluence.guidanceTypes.length)
      newErrors.guidanceTypes = "Please select at least one type of guidance.";
    if (!fashionOutfitInfluence.guidesOnTrends.length)
      newErrors.guidesOnTrends = "Please select at least one trend you guide on.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) onNext();
  };

  const handleMultiSelect = (key: "guidanceTypes" | "guidesOnTrends", value: string) => {
    const current = fashionOutfitInfluence[key];
    if (current.includes(value)) {
      updateFashionOutfitInfluence({ [key]: current.filter((v) => v !== value) });
    } else {
      updateFashionOutfitInfluence({ [key]: [...current, value] });
    }
  };

  const handleDesignersInput = (value: string) => {
    const designers = value
      .split(",")
      .map((d) => d.trim())
      .filter((d) => d.length > 0);
    updateFashionOutfitInfluence({ designersOrLabels: designers });
  };

  return (
    <form
      onSubmit={handleNext}
      className="bg-white p-8 rounded-lg shadow-sm animate-fade-in text-black"
    >
      <h2 className="text-2xl font-semibold mb-2">Fashion & Outfit Influence</h2>
      <p className="text-gray-500 mb-8">
        Share how you influence outfit choices and trends for your clients.
      </p>

      <div className="space-y-6">
        {/* Boutique Recommendations */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={fashionOutfitInfluence.recommendsBoutiques}
            onChange={(e) =>
              updateFashionOutfitInfluence({ recommendsBoutiques: e.target.checked })
            }
            className="w-4 h-4"
          />
          <label className="text-sm font-medium text-gray-700">
            I recommend boutiques or designers to my clients
          </label>
        </div>

        {/* Guidance Types */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Types of Guidance You Offer <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {guidanceOptions.map((item) => (
              <label key={item} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={fashionOutfitInfluence.guidanceTypes.includes(item)}
                  onChange={() => handleMultiSelect("guidanceTypes", item)}
                  className="w-4 h-4"
                />
                {item}
              </label>
            ))}
          </div>
          {errors.guidanceTypes && (
            <p className="text-sm text-red-500 mt-1">{errors.guidanceTypes}</p>
          )}
        </div>

        {/* Guides on Trends */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trends You Provide Guidance On <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {trendOptions.map((item) => (
              <label key={item} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={fashionOutfitInfluence.guidesOnTrends.includes(item)}
                  onChange={() => handleMultiSelect("guidesOnTrends", item)}
                  className="w-4 h-4"
                />
                {item}
              </label>
            ))}
          </div>
          {errors.guidesOnTrends && (
            <p className="text-sm text-red-500 mt-1">{errors.guidesOnTrends}</p>
          )}
        </div>

        {/* Helps with Outfit Coordination */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={fashionOutfitInfluence.helpsWithOutfitCoordination}
            onChange={(e) =>
              updateFashionOutfitInfluence({
                helpsWithOutfitCoordination: e.target.checked,
              })
            }
            className="w-4 h-4"
          />
          <label className="text-sm font-medium text-gray-700">
            I help clients coordinate their outfits with makeup looks
          </label>
        </div>

        {/* Designers or Labels */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Designers or Labels You Usually Recommend
          </label>
          <input
            type="text"
            value={fashionOutfitInfluence.designersOrLabels.join(", ")}
            onChange={(e) => handleDesignersInput(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md mt-1"
            placeholder="e.g., Sabyasachi, Manish Malhotra, Anita Dongre"
          />
          <p className="text-xs text-gray-500 mt-1">
            Separate multiple names with commas.
          </p>
        </div>
      </div>

      {/* Navigation Button */}
      {/* <div className="flex justify-end mt-12 pt-6 border-t">
        <button
          type="submit"
          className="px-8 py-3 bg-black text-white rounded-md font-semibold"
        >
          {isLastStep ? "Submit" : "Next →"}
        </button>
      </div> */}
    </form>
  );
};

export default FashionOutfitInfluence;
