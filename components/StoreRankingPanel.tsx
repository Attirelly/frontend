'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Seller {
  id: number;
  name: string;
  category: string;
  sortOrder: number;
  date: string;
}

const initialData: Seller[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: `Seller ${i + 1}`,
  category: `Section ${2 + (i % 3)}`,
  sortOrder: i + 1,
  date: new Date().toISOString().split('T').join(' ').split('.')[0],
}));

export default function StoreRankingPanel() {
  const [search, setSearch] = useState('');
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  // Filter sellers by search
  const filtered = initialData.filter((seller) =>
    seller.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / entries);
  const startIndex = (currentPage - 1) * entries;
  const endIndex = startIndex + entries;
  const currentData = filtered.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">View Store Ranking</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" 
        onClick={()=>router.push('/admin/addRankedStore')}>Add</button>
      </div>

      {/* Center Heading */}
      <h3 className="text-center text-xl font-semibold">View Section 2 To 4</h3>

      {/* Banner Buttons */}
      <div className="flex justify-center gap-4">
        {['Section 2', 'Section 3', 'Section 4'].map((sec) => (
          <button key={sec} className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
            {sec} Banner
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex justify-between items-center">
        <div>
          <label>Show </label>
          <select
            value={entries}
            onChange={(e) => {
              setEntries(Number(e.target.value));
              setCurrentPage(1); // Reset to first page on change
            }}
            className="border px-2 py-1 rounded"
          >
            {[5, 10, 15, 20].map((num) => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
          <span> entries</span>
        </div>
        <div>
          <label className="mr-2">Search:</label>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="border px-2 py-1 rounded"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border mt-4">
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="border px-4 py-2">#</th>
              <th className="border px-4 py-2">Seller Name</th>
              <th className="border px-4 py-2">Category</th>
              <th className="border px-4 py-2">Sort Order</th>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((seller, idx) => (
              <tr key={seller.id} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{startIndex + idx + 1}</td>
                <td className="border px-4 py-2">{seller.name}</td>
                <td className="border px-4 py-2">{seller.category}</td>
                <td className="border px-4 py-2">{seller.sortOrder}</td>
                <td className="border px-4 py-2">{seller.date}</td>
                <td className="border px-4 py-2 space-x-2">
                  <button className="bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded">Edit</button>
                  <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-2 mt-4">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => goToPage(i + 1)}
            className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : ''}`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}