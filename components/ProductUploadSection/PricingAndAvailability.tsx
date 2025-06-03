"use client";

import { useEffect, useState } from "react";
import { useCurrentStep, useFormActions, useFormData } from "@/store/product_upload_store";

export default function PricingAndAvailability() {
  // Get form data from Zustand store
  const { pricing } = useFormData();
  const { updateFormData, setStepValidation } = useFormActions();
    const currentStep = useCurrentStep();

  // Initialize state with stored values or defaults
  const [mrp, setMRP] = useState(pricing?.mrp );
  const [rent, setRent] = useState<boolean>(pricing?.rent || false);
  const [price, setStoreListPrice] = useState(pricing?.price);


   useEffect(() => {
    const isValid =
      !!pricing?.mrp &&
      !!pricing?.price ;

    setStepValidation(currentStep, isValid);
  }, [ pricing, currentStep]);

  // Save to Zustand store when values change
  useEffect(() => {
    updateFormData("pricing", {
      mrp,
      rent,
      price
    });
  }, [mrp, rent, price, updateFormData]);

  return (
    <div className="max-w-4xl mx-auto bg-white  rounded-lg self-start">
      <h1 className="text-lg font-bold mb-2">Pricing and availability</h1>
      <p className="text-gray-600 mb-6">
        Set how much it costs and when it's sold
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Column 1 */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">MRP</label>
            <input
              type="number"
              value={mrp}
              onChange={(e) => setMRP((e.target.value))}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="e.g., 1000 , 2000 "
            />
          </div>

          <div>
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
          </div>
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Listing Price
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setStoreListPrice(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="e.g.,1000"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
