"use client";

import React, { useState } from "react";
import { useMakeupArtistStore } from "@/store/makeUpArtistStore";

interface ComponentProps {
  onNext: () => void;
  isLastStep?: boolean;
}

const BasicInformation: React.FC<ComponentProps> = ({ onNext, isLastStep }) => {
  const { basicInformation, updateBasicInformation } = useMakeupArtistStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Artist Type Options
  const artistTypes = [
    "Bridal MUA",
    "Party MUA",
    "Editorial MUA",
    "Freelance MUA",
    "Salon Artist",
  ];

  // Team size options
  const teamSizes = ["Solo", "2–5", "6–10", "10+"];

  // Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!basicInformation.fullName)
      newErrors.fullName = "Full Name is required.";
    if (!basicInformation.email)
      newErrors.email = "Email is required.";
    if (!basicInformation.whatsappNumber)
      newErrors.whatsappNumber = "WhatsApp number is required.";
    if (!basicInformation.yearsExperience)
      newErrors.yearsExperience = "Experience is required.";
    if (!basicInformation.teamSize)
      newErrors.teamSize = "Team size is required.";
    if (!basicInformation.artistType)
      newErrors.artistType = "Artist type is required.";

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
      className="bg-white p-8 rounded-lg shadow-sm animate-fade-in text-black"
    >
      <h2 className="text-2xl font-semibold mb-2">Basic Information</h2>
      <p className="text-gray-500 mb-8">
        Provide your basic details to create your professional profile.
      </p>

      <div className="space-y-6">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            value={basicInformation.fullName}
            onChange={(e) => updateBasicInformation({ fullName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            placeholder="e.g., Priya Sharma"
          />
          {errors.fullName && <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>}
        </div>

        {/* Brand Name */}
        <div>
          <label htmlFor="brandName" className="block text-sm font-medium text-gray-700">
            Brand / Business Name
          </label>
          <input
            id="brandName"
            type="text"
            value={basicInformation.brandName}
            onChange={(e) => updateBasicInformation({ brandName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            placeholder="e.g., Glam by Priya"
          />
        </div>

        {/* Email & WhatsApp */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={basicInformation.email}
              onChange={(e) => updateBasicInformation({ email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., priya.mua@gmail.com"
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700">
              WhatsApp Number <span className="text-red-500">*</span>
            </label>
            <input
              id="whatsappNumber"
              type="tel"
              value={basicInformation.whatsappNumber}
              onChange={(e) => updateBasicInformation({ whatsappNumber: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., +91 9876543210"
            />
            {errors.whatsappNumber && (
              <p className="text-sm text-red-500 mt-1">{errors.whatsappNumber}</p>
            )}
          </div>
        </div>

        {/* Years Experience & Team Size */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="yearsExperience" className="block text-sm font-medium text-gray-700">
              Years of Experience <span className="text-red-500">*</span>
            </label>
            <input
              id="yearsExperience"
              type="text"
              value={basicInformation.yearsExperience}
              onChange={(e) => updateBasicInformation({ yearsExperience: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., 3–5 years"
            />
            {errors.yearsExperience && (
              <p className="text-sm text-red-500 mt-1">{errors.yearsExperience}</p>
            )}
          </div>

          <div>
            <label htmlFor="teamSize" className="block text-sm font-medium text-gray-700">
              Team Size <span className="text-red-500">*</span>
            </label>
            <select
              id="teamSize"
              value={basicInformation.teamSize}
              onChange={(e) => updateBasicInformation({ teamSize: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Team Size</option>
              {teamSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            {errors.teamSize && (
              <p className="text-sm text-red-500 mt-1">{errors.teamSize}</p>
            )}
          </div>
        </div>

        {/* Artist Type */}
        <div>
          <label htmlFor="artistType" className="block text-sm font-medium text-gray-700">
            Artist Type <span className="text-red-500">*</span>
          </label>
          <select
            id="artistType"
            value={basicInformation.artistType}
            onChange={(e) => updateBasicInformation({ artistType: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Artist Type</option>
            {artistTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.artistType && (
            <p className="text-sm text-red-500 mt-1">{errors.artistType}</p>
          )}
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

export default BasicInformation;
