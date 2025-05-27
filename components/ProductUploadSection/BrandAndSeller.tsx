"use client";
import { api } from "@/lib/axios";
import { useFormActions, useFormData } from "@/store/product_upload_store";
import { useEffect, useState } from "react";

interface Brand {
  brand_id: string;
  name: string;
  logo_url?: string;
}

export default function BrandAndSeller() {
  // Get form data and actions from Zustand store
  const { keyDetails } = useFormData();
  const { updateFormData } = useFormActions();

  // State for form and brands
  const [formState, setFormState] = useState({
    productName: keyDetails?.productName || "",
    productDescription: keyDetails?.productDescription || "",
    brand: keyDetails?.brand || { brand_id: "", name: "" ,logo_url:"" },
  });

  const [brands, setBrands] = useState<Brand[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [brandSearch, setBrandSearch] = useState(keyDetails?.brand?.name || "");
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [isLoadingBrands, setIsLoadingBrands] = useState(false);

  // Fetch brands from API
  useEffect(() => {
    const fetchBrands = async () => {
      setIsLoadingBrands(true);
      try {
        const response = await api.get("/brands/");
        const data = await response.data;
        setBrands(data);
        setFilteredBrands(data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      } finally {
        setIsLoadingBrands(false);
      }
    };
    fetchBrands();
  }, []);

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

  // Save to Zustand store when component unmounts
  useEffect(() => {
    return () => {
      updateFormData("keyDetails", formState);
    };
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
        logo_url:brand.logo_url ?? ""
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

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white  rounded-lg self-start ">
      <h1 className="text-2xl font-bold mb-2 ">Brand and seller info</h1>
      <p className="text-gray-600 mb-6 border-b border-gray-200">
        Provide who's selling and where it ships from
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Column 1 */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Product name
            </label>
            <input
              type="text"
              name="productName"
              value={formState.productName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter product name"
            />
          </div>
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-4">
          <div className="brand-dropdown-container relative">
            <label className="block text-sm font-medium mb-1">Brand</label>
            <input
              type="text"
              value={brandSearch}
              onChange={(e) => {
                setBrandSearch(e.target.value);
                setShowBrandDropdown(true);
              }}
              onFocus={() => setShowBrandDropdown(true)}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Search and select brand"
            />
            {isLoadingBrands && showBrandDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg p-2">
                <div className="text-center text-gray-500">
                  Loading brands...
                </div>
              </div>
            )}
            {showBrandDropdown && !isLoadingBrands && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredBrands.length > 0 ? (
                  filteredBrands.map((brand) => (
                    <div
                      key={brand.brand_id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                      onClick={() => handleBrandSelect(brand)}
                    >
                      {brand.logo_url && (
                        <img
                          src={brand.logo_url}
                          alt={brand.name}
                          className="w-6 h-6 object-contain"
                        />
                      )}
                      <div>
                        <div className="font-medium">{brand.name}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500">No brands found</div>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Product description
            </label>
            <textarea
              name="productDescription"
              value={formState.productDescription}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 min-h-[100px]"
              placeholder="Enter detailed product description"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
