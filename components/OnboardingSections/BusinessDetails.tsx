'use client';
import { useEffect, useRef, useState, type FC } from 'react';
import dynamic from 'next/dynamic';
import { api } from '@/lib/axios';
import { useSellerStore } from '@/store/sellerStore';

const Select = dynamic(() => import('react-select').then(mod => mod.default), {
  ssr: false,
});

type SelectOption = { value: string; label: string };
type BrandType = { id: string; store_type: string };
type GenderType = { id: string; gender_value: string };
type City = { id: string; name: string; state_id: string };
type Area = { id: string; name: string; city_id: string };
type Pincode = { id: string, code: string, city_id: string };

const RequiredLabel: FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="block text-sm font-medium mb-1">
    {children} <span className="text-red-500">*</span>
  </label>
);

export default function BusinessDetailsComponent({ onValidationChange }: { onValidationChange?: (isValid: boolean) => void }) {

  const {
    setBusinessDetailsValid,
    setBusinessDetailsData,
    businessDetailsData,
    sellerNumber,
    sellerId } = useSellerStore();
  const [sameAsOwner, setSameAsOwner] = useState(true);

  const [brandTypes, setBrandTypes] = useState<BrandType[]>([]);
  const [selectedBrandTypes, setSelectedBrandTypes] = useState<BrandType[]>(businessDetailsData?.brandTypes || []);

  const [genders, setGenders] = useState<GenderType[]>([]);
  const [selectedGenderTypes, setSelectedGenderTypes] = useState<GenderType[]>(businessDetailsData?.genders || []);

  const [rentOutfits, setRentOutfits] = useState<string | null>(businessDetailsData?.rentOutfits || null);
  console.log(businessDetailsData);

  const [cities, setCities] = useState<City[]>([]);
  const [cityOptions, setCityOptions] = useState<SelectOption[]>([]);
  const [selectedCity, setSelectedCity] = useState<City[]>([]);
  const [selectedCityOption, setSelectedCityOption] = useState<SelectOption | null>(null);

  const [areas, setAreas] = useState<Area[]>([]);
  const [areaOptions, setAreaOptions] = useState<SelectOption[]>([]);
  const [selectedArea, setSelectedArea] = useState<Area[]>([]);
  const [selectedAreaOption, setSelectedAreaOption] = useState<SelectOption | null>(null);

  const [pincodes, setPincodes] = useState<Pincode[]>([]);
  const [pincodeOptions, setPincodeOptions] = useState<SelectOption[]>([]);
  const [selectedPincode, setSelectedPincode] = useState<Pincode[]>([]);
  const [selectedPincodeOption, setSelectedPincodeOption] = useState<SelectOption | null>(null);

  const [ownerName, setOwnerName] = useState(businessDetailsData?.ownerName || '');
  const [ownerEmail, setOwnerEmail] = useState(businessDetailsData?.ownerEmail || '');
  const [brandName, setBrandName] = useState(businessDetailsData?.brandName || '');
  const [businessWpNum, setBusinessWpNum] = useState(businessDetailsData?.businessWpNum || '');
  const [pinCode, setPinCode] = useState(businessDetailsData?.pinCode || '');
  const [brandAddress, setBrandAddress] = useState(businessDetailsData?.brandAddress || '');

  useEffect(() => {
    if (sameAsOwner) {
      setBusinessWpNum(sellerNumber || '');
    }
  }, [sameAsOwner, sellerNumber]);


  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [storeTypesRes, gendersRes, citiesRes, areasRes, pincodeRes] = await Promise.all([
          api.get('/stores/store_types'),
          api.get('/genders/'),
          api.get('/location/cities/'),
          api.get('/location/areas/'),
          api.get('location/pincodes/')
        ]);

        setBrandTypes(storeTypesRes.data);
        setGenders(gendersRes.data);
        setCities(citiesRes.data);
        setAreas(areasRes.data);
        setPincodes(pincodeRes.data);

        setCityOptions(citiesRes.data.map((c: City) => ({ value: c.id, label: c.name })));
        setAreaOptions(areasRes.data.map((a: Area) => ({ value: a.id, label: a.name })));
      } catch (error) {
        console.error('Error fetching initial data:', error);
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
    ) return;

    const cityFromStore = businessDetailsData.city[0];
    console.log(businessDetailsData);
    const fullCity = cities.find(city => city.id === cityFromStore.id);
    const cityOption = cityOptions.find(opt => opt.value === cityFromStore.id);

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
        .filter(area => area.city_id === selectedCityOption.value)
        .map(area => ({ value: area.id, label: area.name }));
      setAreaOptions(filteredAreas);
    } else {
      setAreaOptions([]); // Reset if no city selected
      setSelectedAreaOption(null); // Also clear selected area
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
    ) return;

    const areaFromStore = businessDetailsData.area[0];
    const fullArea = areas.find(area => area.id === areaFromStore.id);
    const areaOption = areaOptions.find(opt => opt.value === areaFromStore.id);
    console.log(areaOption)
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
    ) return;

    const pincodeFromStore = businessDetailsData.pinCode[0];
    const fullPincode = pincodes.find(p => p.id === pincodeFromStore.id);
    const pincodeOption = pincodeOptions.find(opt => opt.value === pincodeFromStore.id);

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
        .filter(p => p.city_id === selectedCityOption.value)
        .map(p => ({ value: p.id, label: p.code }));
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
      selectedPincode.length > 0
      // pinCode.trim();

    setBusinessDetailsValid(Boolean(valid));
    onValidationChange?.(Boolean(valid));

    if (valid) {
      setBusinessDetailsData({
        ownerName,
        ownerEmail,
        brandName,
        businessWpNum,
        brandTypes: selectedBrandTypes,
        genders: selectedGenderTypes,
        rentOutfits,
        city: selectedCity,
        area: selectedArea,
        pinCode: selectedPincode,
        brandAddress,
      });
    }
  }, [
    ownerName, ownerEmail, brandName,
    selectedBrandTypes, selectedGenderTypes,
    selectedCity, selectedArea,
    selectedPincode, rentOutfits, brandAddress
  ]);



  const toggleSelection = <T extends { id: string }>(
    item: T, current: T[], setCurrent: React.Dispatch<React.SetStateAction<T[]>>
  ) => {
    const exists = current.some(t => t.id === item.id);
    setCurrent(exists ? current.filter(t => t.id !== item.id) : [...current, item]);
  };

  return (
    <div className="space-y-8 rounded-md w-3xl">
      {/* Brand Owner Section */}
      <Section title="Brand owner details" subtitle="This is for internal data, your customers won't see this.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className='block text-sm font-medium mb-1'> Brand owner number</label>
            <input
              type="text"
              defaultValue={sellerNumber || ''}
              className='w-full border border-gray-300 rounded px-3 py-2 text-gray bg-gray-100'
              disabled={!!sellerNumber}
            />
          </div>

          {/* <InputField label="Brand owner number" value={sellerNumber || ''} placeholder="+91-8949389493" /> */}
          <InputField label="Email Address" value={ownerEmail} onChange={setOwnerEmail} required />
          <InputField label="Brand owner name" value={ownerName} onChange={setOwnerName} required />
        </div>
      </Section>

      {/* Brand Details Section */}
      <Section title="Brand details" subtitle="Customers will see these details on Attirelly">
        <InputField label="Brand name" value={brandName} onChange={setBrandName} required />
        <div className="space-y-1">
          <label className="text-sm">Business WhatsApp number</label>
          <input
            type="text"
            disabled={sameAsOwner}
            value={businessWpNum}
            onChange={(e) => setBusinessWpNum(e.target.value)}
            // defaultValue={sellerNumber || ''}
            className="w-full border rounded px-3 py-2"
            placeholder="+91-8949389493"
          />
          <label className="text-sm flex items-center gap-2">
            <input type="checkbox" checked={sameAsOwner} onChange={(e) => setSameAsOwner(e.target.checked)} />
            Same as owner number
          </label>
        </div>

        <ToggleChips label="Brand Type" items={brandTypes} selected={selectedBrandTypes} toggle={(item) => toggleSelection(item, selectedBrandTypes, setSelectedBrandTypes)} />
        <ToggleChips label="Genders Catered" items={genders} selected={selectedGenderTypes} toggle={(item) => toggleSelection(item, selectedGenderTypes, setSelectedGenderTypes)} />

        <RadioGroup label="Do you rent outfits" options={['Yes', 'No']} selected={rentOutfits} onChange={setRentOutfits} />
      </Section>

      {/* Brand Location Section */}
      <Section title="Brand location" subtitle="Customers will see these details on Attirelly">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField label="City" options={cityOptions} value={selectedCityOption} onChange={(option) => {
            setSelectedCityOption(option);
            const found = cities.find(c => c.id === option?.value);
            setSelectedCity(found ? [found] : []);
          }} />

          <InputField label="Brand address" value={brandAddress} onChange={setBrandAddress} />

          <SelectField label="Area" options={areaOptions} value={selectedAreaOption} onChange={(option) => {
            setSelectedAreaOption(option);
            const found = areas.find(a => a.id === option?.value);
            setSelectedArea(found ? [found] : []);
          }}
            isDisabled={!selectedCityOption} />

          {/* <InputField label="Pin code" value={pinCode} onChange={setPinCode} required /> */}

          <SelectField
            label="Pincode"
            options={pincodeOptions}
            value={selectedPincodeOption}
            onChange={(option) => {
              setSelectedPincodeOption(option);
              const found = pincodes.find(p => p.id === option?.value);
              setSelectedPincode(found ? [found] : []);
              setPinCode(found?.id || '');
            }}
            isDisabled={!selectedCityOption}
          />
        </div>
        {/* <button className="mt-4 px-4 py-2 border border-black rounded hover:bg-black hover:text-white transition">
          Add another outlet
        </button> */}
      </Section>
    </div>
  );
}

// Utility Components

const Section: FC<{ title: string; subtitle: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
  <div className="p-6 space-y-4 rounded-2xl shadow-sm bg-white">
    <h2 className="text-lg font-semibold mb-1">{title}</h2>
    <p className="text-sm text-gray-500 mb-4">{subtitle}</p>
    {/* Divider */}
    <div className="-mx-6 border-t border-gray-300"></div>
    {children}
  </div>
);

const InputField: FC<{
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  placeholder?: string;
}> = ({ label, value = '', onChange, required, placeholder }) => (
  <div>
    {required ? <RequiredLabel>{label}</RequiredLabel> : <label className="block text-sm font-medium mb-1">{label}</label>}
    <input
      type="text"
      className="w-full border border-gray-300 rounded px-3 py-2"
      placeholder={placeholder}
      value={value}
      onChange={e => onChange?.(e.target.value)}
    />
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
    <div className="flex flex-wrap gap-2">
      {items.map(item => {
        const text = item.store_type || item.gender_value;
        const isSelected = selected.some(s => s.id === item.id);
        return (
          <label
            key={item.id}
            // onClick={() => toggle(item)}
            className={`px-3 py-2 border border-gray-500 rounded cursor-pointer ${isSelected ? 'bg-gray-100' : 'bg-white'}`}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => toggle(item)}
              className="accent-black"
            />
            <span className={`text-md font-medium ${isSelected ? 'text-black' : 'text-gray-500'}`}>  {text}</span>
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
    />
  </div>
);

const RadioGroup: FC<{
  label: string;
  options: string[];
  selected: string | null;
  onChange: (value: string) => void;
}> = ({ label, options, selected, onChange }) => (
  <div>
    <label className="block text-sm font-medium mb-2">{label}</label>
    <div className="flex gap-4">
      {options.map(opt => (
        <label key={opt} className={`px-4 py-2 border border-gray-500 rounded text-gray-500 cursor-pointer ${selected === opt ? 'bg-gray-100' : 'bg-white'}`}>
          <input
            type="radio"
            className="accent-black"
            name={label}
            value={opt}
            checked={selected === opt}
            onChange={() => onChange(opt)}
          />
          <span className={`text-sm font-medium ${selected === opt ? 'text-black' : 'text-gray-500'}`}>  {opt}</span>
        </label>
      ))}
    </div>
  </div>
);
