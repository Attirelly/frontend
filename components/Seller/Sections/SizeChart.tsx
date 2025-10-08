// "use client";

// import { type FC, useEffect, useRef, useState } from "react";
// import { api } from "@/lib/axios";
// import { useSellerStore } from "@/store/sellerStore";
// import { toast } from "sonner";
// import { FiTrash2 } from "react-icons/fi"; // Import the trash icon

// /**
//  * @interface Category
//  * @description Defines the structure for a single category item.
//  */
// interface Category {
//   category_id: string;
//   name: string;
//   parent_id: string | null;
//   children: Category[];
//   level?: number;
// }

// export default function SizeChartPage() {
//   const { storeId } = useSellerStore();
//   const fileInputRef = useRef<HTMLInputElement | null>(null); // Category selection state

//   const [category, setCategory] = useState("");
//   const [sub1, setSub1] = useState("");
//   const [sub2, setSub2] = useState("");
//   const [sub3, setSub3] = useState("");
//   const [categories, setCategories] = useState<Category[]>([]); // --- MODIFICATION START --- // State for upload, progress, and preview URL, similar to PhotosPage

//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [sizeChartUrl, setSizeChartUrl] = useState<string>(""); // --- MODIFICATION END ---
//   /**
//    * Fetch categories (hierarchy)
//    */

//   // Helper to delete an image from S3 using your backend API
//   async function deleteImageFromS3(imageUrl: string) {
//     try {
//       await api.delete(`/products/delete_image`, {
//         data: { file_url: imageUrl }, // Send file URL in request body
//       });
//     } catch (error) {
//       console.error("Error deleting image from S3:", error);
//     }
//   }

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await api.get("/categories/");
//         setCategories(response.data);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//         toast.error("Failed to load categories");
//       }
//     };
//     fetchCategories();
//   }, []);
//   /**
//    * Fetch existing size chart for this store + category when category changes
//    */

//   useEffect(() => {
//     const fetchSizeChart = async () => {
//       if (!storeId) return;
//       const categoryId = sub3;
//       if (!categoryId) {
//         setSizeChartUrl(""); // Clear URL if no category is selected
//         return;
//       }

//       try {
//         const res = await api.get(`/size_charts/${storeId}/${categoryId}`);
//         if (res.data?.image_url) {
//           setSizeChartUrl(res.data.image_url);
//         } else {
//           setSizeChartUrl("");
//         }
//       } catch {
//         setSizeChartUrl("");
//       }
//     };

//     fetchSizeChart();
//   }, [storeId, category, sub1, sub2, sub3]);

//   const handleBrowseClick = () => {
//     fileInputRef.current?.click();
//   };
//   /**
//    * This function now triggers the entire upload flow as soon as a file is selected.
//    * It gets a presigned URL, uploads the file with progress, and saves the record.
//    */

//   const handleFileChange = async (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     const categoryId = sub3;
//     if (!categoryId) {
//       toast.error("Please ensure a final category is selected first.");
//       return;
//     }

//     try {
//       setIsUploading(true);
//       setUploadProgress(0); // Step 1: Get a presigned URL from your backend

//       const presignedRes = await api.post("/products/upload", {
//         file_name: file.name,
//       });
//       const { upload_url, file_url } = presignedRes.data; // Step 2: Upload file to S3 using axios for progress tracking

//       await api.put(upload_url, file, {
//         headers: { "Content-Type": file.type || "application/octet-stream" },
//         onUploadProgress: (progressEvent) => {
//           if (progressEvent.total) {
//             const percentCompleted = Math.round(
//               (progressEvent.loaded * 100) / progressEvent.total
//             );
//             setUploadProgress(percentCompleted);
//           }
//         },
//       }); // Step 3: Save size chart entry in your backend

//       const payload = {
//         store_id: storeId,
//         category_id: categoryId,
//         image_url: file_url,
//       };
//       await api.post("/size_charts/", payload);

//       toast.success("Size chart uploaded successfully!");
//       setSizeChartUrl(file_url); // Update preview with the new URL

//       if (fileInputRef.current) {
//         fileInputRef.current.value = ""; // Reset file input
//       }
//     } catch (error) {
//       console.error("Upload failed:", error);
//       toast.error("Failed to upload size chart");
//     } finally {
//       setIsUploading(false);
//     }
//   };
//   /**
//    * Handles deleting the size chart image.
//    * It assumes a backend endpoint exists to delete the record and S3 object.
//    */

//   const handleDeleteSizeChart = async () => {
//     if (!storeId || !sub3 || !sizeChartUrl) return;

//     try {
//       // This API call should handle deleting the DB record and the associated S3 file.
//       await deleteImageFromS3(sizeChartUrl);
//       toast.success("Size chart deleted successfully.");
//       setSizeChartUrl(""); // Clear the image from the UI
//     } catch (error) {
//       console.error("Failed to delete size chart:", error);
//       toast.error("An error occurred while deleting the size chart.");
//     }
//   }; // --- MODIFICATION END ---
//   return (
//     <div className="space-y-3 w-full max-w-3xl mx-auto p-4 sm:p-0 overflow-hidden text-black">
//             {/* Section: Category Selection */}
//       <Section
//         title="Select Category"
//         subtitle="Choose the category for which you want to upload a size chart"
//       >
//         <div className="grid grid-cols-1 sm:grid-cols-2  gap-4">
//           <SelectField
//             label="Category"
//             value={category}
//             onChange={(val) => {
//               setCategory(val);
//               setSub1("");
//               setSub2("");
//               setSub3("");
//             }}
//             options={categories.filter((cat) => cat.parent_id === null)}
//           />
//           <SelectField
//             label="Subcategory 1"
//             value={sub1}
//             onChange={(val) => {
//               setSub1(val);
//               setSub2("");
//               setSub3("");
//             }}
//             disabled={!category}
//             options={categories.filter((cat) => cat.parent_id === category)}
//           />
//           <SelectField
//             label="Subcategory 2"
//             value={sub2}
//             onChange={(val) => {
//               setSub2(val);
//               setSub3("");
//             }}
//             disabled={!sub1}
//             options={categories.filter((cat) => cat.parent_id === sub1)}
//           />
//           <SelectField
//             label="Subcategory 3"
//             value={sub3}
//             onChange={(val) => setSub3(val)}
//             disabled={!sub2}
//             options={categories.filter((cat) => cat.parent_id === sub2)}
//           />
//         </div>
//       </Section>
//             {/* Section: Upload + Preview */}
//       {sub3 && (
//         <Section
//           title="Upload Size Chart"
//           subtitle="Upload a new size chart image or manage the existing one for the selected category."
//         >
//                     {/* --- MODIFICATION START --- */}
//           {/* This block replaces the old input/button combination */}
//           <div
//             onClick={handleBrowseClick}
//             className="w-full cursor-pointer border border-dashed border-gray-300 p-4 sm:p-6 rounded-xl text-center hover:bg-gray-50 transition"
//           >
//
//             {isUploading ? (
//               <>
//
//                 <p className="text-gray-400 text-sm">
//                                     Uploading: {uploadProgress}%
//                 </p>
//
//                 <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
//
//                   <div
//                     className="bg-green-600 h-2.5 rounded-full"
//                     style={{ width: `${uploadProgress}%` }}
//                   ></div>
//
//                 </div>
//
//               </>
//             ) : sizeChartUrl ? (
//               <div className="relative group mx-auto w-full max-w-md">
//
//                 <img
//                   src={sizeChartUrl}
//                   alt="Size Chart Preview"
//                   className="w-full h-auto rounded-lg mx-auto shadow-md"
//                 />
//
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation(); // Prevent file dialog from opening
//                     handleDeleteSizeChart();
//                   }}
//                   className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100 transition opacity-0 group-hover:opacity-100"
//                   aria-label="Remove image"
//                 >
//
//                   <FiTrash2 className="text-red-500 h-4 w-4" />
//                 </button>
//
//               </div>
//             ) : (
//               <div className="w-full h-32 sm:h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-xs sm:text-sm p-4">
//                                 Click to upload image (png, jpg)
//               </div>
//             )}
//
//           </div>
//
//           <input
//             type="file"
//             accept="image/*"
//             ref={fileInputRef}
//             onChange={handleFileChange}
//             className="hidden"
//           />
//                     {/* --- MODIFICATION END --- */}
//         </Section>
//       )}
//
//     </div>
//   );
// }

// /**
//  * Reusable dropdown component
//  */
// const SelectField: FC<{
//   label: string;
//   value: string;
//   onChange: (val: string) => void;
//   options: Category[];
//   disabled?: boolean;
// }> = ({ label, value, onChange, options, disabled }) => (
//   <div>
//
//     <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
//             {label}
//     </label>
//
//     <select
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       disabled={disabled}
//       className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
//     >
//             <option value="">{`Select ${label}`}</option>
//       {options.map((opt) => (
//         <option key={opt.category_id} value={opt.category_id}>
//                     {opt.name}
//         </option>
//       ))}
//
//     </select>
//
//   </div>
// );

// /**
//  * Section wrapper
//  */
// const Section: FC<{
//   title: string;
//   subtitle: string;
//   children: React.ReactNode;
// }> = ({ title, subtitle, children }) => (
//   <div className="p-4 sm:p-6 space-y-4 rounded-2xl shadow-sm bg-white">
//         <h2 className="text-base sm:text-lg font-semibold mb-1">{title}</h2>
//     <p className="text-xs sm:text-sm text-gray-500 mb-4">{subtitle}</p>
//     <div className="-mx-4 sm:mx-0 border-t border-gray-300 my-4"></div>
//     {children}
//   </div>
// );

"use client";

import { type FC, useEffect, useRef, useState } from "react";
import { api } from "@/lib/axios";
import { useSellerStore } from "@/store/sellerStore";
import { toast } from "sonner";
import { FiTrash2, FiUploadCloud, FiX } from "react-icons/fi"; // Import more icons for better UI

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

  // Category selection state
  const [category, setCategory] = useState("");
  const [sub1, setSub1] = useState("");
  const [sub2, setSub2] = useState("");
  const [sub3, setSub3] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  // --- REFACTORED STATE ---
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [sizeChartUrl, setSizeChartUrl] = useState<string>(""); // URL of the currently SAVED chart

  // New state to hold the selected file before upload
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  // New state for the temporary URL of the selected file for preview
  const [previewUrl, setPreviewUrl] = useState<string>("");

  // Helper to delete an image from S3 (can be reused)
  async function deleteImageFromS3(imageUrl: string) {
    try {
      await api.delete(`/products/delete_image`, {
        data: { file_url: imageUrl },
      });
    } catch (error) {
      console.error("Error deleting image from S3:", error);
      // Optional: Add a toast notification for deletion failure
    }
  }

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

  // Effect to fetch the existing size chart when the category changes
  useEffect(() => {
    // When category changes, reset any pending new image selection
    setNewImageFile(null);
    setPreviewUrl("");

    const fetchSizeChart = async () => {
      if (!storeId) return;
      const categoryId = sub3;
      if (!categoryId) {
        setSizeChartUrl("");
        return;
      }
      try {
        const res = await api.get(`/size_charts/${storeId}/${categoryId}`);
        setSizeChartUrl(res.data?.image_url || "");
      } catch {
        setSizeChartUrl("");
      }
    };
    fetchSizeChart();
  }, [storeId, sub3]); // Simplified dependency to just sub3

  // --- NEW ---
  // Create a temporary preview URL when a new file is selected
  // This also cleans up the URL to prevent memory leaks
  useEffect(() => {
    if (!newImageFile) {
      setPreviewUrl("");
      return;
    }
    const objectUrl = URL.createObjectURL(newImageFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [newImageFile]);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  // --- MODIFIED ---
  // This function now ONLY sets the selected file for previewing.
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewImageFile(file);
    }
  };

  // --- NEW ---
  // This function is triggered by the "Upload & Save" button.
  const handleUploadAndSave = async () => {
    if (!newImageFile) return;

    const categoryId = sub3;
    if (!categoryId) {
      toast.error("A category must be selected.");
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Step 1: Get presigned URL
      const presignedRes = await api.post("/products/upload", {
        file_name: newImageFile.name,
      });
      const { upload_url, file_url } = presignedRes.data;

      // Step 2: Upload to S3
      await api.put(upload_url, newImageFile, {
        headers: {
          "Content-Type": newImageFile.type || "application/octet-stream",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percent);
          }
        },
      });

      if (sizeChartUrl) {
        // If sizeChartUrl exists, an old chart is present, so we UPDATE.
        await api.put(`/size_charts/${storeId}/${categoryId}`, {
          image_url: file_url,
        });
        toast.success("Size chart updated successfully!");
      } else {
        // If sizeChartUrl is empty, no chart exists, so we CREATE.
        await api.post("/size_charts/", {
          store_id: storeId,
          category_id: categoryId,
          image_url: file_url,
        });
        toast.success("Size chart created successfully!");
      }

      toast.success("Size chart updated successfully!");
      setSizeChartUrl(file_url); // Set the new saved URL
      setNewImageFile(null); // Clear the pending file
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload size chart");
    } finally {
      setIsUploading(false);
    }
  };

  // Deletes the SAVED size chart
  const handleDeleteSizeChart = async () => {
    if (!storeId || !sub3 || !sizeChartUrl) return;

    try {
      // Assuming your backend handles S3 deletion when the DB record is deleted.
      // If not, call the helper function first.
      await deleteImageFromS3(sizeChartUrl);
      await api.delete(`/size_charts/${storeId}/${sub3}`); // Example endpoint

      toast.success("Size chart deleted successfully.");
      setSizeChartUrl("");
    } catch (error) {
      console.error("Failed to delete size chart:", error);
      toast.error("An error occurred while deleting the size chart.");
    }
  };

  return (
    <div className="space-y-6 w-full max-w-3xl mx-auto p-4 sm:p-0 text-black">
      {/* Category Selection Section (No changes) */}
      <Section
        title="1. Select Category"
        subtitle="Choose the category for which you want to upload a size chart"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <SelectField
            label="Subcategory 3"
            value={sub3}
            onChange={(val) => setSub3(val)}
            disabled={!sub2}
            options={categories.filter((cat) => cat.parent_id === sub2)}
          />
        </div>
      </Section>

      {/* Upload & Preview Section */}
      {sub3 && (
        <Section
          title="2. Upload Size Chart"
          subtitle="Upload a new image or manage the existing one for the selected category."
        >
          <div className="w-full rounded-xl text-center transition-all">
            {isUploading ? (
              // --- UPLOADING STATE ---
              <div className="p-6">
                <p className="text-gray-500 text-sm mb-2">
                  Uploading: {uploadProgress}%
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            ) : newImageFile && previewUrl ? (
              // --- PREVIEWING NEW IMAGE STATE ---
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  New Image Preview
                </p>
                <img
                  src={previewUrl}
                  alt="New size chart preview"
                  className="w-full max-w-md h-auto rounded-lg mx-auto shadow-md"
                />
                <div className="flex justify-center gap-4 mt-4">
                  <button
                    onClick={handleUploadAndSave}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <FiUploadCloud /> Upload & Save
                  </button>
                  <button
                    onClick={() => setNewImageFile(null)}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
                  >
                    <FiX /> Cancel
                  </button>
                </div>
              </div>
            ) : sizeChartUrl ? (
              // --- SHOWING SAVED IMAGE STATE ---
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Current Size Chart
                </p>
                <div className="relative group mx-auto w-full max-w-md">
                  <img
                    src={sizeChartUrl}
                    alt="Size Chart Preview"
                    className="w-full h-auto rounded-lg mx-auto shadow-md"
                  />
                  <button
                    onClick={handleDeleteSizeChart}
                    className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-md hover:bg-white transition opacity-0 group-hover:opacity-100"
                    aria-label="Remove image"
                  >
                    <FiTrash2 className="text-red-500 h-5 w-5" />
                  </button>
                </div>
                <button
                  onClick={handleBrowseClick}
                  className="mt-4 bg-gray-700 text-white px-4 py-2 text-sm rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Upload a Different Image
                </button>
              </div>
            ) : (
              // --- EMPTY STATE ---
              <div
                onClick={handleBrowseClick}
                className="w-full cursor-pointer border-2 border-dashed border-gray-300 p-8 rounded-xl hover:bg-gray-50 hover:border-blue-500 transition-colors"
              >
                <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 font-semibold text-gray-700">
                  Click to upload an image
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, or GIF</p>
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </Section>
      )}
    </div>
  );
}

// Reusable Dropdown and Section components (No changes)
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

const Section: FC<{
  title: string;
  subtitle: string;
  children: React.ReactNode;
}> = ({ title, subtitle, children }) => (
  <div className="p-4 sm:p-6 space-y-4 rounded-2xl shadow-sm bg-white">
    <h2 className="text-base sm:text-lg font-semibold mb-1">{title}</h2>
    <p className="text-xs sm:text-sm text-gray-500 mb-4">{subtitle}</p>
    <div className="-mx-4 sm:mx-0 border-t border-gray-300 my-4"></div>
    {children}
  </div>
);
