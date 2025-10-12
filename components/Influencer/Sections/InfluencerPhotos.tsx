"use client";

import { api } from "@/lib/axios";
import { useInfluencerStore } from "@/store/influencerStore";
import React, { useState, useRef, useMemo, useEffect } from "react";
import Cropper, { Area } from "react-easy-crop";
import { FiImage, FiPlus, FiTrash2 } from "react-icons/fi";
import Modal from "react-modal";
import { toast } from "sonner";

// --- Helper Dependencies (as seen in your reference component) ---

/**
 * @interface UploadResponse
 * @description Defines the structure of the response from the presigned URL API endpoint.
 */
interface UploadResponse {
  upload_url: string; // The presigned URL to which the file should be PUT.
  file_url: string; // The final, public URL of the uploaded file.
}



/**
 * This function was part of your reference component's dependencies (`@/lib/cropImage`).
 * It takes an image source and cropping parameters to return a cropped image blob.
 *
 * @param {string} imageSrc - The URL of the source image.
 * @param {Area} crop - The area to crop, from react-easy-crop.
 * @param {number} quality - The quality of the output image (0 to 1).
 * @returns {Promise<Blob | null>} A promise that resolves with the cropped image as a Blob.
 */
async function getCroppedImg(
  imageSrc: string,
  crop: Area,
  quality: number = 0.9
): Promise<Blob | null> {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = reject;
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  canvas.width = crop.width;
  canvas.height = crop.height;

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, "image/jpeg", quality);
  });
}




// --- Component Definition ---

interface ComponentProps {
  onNext: () => void;
  isLastStep?: boolean;
}

type MediaKitField = "profilePhoto" | "fullLengthPhoto" | "portfolioFile";

export default function InfluencerPhotos({
  onNext,
  isLastStep,
}: ComponentProps) {
  const { mediaKit, updateMediaKit } = useInfluencerStore();
  const fileInputRefs = useRef<{ [key in MediaKitField]?: HTMLInputElement }>(
    {}
  );

  // State for the cropping modal
  const [croppingFile, setCroppingFile] = useState<File | null>(null);
  const [currentField, setCurrentField] = useState<MediaKitField | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isUploading, setIsUploading] = useState<{ [key in MediaKitField]?: boolean }>({});

  // Memoized URL for the image currently in the cropper
  const imageSrc = useMemo(
    () => (croppingFile ? URL.createObjectURL(croppingFile) : ""),
    [croppingFile]
  );

  // Effect to clean up the object URL
  useEffect(() => {
    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
    };
  }, [imageSrc]);
  
  // Set the app element for react-modal
  useEffect(() => {
    Modal.setAppElement('body');
  }, []);

  /**
   * Initializes the cropping process.
   */
  const startCroppingProcess = (file: File, field: MediaKitField) => {
    setCroppingFile(file);
    setCurrentField(field);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  /**
   * Handles file selection, validates dimensions, and starts the cropping process.
   */
  const handleFileSelect = async (
    field: MediaKitField,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    // Validate image dimensions (must be at least 800x800)
    const img = new window.Image();
    const objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;
    img.onload = () => {
      if (img.width >= 800 && img.height >= 800) {
        startCroppingProcess(file, field);
      } else {
        toast.error(`Image must be at least 800x800 pixels.`);
      }
      URL.revokeObjectURL(objectUrl); // Clean up
    };
    img.onerror = () => {
        toast.error('Could not load image file.');
        URL.revokeObjectURL(objectUrl);
    }

    // Reset the input value to allow re-selecting the same file
    if (fileInputRefs.current[field]) {
      fileInputRefs.current[field]!.value = "";
    }
  };

  /**
   * Handles the 'Save' button click in the modal. Crops the image and starts the upload.
   */
  const handleCropAndUpload = async () => {
    if (!croppedAreaPixels || !croppingFile || !currentField) return;

    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (!croppedBlob) throw new Error("Failed to crop image.");

      const croppedFile = new File([croppedBlob], croppingFile.name, {
        type: "image/jpeg",
      });

      // Close the modal and reset state before starting the upload
      setCroppingFile(null);
      
      // Process the upload
      await processFileUpload(croppedFile, currentField);
      
    } catch (error) {
      console.error("Cropping failed:", error);
      toast.error("Failed to process image. Please try again.");
      setCroppingFile(null); // Ensure modal closes on error
    }
  };

  /**
   * Manages the full upload lifecycle for a single cropped file.
   */
  const processFileUpload = async (file: File, field: MediaKitField) => {
    setIsUploading((prev) => ({ ...prev, [field]: true }));
    try {
      const file_url = await uploadFile(file);
      updateMediaKit({ [field]: file_url });
      toast.success("Image uploaded successfully!");
    } catch (error: any) {
      toast.error(error.message || "Upload failed. Please try again.");
    } finally {
      setIsUploading((prev) => ({ ...prev, [field]: false }));
    }
  };

  /**
   * Handles the two-step file upload (get presigned URL, then PUT file).
   */
  const uploadFile = async (file: File): Promise<string> => {
    if (file.size > 5 * 1024 * 1024)
      throw new Error("File too large. Maximum size is 5MB.");

    const response = await api.post<UploadResponse>("/influencers/upload", {
      file_name: file.name,
    });
    const { upload_url, file_url } = response.data;

    await api.put(upload_url, file, {
      headers: { "Content-Type": file.type },
    });
    return file_url;
  };

  /**
   * Removes an image from the backend and updates the state.
   */
  const removeImage = async (field: MediaKitField) => {
    const imageUrl = mediaKit[field] as string;
    if (!imageUrl) return;

    // Optimistically update the UI
    updateMediaKit({ [field]: null });
    toast.info("Image removed.");

    try {
      // Call the backend to delete the file from storage
      await api.delete(`/influencers/delete_image`, {
        data: { file_url: imageUrl },
      });
    } catch (error) {
      console.error("Failed to delete image from server:", error);
      // Revert if the API call fails
      updateMediaKit({ [field]: imageUrl });
      toast.error("Could not remove image. Please try again.");
    }
  };

  /**
   * Validates that all fields have a URL before proceeding.
   */
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      mediaKit.profilePhoto &&
      mediaKit.fullLengthPhoto &&
      mediaKit.portfolioFile
    ) {
      onNext();
    } else {
      toast.error("All three images are required. Please upload one for each section.");
    }
  };
  
  const uploadFields: { id: string; label: string; field: MediaKitField, aspect: number }[] = [
    { id: 'profilePhoto', label: 'Upload your profile photo', field: 'profilePhoto', aspect: 1 / 1 },
    { id: 'fullLengthPhoto', label: 'Upload a full-length photo', field: 'fullLengthPhoto', aspect: 1 / 1.5 },
    { id: 'portfolioFile', label: 'Upload a portfolio shot', field: 'portfolioFile', aspect: 1.5 / 1 },
  ];

  return (
    <>
      <Modal
        isOpen={!!croppingFile}
        ariaHideApp={false}
        onRequestClose={() => setCroppingFile(null)}
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
            border: "none",
          },
          overlay: { backgroundColor: "rgba(0, 0, 0, 0.7)", zIndex: 1000 },
        }}
      >
        {croppingFile && (
          <>
            <div className="relative w-full h-[65vh] sm:h-[500px] bg-black rounded-lg">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={uploadFields.find(f => f.field === currentField)?.aspect || 1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, area) => setCroppedAreaPixels(area)}
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
              onClick={handleCropAndUpload}
              className="bg-black text-white px-4 py-2 rounded-lg w-full sm:w-auto sm:self-center hover:bg-gray-800"
            >
              Save & Upload
            </button>
          </>
        )}
      </Modal>

      <form onSubmit={handleNext} className="bg-white p-8 rounded-lg shadow-sm border animate-fade-in">
        <h2 className="text-2xl font-semibold mb-2">Profile Photos</h2>
        <p className="text-sm text-gray-500 mb-8">
          Upload high-quality images for your profile. Minimum 800x800 pixels required.
        </p>

        <div className="space-y-6">
          {uploadFields.map(({ id, label, field }) => {
            const imageUrl = mediaKit[field] as string;
            const isFieldUploading = isUploading[field];

            return (
              <div key={id}>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {label}
                  <span className="text-red-500">*</span>
                   {isFieldUploading && (
                     <span className="text-sm text-blue-500 ml-2 font-normal">Uploading...</span>
                   )}
                </h3>
                <div
                  className="relative group w-full aspect-[16/9] sm:aspect-[2/1] border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors duration-200"
                  onClick={() => !imageUrl && !isFieldUploading && fileInputRefs.current[field]?.click()}
                >
                  <input
                    ref={(el) => (fileInputRefs.current[field] = el!)}
                    id={`fileInput-${id}`}
                    type="file"
                    className="hidden"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={(e) => handleFileSelect(field, e)}
                    disabled={isFieldUploading}
                  />
                  {imageUrl ? (
                     <>
                        <img
                           src={imageUrl}
                           alt={label}
                           className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                           type="button"
                           onClick={() => removeImage(field)}
                           className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition opacity-0 group-hover:opacity-100"
                           aria-label="Remove image"
                        >
                           <FiTrash2 className="text-red-500 text-base" />
                        </button>
                     </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                      <FiImage className="h-10 w-10 mb-2" />
                      <p className="font-semibold">Click to upload</p>
                      <p className="text-xs">PNG, JPG or WEBP. Max 5MB.</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end mt-12 pt-6 border-t">
          <button
            type="submit"
            className="px-8 py-3 bg-black text-white rounded-md font-semibold hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400"
            disabled={Object.values(isUploading).some(Boolean)}
          >
            {isLastStep ? 'Submit' : 'Next →'}
          </button>
        </div>
      </form>
    </>
  );
}


