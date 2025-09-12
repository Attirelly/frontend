"use client";
import React, { useRef, useState, useEffect, useMemo } from "react";
import { useSellerStore } from "@/store/sellerStore";
import { api } from "@/lib/axios";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/lib/cropImage";
import Modal from "react-modal";
import { Area } from "react-easy-crop";
import { FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";

interface UploadResponse {
  upload_url: string;
  file_url: string;
}

/**
 * PhotosPage component
 * 
 * A form component for the seller onboarding/dashboard that handles the uploading
 * of the store's profile photo. It includes a comprehensive flow for file selection,
 * validation, in-browser cropping, and a secure, multi-step upload to S3.
 *
 * ## Features
 * - **Image Cropping**: Integrates `react-easy-crop` in a modal. When a user selects an image, they can pan and zoom to crop it to a perfect 1:1 aspect ratio.
 * - **Client-Side Validation**: Before opening the cropper, it checks if the selected image meets minimum dimensions (800x800 pixels).
 * - **Secure S3 Upload**: Implements a secure, two-step upload process. It first requests a pre-signed S3 upload URL from the backend, then uploads the file directly to that URL.
 * - **Upload Progress**: Displays a progress bar to give the user real-time feedback during the S3 upload.
 * - **Image Preview & Deletion**: Once an image is uploaded, it displays a preview. The user can also delete the image, which triggers an API call to remove the file from S3.
 * - **State Management**: Hydrates its state from the `useSellerStore` and continuously syncs the final image URL back to the store.
 *
 * ## Logic Flow
 * 1.  The component mounts and initializes its state from the `useSellerStore`.
 * 2.  The user clicks the upload area, which triggers a hidden file input.
 * 3.  The `handleFileChange` function validates the selected image's dimensions. If valid, the file is stored in state, which opens a modal containing the image cropper.
 * 4.  The user adjusts the crop and zoom within the modal.
 * 5.  Upon clicking "Crop & Upload", the `getCroppedImg` utility function creates a new `Blob` of the cropped image area directly in the browser.
 * 6.  This `Blob` is then passed to the `uploadToS3` function.
 * 7.  `uploadToS3` first calls `POST /stores/upload` to get a pre-signed URL from the backend.
 * 8.  It then uses this URL to `PUT` the cropped image file directly to S3, updating the UI with the upload progress.
 * 9.  Upon successful upload, the final S3 file URL is returned and saved to both local and global state.
 * 10. If the user clicks the delete icon on an uploaded image, `removeMainImage` is called. This triggers a `DELETE /products/delete_image` API call to remove the file from S3 and clears the URL from the state.
 *
 * ## Imports
 * - **Core/Libraries**: `useRef`, `useState`, `useEffect`, `useMemo`, `FC` from `react`.
 * - **State (Zustand Stores)**:
 *    - `useSellerStore`: For reading and writing the store's photo URLs.
 * - **Key Components & Libraries**:
 *    - `Cropper` from `react-easy-crop`: The image cropping component.
 *    - `Modal` from `react-modal`: For displaying the cropper in a modal overlay.
 *    - `FiTrash2` from `react-icons/fi`: The trash icon for the delete button.
 *    - `toast` from `sonner`: For displaying notifications.
 * - **Utilities**:
 *    - `api` from `@/lib/axios`: The configured Axios instance for API calls.
 *    - `getCroppedImg` from `@/lib/cropImage`: A utility function to perform the client-side image cropping.
 *
 * ## API Calls
 * - POST `/stores/upload`: To get a pre-signed URL for uploading a file to S3.
 * - PUT (to a dynamic pre-signed URL): To upload the actual file data to S3.
 * - DELETE `/products/delete_image`: To delete an uploaded image from S3.
 *
 * ## Props
 * - This component does not accept any props.
 *
 * @returns {JSX.Element} The rendered store photos upload form.
 */
export default function PhotosPage() {
  const { storePhotosData, setStorePhotosData, setStorePhotosValid } =
    useSellerStore();

  const [profileUrl, setProfileUrl] = useState(
    storePhotosData?.profileUrl || ""
  );
  const [profileUploading, setProfileUploading] = useState(false);
  const [profileProgress, setProfileProgress] = useState(0);

  const profileInputRef = useRef<HTMLInputElement>(null);
  const handleProfileClick = () => profileInputRef.current?.click();

  const [croppingImage, setCroppingImage] = useState<File | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  // Called when user finishes cropping the image
  // `croppedArea` contains the crop dimensions in pixels
  const handleCropComplete = (_: any, croppedArea: Area) => {
    setCroppedAreaPixels(croppedArea);
  };

  // Generate a temporary object URL from the selected image file for preview
  const imageSrc = useMemo(
    () => (croppingImage ? URL.createObjectURL(croppingImage) : ""),
    [croppingImage]
  );

  // Cleanup effect: when imageSrc changes or component unmounts, revoke the object URL to free memory
  useEffect(() => {
    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
    };
  }, [imageSrc]);

  // Helper to delete an image from S3 using your backend API
  async function deleteImageFromS3(imageUrl: string) {
    try {
      await api.delete(`/products/delete_image`, {
        data: { file_url: imageUrl }, // Send file URL in request body
      });
    } catch (error) {
      console.error("Error deleting image from S3:", error);
    }
  }

  // Remove the main profile image: delete from S3 and clear it from local state
  const removeMainImage = async (imageUrl: string) => {
    try {
      if (!imageUrl) return;
      await deleteImageFromS3(imageUrl); // Call helper to delete from S3
      setProfileUrl(""); // Clear the local profile image URL
      
      // Also update the storePhotosData state with an empty profileUrl
      let newStorePhotosData = { ...storePhotosData, profileUrl: "" };
      setStorePhotosData(newStorePhotosData);
    } catch (error) {
      console.error("Error removing main image:", error);
    }
  };

  // Upload a file to S3 and return its final public URL
  const uploadToS3 = async (file: File): Promise<string | null> => {
    try {
      setProfileUploading(true);

      // Step 1: Get a signed upload URL and target file URL from backend
      const response = await api.post<UploadResponse>("/stores/upload", {
        file_name: file.name,
      });
      const { upload_url, file_url } = response.data;

      // Step 2: Upload the file directly to S3 using the signed URL
      await api.put(upload_url, file, {
        headers: { "Content-Type": file.type || "application/octet-stream" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProfileProgress(percentCompleted);
          }
        },
      });

      // Return the final public URL of the uploaded file
      return file_url;
    } catch (error: any) {
      toast.error(error.message || "Upload failed. Please try again.");
      return null;
    } finally {
      setProfileUploading(false);
    }
  };

  // Handle when user selects an image file from file input
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.onload = () => {
      // Check minimum resolution requirement (800x800)
      if (img.width < 800 || img.height < 800) {
        toast.error("Image must be at least 800×800 pixels");
        return;
      }

       // If valid, set file to be cropped
      setCroppingImage(file);
    };
    img.src = URL.createObjectURL(file);
  };

  // When profileUrl is set (image uploaded/cropped selected), update form validation and data
  useEffect(() => {
    if (profileUrl.trim() !== "") {
      setStorePhotosValid(true); // Mark store photos as valid

      // Update the main storePhotosData state with the selected profile image URL
      let newStorePhotosData = { ...storePhotosData, profileUrl };
      setStorePhotosData(newStorePhotosData);
    }
  }, [profileUrl]);

  return (
    <div className="mx-auto space-y-6 bg-white p-4 sm:p-6 rounded-2xl shadow-sm text-black">
      <Modal
        isOpen={!!croppingImage}
        ariaHideApp={false}
        onRequestClose={() => setCroppingImage(null)}
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
                aspect={1}
                cropSize={{ width: 600, height: 600 }}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
                cropShape="rect"
                showGrid={true}
                zoomWithScroll={true}
                restrictPosition={true}
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
              onClick={async () => {
                if (!croppedAreaPixels || !croppingImage) return;
                const croppedBlob = await getCroppedImg(
                  imageSrc,
                  croppedAreaPixels,
                  0.9
                );
                if (!croppedBlob) return toast.error("Failed to crop image");
                const uploadedUrl = await uploadToS3(
                  new File([croppedBlob], croppingImage.name, {
                    type: croppingImage.type,
                  })
                );
                if (uploadedUrl) {
                  setProfileUrl(uploadedUrl);
                }
                setCroppingImage(null);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full sm:w-auto sm:self-center text-sm sm:text-base"
            >
              Crop & Upload
            </button>
          </>
        )}
      </Modal>

      <div>
        <h1 className="text-base sm:text-lg font-semibold">Profile Photo</h1>
        <p className="text-gray-500 text-xs sm:text-sm">
          Upload a square profile photo for your store
        </p>
      </div>

      <div className="border-t border-gray-300 -mx-4 sm:-mx-6"></div>

      <div className="grid grid-cols-1 gap-6">
        <div
          onClick={handleProfileClick}
          className="w-full max-w-sm cursor-pointer border border-dashed border-gray-300 p-4 sm:p-6 rounded-xl text-center hover:bg-gray-50 transition mx-auto"
        >
          <h2 className="text-base sm:text-lg font-semibold mb-4">
            Upload your profile image<span className="text-red-500">*</span>
          </h2>
          {profileUploading ? (
            <>
              <p className="text-gray-400 text-sm">
                Uploading: {profileProgress}%
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                  className="bg-green-600 h-2.5 rounded-full"
                  style={{ width: `${profileProgress}%` }}
                ></div>
              </div>
            </>
          ) : profileUrl ? (
            <div className="relative group mx-auto w-full max-w-[200px] sm:max-w-[300px]">
              <img
                src={profileUrl}
                alt="Profile Preview"
                className="w-full h-auto aspect-square object-cover object-top rounded-lg mx-auto"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeMainImage(profileUrl);
                }}
                className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100 transition opacity-0 group-hover:opacity-100"
                aria-label="Remove image"
              >
                <FiTrash2 className="text-red-500 h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="w-full h-32 sm:h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-xs sm:text-sm p-4">
              Click to upload image (svg, png, jpg)
            </div>
          )}
          <input
            ref={profileInputRef}
            type="file"
            accept=".svg,.png,.jpg,.jpeg"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>
    </div>
  );
}
