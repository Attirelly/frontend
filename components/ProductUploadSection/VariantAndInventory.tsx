"use client";

import React, { useEffect, useState } from "react";
import {
  useCurrentStep,
  useFormActions,
  useFormData,
  useIsLoading,
} from "@/store/product_upload_store";
import { api } from "@/lib/axios";
import LoadingSpinner from "../ui/LoadingSpinner";

interface SizeOption {
  size_id: string;
  size_name: string;
}

interface ColorOption {
  color_id: string;
  color_name: string;
  hex_code: string;
}

interface Variant {
  sku: string;
  size: SizeOption;
  color: ColorOption;
  // quantity: number;
}

export interface VaraintFormState {
  variants?: Variant[];
}

export default function VariantAndInventory() {
  const {
    variants: globalVariants,
    sizes: globalSelectedSizes,
    colors: globalSelectedColors,
    category,
  } = useFormData();
  const colorArray: ColorOption[] = Array.from(
    new Map(
      globalVariants?.variants.map((v) => [v.color.color_id, v.color])
    ).values()
  );
  const sizeArray: SizeOption[] = Array.from(
    new Map(
      globalVariants?.variants.map((v) => [v.size.size_id, v.size])
    ).values()
  );
  console.log("Global Variants:", globalVariants?.variants);
  const { updateFormData, setStepValidation, setLoading } = useFormActions();
  const currentStep = useCurrentStep();
  // Initialize states
  // const [selectedSizes, setSelectedSizes] = useState<SizeOption[]>(
  //   globalSelectedSizes?.sizes || []
  // );
  const [selectedSizes, setSelectedSizes] = useState<SizeOption[]>(
    sizeArray || []
  );
  // const [selectedColors, setSelectedColors] = useState<ColorOption[]>(
  //   globalSelectedColors?.colors || []
  // );
  const [selectedColors, setSelectedColors] = useState<ColorOption[]>(
    colorArray || []
  );
  const [variantsList, setVariantsList] = useState<Variant[]>(
    globalVariants?.variants || []
  );

  const isLoading = useIsLoading();

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

  const variants = globalVariants?.variants || [];

  console.log("my variants", variants);

  useEffect(() => {
    const isValid =
      variants.length > 0 &&
      variants.every(
        (v) => v.sku && v.size && v.size.size_id && v.color && v.color.color_id
        // v.quantity > 0
      );

    setStepValidation(currentStep, isValid);
  }, [variants, currentStep, setStepValidation]);

  // Fetch sizes and colors
  useEffect(() => {
    const fetchData = async () => {
      try {
        // setLoading(true);
        const sizesResponse = await api.get(
          `/sizes/category/${category?.level4?.category_id}`
        );
        setAvailableSizes(sizesResponse.data);
        const colorsResponse = await api.get("/colors");
        setAvailableColors(colorsResponse.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter sizes based on search term and exclude already selected sizes
  const filteredSizes = availableSizes
    .filter((size) =>
      size.size_name.toLowerCase().includes(sizeSearch.toLowerCase())
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
      color.color_name.toLowerCase().includes(colorSearch.toLowerCase())
    )
    .filter(
      (color) =>
        !selectedColors.some(
          (selectedColor) => selectedColor.color_id === color.color_id
        )
    );

  // Generate variants when size or color options change
  useEffect(() => {
    console.log(selectedSizes, selectedColors);
    console.log("Before update:", variantsList);
    if (selectedSizes.length > 0 && selectedColors.length > 0) {
      // Create new variants array while preserving existing SKUs if possible
      const newVariants: Variant[] = [];

      selectedSizes.forEach((size) => {
        selectedColors.forEach((color) => {
          // Check if this size-color combination already exists
          const existingVariant = variantsList?.find(
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
              // quantity: 0,
            });
          }
        });
      });
      console.log("New Variants:", newVariants);

      setVariantsList(newVariants);
    } else {
      console.log("setting null");
      setVariantsList([]);
    }
  }, [selectedSizes, selectedColors]);

  // Handle SKU change for a variant
  const handleSkuChange = (index: number, value: string) => {
    setVariantsList((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], sku: value };
      return updated;
    });
  };

  // const handleQuantityChange = (index: number, value: string) => {
  //   const quantity = parseInt(value, 10) || 0;
  //   setVariantsList((prev) => {
  //     const updated = [...prev];
  //     updated[index] = { ...updated[index], quantity };
  //     return updated;
  //   });
  // };

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
    console.log("Updating form data variants:", variantsList);
    updateFormData("sizes", { sizes: selectedSizes });
    updateFormData("colors", { colors: selectedColors });
    updateFormData("variants", { variants: variantsList });
  }, [selectedSizes, selectedColors, variantsList, updateFormData]);

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg self-start">
      <h1 className="text-lg font-bold mb-2">Variants and inventory</h1>
      <p className="text-gray-600 mb-6">Define every version and its stock</p>

       {isLoading ? (
              <LoadingSpinner />
            ) : (
      <>
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
                  {filteredSizes.length > 0 ? (
                    filteredSizes.map((size) => (
                      <div
                        key={size.size_id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSizeSelect(size)}
                      >
                        {size.size_name}
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
                  <span>{size.size_name}</span>
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
                  {filteredColors.length > 0 ? (
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
                        {color.color_name}
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
                  <span>{color.color_name}</span>
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
      {(variantsList ?? []).length > 0 && (
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
                  {/* <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th> */}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {variantsList?.map((variant, index) => (
                  <tr key={`${variant.size.size_id}-${variant.color.color_id}`}>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <input
                        type="text"
                        value={variant?.sku}
                        onChange={(e) => handleSkuChange(index, e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-1"
                        placeholder="Enter SKU"
                        required
                      />
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {variant.size.size_name}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full border border-gray-300"
                        style={{ backgroundColor: variant.color.hex_code }}
                      />
                      {variant.color.color_name}
                    </td>
                    {/* <td className="px-4 py-2 whitespace-nowrap">
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
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      </>

    )}
    </div>
  );
}
