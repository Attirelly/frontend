import { City } from "@/types/SellerTypes";
import { Area, Pincode, State } from "@/types/utilityTypes";
import { create } from "zustand";

// ================== TYPES ===================

// Section 1: Basic Information
export type BasicInformation = {
  name: string;
  email: string;
  phoneInternal: string;
  phonePublic: string;
  gender_id: string | null;
  age_group_id: string | null;
  languages: string[];
};

// Section 2: Social Presence
export type SocialPresence = {
  primaryPlatform:
    | "Instagram"
    | "YouTube"
    | "Facebook"
    | "Snapchat"
    | "Other"
    | null;
  socialLinks: {
    instagram: string;
    youtube: string;
    facebook: string;
    snapchat: string;
    wishlink: string;
    hypd: string;
    website: string;
  };
  categoryNiche: string[];
  contentStyle: string[];
};

// Section 3: Audience Insights
export type AudienceInsights = {
  followers: {
    instagram: number | null;
    youtube: number | null;
    facebook: number | null;
  };
  engagementMetrics: {
    avgLikesPerReel: number | null;
    avgCommentsPerReel: number | null;
    avgViewsPerReel: number | null;
    engagementRate: number | null;
  };
  audienceGenderSplit: {
    male: number | null;
    female: number | null;
    other: number | null;
  };
  topAgeGroups: string[];
  topLocations: string[];
  audienceType: "Urban" | "Semi-Urban" | "Rural" | null;
};

// Section 4: Collaboration Preferences
export type CollaborationPreferences = {
  preferredCollabTypes: (
    | "Reels"
    | "Stories"
    | "Posts"
    | "UGC"
    | "Try-ons"
    | "Live Sessions"
  )[];
  openToBarter: "Yes" | "No" | "Depends";
  maxCampaignsPerMonth: number;
};

// Section 5: Pricing Structure
export type PricingStructure = {
  pricing: {
    reel: number | null;
    story: number | null;
    post: number | null;
    campaign_min: number | null;
    campaign_max: number | null;
  };
  barterValueMin: number | null;
};

// Section 6: Past Work
export type PastWork = {
  brandsWorkedWith: string[];
  bestCampaignLinks: string[];
  achievements: string[];
};

// Section 7: Location & Availability
export type LocationAndAvailability = {
  state: State | null;
  city: City | null;
  area: Area | null;
  pincode: Pincode | null;
  travelReadiness: "Local Only" | "State-wide" | "Pan-India";
  attendEvents: boolean;
};

// Section 8: Media Kit
export type MediaKit = {
  profilePhoto: string | null;
  portfolioFile: string | null;
  shortBio: string;
  published: boolean;
};

// --- Section Key Type ---
export type InfluencerSectionKey =
  | "basicInformation"
  | "socialPresence"
  | "audienceInsights"
  | "collaborationPreferences"
  | "pricingStructure"
  | "pastWork"
  | "locationAndAvailability"
  | "mediaKit";

// --- Zustand Store Type ---
export type InfluencerOnboardingState = {
  influencerId: string;
  influencerNumber: string;
  basicInformation: BasicInformation;
  socialPresence: SocialPresence;
  audienceInsights: AudienceInsights;
  collaborationPreferences: CollaborationPreferences;
  pricingStructure: PricingStructure;
  pastWork: PastWork;
  locationAndAvailability: LocationAndAvailability;
  mediaKit: MediaKit;

  activeSection: InfluencerSectionKey;
  isSubmitting: boolean;

  // --- Actions ---
  setActiveSection: (section: InfluencerSectionKey) => void;
  setIsSubmitting: (submitting: boolean) => void;
  setInfluencerId: (id: string) => void;
  setInfluencerNumber: (number: string) => void;

  updateBasicInformation: (data: Partial<BasicInformation>) => void;
  updateSocialPresence: (data: Partial<SocialPresence>) => void;
  updateAudienceInsights: (data: Partial<AudienceInsights>) => void;
  updateCollaborationPreferences: (
    data: Partial<CollaborationPreferences>
  ) => void;
  updatePricingStructure: (data: Partial<PricingStructure>) => void;
  updatePastWork: (data: Partial<PastWork>) => void;
  updateLocationAndAvailability: (
    data: Partial<LocationAndAvailability>
  ) => void;
  updateMediaKit: (data: Partial<MediaKit>) => void;

  resetStore: () => void;
};

// ================== INITIAL STATE ===================
const initialState: Omit<
  InfluencerOnboardingState,
  | "setInfluencerId"
  | "setInfluencerNumber"
  | "setActiveSection"
  | "setIsSubmitting"
  | "updateBasicInformation"
  | "updateSocialPresence"
  | "updateAudienceInsights"
  | "updateCollaborationPreferences"
  | "updatePricingStructure"
  | "updatePastWork"
  | "updateLocationAndAvailability"
  | "updateMediaKit"
  | "resetStore"
> = {
  influencerId: "",
  influencerNumber: "",
  basicInformation: {
    name: "",
    email: "",
    phoneInternal: "",
    phonePublic: "",
    gender_id: null,
    age_group_id: null,
    languages: [],
  },
  socialPresence: {
    primaryPlatform: null,
    socialLinks: {
      instagram: "",
      youtube: "",
      facebook: "",
      snapchat: "",
      wishlink: "",
      hypd: "",
      website: "",
    },
    categoryNiche: [],
    contentStyle: [],
  },
  audienceInsights: {
    followers: { instagram: null, youtube: null, facebook: null },
    engagementMetrics: {
      avgLikesPerReel: null,
      avgCommentsPerReel: null,
      avgViewsPerReel: null,
      engagementRate: null,
    },
    audienceGenderSplit: { male: null, female: null, other: null },
    topAgeGroups: [],
    topLocations: [],
    audienceType: null,
  },
  collaborationPreferences: {
    preferredCollabTypes: [],
    openToBarter: "Depends",
    maxCampaignsPerMonth: 2,
  },
  pricingStructure: {
    pricing: {
      reel: null,
      story: null,
      post: null,
      campaign_min: null,
      campaign_max: null,
    },
    barterValueMin: null,
  },
  pastWork: {
    brandsWorkedWith: [],
    bestCampaignLinks: [],
    achievements: [],
  },
  locationAndAvailability: {
    state: "",
    city: "",
    area: "",
    pincode: "",
    travelReadiness: "Local Only",
    attendEvents: false,
  },
  mediaKit: {
    profilePhoto: null,
    portfolioFile: null,
    shortBio: "",
    published: false,
  },
  activeSection: "basicInformation",
  isSubmitting: false,
};

// ================== STORE ===================
export const useInfluencerStore = create<InfluencerOnboardingState>((set) => ({
  ...initialState,
  setInfluencerId: (id) => set({ influencerId: id }),
  setInfluencerNumber: (number) => set({ influencerNumber: number }),

  setActiveSection: (section) => set({ activeSection: section }),
  setIsSubmitting: (submitting) => set({ isSubmitting: submitting }),

  updateBasicInformation: (data) =>
    set((state) => ({
      basicInformation: { ...state.basicInformation, ...data },
    })),
  updateSocialPresence: (data) =>
    set((state) => ({ socialPresence: { ...state.socialPresence, ...data } })),
  updateAudienceInsights: (data) =>
    set((state) => ({
      audienceInsights: { ...state.audienceInsights, ...data },
    })),
  updateCollaborationPreferences: (data) =>
    set((state) => ({
      collaborationPreferences: { ...state.collaborationPreferences, ...data },
    })),
  updatePricingStructure: (data) =>
    set((state) => ({
      pricingStructure: { ...state.pricingStructure, ...data },
    })),
  updatePastWork: (data) =>
    set((state) => ({ pastWork: { ...state.pastWork, ...data } })),
  updateLocationAndAvailability: (data) =>
    set((state) => ({
      locationAndAvailability: { ...state.locationAndAvailability, ...data },
    })),
  updateMediaKit: (data) =>
    set((state) => ({ mediaKit: { ...state.mediaKit, ...data } })),

  resetStore: () => set(initialState),
}));
