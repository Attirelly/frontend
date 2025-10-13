'use client';

import { useState, forwardRef, useImperativeHandle } from 'react';

interface ComponentProps {
  onNext: () => void;
  isLastStep?: boolean;
}

// Options for the fields
const collaborationPartners = ['Designers', 'Boutiques', 'Stylists', 'Influencers', 'Photographers', 'MUAs'];
const collaborationTypes = ['Barter', 'Paid', 'Co-created Shoots', 'Pop-up Events', 'Referral Program'];
const commissionModels = ['Flat per referral (₹500–₹3,000)', '% on sale (5–10%)', 'Both'];
const barterOptions = ['Yes', 'No', 'Depends'];
const monthlyCollabOptions = ['1–3', '4–10', '10+'];

const CollaborationPreferences = forwardRef(({ onNext, isLastStep }: ComponentProps, ref) => {
  // State for all form fields
  const [interestedCollaborations, setInterestedCollaborations] = useState<string[]>([]);
  const [preferredCollabTypes, setPreferredCollabTypes] = useState<string[]>([]);
  const [commissionModel, setCommissionModel] = useState('');
  const [barterAcceptance, setBarterAcceptance] = useState<string | null>(null);
  const [monthlyCollabs, setMonthlyCollabs] = useState('');

  // Expose data to the parent component
  useImperativeHandle(ref, () => ({
    getData: () => ({
      interested_in_collaborations_with: interestedCollaborations,
      preferred_collaboration_type: preferredCollabTypes,
      preferred_commission_model: commissionModel,
      barter_acceptance: barterAcceptance,
      monthly_collaborations_open_to: monthlyCollabs,
    }),
  }));

  // Validation logic for mandatory fields
  const handleNext = () => {
    if (interestedCollaborations.length === 0 || preferredCollabTypes.length === 0 || !commissionModel || !monthlyCollabs) {
      alert('Please fill out all mandatory fields.');
      return;
    }
    onNext();
  };

  const handleToggle = (option: string, state: string[], setState: React.Dispatch<React.SetStateAction<string[]>>) => {
    setState(prev => prev.includes(option) ? prev.filter(item => item !== option) : [...prev, option]);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border animate-fade-in text-black">
      <h2 className="text-2xl font-semibold mb-2">Collaboration Preferences</h2>
      <p className="text-gray-500 mb-8">Define how you'd like to collaborate with partners on Attirelly.</p>

      <div className="space-y-6">
        {/* Interested in Collaborations With */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Interested in Collaborations With <span className="text-red-500">*</span></label>
          <div className="flex flex-wrap">
            {collaborationPartners.map(o => <button key={o} onClick={() => handleToggle(o, interestedCollaborations, setInterestedCollaborations)} className={`m-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${interestedCollaborations.includes(o) ? 'bg-black text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>{o}</button>)}
          </div>
        </div>

        {/* Preferred Collaboration Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Collaboration Type <span className="text-red-500">*</span></label>
          <div className="flex flex-wrap">
            {collaborationTypes.map(o => <button key={o} onClick={() => handleToggle(o, preferredCollabTypes, setPreferredCollabTypes)} className={`m-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${preferredCollabTypes.includes(o) ? 'bg-black text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>{o}</button>)}
          </div>
        </div>
        
        {/* Commission Model & Monthly Collabs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="commission-model" className="block text-sm font-medium text-gray-700 mb-1">Preferred Commission Model <span className="text-red-500">*</span></label>
                <select id="commission-model" value={commissionModel} onChange={(e) => setCommissionModel(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md">
                    <option value="" disabled>Select a model</option>
                    {commissionModels.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="monthly-collabs" className="block text-sm font-medium text-gray-700 mb-1">Average Monthly Collaborations <span className="text-red-500">*</span></label>
                <select id="monthly-collabs" value={monthlyCollabs} onChange={(e) => setMonthlyCollabs(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md">
                    <option value="" disabled>Select a number</option>
                    {monthlyCollabOptions.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
            </div>
        </div>

        {/* Barter Acceptance */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Barter Acceptance (Optional)</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {barterOptions.map((option) => (
              <button
                key={option}
                onClick={() => setBarterAcceptance(option)}
                className={`p-3 border rounded-lg text-center transition-all duration-200 ${
                  barterAcceptance === option ? 'border-black bg-gray-50 font-semibold' : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
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

export default CollaborationPreferences;