  import { create } from "zustand";
  import { State, City, Area, Pincode } from "@/types/utilityTypes";

  // ================== TYPES ===================

  // ✅ Section 1: Basic Information
  export type BasicInformation = {
    fullName: string;
    brandName: string;
    email: string;
    whatsappNumber: string;
    yearsExperience: string;
    teamSize: string;
    artistType: string;
  };

  // ✅ Section 2: Client & Service Profile
  export type ClientServiceProfile = {
    clientTypes: string[];
    occasionFocus: string[];
    avgBookingsPerMonth: string;
    avgPriceRange: string;
    readyToTravel: boolean;
  };

  // ✅ Section 3: Fashion & Outfit Influence
  export type FashionOutfitInfluence = {
    recommendsBoutiques: boolean;
    guidanceTypes: string[];
    guidesOnTrends: string[];
    helpsWithOutfitCoordination: boolean;
    designersOrLabels: string[];
  };

  // ✅ Section 4: Social Media Collaborations (with Others)
  export type SocialCollabs = {
    collabsWithOthers: boolean;
    collabTypes: string[];
    collabFrequency: string;
    collabNature: string;
    collabReadyToTravel: boolean;
    collabTopBrands: string[];
    collabAvgReach: string;
  };

  // ✅ Section 5: Social Media Collaborations (with Attirelly)
  export type AttirellyCollab = {
    attirellyCollabTypes: string[];
    attirellyCollabModel: string;
    attirellyCollabFrequency: string;
    attirellyReadyToTravel: boolean;
    referralPotential: string;
  };

  // ✅ Section 6: Commission / Partnership Program
  export type CommissionProgram = {
    commissionOptIn: boolean;
    avgMonthlyReferrals: string;
  };

  // ✅ Section 7: Social Links
  export type SocialLinks = {
    socialLinks: Record<string, string>;
    featuredOn: string[];
  };

  // ✅ Section 8: Instagram Insights
  export type InstagramInsights = {
    instagramHandle: string;
    totalFollowers: number | null;
    totalPosts: number | null;
    engagementRate: number | null;
    audienceGenderSplit: Record<string, number> | null;
    topAudienceLocations: string[];
    contentNiche: string[];
    avgStoryViews: number | null;
    avgReelViews: number | null;
    bestPerformingContentType: string;
    audienceInsightSummary: string[];
  };

  // ✅ Section 9: Location
  export type ArtistLocation = {
    state: State | null;
    city: City | null;
    area: Area | null;
    pincode: Pincode | null;
  };

  // ✅ Section 10: Media & Bio
  export type MediaBio = {
    profilePhoto: string | null;
    portfolioFile: string | null;
    shortBio: string;
    published: boolean;
  };

  // ================== MAIN STORE TYPE ===================

  export type MakeupArtistSectionKey =
    | "basicInformation"
    | "clientServiceProfile"
    | "fashionOutfitInfluence"
    | "socialCollabs"
    | "attirellyCollab"
    | "commissionProgram"
    | "socialLinks"
    | "instagramInsights"
    | "artistLocation"
    | "mediaBio";

  export type MakeupArtistState = {
    artistId: string;
    phoneInternal: string;
    onboardingStep: number;

    // Sections
    basicInformation: BasicInformation;
    clientServiceProfile: ClientServiceProfile;
    fashionOutfitInfluence: FashionOutfitInfluence;
    socialCollabs: SocialCollabs;
    attirellyCollab: AttirellyCollab;
    commissionProgram: CommissionProgram;
    socialLinks: SocialLinks;
    instagramInsights: InstagramInsights;
    artistLocation: ArtistLocation;
    mediaBio: MediaBio;

    // Meta
    activeSection: MakeupArtistSectionKey;
    isSubmitting: boolean;

    // Actions
    setArtistId: (id: string) => void;
    setPhoneInternal: (num: string) => void;
    setActiveSection: (section: MakeupArtistSectionKey) => void;
    setIsSubmitting: (submitting: boolean) => void;
    setOnboardingStep: (step: number) => void;

    updateBasicInformation: (data: Partial<BasicInformation>) => void;
    updateClientServiceProfile: (data: Partial<ClientServiceProfile>) => void;
    updateFashionOutfitInfluence: (data: Partial<FashionOutfitInfluence>) => void;
    updateSocialCollabs: (data: Partial<SocialCollabs>) => void;
    updateAttirellyCollab: (data: Partial<AttirellyCollab>) => void;
    updateCommissionProgram: (data: Partial<CommissionProgram>) => void;
    updateSocialLinks: (data: Partial<SocialLinks>) => void;
    updateInstagramInsights: (data: Partial<InstagramInsights>) => void;
    updateArtistLocation: (data: Partial<ArtistLocation>) => void;
    updateMediaBio: (data: Partial<MediaBio>) => void;

    resetStore: () => void;
  };

  // ================== INITIAL STATE ===================
  const initialState: Omit<
    MakeupArtistState,
    | "setArtistId"
    | "setPhoneInternal"
    | "setActiveSection"
    | "setIsSubmitting"
    | "setOnboardingStep"
    | "updateBasicInformation"
    | "updateClientServiceProfile"
    | "updateFashionOutfitInfluence"
    | "updateSocialCollabs"
    | "updateAttirellyCollab"
    | "updateCommissionProgram"
    | "updateSocialLinks"
    | "updateInstagramInsights"
    | "updateArtistLocation"
    | "updateMediaBio"
    | "resetStore"
  > = {
    artistId: "",
    phoneInternal: "",
    onboardingStep: 1,

    basicInformation: {
      fullName: "",
      brandName: "",
      email: "",
      whatsappNumber: "",
      yearsExperience: "",
      teamSize: "",
      artistType: "",
    },
    clientServiceProfile: {
      clientTypes: [],
      occasionFocus: [],
      avgBookingsPerMonth: "",
      avgPriceRange: "",
      readyToTravel: true,
    },
    fashionOutfitInfluence: {
      recommendsBoutiques: true,
      guidanceTypes: [],
      guidesOnTrends: [],
      helpsWithOutfitCoordination: true,
      designersOrLabels: [],
    },
    socialCollabs: {
      collabsWithOthers: false,
      collabTypes: [],
      collabFrequency: "",
      collabNature: "",
      collabReadyToTravel: true,
      collabTopBrands: [],
      collabAvgReach: "",
    },
    attirellyCollab: {
      attirellyCollabTypes: [],
      attirellyCollabModel: "",
      attirellyCollabFrequency: "",
      attirellyReadyToTravel: true,
      referralPotential: "",
    },
    commissionProgram: {
      commissionOptIn: true,
      avgMonthlyReferrals: "",
    },
    socialLinks: {
      socialLinks: {},
      featuredOn: [],
    },
    instagramInsights: {
      instagramHandle: "",
      totalFollowers: null,
      totalPosts: null,
      engagementRate: null,
      audienceGenderSplit: null,
      topAudienceLocations: [],
      contentNiche: [],
      avgStoryViews: null,
      avgReelViews: null,
      bestPerformingContentType: "",
      audienceInsightSummary: [],
    },
    artistLocation: {
      state: null,
      city: null,
      area: null,
      pincode: null,
    },
    mediaBio: {
      profilePhoto: null,
      portfolioFile: null,
      shortBio: "",
      published: false,
    },

    activeSection: "basicInformation",
    isSubmitting: false,
  };

  // ================== STORE ===================
  export const useMakeupArtistStore = create<MakeupArtistState>((set) => ({
    ...initialState,

    setArtistId: (id) => set({ artistId: id }),
    setPhoneInternal: (num) => set({ phoneInternal: num }),
    setActiveSection: (section) => set({ activeSection: section }),
    setIsSubmitting: (submitting) => set({ isSubmitting: submitting }),
    setOnboardingStep: (step) => set({ onboardingStep: step }),

    updateBasicInformation: (data) =>
      set((state) => ({ basicInformation: { ...state.basicInformation, ...data } })),
    updateClientServiceProfile: (data) =>
      set((state) => ({ clientServiceProfile: { ...state.clientServiceProfile, ...data } })),
    updateFashionOutfitInfluence: (data) =>
      set((state) => ({ fashionOutfitInfluence: { ...state.fashionOutfitInfluence, ...data } })),
    updateSocialCollabs: (data) =>
      set((state) => ({ socialCollabs: { ...state.socialCollabs, ...data } })),
    updateAttirellyCollab: (data) =>
      set((state) => ({ attirellyCollab: { ...state.attirellyCollab, ...data } })),
    updateCommissionProgram: (data) =>
      set((state) => ({ commissionProgram: { ...state.commissionProgram, ...data } })),
    updateSocialLinks: (data) =>
      set((state) => ({ socialLinks: { ...state.socialLinks, ...data } })),
    updateInstagramInsights: (data) =>
      set((state) => ({ instagramInsights: { ...state.instagramInsights, ...data } })),
    updateArtistLocation: (data) =>
      set((state) => ({ artistLocation: { ...state.artistLocation, ...data } })),
    updateMediaBio: (data) =>
      set((state) => ({ mediaBio: { ...state.mediaBio, ...data } })),

    resetStore: () => set(initialState),
  }));
