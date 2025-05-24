'use client';

import { useRef, useState, useEffect } from 'react';
import { useFormActions, useFormData } from '@/store/product_upload_store';
import { FiUpload, FiX, FiImage } from 'react-icons/fi';
import { toast } from 'sonner';

export default function MediaAssets() {
  const { media } = useFormData();
  const { updateFormData } = useFormActions();
  const profileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Initialize with existing media data
  useEffect(() => {
    if (media?.productImage) {
      setPreviewImage(media.productImage);
    }
  }, [media]);

  const handleProfileClick = () => {
    profileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
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

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setPreviewImage(imageUrl);
        updateFormData('media', { productImage: imageUrl });
        toast.success('Image uploaded successfully');
      };
      reader.readAsDataURL(file);
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
          </h2>
          
          {previewImage ? (
            <div className="relative">
              <img 
                src={previewImage} 
                alt="Product preview" 
                className="w-full h-60 object-contain rounded-lg border border-gray-200"
              />
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
          />
        </div>

        {/* Additional upload sections can be added here */}
        {/* <div className="border border-dashed border-gray-300 p-6 rounded-xl">
          <h2 className="text-lg font-semibold mb-4">Additional Images</h2>
          <p className="text-gray-500 text-sm">Upload more product images</p>
        </div> */}
      </div>
    </div>
  );
}