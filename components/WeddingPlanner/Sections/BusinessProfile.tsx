'use client';

import { useWeddingPlannerStore } from '@/store/weddingPlannerStore';
import { useState, forwardRef, useImperativeHandle } from 'react';

interface ComponentProps {
  onNext: () => void;
  isLastStep?: boolean;
}

// Options for dropdowns and multi-selects
const personaOptions : string[] = ['Budget-Conscious', 'Luxury-Oriented', 'Trend-Driven', 'NRI/Destination', 'Other'];
const aestheticOptions: string[] = ['Royal', 'Glam', 'Minimal', 'Rustic', 'Boho', 'Traditional', 'Modern', 'South Indian', 'Fusion'];
const cityOptions: string[] = ['Delhi', 'Jaipur', 'Chandigarh', 'Udaipur', 'Lucknow', 'Goa', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai'];
const budgetOptions: string[] = ['₹3–10L', '₹10–50L', '₹50L–₹1Cr', '₹1Cr+'];
const weddingsManagedOptions: string[] = ['1–5', '6–15', '16–30', '30+'];
const guestSizeOptions: string[] = ['<100', '100–300', '300–700', '700+'];
const experienceOptions: string[] = ['<1 yr', '1–3 yrs', '3–5 yrs', '5–10 yrs', '10+ yrs'];
const teamSizeOptions: string[] = ['Solo', '2–5', '6–10', '10–20', '20–30', '30+'];


const BusinessProfile = forwardRef(({ onNext, isLastStep }: ComponentProps, ref) => {

  const {businessProfile, updateBusinessProfile} = useWeddingPlannerStore();

  // Expose data to the parent component
  // useImperativeHandle(ref, () => ({
  //   getData: () => ({
  //     client_persona: clientPersona,
  //     wedding_aesthetic_styles: aestheticStyles,
  //     base_location: baseLocation,
  //     primary_cities: primaryCities,
  //     average_wedding_budget: avgBudget,
  //     weddings_managed_last_year: weddingsManaged,
  //     average_guest_size: avgGuestSize,
  //     years_of_experience: experience,
  //     team_size: teamSize,
  //   }),
  // }));

  // // Validation logic for mandatory fields
  // const handleNext = () => {
  //   if (!clientPersona || aestheticStyles.length === 0 || !baseLocation || primaryCities.length === 0 || !avgBudget || !weddingsManaged || !avgGuestSize || !experience || !teamSize) {
  //     alert('Please fill out all mandatory fields.');
  //     return;
  //   }
  //   onNext();
  // };

  const handleAestheticToggle = (option: string) => {
    const currentStyles = businessProfile.weddingAestheticStyles;
    const newStyles = currentStyles.includes(option)
      ? currentStyles.filter(item => item !== option) // Remove item
      : [...currentStyles, option]; // Add item
    
    updateBusinessProfile({ weddingAestheticStyles: newStyles });
  };


  const handleCityToggle = (option: string) => {
    const currentCities = businessProfile.primaryCities;
    const newCities = currentCities.includes(option)
      ? currentCities.filter(item => item !== option) // Remove item
      : [...currentCities, option]; // Add item
    
    updateBusinessProfile({ primaryCities: newCities });
  };

  // Handler for multi-select buttons
  const handleToggle = (option: string, state: string[], setState: React.Dispatch<React.SetStateAction<string[]>>) => {
    setState(prev => prev.includes(option) ? prev.filter(item => item !== option) : [...prev, option]);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border animate-fade-in text-black">
      <h2 className="text-2xl font-semibold mb-2">Business Profile & Scale</h2>
      <p className="text-gray-500 mb-8">Help us understand your business, style, and scale of operations.</p>

      <div className="space-y-6">
        {/* Client Persona & Base Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="client-persona" className="block text-sm font-medium text-gray-700 mb-1">Client Persona <span className="text-red-500">*</span></label>
            <select id="client-persona" value={businessProfile.clientPersona ?? ''} onChange={(e) => updateBusinessProfile({ clientPersona: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-md">
              <option value="" disabled>Select a persona</option>
              {personaOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="base-location" className="block text-sm font-medium text-gray-700 mb-1">City/Base Location <span className="text-red-500">*</span></label>
            <input type="text" id="base-location" value={businessProfile.baseLocation ?? ''} onChange={(e) => updateBusinessProfile({ baseLocation: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>
        </div>
        
        {/* Wedding Aesthetic Style */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Wedding Aesthetic Style <span className="text-red-500">*</span></label>
          <div className="flex flex-wrap">
            {aestheticOptions.map(option => (
              <button key={option} onClick={() => handleAestheticToggle(option)}
                className={`m-1 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${businessProfile.weddingAestheticStyles.includes(option) ? 'bg-black text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Cities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cities you frequently handle weddings in <span className="text-red-500">*</span></label>
          <div className="flex flex-wrap">
            {cityOptions.map(option => (
              <button key={option} onClick={() => handleCityToggle(option)} // Use new handler
                className={`m-1 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${businessProfile.primaryCities.includes(option) ? 'bg-black text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
                {option}
              </button>
            ))}
          </div>
        </div>
        
        {/* Budget, Weddings Managed, Guest Size */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="avg-budget" className="block text-sm font-medium text-gray-700 mb-1">Average Wedding Budget <span className="text-red-500">*</span></label>
            <select id="avg-budget" value={businessProfile.averageWeddingBudget ?? ''} onChange={(e) => updateBusinessProfile({ averageWeddingBudget: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-md">
              <option value="" disabled>Select a range</option>
              {budgetOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="weddings-managed" className="block text-sm font-medium text-gray-700 mb-1">Weddings Managed (Past 12 Months) <span className="text-red-500">*</span></label>
            <select id="weddings-managed" value={businessProfile.weddingsManagedLastYear ?? ''} onChange={(e) => updateBusinessProfile({ weddingsManagedLastYear: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-md">
              <option value="" disabled>Select a number</option>
              {weddingsManagedOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="avg-guest-size" className="block text-sm font-medium text-gray-700 mb-1">Average Guest Size <span className="text-red-500">*</span></label>
            <select id="avg-guest-size" value={businessProfile.averageGuestSize ?? ''} onChange={(e) => updateBusinessProfile({ averageGuestSize: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-md">
              <option value="" disabled>Select a size</option>
              {guestSizeOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>

        {/* Experience and Team Size */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">Years of Experience <span className="text-red-500">*</span></label>
            <select id="experience" value={businessProfile.yearsOfExperience ?? ''} onChange={(e) => updateBusinessProfile({ yearsOfExperience: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-md">
              <option value="" disabled>Select years</option>
              {experienceOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="team-size" className="block text-sm font-medium text-gray-700 mb-1">Team Size <span className="text-red-500">*</span></label>
            <select id="team-size" value={businessProfile.teamSize ?? ''} onChange={(e) => updateBusinessProfile({ teamSize: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-md">
              <option value="" disabled>Select team size</option>
              {teamSizeOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Navigation Button */}
      {/* <div className="flex justify-end mt-12 pt-6 border-t">
        <button
          onClick={handleNext}
          className="px-8 py-3 bg-black text-white rounded-md font-semibold"
        >
          {isLastStep ? 'Submit' : 'Next →'}
        </button>
      </div> */}
    </div>
  );
});

export default BusinessProfile;