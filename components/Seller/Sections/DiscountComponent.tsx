"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/axios';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

// --- Helper Types & Interfaces ---
// Based on your backend `DiscountType` Enum
type DiscountType = "PERCENTAGE" | "FIXED_AMOUNT" | "BOGO";

// Represents a master discount template the seller can choose from.
interface DiscountTemplate {
  title: string;
  discount_type: DiscountType;
  value: number;
  min_purchase_amount?: number | null;
  description: string;
}

// Represents a discount that has been applied to a store.
interface AppliedDiscount {
  id: number;
  store_id: string;
  title: string;
  discount_type: DiscountType;
  value: number;
  min_purchase_amount?: number | null;
  description: string;
  is_active: boolean;
}

// --- Mock Data ---
// In a real application, this would be fetched from a dedicated API endpoint.
// TODO: Replace this with an API call to a new endpoint like `GET /api/v1/discounts/templates`
const MASTER_DISCOUNT_TEMPLATES: DiscountTemplate[] = [
  {
    title: "Diwali Sale",
    discount_type: "PERCENTAGE",
    value: 20,
    min_purchase_amount: 1500,
    description: "Celebrate the festival of lights with a fantastic 20% off on all orders above ₹1500."
  },
  {
    title: "Summer Bonanza",
    discount_type: "FIXED_AMOUNT",
    value: 500,
    min_purchase_amount: 2500,
    description: "Get a flat ₹500 discount on your summer collection haul when you spend ₹2500 or more."
  },
  {
    title: "End of Season Sale",
    discount_type: "PERCENTAGE",
    value: 40,
    min_purchase_amount: null,
    description: "Biggest sale of the season! Get a flat 40% off on select items. No minimum purchase required."
  },
  {
    title: "BOGO Special",
    discount_type: "BOGO",
    value: 1, // For BOGO, value usually represents the "get one" part.
    description: "Buy one, get one free on all accessories. The perfect time to stock up!"
  }
];

// --- SVG Icons for UI ---
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
);

// --- Main Component ---
interface DiscountComponentProps {
  storeId: string; 
}

export default function DiscountComponent({ storeId }: DiscountComponentProps) {
  const [appliedDiscounts, setAppliedDiscounts] = useState<AppliedDiscount[]>([]);
  const [selectedTemplateTitle, setSelectedTemplateTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedTemplate = MASTER_DISCOUNT_TEMPLATES.find(t => t.title === selectedTemplateTitle) || null;

  const fetchAppliedDiscounts = useCallback(async () => {
    if (!storeId) {
        setIsLoading(false);
        return;
    };
    setIsLoading(true);
    try {
      const response = await api.get(`/stores/${storeId}/discounts`);
      setAppliedDiscounts(response.data);
    } catch (err) {
      toast.error('Failed to fetch applied discounts.');
    } finally {
      setIsLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    fetchAppliedDiscounts();
  }, [fetchAppliedDiscounts]);

  const handleApplyDiscount = async () => {
    if (!selectedTemplate) return;
    setIsSubmitting(true);
    const toastId = toast.loading("Applying offer...");

    try {
      const payload = {
        title: selectedTemplate.title,
        discount_type: selectedTemplate.discount_type,
        value: selectedTemplate.value,
        min_purchase_amount: selectedTemplate.min_purchase_amount,
        description: selectedTemplate.description,
        is_active: true,
      };

      await api.post(`stores/${storeId}/discounts`, payload);
      
      toast.success("Offer applied successfully!", { id: toastId });
      setSelectedTemplateTitle('');
      await fetchAppliedDiscounts();

    } catch (err) {
      toast.error('Failed to apply the discount.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (discountId: number, currentStatus: boolean, in_payload: JSON) => {
    const originalDiscounts = [...appliedDiscounts];
    setAppliedDiscounts(prev => 
      prev.map(d => d.id === discountId ? { ...d, is_active: !currentStatus } : d)
    );

    try {
      const payload = { ...in_payload , is_active: !currentStatus };
      await api.put(`/discounts/${discountId}`, payload);
      toast.success(`Offer has been ${!currentStatus ? 'activated' : 'deactivated'}.`);
    } catch (err) {
      toast.error('Failed to update offer status.');
      setAppliedDiscounts(originalDiscounts); // Revert on failure
    }
  };

  const handleDeleteDiscount = async (discountId: number) => {
    if (!window.confirm("Are you sure you want to remove this offer? This action cannot be undone.")) {
      return;
    }
    const originalDiscounts = [...appliedDiscounts];
    setAppliedDiscounts(prev => prev.filter(d => d.id !== discountId));
    const toastId = toast.loading("Removing offer...");

    try {
      await api.delete(`/discounts/${discountId}`);
      toast.success("Offer removed successfully.", { id: toastId });
    } catch (err) {
      toast.error('Failed to remove the offer.', { id: toastId });
      setAppliedDiscounts(originalDiscounts); // Revert on failure
    }
  };

  if (!storeId) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 w-full max-w-4xl mx-auto text-center">
            <p className="text-gray-600">Please complete the 'Business Details' section first to manage discounts.</p>
        </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 w-full max-w-4xl mx-auto space-y-8">
      {/* Section 1: Apply New Discount */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Apply a New Offer</h2>
        <p className="text-sm text-gray-500">Select a promotional offer to apply to your store.</p>
        
        <select
          value={selectedTemplateTitle}
          onChange={(e) => setSelectedTemplateTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          disabled={isSubmitting}
        >
          <option value="">-- Choose an offer --</option>
          {MASTER_DISCOUNT_TEMPLATES.map(template => (
            <option key={template.title} value={template.title} disabled={appliedDiscounts.some(ad => ad.title === template.title)}>
              {template.title} {appliedDiscounts.some(ad => ad.title === template.title) && "(Applied)"}
            </option>
          ))}
        </select>

        {selectedTemplate && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3 transition duration-300 ease-in-out">
            <h3 className="font-semibold text-gray-700">{selectedTemplate.title}</h3>
            <p className="text-sm text-gray-600">{selectedTemplate.description}</p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
               <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">TYPE: {selectedTemplate.discount_type}</span>
               <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full">VALUE: {selectedTemplate.discount_type === 'PERCENTAGE' ? `${selectedTemplate.value}%` : `₹${selectedTemplate.value}`}</span>
               {selectedTemplate.min_purchase_amount && <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">MIN. PURCHASE: ₹{selectedTemplate.min_purchase_amount}</span>}
            </div>
            <button
              onClick={handleApplyDiscount}
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-black text-white font-semibold py-2 px-6 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {isSubmitting ? 'Applying...' : 'Apply This Offer'}
            </button>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200"></div>

      {/* Section 2: Manage Applied Discounts */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Your Active Offers</h2>
        {isLoading && <p className="text-sm text-gray-500">Loading your offers...</p>}
        
        {!isLoading && appliedDiscounts.length === 0 && (
          <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-md text-center">
            You have not applied any offers yet. Select one from the dropdown above.
          </p>
        )}

        {!isLoading && appliedDiscounts.length > 0 && (
          <div className="space-y-3">
            {appliedDiscounts.map(discount => (
              <div key={discount.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex-grow mb-3 sm:mb-0 pr-4">
                  <p className="font-semibold text-gray-800">{discount.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{discount.description}</p>
                </div>
                <div className="flex items-center space-x-3 w-full sm:w-auto justify-end flex-shrink-0">
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs font-medium ${discount.is_active ? 'text-green-700' : 'text-gray-500'}`}>
                      {discount.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <button
                      onClick={() => handleToggleActive(discount.id, discount.is_active, discount)}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${discount.is_active ? 'bg-black' : 'bg-gray-200'}`}
                      type="button"
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${discount.is_active ? 'translate-x-5' : 'translate-x-0'}`}/>
                    </button>
                  </div>
                  <button
                    onClick={() => handleDeleteDiscount(discount.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                    aria-label="Delete discount"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

