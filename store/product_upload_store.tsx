// stores/useProductFormStore.ts
import { api } from "@/lib/axios";
import { transformPayload } from "@/utils/convert";
import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useSellerStore } from "@/store/sellerStore";

// types/productForm.ts
/** @description A generic option with an ID and a name. */
export interface Option {
  id: string;
  name: string;
}
/** @description A single product variant with its SKU, size, and color. */
export interface VariantValue {
  sku: string;
  size: SizeOption;
  color: ColorOption;
  // quantity: number;
}

/** @description The structure for the 'variants' slice of the form data. */
export interface Variants {
  variants: VariantValue[];
}

/** @description A product's brand information. */
export interface Brand {
  brand_id: string;
  name: string;
  logo_url?: string;
}

/** @description A store's basic information. */
export interface Store {
  id: string;
  name: string;
}

/** @description A single category level. */
export interface Category {
  category_id: string;
  name: string;
}
/** @description The complete, nested category selection. */
export interface CategoryLevels {
  level1?: Category;
  level2?: Category;
  level3?: Category;
  level4?: Category;
  // level5?: Category;
}

/** @description Product pricing details. */
export interface Pricing {
  mrp?: number;
  rent?: boolean;
  price?: number;
  discount?: number;
}

/** @description An image associated with a specific product variant SKU. */
export interface VariantImage {
  sku: string;
  images: string[]; // image url array
}

/** @description The complete media asset structure for a product. */
export interface Media {
  mainImage?: string[];
  variantImages?: VariantImage[];
}

/** @description Core product details like name and description. */
export interface KeyDetails {
  productName?: string;
  productDescription?: string;
  brand?: Brand;
  store?: Store;
  title?: string;
}

/** @description A selected attribute with its name and value. */
export interface AttributeValue {
  attribute_id?: string;
  name?: string;
  value?: string;
}

/** @description The structure for the 'attributes' slice of the form data. */
export interface Attributes {
  attributes?: AttributeValue[];
}

/** @description A single color option. */
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

/**
 * @interface FormData
 * @description Defines the complete, nested structure of the entire product upload form.
 */
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

/**
 * @interface ProductFormStore
 * @description Defines the complete shape of the Zustand store, including state and actions.
 */
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

/**
 * A Zustand store to manage the state of the multi-step product upload and update forms.
 *
 * This store is the single source of truth for the entire product creation/editing process.
 * It holds the form data, tracks the user's progress through the steps, manages the validation
 * status of each step, and provides actions for interacting with the backend API (saving drafts,
 * submitting, updating).
 *
 * ### API Endpoints
 * **`POST /product_draft`**: Saves the current `formData` and `currentStep` as a draft.
 * **`GET /product_draft`**: Loads the last saved draft for the user.
 * **`DELETE /product_draft`**: Deletes the user's saved draft.
 * **`POST /products/`**: Submits the final, transformed payload to create a new product.
 * **`PUT /products/:product_id`**: Submits the final, transformed payload to update an existing product.
 *
 * @see {@link https://docs.pmnd.rs/zustand/getting-started/introduction | Zustand Documentation}
 */
export const useProductFormStore = create<ProductFormStore>()((set, get) => ({
  /** The global loading state, used to show spinners during async operations like fetching drafts. */
  isLoading: false,
  /** The current step number the user is on in the multi-step form. */
  currentStep: 0,
  /** The main state object, holding all user-entered data, organized by form section. */
  formData: {},
  /** The ID of a saved draft, if one exists. */
  draftId: null,
  /** A record of the validation status (`true` or `false`) for each step. */
  stepValidations: {},
  /** An object containing all the actions that can be performed on the store. */
  actions: {
    /** Sets the global loading state. */
    setLoading: (loading: boolean) => {
      set({ isLoading: loading });
    },
    /** Submits the form data to update an existing product. */
    updateForm: async () => {
      const { formData } = get();
      const storeId = useSellerStore.getState().storeId;
      const storeName = useSellerStore.getState().storeNameString;
      // The `transformPayload` utility converts the form's state into the flat structure the API expects.
      const apiPayload = transformPayload(formData, storeId, storeName);
      try {
        await api.put(`/products/${formData.product_id}`, apiPayload);
        // Use a timeout to ensure the toast appears after the state update has settled.
        setTimeout(() => toast.success("Product updated successfully!"), 0);
      } catch (error) {
        setTimeout(() => toast.error("Failed to update product."), 0);
      }
    },
    /** Updates the validation status for a specific step. */
    setStepValidation: (step: number, isValid: boolean) =>
      set((state) => ({
        stepValidations: { ...state.stepValidations, [step]: isValid },
      })),
    /** Navigates the user to a specific step in the form. */
    setCurrentStep: (step) => set({ currentStep: step }),
    /** Updates a specific section (slice) of the form data. */
    updateFormData: (section, data) =>
      set((state) => ({
        formData: {
          ...state.formData,
          [section]:
            // Check if the existing data is an object to handle merging correctly.
            typeof state.formData[section] === "object" &&
            state.formData[section] !== null
              ? { ...state.formData[section], ...data }
              : data,
        },
      })),
    /** Saves the current form data and step number as a draft. */
    saveDraft: async () => {
      const { formData, currentStep } = get();
      try {
        const response = await api.post("/product_draft", {
          data: formData,
          current_step: currentStep,
        });
        set({ draftId: response.data.draft_id }); // Store the new draft ID.
        return response.data.draft_id;
      } catch (error) {
        toast.error("Failed to save draft.");
        throw error;
      }
    },
    /** Loads a previously saved draft and populates the form state. */
    loadDraft: async () => {
      try {
        const response = await api.get("/product_draft");
        if (response.data) {
          const { data, current_step, draft_id } = response.data;
          // Use the store's own actions to update its state.
          const { updateFormData } = get().actions;
          updateFormData("keyDetails", data.keyDetails);
          updateFormData("category", data.category);
          updateFormData("attributes", data.attributes);
          updateFormData("pricing", data.pricing);
          updateFormData("variants", data.variants);
          updateFormData("media", data.media);
          set({ draftId: draft_id });
          return current_step; // Return the step number to the calling component.
        }
      } catch (error) {
        console.error("No draft found or error loading draft:", error);
        return null;
      }
    },
    /** Deletes the user's draft from the backend and resets the form state. */
    deleteDraft: async () => {
      try {
        const res = await api.delete("/product_draft/");
        if (res.status === 200) {
          // Reset the entire store to its initial state.
          set({
            currentStep: 0,
            formData: {},
            draftId: null,
            stepValidations: {},
          });
          toast.success("Draft deleted successfully!");
        } else {
          toast.error("Failed to delete draft.");
        }
      } catch {
        toast.error("Something went wrong while deleting the draft.");
      }
    },
    /** Clears the draft from the local state without making an API call. */
    clearDraft: () => {
      set({ currentStep: 0, formData: {}, draftId: null });
    },
    /** Submits the form data to create a new product. */
    submitForm: async () => {
      const { formData } = get();
      const storeId = useSellerStore.getState().storeId;
      const storeName =
        useSellerStore.getState().storeNameString || "Default Store";
      const apiPayload = transformPayload(formData, storeId, storeName);
      try {
        await api.post("/products/", apiPayload);
        await api.delete("/product_draft/"); // Delete the draft after successful submission.
        // Reset the form state.
        set({
          currentStep: 0,
          formData: {},
          draftId: null,
          stepValidations: {},
        });
        toast.success("Product uploaded successfully!");
      } catch (error) {
        console.error("Submission error:", error);
        toast.error("Failed to upload product.");
        throw error;
      }
    },
  },
}));

// --- Selector Hooks ---
// These custom hooks provide a clean and optimized way for components to subscribe to specific
// parts of the store's state, preventing unnecessary re-renders.
export const useCurrentStep = () => useProductFormStore((state) => state.currentStep);
export const useFormData = () => useProductFormStore((state) => state.formData);
export const useStepValidations = () => useProductFormStore((state) => state.stepValidations);
export const useFormActions = () => useProductFormStore((state) => state.actions);
export const useIsLoading = () => useProductFormStore((state) => state.isLoading);