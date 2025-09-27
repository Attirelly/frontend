"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";

// The total number of available curation segments on the homepage.
const TOTAL_SEGMENTS = 12;

/**
 * A page component that serves as the initial step for creating a new homepage curation.
 *
 * This component allows an administrator to define the basic properties of a new curation section:
 * its type (e.g., 'store', 'product') and its segment number (position on the homepage).
 * It dynamically fetches which segment numbers are already in use and only presents the available
 * options to the user, preventing duplicates.
 *
 * ### State Management
 * - All state is managed locally with `useState`, including the user's selections for `curationType`
 * and `curationSegment`, the list of `availableSegments`, and a `loading` state for the initial API call.
 *
 * ### Data Fetching & Logic
 * - On mount, the component makes an API call to determine which of the `TOTAL_SEGMENTS` are already
 * in use. It then calculates the list of available segments to populate the dropdown.
 *
 * ### Navigation
 * - Upon successful selection of both a type and a segment, the "Next" button becomes enabled.
 * - Clicking "Next" navigates the user to the main curation form (`/admin/curationModule/addStoreProduct`) or (`/admin/curationModule/addPriceDiscount`) 
 * passing the selected type and segment number as URL query parameters.
 * - It also uses `router.prefetch` to start loading the next page in the background for a faster transition.
 *
 * ### API Endpoint
 * **`GET /homepage/used_section`**:
 * - **Returns**: `number[]` - An array of segment numbers that are currently in use.
 *
 * @returns {JSX.Element} A form for selecting the type and segment for a new curation.
 * @see {@link https://nextjs.org/docs/app/api-reference/functions/use-router | Next.js useRouter}
 */

export default function CreateCurationPage() {
  // --- Next.js Hooks ---
  const router = useRouter();

  // --- Local State ---
  // The user's selection for the type of curation (e.g., 'store', 'product').
  const [curationType, setCurationType] = useState("");
  // The user's selection for the homepage segment number.
  const [curationSegment, setCurationSegment] = useState("");
  // The list of segment numbers not yet used, populated by the API.
  const [availableSegments, setAvailableSegments] = useState<number[]>([]);
  // Loading state for the initial API call.
  const [loading, setLoading] = useState(true);

  /**
   * This effect runs once on component mount to prefetch the next page in the workflow.
   * This can make the navigation feel faster when the user clicks "Next".
   */
  useEffect(() => {
    router.prefetch("/admin/curationModule/addStoreProduct");
    router.prefetch("/admin/curationModule/addPriceDiscount");
  }, [router]); // Dependency array includes router to follow React's hook rules.

  /**
   * This effect fetches the list of already used curation segments from the backend
   * to determine which segment numbers are available for a new curation.
   */
  useEffect(() => {
    async function fetchUsedSegments() {
      try {
        const response = await api.get("/homepage/used_section");
        const usedSegments: number[] = response.data;

        // Filter available numbers from 1 to 12
        const allSegments = Array.from(
          { length: TOTAL_SEGMENTS },
          (_, i) => i + 1
        );
        const filteredSegments = allSegments.filter(
          (num) => !usedSegments.includes(num)
        );
        setAvailableSegments(filteredSegments);
      } catch (error) {
        console.error("Failed to fetch used segments:", error);
        alert("Error loading available segments. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchUsedSegments();
  }, []);
  /**
   * Handles the "Next" button click.
   * It validates that both selections have been made and then navigates to the next page,
   * passing the selections as URL query parameters.
   */
  const handleNext = () => {
    if (!curationType || !curationSegment) {
      alert(
        "Please select both Curation Type and Curation Segment before proceeding."
      );
      return;
    }

    const query = `?curation_type=${encodeURIComponent(
      curationType
    )}&curation_number=${encodeURIComponent(curationSegment)}`;
    if(curationType === 'price' || curationType === 'discount'){
      router.push(`/admin/curationModule/addPriceDiscount${query}`);
    }
    else{
      router.push(`/admin/curationModule/addStoreProduct${query}`);
    }
    
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="text-xl font-bold mb-8 text-black">Curation Module</div>

      {/* Form Section */}
      <div className="max-w-2xl space-y-6">
        {/* Curation Type */}
        <div className="flex items-center gap-4">
          <label className="w-40 font-medium text-black">Curation Type:</label>
          <select
            value={curationType}
            onChange={(e) => setCurationType(e.target.value)}
            className="flex-1 border px-3 py-2 rounded text-black"
          >
            <option value="">Select Type</option>
            <option value="store">store</option>
            <option value="product">product</option>
            <option value="subcat 3">subcat 3</option>
            <option value="subcat 4">subcat 4</option>
            <option value="price">price</option>
            <option value="discount">discount</option>
          </select>
        </div>

        {/* Curation Segment */}
        <div className="flex items-center gap-4">
          <label className="w-40 font-medium text-black">
            Curation Segment:
          </label>
          <select
            value={curationSegment}
            onChange={(e) => setCurationSegment(e.target.value)}
            className="flex-1 border px-3 py-2 rounded text-black"
          >
            <option value="">Select Segment</option>
            {availableSegments.length > 0 ? (
              availableSegments.map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))
            ) : (
              <option disabled>No available segments</option>
            )}
          </select>
        </div>
      </div>

      <div className="flex justify-end mt-12">
        <button
          onClick={handleNext}
          disabled={!curationType || !curationSegment}
          className={`px-6 py-2 rounded text-white ${
            !curationType || !curationSegment
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
