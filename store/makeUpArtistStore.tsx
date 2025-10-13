import { State, City, Area, Pincode } from "@/types/utilityTypes";
import { create } from "zustand";

// ================== TYPES ===================

// Section 1: Basic Information
export type BasicInformation = {
  name: string;
  email: string;
  phoneInternal: string;
  phonePublic: string;
  gender_id: string | null;
  experienceYears: number | null;
  languages: string[];
  shortBio: string;
};

// Section 2: Professional Details
export type ProfessionalDetails = {
  servicesOffered: (
    | "Bridal Makeup"
    | "Party Makeup"
    | "HD Makeup"
    | "Airbrush Makeup"
    | "Editorial Makeup"
    | "Hair Styling"
    | "Groom Makeup"
  )[];
  stylesSpecializedIn: string[];
  brandsUsed: string[];
  certifications: string[];
};

// Section 3: Pricing & Packages
export type PricingPackages = {
  basePrice: number | null;
  bridalPackage: number | null;
  partyPackage: number | null;
  travelCharges: number | null;
  pricingNotes: string;
};

// Section 4: Work Portfolio
export type WorkPortfolio = {
  portfolioImages: string[];
  pastClients: string[];
  bestWorkLinks: string[];
  achievements: string[];
};

// Section 5: Location & Availability
export type LocationAndAvailability = {
  state: State | null;
  city: City | null;
  area: Area | null;
  pincode: Pincode | null;
  travelAvailable: boolean;
  travelReadiness: "Local Only" | "State-wide" | "Pan-India";
  availableForDestination: boolean;
};

// Section 6: Social Presence
export type SocialPresence = {
  instagram: string;
  youtube: string;
  facebook: string;
  website: string;
  followers: {
    instagram: number | null;
    youtube: number | null;
  };
  rating: number | null;
  totalBookings: number | null;
};

// Section 7: Media Kit
export type MediaKit = {
  profilePhoto: string | null;
  portfolioFile: string | null;
  published: boolean;
};

// --- Section Key Type ---
export type MakeupArtistSectionKey =
  | "basicInformation"
  | "professionalDetails"
  | "pricingPackages"
  | "workPortfolio"
  | "locationAndAvailability"
  | "socialPresence"
  | "mediaKit";

// --- Zustand Store Type ---
export type MakeupArtistOnboardingState = {
  artistId: string;
  artistNumber: string;
  basicInformation: BasicInformation;
  professionalDetails: ProfessionalDetails;
  pricingPackages: PricingPackages;
  workPortfolio: WorkPortfolio;
  locationAndAvailability: LocationAndAvailability;
  socialPresence: SocialPresence;
  mediaKit: MediaKit;

  activeSection: MakeupArtistSectionKey;
  isSubmitting: boolean;

  // Actions
  setArtistId: (id: string) => void;
  setArtistNumber: (num: string) => void;
  setActiveSection: (section: MakeupArtistSectionKey) => void;
  setIsSubmitting: (submitting: boolean) => void;

  updateBasicInformation: (data: Partial<BasicInformation>) => void;
  updateProfessionalDetails: (data: Partial<ProfessionalDetails>) => void;
  updatePricingPackages: (data: Partial<PricingPackages>) => void;
  updateWorkPortfolio: (data: Partial<WorkPortfolio>) => void;
  updateLocationAndAvailability: (
    data: Partial<LocationAndAvailability>
  ) => void;
  updateSocialPresence: (data: Partial<SocialPresence>) => void;
  updateMediaKit: (data: Partial<MediaKit>) => void;

  resetStore: () => void;
};

// ================== INITIAL STATE ===================
const initialState: Omit<
  MakeupArtistOnboardingState,
  | "setArtistId"
  | "setArtistNumber"
  | "setActiveSection"
  | "setIsSubmitting"
  | "updateBasicInformation"
  | "updateProfessionalDetails"
  | "updatePricingPackages"
  | "updateWorkPortfolio"
  | "updateLocationAndAvailability"
  | "updateSocialPresence"
  | "updateMediaKit"
  | "resetStore"
> = {
  artistId: "",
  artistNumber: "",
  basicInformation: {
    name: "",
    email: "",
    phoneInternal: "",
    phonePublic: "",
    gender_id: null,
    experienceYears: null,
    languages: [],
    shortBio: "",
  },
  professionalDetails: {
    servicesOffered: [],
    stylesSpecializedIn: [],
    brandsUsed: [],
    certifications: [],
  },
  pricingPackages: {
    basePrice: null,
    bridalPackage: null,
    partyPackage: null,
    travelCharges: null,
    pricingNotes: "",
  },
  workPortfolio: {
    portfolioImages: [],
    pastClients: [],
    bestWorkLinks: [],
    achievements: [],
  },
  locationAndAvailability: {
    state: null,
    city: null,
    area: null,
    pincode: null,
    travelAvailable: false,
    travelReadiness: "Local Only",
    availableForDestination: false,
  },
  socialPresence: {
    instagram: "",
    youtube: "",
    facebook: "",
    website: "",
    followers: { instagram: null, youtube: null },
    rating: null,
    totalBookings: null,
  },
  mediaKit: {
    profilePhoto: null,
    portfolioFile: null,
    published: false,
  },
  activeSection: "basicInformation",
  isSubmitting: false,
};

// ================== STORE ===================
export const useMakeupArtistStore = create<MakeupArtistOnboardingState>((set) => ({
  ...initialState,

  setArtistId: (id) => set({ artistId: id }),
  setArtistNumber: (num) => set({ artistNumber: num }),
  setActiveSection: (section) => set({ activeSection: section }),
  setIsSubmitting: (submitting) => set({ isSubmitting: submitting }),

  updateBasicInformation: (data) =>
    set((state) => ({
      basicInformation: { ...state.basicInformation, ...data },
    })),
  updateProfessionalDetails: (data) =>
    set((state) => ({
      professionalDetails: { ...state.professionalDetails, ...data },
    })),
  updatePricingPackages: (data) =>
    set((state) => ({
      pricingPackages: { ...state.pricingPackages, ...data },
    })),
  updateWorkPortfolio: (data) =>
    set((state) => ({
      workPortfolio: { ...state.workPortfolio, ...data },
    })),
  updateLocationAndAvailability: (data) =>
    set((state) => ({
      locationAndAvailability: {
        ...state.locationAndAvailability,
        ...data,
      },
    })),
  updateSocialPresence: (data) =>
    set((state) => ({
      socialPresence: { ...state.socialPresence, ...data },
    })),
  updateMediaKit: (data) =>
    set((state) => ({ mediaKit: { ...state.mediaKit, ...data } })),

  resetStore: () => set(initialState),
}));
