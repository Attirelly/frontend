"use client";
import React, { useRef, useState, useEffect, useMemo } from "react";
import { useSellerStore } from "@/store/sellerStore";
import axios from "axios";
import { api } from "@/lib/axios";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/lib/cropImage";
import Modal from "react-modal";
import { Area } from "react-easy-crop";
import { FiTrash2 } from "react-icons/fi";

interface UploadResponse {
  upload_url: string;
  file_url: string;
}

export default function PhotosPage() {
  const { storePhotosData, setStorePhotosData, setStorePhotosValid } = useSellerStore();

  const [profileUrl, setProfileUrl] = useState(storePhotosData?.profileUrl || "");
  const [profileUploading, setProfileUploading] = useState(false);
  const [profileProgress, setProfileProgress] = useState(0);

  const profileInputRef = useRef<HTMLInputElement>(null);
  const handleProfileClick = () => profileInputRef.current?.click();

  const [croppingImage, setCroppingImage] = useState<File | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const handleCropComplete = (_: any, croppedArea: Area) => {
    setCroppedAreaPixels(croppedArea);
  };

  const imageSrc = useMemo(() => (croppingImage ? URL.createObjectURL(croppingImage) : ""), [croppingImage]);

  useEffect(() => {
    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
    };
  }, [imageSrc]);

  async function deleteImageFromS3(imageUrl: string) {
    try {
      await api.delete(`/products/delete_image`, {
        data: { file_url: imageUrl },
      });
    } catch (error) {
      console.error("Error deleting image from S3:", error);
    }
  }

  const removeMainImage = async (imageUrl: string) => {
    try {
      if (!imageUrl) return;
      await deleteImageFromS3(imageUrl);
      setProfileUrl("");
      let newStorePhotosData = { ...storePhotosData, profileUrl: "" };
      setStorePhotosData(newStorePhotosData);
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
      await axios.put(upload_url, file, {
        headers: { "Content-Type": file.type || "application/octet-stream" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProfileProgress(percentCompleted);
          }
        },
      });
      return file_url;
    } catch (error) {
      console.error("Upload failed:", error);
      return null;
    } finally {
      setProfileUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.onload = () => {
      if (img.width < 800 || img.height < 800) {
        alert("Image must be at least 800×800 pixels");
        return;
      }
      setCroppingImage(file);
    };
    img.src = URL.createObjectURL(file);
  };

  useEffect(() => {
    if (profileUrl.trim() !== "") {
      setStorePhotosValid(true);
      setStorePhotosData((prev) => ({ ...prev, profileUrl }));
    }
  }, [profileUrl]);

  return (
    <div className="w-3xl space-y-6 bg-white p-6 rounded-2xl shadow-sm text-black">
      <Modal
        isOpen={!!croppingImage}
        ariaHideApp={false}
        onRequestClose={() => setCroppingImage(null)}
        style={{
          content: {
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "720px",
            height: "750px",
            padding: 0,
            borderRadius: "12px",
            overflow: "hidden",
            position: "relative",
            paddingTop:"20px"
          },
          overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1000 },
        }}
      >
        {croppingImage && (
          <>
            <div className="relative w-full h-[700px]  bg-black">
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
              <div className="absolute bottom-0 w-full px-6 pb-4 flex flex-col items-center z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full max-w-[400px] mb-3"
                />
                <button
                  onClick={async () => {
                    if (!croppedAreaPixels || !croppingImage) return;
                    const croppedBlob = await getCroppedImg(
                      imageSrc,
                      croppedAreaPixels,
                      0.9
                    );
                    if (!croppedBlob) return alert("Failed to crop image");
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
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Crop & Upload
                </button>
              </div>
            </div>
          </>
        )}
      </Modal>

      <div>
        <h1 className="text-lg font-semibold">Profile Photo</h1>
        <p className="text-gray-500 text-sm">Upload a square profile photo for your store</p>
      </div>

      <div className="border-t border-gray-300"></div>

      <div className="grid grid-cols-1 gap-6">
        <div
          onClick={handleProfileClick}
          className="w-[360px] cursor-pointer border border-dashed border-gray-300 p-6 rounded-xl text-center hover:bg-gray-50 transition mx-auto"
        >
          <h2 className="text-lg font-semibold mb-4">Upload your profile image</h2>
          {profileUploading ? (
            <>
              <p className="text-gray-400 text-sm">Uploading: {profileProgress}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                  className="bg-green-600 h-2.5 rounded-full"
                  style={{ width: `${profileProgress}%` }}
                ></div>
              </div>
            </>
          ) : profileUrl ? (
            <div className="relative group mx-auto">
              <img
                src={profileUrl}
                alt="Profile Preview"
                className="w-[300px] h-[300px] object-cover rounded-lg mx-auto"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeMainImage(profileUrl);
                }}
                className="absolute top-1 right-[20px] bg-white p-1 rounded-full shadow-md hover:bg-gray-100 transition opacity-0 group-hover:opacity-100"
                aria-label="Remove image"
              >
                <FiTrash2 className="text-red-500" />
              </button>
            </div>
          ) : (
            <div className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm">
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