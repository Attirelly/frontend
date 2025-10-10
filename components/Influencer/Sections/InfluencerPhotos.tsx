'use client';

import { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface ComponentProps {
  onNext: () => void;
}

export default function InfluencerPhotos({ onNext }: ComponentProps) {
  // State to track whether a file has been uploaded for each field
  const [uploadedPhotos, setUploadedPhotos] = useState<boolean[]>([false, false, false]);

  const uploadFields = [
    { id: 'profilePhoto1', label: 'Upload your profile photo' },
    { id: 'profilePhoto2', label: 'Upload a full-length photo' },
    { id: 'profilePhoto3', label: 'Upload a portfolio shot' },
  ];

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newUploadedPhotos = [...uploadedPhotos];
      newUploadedPhotos[index] = true;
      setUploadedPhotos(newUploadedPhotos);
    }
  };

  const handleNext = () => {
    // Check if all fields have an uploaded file
    if (uploadedPhotos.every(isUploaded => isUploaded)) {
      onNext();
    } else {
      alert('All three image fields are mandatory. Please upload a file for each.');
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border animate-fade-in">
      <h2 className="text-2xl font-semibold mb-2">Profile Photos</h2>
      <p className="text-sm text-gray-500 mb-8">
        Upload high-quality images for your profile
      </p>

      <div className="space-y-6">
        {uploadFields.map((field, index) => (
          <div
            key={field.id}
            className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-gray-400 transition-colors duration-200"
            onClick={() => document.getElementById(`fileInput-${field.id}`)?.click()}
          >
            <input
              id={`fileInput-${field.id}`}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => handleFileChange(index, e)}
            />
            <h3 className="font-semibold text-gray-900 mb-2">
              {field.label}
              <span className="text-red-500">*</span>
            </h3>
            <ImageIcon className={`h-12 w-12 mb-2 ${uploadedPhotos[index] ? 'text-black' : 'text-gray-400'}`} />
            <p className="text-gray-600 text-sm">
              {uploadedPhotos[index] ? 'File Uploaded' : 'Click to upload'}
            </p>
          </div>
        ))}
      </div>

      {/* Navigation Button */}
      <div className="flex justify-end mt-12 pt-6 border-t">
        <button
          onClick={handleNext}
          className="px-8 py-3 bg-black text-white rounded-md font-semibold hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
        >
          Next →
        </button>
      </div>
    </div>
  );
}