'use client';
import { useState } from 'react';

const dummyData = {
  id: 'c6acc03e-7a80-4cdb-a0ef-2e8625b2de4a',
  name: 'John Doe',
  city: 'Ludhiana',
  area: 'Mall Road',
  location: { lat: 30.901, lng: 75.8573 },
  image: 'https://via.placeholder.com/150',
  store_types: ['Clothing', 'Footwear'],
  genders: ['Men', 'Women'],
  average_price_min: 500,
  average_price_max: 2000,
  sponsor: 1,
  store_name: 'Store11',
};

export default function StoreFormPage({ params }: { params: { id: string } }) {
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [formData, setFormData] = useState(dummyData);
  const isReadOnly = mode === 'view';

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const locField = name.split('.')[1];
      setFormData((prev: any) => ({
        ...prev,
        location: {
          ...prev.location,
          [locField]: value,
        },
      }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleTagAdd = (field: 'store_types' | 'genders', value: string) => {
    if (!value.trim()) return;
    setFormData((prev: any) => ({
      ...prev,
      [field]: [...prev[field], value.trim()],
    }));
  };

  const handleTagRemove = (field: 'store_types' | 'genders', index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: prev[field].filter((_: any, i: number) => i !== index),
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log('Submitted data:', formData);
    setMode('view');
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 p-8 bg-white shadow-xl rounded-xl border border-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">{mode === 'view' ? 'View Store' : 'Edit Store'}</h1>
        <div className="space-x-3">
          <button
            onClick={() => setMode('view')}
            className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition ${
              mode === 'view' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            View
          </button>
          <button
            onClick={() => setMode('edit')}
            className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition ${
              mode === 'edit' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Edit
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Standard Inputs */}
        {[
          { label: 'Store Name', name: 'store_name' },
          { label: 'Name', name: 'name' },
          { label: 'City', name: 'city' },
          { label: 'Area', name: 'area' },
          { label: 'Latitude', name: 'location.lat' },
          { label: 'Longitude', name: 'location.lng' },
          { label: 'Min Price', name: 'average_price_min' },
          { label: 'Max Price', name: 'average_price_max' },
          { label: 'Sponsor', name: 'sponsor' },
          { label: 'Image URL', name: 'image' },
        ].map(({ label, name }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
              type="text"
              name={name}
              value={
                name.startsWith('location.')
                  ? formData.location[name.split('.')[1]]
                  : formData[name] ?? ''
              }
              onChange={handleChange}
              disabled={isReadOnly}
              className={`w-full px-4 py-2 border rounded-lg text-sm shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isReadOnly ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'
              }`}
            />
          </div>
        ))}

        {/* Tag-based Fields */}
        {['store_types', 'genders'].map((field) => (
          <div key={field} className="col-span-full">
            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
              {field.replace('_', ' ')}
            </label>

            <div className="flex flex-wrap gap-2 mb-2">
              {formData[field].map((item: string, index: number) => (
                <span
                  key={index}
                  className="flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
                >
                  {item}
                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={() => handleTagRemove(field as any, index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>

            {!isReadOnly && (
              <input
                type="text"
                placeholder={`Add ${field.replace('_', ' ')} (press Enter)`}
                className="w-full px-4 py-2 border rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleTagAdd(field as any, e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
            )}
          </div>
        ))}

        {/* Action Buttons */}
        {!isReadOnly && (
          <div className="col-span-full flex justify-end space-x-3 mt-6">
            <button
              type="submit"
              className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setFormData(dummyData)}
              className="inline-flex items-center px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
