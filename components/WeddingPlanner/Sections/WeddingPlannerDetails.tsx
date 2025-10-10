'use client';

import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';

interface ComponentProps {
  onNext: () => void;
}

export default function WeddingPlannerDetails({ onNext }: ComponentProps) {
  // --- 1. Personal Details State ---
  const [personalNumber, setPersonalNumber] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  // --- 2. Business Details State ---
  const [agencyName, setAgencyName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [sameAsPersonal, setSameAsPersonal] = useState(false);
  const [barterAccepted, setBarterAccepted] = useState<boolean | null>(null);

  // --- 3. Location State ---
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [pincode, setPincode] = useState('');

  // useEffect to handle the "Same as personal number" checkbox logic
  useEffect(() => {
    if (sameAsPersonal) {
      setWhatsappNumber(personalNumber);
    } else if (whatsappNumber === personalNumber) {
      // Clear whatsapp number only if it was automatically set and is now unchecked
      setWhatsappNumber('');
    }
  }, [sameAsPersonal, personalNumber]);


  // Validation and Navigation Logic
  const handleNext = () => {
    // Basic validation for all mandatory fields
    if (
      !personalNumber ||
      !email ||
      !name ||
      !agencyName ||
      !whatsappNumber ||
      barterAccepted === null ||
      !city ||
      !area ||
      !pincode
    ) {
      alert('All fields marked with an asterisk are mandatory. Please fill them out to continue.');
      return;
    }
    
    // Add more specific validation (e.g., number format, email format) here if needed

    onNext();
  };


  return (
    <div className="space-y-12">
      
      {/* Section 1: Wedding Planner Personal Details */}
      <div className="bg-white p-8 rounded-lg shadow-sm border text-black">
        <h2 className="text-2xl font-semibold mb-2">Wedding Planner Personal Details</h2>
        <p className="text-gray-500 mb-8">
          This is for internal data, customers won't see this.
        </p>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="personal-number" className="block text-sm font-medium text-gray-700 mb-1">
                Personal number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="personal-number"
                value={personalNumber}
                onChange={(e) => setPersonalNumber(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Wedding Planner Business Details */}
      <div className="bg-white p-8 rounded-lg shadow-sm border text-black">
        <h2 className="text-2xl font-semibold mb-2">Wedding Planner Business Details</h2>
        <p className="text-gray-500 mb-8">
          Customers will see these details on Attirelly.
        </p>
        <div className="space-y-6">
          
          <div>
            <label htmlFor="agencyName" className="block text-sm font-medium text-gray-700 mb-1">
              Agency name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="agencyName"
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Whatsapp number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="whatsappNumber"
              value={whatsappNumber}
              onChange={(e) => {
                setWhatsappNumber(e.target.value);
                setSameAsPersonal(false); // Uncheck if user manually types
              }}
              disabled={sameAsPersonal} // Disable if checkbox is checked
              className="w-full px-4 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
            />
            
            {/* Checkbox for "Same as personal number" */}
            <div className="flex items-center mt-2">
              <input
                id="sameAsPersonal"
                type="checkbox"
                checked={sameAsPersonal}
                onChange={(e) => setSameAsPersonal(e.target.checked)}
                className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
              />
              <label htmlFor="sameAsPersonal" className="ml-2 block text-sm text-gray-900">
                Same as personal number
              </label>
            </div>
          </div>

          {/* Barter Collaboration Accepted or Not */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Barter collaboration accepted or not? <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setBarterAccepted(true)}
                className={`flex-1 p-4 border rounded-lg text-center transition-all duration-200 ${
                  barterAccepted === true ? 'border-black bg-gray-50' : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                Yes
              </button>
              <button
                onClick={() => setBarterAccepted(false)}
                className={`flex-1 p-4 border rounded-lg text-center transition-all duration-200 ${
                  barterAccepted === false ? 'border-black bg-gray-50' : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                No
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Section 3: Location */}
      <div className="bg-white p-8 rounded-lg shadow-sm border text-black">
        <h2 className="text-2xl font-semibold mb-2">Location</h2>
        <p className="text-gray-500 mb-8">
          This helps us connect you with local clients.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <select
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="" disabled hidden>Select a city</option>
              <option value="Delhi">Delhi</option>
              <option value="Mumbai">Mumbai</option>
            </select>
          </div>
          <div>
            <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
              Area <span className="text-red-500">*</span>
            </label>
            <select
              id="area"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="" disabled hidden>Select an area</option>
              <option value="South Delhi">South Delhi</option>
              <option value="Bandra">Bandra</option>
            </select>
          </div>
          <div>
            <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
              Pincode <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
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
          Next →
        </button>
      </div>
    </div>
  );
}