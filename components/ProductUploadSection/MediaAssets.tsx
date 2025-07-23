"use client";

import { useRef, useState, useEffect } from "react";
import {
  useCurrentStep,
  useFormActions,
  useFormData,
} from "@/store/product_upload_store";
import { FiUpload, FiX, FiImage, FiPlus, FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";
import axios from "axios";
import { api } from "@/lib/axios";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import imageCompression from "browser-image-compression";

interface UploadResponse {
  upload_url: string;
  file_url: string;
}

export default function MediaAssets() {
  const { media, variants } = useFormData();
  const { updateFormData, setStepValidation } = useFormActions();
  const currentStep = useCurrentStep();
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const variantImageInputRefs = useRef<{
    [key: string]: HTMLInputElement | null;
  }>({});
  const [mainPreview, setMainPreview] = useState<string | null>(null);
  const [variantPreviews, setVariantPreviews] = useState<{
    [key: string]: string[];
  }>({});
  const [isUploading, setIsUploading] = useState({
    main: false,
    variants: {} as { [key: string]: boolean },
  });

  // Cropper states for multiple files
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropperImage, setCropperImage] = useState<string | null>(null);
  const [filesToProcess, setFilesToProcess] = useState<File[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [currentSku, setCurrentSku] = useState<string>("");
  const cropperRef = useRef<ReactCropperElement>(null);

  // Initialize with existing media data
  useEffect(() => {
    if (media?.mainImage && media.mainImage.length > 0) {
      setMainPreview(media.mainImage[0]);
    }
    if (media?.variantImages) {
      const previews: { [key: string]: string[] } = {};
      media.variantImages.forEach((vi) => {
        previews[vi.sku] = vi.images;
      });
      setVariantPreviews(previews);
    }
  }, [media]);

  useEffect(() => {
    const isValid = !!media?.mainImage?.length;
    console.log("System hai bhai",media);
    setStepValidation(currentStep, isValid);
  }, [media, currentStep]);

  const variantsList = variants?.variants || [];

  const handleMainImageClick = () => {
    mainImageInputRef.current?.click();
  };

  const handleVariantImageClick = (sku: string) => {
    variantImageInputRefs.current[sku]?.click();
  };

  const compressImage = async (file: File): Promise<File> => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    return await imageCompression(file, options);
  };

  const startCroppingProcess = (files: File[], sku: string) => {
    setFilesToProcess(files);
    setCurrentSku(sku);
    setCurrentFileIndex(0);
    showCropper(files[0]);
  };

  const showCropper = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setCropperImage(reader.result as string);
      setCropperOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCrop = async () => {
    if (cropperRef.current?.cropper) {
      cropperRef.current.cropper.getCroppedCanvas().toBlob(
        async (blob) => {
          if (blob) {
            const croppedFile = new File([blob], `cropped-${Date.now()}.jpg`, {
              type: "image/jpeg",
            });
            const compressedFile = await compressImage(croppedFile);

            // Process the cropped/compressed file
            await processCroppedFile(compressedFile, currentSku);

            // Move to next file or finish
            if (currentFileIndex < filesToProcess.length - 1) {
              const nextIndex = currentFileIndex + 1;
              setCurrentFileIndex(nextIndex);
              showCropper(filesToProcess[nextIndex]);
            } else {
              setCropperOpen(false);
              setFilesToProcess([]);
            }
          }
        },
        "image/jpeg",
        0.9
      );
    }
  };

  const processCroppedFile = async (file: File, sku: string) => {
    const tempPreview = URL.createObjectURL(file);

    // Add temporary preview
    if(sku == "main"){
      setMainPreview(tempPreview);
      setIsUploading((prev) => ({ ...prev, main: true }));
    }
    setVariantPreviews((prev) => ({
      ...prev,
      [sku]: [...(prev[sku] || []), tempPreview],
    }));

    try {
      const file_url = await uploadFile(file);

      // Update the actual URLs
      const existingVariantImages = media?.variantImages || [];
      const existingVariant = existingVariantImages.find(
        (vi) => vi.sku === sku
      );

      const updatedVariantImages = existingVariant
        ? existingVariantImages.map((vi) =>
            vi.sku === sku ? { ...vi, images: [...vi.images, file_url] } : vi
          )
        : [...existingVariantImages, { sku, images: [file_url] }];

      updateFormData("media", {
        ...media,
        variantImages: updatedVariantImages,
      });

      // Replace temp URL with permanent URL
      if(sku === "main"){
        setMainPreview(file_url)
      }
      setVariantPreviews((prev) => ({
        ...prev,
        [sku]: [
          ...(prev[sku]?.filter((url) => url !== tempPreview) || []),
          file_url,
        ],
      }));

      setIsUploading((prev) => ({
        ...prev,
        variants: { ...prev.variants, [sku]: false },
      }));

      if (sku === "main") {
        setMainPreview(file_url);
        updateFormData("media", {
          ...media,
          mainImage: [file_url],
        });
        setIsUploading((prev) => ({ ...prev, main: false }));
      }
    } catch (error: any) {
      console.error("Upload failed:", error);
      // Remove failed upload
      setVariantPreviews((prev) => ({
        ...prev,
        [sku]: prev[sku]?.filter((url) => url !== tempPreview) || [],
      }));
      toast.error(error.message || "Upload failed. Please try again.");
    } finally {
      URL.revokeObjectURL(tempPreview);
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const validTypes = [
      "image/svg+xml",
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];
    if (!validTypes.includes(file.type)) {
      throw new Error(
        "Invalid file type. Please upload an SVG, PNG, JPG, or WEBP image."
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error("File too large. Maximum size is 5MB.");
    }

    const response = await api.post<UploadResponse>("/products/upload", {
      file_name: file.name,
    });

    const { upload_url, file_url } = response.data;

    await axios.put(upload_url, file, {
      headers: {
        "Content-Type": file.type,
      },
    });

    return file_url;
  };

  const handleMainImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    startCroppingProcess([file], "main");
  };

  const handleVariantImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    sku: string
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);

    setIsUploading((prev) => ({
      ...prev,
      variants: { ...prev.variants, [sku]: true },
    }));

    startCroppingProcess(files, sku);

    // Reset input to allow selecting same files again
    if (variantImageInputRefs.current[sku]) {
      variantImageInputRefs.current[sku]!.value = "";
    }
  };

  const removeMainImage = async(imageUrl: string) => {
    await deleteImageFromS3(imageUrl); 
    setMainPreview(null);
    updateFormData("media", {
      ...media,
      mainImage: null,
    });
    if (mainImageInputRef.current) {
      mainImageInputRef.current.value = "";
    }
    toast.info("Main image removed");
  };
  async function deleteImageFromS3(imageUrl: string) {
    try {
      const payload = {
        file_url: imageUrl,
      }
      await api.delete(`/products/delete_image`, {data:{ "file_url" : imageUrl }});
    } catch (error) {
      console.error("Error deleting image from S3:", error);
    }
  }
  const removeVariantImage = async(sku: string, imageUrl: string) => {
    await deleteImageFromS3(imageUrl); 
    setVariantPreviews((prev) => ({
      ...prev,
      [sku]: prev[sku]?.filter((url) => url !== imageUrl) || [],
    }));

    const existingVariantImages = media?.variantImages || [];
    const updatedVariantImages = existingVariantImages
      .map((vi) =>
        vi.sku === sku
          ? { ...vi, images: vi.images.filter((url) => url !== imageUrl) }
          : vi
      )
      .filter((vi) => vi.images.length > 0);

    updateFormData("media", {
      ...media,
      variantImages: updatedVariantImages,
    });

    toast.info("Variant image removed");
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg">
      {/* Cropper Modal */}
      {cropperOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex flex-col items-center justify-center p-4">
          <div className="bg-white rounded-lg p-4 w-full max-w-3xl max-h-[90vh] overflow-auto">
            <h2 className="text-lg font-semibold mb-4">
              Crop Image ({currentFileIndex + 1} of {filesToProcess.length})
            </h2>
            <div className="w-full h-96">
              <Cropper
                src={cropperImage || ""}
                style={{ height: "100%", width: "100%" }}
                initialAspectRatio={1}
                guides={true}
                ref={cropperRef}
                viewMode={1}
                responsive={true}
                autoCropArea={1}
                checkOrientation={false}
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setCropperOpen(false);
                  setFilesToProcess([]);
                  setIsUploading((prev) => ({
                    ...prev,
                    variants: { ...prev.variants, [currentSku]: false },
                  }));
                }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Cancel All
              </button>
              <button
                onClick={handleCrop}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {currentFileIndex < filesToProcess.length - 1
                  ? "Save & Next"
                  : "Save & Finish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rest of your existing UI remains the same */}
      <div>
        <h1 className="text-lg font-semibold">Media Assets</h1>
        <p className="text-gray-500 text-sm">
          Upload images for your product and variants
        </p>
      </div>

      <div className="grid gap-8 mt-2">
        {/* Main Product Image Upload */}
        <div
          onClick={handleMainImageClick}
          className={`cursor-pointer border ${
            mainPreview ? "border-solid" : "border-dashed"
          } border-gray-300 p-6 rounded-xl hover:bg-gray-50 transition`}
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiImage className="text-gray-400" />
            Main Product Image
            {isUploading.main && (
              <span className="text-xs text-blue-500 ml-2">Uploading...</span>
            )}
          </h2>

          {mainPreview ? (
            <div className="relative">
              <img
                src={mainPreview}
                alt="Main product preview"
                className="w-full h-60 object-contain rounded-lg border border-gray-200"
              />
              {!isUploading.main && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeMainImage(mainPreview);
                  }}
                  className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100 transition"
                  aria-label="Remove image"
                >
                  <FiTrash2 className="text-red-500" />
                </button>
              )}
            </div>
          ) : (
            <div className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 text-gray-400 text-sm">
              <FiUpload className="text-2xl" />
              <span>Click to upload main product image</span>
              <span className="text-xs">SVG, PNG, JPG, WEBP (max 5MB)</span>
            </div>
          )}

          <input
            ref={mainImageInputRef}
            type="file"
            accept=".svg,.png,.jpg,.jpeg,.webp"
            className="hidden"
            onChange={handleMainImageChange}
            disabled={isUploading.main}
          />
        </div>

        {/* Variant Images Upload */}
        {variantsList.map((variant) => {
          const sku = variant.sku;
          const variantImages = variantPreviews[sku] || [];
          const isUploadingVariant = isUploading.variants[sku];

          return (
            <div key={sku} className="border border-gray-200 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FiImage className="text-gray-400" />
                Variant: {sku}
                {isUploadingVariant && (
                  <span className="text-xs text-blue-500 ml-2">
                    Uploading...
                  </span>
                )}
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {variantImages.map((imageUrl, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={imageUrl}
                      alt={`Variant ${sku} image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      onClick={() => removeVariantImage(sku, imageUrl)}
                      className="absolute top-1 right-1 bg-white p-1 rounded-full shadow-md hover:bg-gray-100 transition opacity-0 group-hover:opacity-100"
                      aria-label="Remove image"
                    >
                      <FiTrash2 className="text-red-500 text-sm" />
                    </button>
                  </div>
                ))}

                <div
                  onClick={() => handleVariantImageClick(sku)}
                  className="cursor-pointer w-[100px] h-30 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-1 text-gray-400 text-sm hover:bg-gray-50 "
                >
                  <FiPlus className="text-xl" />
                  <span>Add Images</span>
                  <span className="text-xs">Max 5MB each</span>
                </div>

                <input
                  ref={(el) => { variantImageInputRefs.current[sku] = el; }}
                  type="file"
                  accept=".svg,.png,.jpg,.jpeg,.webp"
                  className="hidden"
                  onChange={(e) => handleVariantImageChange(e, sku)}
                  disabled={isUploadingVariant}
                  multiple
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


// "use client";

// import { useRef, useState, useEffect } from "react";
// import { useCurrentStep, useFormActions, useFormData } from "@/store/product_upload_store";
// import { FiUpload, FiTrash2, FiImage, FiPlus } from "react-icons/fi";
// import { toast } from "sonner";
// import { api } from "@/lib/axios";
// import Cropper from "react-easy-crop";
// import getCroppedImg from "@/lib/cropImage";

// interface UploadResponse {
//   upload_url: string;
//   file_url: string;
// }

// export default function MediaAssets() {
//   const { media, variants } = useFormData();
//   const { updateFormData, setStepValidation } = useFormActions();
//   const currentStep = useCurrentStep();

//   const [mainPreview, setMainPreview] = useState<string | null>(null);
//   const [variantPreviews, setVariantPreviews] = useState<{ [sku: string]: string[] }>({});
//   const [isUploading, setIsUploading] = useState({ main: false, variants: {} as Record<string, boolean> });

//   const mainImageInputRef = useRef<HTMLInputElement>(null);
//   const variantImageInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

//   const [cropperOpen, setCropperOpen] = useState(false);
//   const [cropSrc, setCropSrc] = useState<string | null>(null);
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [croppedArea, setCroppedArea] = useState<any>(null);
//   const [currentFile, setCurrentFile] = useState<File | null>(null);
//   const [currentSku, setCurrentSku] = useState<string>("");

//   useEffect(() => {
//     if (media?.mainImage?.length) setMainPreview(media.mainImage[0]);
//     if (media?.variantImages) {
//       const previews: Record<string, string[]> = {};
//       for (const { sku, images } of media.variantImages) previews[sku] = images;
//       setVariantPreviews(previews);
//     }
//   }, [media]);

//   useEffect(() => {
//     setStepValidation(currentStep, !!media?.mainImage?.length);
//   }, [media, currentStep, setStepValidation]);

//   const handleImageSelect = (file: File, sku: string) => {
//     if (!file.type.startsWith('image/')) {
//       toast.error('Please select an image file');
//       return;
//     }

//     const reader = new FileReader();
//     reader.onload = () => {
//       setCropSrc(reader.result as string);
//       setCropperOpen(true);
//       setCurrentFile(file);
//       setCurrentSku(sku);
//     };
//     reader.onerror = () => {
//       toast.error('Failed to read file');
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
//     setCroppedArea(croppedAreaPixels);
//   };

//   const uploadToS3 = async (file: File) => {
//     try {
//       const { data } = await api.post<UploadResponse>("/products/upload", { file_name: file.name });
//       await api.put(data.upload_url, file, { headers: { "Content-Type": file.type } });
//       return data.file_url;
//     } catch (error) {
//       console.error('Upload error:', error);
//       toast.error('Failed to upload image');
//       throw error;
//     }
//   };

//   const handleCropSave = async () => {
//     if (!croppedArea || !cropSrc || !currentFile) {
//       toast.error('Missing crop data');
//       return;
//     }

//     try {
//       const blob = await getCroppedImg(cropSrc, croppedArea);
//       if (!blob) {
//         throw new Error('Cropping failed');
//       }

//       const croppedFile = new File([blob], `cropped-${Date.now()}.jpg`, { type: "image/jpeg" });
//       const previewURL = URL.createObjectURL(croppedFile);

//       // Set preview first for immediate feedback
//       if (currentSku === "main") {
//         setMainPreview(previewURL);
//         setIsUploading(prev => ({ ...prev, main: true }));
//       } else {
//         setVariantPreviews((prev) => ({
//           ...prev,
//           [currentSku]: [...(prev[currentSku] || []), previewURL]
//         }));
//         setIsUploading(prev => ({ ...prev, variants: { ...prev.variants, [currentSku]: true } }));
//       }

//       // Upload the file
//       const url = await uploadToS3(croppedFile);

//       // Update form data with the final URL
//       if (currentSku === "main") {
//         updateFormData("media", { ...media, mainImage: [url] });
//         setMainPreview(url);
//         setIsUploading(prev => ({ ...prev, main: false }));
//       } else {
//         const old = media?.variantImages || [];
//         const existingVariantIndex = old.findIndex((v) => v.sku === currentSku);
        
//         let updated;
//         if (existingVariantIndex >= 0) {
//           updated = [...old];
//           updated[existingVariantIndex] = {
//             ...updated[existingVariantIndex],
//             images: [...updated[existingVariantIndex].images, url]
//           };
//         } else {
//           updated = [...old, { sku: currentSku, images: [url] }];
//         }

//         updateFormData("media", { ...media, variantImages: updated });
//         setVariantPreviews((prev) => ({
//           ...prev,
//           [currentSku]: [...(prev[currentSku] || []).filter((u) => u !== previewURL), url]
//         }));
//         setIsUploading(prev => ({ ...prev, variants: { ...prev.variants, [currentSku]: false } }));
//       }

//       // Clean up
//       URL.revokeObjectURL(previewURL);
//       setCropperOpen(false);
//     } catch (error) {
//       console.error('Crop save error:', error);
//       toast.error('Failed to save cropped image');
//       // Reset preview if upload failed
//       if (currentSku === "main") {
//         setMainPreview(null);
//         setIsUploading(prev => ({ ...prev, main: false }));
//       } else {
//         setVariantPreviews(prev => ({
//           ...prev,
//           [currentSku]: prev[currentSku]?.filter(u => u !== previewURL) || []
//         }));
//         setIsUploading(prev => ({ ...prev, variants: { ...prev.variants, [currentSku]: false } }));
//       }
//     }
//   };

//   const deleteImageFromS3 = async (imageUrl: string) => {
//     try {
//       await api.delete(`/products/delete_image`, {
//         data: { file_url: imageUrl },
//       });
//     } catch (error) {
//       console.error("Error deleting image from S3:", error);
//       throw error;
//     }
//   };

//   const removeMainImage = async () => {
//     if (!mainPreview) return;
    
//     try {
//       await deleteImageFromS3(mainPreview);
//       setMainPreview(null);
//       updateFormData("media", { ...media, mainImage: [] });
//       toast.success("Main image removed");
//     } catch (error) {
//       toast.error("Failed to remove main image");
//     }
//   };

//   const removeVariantImage = async (sku: string, imageUrl: string) => {
//     try {
//       await deleteImageFromS3(imageUrl);
//       setVariantPreviews(prev => ({
//         ...prev,
//         [sku]: prev[sku]?.filter(u => u !== imageUrl) || []
//       }));

//       const old = media?.variantImages || [];
//       const updated = old
//         .map(v => v.sku === sku ? { ...v, images: v.images.filter(u => u !== imageUrl) } : v)
//         .filter(v => v.images.length > 0);

//       updateFormData("media", { ...media, variantImages: updated });
//       toast.success("Variant image removed");
//     } catch (error) {
//       toast.error("Failed to remove variant image");
//     }
//   };

//   // Clean up object URLs when component unmounts
//   useEffect(() => {
//     return () => {
//       if (mainPreview && mainPreview.startsWith('blob:')) {
//         URL.revokeObjectURL(mainPreview);
//       }
//       Object.values(variantPreviews).forEach(urls => {
//         urls.forEach(url => {
//           if (url.startsWith('blob:')) {
//             URL.revokeObjectURL(url);
//           }
//         });
//       });
//     };
//   }, [mainPreview, variantPreviews]);

//   return (
//     <div className="max-w-4xl mx-auto">
//       {/* CROP MODAL */}
//       {cropperOpen && (
//         <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex flex-col justify-center items-center p-4">
//           <div className="relative w-full max-w-xl h-[700px] bg-white rounded-xl overflow-hidden">
//             {cropSrc && (
//               <Cropper
//                 image={cropSrc}
//                 crop={crop}
//                 zoom={zoom}
//                 aspect={1}
//                 cropSize={{ width: 700, height: 700 }}
//                 onCropChange={setCrop}
//                 onZoomChange={setZoom}
//                 onCropComplete={handleCropComplete}
//                 showGrid={true}
//               />
//             )}
//             <div className="absolute bottom-0 left-0 right-0 bg-white p-4 flex justify-between items-center">
//               <input
//                 type="range"
//                 min={1}
//                 max={3}
//                 step={0.1}
//                 value={zoom}
//                 onChange={(e) => setZoom(+e.target.value)}
//                 className="w-full mr-4"
//               />
//               <button 
//                 onClick={handleCropSave} 
//                 className="bg-blue-600 text-white px-4 py-2 rounded-md"
//                 disabled={!croppedArea || isUploading.main || isUploading.variants[currentSku]}
//               >
//                 {isUploading.main || isUploading.variants[currentSku] ? "Uploading..." : "Save"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Main image UI */}
//       <div className="border border-gray-300 p-4 rounded-xl">
//         <h2 className="font-semibold mb-2 flex items-center gap-2">
//           <FiImage className="text-gray-500" /> Main Product Image
//           {isUploading.main && <span className="text-sm text-blue-500 ml-2">Uploading...</span>}
//         </h2>
//         {mainPreview ? (
//           <div className="relative group">
//             <img src={mainPreview} className="w-full h-64 object-contain rounded-lg" alt="Main" />
//             <button
//               onClick={removeMainImage}
//               className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100 transition opacity-0 group-hover:opacity-100"
//               disabled={isUploading.main}
//             >
//               <FiTrash2 className="text-red-500" />
//             </button>
//           </div>
//         ) : (
//           <div 
//             className="border border-dashed border-gray-400 h-40 flex items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50"
//             onClick={() => mainImageInputRef.current?.click()}
//           >
//             Click to Upload
//           </div>
//         )}
//         <input 
//           ref={mainImageInputRef} 
//           type="file" 
//           className="hidden" 
//           accept="image/*"
//           onChange={(e) => e.target.files?.[0] && handleImageSelect(e.target.files[0], "main")}
//           disabled={isUploading.main}
//         />
//       </div>

//       {/* Variant images */}
//       {variants?.variants?.map((variant) => (
//         <div key={variant.sku} className="mt-6">
//           <h2 className="font-semibold mb-2 flex items-center gap-2">
//             <FiImage className="text-gray-500" /> Variant: {variant.sku}
//             {isUploading.variants[variant.sku] && <span className="text-sm text-blue-500 ml-2">Uploading...</span>}
//           </h2>
//           <div className="grid grid-cols-3 gap-4">
//             {(variantPreviews[variant.sku] || []).map((img, i) => (
//               <div key={i} className="relative group">
//                 <img src={img} className="h-32 w-full object-cover rounded-md" />
//                 <button
//                   className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md hover:bg-gray-100 transition opacity-0 group-hover:opacity-100"
//                   onClick={() => removeVariantImage(variant.sku, img)}
//                   disabled={isUploading.variants[variant.sku]}
//                 >
//                   <FiTrash2 size={14} />
//                 </button>
//               </div>
//             ))}
//             <div
//               onClick={() => variantImageInputRefs.current[variant.sku]?.click()}
//               className="border-2 border-dashed border-gray-300 flex items-center justify-center h-32 rounded-md cursor-pointer text-gray-400 hover:border-blue-400 hover:text-blue-400 transition-colors"
//             >
//               <FiPlus className="text-xl" />
//             </div>
//             <input
//               ref={(el) => (variantImageInputRefs.current[variant.sku] = el)}
//               type="file"
//               className="hidden"
//               accept="image/*"
//               onChange={(e) => e.target.files?.[0] && handleImageSelect(e.target.files[0], variant.sku)}
//               disabled={isUploading.variants[variant.sku]}
//             />
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }