'use client';
import { useCurrentStep, useFormActions } from "@/store/product_upload_store";
import { useEffect, useState } from "react";

export default function Blank() {

  const { setStepValidation, setCurrentStep, loadDraft, deleteDraft } = useFormActions();
  const [draftStep, setDraftStep] = useState<number | null>(null);
  useEffect(() => {
    setStepValidation(0, true);
    const load = async () => {
      const step = await loadDraft();
      if (step && step >= 1) {
        setDraftStep(step);
      }
    };
    load();
  }, [])

  const handleContinueExisting = async () => {
    if (draftStep !== null) {
      setCurrentStep(draftStep);
    }
  };

  const handleCreateNew = async () => {
    if (draftStep !== null) {
      await deleteDraft(); // clear any existing draft
    }
    setCurrentStep(1); // skip to first form section
  };


  return (
    // Main container with responsive padding and width
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg p-6 sm:p-8 space-y-6">
      {/* Responsive title */}
      <div className="text-xl sm:text-2xl font-bold text-gray-700 text-center">
        Start creating your product
      </div>
      
      {/* Buttons row: stacks vertically on mobile, horizontal on larger screens */}
      <div className="flex flex-col text-sm md:text-lg sm:flex-row sm:justify-between gap-4">
        <button
          onClick={handleContinueExisting}
          className={`w-full sm:w-auto px-4 py-2 rounded-md transition-colors duration-200 ${draftStep !== null
              ? "bg-yellow-500 text-white hover:bg-yellow-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          disabled={draftStep === null}
        >
          Continue Existing
        </button>
        <button 
          className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
          onClick={handleCreateNew}
        >
          Create New Product
        </button>
      </div>
    </div>
  );
}
