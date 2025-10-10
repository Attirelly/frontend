// src/components/OcassionPage.tsx

import React, { useState, useEffect, useMemo, FC } from "react";
import Select, { SingleValue } from "react-select";
import { useSellerStore } from "@/store/sellerStore";
import { api } from "@/lib/axios";
import ProductSearchPage from "@/app/admin/(protected)/productCRM/page";
import { toast } from "sonner";
import { AlgoliaHit } from "@/types/algolia";
import axios from "axios";

// 1. Updated interface to match the Pydantic 'OccasionResponse' schema
interface Occasion {
  occasion_id: string; // Changed from 'id: number' to 'occasion_id: string'
  name: string;
  description?: string; // Added optional 'description' field
}

// 2. Updated SelectOption to use a string for the value
type SelectOption = {
  value: string; // Value is now a string to match 'occasion_id'
  label: string;
};

const OcassionPage: FC = () => {
  // 3. Update the type for the selected occasion's ID to be string or null
  const { storeId } = useSellerStore();
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null); // Changed from 'number'
  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [occasionChecked, setOccasionChecked] = useState(false);
  const [defaultProducts, setDefaultProducts] = useState<string[]>([]); 

  useEffect(() => {
    const fetchOccasions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get<Occasion[]>(
          "/occasions/"
        );
        setOccasions(response.data);
      } catch (err) {
        console.error("Failed to fetch occasions:", err);
        setError("Could not load occasions. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOccasions();
  }, []);

  useEffect(() => {
    if(!selectedOccasion){
        setDefaultProducts([]);
        return;
    }
    const fetchOccasionProducts = async () => {
      try{
        const response = await api.get(`/occasions/${selectedOccasion}/products`)
        const productIds = response.data.map((item) => item.product_id);
        setDefaultProducts(productIds);
        setOccasionChecked(true);
      }catch(error){
         console.error("No products corresponding to selected occasion");
      }
    }
    fetchOccasionProducts();
  },[selectedOccasion])
  console.log(defaultProducts);

  // 4. Update the mapping to use the new 'occasion_id' field
  const occasionOptions: SelectOption[] = useMemo(
    () =>
      occasions.map(
        (occasion): SelectOption => ({
          value: occasion.occasion_id, // Use 'occasion_id' for the value
          label: occasion.name,
        })
      ),
    [occasions]
  );

  const handleOccasionChange = (selectedOption: SingleValue<SelectOption>) => {
    if (selectedOption) {
      setOccasionChecked(false);
      setSelectedOccasion(selectedOption.value);
      setSelectedOption(selectedOption);
    } else {
      setSelectedOccasion(null);
      setSelectedOption(null);
    }
  };

  const currentValue = occasionOptions.find(
    (option) => option.value === selectedOccasion
  );

  const handleUpdateOcassionProduct = async (
    selectedProducts: AlgoliaHit[]
  ) => {
    setIsUpdating(true);
    try {
      const productIds = selectedProducts.map((item) => item.id);
      const payload = {
        product_ids: productIds,
      };
      const url = `/occasions/${selectedOccasion}/products/bulk`;
      toast.info(`Adding ${productIds.length} products to ${selectedOption?.label}...`);
      const response = await api.post<{ status: string }>(url, payload);
      toast.success(response.data.status || "Products added successfully!");
    } catch (error) {
    // 5. Handle errors gracefully
    console.error("Failed to add products to occasion:", error);
    if (axios.isAxiosError(error) && error.response) {
      // Use the specific error message from the backend if available
      toast.error(`Error: ${error.response.data.detail || 'The server returned an error.'}`);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  } finally {
    // 6. Reset the updating state regardless of outcome
    setIsUpdating(false);
  }
  };

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="text-black" style={{ padding: "20px", fontFamily: "sans-serif", width: "350px" }}>
        <h2>Select an Occasion</h2>
        <Select<SelectOption>
          options={occasionOptions}
          value={currentValue}
          onChange={handleOccasionChange}
          isClearable
          isSearchable
          isLoading={isLoading}
          placeholder="Search or select an occasion..."
        />
      </div>
      {selectedOccasion != null && occasionChecked ? (
        <div>
          <ProductSearchPage
            onConfirmSelection={handleUpdateOcassionProduct}
            storeFilters={false}
            addToCuration={false}
            editCuration={false}
            storeId={storeId}
            defaultProducts={defaultProducts}
          />
        </div>
      ) : (
        <div></div>
      )}
    </div>

  );
};

export default OcassionPage;
