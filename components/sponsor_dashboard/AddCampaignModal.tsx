import React, { useState, useEffect } from 'react';

const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
};

// --- 1. PROP CHANGE: Accept props for editing ---
export default function AddCampaignModal({ open, onClose, onCreate, onUpdate, campaignToEdit }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("keyword");
  const [values, setValues] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errors, setErrors] = useState({});

  // --- 2. LOGIC CHANGE: Determine if in "edit mode" ---
  const isEditMode = Boolean(campaignToEdit);

  // --- 3. NEW LOGIC: Pre-fill form when modal opens in edit mode ---
  useEffect(() => {
    if (open && isEditMode) {
      // Prefill data from the campaign object
      setName(campaignToEdit.name);
      setType(campaignToEdit.targeting_type);
      setValues(campaignToEdit.targeting_value.join(", "));
      // Format dates correctly for the input[type=date]
      setStartDate(campaignToEdit.start_date.split('T')[0]);
      setEndDate(campaignToEdit.end_date.split('T')[0]);
    } else {
      // Reset form to default values for "create" mode
      setName("");
      setType("keyword");
      setValues("");
      setStartDate("");
      setEndDate("");
      setErrors({});
    }
  }, [open, campaignToEdit, isEditMode]);


  // --- 4. LOGIC CHANGE: Handle submit for both create and update ---
  function handleSubmit() {
    // ... (validation logic is unchanged)
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Campaign name is required.";
    if (!values.trim() && type !== "auto") newErrors.values = "Targeting value is required.";
    if (!startDate) newErrors.startDate = "Start date is required.";
    if (!endDate) newErrors.endDate = "End date is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      name,
      targeting_type: type,
      targeting_value: type === "keyword" ? values.split(",").map(s => s.trim()).filter(Boolean) : [values],
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div
        className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b">
          {/* --- 5. UI CHANGE: Dynamic heading --- */}
          <h3 className="text-xl font-semibold text-gray-800">
            {isEditMode ? 'Update Campaign' : 'Create New Campaign'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full">
            {/* ... (close icon svg) */}
          </button>
        </div>

        <div className="p-6 space-y-6 bg-gray-50">
            {/* --- (All form inputs are the same) --- */}
            <div>
              <label htmlFor="campaignName" className="block text-sm font-medium text-gray-700">Campaign Name *</label>
              <input id="campaignName" value={name} onChange={(e) => setName(e.target.value)}
                className={`mt-1 block w-full border rounded-md px-3 py-2 ${errors.name ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>
            {/* ... other form fields ... */}
        </div>

        <div className="flex justify-end gap-3 p-4 bg-gray-100 border-t">
          <button onClick={onClose} className="px-5 py-2 border bg-white text-gray-800 rounded-md text-sm">
            Cancel
          </button>
          {/* --- 6. UI CHANGE: Dynamic button text --- */}
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-gray-800 text-white rounded-md text-sm font-medium hover:bg-gray-700"
          >
            {isEditMode ? 'Update Campaign' : 'Create Campaign'}
          </button>
        </div>
      </div>
    </div>
  );
}