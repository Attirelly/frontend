import { WeddingPlannerSectionKey } from "@/store/weddingPlannerStore";

export const mapWeddingPlannerDataToBackend = (
  sectionKey: WeddingPlannerSectionKey,
  sectionData: any
): Record<string, any> => {
  switch (sectionKey) {
    case "basicInformation":
      return {
        full_name: sectionData.fullName,
        business_name: sectionData.businessName,
        email: sectionData.email,
        internal_phone: sectionData.internalPhone,
        whatsapp_phone: sectionData.whatsappPhone,
        public_phone: sectionData.publicPhone,
      };

    case "businessProfile":
      return {
        client_persona: sectionData.clientPersona,
        wedding_aesthetic_styles: sectionData.weddingAestheticStyles,
        base_location: sectionData.baseLocation,
        primary_cities: sectionData.primaryCities,
        average_wedding_budget: sectionData.averageWeddingBudget,
        weddings_managed_last_year: sectionData.weddingsManagedLastYear,
        average_guest_size: sectionData.averageGuestSize,
        years_of_experience: sectionData.yearsOfExperience,
        team_size: sectionData.teamSize,
      };

    case "influenceNetwork":
      return {
        client_acquisation_methods: sectionData.clientAcquisationMethods,
        assists_with_outfits: sectionData.assistsWithOutfits,
        recommends_designers: sectionData.recommendsDesigners,
        partner_designers: sectionData.partnerDesigners,
        brides_guided_per_year: sectionData.bridesGuidedPerYear,
        collaborates_with_stylists_muas:
          sectionData.collaboratesWithStylistsMuas,
        recommended_fashion_categories: sectionData.recommendedFashionCategories,
        partner_vendor_handles: sectionData.partnerVendorHandles,
        referral_potential: sectionData.referralPotential,
      };

    case "collaborationPreferences":
      return {
        interested_in_collaborations_with:
          sectionData.interestedInCollaborationsWith,
        preferred_collaboration_type: sectionData.preferredCollaborationType,
        preferred_commission_model: sectionData.preferredCommissionModel,
        barter_acceptance: sectionData.barterAcceptance,
        monthly_collaborations_open_to: sectionData.monthlyCollaborationsOpenTo,
      };

    case "socialLinks":
      // Maps the URL/link fields
      return {
        instagram_url: sectionData.instagramUrl,
        youtube_link: sectionData.youtubeLink,
        website_url: sectionData.websiteUrl,
        facebook_link: sectionData.facebookLink,
      };

    case "instaInsights":
      // Maps the metric/insight fields
      return {
        total_followers: sectionData.totalFollowers,
        total_posts: sectionData.totalPosts,
        engagement_rate: sectionData.engagementRate,
        average_story_views: sectionData.averageStoryViews,
        average_reel_views: sectionData.averageReelViews,
      };

    default:
      // Returns an empty object for any unhandled section key
      return {};
  }
};