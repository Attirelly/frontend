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

/**
 * @interface SizeOption
 * @description Defines the structure for a single size option.
 */
interface SizeOption {
  size_id: string;
  size_name: string;
}

/**
 * @interface ColorOption
 * @description Defines the structure for a single color option.
 */
interface ColorOption {
  color_id: string;
  color_name: string;
  hex_code: string;
}

/**
 * @interface Variant
 * @description Defines the structure for a single product variant, which is a combination of size and/or color.
 */
interface Variant {
  sku: string;
  size?: SizeOption;
  color?: ColorOption;
}

/**
 * A component for defining product variants based on selected sizes and colors and assigning SKUs.
 *
 * This component is a step in the product upload form. It fetches available sizes and colors
 * based on the previously selected product category. The user can select multiple sizes and colors,
 * and the component will automatically generate a matrix of all possible variant combinations.
 * The user must then provide a unique SKU for each generated variant.
 *
 * ### State Management
 * - **Local State (`useState`)**: Manages the lists of available and selected sizes/colors, and most importantly, the `variantsList` which holds the generated combinations and their SKUs.
 * - **Global State (`product_upload_store`)**: It reads the selected `category` to fetch relevant size options. It initializes its state from the `variants` object in the global store and continuously syncs the generated `variantsList` back to the store.
 *
 * ### Key Logic
 * The core of this component is a `useEffect` hook that watches for changes in the `selectedSizes` and `selectedColors` arrays. When a change occurs, it calculates the Cartesian product of the selections to generate all possible variant combinations. This process is intelligent, as it preserves any existing SKU information for variants that remain after the change, ensuring user data is not lost when a size or color is added or removed.
 *
 * ### API Endpoints
 * **`GET /sizes/category/:category_id`**: Fetches size options that are relevant to the selected product category.
 * **`GET /colors`**: Fetches a global list of all available color options.
 *
 * @returns {JSX.Element} A form section for creating and managing product variants.
 * @see {@link https://docs.pmnd.rs/zustand/getting-started/introduction | Zustand Documentation}
 */

export interface VaraintFormState {
  variants?: Variant[];
}

export default function VariantAndInventory() {
  const { variants: globalVariants, category } = useFormData();
  const { updateFormData, setStepValidation, setLoading } = useFormActions();
  const currentStep = useCurrentStep();
  const isLoading = useIsLoading();

  const initialColors: ColorOption[] = Array.from(
    new Map(
      globalVariants?.variants
        .map((v) => v.color)
        .filter((c): c is ColorOption => !!c)
        .map((c) => [c.color_id, c])
    ).values()
  );

  const initialSizes: SizeOption[] = Array.from(
    new Map(
      globalVariants?.variants
        .map((v) => v.size)
        .filter((s): s is SizeOption => !!s)
        .map((s) => [s.size_id, s])
    ).values()
  );

  const [selectedSizes, setSelectedSizes] = useState<SizeOption[]>(
    initialSizes || []
  );
  const [selectedColors, setSelectedColors] = useState<ColorOption[]>(
    initialColors || []
  );
  const [variantsList, setVariantsList] = useState<Variant[]>(
    globalVariants?.variants || []
  );

  const [availableSizes, setAvailableSizes] = useState<SizeOption[]>([]);
  const [availableColors, setAvailableColors] = useState<ColorOption[]>([]);
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const [showColorDropdown, setShowColorDropdown] = useState(false);
  const [sizeSearch, setSizeSearch] = useState("");
  const [colorSearch, setColorSearch] = useState("");

  /**
   * This effect validates the current step.
   * The step is considered valid if at least one variant has been created and all
   * created variants have a non-empty SKU.
   */
  useEffect(() => {
    const isValid = variantsList.length > 0 && variantsList.every((v) => v.sku);
    setStepValidation(currentStep, isValid);
  }, [variantsList]);

  /**
   * This effect fetches the available size and color options from the API on component mount.
   */
  useEffect(() => {
    const fetchData = async () => {
      if (!category?.level4?.category_id) {
        setLoading(false);
        return;
      }
      try {
        const sizesResponse = await api.get(
          `/sizes/category/${category.level4.category_id}`
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
  }, [category]);

  const filteredSizes = availableSizes
    .filter((s) => s.size_name.toLowerCase().includes(sizeSearch.toLowerCase()))
    .filter((s) => !selectedSizes.find((ss) => ss.size_id === s.size_id));

  const filteredColors = availableColors
    .filter((c) =>
      c.color_name.toLowerCase().includes(colorSearch.toLowerCase())
    )
    .filter((c) => !selectedColors.find((sc) => sc.color_id === c.color_id));

  /**
   * This is the core logic of the component. This effect runs whenever the user
   * adds or removes a size or color. It regenerates the list of variants by creating
   * a Cartesian product of the selected sizes and colors.
   */
  useEffect(() => {
    const newVariants: Variant[] = [];
    if (selectedSizes.length > 0 && selectedColors.length > 0) {
      selectedSizes.forEach((size) => {
        selectedColors.forEach((color) => {
          const existing = variantsList.find(
            (v) =>
              v.size?.size_id === size.size_id &&
              v.color?.color_id === color.color_id
          );
          newVariants.push(existing || { sku: "", size, color });
        });
      });
    } else if (selectedSizes.length > 0) {
      selectedSizes.forEach((size) => {
        const existing = variantsList.find(
          (v) => v.size?.size_id === size.size_id && !v.color
        );
        newVariants.push(existing || { sku: "", size });
      });
    } else if (selectedColors.length > 0) {
      selectedColors.forEach((color) => {
        const existing = variantsList.find(
          (v) => v.color?.color_id === color.color_id && !v.size
        );
        newVariants.push(existing || { sku: "", color });
      });
    }
    setVariantsList(newVariants);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSizes, selectedColors]);

  const closeAllDropdowns = () => {
    setShowColorDropdown(false);
    setShowSizeDropdown(false);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      !(e.target as HTMLElement).closest(".size-dropdown-container") &&
      !(e.target as HTMLElement).closest(".color-dropdown-container")
    ) {
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

  const handleRemoveVariant = (variantToRemove: Variant) => {
    setVariantsList((prev) =>
      prev.filter((v) => {
        const isSameSize = v.size?.size_id === variantToRemove.size?.size_id;
        const isSameColor =
          v.color?.color_id === variantToRemove.color?.color_id;
        return !(isSameSize && isSameColor);
      })
    );
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
    updateFormData("variants", { variants: variantsList });
  }, [variantsList]);

  return (
    <div className="bg-white rounded-lg">
      <h1 className="text-base sm:text-lg font-bold mb-2">
        Variants and Inventory
      </h1>
      <p className="text-xs sm:text-sm text-gray-600 mb-6 pb-4 border-b border-gray-200">
        Define every version of your product and its stock level.
      </p>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Column 1 - Size Selection */}
            <div className="flex flex-col gap-4">
              <div className="relative size-dropdown-container">
                <label className="block text-xs sm:text-sm font-medium mb-1">
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
                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                    placeholder="Search and select sizes"
                  />
                  {showSizeDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto scrollbar-thin">
                      {filteredSizes.length > 0 ? (
                        filteredSizes.map((size) => (
                          <div
                            key={size.size_id}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                            onClick={() => handleSizeSelect(size)}
                          >
                            {size.size_name}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-500 text-sm">
                          No matching sizes found
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedSizes.map((size) => (
                    <div
                      key={size.size_id}
                      className="bg-gray-100 px-2 py-1 rounded-full flex items-center gap-1 text-xs sm:text-sm"
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
                <label className="block text-xs sm:text-sm font-medium mb-1">
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
                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                    placeholder="Search and select colors"
                  />
                  {showColorDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto scrollbar-thin">
                      {filteredColors.length > 0 ? (
                        filteredColors.map((color) => (
                          <div
                            key={color.color_id}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 text-sm"
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
                        <div className="px-4 py-2 text-gray-500 text-sm">
                          No matching colors found
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedColors.map((color) => (
                    <div
                      key={color.color_id}
                      className="bg-gray-100 px-2 py-1 rounded-full flex items-center gap-2 text-xs sm:text-sm"
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
              <table className="min-w-full border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Color
                    </th>
                    <th className="px-2 sm:px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {variantsList.map((variant, index) => (
                    <tr
                      key={`${variant.size?.size_id || "s"}-${
                        variant.color?.color_id || "c"
                      }-${index}`}
                    >
                      <td className="px-2 sm:px-4 py-2">
                        <input
                          type="text"
                          value={variant.sku}
                          onChange={(e) =>
                            handleSkuChange(index, e.target.value)
                          }
                          className="w-full border border-gray-300 rounded-md p-1 text-xs sm:text-sm"
                          placeholder="Enter SKU"
                        />
                      </td>
                      <td className="px-2 sm:px-4 py-2 whitespace-nowrap text-xs sm:text-sm">
                        {variant.size?.size_name || "—"}
                      </td>
                      <td className="px-2 sm:px-4 py-2 whitespace-nowrap flex items-center gap-2 text-xs sm:text-sm">
                        {variant.color ? (
                          <>
                            <div
                              className="w-3 h-3 rounded-full border border-gray-300"
                              style={{
                                backgroundColor: variant.color.hex_code,
                              }}
                            />
                            {variant.color.color_name}
                          </>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-2 sm:px-4 py-2 text-right">
                        <button
                          onClick={() => handleRemoveVariant(variant)}
                          className="text-red-500 hover:text-red-700 text-lg"
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
