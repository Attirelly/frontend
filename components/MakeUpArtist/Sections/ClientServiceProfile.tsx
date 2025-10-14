"use client";

import React, { useState } from "react";
import { useMakeupArtistStore } from "@/store/makeUpArtistStore";

interface ComponentProps {
  onNext: () => void;
  isLastStep?: boolean;
}

const ClientServiceProfile: React.FC<ComponentProps> = ({ onNext, isLastStep }) => {
  const { clientServiceProfile, updateClientServiceProfile } = useMakeupArtistStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const clientTypeOptions = [
    "Brides",
    "Celebrities",
    "Models",
    "Party Clients",
    "Editorial Clients",
    "Corporate Clients",
  ];

  const occasionFocusOptions = [
    "Bridal",
    "Pre-Wedding",
    "Party/Event",
    "Fashion Shows",
    "Editorial Shoots",
    "Festivals",
  ];

  const avgBookingsOptions = ["0–5", "6–10", "11–20", "21–30", "30+"];
  const priceRangeOptions = [
    "₹5,000–₹10,000",
    "₹10,000–₹25,000",
    "₹25,000–₹50,000",
    "₹50,000+",
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!clientServiceProfile.clientTypes.length)
      newErrors.clientTypes = "Please select at least one client type.";
    if (!clientServiceProfile.occasionFocus.length)
      newErrors.occasionFocus = "Please select at least one occasion focus.";
    if (!clientServiceProfile.avgBookingsPerMonth)
      newErrors.avgBookingsPerMonth = "Please select average monthly bookings.";
    if (!clientServiceProfile.avgPriceRange)
      newErrors.avgPriceRange = "Please select your price range.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) onNext();
  };

  const handleMultiSelect = (key: "clientTypes" | "occasionFocus", value: string) => {
    const currentValues = clientServiceProfile[key];
    if (currentValues.includes(value)) {
      updateClientServiceProfile({
        [key]: currentValues.filter((v) => v !== value),
      });
    } else {
      updateClientServiceProfile({
        [key]: [...currentValues, value],
      });
    }
  };

  return (
    <form
      onSubmit={handleNext}
      className="bg-white p-8 rounded-lg shadow-sm border animate-fade-in text-black"
    >
      <h2 className="text-2xl font-semibold mb-2">Client & Service Profile</h2>
      <p className="text-gray-500 mb-8">
        Tell us more about your clients and the kind of makeup services you offer.
      </p>

      <div className="space-y-6">
        {/* Client Types */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Client Types <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {clientTypeOptions.map((type) => (
              <label key={type} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={clientServiceProfile.clientTypes.includes(type)}
                  onChange={() => handleMultiSelect("clientTypes", type)}
                  className="w-4 h-4"
                />
                {type}
              </label>
            ))}
          </div>
          {errors.clientTypes && (
            <p className="text-sm text-red-500 mt-1">{errors.clientTypes}</p>
          )}
        </div>

        {/* Occasion Focus */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Occasion Focus <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {occasionFocusOptions.map((occ) => (
              <label key={occ} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={clientServiceProfile.occasionFocus.includes(occ)}
                  onChange={() => handleMultiSelect("occasionFocus", occ)}
                  className="w-4 h-4"
                />
                {occ}
              </label>
            ))}
          </div>
          {errors.occasionFocus && (
            <p className="text-sm text-red-500 mt-1">{errors.occasionFocus}</p>
          )}
        </div>

        {/* Average Bookings & Price Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Avg. Bookings per Month <span className="text-red-500">*</span>
            </label>
            <select
              value={clientServiceProfile.avgBookingsPerMonth}
              onChange={(e) =>
                updateClientServiceProfile({ avgBookingsPerMonth: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md mt-1"
            >
              <option value="">Select</option>
              {avgBookingsOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {errors.avgBookingsPerMonth && (
              <p className="text-sm text-red-500 mt-1">{errors.avgBookingsPerMonth}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Avg. Price Range <span className="text-red-500">*</span>
            </label>
            <select
              value={clientServiceProfile.avgPriceRange}
              onChange={(e) =>
                updateClientServiceProfile({ avgPriceRange: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md mt-1"
            >
              <option value="">Select</option>
              {priceRangeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {errors.avgPriceRange && (
              <p className="text-sm text-red-500 mt-1">{errors.avgPriceRange}</p>
            )}
          </div>
        </div>

        {/* Ready to Travel */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={clientServiceProfile.readyToTravel}
            onChange={(e) =>
              updateClientServiceProfile({ readyToTravel: e.target.checked })
            }
            className="w-4 h-4"
          />
          <label className="text-sm font-medium text-gray-700">
            I’m open to travel for assignments
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

export default ClientServiceProfile;
