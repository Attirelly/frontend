"use client";

import React, { useState } from "react";
import { useMakeupArtistStore } from "@/store/makeUpArtistStore";

interface ComponentProps {
  onNext: () => void;
  isLastStep?: boolean;
}

const SocialMediaCollaboration: React.FC<ComponentProps> = ({ onNext, isLastStep }) => {
  const { socialCollabs, updateSocialCollabs } = useMakeupArtistStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const collabTypes = [
    "Instagram Reels",
    "Makeup Tutorials",
    "Before/After Transformations",
    "Brand Endorsements",
    "Giveaway Campaigns",
    "Event Collaborations",
  ];

  const collabModels = [
    "Paid Partnership",
    "Barter Collaboration",
    "Affiliate Model",
    "Brand Ambassador",
    "Product Seeding",
  ];

  const collabFrequencies = [
    "Occasionally",
    "Monthly",
    "Bi-Weekly",
    "Weekly",
    "Regularly (Ongoing Partnerships)",
  ];

  const referralPotentialOptions = [
    "High (Frequently refer others)",
    "Moderate (Occasionally refer others)",
    "Low (Rarely refer others)",
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!socialCollabs.collabTypes.length)
      newErrors.collabTypes = "Select at least one collaboration type.";
    if (!socialCollabs.collabNature)
      newErrors.collabNature = "Please select a collaboration nature.";
    if (!socialCollabs.collabFrequency)
      newErrors.collabFrequency = "Please choose a frequency.";
    // if (!socialCollabs.referralPotential)
    //   newErrors.referralPotential = "Please indicate your referral potential.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleMultiSelect = (key: "collabTypes", value: string) => {
    const current = socialCollabs[key];
    if (current.includes(value)) {
      updateSocialCollabs({ [key]: current.filter((v: string) => v !== value) });
    } else {
      updateSocialCollabs({ [key]: [...current, value] });
    }
  };

  const handleChange = (key: keyof typeof socialCollabs, value: any) => {
    updateSocialCollabs({ [key]: value });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Social Collab Data:", socialCollabs);
    if (validateForm()) onNext();
  };
  
  return (
    <form
      onSubmit={handleNext}
      className="bg-white p-8 rounded-lg shadow-sm border animate-fade-in text-black"
    >
      <h2 className="text-2xl font-semibold mb-2">Social Media Collaborations</h2>
      <p className="text-gray-500 mb-8">
        Tell us about your collaborations and partnerships within the beauty & fashion community.
      </p>

      <div className="space-y-6">
        {/* Collaboration Types */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Types of Collaborations <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {collabTypes.map((type) => (
              <label key={type} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={socialCollabs.collabTypes.includes(type)}
                  onChange={() => handleMultiSelect("collabTypes", type)}
                  className="w-4 h-4"
                />
                {type}
              </label>
            ))}
          </div>
          {errors.attirellyCollabTypes && (
            <p className="text-sm text-red-500 mt-1">{errors.attirellyCollabTypes}</p>
          )}
        </div>

        {/* Collaboration Model */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Collaboration Model <span className="text-red-500">*</span>
          </label>
          <select
            value={socialCollabs.collabNature}
            onChange={(e) => handleChange("collabNature", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Model</option>
            {collabModels.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
          {errors.attirellyCollabModel && (
            <p className="text-sm text-red-500 mt-1">{errors.attirellyCollabModel}</p>
          )}
        </div>

        {/* Collaboration Frequency */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Collaboration Frequency <span className="text-red-500">*</span>
          </label>
          <select
            value={socialCollabs.collabFrequency}
            onChange={(e) => handleChange("collabFrequency", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Frequency</option>
            {collabFrequencies.map((freq) => (
              <option key={freq} value={freq}>
                {freq}
              </option>
            ))}
          </select>
          {errors.attirellyCollabFrequency && (
            <p className="text-sm text-red-500 mt-1">{errors.attirellyCollabFrequency}</p>
          )}
        </div>

        {/* Ready to Travel */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={socialCollabs.collabReadyToTravel}
            onChange={(e) => handleChange("collabReadyToTravel", e.target.checked)}
            className="w-4 h-4"
          />
          <label className="text-sm font-medium text-gray-700">
            I’m open to traveling for collaborations
          </label>
        </div>

        {/* Referral Potential */}
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Referral Potential <span className="text-red-500">*</span>
          </label>
          <select
            value={socialCollabs.referralPotential}
            onChange={(e) => handleChange("referralPotential", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Option</option>
            {referralPotentialOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {errors.referralPotential && (
            <p className="text-sm text-red-500 mt-1">{errors.referralPotential}</p>
          )}
        </div> */}
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

export default SocialMediaCollaboration;
