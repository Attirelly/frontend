import { create } from 'zustand';

// types/InfluencerTypes.ts

// Section 1: Basic Information
export type BasicInformation = {
  fullName: string;
  email: string;
  internalPhoneNumber: string;
  publicPhoneNumber: string;
  gender: 'Male' | 'Female' | 'Other' | null;
  ageGroup: '<18' | '18-24' | '25-29' | '30-34' | '35-44' | '45+' | null;
  languages: string[]; // e.g., ['English', 'Hindi']
};

// Section 2: Social Presence
export type SocialPresence = {
  primaryPlatform: 'Instagram' | 'YouTube' | 'Facebook' | 'Snapchat' | 'Other' | null;
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
  followerCounts: {
    instagram: number | null;
    youtube: number | null;
    facebook: number | null;
  };
  engagementMetrics: {
    avgLikesPerReel: number | null;
    avgCommentsPerReel: number | null;
    avgViewsPerReel: number | null;
    engagementRate: number | null; // Percentage
  };
  audienceGenderSplit: {
    malePercent: number | null;
    femalePercent: number | null;
    otherPercent: number | null;
  };
  topAgeGroups: string[];
  topLocations: string[]; // Cities or States
  audienceType: 'Urban' | 'Semi-Urban' | 'Rural' | null;
};

// Section 4: Collaboration Preferences
export type CollaborationPreferences = {
  preferredTypes: ('Reels' | 'Stories' | 'Posts' | 'UGC' | 'Try-ons' | 'Live Sessions')[];
  openToBarter: 'Yes' | 'No' | 'Depends';
  maxCampaignsPerMonth: number;
};

// Section 5: Pricing Structure
export type PricingStructure = {
  singleReelPrice: number | null;
  storyPrice: number | null;
  postPrice: number | null;
  campaignPriceMin: number | null;
  campaignPriceMax: number | null;
  minBarterValue: number | null;
};

// Section 6: Past Work & Credibility
export type PastWork = {
  brandsWorkedWith: string[];
  bestCampaignLinks: string[];
  achievements: string[];
};

// Section 7: Location & Availability
export type LocationAndAvailability = {
  city: string;
  area: string;
  pincode: string;
  travelReadiness: 'Local Only' | 'State-wide' | 'Pan-India';
  availableForEvents: boolean;
};

// Section 8: Media Kit & Profile
export type MediaKit = {
  profilePhotoUrl: string | null;
  portfolioUrl: string | null; // Link to a PDF/ZIP
  shortBio: string;
};

// Key to identify each section
export type InfluencerSectionKey = 
  | 'basicInformation' 
  | 'socialPresence' 
  | 'audienceInsights' 
  | 'collaborationPreferences' 
  | 'pricingStructure' 
  | 'pastWork' 
  | 'locationAndAvailability' 
  | 'mediaKit';

// The complete state and actions for the store
export type InfluencerOnboardingState = {
  // Data for each section
  basicInformation: BasicInformation;
  socialPresence: SocialPresence;
  audienceInsights: AudienceInsights;
  collaborationPreferences: CollaborationPreferences;
  pricingStructure: PricingStructure;
  pastWork: PastWork;
  locationAndAvailability: LocationAndAvailability;
  mediaKit: MediaKit;

  // Form flow management
  activeSection: InfluencerSectionKey;
  isSubmitting: boolean;
  
  // Actions to update the store
  setActiveSection: (section: InfluencerSectionKey) => void;
  setIsSubmitting: (submitting: boolean) => void;
  updateBasicInformation: (data: Partial<BasicInformation>) => void;
  updateSocialPresence: (data: Partial<SocialPresence>) => void;
  updateAudienceInsights: (data: Partial<AudienceInsights>) => void;
  updateCollaborationPreferences: (data: Partial<CollaborationPreferences>) => void;
  updatePricingStructure: (data: Partial<PricingStructure>) => void;
  updatePastWork: (data: Partial<PastWork>) => void;
  updateLocationAndAvailability: (data: Partial<LocationAndAvailability>) => void;
  updateMediaKit: (data: Partial<MediaKit>) => void;

  resetStore: () => void;
};

// stores/useInfluencerOnboardingStore.ts
]
// Define the initial state to easily reset the form
const initialState = {
  basicInformation: {
    fullName: '',
    email: '',
    internalPhoneNumber: '',
    publicPhoneNumber: '',
    gender: null,
    ageGroup: null,
    languages: [],
  },
  socialPresence: {
    primaryPlatform: null,
    socialLinks: { instagram: '', youtube: '', facebook: '', snapchat: '', wishlink: '', hypd: '', website: '' },
    categoryNiche: [],
    contentStyle: [],
  },
  audienceInsights: {
    followerCounts: { instagram: null, youtube: null, facebook: null },
    engagementMetrics: { avgLikesPerReel: null, avgCommentsPerReel: null, avgViewsPerReel: null, engagementRate: null },
    audienceGenderSplit: { malePercent: null, femalePercent: null, otherPercent: null },
    topAgeGroups: [],
    topLocations: [],
    audienceType: null,
  },
  collaborationPreferences: {
    preferredTypes: [],
    openToBarter: 'Depends',
    maxCampaignsPerMonth: 2,
  },
  pricingStructure: {
    singleReelPrice: null,
    storyPrice: null,
    postPrice: null,
    campaignPriceMin: null,
    campaignPriceMax: null,
    minBarterValue: null,
  },
  pastWork: {
    brandsWorkedWith: [],
    bestCampaignLinks: [],
    achievements: [],
  },
  locationAndAvailability: {
    city: '',
    area: '',
    pincode: '',
    travelReadiness: 'Local Only',
    availableForEvents: false,
  },
  mediaKit: {
    profilePhotoUrl: null,
    portfolioUrl: null,
    shortBio: '',
  },
  activeSection: 'basicInformation' as const,
  isSubmitting: false,
};

export const useInfluencerOnboardingStore = create<InfluencerOnboardingState>((set) => ({
  ...initialState,

  // --- ACTIONS ---

  // Set the currently active form section
  setActiveSection: (section) => set({ activeSection: section }),

  // Set the submission status (e.g., for showing loaders)
  setIsSubmitting: (submitting) => set({ isSubmitting: submitting }),

  // Update actions for each section.
  // Using Partial<T> allows updating only specific fields without overwriting the whole object.
  updateBasicInformation: (data) => set((state) => ({
    basicInformation: { ...state.basicInformation, ...data },
  })),
  
  updateSocialPresence: (data) => set((state) => ({
    socialPresence: { ...state.socialPresence, ...data },
  })),

  updateAudienceInsights: (data) => set((state) => ({
    audienceInsights: { ...state.audienceInsights, ...data },
  })),

  updateCollaborationPreferences: (data) => set((state) => ({
    collaborationPreferences: { ...state.collaborationPreferences, ...data },
  })),

  updatePricingStructure: (data) => set((state) => ({
    pricingStructure: { ...state.pricingStructure, ...data },
  })),

  updatePastWork: (data) => set((state) => ({
    pastWork: { ...state.pastWork, ...data },
  })),

  updateLocationAndAvailability: (data) => set((state) => ({
    locationAndAvailability: { ...state.locationAndAvailability, ...data },
  })),

  updateMediaKit: (data) => set((state) => ({
    mediaKit: { ...state.mediaKit, ...data },
  })),

  // Reset the entire store to its initial state
  resetStore: () => set(initialState),
}));