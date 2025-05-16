'use client';

import { useState } from 'react';
import axios from 'axios';

export default function AddSectionPage() {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAdd = async () => {
    try {
      setLoading(true);
      setMessage('');

      const payload = {
        description,
        store_id: null, // explicitly setting it as null
      };

      const response = await axios.post('http://localhost:8000/homepage/section', payload);

      setMessage('Section created successfully!');
      setDescription('');
    } catch (err: any) {
      console.error(err);
      setMessage('Failed to create section.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold text-center">Add Section</h1>

      <div>
        <label className="block mb-1 font-medium">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-3 py-2 rounded shadow-sm"
          placeholder="Enter section description"
        />
      </div>

      <div className="text-center">
        <button
          onClick={handleAdd}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add'}
        </button>
      </div>

      {message && (
        <div className="text-center text-sm text-gray-700">{message}</div>
      )}
    </div>
  );
}
