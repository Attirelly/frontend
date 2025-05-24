// components/DraftControls.tsx
"use client";
import { useProductFormStore } from '@/store/product_upload_store';
import { useState } from 'react';
import { toast } from 'sonner'; // or your preferred toast library

export default function DraftControls() {
  const [isSaving, setIsSaving] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  
  // Zustand store state
  const draftId = useProductFormStore((state) => state.draftId);
  const { saveDraft, clearDraft } = useProductFormStore((state) => state.actions);
  const hasData = useProductFormStore((state) => 
    Object.values(state.formData).some(section => Object.keys(section).length > 0
  ))

  const handleSave = async () => {
    if (!hasData) {
      toast.warning('No data to save');
      return;
    }

    setIsSaving(true);
    try {
      const savedDraftId = await saveDraft();
      const saveTime = new Date().toLocaleTimeString();
      setLastSaved(saveTime);
      toast.success(`Draft saved successfully (${savedDraftId.slice(-4)})`);
    } catch (error) {
      console.error('Failed to save draft:', error);
      toast.error('Failed to save draft');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClear = async () => {
    setIsClearing(true);
    try {
      await clearDraft();
      setLastSaved(null);
      toast.info('Draft cleared successfully');
    } catch (error) {
      console.error('Failed to clear draft:', error);
      toast.error('Failed to clear draft');
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="mb-6 space-y-2">
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={isSaving || !hasData}
          className={`px-3 py-1.5 text-sm rounded transition-colors ${
            isSaving 
              ? 'bg-gray-200 text-gray-500' 
              : hasData 
                ? 'bg-blue-100 hover:bg-blue-200 text-blue-800' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isSaving ? (
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
              Saving...
            </span>
          ) : 'Save Draft'}
        </button>

        <button
          onClick={handleClear}
          disabled={isClearing || !draftId}
          className={`px-3 py-1.5 text-sm rounded transition-colors ${
            isClearing
              ? 'bg-gray-200 text-gray-500'
              : draftId
                ? 'bg-red-100 hover:bg-red-200 text-red-800'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isClearing ? 'Clearing...' : 'Clear Draft'}
        </button>
      </div>

      {lastSaved && (
        <p className="text-xs text-gray-500">
          {draftId ? `Draft #${draftId.slice(-4)}` : 'New draft'} • Saved {lastSaved}
        </p>
      )}
    </div>
  );
}