'use client';

import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { useWeddingPlannerStore } from '@/store/weddingPlannerStore';

interface ComponentProps {
  onNext: () => void;
}

export default function WeddingPlannerDetails({ onNext }: ComponentProps) {

  const {basicInformation, updateBasicInformation} = useWeddingPlannerStore();
  // --- 1. Personal Details State ---
  const [personalNumber, setPersonalNumber] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  // --- 2. Business Details State ---
  const [agencyName, setAgencyName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [sameAsPersonal, setSameAsPersonal] = useState(false);
  const [barterAccepted, setBarterAccepted] = useState<boolean | null>(null);

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
      barterAccepted === null
    ) {
      alert('All fields marked with an asterisk are mandatory. Please fill them out to continue.');
      return;
    }

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
                value={basicInformation.internalPhone}
                onChange={(e) => updateBasicInformation({ internalPhone: e.target.value })}
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
                value={basicInformation.email}
                onChange={(e) => updateBasicInformation({ email: e.target.value })}
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
              value={basicInformation.fullName}
              onChange={(e) => updateBasicInformation({ fullName: e.target.value })}
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
              value={basicInformation.businessName}
              onChange={(e) => updateBasicInformation({ businessName: e.target.value })}
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
              value={basicInformation.whatsappPhone}
              onChange={(e) => {
                updateBasicInformation({ whatsappPhone: e.target.value });
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
    </div>
  );
}