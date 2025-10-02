"use client";

import { type FC, useEffect, useRef, useState } from "react";
import { api } from "@/lib/axios";
import { useSellerStore } from "@/store/sellerStore";
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

export default function SizeChartPage() {
  const { storeId } = useSellerStore();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFileName, setSelectedFileName] = useState("");

  // Category selection
  const [category, setCategory] = useState("");
  const [sub1, setSub1] = useState("");
  const [sub2, setSub2] = useState("");
  const [sub3, setSub3] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  // Upload + Preview
  const [isUploading, setIsUploading] = useState(false);
  const [sizeChartUrl, setSizeChartUrl] = useState<string>(""); // Saved S3 url

  /**
   * Fetch categories (hierarchy)
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
   * Fetch existing size chart for this store + category
   */
  useEffect(() => {
    const fetchSizeChart = async () => {
      if (!storeId) return;
      const categoryId = sub3 || sub2 || sub1 || category;
      if (!categoryId) return;

      try {
        const res = await api.get(`/size_charts/${storeId}/${categoryId}`);
        if (res.data?.image_url) {
          setSizeChartUrl(res.data.image_url);
        } else {
          setSizeChartUrl("");
        }
      } catch {
        setSizeChartUrl("");
      }
    };

    fetchSizeChart();
  }, [storeId, category, sub1, sub2, sub3]);

  const handleBrowseClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
    }
  };

  /**
   * Upload image -> S3 -> Save entry
   */
  const handleImageUpload = async () => {
    if (!fileInputRef.current?.files?.[0]) {
      toast.error("Please select a file");
      return;
    }

    const file = fileInputRef.current.files[0];
    const categoryId = sub3 || sub2 || sub1 || category;

    try {
      setIsUploading(true);

      // 1️⃣ Get presigned URL
      const presignedRes = await api.post("/s3/presigned-url", {
        file_name: file.name,
        file_type: file.type,
      });

      const { upload_url, file_url } = presignedRes.data;

      // 2️⃣ Upload file to S3
      await fetch(upload_url, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      // 3️⃣ Save size chart entry in backend
      const payload = {
        store_id: storeId,
        category_id: categoryId,
        image_url: file_url,
      };

      await api.post("/size_charts/", payload);

      toast.success("Size chart uploaded successfully!");
      setSelectedFileName("");
      if (fileInputRef.current) fileInputRef.current.value = "";

      // ✅ Update preview
      setSizeChartUrl(file_url);
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload size chart");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-3xl mx-auto p-4 sm:p-0 overflow-hidden text-black">
      {/* Section: Category Selection */}
      <Section
        title="Select Category"
        subtitle="Choose category for the size chart"
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
            options={categories.filter((cat) => cat.parent_id === category)}
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
      </Section>

      {/* Section: Upload + Preview */}
      {(sub3 || sub2 || sub1 || category) && (
        <Section
          title="Upload / Preview Size Chart"
          subtitle="Upload a size chart or view the existing one"
        >
          {/* Preview */}
          {sizeChartUrl && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Existing Size Chart:</p>
              <img
                src={sizeChartUrl}
                alt="Size Chart Preview"
                className="max-h-72 border rounded-lg shadow"
              />
            </div>
          )}

          {/* Upload controls */}
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
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>

          <div className="text-center mt-6">
            <button
              onClick={handleImageUpload}
              disabled={isUploading || !selectedFileName}
              className="bg-blue-600 text-white px-6 py-2 rounded cursor-pointer hover:bg-blue-700 hover:shadow-md active:scale-[0.98] transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {isUploading ? "Uploading..." : "Upload Size Chart"}
            </button>
          </div>
        </Section>
      )}
    </div>
  );
}

/**
 * Reusable dropdown component
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
      className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
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
 * Section wrapper
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
