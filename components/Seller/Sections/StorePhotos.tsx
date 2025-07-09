"use client"
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

  const [bannerUrl, setBannerUrl] = useState(storePhotosData?.bannerUrl || "");
  const [profileUrl, setProfileUrl] = useState(storePhotosData?.profileUrl || "");
  const [bannerUploading, setBannerUploading] = useState(false);
  const [profileUploading, setProfileUploading] = useState(false);
  const [bannerProgress, setBannerProgress] = useState(0);
  const [profileProgress, setProfileProgress] = useState(0);

  const bannerInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  const handleBannerClick = () => bannerInputRef.current?.click();
  const handleProfileClick = () => profileInputRef.current?.click();

  const [croppingImage, setCroppingImage] = useState<File | null>(null);
  const [cropType, setCropType] = useState<"profile" | "banner" | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const handleCropComplete = (_: any, croppedArea: Area) => {
    setCroppedAreaPixels(croppedArea);
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement;
    setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
  };

  const imageSrc = useMemo(() => (croppingImage ? URL.createObjectURL(croppingImage) : ""), [croppingImage]);

  useEffect(() => {
    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
    };
  }, [imageSrc]);

  async function deleteImageFromS3(imageUrl: string) {
    try {
      await api.delete(`/products/delete_image`, { data: { file_url: imageUrl } });
    } catch (error) {
      console.error("Error deleting image from S3:", error);
    }
  }

  const removeMainImage = async (imageUrl: string, type: "profile" | "banner") => {
    await deleteImageFromS3(imageUrl);
    if (type === "profile") {
      setProfileUrl("");
      setStorePhotosData((prev) => ({ ...prev, profileUrl: "" }));
    } else {
      setBannerUrl("");
      setStorePhotosData((prev) => ({ ...prev, bannerUrl: "" }));
    }
  };

  const uploadToS3 = async (file: File, type: "profile" | "banner"): Promise<string | null> => {
    try {
      type === "profile" ? setProfileUploading(true) : setBannerUploading(true);
      const response = await api.post<UploadResponse>("/stores/upload", { file_name: file.name });
      const { upload_url, file_url } = response.data;
      await axios.put(upload_url, file, {
        headers: { "Content-Type": file.type || "application/octet-stream" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            type === "profile" ? setProfileProgress(percentCompleted) : setBannerProgress(percentCompleted);
          }
        },
      });
      return file_url;
    } catch (error) {
      console.error("Upload failed:", error);
      return null;
    } finally {
      type === "profile" ? setProfileUploading(false) : setBannerUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: "profile" | "banner") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.onload = () => {
      if (type === "profile" && (img.width < 500 || img.height < 500)) {
        alert("Profile image must be at least 500×500 pixels");
        return;
      }
      setCropType(type);
      setCroppingImage(file);
    };
    img.src = URL.createObjectURL(file);
  };

  useEffect(() => {
    const bothPresent = profileUrl.trim() !== "" && bannerUrl.trim() !== "";
    if (bothPresent) {
      setStorePhotosValid(true);
      setStorePhotosData((prev) => ({ ...prev, profileUrl, bannerUrl }));
    }
  }, [profileUrl, bannerUrl]);

  const getModalSize = () => {
    if (!imageSize.width || !imageSize.height) return { width: 500, height: 500 };
    const maxWidth = cropType === "banner" ? 675 : 600;
    const maxHeight = 600;
    let width = imageSize.width;
    let height = imageSize.height;

    if (width > maxWidth) {
      const ratio = maxWidth / width;
      width = maxWidth;
      height = height * ratio;
    }
    if (height > maxHeight) {
      const ratio = maxHeight / height;
      height = maxHeight;
      width = width * ratio;
    }
    return {
      width: Math.max(width, 500),
      height: Math.max(height, 500)
    };
  };

  const modalSize = getModalSize();

  return (
    <div className="w-3xl space-y-6 bg-white p-6 rounded-2xl shadow-sm">
      <Modal
        isOpen={!!croppingImage}
        ariaHideApp={false}
        onRequestClose={() => setCroppingImage(null)}
        style={{
          content: {
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: `${modalSize.width}px`,
            height: `${modalSize.height}px`,
            padding: "0",
            borderRadius: "12px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          },
          overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1000 },
        }}
      >
        {croppingImage && (
          <div className="relative w-full h-full">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={cropType === "banner" ? 1.15 : 1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
              onMediaLoaded={handleImageLoad}
              cropShape={"rect"}
              minZoom={0.5}
              maxZoom={3}
            />
            <input
              type="range"
              min={0.5}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10"
            />
            <button
              onClick={async () => {
                if (!croppedAreaPixels || !croppingImage || !cropType) return;
                const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels, 0.9);
                if (!croppedBlob) return alert("Failed to crop image");
                const uploadedUrl = await uploadToS3(
                  new File([croppedBlob], croppingImage.name, {
                    type: croppingImage.type,
                  }),
                  cropType
                );
                if (uploadedUrl) {
                  cropType === "profile" ? setProfileUrl(uploadedUrl) : setBannerUrl(uploadedUrl);
                }
                setCroppingImage(null);
              }}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg z-10"
            >
              Crop & Upload
            </button>
          </div>
        )}
      </Modal>
      {/* Upload preview section remains unchanged */}
      {/* ... rest of your component remains the same ... */}
            <div>
        <h1 className="text-lg font-semibold">Photos</h1>
        <p className="text-gray-500 text-sm">
          Upload a profile & banner photo to showcase your brand's identity.
        </p>
      </div>

      <div className="-mx-6 border-t border-gray-300"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Banner Upload */}
        <div onClick={handleBannerClick} className="cursor-pointer border border-dashed border-gray-300 p-6 rounded-xl text-center hover:bg-gray-50 transition">
          <h2 className="text-lg font-semibold mb-4">Upload your banner image</h2>
          {bannerUploading ? (
            <>
              <p className="text-gray-400 text-sm">Uploading: {bannerProgress}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${bannerProgress}%` }}></div>
              </div>
            </>
          ) : bannerUrl ? (
            <div className="relative group">
              <img src={bannerUrl} alt="Banner Preview" className="w-full h-40 object-cover rounded-lg" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeMainImage(bannerUrl, 'banner');
                }}
                className="absolute top-1 right-1 bg-white p-1 rounded-full shadow-md hover:bg-gray-100 transition opacity-0 group-hover:opacity-100"
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
          <input ref={bannerInputRef} type="file" accept=".svg,.png,.jpg,.jpeg" className="hidden" onChange={(e) => handleFileChange(e, "banner")} />
        </div>

        {/* Profile Upload */}
        <div onClick={handleProfileClick} className="cursor-pointer border border-dashed border-gray-300 p-6 rounded-xl text-center hover:bg-gray-50 transition">
          <h2 className="text-lg font-semibold mb-4">Upload your profile image</h2>
          {profileUploading ? (
            <>
              <p className="text-gray-400 text-sm">Uploading: {profileProgress}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${profileProgress}%` }}></div>
              </div>
            </>
          ) : profileUrl ? (
            <div className="relative group">
              <img src={profileUrl} alt="Profile Preview" className="w-full h-40 object-cover rounded-lg" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeMainImage(profileUrl, 'profile');
                }}
                className="absolute top-1 right-1 bg-white p-1 rounded-full shadow-md hover:bg-gray-100 transition opacity-0 group-hover:opacity-100"
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
          <input ref={profileInputRef} type="file" accept=".svg,.png,.jpg,.jpeg" className="hidden" onChange={(e) => handleFileChange(e, "profile")} />
        </div>
      </div>
    </div>
  );
}
