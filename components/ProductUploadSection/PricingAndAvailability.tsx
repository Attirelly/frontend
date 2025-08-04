"use client";

import { useEffect, useState } from "react";
import { useCurrentStep, useFormActions, useFormData } from "@/store/product_upload_store";
import clsx from "clsx";

export default function PricingAndAvailability() {
  // Get form data from Zustand store
  const { pricing } = useFormData();
  const { updateFormData, setStepValidation } = useFormActions();
    const currentStep = useCurrentStep();

  // Initialize state with stored values or defaults
  const [mrp, setMRP] = useState(pricing?.mrp );
  const [rent, setRent] = useState<boolean>(pricing?.rent || false);
  const [price, setStoreListPrice] = useState(pricing?.price);
  const [discount, setDiscount] = useState(pricing?.discount);

  const [showPriceError, setShowPriceError] = useState(false);
  const [shakePrice, setShakePrice] = useState(false);


   useEffect(() => {
    const isValid =
      !!pricing?.mrp &&
      !!pricing?.price;

    setStepValidation(currentStep, isValid);
  }, [ pricing, currentStep]);

  // Save to Zustand store when values change
  useEffect(() => {
    updateFormData("pricing", {
      mrp,
      rent,
      price,
      discount
    });
  }, [mrp, rent, price, discount,  updateFormData]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? undefined : Number(e.target.value);
    if (value === undefined || (mrp !== undefined && value <= mrp)) {
      setStoreListPrice(value);
      setShowPriceError(false);
    } else {
      // Show error and trigger shake animation
      setShowPriceError(true);
      setShakePrice(true);
      setTimeout(() => setShakePrice(false), 500); // Reset shake after animation
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white  rounded-lg self-start">
      <h1 className="text-lg font-bold mb-2">Pricing</h1>
      <p className="text-gray-600 mb-6 border-b border-gray-200">
        {/* Set how much it costs and when it's sold */}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Column 1 */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">MRP</label>
            <div className="flex w-full border border-gray-300 rounded-md overflow-hidden">
            <span className="bg-gray-100 px-3 py-2 text-gray-500 select-none border-r border-gray-300">
                Rs
              </span>
            <input
              type="number"
              value={mrp ?? ""}
              onChange={(e) => setMRP(e.target.value === "" ? undefined : Number(e.target.value))}
              className="w-full  p-2"
              placeholder="1000"
            />
            </div>
          </div>

          {/* <div>
            <label className="block text-sm font-medium mb-1">
              Available for rent?
            </label>
            <div className="flex gap-4 mt-2 align-center">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="rent"
                  value="yes"
                  checked={rent}
                  onChange={() => setRent(true)}
                />
                Yes
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="rent"
                  value="no"
                  checked={!rent}
                  onChange={() => setRent(false)}
                />
                No
              </label>
            </div>
          </div> */}
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
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
            <span className="bg-gray-100 px-3 py-2 text-gray-500 select-none border-r border-gray-300">
                Rs
              </span>
            <input
              type="number"
              value={price ?? ""}
              onChange={handlePriceChange}
              className={`w-full p-2 disabled:cursor-not-allowed disabled:bg-gray-100`}
              placeholder="1000"
              disabled={mrp === undefined}
            />
          </div>
          </div>
          {showPriceError && (
            <p className="text-sm text-red-500">
              Listing price cannot be greater than MRP.
            </p>
          )}
        </div>
        
        {/* Column 3 */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Discount
            </label>
            <div className="flex w-[50%] border border-gray-300 rounded-md overflow-hidden">
            
            <input
              type="number"
              value={mrp && price ? Math.round(((mrp - price) / mrp) * 100) : ""}
              onChange={(e) => setDiscount(e.target.value === "" ? undefined : Number(e.target.value))}
              className="w-full p-2 disabled:cursor-not-allowed"
              disabled
              placeholder="100"
            />
            <span className="bg-gray-100 px-3 py-2 text-gray-500 select-none border-r border-gray-300">
                %
            </span>
          </div>
          </div>
        </div>

        
      </div>
      <style jsx>{`
        @keyframes shake {
          0% {
            transform: translateX(0px);
          }
          25% {
            transform: translateX(-4px);
          }
          50% {
            transform: translateX(4px);
          }
          75% {
            transform: translateX(-4px);
          }
          100% {
            transform: translateX(0px);
          }
        }

        .animate-shake {
          animation: shake 0.3s;
        }
      `}</style>
    </div>
  );
}
