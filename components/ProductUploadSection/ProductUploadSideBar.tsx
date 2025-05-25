// "use clients";

// const sections = [
 
//   {
//     id: "key_details",
//     title: "Key Details",
//     desc: "Key details",
//   },
//   {
//     id: "category_and_subcategory",
//     title: "Category & Subcategory",
//     desc: "Select the Category",
//   },
//   {
//     id: "attributes",
//     title: "Attributes",
//     desc: "Choose the Attribute",
//   },
//   {
//     id: "variants_and_inventory",
//     title: "Variants & Inventory",
//     desc: "Variant details",
//   },
//   {
//     id: "pricing_and_availability",
//     title: "Pricing & Availability",
//     desc: "Pricing and availability",
//   },
//   {
//     id: "media_and_assets",
//     title: "Media & Assets",
//     desc: "Upload products photo.",
//   },
// ];

// export default function ProductUploadSideBar({
//   selected,
//   onSelect,
// }: {
//   selected: string;
//   onSelect: (id: string) => void;
// }) {
//   return (
//     <div className="shadow bg-white p-4 rounded-2xl w-full max-w-sm self-start">
//       <h2 className="text-lg font-semibold mb-4">Complete your profile</h2>
//       {sections.map((section) => (
//         <div
//           key={section.id}
//           onClick={() => onSelect(section.id)}
//           className={`flex items-start gap-4 p-4 mb-2 cursor-pointer rounded-2xl border transition 
//             ${
//               selected === section.id
//                 ? "border-black bg-gray-100"
//                 : "border-gray-300 hover:bg-gray-50"
//             }`}
//         >
//           <div className="flex flex-col">
//             <h3 className="font-medium text-md">{section.title}</h3>
//             <p className="text-sm text-gray-500">{section.desc}</p>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// components/ProductUploadSection/ProductUploadSideBar.tsx
"use client";

import { useCurrentStep, useFormActions } from "@/store/product_upload_store";

const sectionOrder = [
  "key_details",
  "category_and_subcategory",
  "attributes",
  "pricing_and_availability",
  "variants_and_inventory",
  "media_and_assets",
];

export default function ProductUploadSideBar() {
  const currentStep = useCurrentStep();
  const { setCurrentStep } = useFormActions();

  return (
    <div className="w-full">
      <h3 className="text-sm font-medium text-gray-500 mb-4">SECTIONS</h3>
      <ul className="space-y-2">
        <li>
          <button
            onClick={() => setCurrentStep(0)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm ${
              currentStep === 0 ? 'bg-gray-100 font-medium' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Brand and seller info
          </button>
        </li>
        <li>
          <button
            onClick={() => setCurrentStep(2)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm ${
              currentStep === 2 ? 'bg-gray-100 font-medium' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Category and sub-category
          </button>
        </li>
        <li>
          <button
            onClick={() => setCurrentStep(1)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm ${
              currentStep === 1 ? 'bg-gray-100 font-medium' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Attributes
          </button>
        </li>
        <li>
          <button
            onClick={() => setCurrentStep(3)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm ${
              currentStep === 3 ? 'bg-gray-100 font-medium' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Pricing and availability
          </button>
        </li>
        <li>
          <button
            onClick={() => setCurrentStep(4)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm ${
              currentStep === 4 ? 'bg-gray-100 font-medium' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Variant and inventory
          </button>
        </li>
        <li>
          <button
            onClick={() => setCurrentStep(5)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm ${
              currentStep === 5 ? 'bg-gray-100 font-medium' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Media and assets
          </button>
        </li>
      </ul>
    </div>
  );
}