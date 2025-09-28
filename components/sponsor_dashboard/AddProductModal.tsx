"use client";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import customStyles from "@/utils/selectStyles"; // Assuming these are your custom react-select styles
import { Product } from "@/types/ProductTypes";

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  campaignId: string;
  onAdd: (product: any) => void;
}

// A simple spinner component for loading states
const Spinner = () => (
  <svg
    className="animate-spin h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

export default function AddProductModal({
  open,
  onClose,
  campaignId,
  onAdd,
}: AddProductModalProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [bidAmount, setBidAmount] = useState("");
  // --- UX IMPROVEMENT: Add loading states ---
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await api.get("/products/");
        setProducts(res.data);
      } catch (err: any) {
        console.error(err);
        toast.error("Failed to fetch products");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [open]);

  const productOptions = products.map((product) => ({
    label: product.title,
    product_id: product.product_id,
    store_id: product.store_id,
    image:
      product.images.length > 0
        ? product.images[0].image_url
        : "https://placehold.co/40x40", // A better placeholder
  }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProduct || !bidAmount) {
      toast.error("Please select a product and enter a valid bid amount.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        campaign_id: campaignId,
        product_id: selectedProduct.product_id,
        seller_id: selectedProduct.store_id,
        bid_amount: parseFloat(bidAmount),
        budget: parseFloat(10000), // Note: Budget is currently hardcoded
      };

      // The API expects a list, so we wrap our single object in an array.
      const res = await api.post(`/sponsored/campaign_products/`, [payload]);

      toast.success("Product added to campaign!");
      onAdd(res.data); // Assuming the API returns the newly added product(s)

      // Reset form and close
      setSelectedProduct(null);
      setBidAmount("");
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error adding product");
    } finally {
      setIsSubmitting(false);
    }
  }

  // UX IMPROVEMENT: Determine if form is valid to control button state
  const isFormValid = selectedProduct && bidAmount && parseFloat(bidAmount) > 0;

  if (!open) return null;

  return (
    // --- UI IMPROVEMENT: Centered modal with a backdrop ---
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 transition-opacity duration-300"
      onClick={onClose} // Close modal on backdrop click
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-lg flex flex-col transform transition-all"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Add Product to Campaign
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1 rounded-full"
          >
            {/* A clearer SVG close icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label
              htmlFor="product-select"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select Product
            </label>
            <Select
              inputId="product-select"
              className="w-full text-black"
              styles={customStyles}
              options={productOptions}
              value={selectedProduct}
              onChange={(option) => setSelectedProduct(option)}
              isClearable
              // --- UX IMPROVEMENT: Loading and empty states ---
              isLoading={isLoading}
              noOptionsMessage={() =>
                isLoading ? "Loading products..." : "No products found"
              }
              formatOptionLabel={(option: any) => (
                <div className="flex items-center gap-3">
                  <img
                    src={option.image}
                    alt={option.label}
                    className="w-10 h-10 object-cover rounded-md"
                  />
                  <span className="font-medium text-sm text-gray-900">
                    {option.label}
                  </span>
                </div>
              )}
            />
          </div>

          <div>
            <label
              htmlFor="bid-amount"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Bid Amount (₹)
            </label>
            <input
              id="bid-amount"
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              // --- UX IMPROVEMENT: Better input constraints ---
              min="0.01"
              step="0.01"
              className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800"
              placeholder="e.g., 50.00"
              required
            />
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 border border-gray-300 bg-white rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            // --- UX IMPROVEMENT: Disable button when form is invalid or submitting ---
            disabled={!isFormValid || isSubmitting}
            className="px-5 py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center w-32 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Spinner /> : "Add Product"}
          </button>
        </div>
      </div>
    </div>
  );
}