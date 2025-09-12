'use client';
import { useFormActions } from "@/store/product_upload_store";
import { useEffect, useState } from "react";

/**
 * A component that serves as the initial screen for the product upload process.
 *
 * This is the first component the user sees (Step 0) in the upload flow. Its primary purpose
 * is to check for a previously saved draft and allow the user to either continue editing that
 * draft or start a new product from scratch.
 *
 * ### State Management
 * - **Zustand (`useFormActions`)**: This component heavily relies on actions from the `product_upload_store`.
 * - `loadDraft`: Called on mount to check for a saved draft and get its last saved step.
 * - `deleteDraft`: Called if the user chooses to create a new product, clearing any old data.
 * - `setCurrentStep`: Used to navigate the user to the appropriate step in the form.
 * - `setStepValidation`: It sets its own step (Step 0) as valid immediately, as it requires no user input.
 * - **Local State (`useState`)**: A `draftStep` state is used to store the step number of a found draft, which controls the enabled/disabled state of the "Continue Existing" button.
 *
 * @returns {JSX.Element} A UI with two primary actions: "Continue Existing" and "Create New Product".
 * @see {@link https://docs.pmnd.rs/zustand/getting-started/introduction | Zustand Documentation}
 */

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

  
  /**
   * Handles the click event for the "Continue Existing" button.
   * Navigates the user to the step where they left off in their saved draft.
   */
  const handleContinueExisting = async () => {
    if (draftStep !== null) {
      setCurrentStep(draftStep);
    }
  };
  
    /**
   * Handles the click event for the "Create New Product" button.
   * It first deletes any existing draft and then navigates the user to the first real step of the form.
   */
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
