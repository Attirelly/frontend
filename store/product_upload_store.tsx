// stores/useProductFormStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type FormData = {
  keyDetails?: Record<string, any>;
  attributes?: Record<string, any>;
  category?: Record<string, any>;
  pricing?: Record<string, any>;
  variants?: Record<string, any>;
  media?: Record<string, any>;
};

interface ProductFormStore {
  currentStep: number;
  formData: FormData;
  draftId: string | null;
  actions: {
    setCurrentStep: (step: number) => void;
    updateFormData: (section: keyof FormData, data: any) => void;
    saveDraft: () => Promise<string>;
    loadDraft: (draftId: string) => void;
    clearDraft: () => void;
    submitForm: () => Promise<void>;
  };
}

export const useProductFormStore = create<ProductFormStore>()(
  persist(
    (set, get) => ({
      currentStep: 0,
      formData: {},
      draftId: null,
      actions: {
        setCurrentStep: (step) => set({ currentStep: step }),
        updateFormData: (section, data) => 
          set((state) => ({
            formData: {
              ...state.formData,
              [section]: { ...state.formData[section], ...data }
            }
          })),
        saveDraft: async () => {
          const draftId = get().draftId || `draft_${Date.now()}`;
          set({ draftId });
          
          // In production: await API call to save draft
          // await fetch('/api/drafts', {
          //   method: 'POST',
          //   body: JSON.stringify(get())
          // });
          
          return draftId;
        },
        loadDraft: (draftId) => {
          // In production: Load from API
          // const response = await fetch(`/api/drafts/${draftId}`);
          // const data = await response.json();
          // set(data);
          
          set({ draftId });
        },
        clearDraft: () => {
          set({
            currentStep: 0,
            formData: {},
            draftId: null
          });
        },
        submitForm: async () => {
          const { formData, draftId } = get();
          // Submit to your API
          // await fetch('/api/products', {
          //   method: 'POST',
          //   body: JSON.stringify(formData)
          // });
          console.log('Form submitted:', formData);
        }
      }
    }),
    {
      name: 'product-form-store',
      partialize: (state) => ({ 
        ...state,
        // Don't persist actions
        actions: undefined 
      }),
    }
  )
);

// Selector hooks for better usage
export const useCurrentStep = () => useProductFormStore((state) => state.currentStep);
export const useFormData = () => useProductFormStore((state) => state.formData);
export const useFormActions = () => useProductFormStore((state) => state.actions);