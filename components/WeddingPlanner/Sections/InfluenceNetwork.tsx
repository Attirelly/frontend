'use client';

import { forwardRef, useImperativeHandle, KeyboardEvent, useState } from 'react';
import { X } from 'lucide-react';
import { useWeddingPlannerStore } from '@/store/weddingPlannerStore'; // Import your store

interface ComponentProps {
  onNext: () => void;
  isLastStep?: boolean;
}

// Options
const acquisitionOptions = ['Instagram', 'Word of Mouth', 'Vendors', 'Influencers', 'Wedding Portals'];
const designerOptions = ['Sabyasachi', 'Manish Malhotra', 'Tarun Tahiliani', 'Anita Dongre', 'Gaurav Gupta'];
const bridesGuidedOptions = ['1–5', '6–10', '11–20', '20+'];
const categoryOptions = ['Bridal Wear', 'Groom Wear', 'Ethnic Co-ords', 'Jewelry', 'Footwear'];
const referralOptions = ['Low', 'Medium', 'High'];

// Reusable Tag component (no change)
const Tag = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
  <span className="flex items-center bg-gray-200 text-gray-800 text-sm font-medium mr-2 mb-2 px-2.5 py-1 rounded-md">
    {label}
    <button onClick={onRemove} className="ml-1.5 text-gray-500 hover:text-gray-800">
      <X size={14} />
    </button>
  </span>
);

const InfluenceNetwork = forwardRef(({ onNext, isLastStep }: ComponentProps, ref) => {
  // Get state and updater from Zustand
  const { influenceNetwork, updateInfluenceNetwork } = useWeddingPlannerStore();

  // Local state for the temporary tag input ONLY
  const [currentVendorHandle, setCurrentVendorHandle] = useState('');

  // Expose data to the parent component (reads from Zustand)
  useImperativeHandle(ref, () => ({
    getData: () => ({
      client_acquisation_methods: influenceNetwork.clientAcquisationMethods,
      assists_with_outfits: influenceNetwork.assistsWithOutfits,
      recommends_designers: influenceNetwork.recommendsDesigners,
      partner_designers: influenceNetwork.partnerDesigners,
      brides_guided_per_year: influenceNetwork.bridesGuidedPerYear,
      collaborates_with_stylists_muas: influenceNetwork.collaboratesWithStylistsMuas,
      recommended_fashion_categories: influenceNetwork.recommendedFashionCategories,
      partner_vendor_handles: influenceNetwork.partnerVendorHandles,
      referral_potential: influenceNetwork.referralPotential,
    }),
  }));

  // Validation logic (reads from Zustand)
  const handleNext = () => {
    const {
      clientAcquisationMethods,
      assistsWithOutfits,
      recommendsDesigners,
      partnerDesigners,
      bridesGuidedPerYear,
      collaboratesWithStylistsMuas,
      recommendedFashionCategories,
      referralPotential
    } = influenceNetwork;

    if (
      clientAcquisationMethods.length === 0 ||
      assistsWithOutfits === null ||
      recommendsDesigners === null ||
      partnerDesigners.length === 0 ||
      !bridesGuidedPerYear ||
      collaboratesWithStylistsMuas === null ||
      recommendedFashionCategories.length === 0 ||
      !referralPotential
    ) {
      alert('Please fill out all mandatory fields.');
      return;
    }
    onNext();
  };

  // --- SPECIFIC TOGGLE HANDLERS ---
  const handleAcquisitionToggle = (option: string) => {
    const current = influenceNetwork.clientAcquisationMethods;
    const newArr = current.includes(option) ? current.filter(item => item !== option) : [...current, option];
    updateInfluenceNetwork({ clientAcquisationMethods: newArr });
  };
  
  const handleDesignerToggle = (option: string) => {
    const current = influenceNetwork.partnerDesigners;
    const newArr = current.includes(option) ? current.filter(item => item !== option) : [...current, option];
    updateInfluenceNetwork({ partnerDesigners: newArr });
  };
  
  const handleCategoryToggle = (option: string) => {
    const current = influenceNetwork.recommendedFashionCategories;
    const newArr = current.includes(option) ? current.filter(item => item !== option) : [...current, option];
    updateInfluenceNetwork({ recommendedFashionCategories: newArr });
  };
  
  // --- VENDOR HANDLE HANDLERS (for Record<string, string>) ---
  const handleVendorKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentVendorHandle.trim() !== '') {
      e.preventDefault();
      const newHandle = currentVendorHandle.trim();
      const currentRecord = influenceNetwork.partnerVendorHandles;
      
      if (!currentRecord[newHandle]) { // Check if key exists
        const newRecord = { ...currentRecord, [newHandle]: newHandle }; // Add, using handle as key and value
        updateInfluenceNetwork({ partnerVendorHandles: newRecord });
      }
      setCurrentVendorHandle('');
    }
  };
  
  const removeVendorHandle = (handleKeyToRemove: string) => {
    const newRecord = { ...influenceNetwork.partnerVendorHandles }; // Copy
    delete newRecord[handleKeyToRemove]; // Remove by key
    updateInfluenceNetwork({ partnerVendorHandles: newRecord });
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm animate-fade-in text-black">
      <h2 className="text-2xl font-semibold mb-2">Influence & Network</h2>
      <p className="text-gray-500 mb-8">Tell us about your client sources and professional network.</p>

      <div className="space-y-6">
        {/* Client Acquisition */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">How Do You Usually Get Clients? <span className="text-red-500">*</span></label>
          <div className="flex flex-wrap">
            {acquisitionOptions.map(o => (
              <button 
                key={o} 
                onClick={() => handleAcquisitionToggle(o)} 
                className={`m-1 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  influenceNetwork.clientAcquisationMethods.includes(o) ? 'bg-black text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}>
                {o}
              </button>
            ))}
          </div>
        </div>

        {/* Yes/No Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assist Brides/Grooms with Fashion? <span className="text-red-500">*</span></label>
                <div className="flex gap-4">
                    <button onClick={() => updateInfluenceNetwork({ assistsWithOutfits: true })} className={`flex-1 p-3 border rounded-lg text-center transition-all ${influenceNetwork.assistsWithOutfits === true ? 'border-black bg-gray-50 font-semibold' : 'border-gray-200 bg-white hover:border-gray-300'}`}>Yes</button>
                    <button onClick={() => updateInfluenceNetwork({ assistsWithOutfits: false })} className={`flex-1 p-3 border rounded-lg text-center transition-all ${influenceNetwork.assistsWithOutfits === false ? 'border-black bg-gray-50 font-semibold' : 'border-gray-200 bg-white hover:border-gray-300'}`}>No</button>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recommend Boutiques / Designers? <span className="text-red-500">*</span></label>
                <div className="flex gap-4">
                    <button onClick={() => updateInfluenceNetwork({ recommendsDesigners: true })} className={`flex-1 p-3 border rounded-lg text-center transition-all ${influenceNetwork.recommendsDesigners === true ? 'border-black bg-gray-50 font-semibold' : 'border-gray-200 bg-white hover:border-gray-300'}`}>Yes</button>
                    <button onClick={() => updateInfluenceNetwork({ recommendsDesigners: false })} className={`flex-1 p-3 border rounded-lg text-center transition-all ${influenceNetwork.recommendsDesigners === false ? 'border-black bg-gray-50 font-semibold' : 'border-gray-200 bg-white hover:border-gray-300'}`}>No</button>
                </div>
            </div>
        </div>
        
        {/* Designers You Work With */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Designers / Boutiques You Already Work With <span className="text-red-500">*</span></label>
          <div className="flex flex-wrap">
            {designerOptions.map(o => (
              <button 
                key={o} 
                onClick={() => handleDesignerToggle(o)} 
                className={`m-1 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  influenceNetwork.partnerDesigners.includes(o) ? 'bg-black text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}>
                {o}
              </button>
            ))}
          </div>
        </div>

        {/* Brides Guided & Collaborate with Stylists */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="brides-guided" className="block text-sm font-medium text-gray-700 mb-1">Average # of Brides You Guide Per Year <span className="text-red-500">*</span></label>
                <select 
                  id="brides-guided" 
                  value={influenceNetwork.bridesGuidedPerYear ?? ''} 
                  onChange={(e) => updateInfluenceNetwork({ bridesGuidedPerYear: e.target.value })} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md">
                    <option value="" disabled>Select a number</option>
                    {bridesGuidedOptions.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Collaborate with Stylists and MUAs? <span className="text-red-500">*</span></label>
                <div className="flex gap-4">
                    <button onClick={() => updateInfluenceNetwork({ collaboratesWithStylistsMuas: true })} className={`flex-1 py-2 border rounded-md text-center transition-all ${influenceNetwork.collaboratesWithStylistsMuas === true ? 'border-black bg-gray-50 font-semibold' : 'border-gray-200 bg-white hover:border-gray-300'}`}>Yes</button>
                    <button onClick={() => updateInfluenceNetwork({ collaboratesWithStylistsMuas: false })} className={`flex-1 py-2 border rounded-md text-center transition-all ${influenceNetwork.collaboratesWithStylistsMuas === false ? 'border-black bg-gray-50 font-semibold' : 'border-gray-200 bg-white hover:border-gray-300'}`}>No</button>
                </div>
            </div>
        </div>

        {/* Fashion Categories */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fashion Categories You Recommend Most <span className="text-red-500">*</span></label>
          <div className="flex flex-wrap">
            {categoryOptions.map(o => (
              <button 
                key={o} 
                onClick={() => handleCategoryToggle(o)} 
                className={`m-1 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  influenceNetwork.recommendedFashionCategories.includes(o) ? 'bg-black text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}>
                {o}
              </button>
            ))}
          </div>
        </div>
        
        {/* Partner Vendor Handles */}
        <div>
          <label htmlFor="vendor-handles" className="block text-sm font-medium text-gray-700 mb-1">Instagram Handles of Partner Vendors (Optional)</label>
          <div className="w-full flex flex-wrap items-center p-2 border border-gray-300 rounded-md">
            {Object.entries(influenceNetwork.partnerVendorHandles).map(([key, value]) => (
              <Tag key={key} label={value} onRemove={() => removeVendorHandle(key)} />
            ))}
            <input 
              type="text" 
              id="vendor-handles" 
              value={currentVendorHandle} 
              onChange={(e) => setCurrentVendorHandle(e.target.value)} 
              onKeyDown={handleVendorKeyDown} 
              className="flex-grow p-1 outline-none bg-transparent" 
              placeholder="Type handle and press Enter..."/>
          </div>
        </div>

        {/* Referral Potential */}
        <div>
            <label htmlFor="referral-potential" className="block text-sm font-medium text-gray-700 mb-1">Potential to Refer Brides & Grooms to Attirelly <span className="text-red-500">*</span></label>
            <select 
              id="referral-potential" 
              value={influenceNetwork.referralPotential ?? ''} 
              onChange={(e) => updateInfluenceNetwork({ referralPotential: e.target.value })} 
              className="w-full px-4 py-2 border border-gray-300 rounded-md">
                <option value="" disabled>Select potential</option>
                {referralOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
        </div>
      </div>

      {/* <div className="flex justify-end mt-12 pt-6 border-t">
        <button onClick={handleNext} className="px-8 py-3 bg-black text-white rounded-md font-semibold">
          {isLastStep ? 'Submit' : 'Next →'}
        </button>
      </div> */}
    </div>
  );
});

export default InfluenceNetwork;