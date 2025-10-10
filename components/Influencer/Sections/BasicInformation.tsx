'use client';

import { useState, forwardRef, useImperativeHandle } from 'react';

interface ComponentProps {
  onNext: () => void;
  isLastStep?: boolean;
}

const genderOptions = ['Male', 'Female', 'Other'];
const ageRangeOptions = ['<18', '18–24', '25–29', '30-34', '35–44', '45+'];
const languageOptions = [
  'English', 'Hindi', 'Punjabi', 'Tamil', 'Telugu', 
  'Kannada', 'Malayalam', 'Bengali', 'Marathi', 'Gujarati', 
  'Odia', 'Assamese', 'Urdu', 'Bhojpuri', 'Haryanvi'
];

const BasicInformation = forwardRef(({ onNext, isLastStep }: ComponentProps, ref) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [internalPhone, setInternalPhone] = useState('');
  const [publicPhone, setPublicPhone] = useState('');
  const [gender, setGender] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [language, setLanguage] = useState('');

  useImperativeHandle(ref, () => ({
    getData: () => ({
      full_name: fullName,
      email: email,
      internal_phone: internalPhone,
      public_phone: publicPhone,
      gender: gender,
      age_range: ageRange,
      language_spoken: language,
    }),
  }));

  // MODIFIED: handleNext now includes validation
  const handleNext = () => {
    // Check if any mandatory field is empty
    if (!fullName || !email || !internalPhone || !gender || !ageRange || !language) {
      alert('Please fill out all mandatory fields marked with an asterisk (*).');
      return; // Stop the function if validation fails
    }
    // If validation passes, proceed to the next section
    onNext();
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border animate-fade-in text-black">
      <h2 className="text-2xl font-semibold mb-2">Basic Information</h2>
      <p className="text-gray-500 mb-8">Enter your personal and contact details.</p>

      <div className="space-y-6">
        {/* Full Name */}
        <div>
          <label htmlFor="full-name" className="block text-sm font-medium text-gray-700">Full Name <span className="text-red-500">*</span></label>
          <p className="text-xs text-gray-500 mb-1">Name that should appear on collaborations and platforms</p>
          <input type="text" id="full-name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
        </div>

        {/* Email & Internal Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address <span className="text-red-500">*</span></label>
            <p className="text-xs text-gray-500 mb-1">Primary email for brand communication.</p>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label htmlFor="internal-phone" className="block text-sm font-medium text-gray-700">Phone Number (Internal Only) <span className="text-red-500">*</span></label>
            <p className="text-xs text-gray-500 mb-1">For internal communication only, not visible to brands</p>
            <input type="tel" id="internal-phone" value={internalPhone} onChange={(e) => setInternalPhone(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>
        </div>

        {/* Public Phone (Marked as Optional) */}
        <div>
            <label htmlFor="public-phone" className="block text-sm font-medium text-gray-700">Phone Number (Self/Manager/Agency) (Optional)</label>
            <p className="text-xs text-gray-500 mb-1">Visible to brands</p>
            <input type="tel" id="public-phone" value={publicPhone} onChange={(e) => setPublicPhone(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
        </div>
        
        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender <span className="text-red-500">*</span></label>
          <div className="flex gap-4">
            {genderOptions.map((option) => (
              <button
                key={option}
                onClick={() => setGender(option)}
                className={`flex-1 p-3 border rounded-lg text-center transition-all duration-200 ${
                  gender === option ? 'border-black bg-gray-50 font-semibold' : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Age Range & Language Spoken */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="age-range" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth <span className="text-red-500">*</span></label>
            <select id="age-range" value={ageRange} onChange={(e) => setAgeRange(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md">
              <option value="" disabled>Select an age range</option>
              {ageRangeOptions.map(option => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">Language Spoken <span className="text-red-500">*</span></label>
            <select id="language" value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md">
              <option value="" disabled>Select a language</option>
              {languageOptions.map(option => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Navigation Button */}
      <div className="flex justify-end mt-12 pt-6 border-t">
        <button
          onClick={handleNext}
          className="px-8 py-3 bg-black text-white rounded-md font-semibold"
        >
          {isLastStep ? 'Submit' : 'Next →'}
        </button>
      </div>
    </div>
  );
});

export default BasicInformation;