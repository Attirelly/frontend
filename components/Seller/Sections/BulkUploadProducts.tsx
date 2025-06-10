import { type FC, useRef, useState } from "react";
import { api } from "@/lib/axios";
import { useSellerStore } from "@/store/sellerStore";

export default function BulkUploadPage() {
  const { storeId, socialLinksData, businessDetailsData } = useSellerStore();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const shopify_url = socialLinksData?.websiteUrl || "";
  const storeName = businessDetailsData?.brandName || "";

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
    }
  };

  const handleCreateProducts = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("store_id", storeId || "");
    formData.append("brand_id", "37cdb2a5-4bd1-43e1-8af3-b001648b5da3");

    try {
      const response = await api.post("/products/bulk_product_upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Upload successful:", response.data);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleSyncShopify = async () => {

    try {
      console.log("Syncing Shopify products...");
      const response = await api.post("/products/sync_with_shopify", null, {
        params: {
          base_url: shopify_url,
          store_id: storeId,
          store_name: storeName,
          brand_id : "37cdb2a5-4bd1-43e1-8af3-b001648b5da3",
        }
      });

    } catch (error) {
      console.error("Syncing Failed:", error);
    }



  };

  return (
    <div className="space-y-6 w-3xl mx-auto overflow-hidden">
      {/* Section 1: Upload CSV */}
      <Section title="Upload CSV" subtitle="Upload your product list as a CSV file">
        <div className="flex gap-4">
          <input
            type="text"
            readOnly
            value={selectedFileName}
            placeholder="No file selected"
            className="flex-1 border border-gray-300 rounded px-3 py-2"
          />
          <button
            onClick={handleBrowseClick}
            className="bg-gray-800 text-white px-4 py-2 rounded"
          >
            Browse
          </button>
          <input
            type="file"
            accept=".xlsx, .csv"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>

        <div className="text-center mt-6">
          <button
            onClick={handleCreateProducts}
            className="bg-blue-600 text-white px-6 py-2 rounded"
          >
            Create Products
          </button>
        </div>
      </Section>

      {/* Section 2: Sync Shopify Products */}
      {shopify_url && (
        <Section title="Sync Shopify Products" subtitle="Sync products from your connected Shopify store">
          <label className="text-sm font-medium block mb-1">Shopify URL</label>
          <input
            type="text"
            disabled
            placeholder={shopify_url}
            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
          />
          <div className="text-center mt-6">
            <button
              onClick={handleSyncShopify}
              className="bg-green-600 text-white px-6 py-2 rounded"
            >
              Sync Products
            </button>
          </div>
        </Section>
      )}

    </div>
  );
}

const Section: FC<{ title: string; subtitle: string; children: React.ReactNode }> = ({
  title,
  subtitle,
  children,
}) => (
  <div className="p-6 space-y-4 rounded-2xl shadow-sm bg-white">
    <h2 className="text-lg font-semibold mb-1">{title}</h2>
    <p className="text-sm text-gray-500 mb-4">{subtitle}</p>
    <div className="-mx-6 border-t border-gray-300"></div>
    {children}
  </div>
);

