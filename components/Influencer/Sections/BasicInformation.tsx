"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { useInfluencerStore } from "@/store/influencerStore";
import { AgeGroupOption, GenderOption } from "@/types/utilityTypes";



// Language options can remain static if not managed in the DB
const languageOptions = [
  "English", "Hindi", "Punjabi", "Tamil", "Telugu", "Kannada", "Malayalam",
  "Bengali", "Marathi", "Gujarati", "Odia", "Assamese", "Urdu", "Bhojpuri", "Haryanvi",
];

interface ComponentProps {
  onNext: () => void;
  isLastStep?: boolean;
}

const BasicInformation: React.FC<ComponentProps> = ({ onNext, isLastStep }) => {
  const { basicInformation, updateBasicInformation } = useInfluencerStore();

  // --- State to hold dynamic options from the API ---
  const [genderOptions, setGenderOptions] = useState<GenderOption[]>([]);
  const [ageGroupOptions, setAgeGroupOptions] = useState<AgeGroupOption[]>([]);
  const [isLoading, setIsLoading] = useState(true); // To handle loading state

  // --- Fetch data on component mount ---
  useEffect(() => {
    const fetchOptions = async () => {
      setIsLoading(true);
      try {
        // Fetch both sets of options concurrently for better performance
        const [gendersResponse, ageGroupsResponse] = await Promise.all([
          api.get("/genders"),
          api.get("/age-groups")
        ]);
        console.log(genderOptions , ageGroupOptions)
        setGenderOptions(gendersResponse.data);
        setAgeGroupOptions(ageGroupsResponse.data);

      } catch (error) {
        console.error("Failed to fetch form options:", error);
        // Here you could show a toast notification to the user
        alert("There was an error loading essential data. Please try refreshing the page.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOptions();
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();

    // --- Validation now checks for the presence of IDs in the store ---
    if (
      !basicInformation.name ||
      !basicInformation.email ||
      !basicInformation.phoneInternal ||
      !basicInformation.gender_id || // Changed from genderValue
      !basicInformation.age_group_id || // Changed from ageGroup
      basicInformation.languages.length === 0
    ) {
      console.log("basicInformation" , basicInformation)
      alert(
        "Please fill out all mandatory fields marked with an asterisk (*)."
      );
      return;
    }
    onNext();
  };

  // if (isLoading || !basicInformation ||  genderOptions.length === 0 || ageGroupOptions.length === 0 ) {
  if (isLoading || !basicInformation ) {
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
      className="bg-white p-8 rounded-lg shadow-md animate-fade-in text-black"
    >
      <h2 className="text-2xl font-semibold mb-2">Basic Information</h2>
      <p className="text-gray-500 mb-8">
        Enter your personal and contact details.
      </p>

      <div className="space-y-6">
        {/* Full Name */}
        <div>
          <label htmlFor="full-name" className="block text-sm font-medium text-gray-700">
            Full Name <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-500 mb-1">
            Name that should appear on collaborations and platforms
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
              Primary email for brand communication.
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
              Phone Number (Internal Only) <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-1">
              For internal communication only, not visible to brands
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
            Phone Number (Self/Manager/Agency) (Optional)
          </label>
          <p className="text-xs text-gray-500 mb-1">Visible to brands</p>
          <input
            type="tel"
            id="public-phone"
            value={basicInformation.phonePublic}
            onChange={(e) => updateBasicInformation({ phonePublic: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Gender - Now dynamically rendered */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-4">
            {genderOptions.map((option) => (
              <button
                type="button"
                key={option.id}
                // --- Update store with the ID ---
                onClick={() => updateBasicInformation({ gender_id: option.id })}
                className={`flex-1 p-3 border rounded-lg text-center transition-all duration-200 ${
                  // --- Check active state against the ID in the store ---
                  basicInformation.gender_id === option.id
                    ? "border-black bg-gray-50 font-semibold"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                {/* --- Display the text label --- */}
                {option.gender_value}
              </button>
            ))}
          </div>
        </div>

        {/* Age Range & Language Spoken */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Age Range - Now dynamically rendered */}
          <div>
            <label htmlFor="age-range" className="block text-sm font-medium text-gray-700 mb-1">
              Age Range <span className="text-red-500">*</span>
            </label>
            <select
              id="age-range"
              // --- Bind value to the ID in the store ---
              value={basicInformation.age_group_id || ""}
              // --- Update store with the ID ---
              onChange={(e) => updateBasicInformation({ age_group_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="" disabled>Select an age range</option>
              {ageGroupOptions.map((option) => (
                // --- Key and value are the ID ---
                <option key={option.id} value={option.id}>
                  {/* --- Display the text label --- */}
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {/* Language Spoken */}
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
              <option value="" disabled>Select a language</option>
              {languageOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Navigation Button */}
      {/* <div className="flex justify-end mt-12 pt-6">
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

