"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/axios";

import {
  useInfluencerStore,
  InfluencerSectionKey,
} from "@/store/influencerStore";

import Header from "@/components/Header";
import InfluencerSidebar from "@/components/Influencer/Sidebar";

import BasicInformation from "@/components/Influencer/Sections/BasicInformation";
import SocialPreference from "@/components/Influencer/Sections/SocialPreference";
import AudienceInsights from "@/components/Influencer/Sections/AudienceInsights";
import CollaborationPreferences from "@/components/Influencer/Sections/CollaborationPreferences";
import PricingStructure from "@/components/Influencer/Sections/PricingStructure";
import PastWork from "@/components/Influencer/Sections/PastWork";
import LocationAvailability from "@/components/Influencer/Sections/LocationAvailability";
// import InfluencerPhotos from "@/components/Influencer/Sections/InfluencerPhotos";

import { Area, City, Pincode, State } from "@/types/utilityTypes";
import useAuthStore from "@/store/auth";
import { mapInfluencerDataToBackend } from "@/utils/convertInfluencer";
import InfluencerPhotos from "@/components/Influencer/Sections/InfluencerPhotos";

// ================== SECTION MAP ===================
const sectionComponents: Record<InfluencerSectionKey, React.FC<any>> = {
  basicInformation: BasicInformation,
  socialPresence: SocialPreference,
  audienceInsights: AudienceInsights,
  collaborationPreferences: CollaborationPreferences,
  pricingStructure: PricingStructure,
  pastWork: PastWork,
  locationAndAvailability: LocationAvailability,
  mediaKit: InfluencerPhotos,
};
const onboardingSectionIds = Object.keys(
  sectionComponents
) as InfluencerSectionKey[];

// ================== MAIN COMPONENT ===================
export default function InfluencerOnboardingPage() {
  const store = useInfluencerStore();
  const router = useRouter();

  const {
    activeSection,
    setActiveSection,
    influencerId,
    setIsSubmitting,
    updateBasicInformation,
    updateSocialPresence,
    updateAudienceInsights,
    updateCollaborationPreferences,
    updatePricingStructure,
    updatePastWork,
    updateLocationAndAvailability,
    updateMediaKit,
    setInfluencerId,
  } = store;

  const { user } = useAuthStore();

  // ========== FETCH INFLUENCER DETAILS ==========
  useEffect(() => {
    const fetchInfluencerDetails = async () => {
      try {
        let response;
        if (influencerId) {
          response = await api.get(`/influencers/${influencerId}`);
        } else {
          response = await api.get("/influencers/by-user", {
            params: { user_id: user?.id },
          });
        }
        const data = response.data;
        console.log(data);
        // --- handle nested city/area/pincode ---
        const stateData: State = data.state;
        const cityData: City = data.city;
        const areaData: Area = data.area;
        const pincodeData: Pincode = data.pincode;

        // --- Update store sections ---
        setInfluencerId(data.id);
        updateBasicInformation({
          name: data.name || "",
          email: data.email || "",
          phoneInternal: data.phone_internal || "",
          phonePublic: data.phone_public || "",
          gender_id: data.gender_id || null,
          age_group_id: data.age_group_id || null,
          languages: data.languages || [],
        });

        updateSocialPresence({
          primaryPlatform: data.primary_platform || null,
          socialLinks: {
            instagram: data.instagram_link || "",
            youtube: data.youtube_link || "",
            facebook: data.facebook_link || "",
            snapchat: data.snapchat_link || "",
            wishlink: data.wishlink_link || "",
            hypd: data.hypd_link || "",
            website: data.website || "",
          },
          categoryNiche: data.category_niche || [],
          contentStyle: data.content_style || [],
        });

        updateAudienceInsights({
          followers: {
            instagram: data.followers_instagram || null,
            youtube: data.followers_youtube || null,
            facebook: data.followers_facebook || null,
          },
          engagementMetrics: {
            avgLikesPerReel: data.avg_likes_per_reel || null,
            avgCommentsPerReel: data.avg_comments_per_reel || null,
            avgViewsPerReel: data.avg_views_per_reel || null,
            engagementRate: data.engagement_rate || null,
          },
          audienceGenderSplit: {
            male: data.audience_male || null,
            female: data.audience_female || null,
            other: data.audience_other || null,
          },
          topAgeGroups: data.top_age_groups || [],
          topLocations: data.top_locations || [],
          audienceType: data.audience_type || null,
        });

        updateCollaborationPreferences({
          preferredCollabTypes: data.preferred_collab_types || [],
          openToBarter: data.open_to_barter || "Depends",
          maxCampaignsPerMonth: data.max_campaigns_per_month || 2,
        });

        updatePricingStructure({
          pricing: {
            reel: data.reel_price || null,
            story: data.story_price || null,
            post: data.post_price || null,
            campaign_min: data.campaign_min || null,
            campaign_max: data.campaign_max || null,
          },
          barterValueMin: data.barter_value_min || null,
        });

        updatePastWork({
          brandsWorkedWith: data.brands_worked_with || [],
          bestCampaignLinks: data.best_campaign_links || [],
          achievements: data.achievements || [],
        });

        updateLocationAndAvailability({
          state: stateData,
          city: cityData,
          area: areaData,
          pincode: pincodeData,
          travelReadiness: data.travel_readiness || "Local Only",
          attendEvents: !!data.attend_events,
        });

        updateMediaKit({
          profilePhoto: data.profile_photo || null,
          portfolioFile: data.portfolio_file || null,
          shortBio: data.short_bio || "",
          published: !!data.published,
        });
      } catch (error) {
        console.error("Error fetching influencer details:", error);
        toast.error("Failed to load influencer details");
      }
    };

    fetchInfluencerDetails();
  }, [user?.id]);

  // ========== SAVE AND NEXT ==========
  const handleSaveAndNext = async () => {
    const currentData = store[activeSection];
    const currentIndex = onboardingSectionIds.indexOf(activeSection);

    setIsSubmitting(true);
    const toastId = toast.loading(`Saving ${activeSection}...`);
    try {
      const mappedData = mapInfluencerDataToBackend(activeSection, currentData);

      const payload = { ...mappedData, next_step: currentIndex + 1 };
      console.log("update payload", payload);
      console.log("update payload", payload);
      await api.put(`/influencers/update/${influencerId}`, payload);

      toast.success("Saved successfully!", { id: toastId });

      if (currentIndex < onboardingSectionIds.length - 1) {
        setActiveSection(onboardingSectionIds[currentIndex + 1]);
      } else {
        toast.success("🎉 Onboarding complete!");
        router.push("/influencer/dashboard");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to save data.", {
        id: toastId,
      });
      console.error(`Error saving ${activeSection}:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ========== RENDER ==========
  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="Attirelly" actions={<div>...</div>} />

      <div className="flex flex-col md:flex-row gap-6 p-6 justify-center">
        <InfluencerSidebar
          activeSectionId={activeSection}
          onSectionClick={setActiveSection}
        />

        <div className="rounded-md bg-gray-100 w-full md:w-3/4">
          {onboardingSectionIds.map((id) => {
            const Component = sectionComponents[id];
            const isActive = id === activeSection;
            const isLastStep =
              id === onboardingSectionIds[onboardingSectionIds.length - 1];

            return (
              <div key={id} style={{ display: isActive ? "block" : "none" }}>
                <Component onNext={handleSaveAndNext} isLastStep={isLastStep} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
