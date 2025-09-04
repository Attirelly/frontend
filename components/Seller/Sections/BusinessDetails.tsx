// // "use client";
// // import { useEffect, useRef, useState, type FC } from "react";
// // import dynamic from "next/dynamic";
// // import { api } from "@/lib/axios";
// // import { useSellerStore } from "@/store/sellerStore";
// // import {
// //   City,
// //   Area,
// //   BrandType,
// //   GenderType,
// //   Pincode,
// //   SelectOption,
// //   Category,
// // } from "@/types/SellerTypes";
// // import selectStyles from "@/utils/selectStyles";
// // import { toast } from "sonner";

// // const Select = dynamic(
// //   () => import("react-select").then((mod) => mod.default),
// //   {
// //     ssr: false,
// //   }
// // );

// // export default function BusinessDetailsComponent({
// //   onValidationChange,
// // }: {
// //   onValidationChange?: (isValid: boolean) => void;
// // }) {
// //   const {
// //     setBusinessDetailsValid,
// //     setBusinessDetailsData,
// //     businessDetailsData,
// //     sellerNumber,
// //     sellerId,
// //     sellerName,
// //     sellerEmail,
// //     setStoreNameString,
// //   } = useSellerStore();
// //   const [sameAsOwner, setSameAsOwner] = useState(true);

// //   const [brandTypes, setBrandTypes] = useState<BrandType[]>([]);
// //   const [selectedBrandTypes, setSelectedBrandTypes] = useState<BrandType[]>(
// //     businessDetailsData?.brandTypes || []
// //   );

// //   const [genders, setGenders] = useState<GenderType[]>([]);
// //   const [selectedGenderTypes, setSelectedGenderTypes] = useState<GenderType[]>(
// //     businessDetailsData?.genders || []
// //   );

// //   const [rentOutfits, setRentOutfits] = useState<string | null>(
// //     businessDetailsData?.rentOutfits || null
// //   );
// //   const [retDays, setRetDays] = useState<number>(() => {
// //     return businessDetailsData?.returnDays ?? 0;
// //   });
// //   const [returnAvailable, setReturnAvailable] = useState<string | null>("");
// //   const [excDays, setExcDays] = useState<number>(() => {
// //     return businessDetailsData?.exchangeDays ?? 0;
// //   });
// //   const [exchangeAvailable, setExchangeAvailable] = useState<string | null>("");

// //   const [cities, setCities] = useState<City[]>([]);
// //   const [cityOptions, setCityOptions] = useState<SelectOption[]>([]);
// //   const [selectedCity, setSelectedCity] = useState<City[]>([]);
// //   const [selectedCityOption, setSelectedCityOption] =
// //     useState<SelectOption | null>(null);

// //   const [areas, setAreas] = useState<Area[]>([]);
// //   const [areaOptions, setAreaOptions] = useState<SelectOption[]>([]);
// //   const [selectedArea, setSelectedArea] = useState<Area[]>([]);
// //   const [selectedAreaOption, setSelectedAreaOption] =
// //     useState<SelectOption | null>(null);

// //   const [pincodes, setPincodes] = useState<Pincode[]>([]);
// //   const [pincodeOptions, setPincodeOptions] = useState<SelectOption[]>([]);
// //   const [selectedPincode, setSelectedPincode] = useState<Pincode[]>([]);
// //   const [selectedPincodeOption, setSelectedPincodeOption] =
// //     useState<SelectOption | null>(null);

// //   const [categories, setCategories] = useState<Category[]>([]);
// //   const [selectedCategories, setSelectedCategories] = useState<Category[]>(
// //     businessDetailsData?.categories || []
// //   );
// //   const [categoryOptions, setCategoryOptions] = useState<SelectOption[]>([]);
// //   const [selectedCategoryOptions, setSelectedCategoryOptions] = useState<
// //     SelectOption[]
// //   >(
// //     (businessDetailsData?.categories || []).map((cat) => ({
// //       value: cat.category_id,
// //       label: cat.name,
// //     }))
// //   );

// //   const [ownerName, setOwnerName] = useState(
// //     businessDetailsData?.ownerName || ""
// //   );
// //   const [ownerEmail, setOwnerEmail] = useState(
// //     businessDetailsData?.ownerEmail || ""
// //   );
// //   const [emailError, setEmailError] = useState("");
// //   const [brandName, setBrandName] = useState(
// //     businessDetailsData?.brandName || ""
// //   );
// //   const [businessWpNum, setBusinessWpNum] = useState(
// //     businessDetailsData?.businessWpNum || ""
// //   );
// //   const [pinCode, setPinCode] = useState(businessDetailsData?.pinCode || "");
// //   const [brandAddress, setBrandAddress] = useState(
// //     businessDetailsData?.brandAddress || ""
// //   );
// //   // const [storeLocation, setStoreLocation] = useState(businessDetailsData?.storeLocation || '');
// //   const hasHydrated = useRef(false);

// //   useEffect(() => {
// //     if (sameAsOwner) {
// //       setBusinessWpNum(sellerNumber || "");
// //     }
// //   }, [sameAsOwner, sellerNumber]);
// //   useEffect(() => {
// //     if (returnAvailable === "No") {
// //       setRetDays(0);
// //     }
// //     if (exchangeAvailable === "No") {
// //       setExcDays(0);
// //     }
// //   }, [returnAvailable, exchangeAvailable]);

// //   useEffect(() => {
// //     if (!businessDetailsData) return;

// //     // Only set if it's still at initial empty state
// //     setReturnAvailable((prev) =>
// //       prev === ""
// //         ? businessDetailsData.returnDays === 0
// //           ? "No"
// //           : businessDetailsData.returnDays > 0
// //           ? "Yes"
// //           : ""
// //         : prev
// //     );

// //     setExchangeAvailable((prev) =>
// //       prev === ""
// //         ? businessDetailsData.exchangeDays === 0
// //           ? "No"
// //           : businessDetailsData.exchangeDays > 0
// //           ? "Yes"
// //           : ""
// //         : prev
// //     );
// //   }, [businessDetailsData]);

// //   useEffect(() => {
// //     if (businessDetailsData && !hasHydrated.current) {
// //       setOwnerName(businessDetailsData.ownerName || "");
// //       setOwnerEmail(businessDetailsData.ownerEmail || "");
// //       setBrandName(businessDetailsData.brandName || "");
// //       setBusinessWpNum(businessDetailsData.businessWpNum || "");
// //       setPinCode(businessDetailsData.pinCode || "");
// //       setBrandAddress(businessDetailsData.brandAddress || "");

// //       setSelectedBrandTypes(businessDetailsData.brandTypes || []);
// //       setSelectedCategories(businessDetailsData.categories || []);

// //       setSelectedCategoryOptions(
// //         (businessDetailsData.categories || []).map((cat) => ({
// //           value: cat.category_id,
// //           label: cat.name,
// //         }))
// //       );
// //       setSelectedGenderTypes(businessDetailsData.genders || []);
// //       setRentOutfits(businessDetailsData.rentOutfits || null);
// //       setSelectedCity(businessDetailsData.city || []);
// //       setSelectedArea(businessDetailsData.area || []);
// //       setSelectedPincode(businessDetailsData.pinCode || []);
// //       // setStoreLocation(businessDetailsData.storeLocation || '');
// //       hasHydrated.current = true;
// //     }
// //   }, [businessDetailsData]);

// //   useEffect(() => {
// //     const fetchInitialData = async () => {
// //       try {
// //         const [
// //           storeTypesRes,
// //           gendersRes,
// //           citiesRes,
// //           areasRes,
// //           pincodeRes,
// //           categoriesRes,
// //         ] = await Promise.all([
// //           api.get("/stores/store_types"),
// //           api.get("/genders/"),
// //           api.get("/location/cities/"),
// //           api.get("/location/areas/"),
// //           api.get("/location/pincodes/"),
// //           api.get("/categories/get_category_by_level/3"),
// //         ]);

// //         setBrandTypes(storeTypesRes.data);
// //         setGenders(gendersRes.data);
// //         setCities(citiesRes.data);
// //         setAreas(areasRes.data);
// //         setPincodes(pincodeRes.data);
// //         setCategories(categoriesRes.data);
// //         setCategoryOptions(
// //           categoriesRes.data.map((cat: Category) => ({
// //             value: cat.category_id,
// //             label: cat.name,
// //           }))
// //         );
// //         setCityOptions(
// //           citiesRes.data.map((c: City) => ({ value: c.id, label: c.name }))
// //         );

// //         const mapped = areasRes.data.map((a: Area) => ({
// //           value: a.id,
// //           label: a.name,
// //         }));
// //         setAreaOptions(mapped);

// //       } catch (error) {
// //         console.error("Error fetching initial data:", error);
// //       }
// //     };

// //     fetchInitialData();
// //   }, []);

// //   const cityInitializedRef = useRef(false);
// //   const areaInitializedRef = useRef(false);
// //   const pincodeInitializedRef = useRef(false);

// //   useEffect(() => {
// //     if (
// //       cityInitializedRef.current ||
// //       !businessDetailsData ||
// //       businessDetailsData.city?.length === 0 ||
// //       cities.length === 0 ||
// //       cityOptions.length === 0
// //     )
// //       return;

// //     const cityFromStore = businessDetailsData.city[0];

// //     const fullCity = cities.find((city) => city.id === cityFromStore.id);
// //     const cityOption = cityOptions.find(
// //       (opt) => opt.value === cityFromStore.id
// //     );

// //     if (fullCity) setSelectedCity([fullCity]);

// //     if (cityOption) {
// //       setSelectedCityOption(cityOption);
// //     } else {
// //       setSelectedCityOption({
// //         value: cityFromStore.id,
// //         label: cityFromStore.name,
// //       });
// //     }

// //     cityInitializedRef.current = true;
// //   }, [businessDetailsData, cities, cityOptions]);

// //   useEffect(() => {

// //     if (selectedCityOption?.value) {

// //       const filteredAreas = areas
// //         .filter((area) => area.city_id === selectedCityOption.value)
// //         .map((area) => ({ value: area.id, label: area.name }));

// //       setAreaOptions(filteredAreas);
// //     } else {
// //       setAreaOptions([]); // Reset if no city selected
// //       setSelectedAreaOption(null); // Also clear selected area
// //       setSelectedArea([]);
// //     }
// //   }, [selectedCityOption, areas]);

// //   useEffect(() => {
// //     if (
// //       areaInitializedRef.current ||
// //       !businessDetailsData ||
// //       businessDetailsData.area?.length === 0 ||
// //       areas.length === 0 ||
// //       areaOptions.length === 0
// //     )
// //       return;

// //     const areaFromStore = businessDetailsData.area[0];
// //     const fullArea = areas.find((area) => area.id === areaFromStore.id);
// //     const areaOption = areaOptions.find(
// //       (opt) => opt.value === areaFromStore.id
// //     );

// //     if (fullArea) setSelectedArea([fullArea]);

// //     if (areaOption) {
// //       setSelectedAreaOption(areaOption);
// //     } else {
// //       setSelectedAreaOption({
// //         value: areaFromStore.id,
// //         label: areaFromStore.name,
// //       });
// //     }

// //     areaInitializedRef.current = true;
// //   }, [businessDetailsData, areas, areaOptions]);

// //   useEffect(() => {
// //     if (
// //       pincodeInitializedRef.current ||
// //       !businessDetailsData ||
// //       !businessDetailsData.pinCode ||
// //       pincodes.length === 0 ||
// //       pincodeOptions.length === 0
// //     )
// //       return;

// //     const pincodeFromStore = businessDetailsData.pinCode[0];
// //     const fullPincode = pincodes.find((p) => p.id === pincodeFromStore.id);
// //     const pincodeOption = pincodeOptions.find(
// //       (opt) => opt.value === pincodeFromStore.id
// //     );

// //     if (fullPincode) setSelectedPincode([fullPincode]);

// //     if (pincodeOption) {
// //       setSelectedPincodeOption(pincodeOption);
// //     } else if (fullPincode) {
// //       setSelectedPincodeOption({
// //         value: fullPincode.id,
// //         label: fullPincode.code,
// //       });
// //     }

// //     pincodeInitializedRef.current = true;
// //   }, [businessDetailsData, pincodes, pincodeOptions]);

// //   useEffect(() => {
// //     if (selectedCityOption?.value) {
// //       const filteredPincodes = pincodes
// //         .filter((p) => p.city_id === selectedCityOption.value)
// //         .map((p) => ({ value: p.id, label: p.code }));
// //       setPincodeOptions(filteredPincodes);
// //     } else {
// //       setPincodeOptions([]);
// //       setSelectedPincode([]);
// //       setSelectedPincodeOption(null);
// //     }
// //   }, [selectedCityOption, pincodes]);

// //   useEffect(() => {
// //     const valid =
// //       ownerName.trim() &&
// //       ownerEmail.trim() &&
// //       brandName.trim() &&
// //       selectedBrandTypes.length > 0 &&
// //       selectedGenderTypes.length > 0 &&
// //       selectedCity.length > 0 &&
// //       selectedPincode.length > 0 &&
// //       selectedCategoryOptions.length >= 1 &&
// //       selectedCategoryOptions.length <= 3 &&
// //       exchangeAvailable !== "" &&
// //       returnAvailable !== "";
// //     const categoriesForZustand = selectedCategoryOptions.map((opt) => ({
// //       category_id: opt.value,
// //       name: opt.label,
// //     }));

// //     setSelectedCategories(categoriesForZustand);

// //     setBusinessDetailsValid(Boolean(valid));
// //     onValidationChange?.(Boolean(valid));

// //     if (valid) {
// //       setBusinessDetailsData({
// //         ownerName,
// //         ownerEmail,
// //         brandName,
// //         businessWpNum,
// //         brandTypes: selectedBrandTypes,
// //         categories: categoriesForZustand,
// //         genders: selectedGenderTypes,
// //         rentOutfits,
// //         city: selectedCity,
// //         area: selectedArea,
// //         pinCode: selectedPincode,
// //         brandAddress,
// //         returnDays: Number(retDays) || 0,
// //         exchangeDays: Number(excDays) || 0,
// //         // storeLocation
// //       });
// //       setStoreNameString(brandName);
// //     }
// //   }, [
// //     ownerName,
// //     ownerEmail,
// //     brandName,
// //     selectedBrandTypes,
// //     selectedGenderTypes,
// //     selectedCity,
// //     selectedArea,
// //     selectedPincode,
// //     rentOutfits,
// //     brandAddress,
// //     selectedCategoryOptions,
// //     exchangeAvailable,
// //     returnAvailable,
// //     retDays,
// //     excDays,
// //   ]);

// //   const toggleSelection = <T extends { id: string }>(
// //     item: T,
// //     current: T[],
// //     setCurrent: React.Dispatch<React.SetStateAction<T[]>>
// //   ) => {
// //     const exists = current.some((t) => t.id === item.id);
// //     setCurrent(
// //       exists ? current.filter((t) => t.id !== item.id) : [...current, item]
// //     );
// //   };

// //   const handleEmailChange = (value: string) => {
// //     setOwnerEmail(value);
// //     const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
// //     setEmailError(isValid ? "" : "Please enter a valid email address");
// //   };
// //   return (
// //     <div className="space-y-8 rounded-md w-3xl">
// //       {/* Brand Owner Section */}
// //       <Section
// //         title="Store owner details"
// //         subtitle="This is for internal data, customers won't see this. You will sign in with this number."
// //       >
// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //           <div>
// //             <label className="block text-sm font-medium mb-1 text-black">
// //               {" "}
// //               Store owner number
// //             </label>
// //             <input
// //               type="text"
// //               defaultValue={sellerNumber || ""}
// //               className="w-full border border-gray-300 rounded px-3 py-2 text-gray bg-gray-100 text-black"
// //               disabled={!!sellerNumber}
// //             />
// //           </div>

// //           {/* <InputField label="Brand owner number" value={sellerNumber || ''} placeholder="+91-8949389493" /> */}
// //           <InputField
// //             type="email"
// //             label="Email Address"
// //             value={ownerEmail}
// //             onChange={handleEmailChange}
// //             required
// //             error={emailError}
// //           />
// //           <InputField
// //             label="Store owner name"
// //             value={ownerName}
// //             onChange={setOwnerName}
// //             required
// //           />
// //         </div>
// //       </Section>

// //       {/* Brand Details Section */}
// //       <Section
// //         title="Store details"
// //         subtitle="Customers will see these details on Attirelly"
// //       >
// //         <InputField
// //           label="Store name"
// //           value={brandName}
// //           onChange={setBrandName}
// //           required
// //         />
// //         <div className="space-y-1">
// //           <label className="text-sm text-black">Store whatsapp number</label>
// //           <input
// //             type="tel"
// //             disabled={sameAsOwner}
// //             value={businessWpNum}
// //             onChange={(e) => {
// //               const val = e.target.value;
// //               // Allow only digits and max 10 characters
// //               if (/^\d{0,10}$/.test(val)) {
// //                 setBusinessWpNum(val);
// //               }
// //             }}
// //             maxLength={10}
// //             inputMode="numeric"
// //             pattern="\d{10}"
// //             className="w-full border rounded px-3 py-2 text-black placeholder-gray-400"
// //             placeholder="Enter 10-digit number"
// //           />
// //           <label className="text-sm flex items-center gap-2 text-black">
// //             <input
// //               type="checkbox"
// //               checked={sameAsOwner}
// //               onChange={(e) => setSameAsOwner(e.target.checked)}
// //             />
// //             Same as owner number
// //           </label>
// //         </div>

// //         <ToggleChips
// //           label="Store Type"
// //           items={brandTypes}
// //           selected={selectedBrandTypes}
// //           toggle={(item) =>
// //             toggleSelection(item, selectedBrandTypes, setSelectedBrandTypes)
// //           }
// //         />
// //         <MultiSelectField
// //           label="Expertise in"
// //           options={categoryOptions}
// //           value={selectedCategoryOptions}
// //           onChange={(selectedOptions) => {
// //             setSelectedCategoryOptions(selectedOptions);

// //             const selectedCats = selectedOptions.map((opt) => ({
// //               category_id: opt.value,
// //               name: opt.label,
// //             }));
// //             setSelectedCategories(selectedCats);
// //           }}
// //           isDisabled={false}
// //         />
// //         <ToggleChips
// //           label="Genders Catered"
// //           items={genders}
// //           selected={selectedGenderTypes}
// //           toggle={(item) =>
// //             toggleSelection(item, selectedGenderTypes, setSelectedGenderTypes)
// //           }
// //         />

// //         {/* <RadioGroup label="Do you rent outfits" options={['Yes', 'No']} selected={rentOutfits} onChange={setRentOutfits} /> */}
// //       </Section>

// //       {/* Return Exchange Section */}

// //       <Section
// //         title="Return & Exchange"
// //         subtitle="Customers will see these details on Attirelly"
// //       >
// //         <div className="flex items-center gap-4">
// //           <RadioGroup
// //             label="Return Available"
// //             options={["Yes", "No"]}
// //             selected={returnAvailable || ""}
// //             onChange={setReturnAvailable}
// //             required={true}
// //           />
// //           {returnAvailable === "Yes" && (
// //             <div className="ml-4">
// //               <label className="block text-sm font-medium mb-2 text-black">
// //                 Return Days
// //               </label>
// //               <input
// //                 type="number"
// //                 value={retDays || ""}
// //                 onChange={(e) => {
// //                   const val = Number(e.target.value);
// //                   if (val < 1) setRetDays(1);
// //                   else if (val > 45) setRetDays(45);
// //                   else setRetDays(val);
// //                 }}
// //                 min={1}
// //                 max={45}
// //                 className="border px-2 py-1 rounded-md w-20 text-black placeholder-gray-400"
// //                 placeholder="Days"
// //               />
// //             </div>
// //           )}
// //         </div>
// //         <div className="flex items-center gap-4 mt-4">
// //           <RadioGroup
// //             label="Exchange Available"
// //             options={["Yes", "No"]}
// //             selected={exchangeAvailable || ""}
// //             onChange={setExchangeAvailable}
// //             required={true}
// //           />
// //           {exchangeAvailable === "Yes" && (
// //             <div className="ml-4">
// //               <label className="block text-sm font-medium mb-2 text-black">
// //                 Exchange Days
// //               </label>
// //               <input
// //                 type="number"
// //                 value={excDays || ""}
// //                 onChange={(e) => {
// //                   const val = Number(e.target.value);
// //                   if (val < 1) setExcDays(1);
// //                   else if (val > 45) setExcDays(45);
// //                   else setExcDays(val);
// //                 }}
// //                 min={1}
// //                 max={45}
// //                 className="border px-2 py-1 rounded-md w-20 text-black placeholder-gray-400"
// //                 placeholder="Days"
// //               />
// //             </div>
// //           )}
// //         </div>
// //       </Section>

// //       {/* Brand Location Section */}
// //       <Section
// //         title="Brand location"
// //         subtitle="Customers will see these details on Attirelly"
// //       >
// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //           <SelectField
// //             label="City"
// //             options={cityOptions}
// //             value={selectedCityOption}
// //             onChange={(option) => {
// //               setSelectedCityOption(option);
// //               const found = cities.find((c) => c.id === option?.value);
// //               setSelectedCity(found ? [found] : []);

// //               setSelectedAreaOption(null);
// //               setSelectedArea([]);
// //               setSelectedPincodeOption(null);
// //               setSelectedPincode([]);
// //               setPinCode("");
// //             }}
// //           />

// //           <InputField
// //             label="Enter Google Map link of store"
// //             value={brandAddress}
// //             onChange={setBrandAddress}
// //             placeholder="Enter your Google map store link"
// //           />

// //           <SelectField
// //             label="Area"
// //             options={[...areaOptions]}
// //             value={selectedAreaOption}
// //             onChange={(option) => {
// //               setSelectedAreaOption(option);
// //               if (option?.value === "option") {
// //                 setSelectedArea([]);
// //               } else {
// //                 const found = areas.find((a) => a.id === option?.value);
// //                 setSelectedArea(found ? [found] : []);
// //               }
// //             }}
// //             isDisabled={!selectedCityOption}
// //           />

// //           {/* <InputField label="Pin code" value={pinCode} onChange={setPinCode} required /> */}

// //           <SelectField
// //             label="Pincode"
// //             options={pincodeOptions}
// //             value={selectedPincodeOption}
// //             onChange={(option) => {
// //               setSelectedPincodeOption(option);
// //               const found = pincodes.find((p) => p.id === option?.value);
// //               setSelectedPincode(found ? [found] : []);
// //               setPinCode(found?.id || "");
// //             }}
// //             isDisabled={!selectedCityOption}
// //           />
// //           {/* <InputField label="Store Location URL" value={storeLocation} onChange={setStoreLocation} placeholder='Enter your Google map store link' /> */}
// //         </div>
// //         {/* <button className="mt-4 px-4 py-2 border border-black rounded hover:bg-black hover:text-white transition">
// //           Add another outlet
// //         </button> */}
// //       </Section>
// //     </div>
// //   );
// // }

// // // Utility Components

// // const RequiredLabel: FC<{ children: React.ReactNode }> = ({ children }) => (
// //   <label className="block text-sm font-medium mb-1 text-black">
// //     {children} <span className="text-red-500">*</span>
// //   </label>
// // );

// // const Section: FC<{
// //   title: string;
// //   subtitle: string;
// //   children: React.ReactNode;
// // }> = ({ title, subtitle, children }) => (
// //   <div className="p-6 space-y-4 rounded-2xl shadow-sm bg-white">
// //     <h2 className="text-lg font-semibold mb-1 text-black">{title}</h2>
// //     <p className="text-sm text-gray-500 mb-4">{subtitle}</p>
// //     {/* Divider */}
// //     <div className="-mx-6 border-t border-gray-300"></div>
// //     {children}
// //   </div>
// // );

// // const InputField: FC<{
// //   label: string;
// //   value?: string;
// //   onChange?: (value: string) => void;
// //   required?: boolean;
// //   placeholder?: string;
// //   type?: string;
// //   error?: string;
// // }> = ({ label, value = "", onChange, required, placeholder, type, error }) => (
// //   <div>
// //     {required ? (
// //       <RequiredLabel>{label}</RequiredLabel>
// //     ) : (
// //       <label className="block text-sm font-medium mb-1 text-black">
// //         {label}
// //       </label>
// //     )}
// //     <input
// //       type={type || "text"}
// //       className="w-full border border-gray-300 rounded px-3 py-2 text-black placeholder-gray-400"
// //       placeholder={placeholder}
// //       value={value}
// //       onChange={(e) => onChange?.(e.target.value)}
// //     />
// //     {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
// //   </div>
// // );

// // const ToggleChips: FC<{
// //   label: string;
// //   items: { id: string; store_type?: string; gender_value?: string }[];
// //   selected: any[];
// //   toggle: (item: any) => void;
// // }> = ({ label, items, selected, toggle }) => (
// //   <div>
// //     <RequiredLabel>{label}</RequiredLabel>
// //     <div className="grid grid-cols-2 gap-2">
// //       {items.map((item) => {
// //         const text = item.store_type || item.gender_value;
// //         const isSelected = selected.some((s) => s.id === item.id);
// //         return (
// //           <label
// //             key={item.id}
// //             // onClick={() => toggle(item)}
// //             className={`px-3 w-50 py-2 border border-gray-500 rounded cursor-pointer ${
// //               isSelected ? "bg-gray-100" : "bg-white"
// //             }`}
// //           >
// //             <input
// //               type="checkbox"
// //               checked={isSelected}
// //               onChange={() => toggle(item)}
// //               className="accent-black"
// //             />
// //             <span
// //               className={`text-md font-medium ${
// //                 isSelected ? "text-black" : "text-gray-500"
// //               }`}
// //             >
// //               {" "}
// //               {text}
// //             </span>
// //           </label>
// //         );
// //       })}
// //     </div>
// //   </div>
// // );

// // const SelectField: FC<{
// //   label: string;
// //   options: SelectOption[];
// //   value: SelectOption | null;
// //   onChange: (option: SelectOption | null) => void;
// //   isDisabled?: boolean;
// // }> = ({ label, options, value, onChange, isDisabled = false }) => (
// //   <div>
// //     <RequiredLabel>{label}</RequiredLabel>
// //     <Select
// //       options={options}
// //       value={value}
// //       onChange={(newValue) => {
// //         onChange(newValue as SelectOption);
// //       }}
// //       isClearable
// //       isDisabled={isDisabled}
// //       placeholder="Select or type"
// //       classNamePrefix="react-select"
// //       className="text-black"
// //       styles={selectStyles}
// //     />
// //   </div>
// // );

// // // type MultiSelectFieldProps = {
// // //   label: string;
// // //   options: SelectOption[];
// // //   value: SelectOption[];
// // //   onChange: (options: SelectOption[]) => void;
// // //   isDisabled?: boolean;
// // //   maxSelected?: number;
// // // };

// // const MultiSelectField: FC<{
// //   label: string;
// //   options: SelectOption[];
// //   value: SelectOption[];
// //   onChange: (options: SelectOption[]) => void;
// //   isDisabled?: boolean;
// // }> = ({ label, options, value, onChange, isDisabled = false }) => (
// //   <div>
// //     <RequiredLabel>{label}</RequiredLabel>
// //     <Select
// //       isMulti
// //       options={options}
// //       value={value}
// //       onChange={(newValue) => {
// //         const selected = (newValue as SelectOption[]) || [];
// //         if (selected.length > 3) {
// //           toast.error("Maximum 3 Entries Allowed");
// //         }
// //         if (selected.length <= 3) {
// //           onChange(selected);
// //         }
// //       }}
// //       isDisabled={isDisabled}
// //       placeholder="Select up to 3"
// //       closeMenuOnSelect={false}
// //       classNamePrefix="react-select"
// //       className="text-black"
// //       styles={selectStyles}
// //     />
// //   </div>
// // );

// // const RadioGroup: FC<{
// //   label: string;
// //   options: string[];
// //   selected: string | null;
// //   onChange: (value: string) => void;
// //   required?: boolean;
// // }> = ({ label, options, selected, onChange, required }) => (
// //   <div>
// //     {required ? (
// //       <RequiredLabel>{label}</RequiredLabel>
// //     ) : (
// //       <label className="block text-sm font-medium mb-2">{label}</label>
// //     )}
// //     <div className="flex gap-4">
// //       {options.map((opt) => (
// //         <label
// //           key={opt}
// //           className={`px-4 py-2 border border-gray-500 rounded text-gray-500 cursor-pointer ${
// //             selected === opt ? "bg-gray-100" : "bg-white"
// //           }`}
// //         >
// //           <input
// //             type="radio"
// //             className="accent-black"
// //             name={label}
// //             value={opt}
// //             checked={selected === opt}
// //             onChange={() => onChange(opt)}
// //           />
// //           <span
// //             className={`text-sm font-medium ${
// //               selected === opt ? "text-black" : "text-gray-500"
// //             }`}
// //           >
// //             {" "}
// //             {opt}
// //           </span>
// //         </label>
// //       ))}
// //     </div>
// //   </div>
// // );

"use client";
import { useEffect, useRef, useState, type FC } from "react";
import dynamic from "next/dynamic";
import { api } from "@/lib/axios";
import { useSellerStore } from "@/store/sellerStore";
import {
  City,
  Area,
  BrandType,
  GenderType,
  Pincode,
  SelectOption,
  Category,
} from "@/types/SellerTypes";
import selectStyles from "@/utils/selectStyles";
import { toast } from "sonner";

const Select = dynamic(
  () => import("react-select").then((mod) => mod.default),
  {
    ssr: false,
  }
);

export default function BusinessDetailsComponent({
  onValidationChange,
}: {
  onValidationChange?: (isValid: boolean) => void;
}) {
  const {
    setBusinessDetailsValid,
    setBusinessDetailsData,
    businessDetailsData,
    sellerNumber,
    sellerId,
    sellerName,
    sellerEmail,
    setStoreNameString,
  } = useSellerStore();
  const [sameAsOwner, setSameAsOwner] = useState(true);

  const [brandTypes, setBrandTypes] = useState<BrandType[]>([]);
  const [selectedBrandTypes, setSelectedBrandTypes] = useState<BrandType[]>(
    businessDetailsData?.brandTypes || []
  );

  const [genders, setGenders] = useState<GenderType[]>([]);
  const [selectedGenderTypes, setSelectedGenderTypes] = useState<GenderType[]>(
    businessDetailsData?.genders || []
  );

  const [rentOutfits, setRentOutfits] = useState<string | null>(
    businessDetailsData?.rentOutfits || null
  );
  const [retDays, setRetDays] = useState<number>(() => {
    return businessDetailsData?.returnDays ?? 0;
  });
  const [returnAvailable, setReturnAvailable] = useState<string | null>("");
  const [excDays, setExcDays] = useState<number>(() => {
    return businessDetailsData?.exchangeDays ?? 0;
  });
  const [exchangeAvailable, setExchangeAvailable] = useState<string | null>("");

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

  const [ownerName, setOwnerName] = useState(
    businessDetailsData?.ownerName || ""
  );
  const [ownerEmail, setOwnerEmail] = useState(
    businessDetailsData?.ownerEmail || ""
  );
  const [emailError, setEmailError] = useState("");
  const [brandName, setBrandName] = useState(
    businessDetailsData?.brandName || ""
  );
  const [businessWpNum, setBusinessWpNum] = useState(
    businessDetailsData?.businessWpNum || ""
  );
  const [pinCode, setPinCode] = useState(businessDetailsData?.pinCode || "");
  const [brandAddress, setBrandAddress] = useState(
    businessDetailsData?.brandAddress || ""
  );
  const hasHydrated = useRef(false);

  useEffect(() => {
    if (sameAsOwner) {
      setBusinessWpNum(sellerNumber || "");
    }
  }, [sameAsOwner, sellerNumber]);
  useEffect(() => {
    if (returnAvailable === "No") {
      setRetDays(0);
    }
    if (exchangeAvailable === "No") {
      setExcDays(0);
    }
  }, [returnAvailable, exchangeAvailable]);

  useEffect(() => {
    if (!businessDetailsData) return;

    setReturnAvailable((prev) =>
      prev === ""
        ? businessDetailsData.returnDays === 0
          ? "No"
          : businessDetailsData.returnDays > 0
          ? "Yes"
          : ""
        : prev
    );

    setExchangeAvailable((prev) =>
      prev === ""
        ? businessDetailsData.exchangeDays === 0
          ? "No"
          : businessDetailsData.exchangeDays > 0
          ? "Yes"
          : ""
        : prev
    );
  }, [businessDetailsData]);

  useEffect(() => {
    if (businessDetailsData && !hasHydrated.current) {
      setOwnerName(businessDetailsData.ownerName || "");
      setOwnerEmail(businessDetailsData.ownerEmail || "");
      setBrandName(businessDetailsData.brandName || "");
      setBusinessWpNum(businessDetailsData.businessWpNum || "");
      setPinCode(businessDetailsData.pinCode || "");
      setBrandAddress(businessDetailsData.brandAddress || "");

      setSelectedBrandTypes(businessDetailsData.brandTypes || []);
      setSelectedCategories(businessDetailsData.categories || []);

      setSelectedCategoryOptions(
        (businessDetailsData.categories || []).map((cat) => ({
          value: cat.category_id,
          label: cat.name,
        }))
      );
      setSelectedGenderTypes(businessDetailsData.genders || []);
      setRentOutfits(businessDetailsData.rentOutfits || null);
      setSelectedCity(businessDetailsData.city || []);
      setSelectedArea(businessDetailsData.area || []);
      setSelectedPincode(businessDetailsData.pinCode || []);
      hasHydrated.current = true;
    }
  }, [businessDetailsData]);

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

  const cityInitializedRef = useRef(false);
  const areaInitializedRef = useRef(false);
  const pincodeInitializedRef = useRef(false);

  useEffect(() => {
    if (
      cityInitializedRef.current ||
      !businessDetailsData ||
      businessDetailsData.city?.length === 0 ||
      cities.length === 0 ||
      cityOptions.length === 0
    )
      return;

    const cityFromStore = businessDetailsData.city[0];
    const fullCity = cities.find((city) => city.id === cityFromStore.id);
    const cityOption = cityOptions.find(
      (opt) => opt.value === cityFromStore.id
    );

    if (fullCity) setSelectedCity([fullCity]);
    if (cityOption) {
      setSelectedCityOption(cityOption);
    } else {
      setSelectedCityOption({
        value: cityFromStore.id,
        label: cityFromStore.name,
      });
    }
    cityInitializedRef.current = true;
  }, [businessDetailsData, cities, cityOptions]);

  useEffect(() => {
    if (selectedCityOption?.value) {
      const filteredAreas = areas
        .filter((area) => area.city_id === selectedCityOption.value)
        .map((area) => ({ value: area.id, label: area.name }));
      setAreaOptions(filteredAreas);
    } else {
      setAreaOptions([]);
      setSelectedAreaOption(null);
      setSelectedArea([]);
    }
  }, [selectedCityOption, areas]);

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

  useEffect(() => {
    if (selectedCityOption?.value) {
      const filteredPincodes = pincodes
        .filter((p) => p.city_id === selectedCityOption.value)
        .map((p) => ({ value: p.id, label: p.code }));
      setPincodeOptions(filteredPincodes);
    } else {
      setPincodeOptions([]);
      setSelectedPincode([]);
      setSelectedPincodeOption(null);
    }
  }, [selectedCityOption, pincodes]);

  useEffect(() => {
    const valid =
      ownerName.trim() &&
      ownerEmail.trim() &&
      brandName.trim() &&
      selectedBrandTypes.length > 0 &&
      selectedGenderTypes.length > 0 &&
      selectedCity.length > 0 &&
      selectedPincode.length > 0 &&
      selectedCategoryOptions.length >= 1 &&
      selectedCategoryOptions.length <= 3 &&
      exchangeAvailable !== "" &&
      returnAvailable !== "";
    const categoriesForZustand = selectedCategoryOptions.map((opt) => ({
      category_id: opt.value,
      name: opt.label,
    }));

    setSelectedCategories(categoriesForZustand);
    setBusinessDetailsValid(Boolean(valid));
    onValidationChange?.(Boolean(valid));

    if (valid) {
      setBusinessDetailsData({
        ownerName,
        ownerEmail,
        brandName,
        businessWpNum,
        brandTypes: selectedBrandTypes,
        categories: categoriesForZustand,
        genders: selectedGenderTypes,
        rentOutfits,
        city: selectedCity,
        area: selectedArea,
        pinCode: selectedPincode,
        brandAddress,
        returnDays: Number(retDays) || 0,
        exchangeDays: Number(excDays) || 0,
      });
      setStoreNameString(brandName);
    }
  }, [
    ownerName,
    ownerEmail,
    brandName,
    selectedBrandTypes,
    selectedGenderTypes,
    selectedCity,
    selectedArea,
    selectedPincode,
    rentOutfits,
    brandAddress,
    selectedCategoryOptions,
    exchangeAvailable,
    returnAvailable,
    retDays,
    excDays,
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
    setOwnerEmail(value);
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    setEmailError(isValid ? "" : "Please enter a valid email address");
  };

  return (
    <div className="p-4 sm:p-6 rounded-2xl space-y-4 md:space-y-6 mx-auto  bg-white text-black">
      {/* Brand Owner Section */}
      <Section
        title="Store owner details"
        subtitle="This is for internal data, customers won't see this. You will sign in with this number."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium mb-1 text-black">
              Store owner number
            </label>
            <input
              type="text"
              defaultValue={sellerNumber || ""}
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray bg-gray-100 text-black"
              disabled={!!sellerNumber}
            />
          </div>
          <InputField
            type="email"
            label="Email Address"
            value={ownerEmail}
            onChange={handleEmailChange}
            required
            error={emailError}
          />
          <InputField
            label="Store owner name"
            value={ownerName}
            onChange={setOwnerName}
            required
          />
        </div>
      </Section>

      {/* Brand Details Section */}
      <Section
        title="Store details"
        subtitle="Customers will see these details on Attirelly"
      >
        <div className="space-y-4">
          <InputField
            label="Store name"
            value={brandName}
            onChange={setBrandName}
            required
          />
          <div className="space-y-1">
            <label className="text-xs sm:text-sm text-black">
              Store whatsapp number
            </label>
            <input
              type="tel"
              disabled={sameAsOwner}
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
                checked={sameAsOwner}
                onChange={(e) => setSameAsOwner(e.target.checked)}
              />
              Same as owner number
            </label>
          </div>

          <ToggleChips
            label="Store Type"
            items={brandTypes}
            selected={selectedBrandTypes}
            toggle={(item) =>
              toggleSelection(item, selectedBrandTypes, setSelectedBrandTypes)
            }
          />
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

      {/* Return Exchange Section */}
      <Section
        title="Return & Exchange"
        subtitle="Customers will see these details on Attirelly"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <RadioGroup
            label="Return Available"
            options={["Yes", "No"]}
            selected={returnAvailable || ""}
            onChange={setReturnAvailable}
            required={true}
          />
          {returnAvailable === "Yes" && (
            <div className="mt-2 sm:mt-0 sm:ml-4">
              <label className="block text-xs sm:text-sm font-medium mb-2 text-black">
                Return Days
              </label>
              <input
                type="number"
                value={retDays || ""}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val < 1) setRetDays(1);
                  else if (val > 45) setRetDays(45);
                  else setRetDays(val);
                }}
                min={1}
                max={45}
                className="border px-2 py-1 rounded-md w-24 text-black placeholder-gray-400"
                placeholder="Days"
              />
            </div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4">
          <RadioGroup
            label="Exchange Available"
            options={["Yes", "No"]}
            selected={exchangeAvailable || ""}
            onChange={setExchangeAvailable}
            required={true}
          />
          {exchangeAvailable === "Yes" && (
            <div className="mt-2 sm:mt-0 sm:ml-4">
              <label className="block text-xs sm:text-sm font-medium mb-2 text-black">
                Exchange Days
              </label>
              <input
                type="number"
                value={excDays || ""}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val < 1) setExcDays(1);
                  else if (val > 45) setExcDays(45);
                  else setExcDays(val);
                }}
                min={1}
                max={45}
                className="border px-2 py-1 rounded-md w-24 text-black placeholder-gray-400"
                placeholder="Days"
              />
            </div>
          )}
        </div>
      </Section>

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

