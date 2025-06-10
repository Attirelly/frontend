'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { api } from '@/lib/axios';

export default function CreateCurationPage() {
  const router = useRouter();
  const [curationType, setCurationType] = useState('');
  const [curationSegment, setCurationSegment] = useState('');
  const [availableSegments, setAvailableSegments] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsedSegments() {
      try {
        const response = await api.get('/homepage/used_section'); // Replace with actual URL
        const usedSegments: number[] = response.data;

        // Filter available numbers from 1 to 9
        const allSegments = Array.from({ length: 9 }, (_, i) => i + 1);
        const filteredSegments = allSegments.filter(num => !usedSegments.includes(num));
        setAvailableSegments(filteredSegments);
      } catch (error) {
        console.error('Failed to fetch used segments:', error);
        alert('Error loading available segments. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchUsedSegments();
  }, []);

  const handleNext = () => {
    if (!curationType || !curationSegment) {
      alert('Please select both Curation Type and Curation Segment before proceeding.');
      return;
    }

    const query = `?curation_type=${encodeURIComponent(curationType)}&curation_number=${encodeURIComponent(curationSegment)}`;
    router.push(`/admin/curationModule/addStoreProduct${query}`);
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="text-xl font-bold mb-8">Curation Module</div>

      {/* Form Section */}
      <div className="max-w-2xl space-y-6">
        {/* Curation Type */}
        <div className="flex items-center gap-4">
          <label className="w-40 font-medium">Curation Type:</label>
          <select
            value={curationType}
            onChange={(e) => setCurationType(e.target.value)}
            className="flex-1 border px-3 py-2 rounded"
          >
            <option value="">Select Type</option>
            <option value="store">store</option>
            <option value="product">product</option>
          </select>
        </div>

        {/* Curation Segment */}
        <div className="flex items-center gap-4">
          <label className="w-40 font-medium">Curation Segment:</label>
          <select
            value={curationSegment}
            onChange={(e) => setCurationSegment(e.target.value)}
            className="flex-1 border px-3 py-2 rounded"
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

      {/* Bottom Right Button */}
      <div className="flex justify-end mt-12">
        <button
          onClick={handleNext}
          disabled={!curationType || !curationSegment}
          className={`px-6 py-2 rounded text-white ${
            !curationType || !curationSegment
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
