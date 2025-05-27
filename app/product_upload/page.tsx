// "use client";
// import BrandAndSeller from "@/components/ProductUploadSection/BrandAndSeller";
// import CategorySelector from "@/components/ProductUploadSection/CategorySelector";
// import MediaAssets from "@/components/ProductUploadSection/MediaAssets";
// import PricingAndAvailability from "@/components/ProductUploadSection/PricingAndAvailability";
// import ProductAttributes from "@/components/ProductUploadSection/ProductAttributes";
// import ProductUploadSideBar from "@/components/ProductUploadSection/ProductUploadSideBar";
// import VariantAndInventory from "@/components/ProductUploadSection/VariantAndInventory";
// import { useState } from "react";

// export default function ProductUploadPage() {
//   const sectionOrder = [
//     "key_details",
//     "category_and_subcategory",
//     "attributes",
//     "pricing_and_availability",
//     "variants_and_inventory",
//     "media_and_assets",
//   ];
//   const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
//   const activeSection = sectionOrder[currentSectionIndex];

//   const renderSection = () => {
//     switch (activeSection) {
//       case "key_details":
//         return <BrandAndSeller />;
//       case "attributes":
//         return <ProductAttributes />;
//       case "category_and_subcategory":
//         return <CategorySelector />;
//       case "pricing_and_availability":
//         return <PricingAndAvailability />;
//       case "variants_and_inventory":
//         return <VariantAndInventory />;
//       case "media_and_assets":
//         return <MediaAssets />;
//       default:
//         return null;
//     }
//   };

//   const handleSidebarSelect = (key: string) => {
//     const index = sectionOrder.indexOf(key);
//     if (index !== -1) setCurrentSectionIndex(index);
//   };

//   const goToNextSection = () => {
//     if (currentSectionIndex < sectionOrder.length - 1) {
//       setCurrentSectionIndex(currentSectionIndex + 1);
//     }
//   };

//   const goToPreviousSection = () => {
//     if (currentSectionIndex > 0) {
//       setCurrentSectionIndex(currentSectionIndex - 1);
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Expanded sidebar with better proportions */}
//       <div className="w-[380px] min-w-[280px] bg-white border-r border-gray-200 p-5 sticky top-0 h-screen overflow-y-auto">
//         <h2 className="text-xl font-bold mb-6 text-gray-800">Product Upload</h2>
//         <ProductUploadSideBar
//           selected={activeSection}
//           onSelect={handleSidebarSelect}
//         />
//       </div>

//       {/* Main content area with improved spacing */}
//       <div className="flex-1 p-6 overflow-auto">
//         <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-sm p-8">
//           {/* Enhanced section header */}
//           <div className="mb-8">
//             <div className="flex items-center justify-between">
//               <h3 className="text-xl font-semibold text-gray-800 capitalize">
//                 {activeSection.replace(/_/g, ' ')}
//               </h3>
//               <span className="text-sm text-gray-500">
//                 Step {currentSectionIndex + 1} of {sectionOrder.length}
//               </span>
//             </div>
//             <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
//               <div 
//                 className="bg-indigo-600 h-2 rounded-full" 
//                 style={{
//                   width: `${((currentSectionIndex + 1) / sectionOrder.length) * 100}%`
//                 }}
//               ></div>
//             </div>
//           </div>

//           {/* Section content with proper spacing */}
//           <div className="mb-10">
//             {renderSection()}
//           </div>

//           {/* Navigation buttons with better sizing */}
//           <div className="flex justify-between pt-6 border-t border-gray-200">
//             {currentSectionIndex > 0 && (
//               <button
//                 onClick={goToPreviousSection}
//                 className="px-5 py-2.5 text-sm font-medium border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//               >
//                 ← Previous
//               </button>
//             )}
//             <div className="ml-auto flex gap-3">
//               {currentSectionIndex < sectionOrder.length - 1 ? (
//                 <button
//                   onClick={goToNextSection}
//                   className="px-5 py-2.5 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
//                 >
//                   Next →
//                 </button>
//               ) : (
//                 <button
//                   onClick={() => console.log("Submit product")}
//                   className="px-5 py-2.5 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//                 >
//                   Submit Product
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// app/product-upload/page.tsx
"use client";

import BrandAndSeller from '@/components/ProductUploadSection/BrandAndSeller';
import ProductAttributes from '@/components/ProductUploadSection/ProductAttributes';
import CategorySelector from '@/components/ProductUploadSection/CategorySelector';
import PricingAndAvailability from '@/components/ProductUploadSection/PricingAndAvailability';
import VariantAndInventory from '@/components/ProductUploadSection/VariantAndInventory';
import MediaAssets from '@/components/ProductUploadSection/MediaAssets';
import ProductUploadSideBar from '@/components/ProductUploadSection/ProductUploadSideBar';
import { useCurrentStep, useFormActions } from '@/store/product_upload_store';
import DraftControls from '@/components/ProductUploadSection/DraftControls';

const sectionComponents = [
  BrandAndSeller,
  CategorySelector,
  ProductAttributes,
  PricingAndAvailability,
  VariantAndInventory,
  MediaAssets
];

export default function ProductUploadPage() {
  const currentStep = useCurrentStep();
  const { setCurrentStep } = useFormActions();
  const CurrentComponent = sectionComponents[currentStep];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-[25%] bg-white border-r border-gray-200 p-4 sticky top-0 h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Product Upload</h2>
        <DraftControls />
        <ProductUploadSideBar />
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
          <CurrentComponent />
          <FormNavigation />
        </div>
      </div>
    </div>
  );
}

function FormNavigation() {
  const currentStep = useCurrentStep();
  const { setCurrentStep, submitForm } = useFormActions();
  const totalSteps = sectionComponents.length;

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
          onClick={() => setCurrentStep(currentStep + 1)}
          className="ml-auto px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Next
        </button>
      ) : (
        <button
          onClick={submitForm}
          className="ml-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Submit Product
        </button>
      )}
    </div>
  );
}