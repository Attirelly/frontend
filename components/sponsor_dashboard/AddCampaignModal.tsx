import React, { useState, useEffect } from 'react';
import CategorySelect from './CategorySelector';
import StoreSelect from './StoreSelect'; // Import the new StoreSelect component

const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
};

export default function AddCampaignModal({ open, onClose, onCreate, onUpdate, campaignToEdit }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("keyword");
  const [values, setValues] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errors, setErrors] = useState({});

  const isEditMode = Boolean(campaignToEdit);

  // Effect to pre-fill or reset the form
  useEffect(() => {
    if (open && isEditMode) {
      setName(campaignToEdit.name || "");
      setType(campaignToEdit.targeting_type || "keyword");
      setValues(campaignToEdit.targeting_value ? campaignToEdit.targeting_value.join(", ") : "");
      setStartDate(campaignToEdit.start_date ? campaignToEdit.start_date.split('T')[0] : "");
      setEndDate(campaignToEdit.end_date ? campaignToEdit.end_date.split('T')[0] : "");
      setErrors({});
    } else if (open && !isEditMode) {
      setName("");
      setType("keyword");
      setValues("");
      setStartDate("");
      setEndDate("");
      setErrors({});
    }
  }, [open, campaignToEdit, isEditMode]);

  // Effect to clear targeting values when type changes
  useEffect(() => {
    setValues("");
    setErrors(prev => ({...prev, values: undefined}));
  }, [type]);
  
  function handleSubmit() {
    // Validation logic
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Campaign name is required.";
    if (!values.trim()) newErrors.values = "Targeting value is required.";
    if (!startDate) newErrors.startDate = "Start date is required.";
    if (!endDate) newErrors.endDate = "End date is required.";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Updated payload creation to handle the 'store' type
    const getTargetingValue = () => {
        if (type === 'keyword') {
            return values.split(",").map(s => s.trim()).filter(Boolean);
        }
        // Grouped logic for category and store as they both use a single ID
        if (type === 'category' || type === 'store') {
            return values ? [values] : [];
        }
        return [];
    }

    const payload = {
      name: name.trim(),
      targeting_type: type,
      targeting_value: getTargetingValue(),
      start_date: startDate,
      end_date: endDate,
    };

    if (isEditMode) {
      onUpdate(campaignToEdit.campaign_id, payload);
    } else {
      onCreate({ ...payload, status: "active" });
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60" onClick={onClose}>
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800">{isEditMode ? 'Update Campaign' : 'Create New Campaign'}</h3>
            <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 bg-gray-50">
            <div>
                <label htmlFor="campaignName" className="block text-sm font-medium text-gray-700">Campaign Name *</label>
                <input id="campaignName" value={name} onChange={(e) => setName(e.target.value)} className={`mt-1 block w-full border rounded-md px-3 py-2 text-sm shadow-sm ${errors.name ? 'border-red-500' : 'border-gray-300'}`} />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="targetingType" className="block text-sm font-medium text-gray-700">Targeting Type</label>
                    <select id="targetingType" value={type} onChange={(e) => setType(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm bg-white">
                        <option value="keyword">Keyword</option>
                        <option value="category">Category</option>
                        <option value="store">Store</option>
                    </select>
                </div>

                <div>
                  <label htmlFor="targetingValue" className="block text-sm font-medium text-gray-700">Targeting Value *</label>
                  {type === 'category' ? (
                      <CategorySelect
                          value={values}
                          onChange={(categoryId) => setValues(categoryId)}
                          error={!!errors.values}
                      />
                  ) : type === 'store' ? (
                      <StoreSelect
                          value={values}
                          onChange={(storeId) => setValues(storeId)}
                          error={!!errors.values}
                      />
                  ) : (
                      <input 
                          id="targetingValue"
                          value={values} 
                          onChange={(e) => setValues(e.target.value)} 
                          placeholder={"e.g., shoes, running"} 
                          className={`mt-1 block w-full border rounded-md px-3 py-2 text-sm ${errors.values ? 'border-red-500' : 'border-gray-300'}`} 
                      />
                  )}
                  {errors.values && <p className="mt-1 text-xs text-red-600">{errors.values}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date *</label>
                    <input id="startDate" type="date" min={isEditMode ? undefined : getTodayString()} value={startDate} onChange={(e) => setStartDate(e.target.value)} className={`mt-1 block w-full border rounded-md px-3 py-2 text-sm shadow-sm ${errors.startDate ? 'border-red-500' : 'border-gray-300'}`} />
                    {errors.startDate && <p className="mt-1 text-xs text-red-600">{errors.startDate}</p>}
                </div>
                <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date *</label>
                    <input id="endDate" type="date" min={startDate || getTodayString()} value={endDate} onChange={(e) => setEndDate(e.target.value)} disabled={!startDate} className={`mt-1 block w-full border rounded-md px-3 py-2 text-sm shadow-sm ${errors.endDate ? 'border-red-500' : 'border-gray-300'} disabled:bg-gray-100`} />
                    {errors.endDate && <p className="mt-1 text-xs text-red-600">{errors.endDate}</p>}
                </div>
            </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-3 p-4 bg-gray-100 border-t border-gray-200 rounded-b-lg">
            <button onClick={onClose} className="px-5 py-2 border border-gray-300 bg-white text-gray-800 rounded-md text-sm font-medium hover:bg-gray-100">Cancel</button>
            <button onClick={handleSubmit} className="px-5 py-2 bg-gray-800 text-white rounded-md text-sm font-medium hover:bg-gray-700">
                {isEditMode ? 'Update Campaign' : 'Create Campaign'}
            </button>
        </div>
      </div>
    </div>
  );
}