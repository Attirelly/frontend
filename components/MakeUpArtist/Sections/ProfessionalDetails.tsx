"use client";

import React, { useState } from "react";
import { ProfessionalDetails as ProfessionalDetailsTypes, useMakeupArtistStore } from "@/store/makeUpArtistStore";


// Helper component for dynamic tag input fields
interface TagInputProps {
  label: string;
  description: string;
  placeholder: string;
  tags: string[];
  updateTags: (newTags: string[]) => void;
}

const TagInput: React.FC<TagInputProps> = ({ label, description, placeholder, tags, updateTags }) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        updateTags([...tags, inputValue.trim()]);
      }
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    updateTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <p className="text-xs text-gray-500 mb-1">{description}</p>
      <div className="flex flex-wrap items-center w-full p-2 border border-gray-300 rounded-md">
        {tags.map((tag) => (
          <div key={tag} className="flex items-center bg-gray-200 text-gray-800 rounded-full px-3 py-1 text-sm font-medium mr-2 mb-1">
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-2 text-gray-500 hover:text-gray-800"
            >
              &times;
            </button>
          </div>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-grow bg-transparent focus:outline-none p-1"
        />
      </div>
    </div>
  );
};


// Main Component
interface ComponentProps {
  onNext: () => void;
  isLastStep?: boolean;
}

const ProfessionalDetails: React.FC<ComponentProps> = ({ onNext, isLastStep }) => {
  const { professionalDetails, updateProfessionalDetails } = useMakeupArtistStore();

  const services: ProfessionalDetailsTypes['servicesOffered'] = [
    "Bridal Makeup", "Party Makeup", "HD Makeup", "Airbrush Makeup",
    "Editorial Makeup", "Hair Styling", "Groom Makeup"
  ];

  const handleServiceToggle = (service: typeof services[number]) => {
    const currentServices = professionalDetails.servicesOffered;
    const newServices = currentServices.includes(service)
      ? currentServices.filter((s) => s !== service)
      : [...currentServices, service];
    updateProfessionalDetails({ servicesOffered: newServices });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (professionalDetails.servicesOffered.length === 0) {
      alert("Please select at least one service you offer.");
      return;
    }
    onNext();
  };

  return (
    <form
      onSubmit={handleNext}
      className="bg-white p-8 rounded-lg shadow-sm border animate-fade-in text-black"
    >
      <h2 className="text-2xl font-semibold mb-2">Professional Details</h2>
      <p className="text-gray-500 mb-8">
        Showcase your skills, specialties, and the tools of your trade.
      </p>

      <div className="space-y-8">
        {/* Services Offered */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Services Offered <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-500 mb-2">Select all that apply.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {services.map((service) => (
              <button
                type="button"
                key={service}
                onClick={() => handleServiceToggle(service)}
                className={`p-4 border rounded-lg text-center transition-all duration-200 ${
                  professionalDetails.servicesOffered.includes(service)
                    ? "border-black bg-gray-50 font-semibold"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                {service}
              </button>
            ))}
          </div>
        </div>

        {/* Styles Specialized In */}
        <TagInput
            label="Styles You Specialize In"
            description="e.g., Natural, Glam, Bohemian, Vintage, etc."
            placeholder="Type a style and press Enter..."
            tags={professionalDetails.stylesSpecializedIn}
            updateTags={(newTags) => updateProfessionalDetails({ stylesSpecializedIn: newTags })}
        />

        {/* Brands Used */}
        <TagInput
            label="Makeup Brands You Use"
            description="List the primary brands in your kit. e.g., MAC, Huda Beauty, NARS"
            placeholder="Type a brand and press Enter..."
            tags={professionalDetails.brandsUsed}
            updateTags={(newTags) => updateProfessionalDetails({ brandsUsed: newTags })}
        />

        {/* Certifications */}
        <TagInput
            label="Certifications or Training"
            description="List any relevant certifications. e.g., 'Lakmé Academy Pro'"
            placeholder="Type a certification and press Enter..."
            tags={professionalDetails.certifications}
            updateTags={(newTags) => updateProfessionalDetails({ certifications: newTags })}
        />

      </div>

      {/* Navigation Button */}
      <div className="flex justify-between items-center mt-12 pt-6 border-t">
        {/* We can add a "Back" button later if needed */}
        <div></div>
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

export default ProfessionalDetails;