// utils/mapInfluencerData.ts

import { InfluencerSectionKey } from "@/store/influencerStore";

export const mapInfluencerDataToBackend = (
  sectionKey: InfluencerSectionKey,
  sectionData: any
): Record<string, any> => {
  switch (sectionKey) {
    case "basicInformation":
      return {
        name: sectionData.name,
        email: sectionData.email,
        phone_internal: sectionData.phoneInternal,
        phone_public: sectionData.phonePublic,
        gender_id: sectionData.gender_id,
        age_group_id: sectionData.age_group_id,
        languages: sectionData.languages,
      };

    case "socialPresence":
      return {
        primary_platform: sectionData.primaryPlatform,
        social_links: sectionData.socialLinks,
        category_niche: sectionData.categoryNiche,
        content_style: sectionData.contentStyle,
      };

    case "audienceInsights":
      return {
        followers: sectionData.followers,
        engagement_metrics: sectionData.engagementMetrics,
        audience_gender_split: sectionData.audienceGenderSplit,
        top_age_groups: sectionData.topAgeGroups,
        top_locations: sectionData.topLocations,
        audience_type: sectionData.audienceType,
      };

    case "collaborationPreferences":
      return {
        preferred_collab_types: sectionData.preferredCollabTypes,
        open_to_barter: sectionData.openToBarter,
        max_campaigns_per_month: sectionData.maxCampaignsPerMonth,
      };

    case "pricingStructure":
      return {
        pricing: sectionData.pricing,
        barter_value_min: sectionData.barterValueMin,
      };

    case "pastWork":
      return {
        brands_worked_with: sectionData.brandsWorkedWith,
        best_campaign_links: sectionData.bestCampaignLinks,
        achievements: sectionData.achievements,
      };

    case "locationAndAvailability":
      return {
        state_id: sectionData.state.id,
        city_id: sectionData.city.id,
        area_id: sectionData.area.id,
        pincode_id: sectionData.pincode.id,
        travel_readiness: sectionData.travelReadiness,
        attend_events: sectionData.attendEvents,
      };

    case "mediaKit":
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
