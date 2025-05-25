'use client';

import { useRef, useState, useEffect } from 'react';
import { useFormActions, useFormData } from '@/store/product_upload_store';
import { FiUpload, FiX, FiImage } from 'react-icons/fi';
import { toast } from 'sonner';
import axios from 'axios';
import { api } from '@/lib/axios';

interface UploadResponse {
  upload_url: string;
  file_url: string;
}

export default function MediaAssets() {
  const { media } = useFormData();
  const { updateFormData } = useFormActions();
  const profileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Initialize with existing media data
  useEffect(() => {
    if (media?.productImage) {
      setPreviewImage(media.productImage);
    }
  }, [media]);

  const handleProfileClick = () => {
    profileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    
    // Validate file type
    const validTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload an SVG, PNG, or JPG image.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large. Maximum size is 5MB.');
      return;
    }

    // Create temporary preview
    const tempPreview = URL.createObjectURL(file);
    setPreviewImage(tempPreview);
    setIsUploading(true);

    try {
      // 1. Get presigned URL from backend
      const response = await api.post<UploadResponse>('/products/upload', {
        file_name: file.name,
      });

      const { upload_url, file_url } = response.data;

      // 2. Upload directly to S3
      await axios.put(upload_url, file, {
        headers: {
          'Content-Type': file.type,
        },
      });

      // 3. Update form data with permanent URL
      updateFormData('media', { productImage: file_url });
      setPreviewImage(file_url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload failed:', error);
      setPreviewImage(null);
      if (profileInputRef.current) profileInputRef.current.value = '';
      toast.error('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      // Clean up temporary preview
      if (tempPreview) URL.revokeObjectURL(tempPreview);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    updateFormData('media', { productImage: null });
    if (profileInputRef.current) {
      profileInputRef.current.value = '';
    }
    toast.info('Image removed');
  };

  return (
    <div className="max-w-2xl space-y-6 bg-white p-6 rounded-2xl shadow-sm">
      <div>
        <h1 className="text-lg font-semibold">Media Assets</h1>
        <p className="text-gray-500 text-sm">Showcase your product visually</p>
      </div>

      <div className="grid gap-6">
        {/* Product Image Upload Card */}
        <div
          onClick={handleProfileClick}
          className={`cursor-pointer border ${previewImage ? 'border-solid' : 'border-dashed'} border-gray-300 p-6 rounded-xl hover:bg-gray-50 transition`}
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiImage className="text-gray-400" />
            Product Image
            {isUploading && (
              <span className="text-xs text-blue-500 ml-2">Uploading...</span>
            )}
          </h2>
          
          {previewImage ? (
            <div className="relative">
              <img 
                src={previewImage} 
                alt="Product preview" 
                className="w-full h-60 object-contain rounded-lg border border-gray-200"
              />
              {!isUploading && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage();
                  }}
                  className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100 transition"
                  aria-label="Remove image"
                >
                  <FiX className="text-red-500" />
                </button>
              )}
            </div>
          ) : (
            <div className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 text-gray-400 text-sm">
              <FiUpload className="text-2xl" />
              <span>Click to upload image</span>
              <span className="text-xs">SVG, PNG, JPG (max 5MB)</span>
            </div>
          )}

          <input
            ref={profileInputRef}
            type="file"
            accept=".svg,.png,.jpg,.jpeg"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </div>
      </div>
    </div>
  );
}