"use client";
import { useProductFormStore } from "@/store/product_upload_store";
import { useState } from "react";
import { toast } from "sonner";

/**
 * A component that provides UI controls for saving and clearing a product form draft.
 *
 * This component interacts with the global `useProductFormStore` to perform draft-related
 * actions. It provides visual feedback to the user regarding the state of these actions,

 * such as showing loading indicators and success/error notifications (toasts).
 *
 * ### State Management
 * - **Local State (`useState`)**: Manages UI-specific states like `isSaving` and `isClearing` to
 * provide immediate feedback and disable buttons during operations. The `lastSaved` state
 * is used to display the timestamp of the last successful save.
 * - **Global State (`useProductFormStore`)**:
 * - It subscribes to `draftId` to know if a saved draft exists, which determines if the "Clear Draft" button should be enabled.
 * - It derives a `hasData` boolean to check if there is any data in the form to save.
 * - It calls the `saveDraft` and `clearDraft` actions from the store to perform the core logic.
 *
 * ### User Feedback
 * - **Toast Notifications**: Uses the `sonner` library to provide non-intrusive feedback (toasts) for success, warning, or error messages.
 * - **Loading Indicators**: Displays text and spinner animations within the buttons during async operations.
 * - **Conditional Disabling**: Buttons are intelligently disabled based on the application state (e.g., "Save Draft" is disabled if there's no data; "Clear Draft" is disabled if no draft exists).
 *
 * @returns {JSX.Element} A set of buttons and status text for managing drafts.
 * @see {@link https://docs.pmnd.rs/zustand/getting-started/introduction | Zustand Documentation}
 * @see {@link https://sonner.emilkowal.ski/ | Sonner (Toast Notifications)}
 */

export default function DraftControls() {
  const [isSaving, setIsSaving] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Zustand store state
  const draftId = useProductFormStore((state) => state.draftId);
  const { saveDraft, clearDraft } = useProductFormStore(
    (state) => state.actions
  );
  const hasData = useProductFormStore((state) =>
    Object.values(state.formData).some(
      (section) => Object.keys(section).length > 0
    )
  );

  /**
   * Handles the 'Save Draft' button click.
   * It performs a check for data, calls the async save action from the store,
   * and provides user feedback via toasts and loading states.
   */
  const handleSave = async () => {
    if (!hasData) {
      toast.warning("No data to save");
      return;
    }

    setIsSaving(true);
    try {
      const savedDraftId = await saveDraft();
      const saveTime = new Date().toLocaleTimeString();
      setLastSaved(saveTime);
      toast.success(`Draft saved successfully (${savedDraftId.slice(-4)})`);
    } catch (error) {
      console.error("Failed to save draft:", error);
      toast.error("Failed to save draft");
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Handles the 'Clear Draft' button click.
   * It calls the async clear action from the store and provides user feedback.
   */
  const handleClear = async () => {
    setIsClearing(true);
    try {
      await clearDraft();
      setLastSaved(null);
      toast.info("Draft cleared successfully");
    } catch (error) {
      console.error("Failed to clear draft:", error);
      toast.error("Failed to clear draft");
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="mb-6 space-y-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
      {/* Responsive button container */}
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={handleSave}
          disabled={isSaving || !hasData}
          className={`w-full sm:w-auto px-3 py-1.5 text-xs sm:text-sm rounded transition-colors ${
            isSaving
              ? "bg-gray-200 text-gray-500"
              : hasData
              ? "bg-blue-100 hover:bg-blue-200 text-blue-800"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isSaving ? (
            <span className="flex items-center justify-center gap-1">
              <span className="inline-block w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
              Saving...
            </span>
          ) : (
            "Save Draft"
          )}
        </button>

        <button
          onClick={handleClear}
          disabled={isClearing || !draftId}
          className={`w-full sm:w-auto px-3 py-1.5 text-xs sm:text-sm rounded transition-colors ${
            isClearing
              ? "bg-gray-200 text-gray-500"
              : draftId
              ? "bg-red-100 hover:bg-red-200 text-red-800"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isClearing ? "Clearing..." : "Clear Draft"}
        </button>
      </div>

      {lastSaved && (
        <p className="text-xs text-gray-500 pt-2">
          {draftId ? `Draft #${draftId.slice(-4)}` : "New draft"} • Saved{" "}
          {lastSaved}
        </p>
      )}
    </div>
  );
}
