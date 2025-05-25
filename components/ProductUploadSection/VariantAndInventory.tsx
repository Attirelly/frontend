"use client";

import React, { useEffect, useState } from "react";
import { useFormActions, useFormData } from "@/store/product_upload_store";
import { api } from "@/lib/axios";

export default function VariantAndInventory() {
  const { variants } = useFormData();
  const { updateFormData } = useFormActions();
  const [sizeOptions, setSizeOptions] = useState<string[]>(variants?.sizeOptions?.split(", ") || []);
  const [autoSku, setAutoSku] = useState<"yes" | "no">(variants?.autoSku || "yes");
  const [colorChoice, setColorChoice] = useState<string[]>(variants?.colorChoice?.split(", ") || []);
  const [inventoryQty, setInventoryQty] = useState(variants?.inventoryQty || "");
  const [sizes, setSizes] = useState<{id: string, name: string}[]>([]);
  const [colors, setColors] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState({
    sizes: false,
    colors: false,
    error: ""
  });

  // Fetch sizes and colors on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(prev => ({...prev, sizes: true}));
        const sizesResponse = await api.get('/sizes');
        setSizes(sizesResponse.data);
        
        setLoading(prev => ({...prev, colors: true}));
        const colorsResponse = await api.get('/colors');
        setColors(colorsResponse.data);
      } catch (error) {
        setLoading(prev => ({...prev, error: "Failed to fetch options"}));
      } finally {
        setLoading(prev => ({...prev, sizes: false, colors: false}));
      }
    };
    
    fetchData();
  }, []);

  // Handle size selection
  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setSizeOptions(selectedOptions);
  };

  // Handle color selection
  const handleColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setColorChoice(selectedOptions);
  };

  useEffect(() => {
    updateFormData("variants", {
      sizeOptions: sizeOptions.join(", "),
      autoSku,
      colorChoice: colorChoice.join(", "),
      inventoryQty,
    });
  }, [sizeOptions, autoSku, colorChoice, inventoryQty, updateFormData]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg self-start">
      <h1 className="text-2xl font-bold mb-2">Variants and inventory</h1>
      <p className="text-gray-600 mb-6">Define every version and its stock</p>

      {loading.error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {loading.error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Column 1 */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Size options
            </label>
            <select
              multiple
              value={sizeOptions}
              onChange={handleSizeChange}
              className="w-full border border-gray-300 rounded-md p-2 h-auto min-h-[42px]"
              size={2} // Shows 4 options by default with scroll
            >
              {loading.sizes ? (
                <option disabled>Loading sizes...</option>
              ) : sizes.length > 0 ? (
                sizes.map((size) => (
                  <option 
                    key={size.id} 
                    value={size.name}
                    className="p-2 hover:bg-gray-100"
                  >
                    {size.name}
                  </option>
                ))
              ) : (
                <option disabled>No sizes available</option>
              )}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Hold Ctrl/Cmd to select multiple options
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Auto-generated SKU combinations
            </label>
            <div className="flex gap-4 mt-2 align-center">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="autoSku"
                  value="yes"
                  checked={autoSku === "yes"}
                  onChange={() => setAutoSku("yes")}
                />
                Yes
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="autoSku"
                  value="no"
                  checked={autoSku === "no"}
                  onChange={() => setAutoSku("no")}
                />
                No
              </label>
            </div>
          </div>
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Color choice
            </label>
            <select
              multiple
              value={colorChoice}
              onChange={handleColorChange}
              className="w-full border border-gray-300 rounded-md p-2 h-auto min-h-[42px]"
              size={2}
            >
              {loading.colors ? (
                <option disabled>Loading colors...</option>
              ) : colors.length > 0 ? (
                colors.map((color) => (
                  <option 
                    key={color.id} 
                    value={color.name}
                    className="p-2 hover:bg-gray-100"
                  >
                    {color.name}
                  </option>
                ))
              ) : (
                <option disabled>No colors available</option>
              )}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Hold Ctrl/Cmd to select multiple options
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Inventory quantity per SKU
            </label>
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