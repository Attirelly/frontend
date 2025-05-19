'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Curation {
  id: number;
  name: string;
  type: string;
  segment: string;
  viewUrl: string;
}

export default function CurationPage() {
  const [curations, setCurations] = useState<Curation[]>([
    {
      id: 1,
      name: 'Top Picks',
      type: 'Manual',
      segment: 'Homepage',
      viewUrl: 'https://example.com/view/1',
    },
    {
      id: 2,
      name: 'Trending Now',
      type: 'Automated',
      segment: 'Sidebar',
      viewUrl: 'https://example.com/view/2',
    },
  ]);

  const router = useRouter();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Curation Module</h1>
        <button
          onClick={() => router.push('/admin/curationModule/createCuration')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Curation
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border mt-4">
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="border px-4 py-2">Curation Name</th>
              <th className="border px-4 py-2">Curation Type</th>
              <th className="border px-4 py-2">Curation Segment</th>
              <th className="border px-4 py-2">View All URL</th>
              <th className="border px-4 py-2">Edit</th>
              <th className="border px-4 py-2">Delete</th>
            </tr>
          </thead>
          <tbody>
            {curations.map((curation) => (
              <tr key={curation.id} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{curation.name}</td>
                <td className="border px-4 py-2">{curation.type}</td>
                <td className="border px-4 py-2">{curation.segment}</td>
                <td className="border px-4 py-2">
                  <a
                    href={curation.viewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View
                  </a>
                </td>
                <td className="border px-4 py-2">
                  <button className="bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded">Edit</button>
                </td>
                <td className="border px-4 py-2">
                  <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
