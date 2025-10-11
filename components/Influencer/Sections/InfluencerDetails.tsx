// 'use client';

// import { useState } from 'react';
// import { Check } from 'lucide-react';

// interface ComponentProps {
//   onNext: () => void;
// }

// // Data for the "Following" dropdown
// const followingOptions = [
//   '<100k',
//   '>=100k and <500k',
//   '>=500k and < 1M',
//   '>= 1 M and <5M',
//   '>= 5M',
// ];

// // Data for the "Worked with brands" multi-select
// const brandOptions = [
//   'H&M',
//   'Zara',
//   'Myntra',
//   'Nykaa',
//   'Sephora',
//   'Mamaearth'
//   // 'Sugar Cosmetics',
//   // 'Puma',
//   // 'Adidas',
//   // 'Nike',
//   // 'Dior',
//   // 'Chanel'
// ];

// export default function InfluencerDetails({ onNext }: ComponentProps) {
//   const [personalNumber, setPersonalNumber] = useState('');
//   const [email, setEmail] = useState('');
//   const [influencerName, setInfluencerName] = useState('');
//   const [following, setFollowing] = useState('');
//   const [barterAccepted, setBarterAccepted] = useState<boolean | null>(null);
//   const [workedWithBrands, setWorkedWithBrands] = useState<string[]>([]);
//   const [city, setCity] = useState('');
//   const [area, setArea] = useState('');
//   const [pincode, setPincode] = useState('');

//   // Handle multi-select toggle for brands
//   const handleBrandToggle = (brand: string) => {
//     setWorkedWithBrands((prevBrands) => {
//       if (prevBrands.includes(brand)) {
//         return prevBrands.filter((b) => b !== brand);
//       } else {
//         return [...prevBrands, brand];
//       }
//     });
//   };

//   const handleNext = () => {
//     // Basic validation for all mandatory fields
//     if (
//       !personalNumber ||
//       !email ||
//       !influencerName ||
//       !following ||
//       barterAccepted === null ||
//       workedWithBrands.length === 0 ||
//       !city ||
//       !area ||
//       !pincode
//     ) {
//       alert('All fields marked with an asterisk are mandatory.');
//       return;
//     }
//     onNext();
//   };

//   return (
//     // Ensured the main wrapper is simple and relies on the parent's max-width
//     <div className="space-y-12"> 
      
//       {/* Section 1: Influencer Details */}
//       <div className="bg-white p-8 rounded-lg shadow-sm border text-black">
//         <h2 className="text-2xl font-semibold mb-2">Influencer Details</h2>
//         <p className="text-gray-500 mb-8">
//           This is for internal data, customers won't see this.
//         </p>
//         <div className="space-y-6">
//           {/* Using grid-cols-1 md:grid-cols-2 ensures responsiveness without pushing bounds on smaller screens */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> 
//             <div>
//               <label htmlFor="personal-number" className="block text-sm font-medium text-gray-700 mb-1">
//                 Influencer Personal Number <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="tel"
//                 id="personal-number"
//                 value={personalNumber}
//                 onChange={(e) => setPersonalNumber(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md"
//               />
//             </div>
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                 Email Address <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md"
//               />
//             </div>
//           </div>
          
//           <div>
//             <label htmlFor="influencer-name" className="block text-sm font-medium text-gray-700 mb-1">
//               Influencer name <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               id="influencer-name"
//               value={influencerName}
//               onChange={(e) => setInfluencerName(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md"
//             />
//           </div>
          
//           <div>
//             <label htmlFor="following" className="block text-sm font-medium text-gray-700 mb-1">
//               Following across platforms <span className="text-red-500">*</span>
//             </label>
//             <select
//               id="following"
//               value={following}
//               onChange={(e) => setFollowing(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md"
//             >
//               <option value="" disabled hidden>Select an option</option>
//               {followingOptions.map((option) => (
//                 <option key={option} value={option}>{option}</option>
//               ))}
//             </select>
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Open for barter collaboration accepted or not? <span className="text-red-500">*</span>
//             </label>
//             {/* The flex container for barter options */}
//             <div className="flex gap-4">
//               <button
//                 onClick={() => setBarterAccepted(true)}
//                 className={`flex-1 p-4 border rounded-lg text-center transition-all duration-200 ${
//                   barterAccepted === true ? 'border-black bg-gray-50' : 'border-gray-200 bg-white hover:border-gray-300'
//                 }`}
//               >
//                 Yes
//               </button>
//               <button
//                 onClick={() => setBarterAccepted(false)}
//                 className={`flex-1 p-4 border rounded-lg text-center transition-all duration-200 ${
//                   barterAccepted === false ? 'border-black bg-gray-50' : 'border-gray-200 bg-white hover:border-gray-300'
//                 }`}
//               >
//                 No
//               </button>
//             </div>
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Worked with brands <span className="text-red-500">*</span>
//             </label>
//             {/* FIX: Enclosing the buttons in a div with w-full ensures the wrapping 
//               is strictly limited by the parent's width, preventing overflow.
//               I've also changed the outer container class to w-full to be explicit.
//             */}
//             <div className="w-full p-2 border border-gray-300 rounded-md">
//               <div className="flex flex-wrap items-center">
//                 {brandOptions.map((brand) => (
//                   <button
//                     key={brand}
//                     onClick={() => handleBrandToggle(brand)}
//                     className={`m-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 
//                       ${workedWithBrands.includes(brand) ? 'bg-black text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
//                   >
//                     {brand}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Section 2: Location */}
//       <div className="bg-white p-8 rounded-lg shadow-sm border text-black">
//         <h2 className="text-2xl font-semibold mb-2">Location</h2>
//         <p className="text-gray-500 mb-8">
//           This helps us connect you with local brands.
//         </p>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
//               City <span className="text-red-500">*</span>
//             </label>
//             <select
//               id="city"
//               value={city}
//               onChange={(e) => setCity(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md"
//             >
//               <option value="" disabled hidden>Select a city</option>
//               <option value="Chandigarh">Chandigarh</option>
//               <option value="Delhi">Delhi</option>
//             </select>
//           </div>
//           <div>
//             <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
//               Area <span className="text-red-500">*</span>
//             </label>
//             <select
//               id="area"
//               value={area}
//               onChange={(e) => setArea(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md"
//             >
//               <option value="" disabled hidden>Select an area</option>
//               <option value="Sector 8">Sector 8</option>
//               <option value="Sector 17">Sector 17</option>
//             </select>
//           </div>
//           <div>
//             <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
//               Pincode <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               id="pincode"
//               value={pincode}
//               onChange={(e) => setPincode(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Navigation Button */}
//       <div className="flex justify-end pt-4">
//         <button
//           onClick={handleNext}
//           className="px-8 py-3 bg-black text-white rounded-md font-semibold hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
//         >
//           Next →
//         </button>
//       </div>
//     </div>
//   );
// }


// src/components/Influencer/Sections/InfluencerDetails.tsx

'use client';

import React from 'react';
import { useInfluencerStore } from '@/store/influencerStore'; // 👈 Correct path

interface ComponentProps {
  onNext: () => void;
}

// Data can be defined outside the component
const followingOptions = [
  '<100k',
  '>=100k and <500k',
  '>=500k and < 1M',
  '>= 1 M and <5M',
  '>= 5M',
];

const brandOptions = [
  'H&M', 'Zara', 'Myntra', 'Nykaa', 'Sephora', 'Mamaearth'
];

// ✨ Component is now a standard functional component
export default function InfluencerDetails({ onNext }: ComponentProps) {
  // ✨ Connect to multiple slices of the store and their updaters
  const {
    basicInformation,
    updateBasicInformation,
    collaborationPreferences,
    updateCollaborationPreferences,
    pastWork,
    updatePastWork,
    locationAndAvailability,
    updateLocationAndAvailability,
    // audienceInsights, // ⚠️ Uncomment after adding `followerRange` to your store
    // updateAudienceInsights,
  } = useInfluencerStore(state => ({
    basicInformation: state.basicInformation,
    updateBasicInformation: state.updateBasicInformation,
    collaborationPreferences: state.collaborationPreferences,
    updateCollaborationPreferences: state.updateCollaborationPreferences,
    pastWork: state.pastWork,
    updatePastWork: state.updatePastWork,
    locationAndAvailability: state.locationAndAvailability,
    updateLocationAndAvailability: state.updateLocationAndAvailability,
    // audienceInsights: state.audienceInsights, // ⚠️ Uncomment
    // updateAudienceInsights: state.updateAudienceInsights, // ⚠️ Uncomment
  }));

  // ✨ Handler now updates the store
  const handleBrandToggle = (brand: string) => {
    const currentBrands = pastWork.brandsWorkedWith;
    const newBrands = currentBrands.includes(brand)
      ? currentBrands.filter(b => b !== brand)
      : [...currentBrands, brand];
    updatePastWork({ brandsWorkedWith: newBrands });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    // ✨ Validation checks the global store state
    if (
      !basicInformation.phoneInternal ||
      !basicInformation.email ||
      !basicInformation.name ||
      // !audienceInsights.followerRange || // ⚠️ Uncomment
      !collaborationPreferences.openToBarter ||
      pastWork.brandsWorkedWith.length === 0 ||
      !locationAndAvailability.city ||
      !locationAndAvailability.area ||
      !locationAndAvailability.pincode
    ) {
      alert('All fields marked with an asterisk are mandatory.');
      return;
    }
    onNext();
  };

  return (
    <form onSubmit={handleNext} className="space-y-12">
      {/* Section 1: Influencer Details */}
      <div className="bg-white p-8 rounded-lg shadow-sm border text-black">
        <h2 className="text-2xl font-semibold mb-2">Influencer Details</h2>
        <p className="text-gray-500 mb-8">This is for internal data, customers won't see this.</p>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="personal-number" className="block text-sm font-medium text-gray-700 mb-1">
                Influencer Personal Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel" id="personal-number"
                value={basicInformation.phoneInternal}
                onChange={(e) => updateBasicInformation({ phoneInternal: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email" id="email"
                value={basicInformation.email}
                onChange={(e) => updateBasicInformation({ email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="influencer-name" className="block text-sm font-medium text-gray-700 mb-1">
              Influencer name <span className="text-red-500">*</span>
            </label>
            <input
              type="text" id="influencer-name"
              value={basicInformation.name}
              onChange={(e) => updateBasicInformation({ name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label htmlFor="following" className="block text-sm font-medium text-gray-700 mb-1">
              Following across platforms <span className="text-red-500">*</span>
            </label>
            {/* ⚠️ NOTE: This requires adding a `followerRange: string` property to your `AudienceInsights` type in the store. */}
            <select
              id="following"
              // value={audienceInsights.followerRange || ''} // ⚠️ Uncomment
              // onChange={(e) => updateAudienceInsights({ followerRange: e.target.value })} // ⚠️ Uncomment
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="" disabled hidden>Select an option</option>
              {followingOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Open for barter collaboration accepted or not? <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => updateCollaborationPreferences({ openToBarter: 'Yes' })}
                className={`flex-1 p-4 border rounded-lg text-center transition-all duration-200 ${
                  collaborationPreferences.openToBarter === 'Yes' ? 'border-black bg-gray-50' : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => updateCollaborationPreferences({ openToBarter: 'No' })}
                className={`flex-1 p-4 border rounded-lg text-center transition-all duration-200 ${
                  collaborationPreferences.openToBarter === 'No' ? 'border-black bg-gray-50' : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                No
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Worked with brands <span className="text-red-500">*</span>
            </label>
            <div className="w-full p-2 border border-gray-300 rounded-md">
              <div className="flex flex-wrap items-center">
                {brandOptions.map((brand) => (
                  <button
                    type="button"
                    key={brand}
                    onClick={() => handleBrandToggle(brand)}
                    className={`m-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 
                      ${pastWork.brandsWorkedWith.includes(brand) ? 'bg-black text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Location */}
      <div className="bg-white p-8 rounded-lg shadow-sm border text-black">
        <h2 className="text-2xl font-semibold mb-2">Location</h2>
        <p className="text-gray-500 mb-8">This helps us connect you with local brands.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <select
              id="city"
              value={locationAndAvailability.city}
              onChange={(e) => updateLocationAndAvailability({ city: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="" disabled hidden>Select a city</option>
              <option value="Chandigarh">Chandigarh</option>
              <option value="Delhi">Delhi</option>
            </select>
          </div>
          <div>
            <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
              Area <span className="text-red-500">*</span>
            </label>
            <select
              id="area"
              value={locationAndAvailability.area}
              onChange={(e) => updateLocationAndAvailability({ area: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="" disabled hidden>Select an area</option>
              <option value="Sector 8">Sector 8</option>
              <option value="Sector 17">Sector 17</option>
            </select>
          </div>
          <div>
            <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
              Pincode <span className="text-red-500">*</span>
            </label>
            <input
              type="text" id="pincode"
              value={locationAndAvailability.pincode}
              onChange={(e) => updateLocationAndAvailability({ pincode: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Navigation Button */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="px-8 py-3 bg-black text-white rounded-md font-semibold hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
        >
          Next →
        </button>
      </div>
    </form>
  );
}