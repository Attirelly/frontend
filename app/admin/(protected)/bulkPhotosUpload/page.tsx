"use client";
import React, { useRef, useState, useEffect, useMemo } from "react";
import Select from "react-select";
// Removed: useSellerStore
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

export interface City {
  id: string;
  name: string;
  state_id: string;
}

export interface AreaType {
  id: string;
  name: string;
  city_id: string;
  city_name?: string;
}

interface Store {
  store_id: string;
  store_name: string;
  city: City;
  area: AreaType;
}

type StoreOption = {
  value: string;
  label: string;
};

/**
 * StoreSetupForm component
 *
 * A self-contained form for creating a new store. It handles store name input
 * and the uploading of a store's profile photo. It includes a comprehensive
 * flow for file selection, validation, in-browser cropping, and a secure,
 * multi-step upload to S3.
 *
 * ## Features
 * - **Store Name Input**: A simple text field for the store's name.
 * - **Image Cropping**: Integrates `react-easy-crop` in a modal for a 1:1 aspect ratio.
 * - **Client-Side Validation**: Checks for minimum image dimensions (800x800).
 * - **Secure S3 Upload**: Uses a two-step process (request pre-signed URL, then PUT file).
 * - **Upload Progress**: Displays a progress bar during the S3 upload.
 * - **Image Preview & Deletion**: Shows a preview and allows deletion (triggers S3 delete).
 * - **Local State**: Manages all data (store name, profile URL) using local `useState` hooks.
 * - **Submission**: A "Create Store" button validates both fields and generates a
 * JSON payload with the `storeName` and `profileUrl`.
 *
 * ## Logic Flow
 * 1.  The user fills in the "Store Name" input.
 * 2.  The user clicks the upload area, selects an image.
 * 3.  `handleFileChange` validates the image size and opens the cropper modal.
 * 4.  The user crops the image and clicks "Crop & Upload".
 * 5.  `getCroppedImg` creates a `Blob` of the cropped image.
 * 6.  `uploadToS3` gets a pre-signed URL, uploads the blob, and returns the final `file_url`.
 * 7.  The `profileUrl` state is set, displaying the preview.
 * 8.  The user clicks "Create Store".
 * 9.  `handleSubmit` validates that `storeName` and `profileUrl` are not empty.
 * 10. A JSON payload is created and logged to the console (ready for an API call).
 *
 * ## API Calls
 * - POST `/stores/upload`: To get a pre-signed URL for uploading a file to S3.
 * - PUT (to a dynamic pre-signed URL): To upload the actual file data to S3.
 * - DELETE `/products/delete_image`: To delete an uploaded image from S3.
 *
 * @returns {JSX.Element} The rendered store setup form.
 */
export default function BulkPhotosUploadPage() {
  // --- Local State Implementation ---
  // Removed Zustand state. Using local useState instead.
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState(""); // Stores the ID of the selected store
  const [storeName, setStoreName] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [isLoadingStores, setIsLoadingStores] = useState(false);
  // ------------------------------------

  const [selectedStoreOption, setSelectedStoreOption] =
    useState<StoreOption | null>(null);

  const [profileUploading, setProfileUploading] = useState(false);
  const [profileProgress, setProfileProgress] = useState(0);

  const profileInputRef = useRef<HTMLInputElement>(null);
  const handleProfileClick = () => profileInputRef.current?.click();

  const [croppingImage, setCroppingImage] = useState<File | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  // --- Data Fetching ---
  const fetchStores = async () => {
    setIsLoadingStores(true);
    try {
      const response = await api.get("/stores/");
      setStores(response.data);
    } catch (error) {
      console.error("Error fetching stores:", error);
      toast.error("Failed to fetch stores.");
    } finally {
      setIsLoadingStores(false);
    }
  };

  // Fetch stores on component mount
  useEffect(() => {
    fetchStores();
  }, []);

  // Format stores for react-select, memoized for performance
  const storeOptions: StoreOption[] = useMemo(() => {
    return stores.map((store) => ({
      value: store.store_id,
      label: `${store.store_name} (${store?.area?.name}, ${store?.city?.name})`,
    }));
  }, [stores]);

  // Handler for store selection change
  const handleStoreChange = (selectedOption: StoreOption | null) => {
    setSelectedStoreId(selectedOption ? selectedOption.value : "");
    // setStoreName(selectedOption ? selectedOption.label : "");
    setSelectedStoreOption(selectedOption); // Set the full object for the Select's value
  };
  // -------------------------

  const handleCropComplete = (_: Area, croppedAreaPixels: Area): void => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const imageSrc = useMemo(
    () => (croppingImage ? URL.createObjectURL(croppingImage) : ""),
    [croppingImage]
  );

  useEffect(() => {
    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
    };
  }, [imageSrc]);

  async function deleteImageFromS3(imageUrl: string): Promise<void> {
    try {
      await api.delete(`/products/delete_image`, {
        data: { file_url: imageUrl },
      });
    } catch (error) {
      console.error("Error deleting image from S3:", error);
    }
  }

  const removeMainImage = async (imageUrl: string): Promise<void> => {
    try {
      if (!imageUrl) return;
      await deleteImageFromS3(imageUrl);
      setProfileUrl(""); // Clear the local profile image URL

      // Removed Zustand update logic
    } catch (error) {
      console.error("Error removing main image:", error);
    }
  };

  const uploadToS3 = async (file: File): Promise<string | null> => {
    try {
      setProfileUploading(true);
      const response = await api.post<UploadResponse>("/stores/upload", {
        file_name: file.name,
      });
      const { upload_url, file_url } = response.data;

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
      return file_url;
    } catch (error: any) {
      toast.error(error.message || "Upload failed. Please try again.");
      return null;
    } finally {
      setProfileUploading(false);
    }
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.onload = () => {
      if (img.width < 800 || img.height < 800) {
        toast.error("Image must be at least 800×800 pixels");
        return;
      }
      setCroppingImage(file);
    };
    img.src = URL.createObjectURL(file);
  };

  // --- New Submit Handler ---
  /**
   * Validates form inputs and creates the final JSON payload.
   */
  const handleSubmit = async (): Promise<void> => {
    // 1. Validate Store Name
    if (!selectedStoreId) {
      toast.error("Please select a store.");
      return;
    }

    // 2. Validate Profile Photo
    if (!profileUrl) {
      toast.error("Please upload a profile photo.");
      return;
    }

    // 3. Create JSON Payload
    // const payload = {
    //   store_id: selectedStoreId,
    //   store_name: selectedStoreOption?.label,
    //   photo_url: profileUrl,
    // };
    const photos_payload = {
      profile_image: profileUrl,
      // curr_section: 5,
    };
    console.log(photos_payload);
    try {
      // const res = await api.post(
      //   "/ambassador/upload_data?context=store_photos",
      //   payload
      // );
      await api.put(`/stores/${selectedStoreId}`, photos_payload);
      toast.success("Form submitted successfully!");
      setSelectedStoreOption(null); // This clears the react-select component
      setSelectedStoreId(""); // Clear the ID state
      setProfileUrl(""); // Clear the image preview
      handleStoreChange(null);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        (err instanceof Error ? err.message : undefined) ||
        String(err);
      toast.error(message || "Submission failed. Please try again.");
    }
  };

  // Removed useEffect that updated Zustand store

  return (
    <div className="mx-auto space-y-6 bg-white p-4 sm:p-6 rounded-2xl shadow-sm text-black max-w-2xl">
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setZoom(Number(e.target.value))
                  }
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
        <h1 className="text-lg sm:text-xl font-semibold">Create Your Store</h1>
        <p className="text-gray-500 text-sm sm:text-base">
          Enter your store's name and upload a profile photo.
        </p>
      </div>

      <div className="border-t border-gray-300 -mx-4 sm:-mx-6"></div>

      {/* --- New Store Name Input --- */}
      <div className="space-y-2">
        <label
          htmlFor="storeName"
          className="block text-base font-semibold text-gray-900"
        >
          Store Name <span className="text-red-500">*</span>
        </label>
        {/* <input
          type="text"
          id="storeName"
          value={storeName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setStoreName(e.target.value)
          }
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="My Awesome Store"
        /> */}
        <Select<StoreOption>
          instanceId="store-select"
          options={storeOptions}
          value={selectedStoreOption}
          onChange={handleStoreChange}
          isLoading={isLoadingStores}
          isClearable
          isSearchable
          placeholder="Search and select a store..."
          styles={{
            control: (base) => ({
              ...base,
              borderRadius: "0.5rem",
              borderColor: "#D1D5DB", // gray-300
              padding: "0.1rem",
            }),
            menu: (base) => ({
              ...base,
              borderRadius: "0.5rem",
              zIndex: 50, // Ensure dropdown is on top
            }),
          }}
        />
        <p className="text-gray-500 text-xs sm:text-sm">
          This will be your public-facing store name.
        </p>
      </div>

      <div className="border-t border-gray-200"></div>

      {/* --- Profile Photo Upload Section --- */}
      <div className="grid grid-cols-1 gap-6">
        <div
          onClick={handleProfileClick}
          className="w-full cursor-pointer border border-dashed border-gray-300 p-4 sm:p-6 rounded-xl text-center hover:bg-gray-50 transition"
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
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
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
              Click to upload image (800x800 min)
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

      {/* --- New Submit Button --- */}
      <div className="border-t border-gray-300 -mx-4 sm:-mx-6 pt-6 mt-6 px-4 sm:px-6">
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
          disabled={profileUploading}
        >
          {profileUploading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
}
