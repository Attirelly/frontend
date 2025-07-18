"use client";

import { useCurrentStep, useFormActions, useStepValidations } from "@/store/product_upload_store";
import { CheckCircle, AlertCircle } from "lucide-react";

const sections = [
  {
    id: 1,
    title: "Brand and seller info",
    description: "Provide who's selling and where it ships from",
  },
  {
    id: 2,
    title: "Category & Subcategory",
    description: "Enter your product's categories",
  },
  {
    id: 3,
    title: "Product basics",
    description: "Enter your product's core attributes",
  },
  {
    id: 4,
    title: "Pricing and availability",
    description: "Set how much it costs and when it's sold",
  },
  {
    id: 5,
    title: "Variants and inventory",
    description: "Define every version and its stock",
  },
  {
    id: 6,
    title: "Media assets",
    description: "Showcase your product visually",
  }
];

export default function ProductUploadSideBar() {
  const currentStep = useCurrentStep();
  const { setCurrentStep } = useFormActions();
  const stepValidations = useStepValidations();

  return (
    <div className="w-full max-w-xs max-h-[500px] bg-white p-4 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-6">List your products</h2>

      <div className="space-y-[2px]">
        {sections.map((section) => {
          const isValid = stepValidations?.[section.id];

          return (
            <div
              key={section.id}
              onClick={() => setCurrentStep(section.id)}
              className={`p-4 rounded-lg cursor-pointer transition-colors flex justify-between items-center
                ${
                  currentStep === section.id
                    ? "bg-blue-50 border border-blue-200"
                    : "hover:bg-gray-50 border border-transparent"
                }
              `}
            >
              <h3 className="font-medium text-gray-900">{section.title}</h3>

              {isValid === true && <CheckCircle className="w-4 h-4 text-green-500 ml-2" />}
              {isValid === false && <AlertCircle className="w-4 h-4 text-red-500 ml-2" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
