"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { api } from '@/lib/axios';

interface UploadResponse {
  upload_url: string;
  file_url: string;
}

export default function S3Uploader() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileUrl, setFileUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setFileUrl('');
      setUploadProgress(0);
    }
  };

  const uploadToS3 = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setIsUploading(true);
    setError('');
    
    try {
      // Step 1: Get presigned URL from your backend
      const response = await api.post<UploadResponse>('/products/upload', {
        file_name: selectedFile.name,
      });

      const { upload_url, file_url } = response.data;

      // Step 2: Upload directly to S3 using the presigned URL
      await axios.put(upload_url, selectedFile, {
        headers: {
          'Content-Type': selectedFile.type || 'application/octet-stream',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          }
        },
      });

      setFileUrl(file_url);
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Upload to S3</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Select file to upload
        </label>
        <input
          type="file"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
          disabled={isUploading}
        />
      </div>

      {selectedFile && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
          </p>
        </div>
      )}

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Uploading: {uploadProgress}%
          </p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      {fileUrl && (
        <div className="mb-4 p-3 bg-green-50 rounded border border-green-200">
          <p className="text-sm text-green-700 mb-2">Upload successful!</p>
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm break-all"
          >
            {fileUrl}
          </a>
          {fileUrl.match(/\.(jpeg|jpg|gif|png)$/) && (
            <div className="mt-2">
              <img
                src={fileUrl}
                alt="Preview"
                className="max-h-40 max-w-full border rounded"
              />
            </div>
          )}
        </div>
      )}

      <button
        onClick={uploadToS3}
        disabled={!selectedFile || isUploading}
        className={`px-4 py-2 rounded-md text-white ${
          !selectedFile || isUploading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isUploading ? 'Uploading...' : 'Upload to S3'}
      </button>
    </div>
  );
}