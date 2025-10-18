import { MakeupArtistSectionKey } from "@/store/makeUpArtistStore";

/**
 * Maps frontend section data to backend payload
 * for the Makeup Artist onboarding flow.
 */
export const mapMakeupArtistDataToBackend = (
  sectionKey: MakeupArtistSectionKey,
  sectionData: any
): Record<string, any> => {
  switch (sectionKey) {
    // ---------- SECTION 1: Basic Information ----------
    case "basicInformation":
      return {
        full_name: sectionData.fullName,
        email: sectionData.email,
        whatsapp_number: sectionData.whatsappNumber,
        brand_name: sectionData.brandName,
        // phone_public: sectionData.phonePublic,
        // gender_id: sectionData.gender_id,
        years_experience: sectionData.yearsExperience,
        team_size: sectionData.teamSize,
        // languages: sectionData.languages,
        // short_bio: sectionData.shortBio,
      };

    // ---------- SECTION 2: Client Service Profile ----------
    case "clientServiceProfile":
      return {
        // services_offered: sectionData.servicesOffered,
        // styles_specialized_in: sectionData.stylesSpecializedIn,
        // brands_used: sectionData.brandsUsed,
        // certifications: sectionData.certifications,
        client_types: sectionData.clientTypes,
        occasion_focus: sectionData.occasionFocus,
        avg_bookings_per_month: sectionData.avgBookingsPerMonth,
        avg_price_range: sectionData.avgPriceRange,
        ready_to_travel: sectionData.readyToTravel,
      };

    // ---------- SECTION 3: Fashion & Outfit Influence ----------
    case "fashionOutfitInfluence":
      return {
        // base_price: sectionData.basePrice,
        // bridal_package: sectionData.bridalPackage,
        // party_package: sectionData.partyPackage,
        // travel_charges: sectionData.travelCharges,
        // pricing_notes: sectionData.pricingNotes,
        recommends_boutiques: sectionData.recommendsBoutiques,
        guidance_types: sectionData.guidanceTypes,
        guides_on_trends: sectionData.guidesOnTrends,
        helps_with_outfit_coordination: sectionData.helpsWithOutfitCoordination,
        designers_or_labels: sectionData.designersOrLabels,
      };

    // ---------- SECTION 4: Work Portfolio ----------
    case "socialCollabs":
      return {
        // portfolio_images: sectionData.portfolioImages,
        // past_clients: sectionData.pastClients,
        // best_work_links: sectionData.bestWorkLinks,
        // achievements: sectionData.achievements,
        collab_types: sectionData.collabTypes,
        collab_frequency: sectionData.collabFrequency,
        collab_nature: sectionData.collabNature,
        collab_ready_to_travel: sectionData.collabReadyToTravel,
        // collab_top_brands: sectionData.collabTopBrands,
        // collab_avg_reach: sectionData.collabAvgReach,
      };

    case "attirellyCollab":
      return {
        attirelly_collab_types: sectionData.attirellyCollabTypes,
        attirelly_collab_model: sectionData.attirellyCollabModel,
        attirelly_collab_frequency: sectionData.attirellyCollabFrequency,
        attirelly_ready_to_travel: sectionData.attirellyReadyToTravel,
        referral_potential: sectionData.referralPotential,
      };

    case "commissionProgram":
      return {
        commission_opt_in: sectionData.commissionOptIn,
        avg_monthly_referrals: sectionData.avgMonthlyReferrals,
      };
    
    case "socialLinks":
      return {
        social_links: sectionData.socialLinks,
        featured_on: sectionData.featuredOn,
      };
    
    case "instagramInsights":
      return {
        instagram_handle: sectionData.instagramHandle,
        total_followers: sectionData.totalFollowers,
        total_posts: sectionData.totalPosts,
        engagement_rate: sectionData.engagementRate,
        audience_gender_split: {
          male: sectionData.audienceGenderSplit.male,
          female: sectionData.audienceGenderSplit.female,
          other: sectionData.audienceGenderSplit.other,
        },
        top_audience_locations: sectionData.topAudienceLocations,
        content_niche: sectionData.contentNiche,
        avg_story_views: sectionData.avgStoryViews,
        avg_reel_views: sectionData.avgReelViews,
        best_performing_content_type: sectionData.bestPerformingContentType,
        audience_insight_summary: sectionData.audienceInsightSummary,
      };

    case "artistLocation":
      return {
        state_id: sectionData.state?.id ?? null,
        city_id: sectionData.city?.id ?? null,
        area_id: sectionData.area?.id ?? null,
        pincode_id: sectionData.pincode?.id ?? null,
      };

    // ---------- SECTION 7: Media Kit ----------
    case "mediaBio":
      return {
        profile_photo: sectionData.profilePhoto,
        portfolio_file: sectionData.portfolioFile,
        short_bio: sectionData.shortBio,
        published: sectionData.published,
      };

    default:
      return {};
  }
};
