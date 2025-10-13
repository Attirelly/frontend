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
        name: sectionData.name,
        email: sectionData.email,
        phone_internal: sectionData.phoneInternal,
        phone_public: sectionData.phonePublic,
        gender_id: sectionData.gender_id,
        experience_years: sectionData.experienceYears,
        languages: sectionData.languages,
        short_bio: sectionData.shortBio,
      };

    // ---------- SECTION 2: Professional Details ----------
    case "professionalDetails":
      return {
        services_offered: sectionData.servicesOffered,
        styles_specialized_in: sectionData.stylesSpecializedIn,
        brands_used: sectionData.brandsUsed,
        certifications: sectionData.certifications,
      };

    // ---------- SECTION 3: Pricing & Packages ----------
    case "pricingPackages":
      return {
        base_price: sectionData.basePrice,
        bridal_package: sectionData.bridalPackage,
        party_package: sectionData.partyPackage,
        travel_charges: sectionData.travelCharges,
        pricing_notes: sectionData.pricingNotes,
      };

    // ---------- SECTION 4: Work Portfolio ----------
    case "workPortfolio":
      return {
        portfolio_images: sectionData.portfolioImages,
        past_clients: sectionData.pastClients,
        best_work_links: sectionData.bestWorkLinks,
        achievements: sectionData.achievements,
      };

    // ---------- SECTION 5: Location & Availability ----------
    case "locationAndAvailability":
      return {
        state_id: sectionData.state?.id ?? null,
        city_id: sectionData.city?.id ?? null,
        area_id: sectionData.area?.id ?? null,
        pincode_id: sectionData.pincode?.id ?? null,
        travel_available: sectionData.travelAvailable,
        travel_readiness: sectionData.travelReadiness,
        available_for_destination: sectionData.availableForDestination,
      };

    // ---------- SECTION 6: Social Presence ----------
    case "socialPresence":
      return {
        social_links: {
          instagram: sectionData.instagram,
          youtube: sectionData.youtube,
          facebook: sectionData.facebook,
          website: sectionData.website,
        },
        followers: sectionData.followers,
        rating: sectionData.rating,
        total_bookings: sectionData.totalBookings,
      };

    // ---------- SECTION 7: Media Kit ----------
    case "mediaKit":
      return {
        profile_photo: sectionData.profilePhoto,
        portfolio_file: sectionData.portfolioFile,
        published: sectionData.published,
      };

    default:
      return {};
  }
};
