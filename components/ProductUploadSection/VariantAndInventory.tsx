'use client';

import React, { useState } from 'react';

export default function VariantAndInventory(){
    const [sizeOptions, setSizeOptions] = useState('');
  const [autoSku, setAutoSku] = useState<'yes' | 'no'>('yes');
  const [colorChoice, setColorChoice] = useState('');
  const [inventoryQty, setInventoryQty] = useState('');

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg self-start">
      <h1 className="text-2xl font-bold mb-2">Variants and inventory</h1>
      <p className="text-gray-600 mb-6">Define every version and its stock</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Column 1 */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Size options</label>
            <input
              type="text"
              value={sizeOptions}
              onChange={(e) => setSizeOptions(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="e.g., S, M, L"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Auto-generated SKU combinations</label>
            <div className="flex gap-4 mt-2 align-center">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="autoSku"
                  value="yes"
                  checked={autoSku === 'yes'}
                  onChange={() => setAutoSku('yes')}
                />
                Yes
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="autoSku"
                  value="no"
                  checked={autoSku === 'no'}
                  onChange={() => setAutoSku('no')}
                />
                No
              </label>
            </div>
          </div>
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Color choice</label>
            <input
              type="text"
              value={colorChoice}
              onChange={(e) => setColorChoice(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="e.g., Red, Blue"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Inventory quantity per SKU</label>
            <input
              type="number"
              value={inventoryQty}
              onChange={(e) => setInventoryQty(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="e.g., 100"
            />
          </div>
        </div>
      </div>
    </div>
  );
}