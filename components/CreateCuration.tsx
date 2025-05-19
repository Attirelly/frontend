'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateCurationPage() {
  const router = useRouter();
  const [curationType, setCurationType] = useState('');
  const [curationSegment, setCurationSegment] = useState('');

  const handleNext = () => {
    if (!curationType || !curationSegment) {
      alert('Please select both Curation Type and Curation Segment before proceeding.');
      return;
    }

    const query = `?curation_type=${encodeURIComponent(curationType)}&curation_number=${encodeURIComponent(curationSegment)}`;
    router.push(`/admin/curationModule/addStoreProduct${query}`);
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="text-xl font-bold mb-8">Curation Module</div>

      {/* Form Section */}
      <div className="max-w-2xl space-y-6">
        {/* Row 1 */}
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

        {/* Row 2 */}
        <div className="flex items-center gap-4">
          <label className="w-40 font-medium">Curation Segment:</label>
          <select
            value={curationSegment}
            onChange={(e) => setCurationSegment(e.target.value)}
            className="flex-1 border px-3 py-2 rounded"
          >
            <option value="">Select Segment</option>
            {[...Array(9)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bottom Right Button */}
      <div className="flex justify-end mt-12">
        <button
          onClick={handleNext}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Next
        </button>
      </div>
    </div>
  );
}
