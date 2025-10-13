"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import Cropper, { Area } from "react-easy-crop";
import Modal from "react-modal";
import { FiImage, FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { useMakeupArtistStore } from "@/store/makeUpArtistStore"; // <-- UPDATED STORE
import getCroppedImg from "@/lib/cropImage"; // <-- AS REQUESTED

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
 COMPONENT: MediaKit
============================================================ */
const MediaKit: React.FC<ComponentProps> = ({ onNext, isLastStep }) => {
  const { mediaKit, updateMediaKit } = useMakeupArtistStore();

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

  const imageSrc = useMemo(() => (croppingFile ? URL.createObjectURL(croppingFile) : ""), [croppingFile]);

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

  const handleFileSelect = async (field: MediaKitField, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic client-side validation for file type and size
    if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file (PNG, JPG, WEBP).");
        return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("File size cannot exceed 5MB.");
        return;
    }

    const img = new Image();
    const objUrl = URL.createObjectURL(file);
    img.src = objUrl;

    img.onload = () => {
      if (img.width < 800 || img.height < 800) {
        toast.error("For best quality, images must be at least 800×800 pixels.");
      } else {
        startCropping(file, field);
      }
      URL.revokeObjectURL(objUrl);
    };
    img.onerror = () => {
      toast.error("Unable to load image file.");
      URL.revokeObjectURL(objUrl);
    };
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
      const croppedFile = new File([croppedBlob], croppingFile.name, { type: "image/jpeg" });
      setCroppingFile(null);
      await uploadToS3(croppedFile, currentField);
    } catch (err) {
      console.error("Cropping/upload error:", err);
      toast.error("Failed to process and upload image.");
      setCroppingFile(null);
    }
  };

  const uploadToS3 = async (file: File, field: MediaKitField) => {
    try {
      setIsUploading((prev) => ({ ...prev, [field]: true }));
      setUploadProgress((prev) => ({ ...prev, [field]: 0 }));
      const res = await api.post<UploadResponse>("/stores/upload", { file_name: file.name });
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
      toast.error(error.message || "Upload failed. Please try again.");
    } finally {
      setIsUploading((prev) => ({ ...prev, [field]: false }));
    }
  };

  const removeImage = async (field: MediaKitField) => {
    const url = mediaKit[field];
    if (!url) return;
    updateMediaKit({ [field]: null });
    // In a real app, you might want to call a backend endpoint to delete from S3
    toast.info("Image removed.");
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaKit.profilePhoto) {
      toast.error("Please upload a profile photo to continue.");
      return;
    }
    onNext();
  };

  /* ============================================================
   UI CONFIG
  ============================================================ */
  const uploadFields: { id: string; label: string; field: MediaKitField; aspect: number }[] = [
    { id: "profilePhoto", label: "Your Profile Photo", field: "profilePhoto", aspect: 1 },
    { id: "portfolioFile", label: "Main Portfolio Image (Optional)", field: "portfolioFile", aspect: 4 / 3 },
  ];

  return (
    <>
      <Modal isOpen={!!croppingFile} ariaHideApp={false} onRequestClose={() => setCroppingFile(null)}
        style={{ content: { top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "95vw", maxWidth: "720px", height: "auto", maxHeight: "90vh", padding: "1rem", borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "column", gap: "1rem" }, overlay: { backgroundColor: "rgba(0, 0, 0, 0.75)", zIndex: 1000 } }}
      >
        {croppingFile && (
          <>
            <div className="relative w-full h-[65vh] sm:h-[500px] bg-black rounded-lg">
              <Cropper image={imageSrc} crop={crop} zoom={zoom} aspect={uploadFields.find((f) => f.field === currentField)?.aspect || 1} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={handleCropComplete} />
              <div className="absolute bottom-0 w-full p-4 flex flex-col items-center bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <input type="range" min={1} max={3} step={0.1} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="w-full max-w-xs" />
              </div>
            </div>
            <button onClick={handleCropAndUpload} className="bg-black text-white px-6 py-3 rounded-lg w-full font-semibold sm:w-auto sm:self-center hover:bg-gray-800">
              Crop & Upload
            </button>
          </>
        )}
      </Modal>

      <form onSubmit={handleNext} className="bg-white p-8 rounded-lg shadow-sm border space-y-8 animate-fade-in text-black">
        <div>
            <h2 className="text-2xl font-semibold">Media Kit</h2>
            <p className="text-gray-500">Upload your key photos and set your profile's visibility.</p>
        </div>

        {uploadFields.map(({ id, label, field }) => {
          const url = mediaKit[field];
          const uploading = isUploading[field];
          const progress = uploadProgress[field] || 0;
          return (
            <div key={id}>
              <h3 className="font-medium text-gray-900 mb-2">
                {label} {field === "profilePhoto" && <span className="text-red-500">*</span>}
              </h3>
              <div onClick={() => !url && !uploading && fileInputRefs.current[field]?.click()}
                className="relative group w-full max-w-md border-2 border-dashed border-gray-300 rounded-lg overflow-hidden cursor-pointer hover:border-black transition"
              >
                <input ref={(el) => (fileInputRefs.current[field] = el!)} type="file" accept="image/png, image/jpeg, image/webp" className="hidden" onChange={(e) => handleFileSelect(field, e)} />
                {uploading ? (
                  <div className="flex flex-col items-center justify-center h-48 text-gray-700">
                    <p className="font-semibold">Uploading...</p>
                    <div className="w-4/5 bg-gray-200 h-2 rounded-full mt-2 overflow-hidden">
                      <div className="bg-black h-2 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className="text-sm mt-1">{progress}%</p>
                  </div>
                ) : url ? (
                  <div className="relative">
                    <img src={url} alt={label} className="w-full aspect-[4/3] object-cover" />
                    <button type="button" onClick={(e) => { e.stopPropagation(); removeImage(field); }} className="absolute top-2 right-2 bg-white/80 p-2 rounded-full shadow hover:bg-white transition backdrop-blur-sm">
                      <FiTrash2 className="text-red-500" size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                    <FiImage className="h-10 w-10 mb-2" />
                    <p className="font-semibold">Click to upload image</p>
                    <p className="text-xs">800x800px minimum, max 5MB</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        
        {/* NEW: Published Toggle */}
        <div className="pt-6 border-t">
            <ToggleSwitch 
                label="Make my profile public" 
                description="Once submitted and approved, your profile will be visible on the platform."
                enabled={mediaKit.published} 
                setEnabled={(val) => updateMediaKit({ published: val })} 
            />
        </div>

        <div className="flex justify-end">
          <button type="submit" className="px-8 py-3 bg-black text-white rounded-md font-semibold hover:bg-gray-800 disabled:bg-gray-400" disabled={Object.values(isUploading).some(Boolean)}>
            {isLastStep ? "Finish & Submit" : "Next →"}
          </button>
        </div>
      </form>
    </>
  );
};

// Helper component for Toggle switches
const ToggleSwitch = ({ label, description, enabled, setEnabled }: { label: string; description: string; enabled: boolean; setEnabled: (val: boolean) => void }) => (
    <div className="flex items-center justify-between">
        <div>
            <span className="text-sm font-medium text-gray-900">{label}</span>
            <p className="text-xs text-gray-500">{description}</p>
        </div>
        <button
            type="button"
            onClick={() => setEnabled(!enabled)}
            className={`${enabled ? 'bg-black' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
        >
            <span className={`${enabled ? 'translate-x-5' : 'translate-x-0'} inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} />
        </button>
    </div>
);


export default MediaKit;