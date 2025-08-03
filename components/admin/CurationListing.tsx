'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { api } from '@/lib/axios';
import { toast } from 'sonner';
import Link from 'next/link';

interface Curation {
  section_id: string;
  section_name: string;
  section_type: string;
  section_number: number;
  section_url: string;
}

export default function CurationPage() {
  const [curations, setCurations] = useState<Curation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    
    router.prefetch('/admin/curationModule/createCuration');
    
  }, []);

  useEffect(() => {
    async function fetchCurations() {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/homepage/section'); // Replace with your backend API URL
        // 
        setCurations(response.data.sort((a : Curation, b : Curation) => a.section_number - b.section_number));
      } catch (err) {
        setError('Failed to load curations.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchCurations();
  }, []);

  const handleEdit = (section_id: string, section_name: string, section_url: string, section_type: string, section_number: number) => {
    const query = `?curation_id=${encodeURIComponent(section_id)}&curation_name=${encodeURIComponent(section_name)}&curation_url=${encodeURIComponent(section_url)}&curation_type=${encodeURIComponent(section_type)}&curation_number=${encodeURIComponent(section_number)}`;
    router.push(`/admin/curationModule/addStoreProduct${query}`);
  };

  const handleDelete = async (section_id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this curation?');
    if (!confirmed) return;
    try {
      await api.delete(`/homepage/section/${section_id}`);
      // alert('Curation deleted successfully.');
      toast.success("Curation deleted!")
      setCurations((prev) => prev.filter((curation) => curation.section_id !== section_id));
    } catch (error) {
      console.error('Failed to delete curation:', error);
      // alert('Failed to delete curation.');
      toast.error("Curation not deleted!")
    }
  };

  if (loading) return <div className="p-6">Loading curations...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black">Curation Module</h1>
        <Link
          href ='/admin/curationModule/createCuration'
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Curation
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border mt-4">
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="border px-4 py-2 text-black">Curation Name</th>
              <th className="border px-4 py-2 text-black">Curation Type</th>
              <th className="border px-4 py-2 text-black">Curation Segment</th>
              <th className="border px-4 py-2 text-black">View All URL</th>
              <th className="border px-4 py-2 text-black">Edit</th>
              <th className="border px-4 py-2 text-black">Delete</th>
            </tr>
          </thead>
          <tbody>
            {curations.map((curation) => (
              <tr key={curation.section_id} className="hover:bg-gray-100">
                <td className="border px-4 py-2 text-black">{curation.section_name}</td>
                <td className="border px-4 py-2 text-black">{curation.section_type}</td>
                <td className="border px-4 py-2 text-black">{curation.section_number}</td>
                <td className="border px-4 py-2 text-black">
                  <a
                    href={curation.section_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View
                  </a>
                </td>
                <td className="border px-4 py-2 text-black">
                  <button className="bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded"
                    onClick={() => handleEdit(curation.section_id, curation.section_name, curation.section_url, curation.section_type, curation.section_number)}>
                    Edit
                  </button>
                </td>
                <td className="border px-4 py-2 text-black">
                  <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    onClick={() => handleDelete(curation.section_id)}>
                    Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
