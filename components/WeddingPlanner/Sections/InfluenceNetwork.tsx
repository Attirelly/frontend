'use client';

import { useState, forwardRef, useImperativeHandle, KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface ComponentProps {
  onNext: () => void;
  isLastStep?: boolean;
}

// Options for dropdowns and multi-selects
const acquisitionOptions = ['Instagram', 'Word of Mouth', 'Vendors', 'Influencers', 'Wedding Portals'];
const designerOptions = ['Sabyasachi', 'Manish Malhotra', 'Tarun Tahiliani', 'Anita Dongre', 'Gaurav Gupta'];
const bridesGuidedOptions = ['1–5', '6–10', '11–20', '20+'];
const categoryOptions = ['Bridal Wear', 'Groom Wear', 'Ethnic Co-ords', 'Jewelry', 'Footwear'];
const referralOptions = ['Low', 'Medium', 'High'];

// A reusable UI component for displaying tags for the vendor handles
const Tag = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
  <span className="flex items-center bg-gray-200 text-gray-800 text-sm font-medium mr-2 mb-2 px-2.5 py-1 rounded-md">
    {label}
    <button onClick={onRemove} className="ml-1.5 text-gray-500 hover:text-gray-800">
      <X size={14} />
    </button>
  </span>
);

const InfluenceNetwork = forwardRef(({ onNext, isLastStep }: ComponentProps, ref) => {
  // State for all form fields
  const [acquisitionMethods, setAcquisitionMethods] = useState<string[]>([]);
  const [assistsWithOutfits, setAssistsWithOutfits] = useState<boolean | null>(null);
  const [recommendsDesigners, setRecommendsDesigners] = useState<boolean | null>(null);
  const [partnerDesigners, setPartnerDesigners] = useState<string[]>([]);
  const [bridesGuidedPerYear, setBridesGuidedPerYear] = useState('');
  const [collaboratesWithStylists, setCollaboratesWithStylists] = useState<boolean | null>(null);
  const [recommendedCategories, setRecommendedCategories] = useState<string[]>([]);
  const [vendorHandles, setVendorHandles] = useState<string[]>([]);
  const [currentVendorHandle, setCurrentVendorHandle] = useState('');
  const [referralPotential, setReferralPotential] = useState('');

  // Expose data to the parent component
  useImperativeHandle(ref, () => ({
    getData: () => ({
      client_acquisition_methods: acquisitionMethods,
      assists_with_outfits: assistsWithOutfits,
      recommends_designers: recommendsDesigners,
      partner_designers: partnerDesigners,
      brides_guided_per_year: bridesGuidedPerYear,
      collaborates_with_stylists_muas: collaboratesWithStylists,
      recommended_fashion_categories: recommendedCategories,
      partner_vendor_handles: vendorHandles,
      referral_potential: referralPotential,
    }),
  }));

  // Validation logic
  const handleNext = () => {
    if (acquisitionMethods.length === 0 || assistsWithOutfits === null || recommendsDesigners === null || partnerDesigners.length === 0 || !bridesGuidedPerYear || collaboratesWithStylists === null || recommendedCategories.length === 0 || !referralPotential) {
      alert('Please fill out all mandatory fields.');
      return;
    }
    onNext();
  };

  const handleToggle = (option: string, state: string[], setState: React.Dispatch<React.SetStateAction<string[]>>) => {
    setState(prev => prev.includes(option) ? prev.filter(item => item !== option) : [...prev, option]);
  };
  
  const handleVendorKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentVendorHandle.trim() !== '') {
      e.preventDefault();
      const newHandle = currentVendorHandle.trim();
      if (!vendorHandles.includes(newHandle)) {
        setVendorHandles([...vendorHandles, newHandle]);
      }
      setCurrentVendorHandle('');
    }
  };
  
  const removeVendorHandle = (handleToRemove: string) => {
    setVendorHandles(vendorHandles.filter(handle => handle !== handleToRemove));
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border animate-fade-in text-black">
      <h2 className="text-2xl font-semibold mb-2">Influence & Network</h2>
      <p className="text-gray-500 mb-8">Tell us about your client sources and professional network.</p>

      <div className="space-y-6">
        {/* Client Acquisition */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">How Do You Usually Get Clients? <span className="text-red-500">*</span></label>
          <div className="flex flex-wrap">
            {acquisitionOptions.map(o => <button key={o} onClick={() => handleToggle(o, acquisitionMethods, setAcquisitionMethods)} className={`m-1 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${acquisitionMethods.includes(o) ? 'bg-black text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>{o}</button>)}
          </div>
        </div>

        {/* Yes/No Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assist Brides/Grooms with Fashion? <span className="text-red-500">*</span></label>
                <div className="flex gap-4"><button onClick={() => setAssistsWithOutfits(true)} className={`flex-1 p-3 border rounded-lg text-center transition-all ${assistsWithOutfits === true ? 'border-black bg-gray-50 font-semibold' : 'border-gray-200 bg-white hover:border-gray-300'}`}>Yes</button><button onClick={() => setAssistsWithOutfits(false)} className={`flex-1 p-3 border rounded-lg text-center transition-all ${assistsWithOutfits === false ? 'border-black bg-gray-50 font-semibold' : 'border-gray-200 bg-white hover:border-gray-300'}`}>No</button></div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recommend Boutiques / Designers? <span className="text-red-500">*</span></label>
                <div className="flex gap-4"><button onClick={() => setRecommendsDesigners(true)} className={`flex-1 p-3 border rounded-lg text-center transition-all ${recommendsDesigners === true ? 'border-black bg-gray-50 font-semibold' : 'border-gray-200 bg-white hover:border-gray-300'}`}>Yes</button><button onClick={() => setRecommendsDesigners(false)} className={`flex-1 p-3 border rounded-lg text-center transition-all ${recommendsDesigners === false ? 'border-black bg-gray-50 font-semibold' : 'border-gray-200 bg-white hover:border-gray-300'}`}>No</button></div>
            </div>
        </div>
        
        {/* Designers You Work With */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Designers / Boutiques You Already Work With <span className="text-red-500">*</span></label>
          <div className="flex flex-wrap">
            {designerOptions.map(o => <button key={o} onClick={() => handleToggle(o, partnerDesigners, setPartnerDesigners)} className={`m-1 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${partnerDesigners.includes(o) ? 'bg-black text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>{o}</button>)}
          </div>
        </div>

        {/* Brides Guided & Collaborate with Stylists */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="brides-guided" className="block text-sm font-medium text-gray-700 mb-1">Average # of Brides You Guide Per Year <span className="text-red-500">*</span></label>
                <select id="brides-guided" value={bridesGuidedPerYear} onChange={(e) => setBridesGuidedPerYear(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md"><option value="" disabled>Select a number</option>{bridesGuidedOptions.map(o => <option key={o} value={o}>{o}</option>)}</select>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Collaborate with Stylists and MUAs? <span className="text-red-500">*</span></label>
                <div className="flex gap-4"><button onClick={() => setCollaboratesWithStylists(true)} className={`flex-1 py-2 border rounded-md text-center transition-all ${collaboratesWithStylists === true ? 'border-black bg-gray-50 font-semibold' : 'border-gray-200 bg-white hover:border-gray-300'}`}>Yes</button><button onClick={() => setCollaboratesWithStylists(false)} className={`flex-1 py-2 border rounded-md text-center transition-all ${collaboratesWithStylists === false ? 'border-black bg-gray-50 font-semibold' : 'border-gray-200 bg-white hover:border-gray-300'}`}>No</button></div>
            </div>
        </div>

        {/* Fashion Categories */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fashion Categories You Recommend Most <span className="text-red-500">*</span></label>
          <div className="flex flex-wrap">
            {categoryOptions.map(o => <button key={o} onClick={() => handleToggle(o, recommendedCategories, setRecommendedCategories)} className={`m-1 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${recommendedCategories.includes(o) ? 'bg-black text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>{o}</button>)}
          </div>
        </div>
        
        {/* Partner Vendor Handles */}
        <div>
          <label htmlFor="vendor-handles" className="block text-sm font-medium text-gray-700 mb-1">Instagram Handles of Partner Vendors (Optional)</label>
          <div className="w-full flex flex-wrap items-center p-2 border border-gray-300 rounded-md">
            {vendorHandles.map(handle => <Tag key={handle} label={handle} onRemove={() => removeVendorHandle(handle)} />)}
            <input type="text" id="vendor-handles" value={currentVendorHandle} onChange={(e) => setCurrentVendorHandle(e.target.value)} onKeyDown={handleVendorKeyDown} className="flex-grow p-1 outline-none bg-transparent" placeholder="Type handle and press Enter..."/>
          </div>
        </div>

        {/* Referral Potential */}
        <div>
            <label htmlFor="referral-potential" className="block text-sm font-medium text-gray-700 mb-1">Potential to Refer Brides & Grooms to Attirelly <span className="text-red-500">*</span></label>
            <select id="referral-potential" value={referralPotential} onChange={(e) => setReferralPotential(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md"><option value="" disabled>Select potential</option>{referralOptions.map(o => <option key={o} value={o}>{o}</option>)}</select>
        </div>
      </div>

      <div className="flex justify-end mt-12 pt-6 border-t">
        <button onClick={handleNext} className="px-8 py-3 bg-black text-white rounded-md font-semibold">
          {isLastStep ? 'Submit' : 'Next →'}
        </button>
      </div>
    </div>
  );
});

export default InfluenceNetwork;