"use client";

import React, { useState } from "react";
import { useMakeupArtistStore } from "@/store/makeUpArtistStore";

interface ComponentProps {
  onNext: () => void;
  isLastStep?: boolean;
}

const CommissionProgram: React.FC<ComponentProps> = ({ onNext, isLastStep }) => {
  const { commissionProgram, updateCommissionProgram } = useMakeupArtistStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ===== Validation =====
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!commissionProgram.avgMonthlyReferrals) {
      newErrors.avgMonthlyReferrals = "Please enter your average monthly referrals.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ===== Handlers =====
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) onNext();
  };

  return (
    <form
      onSubmit={handleNext}
      className="bg-white p-8 rounded-lg shadow-sm animate-fade-in text-black"
    >
      <h2 className="text-2xl font-semibold mb-2">Commission / Partnership Program</h2>
      <p className="text-gray-500 mb-8">
        Share your participation in our commission or partnership program.
      </p>

      <div className="space-y-6">
        {/* Commission Opt-in */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={commissionProgram.commissionOptIn}
            onChange={(e) =>
              updateCommissionProgram({ commissionOptIn: e.target.checked })
            }
            className="w-4 h-4"
          />
          <label className="text-sm font-medium text-gray-700">
            I want to participate in Attirelly's commission / partnership program
          </label>
        </div>

        {/* Average Monthly Referrals */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Average Monthly Referrals <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={commissionProgram.avgMonthlyReferrals}
            onChange={(e) =>
              updateCommissionProgram({ avgMonthlyReferrals: e.target.value })
            }
            placeholder="e.g., 5–10 referrals"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          {errors.avgMonthlyReferrals && (
            <p className="text-sm text-red-500 mt-1">{errors.avgMonthlyReferrals}</p>
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

export default CommissionProgram;
