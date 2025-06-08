"use client";
import BrandAndSeller from "@/components/ProductUploadSection/BrandAndSeller";
import ProductAttributes from "@/components/ProductUploadSection/ProductAttributes";
import CategorySelector from "@/components/ProductUploadSection/CategorySelector";
import PricingAndAvailability from "@/components/ProductUploadSection/PricingAndAvailability";
import VariantAndInventory from "@/components/ProductUploadSection/VariantAndInventory";
import MediaAssets from "@/components/ProductUploadSection/MediaAssets";
import ProductUploadSideBar from "@/components/ProductUploadSection/ProductUploadSideBar";
import Blank from "@/components/ProductUploadSection/Blank";
import {
  useCurrentStep,
  useFormActions,
  useFormData,
  useIsLoading,
  useStepValidations,
} from "@/store/product_upload_store";
import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { api } from "@/lib/axios";
import { convertToFormData } from "@/utils/convert";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const sectionComponents = [
  BrandAndSeller,
  CategorySelector,
  ProductAttributes,
  PricingAndAvailability,
  VariantAndInventory,
  MediaAssets,
];

export default function ProductUpdatePage() {
  const params = useParams();
  const { variants, sizes, colors } = useFormData();
  const isLoading = useIsLoading();
  const product_id = params.product_id;
  const { updateFormData, setLoading } = useFormActions();
  const currentStep = useCurrentStep();
  const CurrentComponent = sectionComponents[currentStep];

  useEffect(() => {
    async function fetchAndPrefill() {
      if (product_id) {
        try {
          setLoading(true);
          const res = await api.get(`/products/${product_id}`);
          const product = res.data;
          console.log("Fetched product data:", product);
          const formData = convertToFormData(product);
          console.log("Fetched product data after conversion :", formData);
          updateFormData("product_id", product_id);
          updateFormData("keyDetails", formData.keyDetails);
          updateFormData("category", formData.category);
          updateFormData("attributes", formData.attributes);
          updateFormData("pricing", formData.pricing);
          updateFormData("variants", formData.variants);
          updateFormData("media", formData.media);
          setLoading(false);
        } catch (error) {
          console.error("Failed to fetch product for editing", error);
          setLoading(false);
        }
      }
    }
    fetchAndPrefill();
  }, [product_id, setLoading, updateFormData]);

  console.log(variants, sizes, colors);

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start px-4">
      <div className="flex w-full max-w-4xl gap-4">
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
  const { setCurrentStep, updateForm } = useFormActions();
  const totalSteps = sectionComponents.length;
  const stepValidations = useStepValidations();
  const isCurrentStepValid = stepValidations[currentStep] === true;

  return (
    <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
      {currentStep > 0 && (
        <button
          onClick={() => setCurrentStep(currentStep - 1)}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Previous
        </button>
      )}
      {currentStep < totalSteps - 1 ? (
        <button
          disabled={!isCurrentStepValid}
          onClick={() => setCurrentStep(currentStep + 1)}
          className={`ml-auto px-4 py-2 rounded-md ${
            isCurrentStepValid
              ? "bg-indigo-600 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      ) : (
        <button
          disabled={!isCurrentStepValid}
          onClick={updateForm}
          className={`ml-auto px-4 py-2  text-white rounded-md ${
            isCurrentStepValid
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Update Product
        </button>
      )}
    </div>
  );
}
