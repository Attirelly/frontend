'use client';

import { useEffect, useState } from 'react';
import axios from 'axios'
type Store = {
  id: number;
  store_name: string;
};
export default function AddStorePriorityPage() {
  const [selectedStore, setSelectedStore] = useState('');
  const [storeType, setStoreType] = useState('');
  const [location, setLocation] = useState('');
  const [subLocation, setSubLocation] = useState('');
  const [stores, setStores] = useState<Store[]>([]);

  useEffect(()=>{
    axios.get(`http://localhost:8000/search/search_store`)
    .then(response => {
        setStores(response.data.hits)
      })
      .catch(error => {
        console.error('Error fetching from FastAPI:', error)
      })
  }, [])

  const handleAdd = () => {
    console.log({
      selectedStore,
      storeType,
      location,
      subLocation,
    });
    // You can call an API here

  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-center">Add Store Priority</h2>

      {/* Select Store */}
      <div>
        <label className="block mb-1 font-medium">Select Store</label>
        <select
          value={selectedStore}
          onChange={(e) => setSelectedStore(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">-- Select Store --</option>
            {stores.map((store) => (
                <option key={store.id} value={store.id}>
                {store.store_name}
                </option>
            ))}
        </select>
      </div>

      {/* Store Type */}
      <div>
        <label className="block mb-1 font-medium">Store Type</label>
        <select
          value={storeType}
          onChange={(e) => setStoreType(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">-- Select Type --</option>
          <option value="fashion">Fashion</option>
          <option value="electronics">Electronics</option>
        </select>
      </div>

      {/* Store Location */}
      <div>
        <label className="block mb-1 font-medium">Store Location</label>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">-- Select Location --</option>
          <option value="mumbai">Mumbai</option>
          <option value="delhi">Delhi</option>
        </select>
      </div>

      {/* Store Sublocation */}
      <div>
        <label className="block mb-1 font-medium">Store Sublocation</label>
        <select
          value={subLocation}
          onChange={(e) => setSubLocation(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">-- Select Sublocation --</option>
          <option value="andheri">Andheri</option>
          <option value="saket">Saket</option>
        </select>
      </div>

      {/* Add Button */}
      <div className="text-center">
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Add
        </button>
      </div>
    </div>
  );
}