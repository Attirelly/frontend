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
  const { updateFormData, setStepValidation, setLoading } = useFormActions();
  const currentStep = useCurrentStep();
  const isLoading = useIsLoading();

  const [selectedSizes, setSelectedSizes] = useState<SizeOption[]>(sizeArray || []);
  const [selectedColors, setSelectedColors] = useState<ColorOption[]>(colorArray || []);
  const [variantsList, setVariantsList] = useState<Variant[]>(globalVariants?.variants || []);
  const [excludedVariants, setExcludedVariants] = useState<
    { size_id: string; color_id: string }[]
  >([]);
  
  const [availableSizes, setAvailableSizes] = useState<SizeOption[]>([]);
  const [availableColors, setAvailableColors] = useState<ColorOption[]>([]);
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const [showColorDropdown, setShowColorDropdown] = useState(false);
  const [sizeSearch, setSizeSearch] = useState("");
  const [colorSearch, setColorSearch] = useState("");

  useEffect(() => {
    const isValid =
      variantsList.length > 0 &&
      variantsList.every((v) => v.sku && v.size?.size_id && v.color?.color_id);
    setStepValidation(currentStep, isValid);
  }, [variantsList, currentStep]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sizesResponse = await api.get(
          `/sizes/category/${category?.level4?.category_id}`
        );
        setAvailableSizes(sizesResponse.data);
        const colorsResponse = await api.get("/colors");
        setAvailableColors(colorsResponse.data);
      } catch (error) {
        console.error("Failed to fetch size/color", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredSizes = availableSizes
    .filter((s) => s.size_name.toLowerCase().includes(sizeSearch.toLowerCase()))
    .filter((s) => !selectedSizes.find((ss) => ss.size_id === s.size_id));

  const filteredColors = availableColors
    .filter((c) =>
      c.color_name.toLowerCase().includes(colorSearch.toLowerCase())
    )
    .filter((c) => !selectedColors.find((sc) => sc.color_id === c.color_id));

  useEffect(() => {
    if (selectedSizes.length > 0 && selectedColors.length > 0) {
      const newVariants: Variant[] = [];
      selectedSizes.forEach((size) => {
        selectedColors.forEach((color) => {
          const isExcluded = excludedVariants.some(
            (ex) =>
              ex.size_id === size.size_id && ex.color_id === color.color_id
          );
          if (isExcluded) return;

          const existing = variantsList.find(
            (v) =>
              v.size.size_id === size.size_id &&
              v.color.color_id === color.color_id
          );
          if (existing) {
            newVariants.push(existing);
          } else {
            newVariants.push({ sku: "", size, color });
          }
        });
      });
      setVariantsList(newVariants);
    }
  }, [selectedSizes, selectedColors]);

  const closeAllDropdowns = () => {
    setShowColorDropdown(false);
    setShowSizeDropdown(false);
  };

  const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".size-dropdown-container") &&
          !(e.target as HTMLElement).closest(".color-dropdown-container")) {
        closeAllDropdowns();
      }
    };
  
    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

  const handleSkuChange = (index: number, val: string) => {
    setVariantsList((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], sku: val };
      return updated;
    });
  };

  const handleRemoveVariant = (size_id: string, color_id: string) => {
    setVariantsList((prev) =>
      prev.filter(
        (v) => !(v.size.size_id === size_id && v.color.color_id === color_id)
      )
    );
    // setExcludedVariants((prev) => [...prev, { size_id, color_id }]);
  };

  const handleSizeSelect = (size: SizeOption) => {
    setSelectedSizes((prev) => [...prev, size]);
    setSizeSearch("");
    setShowSizeDropdown(false);
  };

  const handleColorSelect = (color: ColorOption) => {
    setSelectedColors((prev) => [...prev, color]);
    setColorSearch("");
    setShowColorDropdown(false);
  };

  const removeSize = (id: string) => {
    setSelectedSizes((prev) => prev.filter((s) => s.size_id !== id));
  };

  const removeColor = (id: string) => {
    setSelectedColors((prev) => prev.filter((c) => c.color_id !== id));
  };

  useEffect(() => {
    updateFormData("sizes", { sizes: selectedSizes });
    updateFormData("colors", { colors: selectedColors });
    updateFormData("variants", { variants: variantsList });
  }, [selectedSizes, selectedColors, variantsList]);

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg">
      <h1 className="text-lg font-bold mb-2">Variants and Inventory</h1>

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
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto scrollbar-thin">
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
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto scrollbar-thin">
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

          {/* Variant Table */}
          {variantsList.length > 0 && (
            <div className="overflow-x-auto mt-6">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2">SKU</th>
                    <th className="px-4 py-2">Size</th>
                    <th className="px-4 py-2">Color</th>
                    <th className="px-4 py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {variantsList.map((variant, index) => (
                    <tr
                      key={`${variant.size.size_id}-${variant.color.color_id}`}
                    >
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={variant.sku}
                          onChange={(e) =>
                            handleSkuChange(index, e.target.value)
                          }
                          className="w-full border border-gray-300 rounded-md p-1"
                          placeholder="Enter SKU"
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
                      <td className="px-4 py-2 text-right">
                        <button
                          onClick={() =>
                            handleRemoveVariant(
                              variant.size.size_id,
                              variant.color.color_id
                            )
                          }
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
