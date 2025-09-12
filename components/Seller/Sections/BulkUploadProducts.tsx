"use client";

import { type FC, useEffect, useRef, useState } from "react";
import { api } from "@/lib/axios";
import { useSellerStore } from "@/store/sellerStore";
import ProductsPage from "./ViewAllProducts";
import { toast } from "sonner";

/**
 * @interface Category
 * @description Defines the structure for a single category item.
 */
interface Category {
  category_id: string;
  name: string;
  parent_id: string | null;
  children: Category[];
  level?: number;
}

/**

 * A page component that provides multiple methods for sellers to upload products in bulk.
 *
 * This component offers three main functionalities:
 * 1.  **Template Download**: Users can select a specific four-level category to download a pre-formatted Excel template, ensuring their data matches the required schema.
 * 2.  **CSV/Excel Upload**: Users can upload the completed template file to create multiple products at once.
 * 3.  **Shopify Sync**: If the seller has connected their Shopify store, they can trigger a sync to import products directly.
 *
 * After an upload or sync, the component displays the results of the batch job using the `ProductsPage` component.
 *
 * ### State Management
 * - **Local State (`useState`, `useRef`)**: Manages the UI, including category selections, the name of the selected file for upload, and loading states for API calls.
 * - **Global State (`useSellerStore`)**: It reads the `storeId`, `socialLinksData`, and `businessDetailsData` from the global Zustand store to perform API requests. After a successful upload or sync, it updates the global `batch_id` to trigger the results view.
 *
 * ### API Endpoints
 * **`GET /categories/`**: Fetches the entire category tree for the dropdowns.
 * **`GET /products/template/:fileName`**: Gets a presigned URL to download the specified Excel template.
 * **`POST /products/bulk_product_upload`**: Uploads a product data file (CSV/Excel) for batch processing.
 * **`POST /products/sync_with_shopify`**: Initiates a background job to sync products from a Shopify store.
 *
 * @returns {JSX.Element} The bulk upload interface.
 * @see {@link ProductsPage}
 * @see {@link https://docs.pmnd.rs/zustand/getting-started/introduction | Zustand Documentation}
 * @see {@link https://sonner.emilkowal.ski/ | Sonner (Toast Notifications)}
 */
export default function BulkUploadPage() {
  const { storeId, socialLinksData, businessDetailsData } = useSellerStore();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFileName, setSelectedFileName] = useState("");

  // Get Shopify URL and store name from global state for the sync feature.
  const shopify_url = socialLinksData?.websiteUrl || "";
  const storeName = businessDetailsData?.brandName || "";
  const { batch_id, setBatchId } = useSellerStore();

  // State for the cascading category selection dropdowns.
  const [category, setCategory] = useState("");
  const [sub1, setSub1] = useState("");
  const [sub2, setSub2] = useState("");
  const [sub3, setSub3] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  const [isUploading, setIsUploading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  /**
   * This effect fetches the entire category hierarchy from the API when the component mounts.
   */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories/");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);
  /**
   * Constructs the expected template file name based on category selections.
   * NOTE: This is currently hardcoded in the download handler but can be made dynamic.
   */
  const getTemplateFileName = () => {
    return `${category}-${sub1}-${sub2}-${sub3}.xlsx`;
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setSelectedFileName(file.name);
  };

  const handleCreateProducts = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      toast.warning("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("store_id", storeId || "");
    formData.append("brand_id", process.env.NEXT_PUBLIC_BRAND_ID || "");

    try {
      setIsUploading(true);
      toast.info("Uploading product CSV...");
      const response = await api.post(
        "/products/bulk_product_upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (response.data) {
        setBatchId(response.data);
        toast.success("Products uploaded successfully.");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Product upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Handles the request to sync products from a connected Shopify store.
   */
  const handleSyncShopify = async () => {
    try {
      setIsSyncing(true);
      toast.info("Product syncing from Shopify in progress...");
      const response = await api.post("/products/sync_with_shopify", null, {
        params: {
          base_url: shopify_url,
          store_id: storeId,
          store_name: storeName,
          brand_id: process.env.NEXT_PUBLIC_BRAND_ID || "",
        },
      });
      if (response.data) {
        setBatchId(response.data);
        toast.success("Shopify products synced successfully.");
      }
    } catch (error) {
      console.error("Syncing Failed:", error);
      toast.error("Shopify sync failed.");
    } finally {
      setIsSyncing(false);
    }
  };

  /**
   * Handles the download of the category-specific Excel template.
   */
  const handleTemplateDownload = async () => {
    try {
      const fileName = getTemplateFileName();

      const response = await api.get(`/products/template/${fileName}`);
      const { url } = response.data;

      // Trigger download
      window.location.href = url;
    } catch (error) {
      console.error("Failed to download file:", error);
      toast.error("Could not download the file. Please try again later.");
    }
  };

  return (
    <div className="space-y-6 w-full max-w-3xl mx-auto p-4 sm:p-0 overflow-hidden text-black">
      {/* Section: Category Selection + Download */}
      <Section
        title="Select Category & Download Format"
        subtitle="Choose category and download format-specific Excel file"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Category */}
          <SelectField
            label="Category"
            value={category}
            onChange={(val) => {
              setCategory(val);
              setSub1("");
              setSub2("");
              setSub3("");
            }}
            options={categories.filter((cat) => cat.parent_id === null)}
          />

          {/* Subcategory 1 */}
          <SelectField
            label="Subcategory 1"
            value={sub1}
            onChange={(val) => {
              setSub1(val);
              setSub2("");
              setSub3("");
            }}
            disabled={!category}
            options={categories.filter(
              (cat) =>
                cat.parent_id === category &&
                cat.name.toLowerCase() === "ethnic wear"
            )}
          />

          {/* Subcategory 2 */}
          <SelectField
            label="Subcategory 2"
            value={sub2}
            onChange={(val) => {
              setSub2(val);
              setSub3("");
            }}
            disabled={!sub1}
            options={categories.filter((cat) => cat.parent_id === sub1)}
          />

          {/* Subcategory 3 */}
          <SelectField
            label="Subcategory 3"
            value={sub3}
            onChange={(val) => setSub3(val)}
            disabled={!sub2}
            options={categories.filter((cat) => cat.parent_id === sub2)}
          />
        </div>
        {/* The download button is only shown after a full 4-level category is selected. */}
        {sub3 && (
          <div className="mt-6">
            <button
              onClick={handleTemplateDownload}
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
            >
              Download Format
            </button>
          </div>
        )}
      </Section>

      {/* Section: Upload CSV */}
      <Section
        title="Upload CSV"
        subtitle="Upload your product list as a CSV file"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            readOnly
            value={selectedFileName}
            placeholder="No file selected"
            className="flex-1 border border-gray-300 rounded px-3 py-2"
          />
          <button
            onClick={handleBrowseClick}
            className="bg-gray-700 text-white px-6 py-2 rounded cursor-pointer hover:bg-gray-800 hover:shadow-md active:scale-[0.98] transition-all duration-200"
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
            disabled={isUploading || !selectedFileName}
            className="bg-blue-600 text-white px-6 py-2 rounded cursor-pointer hover:bg-blue-700 hover:shadow-md active:scale-[0.98] transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {isUploading ? "Uploading..." : "Upload Products"}
          </button>
        </div>
      </Section>

      {/* Section 3: Sync Shopify - only shown if a Shopify URL is available in the store. */}
      {shopify_url && (
        <Section
          title="Sync Shopify Products"
          subtitle="Sync products from your connected Shopify store"
        >
          <label className="text-sm font-medium block mb-1">Shopify URL</label>
          <input
            type="text"
            disabled
            value={shopify_url}
            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
          />
          <div className="text-center mt-6">
            <button
              onClick={handleSyncShopify}
              disabled={isSyncing}
              className="bg-green-600 text-white px-6 py-2 rounded cursor-pointer hover:bg-green-700 hover:shadow-md active:scale-[0.98] transition-all duration-200 text-sm sm:text-base"
            >
              {isSyncing ? "Syncing..." : "Sync Products"}
            </button>
          </div>
        </Section>
      )}

      {/* Products Viewer */}
      {batch_id && (
        <div className="mt-8">
          <ProductsPage batchId={batch_id} />
        </div>
      )}
    </div>
  );
}

/**
 * A reusable, styled select field (dropdown) component for the category selection form.
 * @param {object} props - The props for the component.
 * @param {string} props.label - The text label displayed above the select field.
 * @param {string} props.value - The currently selected value.
 * @param {(val: string) => void} props.onChange - The callback function to execute when the selection changes.
 * @param {Category[]} props.options - The array of category options to display in the dropdown.
 * @param {boolean} [props.disabled=false] - Whether the select field should be disabled.
 */
const SelectField: FC<{
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: Category[];
  disabled?: boolean;
}> = ({ label, value, onChange, options, disabled }) => (
  <div>
    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full border border-gray-300 scrollbar-thin rounded-lg px-4 py-2 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
    >
      <option value="">{`Select ${label}`}</option>
      {options.map((opt) => (
        <option key={opt.category_id} value={opt.category_id}>
          {opt.name}
        </option>
      ))}
    </select>
  </div>
);

/**
 * A reusable wrapper component for creating visually distinct sections with a title and subtitle.
 * @param {object} props - The props for the component.
 * @param {string} props.title - The main heading for the section.
 * @param {string} props.subtitle - The descriptive text below the main heading.
 * @param {React.ReactNode} props.children - The content to be rendered inside the section.
 */
const Section: FC<{
  title: string;
  subtitle: string;
  children: React.ReactNode;
}> = ({ title, subtitle, children }) => (
  <div className="p-4 sm:p-6 space-y-4 rounded-2xl shadow-sm bg-white">
    <h2 className="text-base sm:text-lg font-semibold mb-1">{title}</h2>
    <p className="text-xs sm:text-sm text-gray-500 mb-4">{subtitle}</p>
    <div className="-mx-4 sm:-mx-6 border-t border-gray-300"></div>
    {children}
  </div>
);
