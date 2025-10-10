'use client';

import { useState, forwardRef, useImperativeHandle } from 'react';
import { X } from 'lucide-react';

interface ComponentProps {
  onNext: () => void;
  isLastStep?: boolean;
}

// A simple styled component for the multi-select tags
const Tag = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
  <span className="flex items-center bg-gray-200 text-gray-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-md">
    {label}
    <button onClick={onRemove} className="ml-1.5 text-gray-500 hover:text-gray-800">
      <X size={14} />
    </button>
  </span>
);

// export default function Details({ onNext }: ComponentProps) {
  // State for all form fields, including all mandatory ones
const Details = forwardRef(({ onNext, isLastStep }: ComponentProps, ref) => { 
  const [personalNumber, setPersonalNumber] = useState('');
  const [email, setEmail] = useState('');
  const [stylistName, setStylistName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [isSameAsPersonal, setIsSameAsPersonal] = useState(false);
  const [expertise, setExpertise] = useState<string[]>([]);
  const [genders, setGenders] = useState<string[]>([]);
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [pincode, setPincode] = useState('');
  const [mapLink, setMapLink] = useState('');

  useImperativeHandle(ref, () => ({
    getData: () => ({
      personal_phone: personalNumber,
      email,
      stylist_name: stylistName,
      whatsapp_phone: whatsappNumber,
      expertises: expertise,
      genders_catered: genders,
      city,
      area,
      pincode,
      google_maps_link: mapLink,
    }),
  }));

  // Handle next button click with validation
  const handleNext = () => {
    // Check if any mandatory field is empty or has a length of 0
    if (
      !personalNumber ||
      !email ||
      !stylistName ||
      !whatsappNumber ||
      expertise.length === 0 ||
      genders.length === 0 ||
      !city ||
      !area ||
      !pincode ||
      !mapLink
    ) {
      alert('All mandatory fields need to be filled.');
      return;
    }
    // If all fields are filled, proceed to the next step
    onNext();
  };

  // Handle checkbox change to sync numbers
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setIsSameAsPersonal(isChecked);
    if (isChecked) {
      setWhatsappNumber(personalNumber);
    }
  };

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSameAsPersonal(false);
    setWhatsappNumber(e.target.value);
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setGenders([...genders, value]);
    } else {
      setGenders(genders.filter((gender) => gender !== value));
    }
  };

  const handleExpertiseToggle = (option: string) => {
    if (expertise.includes(option)) {
      setExpertise(expertise.filter(item => item !== option));
    } else {
      setExpertise([...expertise, option]);
    }
  };

  const expertiseOptions = ['Sarees', 'Gowns', 'Saree Blouses', 'Lehengas', 'Sherwanis'];

  return (
    <div className="space-y-12">
      {/* Section 1: Stylist Personal Details */}
      <div className="bg-white p-8 rounded-lg shadow-sm border text-black">
        <h2 className="text-2xl font-semibold mb-2">Stylist Personal Details</h2>
        <p className="text-black-500 mb-8">
          This is for internal data, customers won't see this.
        </p>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="personal-number" className="block text-sm font-medium text-gray-700 mb-1">
                Stylist Personal Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="personal-number"
                value={personalNumber}
                onChange={(e) => {
                  setPersonalNumber(e.target.value);
                  if (isSameAsPersonal) {
                    setWhatsappNumber(e.target.value);
                  }
                }}
                className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label htmlFor="stylist-name" className="block text-sm font-medium text-gray-700 mb-1">
              Stylist name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="stylist-name"
              value={stylistName}
              onChange={(e) => setStylistName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Stylist Details (Visible to Customers) */}
      <div className="bg-white p-8 rounded-lg shadow-sm border text-black">
        <h2 className="text-2xl font-semibold mb-2">Stylist details</h2>
        <p className="text-gray-500 mb-8">
          Customers will see these details on Attirelly.
        </p>
        <div className="space-y-6">
          <div>
            <label htmlFor="whatsapp-number" className="block text-sm font-medium text-gray-700 mb-1">
              Stylist whatsapp number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="whatsapp-number"
              value={whatsappNumber}
              onChange={handleWhatsappChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex items-center mt-2">
              <input
                id="same-as-owner"
                type="checkbox"
                checked={isSameAsPersonal}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="same-as-owner" className="ml-2 block text-sm text-gray-900">
                Same as personal number
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expertise in <span className="text-red-500">*</span></label>
            <div className="w-full flex flex-wrap items-center p-2 border border-gray-300 rounded-md">
              {expertiseOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleExpertiseToggle(option)}
                  className={`m-1 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200
                    ${expertise.includes(option) ? 'bg-black text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Genders Catered <span className="text-red-500">*</span></label>
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="checkbox"
                  id="men"
                  name="gender"
                  value="Men"
                  checked={genders.includes('Men')}
                  onChange={handleGenderChange}
                  className="hidden peer"
                />
                <label htmlFor="men" className="block p-3 border rounded-md text-center cursor-pointer peer-checked:border-black peer-checked:font-semibold">
                  Men
                </label>
              </div>
              <div className="flex-1">
                <input
                  type="checkbox"
                  id="women"
                  name="gender"
                  value="Women"
                  checked={genders.includes('Women')}
                  onChange={handleGenderChange}
                  className="hidden peer"
                />
                <label htmlFor="women" className="block p-3 border rounded-md text-center cursor-pointer peer-checked:border-black peer-checked:font-semibold">
                  Women
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Stylist Location */}
      <div className="bg-white p-8 rounded-lg shadow-sm border text-black">
        <h2 className="text-2xl font-semibold mb-2">Stylist location</h2>
        <p className="text-gray-500 mb-8">
          Customers will see these details on Attirelly.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City <span className="text-red-500">*</span></label>
            <select
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="" disabled hidden>Select a city</option>
              <option value="Chandigarh">Chandigarh</option>
              <option value="Delhi">Delhi</option>
            </select>
          </div>
          <div>
            <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">Area <span className="text-red-500">*</span></label>
            <select
              id="area"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="" disabled hidden>Select an area</option>
              <option value="Sector 8">Sector 8</option>
              <option value="Sector 17">Sector 17</option>
            </select>
          </div>
          <div>
            <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">Pincode <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="map-link" className="block text-sm font-medium text-gray-700 mb-1">Enter Google Map link of address <span className="text-red-500">*</span></label>
            <input
              type="url"
              id="map-link"
              value={mapLink}
              onChange={(e) => setMapLink(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Navigation Button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleNext}
          className="px-8 py-3 bg-black text-white rounded-md font-semibold hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
        >
          Next
        </button>
      </div>
    </div>
  );
});

export default Details;