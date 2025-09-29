"use client";
import { useEffect, useRef, useState, type FC } from "react";
import dynamic from "next/dynamic";
import { api } from "@/lib/axios";
import { useStylist } from "@/store/stylist";
import {
  City,
  Area,
  BrandType,
  GenderType,
  Pincode,
  SelectOption,
  Category,
} from "@/types/StylistTypes";
import selectStyles from "@/utils/selectStyles";
import { toast } from "sonner";

const Select = dynamic(
  () => import("react-select").then((mod) => mod.default),
  {
    ssr: false,
  }
);

/**
 * BusinessDetailsComponent component
 * 
 * The primary form component for capturing a seller's core business and brand information.
 * This is the first and most detailed step in the seller onboarding and dashboard editing process.
 *
 * ## Features
 * - A comprehensive, multi-section form for collecting store owner and brand details.
 * - **Data Hydration**: On mount, it populates its fields with existing data from the global `useSellerStore`, ensuring a seamless editing experience.
 * - **Dynamic Options**: Fetches all necessary options for dropdowns and selection fields (e.g., cities, categories, brand types) from the API.
 * - **Dependent Dropdowns**: Implements chained select logic for location. Selecting a `City` filters the available `Area` and `Pincode` options.
 * - **Real-time Validation & State Sync**: A master `useEffect` hook continuously validates the form's completeness. When valid, it syncs the entire form's state back to the `useSellerStore`.
 * - **Modular UI**: Built using several smaller, reusable sub-components defined within the file (`Section`, `InputField`, `ToggleChips`, etc.) for a clean and organized structure.
 *
 * ## Logic Flow
 * 1.  On initial render, a `useEffect` hook triggers `fetchInitialData`, which makes parallel API calls using `Promise.all` to get all options for the form's various select fields (brand types, genders, locations, etc.).
 * 2.  Simultaneously, other `useEffect` hooks hydrate the component's local state with any pre-existing `businessDetailsData` from the `useSellerStore`. This pre-fills the form for returning users or for editing.
 * 3.  User interaction with the form updates the local `useState` variables.
 * 4.  The chained location dropdowns are managed by `useEffect` hooks that listen for changes in the selected city, filtering the area and pincode options accordingly.
 * 5.  A master `useEffect` hook watches all individual form input states. On any change, it performs a validation check.
 * 6.  If the form is valid, this master hook packages all the local states into a single data object and updates the `useSellerStore` by calling `setBusinessDetailsData`. It also updates a validity flag in the store.
 *
 * ## Imports
 * - **Core/Libraries**: `useEffect`, `useState`, `useRef`, `useLayoutEffect`, `FC` from `react`; `dynamic` for lazy-loading `react-select`; `toast` from `sonner`.
 * - **State (Zustand Stores)**:
 *    - `useSellerStore`: For both reading initial data and writing updated, validated data back to the global state.
 * - **Types**:
 *    - A comprehensive set of types from `@/types/SellerTypes` (e.g., `City`, `Area`, `BrandType`) to ensure type safety.
 * - **Utilities**:
 *    - `api` from `@/lib/axios`: The configured Axios instance for API calls.
 *    - `selectStyles` from `@/utils/selectStyles`: Custom styling for the `react-select` component.
 *
 * ## API Calls
 * - GET `/stores/store_types`: Fetches available store types.
 * - GET `/genders/`: Fetches available gender categories.
 * - GET `/location/cities/`: Fetches the list of all cities.
 * - GET `/location/areas/`: Fetches the list of all areas.
 * - GET `/location/pincodes/`: Fetches the list of all pincodes.
 * - GET `/categories/get_category_by_level/3`: Fetches level 3 product categories.
 *
 * ## Sub-components
 * This file defines several local, reusable UI components to structure the form:
 * - **Section**: A wrapper component that provides a consistent title, subtitle, and layout for a group of form fields.
 * - **InputField**: A standard text input field with a label and optional validation error message.
 * - **ToggleChips**: A component that renders a grid of checkbox-based "chips" for multi-select options.
 * - **SelectField**: A wrapper around `react-select` for a standard single-select dropdown.
 * - **MultiSelectField**: A wrapper around `react-select` configured for multi-selection with a limit of 3.
 * - **RadioGroup**: A component that renders a group of radio buttons for single-choice selections.
 *
 * ## Props
 * @param {object} props - The props for the component.
 * @param {(isValid: boolean) => void} [props.onValidationChange] - An optional callback to notify a parent component about the form's validity status.
 *
 * @returns {JSX.Element} The rendered business details form.
 */
export default function BusinessDetailsComponent({
  onValidationChange,
}: {
  onValidationChange?: (isValid: boolean) => void;
}) {
  const {
    setBusinessDetailsValid,
    setBusinessDetailsData,
    businessDetailsData,
    stylistNumber,
    stylistId,
    stylistName,
    stylistEmail,
    // setStoreNameString,
  } = useStylist();
  const [sameNumber, setSameNumber] = useState(true);

  const [brandTypes, setBrandTypes] = useState<BrandType[]>([]);
  const [selectedBrandTypes, setSelectedBrandTypes] = useState<BrandType[]>(
    businessDetailsData?.brandTypes || []
  );

  const [genders, setGenders] = useState<GenderType[]>([]);
  const [selectedGenderTypes, setSelectedGenderTypes] = useState<GenderType[]>(
    businessDetailsData?.genders || []
  );

  // const [rentOutfits, setRentOutfits] = useState<string | null>(
  //   businessDetailsData?.rentOutfits || null
  // );
  // const [retDays, setRetDays] = useState<number>(() => {
  //   return businessDetailsData?.returnDays ?? 0;
  // });
  // const [returnAvailable, setReturnAvailable] = useState<string | null>("");
  // const [excDays, setExcDays] = useState<number>(() => {
  //   return businessDetailsData?.exchangeDays ?? 0;
  // });
  // const [exchangeAvailable, setExchangeAvailable] = useState<string | null>("");

  const [cities, setCities] = useState<City[]>([]);
  const [cityOptions, setCityOptions] = useState<SelectOption[]>([]);
  const [selectedCity, setSelectedCity] = useState<City[]>([]);
  const [selectedCityOption, setSelectedCityOption] =
    useState<SelectOption | null>(null);

  const [areas, setAreas] = useState<Area[]>([]);
  const [areaOptions, setAreaOptions] = useState<SelectOption[]>([]);
  const [selectedArea, setSelectedArea] = useState<Area[]>([]);
  const [selectedAreaOption, setSelectedAreaOption] =
    useState<SelectOption | null>(null);

  const [pincodes, setPincodes] = useState<Pincode[]>([]);
  const [pincodeOptions, setPincodeOptions] = useState<SelectOption[]>([]);
  const [selectedPincode, setSelectedPincode] = useState<Pincode[]>([]);
  const [selectedPincodeOption, setSelectedPincodeOption] =
    useState<SelectOption | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(
    businessDetailsData?.categories || []
  );
  const [categoryOptions, setCategoryOptions] = useState<SelectOption[]>([]);
  const [selectedCategoryOptions, setSelectedCategoryOptions] = useState<
    SelectOption[]
  >(
    (businessDetailsData?.categories || []).map((cat) => ({
      value: cat.category_id,
      label: cat.name,
    }))
  );

  const [sName, setSName] = useState(
    businessDetailsData?.stylistName || ""
  );
  const [sEmail, setSEmail] = useState(
    businessDetailsData?.stylistEmail || ""
  );
  const [emailError, setEmailError] = useState("");
  // const [brandName, setBrandName] = useState(
  //   businessDetailsData?.brandName || ""
  // );
  const [businessWpNum, setBusinessWpNum] = useState(
    businessDetailsData?.stylistWpNum || ""
  );
  const [pinCode, setPinCode] = useState(businessDetailsData?.pinCode || "");
  const [sAddress, setSAddress] = useState(
    businessDetailsData?.StylistAddress || ""
  );
  const hasHydrated = useRef(false);

  /**
   * whenever seller number changes, check if same as owner is true
   * if yes, set Business Whatsapp number same as seller number
   */

  useEffect(() => {
    if (sameNumber) {
      setBusinessWpNum(stylistNumber || "");
    }
  }, [sameNumber, stylistNumber]);

  // set return and exchange days = 0 when their availablity is selected as 0
  // useEffect(() => {
  //   if (returnAvailable === "No") {
  //     setRetDays(0);
  //   }
  //   if (exchangeAvailable === "No") {
  //     setExcDays(0);
  //   }
  // }, [returnAvailable, exchangeAvailable]);

  /**
   * dynamically handling return and exchange available intially
   * on basis of data present in businessDetailsData
   */
  // useEffect(() => {
  //   if (!businessDetailsData) return;

  //   setReturnAvailable((prev) =>
  //     prev === ""
  //       ? businessDetailsData.returnDays === 0
  //         ? "No"
  //         : businessDetailsData.returnDays > 0
  //         ? "Yes"
  //         : ""
  //       : prev
  //   );

  //   setExchangeAvailable((prev) =>
  //     prev === ""
  //       ? businessDetailsData.exchangeDays === 0
  //         ? "No"
  //         : businessDetailsData.exchangeDays > 0
  //         ? "Yes"
  //         : ""
  //       : prev
  //   );
  // }, [businessDetailsData]);

  // hydrate local states if any data present in zustand store 
  useEffect(() => {
    if (businessDetailsData && !hasHydrated.current) {
      setSName(businessDetailsData.stylistName || "");
      setSEmail(businessDetailsData.stylistEmail || "");
      // setBrandName(businessDetailsData.brandName || "");
      setBusinessWpNum(businessDetailsData.stylistWpNum || "");
      setPinCode(businessDetailsData.pinCode || "");
      setSAddress(businessDetailsData.StylistAddress || "");

      setSelectedBrandTypes(businessDetailsData.brandTypes || []);
      setSelectedCategories(businessDetailsData.categories || []);

      setSelectedCategoryOptions(
        (businessDetailsData.categories || []).map((cat) => ({
          value: cat.category_id,
          label: cat.name,
        }))
      );
      setSelectedGenderTypes(businessDetailsData.genders || []);
      // setRentOutfits(businessDetailsData.rentOutfits || null);
      setSelectedCity(businessDetailsData.city || []);
      setSelectedArea(businessDetailsData.area || []);
      setSelectedPincode(businessDetailsData.pinCode || []);
      hasHydrated.current = true;
    }
  }, [businessDetailsData]);

  /**
   * Initial data is fetched:
   * - store types
   * - genders
   * - cities
   * - areas
   * - pincodes
   * - categories
   */
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [
          storeTypesRes,
          gendersRes,
          citiesRes,
          areasRes,
          pincodeRes,
          categoriesRes,
        ] = await Promise.all([
          api.get("/stores/store_types"),
          api.get("/genders/"),
          api.get("/location/cities/"),
          api.get("/location/areas/"),
          api.get("/location/pincodes/"),
          api.get("/categories/get_category_by_level/3"),
        ]);

        setBrandTypes(storeTypesRes.data);
        setGenders(gendersRes.data);
        setCities(citiesRes.data);
        setAreas(areasRes.data);
        setPincodes(pincodeRes.data);
        setCategories(categoriesRes.data);
        setCategoryOptions(
          categoriesRes.data.map((cat: Category) => ({
            value: cat.category_id,
            label: cat.name,
          }))
        );
        setCityOptions(
          citiesRes.data.map((c: City) => ({ value: c.id, label: c.name }))
        );

        const mapped = areasRes.data.map((a: Area) => ({
          value: a.id,
          label: a.name,
        }));
        setAreaOptions(mapped);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, []);

  // intialising ref variables to change area and pincode based on city
  const cityInitializedRef = useRef(false);
  const areaInitializedRef = useRef(false);
  const pincodeInitializedRef = useRef(false);

  // Initialize selected city from `businessDetailsData` only once when data and options are loaded
  useEffect(() => {
    if (
      cityInitializedRef.current ||
      !businessDetailsData ||
      businessDetailsData.city?.length === 0 ||
      cities.length === 0 ||
      cityOptions.length === 0
    )
      return;

    // Get the first city from stored business data
    const cityFromStore = businessDetailsData.city[0];

    // Find the full city object from the `cities` array using its id
    const fullCity = cities.find((city) => city.id === cityFromStore.id);

    // Find the corresponding city option from `cityOptions` for react-select
    const cityOption = cityOptions.find(
      (opt) => opt.value === cityFromStore.id
    );


    // If full city object found, set it in selectedCity state
  if (fullCity) setSelectedCity([fullCity]);

    // If option already exists in options list, use it
    if (cityOption) {
      setSelectedCityOption(cityOption);
    } else {
      // Otherwise create a new option object manually
      setSelectedCityOption({
        value: cityFromStore.id,
        label: cityFromStore.name,
      });
    }
    // Mark city as initialized so this effect doesn't run again unnecessarily
    cityInitializedRef.current = true;
  }, [businessDetailsData, cities, cityOptions]);

  // When selected city changes, filter and set area options based on that city
  useEffect(() => {
    if (selectedCityOption?.value) {
      const filteredAreas = areas
        .filter((area) => area.city_id === selectedCityOption.value)
        .map((area) => ({ value: area.id, label: area.name }));
      setAreaOptions(filteredAreas);
    } else {
      // If no city selected, reset areas
      setAreaOptions([]);
      setSelectedAreaOption(null);
      setSelectedArea([]);
    }
  }, [selectedCityOption, areas]);


  // similar to city
  useEffect(() => {
    if (
      areaInitializedRef.current ||
      !businessDetailsData ||
      businessDetailsData.area?.length === 0 ||
      areas.length === 0 ||
      areaOptions.length === 0
    )
      return;

    const areaFromStore = businessDetailsData.area[0];
    const fullArea = areas.find((area) => area.id === areaFromStore.id);
    const areaOption = areaOptions.find(
      (opt) => opt.value === areaFromStore.id
    );

    if (fullArea) setSelectedArea([fullArea]);
    if (areaOption) {
      setSelectedAreaOption(areaOption);
    } else {
      setSelectedAreaOption({
        value: areaFromStore.id,
        label: areaFromStore.name,
      });
    }
    areaInitializedRef.current = true;
  }, [businessDetailsData, areas, areaOptions]);

  // similar to city
  useEffect(() => {
    if (
      pincodeInitializedRef.current ||
      !businessDetailsData ||
      !businessDetailsData.pinCode ||
      pincodes.length === 0 ||
      pincodeOptions.length === 0
    )
      return;

    const pincodeFromStore = businessDetailsData.pinCode[0];
    const fullPincode = pincodes.find((p) => p.id === pincodeFromStore.id);
    const pincodeOption = pincodeOptions.find(
      (opt) => opt.value === pincodeFromStore.id
    );

    
    if (fullPincode) setSelectedPincode([fullPincode]);
    if (pincodeOption) {
      setSelectedPincodeOption(pincodeOption);
    } else if (fullPincode) {
      setSelectedPincodeOption({
        value: fullPincode.id,
        label: fullPincode.code,
      });
    }
    pincodeInitializedRef.current = true;
  }, [businessDetailsData, pincodes, pincodeOptions]);

  // When selected city changes, filter and set pincodes based on that city
  useEffect(() => {
    if (selectedCityOption?.value) {
      const filteredPincodes = pincodes
        .filter((p) => p.city_id === selectedCityOption.value)
        .map((p) => ({ value: p.id, label: p.code }));
      setPincodeOptions(filteredPincodes);
    } else {
      // If no city selected, reset pincode related states
      setPincodeOptions([]);
      setSelectedPincode([]);
      setSelectedPincodeOption(null);
    }
  }, [selectedCityOption, pincodes]);

  /**
   * wheneber dependent state changes, check if all required fields are entered
   * if yes, set valid = true else false
   * if valid = true, then set zustand state of business details data
   */
  useEffect(() => {
    const valid =
      sName.trim() &&
      sEmail.trim() &&
      // brandName.trim() &&
      selectedBrandTypes.length > 0 &&
      selectedGenderTypes.length > 0 &&
      selectedCity.length > 0 &&
      selectedPincode.length > 0 &&
      selectedCategoryOptions.length >= 1 &&
      selectedCategoryOptions.length <= 3 ;
      // exchangeAvailable !== "" &&
      // returnAvailable !== "";
    const categoriesForZustand = selectedCategoryOptions.map((opt) => ({
      category_id: opt.value,
      name: opt.label,
    }));

    setSelectedCategories(categoriesForZustand);
    setBusinessDetailsValid(Boolean(valid));
    onValidationChange?.(Boolean(valid));

    if (valid) {
      setBusinessDetailsData({
        stylistName,
        stylistEmail,
        // brandName,
        stylistWpNum,
        brandTypes: selectedBrandTypes,
        categories: categoriesForZustand,
        genders: selectedGenderTypes,
        // rentOutfits,
        city: selectedCity,
        area: selectedArea,
        pinCode: selectedPincode,
        stylistAddress,
        // returnDays: Number(retDays) || 0,
        // exchangeDays: Number(excDays) || 0,
      });
      // setStoreNameString(brandName);
    }
  }, [
    stylistName,
    stylistEmail,
    // brandName,
    selectedBrandTypes,
    selectedGenderTypes,
    selectedCity,
    selectedArea,
    selectedPincode,
    // rentOutfits,
    stylistAddress, 
    selectedCategoryOptions,
    // exchangeAvailable,
    // returnAvailable,
    // retDays,
    // excDays,
  ]);

  const toggleSelection = <T extends { id: string }>(
    item: T,
    current: T[],
    setCurrent: React.Dispatch<React.SetStateAction<T[]>>
  ) => {
    const exists = current.some((t) => t.id === item.id);
    setCurrent(
      exists ? current.filter((t) => t.id !== item.id) : [...current, item]
    );
  };

  const handleEmailChange = (value: string) => {
    setSEmail(value);
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    setEmailError(isValid ? "" : "Please enter a valid email address");
  };

  return (
    <div className="p-4 sm:p-6 rounded-2xl space-y-4 md:space-y-6 mx-auto  bg-white text-black">
      {/* Brand Owner Section */}
      <Section
        title="Stylist details"
        subtitle="This is for internal data, customers won't see this. You will sign in with this number."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium mb-1 text-black">
              Stylist Personal number
            </label>
            <input
              type="text"
              defaultValue={stylistNumber || ""}
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray bg-gray-100 text-black"
              disabled={!!stylistNumber}
            />
          </div>
          <InputField
            type="email"
            label="Email Address"
            value={sEmail} // -------
            onChange={handleEmailChange}
            required
            error={emailError}
          />
          <InputField
            label="Stylist name"
            value={sName}
            onChange={setSName}
            required
          />
        </div>
      </Section>

      {/* Brand Details Section */}
        
      <Section
        title="Store details"
        subtitle="Customers will see these details on Attirelly"
    
      >
      
        {/* <div className="space-y-4">
          <InputField
            label="Store name"
            value={brandName}
            onChange={setBrandName}
            required
          /> */}
          <div className="space-y-1">
            <label className="text-xs sm:text-sm text-black">
              Stylist whatsapp number
            </label>
            <input
              type="tel"
              disabled={sameNumber}
              value={businessWpNum}
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d{0,10}$/.test(val)) {
                  setBusinessWpNum(val);
                }
              }}
              maxLength={10}
              inputMode="numeric"
              pattern="\d{10}"
              className="w-full border rounded px-3 py-2 text-black placeholder-gray-400"
              placeholder="Enter 10-digit number"
            />
            <label className="text-sm flex items-center gap-2 text-black">
              <input
                type="checkbox"
                checked={sameNumber}
                onChange={(e) => setSameNumber(e.target.checked)}
              />
              Same as personal number
            </label>
          </div>

          {/* <ToggleChips
            label="Store Type"
            items={brandTypes}
            selected={selectedBrandTypes}
            toggle={(item) =>
              toggleSelection(item, selectedBrandTypes, setSelectedBrandTypes)
            }
          /> */}
          <MultiSelectField
            label="Expertise in"
            options={categoryOptions}
            value={selectedCategoryOptions}
            onChange={(selectedOptions) => {
              setSelectedCategoryOptions(selectedOptions);
              const selectedCats = selectedOptions.map((opt) => ({
                category_id: opt.value,
                name: opt.label,
              }));
              setSelectedCategories(selectedCats);
            }}
            isDisabled={false}
          />
          <ToggleChips
            label="Genders Catered"
            items={genders}
            selected={selectedGenderTypes}
            toggle={(item) =>
              toggleSelection(item, selectedGenderTypes, setSelectedGenderTypes)
            }
          />
        </div>
      </Section>

    //   {/* Return Exchange Section */}
    //   <Section
    //     title="Return & Exchange"
    //     subtitle="Customers will see these details on Attirelly"
    //   >
    //     <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
    //       <RadioGroup
    //         label="Return Available"
    //         options={["Yes", "No"]}
    //         selected={returnAvailable || ""}
    //         onChange={setReturnAvailable}
    //         required={true}
    //       />
    //       {returnAvailable === "Yes" && (
    //         <div className="mt-2 sm:mt-0 sm:ml-4">
    //           <label className="block text-xs sm:text-sm font-medium mb-2 text-black">
    //             Return Days
    //           </label>
    //           <input
    //             type="number"
    //             value={retDays || ""}
    //             onChange={(e) => {
    //               const val = Number(e.target.value);
    //               if (val < 1) setRetDays(1);
    //               else if (val > 45) setRetDays(45);
    //               else setRetDays(val);
    //             }}
    //             min={1}
    //             max={45}
    //             className="border px-2 py-1 rounded-md w-24 text-black placeholder-gray-400"
    //             placeholder="Days"
    //           />
    //         </div>
    //       )}
    //     </div>
    //     <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4">
    //       <RadioGroup
    //         label="Exchange Available"
    //         options={["Yes", "No"]}
    //         selected={exchangeAvailable || ""}
    //         onChange={setExchangeAvailable}
    //         required={true}
    //       />
    //       {exchangeAvailable === "Yes" && (
    //         <div className="mt-2 sm:mt-0 sm:ml-4">
    //           <label className="block text-xs sm:text-sm font-medium mb-2 text-black">
    //             Exchange Days
    //           </label>
    //           <input
    //             type="number"
    //             value={excDays || ""}
    //             onChange={(e) => {
    //               const val = Number(e.target.value);
    //               if (val < 1) setExcDays(1);
    //               else if (val > 45) setExcDays(45);
    //               else setExcDays(val);
    //             }}
    //             min={1}
    //             max={45}
    //             className="border px-2 py-1 rounded-md w-24 text-black placeholder-gray-400"
    //             placeholder="Days"
    //           />
    //         </div>
    //       )}
    //     </div>
    //   </Section>

      {/* Brand Location Section */}
      <Section
        title="Brand location"
        subtitle="Customers will see these details on Attirelly"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            label="City"
            options={cityOptions}
            value={selectedCityOption}
            onChange={(option) => {
              setSelectedCityOption(option);
              const found = cities.find((c) => c.id === option?.value);
              setSelectedCity(found ? [found] : []);
              setSelectedAreaOption(null);
              setSelectedArea([]);
              setSelectedPincodeOption(null);
              setSelectedPincode([]);
              setPinCode("");
            }}
          />
          <SelectField
            label="Area"
            options={[...areaOptions]}
            value={selectedAreaOption}
            onChange={(option) => {
              setSelectedAreaOption(option);
              if (option?.value === "option") {
                setSelectedArea([]);
              } else {
                const found = areas.find((a) => a.id === option?.value);
                setSelectedArea(found ? [found] : []);
              }
            }}
            isDisabled={!selectedCityOption}
          />
          <SelectField
            label="Pincode"
            options={pincodeOptions}
            value={selectedPincodeOption}
            onChange={(option) => {
              setSelectedPincodeOption(option);
              const found = pincodes.find((p) => p.id === option?.value);
              setSelectedPincode(found ? [found] : []);
              setPinCode(found?.id || "");
            }}
            isDisabled={!selectedCityOption}
          />
          <InputField
            label="Enter Google Map link of store"
            value={brandAddress}
            onChange={setBrandAddress}
            placeholder="Enter your Google map store link"
          />
        </div>
      </Section>
    </div>
  );
}

// Utility Components
const RequiredLabel: FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="block text-xs sm:text-sm font-medium mb-1 text-black">
    {children} <span className="text-red-500">*</span>
  </label>
);

const Section: FC<{
  title: string;
  subtitle: string;
  children: React.ReactNode;
}> = ({ title, subtitle, children }) => (
  <div className="p-4 sm:p-6 space-y-4 rounded-2xl shadow-sm bg-white">
    <h2 className="text-base sm:text-lg font-semibold mb-1 text-black">
      {title}
    </h2>
    <p className="text-xs sm:text-sm text-gray-500 mb-4">{subtitle}</p>
    <div className="-mx-4 sm:-mx-6 border-t border-gray-300"></div>
    <div className="pt-4">{children}</div>
  </div>
);

const InputField: FC<{
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  type?: string;
  error?: string;
}> = ({ label, value = "", onChange, required, placeholder, type, error }) => (
  <div>
    {required ? (
      <RequiredLabel>{label}</RequiredLabel>
    ) : (
      <label className="block text-xs sm:text-sm font-medium mb-1 text-black">
        {label}
      </label>
    )}
    <input
      type={type || "text"}
      className="w-full border border-gray-300 rounded px-3 py-2 text-black placeholder-gray-400"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const ToggleChips: FC<{
  label: string;
  items: { id: string; store_type?: string; gender_value?: string }[];
  selected: any[];
  toggle: (item: any) => void;
}> = ({ label, items, selected, toggle }) => (
  <div>
    <RequiredLabel>{label}</RequiredLabel>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {items.map((item) => {
        const text = item.store_type || item.gender_value;
        const isSelected = selected.some((s) => s.id === item.id);
        return (
          <label
            key={item.id}
            className={`flex items-center gap-2 px-3 py-2 border border-gray-500 rounded cursor-pointer ${
              isSelected ? "bg-gray-100" : "bg-white"
            }`}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => toggle(item)}
              className="accent-black"
            />
            <span
              className={`font-medium text-xs sm:text-sm ${
                isSelected ? "text-black" : "text-gray-500"
              }`}
            >
              {text}
            </span>
          </label>
        );
      })}
    </div>
  </div>
);

const SelectField: FC<{
  label: string;
  options: SelectOption[];
  value: SelectOption | null;
  onChange: (option: SelectOption | null) => void;
  isDisabled?: boolean;
}> = ({ label, options, value, onChange, isDisabled = false }) => (
  <div>
    <RequiredLabel>{label}</RequiredLabel>
    <Select
      options={options}
      value={value}
      onChange={(newValue) => {
        onChange(newValue as SelectOption);
      }}
      isClearable
      isDisabled={isDisabled}
      placeholder="Select or type"
      classNamePrefix="react-select"
      className="text-black text-sm"
      styles={selectStyles}
    />
  </div>
);

const MultiSelectField: FC<{
  label: string;
  options: SelectOption[];
  value: SelectOption[];
  onChange: (options: SelectOption[]) => void;
  isDisabled?: boolean;
}> = ({ label, options, value, onChange, isDisabled = false }) => (
  <div>
    <RequiredLabel>{label}</RequiredLabel>
    <Select
      isMulti
      options={options}
      value={value}
      onChange={(newValue) => {
        const selected = (newValue as SelectOption[]) || [];
        if (selected.length > 3) {
          toast.error("Maximum 3 Entries Allowed");
        }
        if (selected.length <= 3) {
          onChange(selected);
        }
      }}
      isDisabled={isDisabled}
      placeholder="Select up to 3"
      closeMenuOnSelect={false}
      classNamePrefix="react-select"
      className="text-black text-sm"
      styles={{
        ...selectStyles,
        valueContainer: (provided) => ({
          ...provided,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4px',
        }),
      }}
    />
  </div>
);

const RadioGroup: FC<{
  label: string;
  options: string[];
  selected: string | null;
  onChange: (value: string) => void;
  required?: boolean;
}> = ({ label, options, selected, onChange, required }) => (
  <div>
    {required ? (
      <RequiredLabel>{label}</RequiredLabel>
    ) : (
      <label className="block text-xs sm:text-sm font-medium mb-2">{label}</label>
    )}
    <div className="flex flex-wrap gap-4">
      {options.map((opt) => (
        <label
          key={opt}
          className={`flex items-center gap-2 px-4 py-2 border border-gray-500 rounded text-gray-500 cursor-pointer ${
            selected === opt ? "bg-gray-100" : "bg-white"
          }`}
        >
          <input
            type="radio"
            className="accent-black"
            name={label}
            value={opt}
            checked={selected === opt}
            onChange={() => onChange(opt)}
          />
          <span
            className={`font-medium text-xs sm:text-sm ${
              selected === opt ? "text-black" : "text-gray-500"
            }`}
          >
            {opt}
          </span>
        </label>
      ))}
    </div>
  </div>
);

