"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { useMakeupArtistStore } from "@/store/makeUpArtistStore"; // <-- UPDATED STORE
import { GenderOption } from "@/types/utilityTypes";

// Static language options
const languageOptions = [
  "English", "Hindi", "Punjabi", "Tamil", "Telugu", "Kannada", "Malayalam",
  "Bengali", "Marathi", "Gujarati", "Odia", "Assamese", "Urdu", "Bhojpuri", "Haryanvi",
];

interface ComponentProps {
  onNext: () => void;
  isLastStep?: boolean;
}

const BasicInformation: React.FC<ComponentProps> = ({ onNext, isLastStep }) => {
  const { basicInformation, updateBasicInformation } = useMakeupArtistStore();

  // --- State to hold dynamic options from the API ---
  const [genderOptions, setGenderOptions] = useState<GenderOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- Fetch data on component mount ---
  useEffect(() => {
    const fetchOptions = async () => {
      setIsLoading(true);
      try {
        const gendersResponse = await api.get("/genders");
        setGenderOptions(gendersResponse.data);
      } catch (error) {
        console.error("Failed to fetch gender options:", error);
        alert("There was an error loading essential data. Please try refreshing the page.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOptions();
  }, []); // Runs only once on mount

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();

    // --- Validation for Makeup Artist fields ---
    if (
      !basicInformation.name ||
      !basicInformation.email ||
      !basicInformation.phoneInternal ||
      !basicInformation.gender_id ||
      basicInformation.experienceYears === null || // Check for null
      basicInformation.languages.length === 0
    ) {
      alert("Please fill out all mandatory fields marked with an asterisk (*).");
      return;
    }
    onNext();
  };

  if (isLoading || !basicInformation || genderOptions.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm border animate-fade-in text-center">
        <h2 className="text-xl font-semibold text-gray-700">Loading Details...</h2>
        <p className="text-gray-500 mt-2">Preparing the form for you.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleNext}
      className="bg-white p-8 rounded-lg shadow-sm border animate-fade-in text-black"
    >
      <h2 className="text-2xl font-semibold mb-2">Basic Information</h2>
      <p className="text-gray-500 mb-8">
        Enter your personal and contact details to get started.
      </p>

      <div className="space-y-6">
        {/* Full Name */}
        <div>
          <label htmlFor="full-name" className="block text-sm font-medium text-gray-700">
            Full Name <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-500 mb-1">
            This name will be displayed on your public profile.
          </p>
          <input
            type="text"
            id="full-name"
            value={basicInformation.name}
            onChange={(e) => updateBasicInformation({ name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Email & Internal Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-1">
              Primary email for client and platform communication.
            </p>
            <input
              type="email"
              id="email"
              value={basicInformation.email}
              onChange={(e) => updateBasicInformation({ email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="internal-phone" className="block text-sm font-medium text-gray-700">
              Phone Number (Internal) <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-1">
              For our team's use only. Not visible to clients.
            </p>
            <input
              type="tel"
              id="internal-phone"
              value={basicInformation.phoneInternal}
              onChange={(e) => updateBasicInformation({ phoneInternal: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Public Phone (Optional) */}
        <div>
          <label htmlFor="public-phone" className="block text-sm font-medium text-gray-700">
            Public Phone Number (Optional)
          </label>
          <p className="text-xs text-gray-500 mb-1">
            A number you are comfortable sharing with potential clients.
          </p>
          <input
            type="tel"
            id="public-phone"
            value={basicInformation.phonePublic}
            onChange={(e) => updateBasicInformation({ phonePublic: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-4">
            {genderOptions.map((option) => (
              <button
                type="button"
                key={option.id}
                onClick={() => updateBasicInformation({ gender_id: option.id })}
                className={`flex-1 p-3 border rounded-lg text-center transition-all duration-200 ${
                  basicInformation.gender_id === option.id
                    ? "border-black bg-gray-50 font-semibold"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                {option.gender_value}
              </button>
            ))}
          </div>
        </div>
        
        {/* Years of Experience & Language Spoken */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* NEW: Years of Experience */}
          <div>
            <label htmlFor="experience-years" className="block text-sm font-medium text-gray-700 mb-1">
              Years of Experience <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="experience-years"
              placeholder="e.g., 5"
              value={basicInformation.experienceYears ?? ''}
              onChange={(e) =>
                updateBasicInformation({
                  experienceYears: e.target.value === '' ? null : Number(e.target.value),
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Language Spoken */}
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
              Primary Language Spoken <span className="text-red-500">*</span>
            </label>
            <select
              id="language"
              value={basicInformation.languages[0] || ""}
              onChange={(e) => updateBasicInformation({ languages: [e.target.value] })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="" disabled>Select a language</option>
              {languageOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        {/* NEW: Short Bio */}
        <div>
            <label htmlFor="short-bio" className="block text-sm font-medium text-gray-700">
                Short Bio
            </label>
            <p className="text-xs text-gray-500 mb-1">
                A brief introduction about yourself and your passion for makeup (200-300 characters recommended).
            </p>
            <textarea
                id="short-bio"
                rows={4}
                value={basicInformation.shortBio}
                onChange={(e) => updateBasicInformation({ shortBio: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                placeholder="e.g., Passionate makeup artist with a flair for creating timeless bridal looks..."
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

export default BasicInformation;