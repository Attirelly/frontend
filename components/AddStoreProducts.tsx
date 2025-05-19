'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';

export default function AddStoreProduct() {
  const searchParams = useSearchParams();
  const curation_type = searchParams.get('curation_type');
  const curation_number = searchParams.get('curation_number');

  const rows = Array.from({ length: 9 });
  const [stores, setStores] = useState([]);
  const [storeSelections, setStoreSelections] = useState(Array(9).fill(''));
  const [curationName, setCurationName] = useState('');
  const [viewAllUrl, setViewAllUrl] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:8000/stores/')
      .then((response) => {
        console.log('Stores:', response.data);
        setStores(response.data);
      })
      .catch((error) => {
        console.error('Error fetching stores:', error);
      });
  }, []);

  const handleStoreChange = (index: number, value: string) => {
    const updated = [...storeSelections];
    updated[index] = value;
    setStoreSelections(updated);
  };

  const handleCreate = async () => {
    const selectedStores = storeSelections.filter((v) => v.trim() !== '');

    if (!curationName.trim() || !viewAllUrl.trim()) {
      alert('Curation name and View All URL are required.');
      return;
    }

    if (selectedStores.length === 0) {
      alert('At least one store must be selected or entered.');
      return;
    }

    try {
      const payload = {
        section_name: curationName,
        section_number: Number(curation_number) || 1,
        section_type: curation_type,
        section_url: viewAllUrl,
        store_ids: selectedStores,
        product_ids: [], // you can add product handling later
      };

      const response = await axios.post('http://localhost:8000/homepage/section', payload);
      alert('Section created successfully!');
      console.log('Created:', response.data);
    } catch (error) {
      console.error('Failed to create section:', error);
      alert('Failed to create section.');
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-6">Curation Module</h1>

      {/* Top Inputs */}
      <div className="flex flex-wrap gap-6 mb-10 items-center">
        <div className="flex flex-col">
          <label className="font-semibold mb-1">Curation Name</label>
          <input
            type="text"
            className="border rounded px-4 py-2 w-48"
            value={curationName}
            onChange={(e) => setCurationName(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-1">View All URL Input</label>
          <input
            type="text"
            className="border rounded px-4 py-2 w-64"
            value={viewAllUrl}
            onChange={(e) => setViewAllUrl(e.target.value)}
          />
        </div>
      </div>

      {/* Store/Product Rows */}
      <div className="space-y-4 mb-12">
        {rows.map((_, index) => (
          <div key={index} className="flex gap-4">
            {/* Store Input with Suggestions */}
            <div className="w-64">
              <input
                list="store-options"
                placeholder="Select or type store"
                className="border rounded px-4 py-2 w-full"
                value={storeSelections[index]}
                onChange={(e) => handleStoreChange(index, e.target.value)}
              />
            </div>

            {/* Product Dropdown (if type = product) */}
            {curation_type === 'product' ? (
              <select className="border rounded px-4 py-2 w-64">
                <option>Select Product</option>
              </select>
            ) : (
              <select
                className="border rounded px-4 py-2 w-64 opacity-50"
                disabled
                style={{ visibility: 'hidden' }}
              >
                <option>Select Product</option>
              </select>
            )}

            <input
              type="text"
              className="border rounded px-4 py-2 w-64"
              placeholder="Order"
            />
          </div>
        ))}
      </div>

      {/* Datalist with Suggestions */}
      <datalist id="store-options">
        {stores.map((store: any) => (
          <option key={store.store_id} value={store.store_name} />
        ))}
      </datalist>

      {/* Buttons */}
      <div className="flex justify-between">
        <button className="bg-gray-300 text-black rounded-full px-6 py-2">Back</button>
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white rounded-full px-6 py-2"
        >
          Create
        </button>
      </div>
    </div>
  );
}
