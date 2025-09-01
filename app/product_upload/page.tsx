// "use client";
// import BrandAndSeller from "@/components/ProductUploadSection/BrandAndSeller";
// import ProductAttributes from "@/components/ProductUploadSection/ProductAttributes";
// import CategorySelector from "@/components/ProductUploadSection/CategorySelector";
// import PricingAndAvailability from "@/components/ProductUploadSection/PricingAndAvailability";
// import VariantAndInventory from "@/components/ProductUploadSection/VariantAndInventory";
// import MediaAssets from "@/components/ProductUploadSection/MediaAssets";
// import ProductUploadSideBar from "@/components/ProductUploadSection/ProductUploadSideBar";
// import {
//   useCurrentStep,
//   useFormActions,
//   useIsLoading,
//   useStepValidations,
// } from "@/store/product_upload_store";
// import LoadingSpinner from "@/components/ui/LoadingSpinner";
// import Blank from "@/components/ProductUploadSection/Blank";
// import { useEffect } from "react";

// const sectionComponents = [
//   Blank,
//   CategorySelector,
//   ProductAttributes,
//   BrandAndSeller,
//   PricingAndAvailability,
//   VariantAndInventory,
//   MediaAssets,
// ];

// export default function ProductUploadPage() {
//   const currentStep = useCurrentStep();
//   const isLoading = useIsLoading();
//   const CurrentComponent = sectionComponents[currentStep];
//   const { loadDraft, setLoading } = useFormActions();
//   // useEffect(() => {
//   //   async function loadDraftData() {
//   //     await loadDraft();
//   //   }
//   //   try {
//   //     setLoading(true);
//   //     loadDraftData();
//   //     setLoading(false);
//   //   } catch (error) {
//   //     setLoading(false);
//   //   }
//   // }, []);


//   return (
//     <div className="min-h-screen bg-gray-50 flex justify-center items-start px-4 text-black">
//       <div className="flex w-full max-w-4xl gap-4">
//         {/* Sidebar */}
//         {currentStep !== 0 && (
//           <div className="min-w-[240px] max-w-sm border-gray-200 p-6 overflow-y-auto">
//             {/* <h2 className="text-xl font-bold mb-4">Product Upload</h2> */}
//             {/* <DraftControls /> */}
//             <ProductUploadSideBar />
//           </div>
//         )}


//         {/* Main content */}
//         <div className="flex-1 p-6 overflow-auto">
//           <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
//             {isLoading ? (
//               <LoadingSpinner />
//             ) : (
//               <>
//                 <CurrentComponent />
//                 {currentStep !== 0 && (
//                   <FormNavigation />
//                 )}

//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function FormNavigation() {
//   const currentStep = useCurrentStep();
//   const { setCurrentStep, submitForm } = useFormActions();
//   const totalSteps = sectionComponents.length;
//   const stepValidations = useStepValidations();
//   const isCurrentStepValid = stepValidations[currentStep] === true;
//   const { saveDraft } = useFormActions();
//   return (
//     <div className="flex flex-wrap justify-between gap-4 mt-8 pt-6 border-t border-gray-200">
//       {/* Previous Button - left aligned */}
//       <div className="order-1">
//         {currentStep > 0 && (
//           <button
//             onClick={() => setCurrentStep(currentStep - 1)}
//             className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
//           >
//             Previous
//           </button>
//         )}
//       </div>

//       {/* Save Draft Button - center aligned */}
//       <div className="order-2 mx-auto md:mx-0">
//         <button
//           onClick={() => saveDraft()}
//           className="px-4 py-2 rounded-md bg-amber-600 text-white hover:bg-amber-700"
//         >
//           Save Draft
//         </button>
//       </div>

//       {/* Next/Submit Button - right aligned */}
//       <div className="order-3 w-full md:w-auto">
//         {currentStep < totalSteps - 1 ? (
//           <button
//             disabled={!isCurrentStepValid}
//             onClick={() => setCurrentStep(currentStep + 1)}
//             className={`w-full md:w-auto px-4 py-2 rounded-md ${isCurrentStepValid
//               ? "bg-indigo-600 text-white hover:bg-indigo-700"
//               : "bg-gray-300 text-gray-500 cursor-not-allowed"
//               }`}
//           >
//             Next
//           </button>
//         ) : (
//           <button
//             disabled={!isCurrentStepValid}
//             onClick={submitForm}
//             className={`w-full md:w-auto px-4 py-2 text-white rounded-md ${isCurrentStepValid
//               ? "bg-green-600 hover:bg-green-700"
//               : "bg-gray-300 text-gray-500 cursor-not-allowed"
//               }`}
//           >
//             Upload
//           </button>
//         )}
//       </div>
//     </div>
//   );

// }


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
import { useEffect } from "react";

const sectionComponents = [
  Blank,
  CategorySelector,
  ProductAttributes,
  BrandAndSeller,
  PricingAndAvailability,
  VariantAndInventory,
  MediaAssets,
];

export default function ProductUploadPage() {
  const currentStep = useCurrentStep();
  const isLoading = useIsLoading();
  const CurrentComponent = sectionComponents[currentStep];
  const { loadDraft, setLoading } = useFormActions();

  // useEffect(() => {
  //   async function loadDraftData() {
  //     await loadDraft();
  //   }
  //   try {
  //     setLoading(true);
  //     loadDraftData();
  //     setLoading(false);
  //   } catch (error) {
  //     setLoading(false);
  //   }
  // }, [loadDraft, setLoading]);

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

function FormNavigation() {
  const currentStep = useCurrentStep();
  const { setCurrentStep, submitForm, saveDraft } = useFormActions();
  const totalSteps = sectionComponents.length;
  const stepValidations = useStepValidations();
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

