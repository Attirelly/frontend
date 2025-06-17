import { useCurrentStep, useFormActions } from "@/store/product_upload_store";
import { use, useEffect, useState } from "react";

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
    // await loadDraft(); 
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
    <div className="max-w-4xl mx-auto bg-white rounded-lg p-8 space-y-6">
      {/* Label at top */}
      <div className="text-2xl font-bold text-gray-700 text-center">
        Start creating your product
      </div>
      {/* Buttons row */}
      <div className="flex justify-between">
        <button
          onClick={handleContinueExisting}
          className={`px-4 py-2 rounded-md ${draftStep !== null
              ? "bg-yellow-500 text-white hover:bg-yellow-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          disabled={draftStep === null}
        >
          Continue Existing
        </button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={handleCreateNew}>
          Create New Product
        </button>
      </div>
    </div>
  );
}