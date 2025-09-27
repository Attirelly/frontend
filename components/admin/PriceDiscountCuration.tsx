"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { AxiosError } from "axios";
import { toast } from "sonner";

/** @description Defines the structure for a single price-based curation item. */
interface PriceCurationItem {
  heading: string;
  image_url: string;
  landing_url: string;
}

// Defines the number of rows to display in the form.
const TOTAL_INPUTS = 10;

/**
 * An admin page for creating and editing homepage "price-based curations".
 *
 * This component is adapted from the store/product curation module. It allows an admin
 * to create a section featuring items described by a custom heading, an image, and a
 * landing URL (e.g., "Sarees Under ₹5000", "Kurtas Under ₹2000").
 *
 * ### Functionality
 * - **Create & Edit Modes**: Switches between creating a new curation and editing an
 * existing one based on the `curation_id` URL query parameter.
 * - **Dynamic Rows**: Displays a fixed number of rows (10), each containing inputs for
 * a heading, an image upload, and a landing URL.
 * - **State Management**: Uses `useState` to manage the overall curation name, the "View All" URL,
 * and an array of `PriceCurationItem` objects that hold the data for each row.
 * - **Image Handling**: Implements a two-step image upload process. It first requests a
 * presigned URL from the backend, then uploads the file directly to the cloud storage (e.g., S3).
 * It also supports deleting previously uploaded images.
 *
 * ### API Endpoints
 * - **`GET /homepage/price_curations_by_section/:id`**: (Assumed) Fetches existing data for a price curation in edit mode.
 * - **`POST /homepage/section`**: Creates a new curation section.
 * - **`PUT /homepage/section/:id`**: Updates an existing curation section.
 * - **`POST /stores/upload`**: Gets a presigned URL for uploading images.
 * - **`DELETE /products/delete_image`**: Deletes a previously uploaded image.
 *
 * @returns {JSX.Element} A dynamic form for managing price-based homepage curations.
 */
export default function PriceDiscountCurationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL parameters to control component mode and data
  const curation_type = "price"; // Hardcoded for this component
  const curation_id = searchParams.get("curation_id");
  const curation_number = searchParams.get("curation_number");
  const curation_name = searchParams.get("curation_name");
  const curation_url = searchParams.get("curation_url");

  // State for the form
  const [curationName, setCurationName] = useState("");
  const [viewAllUrl, setViewAllUrl] = useState("");
  const [priceSelections, setPriceSelections] = useState<PriceCurationItem[]>(
    Array(TOTAL_INPUTS).fill({
      heading: "",
      image_url: "",
      landing_url: "",
    })
  );

  const rows = Array.from({ length: TOTAL_INPUTS });

  /**
   * This effect runs only in "edit" mode (when `curation_id` is present).
   * It fetches the existing data for the curation and pre-fills the form fields.
   */
  useEffect(() => {
    if (!curation_id) return;

    // Pre-fill top-level fields from URL params
    setCurationName(curation_name || "");
    setViewAllUrl(curation_url || "");

    const fetchPriceCurationData = async () => {
      try {
        // NOTE: The endpoint name is an assumption based on the pattern.
        const response = await api.get(
          `/homepage/flat_curations_by_section/${curation_id}`
        );
        const fetchedSelections: PriceCurationItem[] = response.data;

        // Pre-fill the rows with the fetched data
        const updatedSelections = [...priceSelections];
        for (
          let i = 0;
          i < fetchedSelections.length && i < updatedSelections.length;
          i++
        ) {
          updatedSelections[i] = fetchedSelections[i];
        }
        setPriceSelections(updatedSelections);
      } catch (error) {
        console.error("Error fetching price curations by section:", error);
        toast.error("Failed to load existing curation data.");
      }
    };

    fetchPriceCurationData();
  }, [curation_id, curation_name, curation_url]); // Dependencies ensure this runs if the ID changes

  /**
   * Handles the two-step image upload process.
   * 1. Get a presigned URL from our backend.
   * 2. PUT the file to that URL.
   * @param {File} file - The image file to upload.
   * @returns {Promise<string | null>} The final URL of the uploaded image, or null on failure.
   */
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const response = await api.post<{
        upload_url: string;
        file_url: string;
      }>("/stores/upload", {
        file_name: file.name,
      });

      const { upload_url, file_url } = response.data;

      // Step 2: Upload the file to the presigned URL
      await api.put(upload_url, file, {
        headers: { "Content-Type": file.type || "application/octet-stream" },
      });

      return file_url;
    } catch (err) {
      toast.error("Image upload failed. Please try again.");
      return null;
    }
  };

  /**
   * Deletes a previously uploaded image via a backend endpoint.
   * @param {string} imageUrl - The URL of the image to delete.
   */
  const deleteImage = async (imageUrl: string) => {
    try {
      await api.delete(`/products/delete_image`, {
        data: { file_url: imageUrl },
      });
      toast.success("Image deleted successfully!");
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image.");
    }
  };

  /**
   * Handles the form submission for updating an existing curation.
   */
  const handleEdit = async () => {
    if (!curationName.trim()) {
      toast.error("Curation name is required.");
      return;
    }

    const validSelections = priceSelections.filter(
      (item) => item.heading && item.image_url && item.landing_url
    );

    if (validSelections.length === 0) {
      toast.error(
        "At least one complete entry (heading, image, and URL) is required."
      );
      return;
    }

    const payload = {
      section_name: curationName,
      section_number: Number(curation_number) || 1,
      section_type: curation_type,
      section_url: viewAllUrl,
      price_curations: validSelections, // Use a specific key for this curation type
    };

    try {
      await api.put(`/homepage/section/${curation_id}`, payload);
      toast.success("Curation updated successfully!");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Failed to update section.");
    }
  };

  /**
   * Handles the form submission for creating a new curation.
   */
  const handleCreate = async () => {
    if (!curationName.trim()) {
      toast.error("Curation name is required.");
      return;
    }

    const validSelections = priceSelections.filter(
      (item) => item.heading && item.image_url && item.landing_url
    );

    if (validSelections.length === 0) {
      toast.error(
        "At least one complete entry (heading, image, and URL) is required."
      );
      return;
    }

    const payload = {
      section_name: curationName,
      section_number: Number(curation_number) || 1,
      section_type: curation_type,
      section_url: viewAllUrl,
      price_curations: validSelections,
    };

    try {
      await api.post("/homepage/section", payload);
      toast.success("Curation created successfully!");
      router.replace("/admin/curationModule/createCuration");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Failed to create section.");
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-bold mb-6 text-black">
        Price/Discount Curation
      </h1>

      <div className="flex flex-wrap gap-6 mb-10 items-center">
        <div className="flex flex-col">
          <label className="font-semibold mb-1 text-black">
            Curation Name<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="border rounded px-4 py-2 w-72 placeholder:text-gray-400 text-black"
            value={curationName}
            onChange={(e) => setCurationName(e.target.value)}
            placeholder="e.g., Deals of the Day"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-1 text-black">
            View All URL Input
          </label>
          <input
            type="text"
            className="border rounded px-4 py-2 w-96 placeholder:text-gray-400 text-black"
            value={viewAllUrl}
            onChange={(e) => setViewAllUrl(e.target.value)}
            placeholder="e.g., /collections/all-sarees"
          />
        </div>
      </div>

      <div className="space-y-4 mb-12">
        {rows.map((_, index) => {
          const currentItem = priceSelections[index];

          return (
            <div key={index} className="flex gap-4 items-center">
              {/* Heading Input */}
              <input
                type="text"
                className="border rounded px-4 py-2 w-64 text-black placeholder:text-gray-400"
                placeholder="Card Heading (e.g. Sarees Under 5k)"
                value={currentItem.heading}
                onChange={(e) => {
                  const updated = [...priceSelections];
                  updated[index] = { ...updated[index], heading: e.target.value };
                  setPriceSelections(updated);
                }}
              />

              {/* Image Upload */}
              <div className="flex flex-col items-start gap-2">
                <input
                  type="file"
                  accept="image/*"
                  className="text-sm text-black"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    const uploadedUrl = await uploadImage(file);
                    if (!uploadedUrl) return;

                    const updated = [...priceSelections];
                    updated[index] = {
                      ...updated[index],
                      image_url: uploadedUrl,
                    };
                    setPriceSelections(updated);
                  }}
                />

                {currentItem.image_url && (
                  <div className="flex items-center gap-2">
                    <img
                      src={currentItem.image_url}
                      alt="Uploaded"
                      className="w-16 h-16 object-cover rounded border"
                    />
                    <button
                      className="text-red-500 text-sm underline"
                      onClick={async () => {
                        await deleteImage(currentItem.image_url);
                        const updated = [...priceSelections];
                        updated[index] = { ...updated[index], image_url: "" };
                        setPriceSelections(updated);

                        // Clear the file input for better UX
                        // If you want to reset the file input, consider using a ref.
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              {/* Landing URL Input */}
              <input
                type="text"
                className="border rounded px-4 py-2 w-64 text-black placeholder:text-gray-400"
                placeholder="Card Landing URL"
                value={currentItem.landing_url}
                onChange={(e) => {
                  const updated = [...priceSelections];
                  updated[index] = { ...updated[index], landing_url: e.target.value };
                  setPriceSelections(updated);
                }}
              />
            </div>
          );
        })}
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={() => router.back()}
          className="bg-gray-300 text-black rounded-full px-6 py-2"
        >
          Back
        </button>

        <div className="flex gap-4">
          <button
            onClick={handleEdit}
            disabled={!curation_id}
            className={`rounded-full px-6 py-2 ${
              curation_id
                ? "bg-green-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Update
          </button>

          <button
            onClick={handleCreate}
            disabled={!!curation_id}
            className={`rounded-full px-6 py-2 ${
              !curation_id
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}