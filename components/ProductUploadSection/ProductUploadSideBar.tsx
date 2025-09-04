// "use client";

// import { useCurrentStep, useFormActions, useStepValidations } from "@/store/product_upload_store";
// import { CheckCircle, AlertCircle } from "lucide-react";

// const sections = [
//   {
//     id: 1,
//     title: "Category & Subcategory",
//     description: "Enter your product's categories",
//   },
//   {
//     id: 2,
//     title: "Attributes",
//     description: "Enter your product's core attributes",
//   },
//    {
//     id: 3,
//     title: "Product info",
//     // description: "Provide who's selling and where it ships from",
//   },
//   {
//     id: 4,
//     title: "Pricing",
//     description: "Set how much it costs and when it's sold",
//   },
//   {
//     id: 5,
//     title: "Variants",
//     description: "Define every version and its stock",
//   },
//   {
//     id: 6,
//     title: "Media assets",
//     description: "Showcase your product visually",
//   }
// ];

// export default function ProductUploadSideBar() {
//   const currentStep = useCurrentStep();
//   const { setCurrentStep } = useFormActions();
//   const stepValidations = useStepValidations();

//   return (
//     <div className="w-full max-w-xs max-h-[500px] bg-white p-4 rounded-lg shadow-sm">
//       <h2 className="text-lg font-semibold mb-6">List your products</h2>

//       <div className="space-y-[2px]">
//         {sections.map((section) => {
//           const isValid = stepValidations?.[section.id];

//           return (
//             <div
//               key={section.id}
//               onClick={() => setCurrentStep(section.id)}
//               className={`p-4 rounded-lg cursor-pointer transition-colors flex justify-between items-center
//                 ${
//                   currentStep === section.id
//                     ? "bg-blue-50 border border-blue-200"
//                     : "hover:bg-gray-50 border border-transparent"
//                 }
//               `}
//             >
//               <h3 className="font-medium text-gray-900">{section.title}</h3>

//               {isValid === true && <CheckCircle className="w-4 h-4 text-green-500 ml-2" />}
//               {isValid === false && <AlertCircle className="w-4 h-4 text-red-500 ml-2" />}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

"use client";

import { useCurrentStep, useFormActions, useStepValidations } from "@/store/product_upload_store";
import { CheckCircle, AlertCircle } from "lucide-react";
import { useRef, useLayoutEffect } from "react";

const sections = [
    {
        id: 1,
        title: "Category", // Shortened for mobile
        fullTitle: "Category & Subcategory",
        description: "Enter your product's categories",
    },
    {
        id: 2,
        title: "Attributes",
        fullTitle: "Attributes",
        description: "Enter your product's core attributes",
    },
    {
        id: 3,
        title: "Product Info",
        fullTitle: "Product info",
    },
    {
        id: 4,
        title: "Pricing",
        fullTitle: "Pricing",
        description: "Set how much it costs and when it's sold",
    },
    {
        id: 5,
        title: "Variants",
        fullTitle: "Variants",
        description: "Define every version and its stock",
    },
    {
        id: 6,
        title: "Media", // Shortened for mobile
        fullTitle: "Media assets",
        description: "Showcase your product visually",
    }
];

// --- Extracted DesktopSidebar Component ---
const DesktopSidebar = ({ currentStep, setCurrentStep, stepValidations }) => (
    <div className="w-full bg-white p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-6">List your products</h2>
        <div className="space-y-1">
            {sections.map((section) => {
                const isValid = stepValidations?.[section.id];
                const isActive = currentStep === section.id;
                return (
                    <div
                        key={section.id}
                        onClick={() => setCurrentStep(section.id)}
                        className={`p-4 rounded-lg cursor-pointer transition-colors flex justify-between items-center ${isActive ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50 border border-transparent"}`}
                    >
                        <h3 className="font-medium text-gray-900 text-base">{section.fullTitle}</h3>
                        {isValid === true && <CheckCircle className="w-4 h-4 text-green-500 ml-2 flex-shrink-0" />}
                        {isValid === false && <AlertCircle className="w-4 h-4 text-red-500 ml-2 flex-shrink-0" />}
                    </div>
                );
            })}
        </div>
    </div>
);

// --- Extracted MobileSidebar Component ---
const MobileSidebar = ({ currentStep, setCurrentStep, stepValidations }) => {
    const scrollContainerRef = useRef(null);

    // This effect smoothly scrolls the active button into view whenever the current step changes.
    // By extracting this component, the effect will now work reliably without being reset.
    useLayoutEffect(() => {
        if (scrollContainerRef.current) {
            const activeButton = scrollContainerRef.current.querySelector(`[data-section-id="${currentStep}"]`);
            if (activeButton) {
                activeButton.scrollIntoView({
                    behavior: 'smooth',
                    inline: 'center',
                    block: 'nearest',
                });
            }
        }
    }, [currentStep]);

    return (
        <nav className="w-full bg-white p-2 rounded-lg">
            <div
                ref={scrollContainerRef}
                className="flex flex-row items-center space-x-2 overflow-x-auto whitespace-nowrap scrollbar-none"
            >
                {sections.map((section) => {
                    const isValid = stepValidations?.[section.id];
                    const isActive = currentStep === section.id;
                    return (
                        <button
                            key={section.id}
                            data-section-id={section.id}
                            onClick={() => setCurrentStep(section.id)}
                            className={`flex items-center justify-center gap-2 p-2 rounded-lg transition min-w-[100px] ${isActive ? 'bg-blue-50' : 'bg-transparent hover:bg-gray-100'}`}
                        >
                            <span className="text-xs font-medium text-center">{section.title}</span>
                            {isValid === true && <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />}
                            {isValid === false && <AlertCircle className="w-3 h-3 text-red-500 flex-shrink-0" />}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};


// --- Main ProductUploadSideBar Component ---
export default function ProductUploadSideBar() {
    const currentStep = useCurrentStep();
    const { setCurrentStep } = useFormActions();
    const stepValidations = useStepValidations();

    return (
        <>
            {/* Mobile View */}
            <div className="block md:hidden w-full">
                <MobileSidebar
                    currentStep={currentStep}
                    setCurrentStep={setCurrentStep}
                    stepValidations={stepValidations}
                />
            </div>

            {/* Desktop View */}
            <div className="hidden md:block">
                <DesktopSidebar
                    currentStep={currentStep}
                    setCurrentStep={setCurrentStep}
                    stepValidations={stepValidations}
                />
            </div>
        </>
    );
}

