'use client';
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useFormValidation } from '@/components/FormValidationContext';

const cityOptions = [
  { value: 'Delhi', label: 'Delhi' },
  { value: 'Mumbai', label: 'Mumbai' },
  { value: 'Bangalore', label: 'Bangalore' },
  { value: 'Chennai', label: 'Chennai' },
  // Add more or fetch dynamically
];

const areaOptions = [
  { value: 'Connaught Place', label: 'Connaught Place' },
  { value: 'Andheri', label: 'Andheri' },
  { value: 'Koramangala', label: 'Koramangala' },
  // Add more or fetch dynamically
];

export default function BusinessDetailsComponent({ onValidationChange }: { onValidationChange?: (isValid: boolean) => void }) {
  const [sameAsOwner, setSameAsOwner] = useState(true);
  const [brandTypes, setBrandTypes] = useState<string[]>([]);
  const [genders, setGenders] = useState<string[]>([]);
  const [rentOutfits, setRentOutfits] = useState<string | null>(null);
  const { setBusinessDetailsValid } = useFormValidation();

  // Controlled fields
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [brandName, setBrandName] = useState('');
  const [city, setCity] = useState<any>(null);
  const [area, setArea] = useState<any>(null);
  const [pinCode, setPinCode] = useState('');

  useEffect(() => {
  const isValid = ownerName && ownerEmail && brandName && brandTypes.length > 0 && genders.length > 0 && city && pinCode;
  setBusinessDetailsValid(Boolean(isValid));
}, [ownerName, ownerEmail, brandName, brandTypes, genders, city, pinCode]);

  const brandTypeOptions = [
    'Designer labels',
    'Western wear',
    'Retail brands',
    'Exhibition',
    'Boutiques',
    'Stylist',
  ];

  const genderOptions = ['Male', 'Female'];

  const handleMultiSelect = (option: string, list: string[], setList: (val: string[]) => void) => {
    setList(list.includes(option) ? list.filter(item => item !== option) : [...list, option]);
  };

  // Validation check
  const isValid = ownerName.trim() && ownerEmail.trim() && brandName.trim() &&
    brandTypes.length > 0 && genders.length > 0 &&
    city?.value && pinCode.trim();

  if (onValidationChange) onValidationChange(Boolean(isValid));

  return (
    <div className="space-y-8 max-w-3xl mx-auto bg-gray-100">
      {/* Owner Details */}
      <div className="p-6 rounded-2xl shadow-sm bg-white">
        <h2 className="text-lg font-semibold mb-1">Brand owner details</h2>
        <p className="text-sm text-gray-500 mb-4">This is for internal data, your customers won't see this.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Brand owner number*</label>
              <input type="text" className="w-full border rounded px-3 py-2" placeholder="+91-8949389493" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email address*</label>
              <input type="email" value={ownerEmail} onChange={(e) => setOwnerEmail(e.target.value)} className={`w-full border rounded px-3 py-2 ${!ownerEmail && 'border-red-500'}`} placeholder="abc@xyz.com" />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Brand owner name*</label>
              <input type="text" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} className={`w-full border rounded px-3 py-2 ${!ownerName && 'border-red-500'}`} placeholder="Please enter your full name" />
            </div>
          </div>
        </div>
      </div>

      {/* Brand Details */}
      <div className="p-6 rounded-lg shadow-sm bg-white">
        <h2 className="text-lg font-semibold mb-1">Brand details</h2>
        <p className="text-sm text-gray-500 mb-4">Customers will see these details on Attirelly</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Brand name*</label>
            <input type="text" value={brandName} onChange={(e) => setBrandName(e.target.value)} className={`w-full border rounded px-3 py-2 ${!brandName && 'border-red-500'}`} placeholder="Please enter your brand name" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Business WhatsApp number</label>
            <input type="text" disabled={sameAsOwner} className="w-full border rounded px-3 py-2 mb-1" placeholder="+91-8949389493" />
            <label className="text-sm flex items-center gap-2">
              <input type="checkbox" checked={sameAsOwner} onChange={() => setSameAsOwner(!sameAsOwner)} />
              Same as owner number
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Brand type*</label>
            <div className="flex flex-wrap gap-2">
              {brandTypeOptions.map(type => (
                <label key={type} className={`px-3 py-2 border rounded cursor-pointer ${brandTypes.includes(type) ? 'bg-black text-white' : 'bg-white'}`}>
                  <input type="checkbox" className="hidden" checked={brandTypes.includes(type)} onChange={() => handleMultiSelect(type, brandTypes, setBrandTypes)} />
                  {type}
                </label>
              ))}
            </div>
            {brandTypes.length === 0 && <p className="text-red-500 text-sm mt-1">Required</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Genders catered*</label>
            <div className="flex gap-2">
              {genderOptions.map(gender => (
                <label key={gender} className={`px-4 py-2 border rounded cursor-pointer ${genders.includes(gender) ? 'bg-black text-white' : 'bg-white'}`}>
                  <input type="checkbox" className="hidden" checked={genders.includes(gender)} onChange={() => handleMultiSelect(gender, genders, setGenders)} />
                  {gender}
                </label>
              ))}
            </div>
            {genders.length === 0 && <p className="text-red-500 text-sm mt-1">Required</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Do you rent outfits</label>
            <div className="flex gap-4">
              {['Yes', 'No'].map(option => (
                <label key={option} className={`px-4 py-2 border rounded cursor-pointer ${rentOutfits === option ? 'bg-black text-white' : 'bg-white'}`}>
                  <input type="radio" name="rentOutfits" className="hidden" value={option} checked={rentOutfits === option} onChange={() => setRentOutfits(option)} />
                  {option}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Brand Location */}
      <div className="p-6 rounded-2xl shadow-sm bg-white">
        <h2 className="text-lg font-semibold">Brand location</h2>
        <p className="text-sm text-gray-500">Customers will see these details on Attirelly</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">City*</label>
              <Select
                options={cityOptions}
                value={city}
                onChange={setCity}
                isClearable
                placeholder="Please select or type city"
                classNamePrefix="react-select"
              />
              {!city && <p className="text-red-500 text-sm mt-1">Required</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Brand address</label>
              <input type="text" className="w-full border rounded px-3 py-2" placeholder="Google Map URL" />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Area</label>
              <Select
                options={areaOptions}
                value={area}
                onChange={setArea}
                isClearable
                placeholder="Type or select area"
                classNamePrefix="react-select"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Pin code*</label>
              <input type="text" value={pinCode} onChange={(e) => setPinCode(e.target.value)} className={`w-full border rounded px-3 py-2 ${!pinCode && 'border-red-500'}`} placeholder="Enter pincode" />
            </div>
          </div>
        </div>

        <div>
          <button type="button" className="mt-4 px-4 py-2 border border-black rounded hover:bg-black hover:text-white transition">Add another outlet</button>
        </div>
      </div>
    </div>
  );
}
