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
  useFormData,
  useIsLoading,
  useStepValidations,
} from "@/store/product_upload_store";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Blank from "@/components/ProductUploadSection/Blank";
import { useEffect } from "react";

const sectionComponents = [
  Blank,
  BrandAndSeller,
  CategorySelector,
  ProductAttributes,
  PricingAndAvailability,
  VariantAndInventory,
  MediaAssets,
];

export default function ProductUploadPage() {
  const currentStep = useCurrentStep();
  const isLoading = useIsLoading();
  const CurrentComponent = sectionComponents[currentStep];
  const { loadDraft, setLoading } = useFormActions();
  useEffect(() => {
    async function loadDraftData() {
      await loadDraft();
    }
    try {
      setLoading(true);
      loadDraftData();
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start px-4">
      <div className="flex w-full max-w-4xl gap-4">
        {/* Sidebar */}
        <div className="min-w-[240px] max-w-sm border-gray-200 p-6 overflow-y-auto">
          {/* <h2 className="text-xl font-bold mb-4">Product Upload</h2> */}
          {/* <DraftControls /> */}
          <ProductUploadSideBar />
        </div>

        {/* Main content */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <>
                <CurrentComponent />
                <FormNavigation />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FormNavigation() {
  const currentStep = useCurrentStep();
  const { setCurrentStep, submitForm } = useFormActions();
  const totalSteps = sectionComponents.length;
  const stepValidations = useStepValidations();
  const isCurrentStepValid = stepValidations[currentStep] === true;
  const { saveDraft } = useFormActions();
   return (
    <div className="flex flex-wrap justify-between gap-4 mt-8 pt-6 border-t border-gray-200">
      {/* Previous Button - left aligned */}
      <div className="order-1">
        {currentStep > 0 && (
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Previous
          </button>
        )}
      </div>

      {/* Save Draft Button - center aligned */}
      <div className="order-2 mx-auto md:mx-0">
        <button
          onClick={() => saveDraft()}
          className="px-4 py-2 rounded-md bg-amber-600 text-white hover:bg-amber-700"
        >
          Save Draft
        </button>
      </div>

      {/* Next/Submit Button - right aligned */}
      <div className="order-3 w-full md:w-auto">
        {currentStep < totalSteps - 1 ? (
          <button
            disabled={!isCurrentStepValid}
            onClick={() => setCurrentStep(currentStep + 1)}
            className={`w-full md:w-auto px-4 py-2 rounded-md ${
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
            className={`w-full md:w-auto px-4 py-2 text-white rounded-md ${
              isCurrentStepValid
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Submit Product
          </button>
        )}
      </div>
    </div>
  );

}
