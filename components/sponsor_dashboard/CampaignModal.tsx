"use client";
import React, { useEffect, useState, useCallback } from "react";
import AddProductModal from "./AddProductModal";
import { api } from "@/lib/axios"; // Assuming you use a shared axios instance
import { toast } from "sonner"; // Assuming you use sonner for notifications

// --- Type Definitions for Clarity ---
interface CampaignProduct {
  product_id: string;
  bid_amount: number;
  // Add other properties if they exist
}

interface Campaign {
  campaign_id: string;
  name: string;
  status: "active" | "paused" | "archived";
  impressions?: number;
  clicks?: number;
  spent?: number;
}

// --- UI/UX IMPROVEMENT: Redesigned KPIBox with Status Indicator ---
export function KPIBox({ label, value, status }: { label: string; value: string | number; status?: string }) {
  const statusColor = status === "active" ? "bg-green-500" : status === "paused" ? "bg-yellow-500" : "bg-gray-400";

  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-left">
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <div className="flex items-center gap-2">
        {status && <span className={`w-2.5 h-2.5 rounded-full ${statusColor}`}></span>}
        <p className="text-xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

// --- UI/UX IMPROVEMENT: Skeleton Loader for a better loading experience ---
function ProductTableSkeleton() {
  return (
    <div className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-50 text-gray-600">
        <div className="flex px-4 py-3">
          <div className="flex-1 text-left font-medium">Product ID</div>
          <div className="w-32 text-left font-medium">Bid Amount</div>
          <div className="w-20 text-left font-medium">Actions</div>
        </div>
      </div>
      <div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center px-4 py-3 border-t border-gray-200 animate-pulse">
            <div className="flex-1 h-4 bg-gray-200 rounded"></div>
            <div className="w-32 ml-4 h-4 bg-gray-200 rounded"></div>
            <div className="w-20 ml-4 h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}


export default function CampaignModal({ open, campaign, onClose }: { open: boolean; campaign: Campaign | null; onClose: () => void; }) {
  const [openAddProduct, setOpenAddProduct] = useState(false);
  const [products, setProducts] = useState<CampaignProduct[]>([]);
  // --- UX IMPROVEMENT: Add loading and error states ---
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    if (!campaign) return;
    setIsLoading(true);
    setError(null);
    try {
      // Assuming API calls are made through your 'api' instance
      const res = await api.get(`/sponsored/campaigns/${campaign.campaign_id}/products`);
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError("Could not load products. Please try again.");
      toast.error("Failed to fetch campaign products.");
    } finally {
      setIsLoading(false);
    }
  }, [campaign]);

  useEffect(() => {
    if (open && campaign) {
      fetchProducts();
    }
  }, [open, campaign, fetchProducts]);

  function handleProductAdded(newProduct: any) {
    // Optimistically add the product to the list
    // The response from adding a product might be a list or a single object
    const addedProducts = Array.isArray(newProduct) ? newProduct : [newProduct];
    setProducts((prev) => [...prev, ...addedProducts]);
  }

  async function handleRemoveProduct(productId: string) {
    // --- UX IMPROVEMENT: Add confirmation before destructive action ---
    if (!window.confirm("Are you sure you want to remove this product from the campaign?")) {
      return;
    }

    try {
      await api.delete(`/sponsored/campaigns/${campaign.campaign_id}/products/${productId}`);
      setProducts(products.filter((p) => p.product_id !== productId));
      toast.success("Product removed successfully.");
    } catch (err) {
      console.error("Failed to remove product:", err);
      toast.error("Could not remove product. Please try again.");
    }
  }

  const renderContent = () => {
    if (isLoading) {
      return <ProductTableSkeleton />;
    }
    if (error) {
      return (
        <div className="text-center py-10 px-4 border border-dashed rounded-lg">
          <p className="text-sm text-red-600 mb-3">{error}</p>
          <button onClick={fetchProducts} className="px-4 py-2 bg-gray-800 text-white rounded-md text-sm hover:bg-gray-700">
            Retry
          </button>
        </div>
      );
    }
    if (products.length === 0) {
      return (
        // --- UI/UX IMPROVEMENT: More engaging empty state ---
        <div className="text-center py-10 px-4 border-2 border-dashed border-gray-200 rounded-lg">
           <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No Products in Campaign</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding a product to sponsor.</p>
        </div>
      );
    }
    return (
      // --- UI/UX IMPROVEMENT: Enhanced table design ---
      <div className="w-full border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Product ID</th>
              <th className="px-4 py-3 text-left font-medium">Bid Amount</th>
              <th className="px-4 py-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((p) => (
              <tr key={p.product_id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-gray-700">{p.product_id}</td>
                <td className="px-4 py-3 text-gray-900">₹{p.bid_amount}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleRemoveProduct(p.product_id)} className="text-red-600 hover:text-red-800 font-medium text-sm flex items-center gap-1">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (!open || !campaign) return null;

  return (
    <div className="w-full h-full bg-opacity-50 flex flex-col items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Campaign Details</p>
              <h2 className="text-2xl font-bold text-gray-900 mt-1">{campaign.name}</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-8">
          {/* Campaign KPIs */}
          <section>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <KPIBox label="Status" value={campaign.status} status={campaign.status} />
               <KPIBox label="Impressions" value={campaign.impressions?.toLocaleString() || "0"} />
               <KPIBox label="Clicks" value={campaign.clicks?.toLocaleString() || "0"} />
               <KPIBox label="Spent" value={`₹${campaign.spent?.toFixed(2) || "0.00"}`} />
             </div>
          </section>

          {/* Products Section */}
          <section>
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Sponsored Products</h3>
              <button onClick={() => setOpenAddProduct(true)} className="px-4 py-2 bg-gray-800 text-white rounded-md text-sm font-medium hover:bg-gray-700 flex items-center gap-2 transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                Add Product
              </button>
            </div>
            {renderContent()}
          </section>
        </div>
      </div>

      {/* Add Product Modal (rendered conditionally but kept in the DOM for state) */}
      <div className=" w-full max-w-4xl mt-4">
      {campaign && (
        <AddProductModal
          open={openAddProduct}
          onClose={() => setOpenAddProduct(false)}
          campaignId={campaign.campaign_id}
          onAdd={handleProductAdded}
        />
      )}
      </div>
    </div>
  );
}