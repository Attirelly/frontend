"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { handleInfluencerValidations } from "@/utils/handleInfluencerValidations";
import { logout } from "@/utils/logout";

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
  const { handleValidations } = handleInfluencerValidations();

  const searchParams = useSearchParams();
  const rawSection = searchParams.get("section");
  const sectionFromUrl: InfluencerSectionKey =
    rawSection &&
    onboardingSectionIds.includes(rawSection as InfluencerSectionKey)
      ? (rawSection as InfluencerSectionKey)
      : "basicInformation";

  useEffect(() => {
    if (sectionFromUrl && sectionFromUrl !== activeSection) {
      setActiveSection(sectionFromUrl);
    }
  }, [sectionFromUrl]);

  const handleSectionChange = (section: InfluencerSectionKey) => {
    setActiveSection(section);
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("section", section);
    router.push(`?${current.toString()}`, { scroll: false });
  };

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
            instagram: data.social_links.instagram || "",
            youtube: data.social_links.youtube || "",
            facebook: data.social_links.facebook || "",
            snapchat: data.social_links.snapchat || "",
            wishlink: data.social_links.wishlink || "",
            hypd: data.social_links.hypd || "",
            website: data.social_links.website || "",
          },
          categoryNiche: data.category_niche || [],
          contentStyle: data.content_style || [],
        });

        updateAudienceInsights({
          followers: {
            instagram: data.followers.instagram || 0,
            youtube: data.followers.youtube || 0,
            facebook: data.followers.facebook || 0,
          },
          engagementMetrics: {
            avgLikesPerReel: data.engagement_metrics.avgLikesPerReel || 0,
            avgCommentsPerReel: data.engagement_metrics.avgCommentsPerReel || 0,
            avgViewsPerReel: data.engagement_metrics.avgViewsPerReel || 0,
            engagementRate: data.engagement_metrics.engagementRate || 0,
          },
          audienceGenderSplit: {
            male: data.audience_gender_split.male || 0,
            female: data.audience_gender_split.female || 0,
            other: data.audience_gender_split.other || 0,
          },
          topAgeGroups: data.top_age_groups || [],
          topLocations: data.top_locations || [],
          audienceType: data.audience_type || null,
        });

        updateCollaborationPreferences({
          preferredCollabTypes: data.preferred_collab_types || [],
          openToBarter: data.open_to_barter || "Depends",
          // maxCampaignsPerMonth: data.max_campaigns_per_month || 2,
        });

        updatePricingStructure({
          pricing: {
            reel: data.pricing.reel || null,
            story: data.pricing.story || null,
            post: data.pricing.post || null,
            campaign_min: data.pricing.campaign_min || null,
            campaign_max: data.pricing.campaign_max || null,
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
      }
    };

    fetchInfluencerDetails();
  }, [user?.id]);

  // ========== SAVE AND NEXT ==========
  const handleSaveAndNext = async () => {
    const isValid = handleValidations();
    if (!isValid) return;
    const currentData = store[activeSection];
    const currentIndex = onboardingSectionIds.indexOf(activeSection);

    setIsSubmitting(true);
    const toastId = toast.loading(`Saving ${activeSection}...`);
    try {
      const mappedData = mapInfluencerDataToBackend(activeSection, currentData);

      const payload = { ...mappedData, next_step: 8 };
      console.log("update payload", payload);
      console.log("update payload", payload);
      await api.put(`/influencers/update/${influencerId}`, payload);

      toast.success("Details updated successfully!", { id: toastId });

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
      <Header
        title="Attirelly"
        actions={
          <button onClick={() => logout("/influencer_signin")}>Log Out</button>
        }
      />

      <div className="flex flex-col md:flex-row gap-6 p-6 justify-center">
        <InfluencerSidebar
          activeSectionId={activeSection}
          onSectionClick={handleSectionChange}
        />

        <div className="flex flex-col gap-3 rounded-md bg-gray-100 w-full md:w-3/4">
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
          <button
            className="bg-black text-white px-6 py-3 rounded-lg ml-auto cursor-pointer"
            onClick={handleSaveAndNext}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
