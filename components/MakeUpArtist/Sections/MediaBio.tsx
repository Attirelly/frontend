"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import Cropper, { Area } from "react-easy-crop";
import Modal from "react-modal";
import { FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import getCroppedImg from "@/lib/cropImage";
import { useMakeupArtistStore } from "@/store/makeUpArtistStore";

interface ComponentProps {
  onNext: () => void;
  isLastStep?: boolean;
}

interface UploadResponse {
  upload_url: string;
  file_url: string;
}

const MediaBio: React.FC<ComponentProps> = ({ onNext, isLastStep }) => {
  const { mediaBio, updateMediaBio } = useMakeupArtistStore();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [croppingImage, setCroppingImage] = useState<File | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const imageSrc = useMemo(
    () => (croppingImage ? URL.createObjectURL(croppingImage) : ""),
    [croppingImage]
  );

  useEffect(() => {
    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
    };
  }, [imageSrc]);

  // Validate form before moving to next step
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!mediaBio.shortBio) newErrors.shortBio = "Short bio is required.";
    if (!mediaBio.profilePhoto) newErrors.profilePhoto = "Profile photo is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) onNext();
  };

  const handleCropComplete = (_: any, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  };

  const uploadToS3 = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);
      const response = await api.post<UploadResponse>("/stores/upload", {
        file_name: file.name,
      });
      const { upload_url, file_url } = response.data;

      await api.put(upload_url, file, {
        headers: { "Content-Type": file.type },
        onUploadProgress: (e) => {
          if (e.total) {
            const percent = Math.round((e.loaded * 100) / e.total);
            setUploadProgress(percent);
          }
        },
      });

      return file_url;
    } catch (err: any) {
      toast.error(err.message || "Upload failed. Please try again.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleCropAndUpload = async () => {
    if (!croppingImage || !croppedAreaPixels) return;

    const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels, 0.9);
    if (!croppedBlob) {
      toast.error("Failed to crop image");
      return;
    }

    const uploadedUrl = await uploadToS3(
      new File([croppedBlob], croppingImage.name, {
        type: croppingImage.type,
      })
    );
    if (uploadedUrl) {
      updateMediaBio({ profilePhoto: uploadedUrl });
    }
    setCroppingImage(null);
  };

  const removeImage = async () => {
    try {
      if (!mediaBio.profilePhoto) return;
      await api.delete("/products/delete_image", {
        data: { file_url: mediaBio.profilePhoto },
      });
      updateMediaBio({ profilePhoto: "" });
    } catch (err) {
      console.error("Error removing image:", err);
    }
  };

  return (
    <form
      onSubmit={handleNext}
      className="bg-white p-8 rounded-lg shadow-sm animate-fade-in text-black space-y-8"
    >
      <h2 className="text-2xl font-semibold">Media & Bio</h2>
      <p className="text-gray-500">
        Add your profile photo, portfolio, and a short bio for clients to know you better.
      </p>

      {/* Image Crop Modal */}
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
            height: "500px",
            maxHeight: "90vh",
            padding: "1rem",
            borderRadius: "12px",
            overflow: "hidden",
          },
          overlay: { backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1000 },
        }}
      >
        {croppingImage && (
          <>
            <div className="relative w-full h-[65vh] bg-black rounded-lg">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
                cropShape="rect"
                showGrid
              />
              <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col items-center">
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-64"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleCropAndUpload}
              className="bg-blue-600 text-white px-6 py-2 rounded-md mt-4 mx-auto block"
            >
              Crop & Upload
            </button>
          </>
        )}
      </Modal>

      {/* Profile Photo Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Profile Photo <span className="text-red-500">*</span>
        </label>

        <div
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer border border-dashed border-gray-300 p-6 rounded-xl text-center hover:bg-gray-50 transition"
        >
          {uploading ? (
            <div className="space-y-2">
              <p>Uploading: {uploadProgress}%</p>
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          ) : mediaBio.profilePhoto ? (
            <div className="relative inline-block">
              <img
                src={mediaBio.profilePhoto}
                alt="Profile Preview"
                className="w-32 h-32 sm:w-48 sm:h-48 object-cover rounded-full border mx-auto"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage();
                }}
                className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow hover:bg-gray-100"
              >
                <FiTrash2 className="text-red-500 h-4 w-4" />
              </button>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              Click to upload profile photo (800×800 min)
            </p>
          )}
        </div>
        {errors.profilePhoto && (
          <p className="text-sm text-red-500 mt-1">{errors.profilePhoto}</p>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept=".png,.jpg,.jpeg"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Portfolio File */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Portfolio File (optional)
        </label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              updateMediaBio({ portfolioFile: e.target.files[0].name });
            }
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
        {mediaBio.portfolioFile && (
          <p className="mt-2 text-gray-700 text-sm">
            Selected: {mediaBio.portfolioFile}
          </p>
        )}
      </div>

      {/* Short Bio */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Short Bio <span className="text-red-500">*</span>
        </label>
        <textarea
          value={mediaBio.shortBio}
          onChange={(e) => updateMediaBio({ shortBio: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          placeholder="Write a brief bio about yourself..."
        />
        {errors.shortBio && (
          <p className="text-sm text-red-500 mt-1">{errors.shortBio}</p>
        )}
      </div>

      {/* Published Toggle */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="published"
          checked={mediaBio.published}
          onChange={(e) => updateMediaBio({ published: e.target.checked })}
          className="h-4 w-4 border-gray-300 rounded"
        />
        <label htmlFor="published" className="text-sm text-gray-700">
          Publish my profile
        </label>
      </div>

      {/* Next Button */}
      <div className="pt-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          {isLastStep ? "Finish" : "Next"}
        </button>
      </div>
    </form>
  );
};

export default MediaBio;
