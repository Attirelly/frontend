"use client";

import React, { useRef, useState, useEffect } from "react";
import { useSellerStore } from "@/store/sellerStore";
import axios from "axios";
import { api } from "@/lib/axios";

// Add at top
import Cropper from "react-easy-crop";
import getCroppedImg from "@/lib/cropImage"; // You’ll create this

import Modal from "react-modal"; // or use any dialog/modal you like
import { Area } from "react-easy-crop";

interface UploadResponse {
  upload_url: string;
  file_url: string;
}

export default function PhotosPage() {
  const { storePhotosData, setStorePhotosData , setStorePhotosValid} = useSellerStore();

  const [bannerUrl, setBannerUrl] = useState(storePhotosData?.bannerUrl || "");
  const [profileUrl, setProfileUrl] = useState(
    storePhotosData?.profileUrl || ""
  );
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

  const handleCropComplete = (_: any, croppedArea: Area) => {
    setCroppedAreaPixels(croppedArea);
  };

  // useEffect(() => {
  //   Modal.setAppElement("#__next");
  // }, []);

  const uploadToS3 = async (
    file: File,
    type: "profile" | "banner"
  ): Promise<string | null> => {
    try {
      console.log("hi");
      const response = await api.post<UploadResponse>("/stores/upload", {
        file_name: file.name,
      });

      const { upload_url, file_url } = response.data;

      await axios.put(upload_url, file, {
        headers: {
          "Content-Type": file.type || "application/octet-stream",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            type === "profile"
              ? setProfileProgress(percentCompleted)
              : setBannerProgress(percentCompleted);
          }
        },
      });

      return file_url;
    } catch (error) {
      console.error("Upload failed:", error);
      return null;
    }
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "profile" | "banner"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCropType(type);
    setCroppingImage(file);

    // type === "profile" ? setProfileUploading(true) : setBannerUploading(true);
    // console.log("hi");

    // const uploadedUrl = await uploadToS3(file, type);

    // if (uploadedUrl) {
    //   if (type === "profile") setProfileUrl(uploadedUrl);
    //   else setBannerUrl(uploadedUrl);
    // }

    // type === "profile" ? setProfileUploading(false) : setBannerUploading(false);
  };

  useEffect(() => {
    if (profileUrl && bannerUrl) {
      setStorePhotosValid(true);
      setStorePhotosData({ profileUrl, bannerUrl });
    }
  }, [profileUrl, bannerUrl, setStorePhotosData]);
  console.log(storePhotosData);

  return (
    <div className="max-w-2xl space-y-6 bg-white p-6 rounded-2xl shadow-sm">
      <Modal
        isOpen={!!croppingImage}
        ariaHideApp={false}
        onRequestClose={() => setCroppingImage(null)}
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: "500px",
            height: "auto",
            padding: "20px",
            borderRadius: "12px",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
        }}
      >
        {croppingImage && (
          <div className="relative w-full h-[400px]">
            <Cropper
              image={URL.createObjectURL(croppingImage)}
              crop={crop}
              zoom={zoom}
              aspect={cropType === "banner" ? 3 : 1} // 3:1 for banner, 1:1 for profile
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
            />
            <button
              onClick={async () => {
                if (!croppedAreaPixels || !croppingImage || !cropType) return;

                const croppedBlob = await getCroppedImg(
                  URL.createObjectURL(croppingImage),
                  croppedAreaPixels
                );

                const uploadedUrl = await uploadToS3(
                  new File([croppedBlob], croppingImage.name, {
                    type: croppingImage.type,
                  }),
                  cropType
                );

                if (uploadedUrl) {
                  cropType === "profile"
                    ? setProfileUrl(uploadedUrl)
                    : setBannerUrl(uploadedUrl);
                }

                setCroppingImage(null);
              }}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Crop & Upload
            </button>
          </div>
        )}
      </Modal>
      <div>
        <h1 className="text-lg font-semibold">Photos</h1>
        <p className="text-gray-500 text-sm">
          Upload a profile & banner photo to showcase your brand's identity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Banner Upload */}
        <div
          onClick={handleBannerClick}
          className="cursor-pointer border border-dashed border-gray-300 p-6 rounded-xl text-center hover:bg-gray-50 transition"
        >
          <h2 className="text-lg font-semibold mb-4">
            Upload your banner image
          </h2>
          {bannerUploading ? (
            <>
              <p className="text-gray-400 text-sm">
                Uploading: {bannerProgress}%
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${bannerProgress}%` }}
                ></div>
              </div>
            </>
          ) : bannerUrl ? (
            <img
              src={bannerUrl}
              alt="Banner Preview"
              className="w-full h-40 object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm">
              Click to upload image (svg, png, jpg)
            </div>
          )}
          <input
            ref={bannerInputRef}
            type="file"
            accept=".svg,.png,.jpg,.jpeg"
            className="hidden"
            onChange={(e) => handleFileChange(e, "banner")}
          />
        </div>

        {/* Profile Upload */}
        <div
          onClick={handleProfileClick}
          className="cursor-pointer border border-dashed border-gray-300 p-6 rounded-xl text-center hover:bg-gray-50 transition"
        >
          <h2 className="text-lg font-semibold mb-4">
            Upload your profile image
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
            <img
              src={profileUrl}
              alt="Profile Preview"
              className="w-full h-40 object-cover rounded-lg"
            />
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
            onChange={(e) => handleFileChange(e, "profile")}
          />
        </div>
      </div>
    </div>
  );
}