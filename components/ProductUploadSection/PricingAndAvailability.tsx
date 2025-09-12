"use client";

import { useEffect, useState } from "react";
import { useCurrentStep, useFormActions, useFormData } from "@/store/product_upload_store";
import clsx from "clsx";

/**
 * A component for capturing the pricing details for a product, including MRP and listing price.
 *
 * This component is a step in the product upload form. It provides fields for the user to enter
 * the Maximum Retail Price (MRP) and the final Listing Price. It includes client-side validation
 * to ensure the listing price does not exceed the MRP and automatically calculates the resulting discount.
 *
 * ### State Management
 * - **Local State (`useState`)**: Manages the values of the input fields (`mrp`, `price`) directly. It also controls UI feedback states like `showPriceError` and `shakePrice` for validation.
 * - **Global State (`product_upload_store`)**: It initializes its state from the `pricing` object in the global store. It continuously syncs its local state back to the store using the `updateFormData` action in a `useEffect` hook. It also updates the step's validation status via `setStepValidation`.
 *
 * ### Validation and UI Feedback
 * - The component validates that the `price` is not greater than the `mrp`.
 * - If validation fails, an error message is displayed, and the input field triggers a "shake" animation to draw the user's attention to the error.
 * - The step is only considered valid for proceeding if both MRP and Listing Price are filled out correctly.
 *
 * @returns {JSX.Element} A form section for entering product pricing information.
 * @see {@link https://docs.pmnd.rs/zustand/getting-started/introduction | Zustand Documentation}
 * @see {@link https://github.com/lukeed/clsx | clsx Documentation}
 */
export default function PricingAndAvailability() {
  const { pricing } = useFormData();
  const { updateFormData, setStepValidation } = useFormActions();
  const currentStep = useCurrentStep();

  const [mrp, setMRP] = useState(pricing?.mrp);
  const [rent, setRent] = useState<boolean>(pricing?.rent || false);
  const [price, setStoreListPrice] = useState(pricing?.price);
  const [discount, setDiscount] = useState(pricing?.discount);

  const [showPriceError, setShowPriceError] = useState(false);
  const [shakePrice, setShakePrice] = useState(false);

  useEffect(() => {
    const isValid = !!pricing?.mrp && !!pricing?.price;
    setStepValidation(currentStep, isValid);
  }, [pricing, currentStep, setStepValidation]);

  useEffect(() => {
    updateFormData("pricing", {
      mrp,
      rent,
      price,
      discount
    });
  }, [mrp, rent, price, discount, updateFormData]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? undefined : Number(e.target.value);
    if (value === undefined || (mrp !== undefined && value <= mrp)) {
      setStoreListPrice(value);
      setShowPriceError(false);
    } else {
      setShowPriceError(true);
      setShakePrice(true);
      setTimeout(() => setShakePrice(false), 500);
    }
  };

  return (
    // Removed max-width and mx-auto to let the parent container control the layout.
    <div className="bg-white rounded-lg self-start">
      <h1 className="text-base sm:text-lg font-bold mb-2">Pricing</h1>
      <p className="text-xs sm:text-sm text-gray-600 mb-6 pb-4 border-b border-gray-200">
        Set how much it costs and when it's sold
      </p>

      {/* Grid now adapts from 1 to 3 columns for better spacing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* MRP */}
        <div>
          <label className="block text-xs sm:text-sm font-medium mb-1">MRP</label>
          <div className="flex w-full border border-gray-300 rounded-md overflow-hidden">
            <span className="bg-gray-100 px-3 py-2 text-gray-500 select-none border-r border-gray-300 text-sm">
              Rs
            </span>
            <input
              type="number"
              value={mrp ?? ""}
              onChange={(e) => setMRP(e.target.value === "" ? undefined : Number(e.target.value))}
              className="w-full p-2 text-sm"
              placeholder="1000"
            />
          </div>
        </div>

        {/* Listing Price */}
        <div>
          <label className="block text-xs sm:text-sm font-medium mb-1">
            Listing Price
          </label>
          <div
            className={clsx(
              "flex w-full border rounded-md overflow-hidden transition-all duration-150",
              {
                "border-red-500": showPriceError,
                "animate-shake": shakePrice,
                "border-gray-300": !showPriceError,
              }
            )}
          >
            <span className="bg-gray-100 px-3 py-2 text-gray-500 select-none border-r border-gray-300 text-sm">
              Rs
            </span>
            <input
              type="number"
              value={price ?? ""}
              onChange={handlePriceChange}
              className={`w-full p-2 disabled:cursor-not-allowed disabled:bg-gray-100 text-sm`}
              placeholder="900"
              disabled={mrp === undefined}
            />
          </div>
          {showPriceError && (
            <p className="text-xs sm:text-sm text-red-500 mt-1">
              Listing price cannot be greater than MRP.
            </p>
          )}
        </div>

        {/* Discount */}
        <div>
          <label className="block text-xs sm:text-sm font-medium mb-1">
            Discount
          </label>
          <div className="flex w-full border border-gray-300 rounded-md overflow-hidden">
            <input
              type="number"
              value={mrp && price ? Math.round(((mrp - price) / mrp) * 100) : ""}
              readOnly
              className="w-full p-2 bg-gray-50 cursor-not-allowed text-sm"
              placeholder="10"
            />
            <span className="bg-gray-100 px-3 py-2 text-gray-500 select-none text-sm">
              %
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          50% { transform: translateX(4px); }
          75% { transform: translateX(-4px); }
        }
        .animate-shake {
          animation: shake 0.3s;
        }
      `}</style>
    </div>
  );
}
