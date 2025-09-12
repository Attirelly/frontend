"use client";
import BrandAndSeller from "@/components/ProductUploadSection/BrandAndSeller";
import ProductAttributes from "@/components/ProductUploadSection/ProductAttributes";
import CategorySelector from "@/components/ProductUploadSection/CategorySelector";
import PricingAndAvailability from "@/components/ProductUploadSection/PricingAndAvailability";
import VariantAndInventory from "@/components/ProductUploadSection/VariantAndInventory";
import MediaAssets from "@/components/ProductUploadSection/MediaAssets";
import ProductUploadSideBar from "@/components/ProductUploadSection/ProductUploadSideBar";
import {
  useCurrentStep,
  useFormActions,
  useIsLoading,
  useStepValidations,
} from "@/store/product_upload_store";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Blank from "@/components/ProductUploadSection/Blank";

// An array that maps each step number to its corresponding component.
// This allows for dynamic rendering of the current form section.
const sectionComponents = [
  Blank,
  CategorySelector,
  ProductAttributes,
  BrandAndSeller,
  PricingAndAvailability,
  VariantAndInventory,
  MediaAssets,
];
/**
 * The main page component that orchestrates the multi-step product upload process.
 *
 * This component acts as the primary layout and controller for uploading a new product.
 * It is structured as a wizard-style form, where the user progresses through different
 * sections. The entire form's state, including the current step, user inputs, and
 * validation status, is managed globally by a Zustand store.
 *
 * ### State Management
 * - **Zustand (`product_upload_store`)**: This component is a major consumer of the product upload store.
 * It uses custom hooks (`useCurrentStep`, `useIsLoading`, etc.) to get the current state
 * and dynamically render the appropriate UI. It does not manage any form data locally.
 *
 * ### Dynamic Step Rendering
 * - The component uses the `currentStep` from the Zustand store as an index to select
 * and render the correct form section component from the `sectionComponents` array.
 *
 * @returns {JSX.Element} The main layout for the product upload flow.
 * @see {@link ProductUploadSideBar}
 * @see {@link FormNavigation}
 * @see {@link https://docs.pmnd.rs/zustand/getting-started/introduction | Zustand Documentation}
 */
export default function ProductUploadPage() {
  const currentStep = useCurrentStep();
  const isLoading = useIsLoading();
  const CurrentComponent = sectionComponents[currentStep];

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start p-4 text-black">
      {/* Main container with responsive direction and width */}
      <div className="flex flex-col md:flex-row w-full max-w-6xl gap-4 md:gap-8">
        
        {/* Sidebar: Full width on mobile, fixed on desktop */}
        {currentStep !== 0 && (
          <div className="w-full md:w-64 lg:w-72 flex-shrink-0">
            <div className="border border-gray-200 bg-white rounded-lg p-4 md:p-6">
              <ProductUploadSideBar />
            </div>
          </div>
        )}

        {/* Main content: Takes remaining space */}
        <div className="flex-1 overflow-auto">
          <div className="w-full bg-white rounded-lg p-4 sm:p-6 md:p-8">
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <>
                <CurrentComponent />
                {currentStep !== 0 && <FormNavigation />}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * A sub-component that renders the navigation buttons for the multi-step form.
 *
 * This component is responsible for the "Previous", "Next", "Save Draft", and "Upload" actions.
 * Its state is entirely driven by the `product_upload_store`, ensuring that buttons are
 * correctly enabled, disabled, or hidden based on the current step and its validation status.
 *
 * ### State-Driven UI
 * - The "Next" and "Upload" buttons are disabled until the current step's validation
 * criteria are met, which is determined by the `stepValidations` state in the store.
 * - The "Previous" button is hidden on the first step.
 * - The "Next" button changes to an "Upload" button on the final step.
 *
 * @returns {JSX.Element} A set of navigation and action buttons for the form.
 */
function FormNavigation() {
  // --- State from Zustand Store ---
  const currentStep = useCurrentStep();
  const { setCurrentStep, submitForm, saveDraft } = useFormActions();
  const totalSteps = sectionComponents.length;
  // An object that holds the validation status (true/false) for each step.
  const stepValidations = useStepValidations();
  // Check if the current step is valid to enable/disable the 'Next'/'Upload' button.
  const isCurrentStepValid = stepValidations[currentStep] === true;

  return (
    // Responsive flex container for navigation buttons
    <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 pt-6 border-t border-gray-200">
      
      {/* Previous Button */}
      <div className="w-full sm:w-auto">
        {currentStep > 1 && (
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Previous
          </button>
        )}
      </div>

      {/* Spacer to push buttons to edges on desktop */}
      <div className="hidden sm:block sm:flex-grow"></div>

      {/* Save Draft and Next/Submit Buttons */}
      <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4">
        <button
          onClick={() => saveDraft()}
          className="w-full sm:w-auto px-4 py-2 rounded-md bg-amber-600 text-white hover:bg-amber-700 transition-colors text-sm font-medium"
        >
          Save Draft
        </button>

        {currentStep < totalSteps - 1 ? (
          <button
            disabled={!isCurrentStepValid}
            onClick={() => setCurrentStep(currentStep + 1)}
            className={`w-full sm:w-auto px-4 py-2 rounded-md transition-colors text-sm font-medium ${
              isCurrentStepValid
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Next
          </button>
        ) : (
          <button
            disabled={!isCurrentStepValid}
            onClick={submitForm}
            className={`w-full sm:w-auto px-4 py-2 text-white rounded-md transition-colors text-sm font-medium ${
              isCurrentStepValid
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Upload
          </button>
        )}
      </div>
    </div>
  );
}

