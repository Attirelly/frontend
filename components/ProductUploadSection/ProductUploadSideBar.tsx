"use client";

import { useCurrentStep, useFormActions } from "@/store/product_upload_store";

const sections = [
  {
    id: 0,
    title: "Brand and seller info",
    description: "Provide who's selling and where it ships from",
    stepName: "Brand and seller info"
  },
  {
    id: 1,
    title: "Category & Subcategory",
    description: "Enter your product's categories",
    desc: "Select the Category",
  },
  {
    id: 2,
    title: "Product basics",
    description: "Enter your product's core attributes",
    stepName: "Brand and seller info"
  },
  {
    id: 3,
    title: "Pricing and availability",
    description: "Set how much it costs and when it's sold",
    stepName: "Pricing and availability"
  },
  {
    id: 4,
    title: "Variants and inventory",
    description: "Define every version and its stock",
    stepName: "Variants and inventory"
  },
  {
    id: 5,
    title: "Media assets",
    description: "Showcase your product visually",
    stepName: "Media and assets"
  }
];

export default function ProductUploadSideBar() {
  const currentStep = useCurrentStep();
  const { setCurrentStep } = useFormActions();

  return (
    <div className="w-full max-w-xs bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-6">List your products</h2>
      
      <div className="space-y-4">
        {sections.map((section) => (
          <div 
            key={section.id}
            onClick={() => setCurrentStep(section.id)}
            className={`p-4 rounded-lg cursor-pointer transition-colors ${
              currentStep === section.id 
                ? "bg-blue-50 border border-blue-200" 
                : "hover:bg-gray-50 border border-transparent"
            }`}
          >
            <h3 className="font-medium text-gray-900">{section.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{section.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}