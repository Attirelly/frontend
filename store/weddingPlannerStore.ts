import { create } from "zustand";

// ================== TYPES ===================

// Section 1: Basic Information
export type BasicInformation = {
  fullName: string;
  businessName: string;
  email: string;
  internalPhone: string;
  whatsappPhone: string;
  publicPhone: string;
};

// Section 2: Business Profile & Scale
export type BusinessProfile = {
  clientPersona: string | null;
  weddingAestheticStyles: string[];
  baseLocation: string;
  primaryCities: string[];
  averageWeddingBudget: string | null;
  weddingsManagedLastYear: string | null;
  averageGuestSize: string | null;
  yearsOfExperience: string | null;
  teamSize: string | null;
};

// Section 3: Influence & Network
export type InfluenceNetwork = {
  clientAcquisationMethods: string[];
  assistsWithOutfits: boolean;
  recommendsDesigners: boolean;
  partnerDesigners: string[];
  bridesGuidedPerYear: string | null;
  collaboratesWithStylistsMuas: boolean;
  recommendedFashionCategories: string[];
  partnerVendorHandles: Record<string, string>; // For JSON object { "decorator": "@handle" }
  referralPotential: string | null;
};

// Section 4: Collaboration Preferences
export type CollaborationPreferences = {
  interestedInCollaborationsWith: string[];
  preferredCollaborationType: string[];
  preferredCommissionModel: string | null;
  barterAcceptance: "Yes" | "No" | "Depends" | null;
  monthlyCollaborationsOpenTo: string | null;
};

// Section 5: Social Links & Insights
export type SocialLinks = {
  instagramUrl: string;
  youtubeLink: string;
  websiteUrl: string;
  facebookLink: string;
  totalFollowers: string;
  totalPosts: string;
  engagementRate: string;
  averageStoryViews: string;
  averageReelViews: string;
};

// --- Published State ---
export type InstagramInsights = {
    totalFollowers: string | null;
    totalPosts: string | null;
    engagementRate: string | null;
    averageStoryViews: string | null;
    averageReelViews: string | null;
}

// --- Section Key Type ---
export type WeddingPlannerSectionKey =
  | "basicInformation"
  | "businessProfile"
  | "influenceNetwork"
  | "collaborationPreferences"
  | "socialLinks"
  | "instaInsights";

// --- Zustand Store Type ---
export type WeddingPlannerOnboardingState = {
  plannerId: string;
  plannerNumber: string;
  basicInformation: BasicInformation;
  businessProfile: BusinessProfile;
  influenceNetwork: InfluenceNetwork;
  collaborationPreferences: CollaborationPreferences;
  socialLinks: SocialLinks;
  instaInsights: InstagramInsights;

  activeSection: WeddingPlannerSectionKey;
  isSubmitting: boolean;

  // --- Actions ---
  setActiveSection: (section: WeddingPlannerSectionKey) => void;
  setIsSubmitting: (submitting: boolean) => void;
  setPlannerId: (id: string) => void;
  setPlannerNumber: (number: string) => void;

  updateBasicInformation: (data: Partial<BasicInformation>) => void;
  updateBusinessProfile: (data: Partial<BusinessProfile>) => void;
  updateInfluenceNetwork: (data: Partial<InfluenceNetwork>) => void;
  updateCollaborationPreferences: (
    data: Partial<CollaborationPreferences>
  ) => void;
  updateSocialLinks: (data: Partial<SocialLinks>) => void;
  updateInstaInsights: (data: Partial<InstagramInsights>) => void;

  resetStore: () => void;
};

// ================== INITIAL STATE ===================
const initialState: Omit<
  WeddingPlannerOnboardingState,
  | "setPlannerId"
  | "setPlannerNumber"
  | "setActiveSection"
  | "setIsSubmitting"
  | "updateBasicInformation"
  | "updateBusinessProfile"
  | "updateInfluenceNetwork"
  | "updateCollaborationPreferences"
  | "updateSocialLinks"
  | "updateInstaInsights"
  | "resetStore"
> = {
  plannerId: "",
  plannerNumber: "",
  basicInformation: {
    fullName: "",
    businessName: "",
    email: "",
    internalPhone: "",
    whatsappPhone: "",
    publicPhone: "",
  },
  businessProfile: {
    clientPersona: null,
    weddingAestheticStyles: [],
    baseLocation: "",
    primaryCities: [],
    averageWeddingBudget: null,
    weddingsManagedLastYear: null,
    averageGuestSize: null,
    yearsOfExperience: null,
    teamSize: null,
  },
  influenceNetwork: {
    clientAcquisationMethods: [],
    assistsWithOutfits: false,
    recommendsDesigners: false,
    partnerDesigners: [],
    bridesGuidedPerYear: null,
    collaboratesWithStylistsMuas: false,
    recommendedFashionCategories: [],
    partnerVendorHandles: {},
    referralPotential: null,
  },
  collaborationPreferences: {
    interestedInCollaborationsWith: [],
    preferredCollaborationType: [],
    preferredCommissionModel: null,
    barterAcceptance: "Depends",
    monthlyCollaborationsOpenTo: null,
  },
  socialLinks: {
    instagramUrl: "",
    youtubeLink: "",
    websiteUrl: "",
    facebookLink: "",
    totalFollowers: "",
    totalPosts: "",
    engagementRate: "",
    averageStoryViews: "",
    averageReelViews: "",
  },
  instaInsights: {
      totalFollowers: null,
      totalPosts: null,
      engagementRate: null,
      averageStoryViews: null,
      averageReelViews: null,
  },
  activeSection: "basicInformation",
  isSubmitting: false,
};

// ================== STORE ===================
export const useWeddingPlannerStore = create<WeddingPlannerOnboardingState>((set) => ({
  ...initialState,
  setPlannerId: (id) => set({ plannerId: id }),
  setPlannerNumber: (number) => set({ plannerNumber: number }),

  setActiveSection: (section) => set({ activeSection: section }),
  setIsSubmitting: (submitting) => set({ isSubmitting: submitting }),

  updateBasicInformation: (data) =>
    set((state) => ({
      basicInformation: { ...state.basicInformation, ...data },
    })),
  updateBusinessProfile: (data) =>
    set((state) => ({ businessProfile: { ...state.businessProfile, ...data } })),
  updateInfluenceNetwork: (data) =>
    set((state) => ({
      influenceNetwork: { ...state.influenceNetwork, ...data },
    })),
  updateCollaborationPreferences: (data) =>
    set((state) => ({
      collaborationPreferences: { ...state.collaborationPreferences, ...data },
    })),
  updateSocialLinks: (data) =>
    set((state) => ({ socialLinks: { ...state.socialLinks, ...data } })),

  updateInstaInsights: (data) => 
    set((state) => ({ instaInsights: { ...state.instaInsights, ...data } })),

  resetStore: () => set(initialState),
}));