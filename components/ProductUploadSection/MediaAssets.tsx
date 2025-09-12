"use client";
import { useRef, useState, useEffect, useMemo } from "react";
import {
  useCurrentStep,
  useFormActions,
  useFormData,
} from "@/store/product_upload_store";
import { FiImage, FiPlus, FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";
import axios from "axios";
import { api } from "@/lib/axios";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/lib/cropImage";
import Modal from "react-modal";
import { Area } from "react-easy-crop";

/**
 * @interface UploadResponse
 * @description Defines the structure of the response from the presigned URL API endpoint.
 */
interface UploadResponse {
  upload_url: string; // The presigned URL to which the file should be PUT.
  file_url: string; // The final, public URL of the uploaded file.
}

/**
 * A component for uploading, cropping, and managing all media assets for a product and its variants.
 *
 * This component is the final step in the product upload form. It provides a user interface for
 * attaching images to the main product and to each individual product variant. It features a
 * robust, multi-stage upload process that includes client-side validation, a mandatory cropping
 * step for each image, and direct-to-S3 uploads using presigned URLs.
 *
 * ### State Management
 * - **Local State (`useState`, `useRef`)**: Manages the complex UI flow, including temporary image previews (`mainPreviews`, `variantPreviews`), uploading indicators (`isUploading`), and the state for the image cropping modal (`croppingImage`, `crop`, `zoom`, etc.).
 * - **Global State (`product_upload_store`)**: It reads the product's `variants` from the store to render the necessary upload sections. It continuously syncs the final, permanent image URLs back to the `media` object in the global store. It also updates the step's validation status.
 *
 * ### Image Upload Workflow
 * 1.  **File Selection**: User selects one or more image files.
 * 2.  **Client-Side Validation**: Each file is checked to ensure it meets the minimum 800x800 pixel dimension requirement.
 * 3.  **Cropping Queue**: Valid files are added to a processing queue (`filesToProcess`).
 * 4.  **Cropping Modal**: The component opens a modal with the first image in the queue and an instance of `react-easy-crop`.
 * 5.  **User Crop**: The user adjusts the crop and zoom and clicks "Save & Next".
 * 6.  **Presigned URL Fetch**: An API call is made to `POST /products/upload` to get a presigned S3 URL.
 * 7.  **Direct Upload**: The cropped image blob is uploaded directly to the presigned S3 URL using `axios.put`.
 * 8.  **State Update**: The final, permanent `file_url` is saved to the global Zustand store.
 * 9.  **Loop**: If there are more images in the queue, the modal updates with the next image. Otherwise, it closes.
 *
 * ### API Endpoints
 * **`POST /products/upload`**:
 * - **Request**: `{ file_name: string }`
 * - **Response**: `UploadResponse` - Contains the presigned URL for uploading and the final public URL.
 *
 * **`DELETE /products/delete_image`**:
 * - **Request Body**: `{ file_url: string }`
 * - **Purpose**: Deletes the specified image file from the S3 bucket.
 *
 * @returns {JSX.Element} The media asset management interface for the product upload form.
 * @see {@link https://github.com/ricardo-ch/react-easy-crop | react-easy-crop}
 * @see {@link https://docs.pmnd.rs/zustand/getting-started/introduction | Zustand Documentation}
 * @see {@link https://sonner.emilkowal.ski/ | Sonner (Toast Notifications)}
 */
export default function MediaAssets() {
  const { media, variants } = useFormData();
  const { updateFormData, setStepValidation } = useFormActions();
  const currentStep = useCurrentStep();
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const variantImageInputRefs = useRef<{
    [key: string]: HTMLInputElement | null;
  }>({});

  const [mainPreviews, setMainPreviews] = useState<string[]>([]);
  const [variantPreviews, setVariantPreviews] = useState<{
    [key: string]: string[];
  }>({});
  const [isUploading, setIsUploading] = useState({
    main: false,
    variants: {} as { [key: string]: boolean },
  });

  const [croppingImage, setCroppingImage] = useState<File | null>(null);
  const [currentSku, setCurrentSku] = useState<string>("");
  const [filesToProcess, setFilesToProcess] = useState<File[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  /**
   * This effect hydrates the local preview states with permanent image URLs
   * from the global store when the component first loads.
   */
  useEffect(() => {
    if (media?.mainImage && Array.isArray(media.mainImage)) {
      setMainPreviews(media.mainImage);
    }
    if (media?.variantImages) {
      const previews: { [key: string]: string[] } = {};
      media.variantImages.forEach((vi) => {
        previews[vi.sku] = vi.images;
      });
      setVariantPreviews(previews);
    }
  }, [media]);

  /**
   * This effect validates the current step.
   * The step is considered valid only if there is at least one main image AND
   * every product variant has at least one image.
   */
  useEffect(() => {
    const mainImageValid = !!media?.mainImage?.length;
    const allSKUs = variants?.variants?.map((v) => v.sku) || [];
    const variantImagesMap = new Map(
      media?.variantImages?.map((vi) => [vi.sku, vi.images]) || []
    );
    const allVariantsHaveImages = allSKUs.every((sku) => {
      const images = variantImagesMap.get(sku);
      return Array.isArray(images) && images.length > 0;
    });
    const isValid = mainImageValid && allVariantsHaveImages;
    setStepValidation(currentStep, isValid);
  }, [media, variants, currentStep, setStepValidation]);

  const variantsList = variants?.variants || [];

  // A memoized URL for the image currently in the cropper to avoid re-creating it on every render.
  const imageSrc = useMemo(
    () =>
      filesToProcess[currentFileIndex]
        ? URL.createObjectURL(filesToProcess[currentFileIndex])
        : "",
    [filesToProcess, currentFileIndex]
  );
  // Effect to clean up the object URL created for the cropper when it's no longer needed.
  useEffect(() => {
    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
    };
  }, [imageSrc]);

  const handleMainImageClick = () => {
    mainImageInputRef.current?.click();
  };

  const handleVariantImageClick = (sku: string) => {
    variantImageInputRefs.current[sku]?.click();
  };

  /**
   * Initializes the cropping process by setting up the queue and opening the modal.
   * @param {File[]} files - An array of valid files to be cropped.
   * @param {string} sku - The SKU of the variant these files belong to ('main' for main product).
   */
  const startCroppingProcess = (files: File[], sku: string) => {
    setFilesToProcess(files);
    setCurrentSku(sku);
    setCurrentFileIndex(0);
    setCroppingImage(files[0]);
  };

  const handleCropComplete = (_: any, croppedArea: Area) => {
    setCroppedAreaPixels(croppedArea);
  };

  /**
   * Handles the 'Save' button click within the cropping modal.
   * It crops the image, processes the result, and advances to the next image in the queue.
   */
  const handleCrop = async () => {
    if (!croppedAreaPixels || !filesToProcess[currentFileIndex]) return;
    try {
      // Use a helper function to get the cropped image as a Blob.
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels, 0.9);
      if (!croppedBlob) throw new Error("Failed to crop image");

      // Convert the Blob to a File object.
      const croppedFile = new File(
        [croppedBlob],
        filesToProcess[currentFileIndex].name,
        { type: filesToProcess[currentFileIndex].type }
      );

      // Start the upload process for the newly cropped file.
      await processCroppedFile(croppedFile, currentSku);

      // Check if there are more files to process in the queue.
      if (currentFileIndex < filesToProcess.length - 1) {
        // If yes, move to the next file.
        const nextIndex = currentFileIndex + 1;
        setCurrentFileIndex(nextIndex);
        setCroppingImage(filesToProcess[nextIndex]);
      } else {
        // If no, close the modal and clear the queue.
        setCroppingImage(null);
        setFilesToProcess([]);
      }
    } catch (error) {
      console.error("Cropping failed:", error);
      toast.error("Failed to process image. Please try again.");
    }
  };

  /**
   * Manages the full upload lifecycle for a single cropped file.
   * @param {File} file - The cropped file to be uploaded.
   * @param {string} sku - The associated SKU ('main' for main product).
   */
  const processCroppedFile = async (file: File, sku: string) => {
    // Create a temporary local URL for an instant preview.
    const tempPreview = URL.createObjectURL(file);

    // Update the UI to show the temporary preview and loading state.
    if (sku === "main") {
      setMainPreviews((prev) => [...prev, tempPreview]);
      setIsUploading((prev) => ({ ...prev, main: true }));
    } else {
      setVariantPreviews((prev) => ({
        ...prev,
        [sku]: [...(prev[sku] || []), tempPreview],
      }));
      setIsUploading((prev) => ({
        ...prev,
        variants: { ...prev.variants, [sku]: true },
      }));
    }

    try {
      // Call the `uploadFile` helper to handle the backend communication.
      const file_url = await uploadFile(file);

      // After successful upload, update the global Zustand store with the permanent URL.
      if (sku === "main") {
        updateFormData("media", {
          ...media,
          mainImage: [...(media?.mainImage || []), file_url],
        });
        // Replace the temporary preview URL with the permanent one.
        setMainPreviews((prev) =>
          prev.map((url) => (url === tempPreview ? file_url : url))
        );
      } else {
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
        setVariantPreviews((prev) => ({
          ...prev,
          [sku]: [
            ...(prev[sku]?.filter((url) => url !== tempPreview) || []),
            file_url,
          ],
        }));
      }
    } catch (error: any) {
      // If the upload fails, remove the temporary preview from the UI.
      if (sku === "main") {
        setMainPreviews((prev) => prev.filter((url) => url !== tempPreview));
      } else {
        setVariantPreviews((prev) => ({
          ...prev,
          [sku]: prev[sku]?.filter((url) => url !== tempPreview) || [],
        }));
      }
      toast.error(error.message || "Upload failed. Please try again.");
    } finally {
      // Reset the loading state for the specific upload.
      if (sku === "main") {
        setIsUploading((prev) => ({ ...prev, main: false }));
      } else {
        setIsUploading((prev) => ({
          ...prev,
          variants: { ...prev.variants, [sku]: false },
        }));
      }
      // Clean up the temporary object URL to prevent memory leaks.
      URL.revokeObjectURL(tempPreview);
    }
  };

  /**
   * Handles the two-step file upload process (get presigned URL, then PUT file).
   * @param {File} file - The file to upload.
   * @returns {Promise<string>} The final, public URL of the uploaded file.
   */
  const uploadFile = async (file: File): Promise<string> => {
    // Client-side validation for file type and size.
    const validTypes = [
      "image/svg+xml",
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];
    if (!validTypes.includes(file.type))
      throw new Error(
        "Invalid file type. Please upload an SVG, PNG, JPG, or WEBP image."
      );
    if (file.size > 5 * 1024 * 1024)
      throw new Error("File too large. Maximum size is 5MB.");

    // Step 1: Get a presigned URL from our backend.
    const response = await api.post<UploadResponse>("/products/upload", {
      file_name: file.name,
    });
    const { upload_url, file_url } = response.data;

    // Step 2: Upload the file directly to the presigned URL (e.g., to S3).
    await axios.put(upload_url, file, {
      headers: { "Content-Type": file.type },
    });
    return file_url;
  };

  /**
   * Handles the file selection event for the main product images.
   * It validates the selected files' dimensions before starting the cropping process.
   */
  const handleMainImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    const validFiles: File[] = [];

    // Asynchronously check the dimensions of each selected image.
    const checkPromises = files.map(
      (file) =>
        new Promise<void>((resolve) => {
          const img = new window.Image();
          img.onload = () => {
            if (img.width >= 800 && img.height >= 800) {
              validFiles.push(file);
            } else {
              toast.error(`Image ${file.name} must be at least 800x800 pixels`);
            }
            resolve();
          };
          img.src = URL.createObjectURL(file);
        })
    );
    await Promise.all(checkPromises);

    // Start the cropping process only with the files that passed validation.
    if (validFiles.length > 0) {
      startCroppingProcess(validFiles, "main");
    }
    // Reset the file input to allow selecting the same file again.
    if (mainImageInputRef.current) mainImageInputRef.current.value = "";
  };

  // (handleVariantImageChange has identical logic to handleMainImageChange)
  const handleVariantImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    sku: string
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    const validFiles: File[] = [];
    const checkPromises = files.map(
      (file) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            if (img.width >= 800 && img.height >= 800) {
              validFiles.push(file);
            } else {
              toast.error(`Image ${file.name} must be at least 800×800 pixels`);
            }
            resolve();
          };
          img.src = URL.createObjectURL(file);
        })
    );
    await Promise.all(checkPromises);
    if (validFiles.length > 0) {
      startCroppingProcess(validFiles, sku);
    }
    if (variantImageInputRefs.current[sku])
      variantImageInputRefs.current[sku]!.value = "";
  };

  /**
   * Calls the backend API to delete a file from the storage (e.g., S3).
   */
  const deleteImageFromS3 = async (imageUrl: string) => {
    try {
      await api.delete(`/products/delete_image`, {
        data: { file_url: imageUrl },
      });
    } catch (error) {
      console.error("Error deleting image from S3:", error);
      // Optionally show a toast error to the user.
    }
  };

  /**
   * Removes a main product image from both the backend and the local/global state.
   */
  const removeMainImage = async (imageUrl: string) => {
    await deleteImageFromS3(imageUrl);
    // Update local preview state.
    setMainPreviews((prev) => prev.filter((url) => url !== imageUrl));
    // Update global form state.
    updateFormData("media", {
      ...media,
      mainImage: media?.mainImage?.filter((url) => url !== imageUrl) || [],
    });
    toast.info("Main image removed");
  };

  /**
   * Removes a variant-specific image.
   */
  const removeVariantImage = async (sku: string, imageUrl: string) => {
    await deleteImageFromS3(imageUrl);
    // Update local preview state.
    setVariantPreviews((prev) => ({
      ...prev,
      [sku]: prev[sku]?.filter((url) => url !== imageUrl) || [],
    }));
    // Update global form state.
    const existingVariantImages = media?.variantImages || [];
    const updatedVariantImages = existingVariantImages
      .map((vi) =>
        vi.sku === sku
          ? { ...vi, images: vi.images.filter((url) => url !== imageUrl) }
          : vi
      )
      .filter((vi) => vi.images.length > 0); // Remove the variant entry if it has no images left.
    updateFormData("media", { ...media, variantImages: updatedVariantImages });
    toast.info("Variant image removed");
  };

  return (
    <div className="bg-white rounded-lg">
      <Modal
        isOpen={!!croppingImage}
        ariaHideApp={false}
        onRequestClose={() => {
          setCroppingImage(null);
          setFilesToProcess([]);
        }}
        style={{
          content: {
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "95vw",
            maxWidth: "720px",
            height: "auto",
            maxHeight: "90vh",
            padding: "1rem",
            borderRadius: "12px",
            overflow: "hidden",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          },
          overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1000 },
        }}
      >
        {croppingImage && (
          <>
            <div className="relative w-full h-[65vh] sm:h-[500px] bg-black rounded-lg">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1 / 1.15}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
                cropShape="rect"
                showGrid={true}
                objectFit="contain"
              />
              <div className="absolute bottom-0 w-full p-4 flex flex-col items-center z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full max-w-[280px] sm:max-w-[400px]"
                />
              </div>
            </div>
            <button
              onClick={handleCrop}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full sm:w-auto sm:self-center"
            >
              {currentFileIndex < filesToProcess.length - 1
                ? "Save & Next"
                : "Save & Finish"}
            </button>
          </>
        )}
      </Modal>

      <div>
        <h1 className="text-base sm:text-lg font-semibold">Media Assets</h1>
        <p className="text-gray-500 text-xs sm:text-sm">
          Upload images for your product and variants
        </p>
      </div>

      <div className="grid gap-6 mt-4">
        <div className="border border-gray-200 p-4 sm:p-6 rounded-xl">
          <h2 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
            <FiImage className="text-gray-400" />
            Thumbnail Images
            {isUploading.main && (
              <span className="text-xs text-blue-500 ml-2">Uploading...</span>
            )}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {mainPreviews.map((imageUrl, index) => (
              <div key={index} className="relative group aspect-[1/1.15]">
                <img
                  src={imageUrl}
                  alt={`Main product image ${index + 1}`}
                  className="w-full h-full object-cover object-top rounded-lg border border-gray-200"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeMainImage(imageUrl);
                  }}
                  className="absolute top-1 right-1 bg-white p-1 rounded-full shadow-md hover:bg-gray-100 transition opacity-0 group-hover:opacity-100"
                  aria-label="Remove image"
                >
                  <FiTrash2 className="text-red-500 text-sm" />
                </button>
              </div>
            ))}
            <div
              onClick={handleMainImageClick}
              className="cursor-pointer aspect-[1/1.15] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-1 text-gray-400 text-center hover:bg-gray-50 p-2"
            >
              <FiPlus className="text-xl" />
              <span className="text-xs sm:text-sm">Add Images</span>
              <span className="text-[10px] sm:text-xs">Max 5MB</span>
            </div>
          </div>
          <input
            ref={mainImageInputRef}
            type="file"
            accept=".svg,.png,.jpg,.jpeg,.webp"
            className="hidden"
            onChange={handleMainImageChange}
            disabled={isUploading.main}
            multiple
          />
        </div>

        {variantsList.map((variant) => {
          const sku = variant.sku;
          const variantImages = variantPreviews[sku] || [];
          const isUploadingVariant = isUploading.variants[sku];
          return (
            <div
              key={sku}
              className="border border-gray-200 rounded-xl p-4 sm:p-6"
            >
              <h2 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
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
                  <div key={index} className="relative group aspect-[1/1.15]">
                    <img
                      src={imageUrl}
                      alt={`Variant ${sku} image ${index + 1}`}
                      className="w-full h-full object-cover object-top rounded-lg border border-gray-200"
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
                  className="cursor-pointer aspect-[1/1.15] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-1 text-gray-400 text-center hover:bg-gray-50 p-2"
                >
                  <FiPlus className="text-xl" />
                  <span className="text-xs sm:text-sm">Add Images</span>
                  <span className="text-[10px] sm:text-xs">Max 5MB</span>
                </div>
                <input
                  ref={(el) => {
                    variantImageInputRefs.current[sku] = el;
                  }}
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
