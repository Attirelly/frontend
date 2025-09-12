"use client";

import { useEffect, useState } from "react";
import {
  useCurrentStep,
  useFormActions,
  useFormData,
  useIsLoading,
} from "@/store/product_upload_store";
import { api } from "@/lib/axios";
import LoadingSpinner from "../ui/LoadingSpinner";

/**
 * @interface AttributeIDValue
 * @description Defines the structure for a single value within an attribute's dropdown list.
 */
interface AttributeIDValue {
  attribute_id: string;
  value: string;
}

/**
 * @interface AttributeResponse
 * @description Defines the structure for a single attribute as returned by the API, including its name and possible values.
 */
interface AttributeResponse {
  name: string;
  values: AttributeIDValue[];
}

/**
 * @interface AttributeValue
 * @description Defines the structure for a selected attribute value as stored in the form state.
 */
export interface AttributeValue {
  attribute_id?: string;
  name?: string;
  value?: string;
}

/**
 * @interface FormState
 * @description Defines the structure for this component's part of the global form data.
 */
export interface FormState {
  attributes?: AttributeValue[];
}

/**
 * A component for selecting product-specific attributes based on the chosen category.
 *
 * This component is a key step in the product upload process. After a user has selected a
 * four-level category, this component makes an API call to fetch the relevant attributes for that
 * specific category (e.g., "Color", "Material", "Sleeve Length" for a shirt). It then renders
 * a series of searchable dropdowns for the user to fill out.
 *
 * ### State Management
 * - **Local State (`useState`)**: Manages the list of `attributes` fetched from the API, the local `formState` holding the user's selections, `searchTerms` for each dropdown's input, and the `activeDropdown` to control which dropdown is currently open.
 * - **Global State (`product_upload_store`)**: It reads the previously selected `category` from the store to determine which attributes to fetch. It continuously syncs its local `formState` to the global store using `updateFormData` and updates the step's validation status with `setStepValidation`.
 *
 * ### API Endpoint
 * **`GET /attributes/attributes_category/:category_id`**
 * This endpoint is called when the component mounts to fetch attributes relevant to the selected category.
 * - **`:category_id`** (string): The ID of the Level 4 category selected in the previous step.
 * - **Returns**: `AttributeResponse[]` - An array of attribute objects, each with a name and a list of possible values.
 *
 * @returns {JSX.Element} A form section with a series of searchable dropdowns for product attributes.
 * @see {@link https://docs.pmnd.rs/zustand/getting-started/introduction | Zustand Documentation}
 * @see {@link https://axios-http.com/docs/intro | Axios Documentation}
 */
const ProductAttributes = () => {
  // --- Zustand Store Hooks ---
  const { attributes: globalAttributes, category } = useFormData();
  const { updateFormData, setStepValidation, setLoading } = useFormActions();
  const currentStep = useCurrentStep();
  const isLoading = useIsLoading();

  // --- Local State ---
  const [attributes, setAttributes] = useState<AttributeResponse[]>([]);
  const [filteredAttributes, setFilteredAttributes] = useState<
    AttributeResponse[]
  >([]);
  const [formState, setFormState] = useState<FormState>({
    attributes: globalAttributes?.attributes || [],
  });

  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  /**
   * This effect validates the current step.
   * The step is considered valid only if a value has been selected for every attribute.
   */
  useEffect(() => {
    // The step is valid if the number of selected attributes equals the number of available attributes
    // and every selected attribute has a non-empty value.
    const isValid = !!formState.attributes?.every((attr) => attr.value);
    setStepValidation(currentStep, isValid);
  }, [formState.attributes, currentStep, setStepValidation]);

  /**
   * This effect fetches the relevant attributes from the API based on the category
   * selected in the previous step. It runs when the category data changes.
   */
  useEffect(() => {
    const fetchAttributes = async () => {
      if (!category?.level4?.category_id) return;
      try {
        const response = await api.get(
          `attributes/attributes_category/${category?.level4?.category_id}`
        );
        setAttributes(response.data);
        setFilteredAttributes(response.data);

        const initialTerms: Record<string, string> = {};
        response.data.forEach((attr: AttributeResponse) => {
          const selected = globalAttributes?.attributes?.find(
            (a) => a.name === attr.name
          );
          initialTerms[attr.name] = selected?.value || "";
        });
        setSearchTerms(initialTerms);
      } catch (error) {
        console.error("Error fetching attributes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttributes();
  }, [category]);
  /**
   * This effect filters the values within an active dropdown based on the user's search input.
   */
  useEffect(() => {
    if (activeDropdown) {
      const filtered = attributes.map((attr) => {
        if (attr.name === activeDropdown) {
          return {
            ...attr,
            values: attr.values.filter((val) =>
              val.value
                .toLowerCase()
                .includes((searchTerms[activeDropdown] || "").toLowerCase())
            ),
          };
        }
        return attr;
      });
      setFilteredAttributes(filtered);
    } else {
      setFilteredAttributes(attributes);
    }
  }, [searchTerms, activeDropdown, attributes]);

  /**
   * This effect continuously syncs the local form state with the global Zustand store.
   */
  useEffect(() => {
    updateFormData("attributes", formState);
  }, [formState, updateFormData]);

    /**
   * Handles the selection of an attribute value from a dropdown.
   * @param {string} attributeName - The name of the attribute being updated (e.g., "Color").
   * @param {string} value - The selected value (e.g., "Red").
   * @param {string} attribute_id - The ID of the selected value.
   */
  const handleAttributeSelect = (
    attributeName: string,
    value: string,
    attribute_id: string
  ) => {
    setFormState((prev) => {
      const existingIndex =
        prev.attributes?.findIndex((attr) => attr.name === attributeName) ?? -1;
      const newAttributes = [...(prev.attributes || [])];
      if (existingIndex >= 0) {
        newAttributes[existingIndex] = {
          ...newAttributes[existingIndex],
          attribute_id,
          value,
          name: attributeName,
        };
      } else {
        newAttributes.push({ attribute_id, value, name: attributeName });
      }
      return { ...prev, attributes: newAttributes };
    });
    setSearchTerms((prev) => ({ ...prev, [attributeName]: value }));
    setActiveDropdown(null);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (!(e.target as HTMLElement).closest(".attribute-dropdown-container")) {
      setActiveDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white rounded-lg self-start">
      <h1 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
        Attributes
      </h1>
      <p className="text-xs sm:text-sm text-gray-500 mb-4 pb-4 border-b border-gray-200">
        Add attributes, so your products are easily discoverable by customers
      </p>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {filteredAttributes.map((attribute) => (
            <div key={attribute.name} className="attribute-dropdown-container">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 capitalize">
                {attribute.name}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerms[attribute.name] || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSearchTerms((prev) => ({
                      ...prev,
                      [attribute.name]: val,
                    }));
                    if (val.trim() === "") {
                      setFormState((prev) => ({
                        ...prev,
                        attributes: prev.attributes?.filter(
                          (attr) => attr.name !== attribute.name
                        ),
                      }));
                    }
                    if (activeDropdown !== attribute.name) {
                      setActiveDropdown(attribute.name);
                    }
                  }}
                  onFocus={() => setActiveDropdown(attribute.name)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  placeholder={`Search ${attribute.name}`}
                />
                {activeDropdown === attribute.name && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto scrollbar-thin">
                    {attribute.values.length > 0 ? (
                      attribute.values.map((val) => (
                        <div
                          key={val.attribute_id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() =>
                            handleAttributeSelect(
                              attribute.name,
                              val.value,
                              val.attribute_id
                            )
                          }
                        >
                          <div className="font-medium text-sm">{val.value}</div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500 text-sm">
                        No options found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductAttributes;
