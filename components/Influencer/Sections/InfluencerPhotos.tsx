"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import Cropper, { Area } from "react-easy-crop";
import Modal from "react-modal";
import { FiImage, FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { useInfluencerStore } from "@/store/influencerStore";
import getCroppedImg from "@/lib/cropImage";

/* ============================================================
   TYPES & INTERFACES
============================================================ */

interface UploadResponse {
  upload_url: string;
  file_url: string;
}

type MediaKitField = "profilePhoto" | "portfolioFile";

interface ComponentProps {
  onNext: () => void;
  isLastStep?: boolean;
}



/* ============================================================
   COMPONENT: InfluencerPhotos
============================================================ */

export default function InfluencerPhotos({ onNext, isLastStep }: ComponentProps) {
  const { mediaKit, updateMediaKit } = useInfluencerStore();

  const fileInputRefs = useRef<{ [key in MediaKitField]?: HTMLInputElement }>({});

  // Cropping modal state
  const [croppingFile, setCroppingFile] = useState<File | null>(null);
  const [currentField, setCurrentField] = useState<MediaKitField | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  // Upload state
  const [isUploading, setIsUploading] = useState<{ [key in MediaKitField]?: boolean }>({});
  const [uploadProgress, setUploadProgress] = useState<{ [key in MediaKitField]?: number }>({});

  // Memoized crop preview
  const imageSrc = useMemo(
    () => (croppingFile ? URL.createObjectURL(croppingFile) : ""),
    [croppingFile]
  );

  // Cleanup temporary object URLs
  useEffect(() => {
    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
    };
  }, [imageSrc]);

  /* ============================================================
     HANDLERS
  ============================================================ */

  const startCropping = (file: File, field: MediaKitField) => {
    setCroppingFile(file);
    setCurrentField(field);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  const handleFileSelect = async (
    field: MediaKitField,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    const objUrl = URL.createObjectURL(file);
    img.src = objUrl;

    img.onload = () => {
      if (img.width < 800 || img.height < 800) {
        toast.error("Image must be at least 800×800 pixels");
      } else {
        startCropping(file, field);
      }
      URL.revokeObjectURL(objUrl);
    };

    img.onerror = () => {
      toast.error("Unable to load image file");
      URL.revokeObjectURL(objUrl);
    };

    // Allow selecting same file again
    if (fileInputRefs.current[field]) {
      fileInputRefs.current[field]!.value = "";
    }
  };

  const handleCropComplete = (_: any, cropped: Area) => {
    setCroppedAreaPixels(cropped);
  };

  const handleCropAndUpload = async () => {
    if (!croppingFile || !currentField || !croppedAreaPixels) return;
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels, 0.9);
      if (!croppedBlob) throw new Error("Failed to crop image");

      const croppedFile = new File([croppedBlob], croppingFile.name, {
        type: "image/jpeg",
      });

      setCroppingFile(null);
      await uploadToS3(croppedFile, currentField);
    } catch (err) {
      console.error("Cropping/upload error:", err);
      toast.error("Failed to upload image");
      setCroppingFile(null);
    }
  };

  const uploadToS3 = async (file: File, field: MediaKitField) => {
    try {
      setIsUploading((prev) => ({ ...prev, [field]: true }));
      setUploadProgress((prev) => ({ ...prev, [field]: 0 }));

      const res = await api.post<UploadResponse>("/stores/upload", {
        file_name: file.name,
      });
      const { upload_url, file_url } = res.data;

      await api.put(upload_url, file, {
        headers: { "Content-Type": file.type },
        onUploadProgress: (event) => {
          if (event.total) {
            const percent = Math.round((event.loaded * 100) / event.total);
            setUploadProgress((prev) => ({ ...prev, [field]: percent }));
          }
        },
      });

      updateMediaKit({ [field]: file_url });
      toast.success("Image uploaded successfully!");
    } catch (error: any) {
      toast.error(error.message || "Upload failed");
    } finally {
      setIsUploading((prev) => ({ ...prev, [field]: false }));
    }
  };

  const removeImage = async (field: MediaKitField) => {
    const url = mediaKit[field];
    if (!url) return;

    updateMediaKit({ [field]: null });
    try {
      await api.delete("/products/delete_image", {
        data: { file_url: url },
      });
      toast.info("Image removed");
    } catch (err) {
      console.error(err);
      updateMediaKit({ [field]: url });
      toast.error("Failed to remove image");
    }
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      mediaKit.profilePhoto &&
      mediaKit.portfolioFile
    ) {
      onNext();
    } else {
      toast.error("Please upload all three images before continuing.");
    }
  };

  /* ============================================================
     UI CONFIG
  ============================================================ */

  const uploadFields: { id: string; label: string; field: MediaKitField; aspect: number }[] = [
    { id: "profilePhoto", label: "Upload your profile photo", field: "profilePhoto", aspect: 1 },
    { id: "portfolioFile", label: "Upload a portfolio shot", field: "portfolioFile", aspect: 3 / 2 },
  ];

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <>
      {/* --- Cropper Modal --- */}
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
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          },
          overlay: { backgroundColor: "rgba(0, 0, 0, 0.6)", zIndex: 1000 },
        }}
      >
        {croppingFile && (
          <>
            <div className="relative w-full h-[65vh] sm:h-[500px] bg-black rounded-lg">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={
                  uploadFields.find((f) => f.field === currentField)?.aspect || 1
                }
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
                cropShape="rect"
                showGrid
                zoomWithScroll
                objectFit="contain"
              />
              <div className="absolute bottom-0 w-full p-4 flex flex-col items-center bg-gradient-to-t from-black/80 via-black/40 to-transparent">
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
              className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full sm:w-auto sm:self-center hover:bg-blue-700"
            >
              Crop & Upload
            </button>
          </>
        )}
      </Modal>

      {/* --- Upload Form --- */}
      <form
        onSubmit={handleNext}
        className="bg-white p-8 rounded-2xl shadow-sm border space-y-6"
      >
        <h2 className="text-xl font-semibold">Profile Photos</h2>
        <p className="text-gray-500 text-sm">
          Upload clear, high-quality images (minimum 800×800 pixels).
        </p>

        {uploadFields.map(({ id, label, field }) => {
          const url = mediaKit[field];
          const uploading = isUploading[field];
          const progress = uploadProgress[field] || 0;

          return (
            <div key={id} className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">
                  {label} <span className="text-red-500">*</span>
                </h3>
                {uploading && (
                  <span className="text-sm text-blue-600">{progress}%</span>
                )}
              </div>

              <div
                onClick={() =>
                  !url && !uploading && fileInputRefs.current[field]?.click()
                }
                className="relative group w-full max-w-lg mx-auto border-2 border-dashed border-gray-300 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-50 transition"
              >
                <input
                  ref={(el) => (fileInputRefs.current[field] = el!)}
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                  onChange={(e) => handleFileSelect(field, e)}
                />
                {uploading ? (
                  <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                    <p>Uploading {progress}%</p>
                    <div className="w-2/3 bg-gray-200 h-2 rounded-full mt-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                ) : url ? (
                  <div className="relative">
                    <img
                      src={url}
                      alt={label}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(field)}
                      className="absolute top-2 right-2 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition"
                    >
                      <FiTrash2 className="text-red-500" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                    <FiImage className="h-10 w-10 mb-2" />
                    <p>Click to upload</p>
                    <p className="text-xs text-gray-400">PNG, JPG, WEBP — Max 5MB</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <div className="pt-6 border-t flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 disabled:bg-gray-400"
            disabled={Object.values(isUploading).some(Boolean)}
          >
            {isLastStep ? "Submit" : "Next →"}
          </button>
        </div>
      </form>
    </>
  );
}
