'use client';

import { useEffect, useState, ChangeEvent } from 'react';

type Seller = {
  id: number;
  name: string;
  email: string;
};

export default function Home() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [filteredSellers, setFilteredSellers] = useState<Seller[]>([]);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    const dummyData: Seller[] = [
      { id: 1, name: 'Alice Store', email: 'alice@example.com' },
      { id: 2, name: 'Bob Mart', email: 'bob@example.com' },
      { id: 3, name: 'Charlie Bazaar', email: 'charlie@example.com' },
    ];
    setSellers(dummyData);
    setFilteredSellers(dummyData);
  }, []);

  const handleSearch = (query: string) => {
    setSearch(query);
    const filtered = sellers.filter((seller) =>
      seller.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredSellers(filtered);
  };

  const handleUploadCSV = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      const text = event.target?.result as string;
      const lines = text.split('\n');
      const uploaded: Seller[] = lines
        .slice(1)
        .map((line) => {
          const [id, name, email] = line.split(',');
          return { id: Number(id), name: name?.trim(), email: email?.trim() };
        })
        .filter((s) => s.name && s.email);

      setSellers(uploaded);
      setFilteredSellers(uploaded);
    };
    reader.readAsText(file);
  };

  const handleDownloadCSV = () => {
    const header = 'id,name,email\n';
    const rows = filteredSellers
      .map((s) => `${s.id},${s.name},${s.email}`)
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'sellers.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">🛍️ Seller Manager</h1>

      <div className="flex flex-wrap gap-4 justify-center items-center mb-8">
        <input
          type="text"
          placeholder="Search sellers..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Upload CSV
          <input
            type="file"
            accept=".csv"
            onChange={handleUploadCSV}
            className="hidden"
          />
        </label>

        <button
          onClick={handleDownloadCSV}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          ⬇️ Download CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-200 shadow-sm">
          <thead className="bg-gray-100 text-gray-700 uppercase text-sm font-semibold">
            <tr>
              <th className="px-6 py-3 border">ID</th>
              <th className="px-6 py-3 border">Name</th>
              <th className="px-6 py-3 border">Email</th>
            </tr>
          </thead>
          <tbody>
            {filteredSellers.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-6 text-gray-500">
                  No sellers found.
                </td>
              </tr>
            ) : (
              filteredSellers.map((seller) => (
                <tr key={seller.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 border text-center">{seller.id}</td>
                  <td className="px-6 py-3 border">{seller.name}</td>
                  <td className="px-6 py-3 border">{seller.email}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
