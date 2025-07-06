// stores/useProductFormStore.ts
import { api } from "@/lib/axios";
import { transformPayload } from "@/utils/convert";
import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useSellerStore } from "@/store/sellerStore";

// types/productForm.ts
export interface Option {
  id: string;
  name: string;
}

export interface VariantValue {
  sku: string;
  size: SizeOption;
  color: ColorOption;
  // quantity: number;
}

export interface Variants {
  variants: VariantValue[];
}

export interface Brand {
  brand_id: string;
  name: string;
  logo_url?: string;
}

export interface Store {
  id: string;
  name: string;
}

export interface Category {
  category_id: string;
  name: string;
}

export interface CategoryLevels {
  level1?: Category;
  level2?: Category;
  level3?: Category;
  level4?: Category;
  // level5?: Category;
}

export interface Pricing {
  mrp?: number;
  rent?: boolean;
  price?: number;
  discount?: number;
}

export interface VariantImage {
  sku: string;
  images: string[]; // image url array
}
export interface Media {
  mainImage?: string[];
  variantImages?: VariantImage[];
}

export interface KeyDetails {
  productName?: string;
  productDescription?: string;
  brand?: Brand;
  store?: Store;
  title?: string;
}
export interface AttributeValue {
  attribute_id?: string;
  name?: string;
  value?: string;
}
export interface Attributes {
  attributes?: AttributeValue[];
}

export interface ColorOption {
  color_id: string;
  color_name: string;
  hex_code: string;
}
export interface Colors {
  colors: ColorOption[];
}
export interface SizeOption {
  size_id: string;
  size_name: string;
}
export interface Sizes {
  sizes: SizeOption[];
}

export interface FormData {
  product_id?: string;
  keyDetails?: KeyDetails;
  variants?: Variants;
  attributes?: Attributes;
  category?: CategoryLevels;
  pricing?: Pricing;
  media?: Media;
  sizes?: Sizes;
  colors?: Colors;
}

interface ProductFormStore {
  isLoading?: boolean;
  currentStep: number;
  formData: FormData;
  draftId: string | null;
  stepValidations: Record<number, boolean>;
  actions: {
    setCurrentStep: (step: number) => void;
    updateFormData: (section: keyof FormData, data: any) => void;
    saveDraft: () => Promise<void>;
    loadDraft: () => Promise<number | null>;
    clearDraft: () => void;
    submitForm: () => Promise<void>;
    updateForm: () => Promise<void>;
    setStepValidation: (step: number, isValid: boolean) => void;
    setLoading: (loading: boolean) => void;
    deleteDraft: () => Promise<void>;
  };
}

export const useProductFormStore = create<ProductFormStore>()(
  // persist(
  (set, get) => ({
    isLoading: false,
    currentStep: 0,
    formData: {},
    draftId: null,
    stepValidations: {},
    actions: {
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
      updateForm: async () => {
        const { formData } = get();
        const storeId = useSellerStore.getState().storeId;
        console.log("Updating form with storeId:", storeId);
        const storeName = useSellerStore.getState().storeNameString;
        console.log(useSellerStore.getState().storeNameString);
        const apiPayload = transformPayload(
          formData,
          // "d013b10b-af22-407d-aa32-eec4d6e1bb50",
          storeId,
          storeName
          // "Aman G"
        );
        try {
          await api.put(`/products/${formData.product_id}`, apiPayload);
          // Ensure toast is called after the async operation
          setTimeout(() => {
            toast.success("Product updated successfully!");
          }, 0);
        } catch (error) {
          setTimeout(() => {
            toast.error("Failed to update product.");
          }, 0);
        }
      },
      setStepValidation: (step: number, isValid: boolean) =>
        set((state) => ({
          stepValidations: {
            ...state.stepValidations,
            [step]: isValid,
          },
        })),
      setCurrentStep: (step) => set({ currentStep: step }),
      updateFormData: (section, data) =>
        set((state) => ({
          formData: {
            ...state.formData,
            [section]:
              typeof state.formData[section] === "object" &&
                state.formData[section] !== null
                ? { ...state.formData[section], ...data }
                : data,
          },
        })),
      saveDraft: async () => {
        const { formData, currentStep } = get();
        try {
          const response = await api.post("/product_draft", {
            data: formData,
            current_step: currentStep,
          });

          setTimeout(() => {
            toast.success("Draft saved successfully!");
          }, 0);
        } catch (error) {
          console.log("Error in saving draft");
        }
      },
      loadDraft: async () => {
        try {
          const response = await api.get("/product_draft");
          if (response.data) {
            const { data, current_step } = response.data;

            const { updateFormData, setCurrentStep } = get().actions;

            updateFormData("keyDetails", data.keyDetails);
            updateFormData("category", data.category);
            updateFormData("attributes", data.attributes);
            updateFormData("pricing", data.pricing);
            updateFormData("variants", data.variants);
            updateFormData("media", data.media);

            // setCurrentStep(current_step);
             return current_step;
          }
        } catch (error) {
          // console.error("Error in loading draft:", error);
          // toast.error("Failed to load draft.");
        }
      },
      deleteDraft: async () => {
        try {
          const res = await api.delete('/product_draft/');
          console.log("Draft deleted response:", res);
          if (res.status === 200) {
            set({
              currentStep: 0,
              formData: {},
              draftId: null,
              // Reset step validations
              stepValidations: {},
            });
            toast.success("Draft deleted successfully!");
          }
          else {
            toast.error("Failed to delete draft.");
          }
        } catch {
          toast.error("Something went wrong while deleting the draft.");
        }
      },

      clearDraft: () => {
        set({
          currentStep: 0,
          formData: {},
          draftId: null,
        });
      },
      submitForm: async () => {
        const { formData } = get();
        const storeId = useSellerStore.getState().storeId;
        const storeName = useSellerStore.getState().storeNameString || "Default Store";
        const apiPayload = transformPayload(
          formData,
          // "d013b10b-af22-407d-aa32-eec4d6e1bb50",
          storeId,
          storeName
          // "Aman G"
        );
        console.log("apiPayload", apiPayload);
        try {
          const response = await api.post("/products/", apiPayload);
          console.log("Submission successful:", response.data);
          const res = await api.delete('/product_draft/');
          // Clear the form after successful submission
          set({
            currentStep: 0,
            formData: {},
            draftId: null,
            // Reset step validations
            stepValidations: {},
          });
          // Toast or notification can be added here
          toast.success("Product submitted successfully!");

          
        } catch (error) {
          console.error("Submission error:", error);
          throw error;
        }
      },
    },
  }),
  //   {
  //     name: "product-form-store",
  //     partialize: (state) => ({
  //       ...state,
  //       actions: undefined,
  //     }),
  //   }
  // )
);

// Selector hooks for better usage
export const useCurrentStep = () =>
  useProductFormStore((state) => state.currentStep);
export const useFormData = () => useProductFormStore((state) => state.formData);
export const useStepValidations = () =>
  useProductFormStore((state) => state.stepValidations);
export const useFormActions = () =>
  useProductFormStore((state) => state.actions);
export const useIsLoading = () =>
  useProductFormStore((state) => state.isLoading);
