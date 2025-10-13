"use client";

import React, { useState } from "react";
import { useMakeupArtistStore } from "@/store/makeUpArtistStore";
import { X, UploadCloud, Link as LinkIcon, Trophy, Users } from 'lucide-react';

// Reusable TagInput component from ProfessionalDetails (can be moved to a common components folder)
interface TagInputProps {
  label: string;
  description: string;
  placeholder: string;
  tags: string[];
  updateTags: (newTags: string[]) => void;
  icon?: React.ReactNode;
}

const TagInput: React.FC<TagInputProps> = ({ label, description, placeholder, tags, updateTags, icon }) => {
    const [inputValue, setInputValue] = useState("");

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && inputValue.trim() !== "") {
            e.preventDefault();
            const newTag = inputValue.trim();
            if (!tags.some(tag => tag.toLowerCase() === newTag.toLowerCase())) {
                updateTags([...tags, newTag]);
            }
            setInputValue("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        updateTags(tags.filter((tag) => tag !== tagToRemove));
    };

    return (
        <div>
            <label className="flex items-center text-sm font-medium text-gray-700">
                {icon && <span className="mr-2">{icon}</span>}
                {label}
            </label>
            <p className="text-xs text-gray-500 mb-1">{description}</p>
            <div className="flex flex-wrap items-center w-full p-2 border border-gray-300 rounded-md">
                {tags.map((tag) => (
                    <div key={tag} className="flex items-center bg-gray-200 text-gray-800 rounded-full px-3 py-1 text-sm mr-2 mb-1">
                        <span>{tag}</span>
                        <button type="button" onClick={() => removeTag(tag)} className="ml-2 text-gray-500 hover:text-gray-800">
                            <X size={16} />
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

const WorkPortfolio: React.FC<ComponentProps> = ({ onNext, isLastStep }) => {
  const { workPortfolio, updateWorkPortfolio } = useMakeupArtistStore();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // This is a placeholder for the actual upload logic.
      // In a real app, you would upload each file to a service (like S3, Cloudinary),
      // get the URL back, and then add it to the state.
      const fileStubs = Array.from(files).map(file => `https://example.com/images/${file.name}`);
      const newImages = [...workPortfolio.portfolioImages, ...fileStubs];
      updateWorkPortfolio({ portfolioImages: newImages });
      alert(`${files.length} image(s) added as placeholders. Implement actual upload logic here.`);
    }
  };

  const removeImage = (imageToRemove: string) => {
    const newImages = workPortfolio.portfolioImages.filter(img => img !== imageToRemove);
    updateWorkPortfolio({ portfolioImages: newImages });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (workPortfolio.portfolioImages.length < 3) {
      alert("Please upload at least 3 portfolio images to showcase your work.");
      return;
    }
    onNext();
  };

  return (
    <form
      onSubmit={handleNext}
      className="bg-white p-8 rounded-lg shadow-sm border animate-fade-in text-black"
    >
      <h2 className="text-2xl font-semibold mb-2">Work Portfolio</h2>
      <p className="text-gray-500 mb-8">
        Your work speaks for itself. Upload your best shots and share your accomplishments.
      </p>

      <div className="space-y-8">
        {/* Portfolio Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Portfolio Images <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Upload high-quality images of your makeup artistry (at least 3 recommended).
          </p>
          <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
            <div className="text-center">
              <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4 flex text-sm leading-6 text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md bg-white font-semibold text-black focus-within:outline-none focus-within:ring-2 focus-within:ring-black focus-within:ring-offset-2 hover:text-gray-700"
                >
                  <span>Upload files</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleImageUpload} accept="image/*" />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
           {/* Image Previews */}
          {workPortfolio.portfolioImages.length > 0 && (
            <div className="mt-4 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {workPortfolio.portfolioImages.map((img, index) => (
                <div key={index} className="relative group">
                  <img src={img} alt={`Portfolio image ${index + 1}`} className="h-28 w-28 object-cover rounded-md" />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button type="button" onClick={() => removeImage(img)} className="text-white p-2 bg-red-600 rounded-full">
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Past Clients */}
        <TagInput
            label="Past Clients or Collaborations (Optional)"
            description="Mention notable clients or brands you've worked with."
            placeholder="e.g., 'Local Fashion Week'..."
            tags={workPortfolio.pastClients}
            updateTags={(newTags) => updateWorkPortfolio({ pastClients: newTags })}
            icon={<Users size={16} className="text-gray-500" />}
        />

        {/* Best Work Links */}
        <TagInput
            label="Links to Your Best Work (Optional)"
            description="Add links to your portfolio, articles, or features."
            placeholder="https://yourportfolio.com/bridal..."
            tags={workPortfolio.bestWorkLinks}
            updateTags={(newTags) => updateWorkPortfolio({ bestWorkLinks: newTags })}
            icon={<LinkIcon size={16} className="text-gray-500" />}
        />

         {/* Achievements */}
        <TagInput
            label="Achievements or Awards (Optional)"
            description="List any awards or recognitions you've received."
            placeholder="e.g., 'Best Bridal Artist 2023'..."
            tags={workPortfolio.achievements}
            updateTags={(newTags) => updateWorkPortfolio({ achievements: newTags })}
            icon={<Trophy size={16} className="text-gray-500" />}
        />

      </div>

      {/* Navigation Button */}
      <div className="flex justify-between items-center mt-12 pt-6 border-t">
        <div></div> {/* Placeholder for Back button */}
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

export default WorkPortfolio;