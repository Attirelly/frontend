"use client";
import { api } from "@/lib/axios";
import {
  useCurrentStep,
  useFormActions,
  useFormData,
  useIsLoading,
} from "@/store/product_upload_store";
import { useEffect, useState, useRef } from "react";
import LoadingSpinner from "../ui/LoadingSpinner";

/**
 * @interface Brand
 * @description Defines the structure for a single brand object.
 */
interface Brand {
  brand_id: string;
  name: string;
  logo_url?: string;
}

/**
 * A component for capturing the core details of a product, including its name, description, and brand.
 *
 * This component is a step in the product upload form. It provides input fields for the product's
 * name and description, and is intended to have a searchable dropdown for selecting the product's brand.
 * Currently, the brand selection is hardcoded for a specific use case.
 *
 * ### State Management
 * - **Local State (`useState`, `useRef`)**: Manages the local `formState` for the inputs, the list of `brands` fetched from the API, and an `initialLoad` ref to prevent race conditions.
 * - **Global State (`product_upload_store`)**: It initializes its state from `keyDetails` in the global store. It continuously syncs its local `formState` back to the store using `updateFormData` and updates the step's validation status with `setStepValidation`.
 *
 * ### API Endpoint
 * **`GET /brands/`**
 * This endpoint is called once on component mount to fetch the list of all available brands for the dropdown.
 * - **Returns**: `Brand[]` - An array of brand objects.
 *
 * ### Special Logic
 * - **Hardcoded Brand**: An effect currently overrides the brand selection and sets it to a default value ("Attirelly"). This should be noted if adapting the component for general use.
 *
 * @returns {JSX.Element} A form section for entering key product details.
 * @see {@link https://docs.pmnd.rs/zustand/getting-started/introduction | Zustand Documentation}
 * @see {@link https://axios-http.com/docs/intro | Axios Documentation}
 */

export default function BrandAndSeller() {
  // Get form data and actions from Zustand store
  const { keyDetails } = useFormData();
  const isLoading = useIsLoading();
  const { updateFormData, setStepValidation, setLoading } = useFormActions();
  const currentStep = useCurrentStep();

  // State for form and brands
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [brandSearch, setBrandSearch] = useState("");
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const initialLoad = useRef(true);

  // Initialize form state from keyDetails only once
  const [formState, setFormState] = useState(() => ({
    productName: keyDetails?.productName || "",
    productDescription: keyDetails?.productDescription || "",
    brand: keyDetails?.brand || { brand_id: "", name: "", logo_url: "" },
  }));

  // currently hardcoded brand
  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      brand: {
        brand_id: process.env.NEXT_PUBLIC_BRAND_ID || "",
        name: "Attirelly",
        logo_url: "",
      },
    }));
  }, []);

  // Initialize brand search from keyDetails
  useEffect(() => {
    setBrandSearch(keyDetails?.brand?.name || "");
  }, [keyDetails?.brand?.name]);

  // Fetch brands on mount
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await api.get("/brands/");
        const data = await response.data;
        setBrands(data);
        setFilteredBrands(data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };
    fetchBrands();
  }, []);

  // Update validation status
  useEffect(() => {
    const isValid =
      !!formState.productName &&
      !!formState.brand?.brand_id &&
      !!formState.productDescription;
    setStepValidation(currentStep, isValid);
  }, [formState, currentStep, setStepValidation]);

  // Filter brands based on search input
  useEffect(() => {
    if (brandSearch) {
      setFilteredBrands(
        brands.filter((brand) =>
          brand.name.toLowerCase().includes(brandSearch.toLowerCase())
        )
      );
    } else {
      setFilteredBrands(brands);
    }
  }, [brandSearch, brands]);

  // Update Zustand store only when formState changes due to user input
  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }
    updateFormData("keyDetails", formState);
  }, [formState, updateFormData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBrandSelect = (brand: Brand) => {
    setFormState((prev) => ({
      ...prev,
      brand: {
        brand_id: brand.brand_id,
        name: brand.name,
        logo_url: brand.logo_url ?? "",
      },
    }));
    setBrandSearch(brand.name);
    setShowBrandDropdown(false);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (!(e.target as HTMLElement).closest(".brand-dropdown-container")) {
      setShowBrandDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return isLoading ? (
    <LoadingSpinner />
  ) : (
    // Removed max-width and mx-auto to let parent control layout
    <div className="bg-white rounded-lg">
      <h1 className="text-base sm:text-lg font-bold mb-2">Product info</h1>
      <p className="text-xs sm:text-sm text-gray-600 mb-6 pb-4 border-b border-gray-200">
        {/* Provide who's selling and where it ships from */}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Column 1 */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium mb-1">
              Product name
            </label>
            <input
              type="text"
              name="productName"
              value={formState.productName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
              placeholder="Enter product name"
              required
            />
          </div>
        </div>

        {/* Column 2 (Brand selection logic is commented out as in original code) */}
        {/* <div className="flex flex-col gap-4"> ... </div> */}

        {/* Product Description */}
        <div className="md:col-span-2">
          <label className="block text-xs sm:text-sm font-medium mb-1">
            Product description
          </label>
          <textarea
            name="productDescription"
            value={formState.productDescription}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded-md p-2 text-sm"
            placeholder="Enter detailed product description"
          />
        </div>
      </div>
    </div>
  );
}
