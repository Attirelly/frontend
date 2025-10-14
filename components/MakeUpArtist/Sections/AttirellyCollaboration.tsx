"use client";

import React, { useState } from "react";
import { useMakeupArtistStore } from "@/store/makeUpArtistStore";

interface ComponentProps {
  onNext: () => void;
  isLastStep?: boolean;
}

const AttirellyCollaboration: React.FC<ComponentProps> = ({ onNext, isLastStep }) => {
  const { attirellyCollab, updateAttirellyCollab } = useMakeupArtistStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Options
  const collabTypes = [
    "Makeup Tutorials for Attirelly",
    "Reel Collaboration (Attirelly products)",
    "Event / Workshop Hosting",
    "Product Review",
    "Bridal Collaboration",
    "Social Media Campaign",
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
    "High (Frequently refer Attirelly)",
    "Moderate (Occasionally refer Attirelly)",
    "Low (Rarely refer Attirelly)",
  ];

  // ===== Validation =====
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!attirellyCollab.attirellyCollabTypes.length)
      newErrors.attirellyCollabTypes = "Select at least one collaboration type.";
    if (!attirellyCollab.attirellyCollabModel)
      newErrors.attirellyCollabModel = "Please select a collaboration model.";
    if (!attirellyCollab.attirellyCollabFrequency)
      newErrors.attirellyCollabFrequency = "Please choose a collaboration frequency.";
    if (!attirellyCollab.referralPotential)
      newErrors.referralPotential = "Please indicate your referral potential.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ===== Handlers =====
  const handleMultiSelect = (value: string) => {
    const current = attirellyCollab.attirellyCollabTypes;
    if (current.includes(value)) {
      updateAttirellyCollab({
        attirellyCollabTypes: current.filter((v) => v !== value),
      });
    } else {
      updateAttirellyCollab({
        attirellyCollabTypes: [...current, value],
      });
    }
  };

  const handleChange = (key: keyof typeof attirellyCollab, value: any) => {
    updateAttirellyCollab({ [key]: value });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) onNext();
  };

  // ===== UI =====
  return (
    <form
      onSubmit={handleNext}
      className="bg-white p-8 rounded-lg shadow-sm border animate-fade-in text-black"
    >
      <h2 className="text-2xl font-semibold mb-2">Social Media Collaborations (with Attirelly)</h2>
      <p className="text-gray-500 mb-8">
        Tell us about your collaboration preferences with Attirelly — so we can plan exciting
        campaigns together.
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
                  checked={attirellyCollab.attirellyCollabTypes.includes(type)}
                  onChange={() => handleMultiSelect(type)}
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
            value={attirellyCollab.attirellyCollabModel}
            onChange={(e) => handleChange("attirellyCollabModel", e.target.value)}
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
            value={attirellyCollab.attirellyCollabFrequency}
            onChange={(e) => handleChange("attirellyCollabFrequency", e.target.value)}
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
            checked={attirellyCollab.attirellyReadyToTravel}
            onChange={(e) => handleChange("attirellyReadyToTravel", e.target.checked)}
            className="w-4 h-4"
          />
          <label className="text-sm font-medium text-gray-700">
            I’m open to traveling for Attirelly campaigns or events
          </label>
        </div>

        {/* Referral Potential */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Referral Potential <span className="text-red-500">*</span>
          </label>
          <select
            value={attirellyCollab.referralPotential}
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

export default AttirellyCollaboration;
