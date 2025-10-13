"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { useMakeupArtistStore } from "@/store/makeUpArtistStore";
import { AgeGroupOption, GenderOption } from "@/types/utilityTypes";

// Static options
const languageOptions = [
  "English", "Hindi", "Punjabi", "Tamil", "Telugu", "Kannada", "Malayalam",
  "Bengali", "Marathi", "Gujarati", "Odia", "Assamese", "Urdu", "Bhojpuri", "Haryanvi",
];

interface ComponentProps {
  onNext: () => void;
  isLastStep?: boolean;
}

const BasicInformationMakeupArtist: React.FC<ComponentProps> = ({ onNext, isLastStep }) => {
  const { basicInformation, updateBasicInformation } = useMakeupArtistStore();

  const [genderOptions, setGenderOptions] = useState<GenderOption[]>([]);
  const [ageGroupOptions, setAgeGroupOptions] = useState<AgeGroupOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      setIsLoading(true);
      try {
        const [gendersResponse, ageGroupsResponse] = await Promise.all([
          api.get("/genders"),
          api.get("/age-groups"),
        ]);
        setGenderOptions(gendersResponse.data);
        setAgeGroupOptions(ageGroupsResponse.data);
      } catch (error) {
        console.error("Failed to fetch options:", error);
        alert("There was an error loading form data. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOptions();
  }, []);

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !basicInformation.name ||
      !basicInformation.email ||
      !basicInformation.phoneInternal ||
      !basicInformation.gender_id ||
      !basicInformation.age_group_id ||
      basicInformation.languages.length === 0
    ) {
      alert("Please fill out all required fields (*)");
      return;
    }
    onNext();
  };

  if (isLoading || genderOptions.length === 0 || ageGroupOptions.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm border animate-fade-in text-center">
        <h2 className="text-xl font-semibold text-gray-700">Loading Details...</h2>
        <p className="text-gray-500 mt-2">Preparing your form...</p>
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
        Enter your personal and professional details to get started.
      </p>

      <div className="space-y-6">
        {/* Full Name */}
        <div>
          <label htmlFor="full-name" className="block text-sm font-medium text-gray-700">
            Full Name <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-500 mb-1">
            Name that should appear on your Attirelly profile and collaborations.
          </p>
          <input
            type="text"
            id="full-name"
            value={basicInformation.name}
            onChange={(e) => updateBasicInformation({ name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-1">For brand and client communication</p>
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
              Phone Number (Internal Use) <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-1">Used only by the Attirelly team</p>
            <input
              type="tel"
              id="internal-phone"
              value={basicInformation.phoneInternal}
              onChange={(e) => updateBasicInformation({ phoneInternal: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Public Phone */}
        <div>
          <label htmlFor="public-phone" className="block text-sm font-medium text-gray-700">
            Public Contact Number (Optional)
          </label>
          <p className="text-xs text-gray-500 mb-1">Visible to potential clients or agencies</p>
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

        {/* Age & Languages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="age-range" className="block text-sm font-medium text-gray-700 mb-1">
              Age Range <span className="text-red-500">*</span>
            </label>
            <select
              id="age-range"
              value={basicInformation.age_group_id || ""}
              onChange={(e) => updateBasicInformation({ age_group_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="" disabled>
                Select an age range
              </option>
              {ageGroupOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
              Language Spoken <span className="text-red-500">*</span>
            </label>
            <select
              id="language"
              value={basicInformation.languages[0] || ""}
              onChange={(e) => updateBasicInformation({ languages: [e.target.value] })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="" disabled>
                Select a language
              </option>
              {languageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Experience Field */}
        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
            Years of Experience <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="experience"
            min="0"
            value={basicInformation.experience || ""}
            onChange={(e) => updateBasicInformation({ experience: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            placeholder="e.g., 3"
          />
        </div>

        {/* Specialization */}
        <div>
          <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
            Specialization (e.g., Bridal, Editorial, Party) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="specialization"
            value={basicInformation.specialization || ""}
            onChange={(e) => updateBasicInformation({ specialization: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            placeholder="Enter your primary makeup styles"
          />
        </div>
      </div>

      {/* Navigation */}
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

export default BasicInformationMakeupArtist;
