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
import { useParams} from "next/navigation";
import { api } from "@/lib/axios";
import { convertToFormData } from "@/utils/convert";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useSellerStore } from "@/store/sellerStore";

const sectionComponents = [
  Blank,
  BrandAndSeller,
  CategorySelector,
  ProductAttributes,
  PricingAndAvailability,
  VariantAndInventory,
  MediaAssets,
];

/**
 * The main page component for editing an existing product via a multi-step form.
 *
 * This component orchestrates the product update process. Its primary responsibility on mount
 * is to fetch the complete data for an existing product (identified by the `product_id` in the URL),
 * transform that data into the structure expected by the global form state, and pre-fill the
 * entire multi-step form. It then dynamically renders the appropriate form section based on the
 * current step.
 *
 * ### State Management
 * - This component is a major producer for the **`product_upload_store`** and **`sellerStore`**. On load, it populates these Zustand stores with the fetched product data.
 * - It consumes state from the `product_upload_store` (e.g., `useCurrentStep`, `useIsLoading`) to control the UI.
 *
 * ### Data Fetching & Prefilling
 * - An `useEffect` hook triggers on mount to fetch data from the `/products/:product_id` endpoint.
 * - A utility function, `convertToFormData`, is used to map the flat API response to the nested structure of the Zustand store's `formData`.
 * - The component then calls multiple `updateFormData` actions to populate each slice of the store.
 *
 * ### API Endpoint
 * **`GET /products/:product_id`**
 * This endpoint is called once on component mount to fetch all data for the product being edited.
 * - **`:product_id`** (string): The unique ID of the product from the URL.
 * - **Returns**: A complete product object with all its details and variants.
 *
 * @returns {JSX.Element} The main layout for the product update flow.
 * @see {@link ProductUploadSideBar}
 * @see {@link FormNavigation}
 * @see {@link https://nextjs.org/docs/app/api-reference/functions/use-params | Next.js useParams}
 * @see {@link https://docs.pmnd.rs/zustand/getting-started/introduction | Zustand Documentation}
 */

export default function ProductUpdatePage() {
  const {setStoreId, setStoreNameString} = useSellerStore();
  const params = useParams();
  const isLoading = useIsLoading();
  const product_id = params.product_id;
  const { updateFormData, setLoading,setCurrentStep } = useFormActions();
  const currentStep = useCurrentStep();
  const CurrentComponent = sectionComponents[currentStep];

  /**
   * This effect is the core of the update page. It runs on mount to fetch the existing
   * product data and use it to pre-fill the entire form's state in the Zustand store.
   */
  useEffect(() => {
    async function fetchAndPrefill() {
      if (product_id) {
        try {
          setLoading(true);
          const res = await api.get(`/products/${product_id}`);
          const product = res.data;
          
          setStoreId(product.store_id); // Set the store ID from the product data
          setStoreNameString(product.store_name);
          
          const formData = convertToFormData(product);
          
          updateFormData("product_id", product_id);
          updateFormData("keyDetails", formData.keyDetails);
          updateFormData("category", formData.category);
          updateFormData("attributes", formData.attributes);
          updateFormData("pricing", formData.pricing);
          updateFormData("variants", formData.variants);
          updateFormData("media", formData.media);
          const searchParams = new URLSearchParams(window.location.search);
        const stepParam = searchParams.get('step');
        const requestedStep = stepParam ? parseInt(stepParam, 10) : 1;
        const safeStep = Math.min(Math.max(requestedStep, 0), sectionComponents.length - 1);
        setCurrentStep(safeStep);
          setLoading(false);
        } catch (error) {
          console.error("Failed to fetch product for editing", error);
          setLoading(false);
        }
      }
    }
    fetchAndPrefill();
  }, [product_id, setLoading, updateFormData, setStoreId, setStoreNameString, setCurrentStep]);



  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start p-4 text-black">
      {/* Main container with responsive direction and width */}
      <div className="flex flex-col md:flex-row w-full max-w-6xl gap-4 md:gap-8">
        
        {/* Sidebar: Full width on mobile, fixed on desktop */}
        {currentStep !== 0 && (
          <div className="w-full md:w-64 lg:w-72 flex-shrink-0">
            <div className="border border-gray-200 bg-white rounded-lg shadow-sm p-4 md:p-6">
              <ProductUploadSideBar />
            </div>
          </div>
        )}

        {/* Main content: Takes remaining space */}
        <div className="flex-1 overflow-auto">
          <div className="w-full bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8">
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
 * This component's state is entirely driven by the `product_upload_store`. For the update page,
 * its final action is to call `updateForm` instead of `submitForm`.
 *
 * @returns {JSX.Element} A set of navigation and action buttons for the form.
 */
function FormNavigation() {
  const currentStep = useCurrentStep();
  const { setCurrentStep, updateForm } = useFormActions();
  const totalSteps = sectionComponents.length;
  const stepValidations = useStepValidations();
  const isCurrentStepValid = stepValidations[currentStep] === true;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-200">
      <div>
        {currentStep > 1 && (
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Previous
          </button>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4">
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
            onClick={updateForm}
            className={`w-full sm:w-auto px-4 py-2 text-white rounded-md transition-colors text-sm font-medium ${
              isCurrentStepValid
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Update Product
          </button>
        )}
      </div>
    </div>
  );
}

