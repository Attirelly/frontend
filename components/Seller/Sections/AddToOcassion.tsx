// src/components/OcassionPage.tsx

import React, { useState, useEffect, useMemo, FC } from "react";
import Select, { SingleValue } from "react-select";
import { useSellerStore } from "@/store/sellerStore";
import { api } from "@/lib/axios";
import ProductSearchPage from "@/app/admin/(protected)/productCRM/page";
import { toast } from "sonner";
import { AlgoliaHit } from "@/types/algolia";

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

// 1. Create the hardcoded list of occasions
// This data is static and defined outside the component.
const hardcodedOccasions: Occasion[] = [
  {
    occasion_id: "occ_wed_001",
    name: "Wedding Guest",
    description: "Elegant and formal attire for attending a wedding.",
  },
  {
    occasion_id: "occ_bday_002",
    name: "Birthday Party",
    description: "Fun, festive, and celebratory outfits.",
  },
  {
    occasion_id: "occ_biz_003",
    name: "Business Casual",
    description: "Smart and professional attire for the modern workplace.",
  },
  {
    occasion_id: "occ_vac_004",
    name: "Beach Vacation",
    // This item intentionally omits the optional 'description' field.
  },
];

const OcassionPage: FC = () => {
  // 3. Update the type for the selected occasion's ID to be string or null
  const { storeId } = useSellerStore();
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null); // Changed from 'number'
  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOccasions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get<Occasion[]>(
          "https://backend.prod.attirelly.com/occasions/"
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

  // 4. Update the mapping to use the new 'occasion_id' field
  const occasionOptions: SelectOption[] = useMemo(
    () =>
      hardcodedOccasions.map(
        (occasion): SelectOption => ({
          value: occasion.occasion_id, // Use 'occasion_id' for the value
          label: occasion.name,
        })
      ),
    [occasions]
  );

  const handleOccasionChange = (selectedOption: SingleValue<SelectOption>) => {
    if (selectedOption) {
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
    try {
      toast.info(`Update Products in ${selectedOption?.label}`);
      console.log(selectedProducts);
    } catch (error) {}
  };

  // if (error) {
  //     return <div style={{ color: 'red' }}>Error: {error}</div>;
  // }

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", width: "350px" }}>
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

      {/* <div style={{ marginTop: '20px' }}>
                {selectedOccasion !== null ?
                    <p><strong>Selected Occasion ID:</strong> {selectedOccasion}</p> :
                    <p>No occasion selected.</p>
                }
            </div> */}
      {selectedOccasion != null ? (
        <div>
          <ProductSearchPage
            onConfirmSelection={handleUpdateOcassionProduct}
            storeFilters={false}
            addToCuration={false}
            editCuration={false}
            storeId={storeId}
          />
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default OcassionPage;
