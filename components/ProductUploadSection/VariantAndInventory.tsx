"use client";

import React, { useEffect, useState } from "react";
import { useFormActions, useFormData } from "@/store/product_upload_store";
import { api } from "@/lib/axios";

interface SizeOption {
  size_id: string;
  name: string;
}

interface ColorOption {
  color_id: string;
  name: string;
  hex_code: string;
}

interface Variant {
  sku: string;
  size: SizeOption;
  color: ColorOption;
  quantity: number;
}

export interface VaraintFormState {
  variants?: Variant[];
}

export default function VariantAndInventory() {
  const {
    variants: globalVariants,
    sizes: globalSelectedSizes,
    colors: globalSelectedColors,
  } = useFormData();
  const { updateFormData } = useFormActions();
  // Initialize states
  const [selectedSizes, setSelectedSizes] = useState<SizeOption[]>(
    globalSelectedSizes?.sizes || []
  );
  const [selectedColors, setSelectedColors] = useState<ColorOption[]>(
    globalSelectedColors?.colors || []
  );
  const [variantsList, setVariantsList] = useState<VaraintFormState>({
    variants: globalVariants?.variants || [],
  });

  // Available options from API
  const [availableSizes, setAvailableSizes] = useState<SizeOption[]>([]);
  const [availableColors, setAvailableColors] = useState<ColorOption[]>([]);

  // Dropdown visibility
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const [showColorDropdown, setShowColorDropdown] = useState(false);

  // Search/filter terms
  const [sizeSearch, setSizeSearch] = useState("");
  const [colorSearch, setColorSearch] = useState("");

  // Loading states
  const [loading, setLoading] = useState({
    sizes: false,
    colors: false,
    error: "",
  });

  // Fetch sizes and colors
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading((prev) => ({ ...prev, sizes: true }));
        const sizesResponse = await api.get("/sizes");
        setAvailableSizes(sizesResponse.data);

        setLoading((prev) => ({ ...prev, colors: true }));
        const colorsResponse = await api.get("/colors");
        setAvailableColors(colorsResponse.data);
      } catch (error) {
        setLoading((prev) => ({ ...prev, error: "Failed to fetch options" }));
      } finally {
        setLoading((prev) => ({ ...prev, sizes: false, colors: false }));
      }
    };

    fetchData();
  }, []);

  // Filter sizes based on search term and exclude already selected sizes
  const filteredSizes = availableSizes
    .filter((size) =>
      size.name.toLowerCase().includes(sizeSearch.toLowerCase())
    )
    .filter(
      (size) =>
        !selectedSizes.some(
          (selectedSize) => selectedSize.size_id === size.size_id
        )
    );

  // Filter colors based on search term and exclude already selected colors
  const filteredColors = availableColors
    .filter((color) =>
      color.name.toLowerCase().includes(colorSearch.toLowerCase())
    )
    .filter(
      (color) =>
        !selectedColors.some(
          (selectedColor) => selectedColor.color_id === color.color_id
        )
    );

  // Generate variants when size or color options change
  useEffect(() => {
    if (selectedSizes.length > 0 && selectedColors.length > 0) {
      // Create new variants array while preserving existing SKUs if possible
      const newVariants: Variant[] = [];

      selectedSizes.forEach((size) => {
        selectedColors.forEach((color) => {
          // Check if this size-color combination already exists
          const existingVariant = variantsList?.variants?.find(
            (v) =>
              v.size.size_id === size.size_id &&
              v.color.color_id === color.color_id
          );

          if (existingVariant) {
            // Keep the existing variant with its SKU
            newVariants.push(existingVariant);
          } else {
            // Create new variant with empty SKU
            newVariants.push({
              sku: "",
              size,
              color,
              quantity: 0,
            });
          }
        });
      });

      setVariantsList({ variants: newVariants });
    } else {
      setVariantsList({ variants: [] });
    }
  }, [selectedSizes, selectedColors]);

  // Handle SKU change for a variant
  const handleSkuChange = (index: number, value: string) => {
    const newVariants = variantsList.variants || [];
    newVariants[index].sku = value;
    setVariantsList({ variants: newVariants });
  };

  // Handle quantity change for a variant
  const handleQuantityChange = (index: number, value: string) => {
    const newVariants = variantsList.variants || [] ; 
    newVariants[index].quantity = parseInt(value) || 0;
    setVariantsList({ variants: newVariants });
  
  };

  // Handle size selection
  const handleSizeSelect = (size: SizeOption) => {
    setSelectedSizes((prev) => [...prev, size]);
    setSizeSearch("");
    setShowSizeDropdown(false);
  };

  // Handle color selection
  const handleColorSelect = (color: ColorOption) => {
    setSelectedColors((prev) => [...prev, color]);
    setColorSearch("");
    setShowColorDropdown(false);
  };

  // Remove size
  const removeSize = (size_id: string) => {
    setSelectedSizes((prev) => prev.filter((size) => size.size_id !== size_id));
  };

  // Remove color
  const removeColor = (color_id: string) => {
    setSelectedColors((prev) =>
      prev.filter((color) => color.color_id !== color_id)
    );
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target.closest(".size-dropdown-container") &&
        !target.closest(".color-dropdown-container")
      ) {
        setShowSizeDropdown(false);
        setShowColorDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update form data when options change
  useEffect(() => {
    updateFormData("sizes", selectedSizes);
    updateFormData("colors", selectedColors);
    updateFormData("variants", variantsList);
    console.log("my variant list", variantsList);
  }, [selectedSizes, selectedColors, variantsList, updateFormData]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg self-start">
      <h1 className="text-2xl font-bold mb-2">Variants and inventory</h1>
      <p className="text-gray-600 mb-6">Define every version and its stock</p>

      {loading.error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {loading.error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Column 1 - Size Selection */}
        <div className="flex flex-col gap-4">
          <div className="relative size-dropdown-container">
            <label className="block text-sm font-medium mb-1">
              Size options
            </label>
            <div className="relative">
              <input
                type="text"
                value={sizeSearch}
                onChange={(e) => {
                  setSizeSearch(e.target.value);
                  setShowSizeDropdown(true);
                }}
                onFocus={() => {
                  setShowSizeDropdown(true);
                  setSizeSearch("");
                }}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Search and select sizes"
              />
              {showSizeDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {loading.sizes ? (
                    <div className="px-4 py-2 text-gray-500">
                      Loading sizes...
                    </div>
                  ) : filteredSizes.length > 0 ? (
                    filteredSizes.map((size) => (
                      <div
                        key={size.size_id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSizeSelect(size)}
                      >
                        {size.name}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-500">
                      No matching sizes found
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Selected Sizes */}
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedSizes.map((size) => (
                <div
                  key={size.size_id}
                  className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1"
                >
                  <span>{size.name}</span>
                  <button
                    type="button"
                    onClick={() => removeSize(size.size_id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 2 - Color Selection */}
        <div className="flex flex-col gap-4">
          <div className="relative color-dropdown-container">
            <label className="block text-sm font-medium mb-1">
              Color choice
            </label>
            <div className="relative">
              <input
                type="text"
                value={colorSearch}
                onChange={(e) => {
                  setColorSearch(e.target.value);
                  setShowColorDropdown(true);
                }}
                onFocus={() => {
                  setShowColorDropdown(true);
                  setColorSearch("");
                }}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Search and select colors"
              />
              {showColorDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {loading.colors ? (
                    <div className="px-4 py-2 text-gray-500">
                      Loading colors...
                    </div>
                  ) : filteredColors.length > 0 ? (
                    filteredColors.map((color) => (
                      <div
                        key={color.color_id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                        onClick={() => handleColorSelect(color)}
                      >
                        <div
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: color.hex_code }}
                        />
                        {color.name}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-500">
                      No matching colors found
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Selected Colors */}
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedColors.map((color) => (
                <div
                  key={color.color_id}
                  className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2"
                >
                  <div
                    className="w-3 h-3 rounded-full border border-gray-300"
                    style={{ backgroundColor: color.hex_code }}
                  />
                  <span>{color.name}</span>
                  <button
                    type="button"
                    onClick={() => removeColor(color.color_id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Variants Table */}
      {(variantsList?.variants ?? []).length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-medium mb-3">Product Variants</h2>
          <p className="text-sm text-gray-500 mb-4">
            Enter SKU for each size/color combination
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Color
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {variantsList.variants?.map((variant, index) => (
                  <tr key={`${variant.size.size_id}-${variant.color.color_id}`}>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <input
                        type="text"
                        value={variant.sku}
                        onChange={(e) => handleSkuChange(index, e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-1"
                        placeholder="Enter SKU"
                        required
                      />
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {variant.size.name}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full border border-gray-300"
                        style={{ backgroundColor: variant.color.hex_code }}
                      />
                      {variant.color.name}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <input
                        type="number"
                        min="0"
                        value={variant.quantity}
                        onChange={(e) =>
                          handleQuantityChange(index, e.target.value)
                        }
                        className="w-20 border border-gray-300 rounded-md p-1"
                        required
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
