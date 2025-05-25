'use client';

import { useEffect, useState } from 'react';
import { useFormActions, useFormData } from '@/store/product_upload_store';

export default function PricingAndAvailability() {
  // Get form data from Zustand store
  const { pricing } = useFormData();
  const { updateFormData } = useFormActions();

  // Initialize state with stored values or defaults
  const [MRP, setMRP] = useState(pricing?.MRP || 0);
  const [rent, setRent] = useState<'yes' | 'no'>(pricing?.rent || 'yes');
  const [storeListPrice, setStoreListPrice] = useState(pricing?.storeListPrice || 0);
  const [status, setStatus] = useState(pricing?.status || '');

  // Save to Zustand store when values change
  useEffect(() => {
    updateFormData('pricing', {
      MRP,
      rent,
      storeListPrice,
      status
    });
  }, [MRP, rent, storeListPrice, status, updateFormData]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg self-start">
      <h1 className="text-2xl font-bold mb-2">Pricing and availability</h1>
      <p className="text-gray-600 mb-6">Set how much it costs and when it's sold</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Column 1 */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">MRP</label>
            <input
              type="number"
              value={MRP}
              onChange={(e) => setMRP(Number(e.target.value)||0)}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="e.g., 1000 , 2000 "
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Available for rent?</label>
            <div className="flex gap-4 mt-2 align-center">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="rent"
                  value="yes"
                  checked={rent === 'yes'}
                  onChange={() => setRent('yes')}
                />
                Yes
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="rent"
                  value="no"
                  checked={rent === 'no'}
                  onChange={() => setRent('no')}
                />
                No
              </label>
            </div>
          </div>
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Store Listing Price</label>
            <input
              type="number"
              value={storeListPrice}
              onChange={(e) => setStoreListPrice(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="e.g.,1000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <input
              type="text"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="e.g., 100"
            />
          </div>
        </div>
      </div>
    </div>
  );
}