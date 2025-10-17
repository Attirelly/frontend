"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/axios";

import Header from "@/components/Header";
import useAuthStore from "@/store/auth";
import {
  MakeupArtistSectionKey,
  useMakeupArtistStore,
} from "@/store/makeUpArtistStore";

import ArtistLocation from "@/components/MakeUpArtist/Sections/ArtistLocation";
import AttirellyCollaboration from "@/components/MakeUpArtist/Sections/AttirellyCollaboration";
import BasicInformation from "@/components/MakeUpArtist/Sections/BasicInformation";
import ClientServiceProfile from "@/components/MakeUpArtist/Sections/ClientServiceProfile";
import CommissionProgram from "@/components/MakeUpArtist/Sections/CommissionProgram";
import FashionOutfitInfluence from "@/components/MakeUpArtist/Sections/FashionOutfit";
import InstagramInsights from "@/components/MakeUpArtist/Sections/InstagramInsights";
import MediaBio from "@/components/MakeUpArtist/Sections/MediaBio";
import SocialMediaCollaboration from "@/components/MakeUpArtist/Sections/SocialMediaCollaborations";
import SocialLinks from "@/components/MakeUpArtist/Sections/SocialLinks";
import MakeupArtistSidebar from "@/components/MakeUpArtist/SideBar";
import { mapMakeupArtistDataToBackend } from "@/utils/convertMakeUpArtist";
import { Area, City, Pincode, State } from "@/types/utilityTypes";
import { handleMuaValidations } from "@/utils/handleMuaValidations";

// ================== SECTION MAP ===================
const sectionComponents: Record<MakeupArtistSectionKey, React.FC<any>> = {
  basicInformation: BasicInformation,
  clientServiceProfile: ClientServiceProfile,
  fashionOutfitInfluence: FashionOutfitInfluence,
  socialCollabs: SocialMediaCollaboration,
  attirellyCollab: AttirellyCollaboration,
  commissionProgram: CommissionProgram,
  socialLinks: SocialLinks,
  instagramInsights: InstagramInsights,
  artistLocation: ArtistLocation,
  mediaBio: MediaBio,
};

const onboardingSectionIds = Object.keys(
  sectionComponents
) as MakeupArtistSectionKey[];

// ================== MAIN COMPONENT ===================
export default function MakeUpArtistOnboardingPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { handleValidations } = handleMuaValidations();

  const store = useMakeupArtistStore();
  const {
    artistId,
    activeSection,
    setArtistId,
    setActiveSection,
    setIsSubmitting,
    setOnboardingStep,
    updateBasicInformation,
    updateClientServiceProfile,
    updateFashionOutfitInfluence,
    updateSocialCollabs,
    updateAttirellyCollab,
    updateCommissionProgram,
    updateSocialLinks,
    updateInstagramInsights,
    updateArtistLocation,
    updateMediaBio,
  } = store;

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // ========== FETCH MAKEUP ARTIST DETAILS ==========
  useEffect(() => {
    const fetchArtistDetails = async () => {
      try {
        let response;
        if (artistId) {
          response = await api.get(`/makeup_artists/${artistId}`);
        } else {
          response = await api.get(`/makeup_artists/by-user`, {
            params: { user_id: user?.id },
          });
        }

        const data = response.data;
        console.log("Fetched Artist Data:", data);

        // --- Location Fields ---
        const stateData: State = data.state;
        const cityData: City = data.city;
        const areaData: Area = data.area;
        const pincodeData: Pincode = data.pincode;

        // --- Update Store ---
        setArtistId(data.id);
        setCurrentIndex(data.onboarding_step || 0);
        setOnboardingStep(data.onboarding_step || 0);

        updateBasicInformation({
          fullName: data.full_name || "",
          brandName: data.brand_name || "",
          email: data.email || "",
          whatsappNumber: data.whatsapp_number || "",
          yearsExperience: data.years_experience || "",
          teamSize: data.team_size || "",
          artistType: data.artist_type || "",
        });

        updateClientServiceProfile({
          clientTypes: data.client_types || [],
          occasionFocus: data.occasion_focus || [],
          avgBookingsPerMonth: data.avg_bookings_per_month || "",
          avgPriceRange: data.avg_price_range || "",
          readyToTravel: !!data.ready_to_travel,
        });

        updateFashionOutfitInfluence({
          recommendsBoutiques: !!data.recommends_boutiques,
          guidanceTypes: data.guidance_types || [],
          guidesOnTrends: data.guides_on_trends || [],
          helpsWithOutfitCoordination: !!data.helps_with_outfit_coordination,
          designersOrLabels: data.designers_or_labels || [],
        });

        updateSocialCollabs({
          collabsWithOthers: !!data.collabs_with_others,
          collabTypes: data.collab_types || [],
          collabFrequency: data.collab_frequency || "",
          collabNature: data.collab_nature || "",
          collabReadyToTravel: !!data.collab_ready_to_travel,
          // collabTopBrands: data.collab_top_brands || [],
          // collabAvgReach: data.collab_avg_reach || "",
        });

        updateAttirellyCollab({
          attirellyCollabTypes: data.attirelly_collab_types || [],
          attirellyCollabModel: data.attirelly_collab_model || "",
          attirellyCollabFrequency: data.attirelly_collab_frequency || "",
          attirellyReadyToTravel: !!data.attirelly_ready_to_travel,
          referralPotential: data.referral_potential || "",
        });

        updateCommissionProgram({
          commissionOptIn: !!data.commission_opt_in,
          avgMonthlyReferrals: data.avg_monthly_referrals || "",
        });

        updateSocialLinks({
          socialLinks: data.social_links || {},
          featuredOn: data.featured_on || [],
        });

        updateInstagramInsights({
          instagramHandle: data.instagram_handle || "",
          totalFollowers: data.total_followers || null,
          totalPosts: data.total_posts || null,
          engagementRate: data.engagement_rate || null,
          audienceGenderSplit: data.audience_gender_split || null,
          topAudienceLocations: data.top_audience_locations || [],
          contentNiche: data.content_niche || [],
          avgStoryViews: data.avg_story_views || null,
          avgReelViews: data.avg_reel_views || null,
          bestPerformingContentType: data.best_performing_content_type || "",
          audienceInsightSummary: data.audience_insight_summary || [],
        });

        updateArtistLocation({
          state: stateData,
          city: cityData,
          area: areaData,
          pincode: pincodeData,
        });

        updateMediaBio({
          profilePhoto: data.profile_photo || null,
          portfolioFile: data.portfolio_file || null,
          shortBio: data.short_bio || "",
          published: !!data.published,
        });
      } catch (error) {
        console.error("Error fetching makeup artist details:", error);
        toast.error("Failed to load artist details");
      }
    };

    fetchArtistDetails();
  }, [user?.id]);

  // ========== SAVE AND NEXT ==========
  const handleSaveAndNext = async () => {
    const isValid = handleValidations();
    if (!isValid) return;
    const currentData = store[activeSection];
    const currentSectionIndex = onboardingSectionIds.indexOf(activeSection);

    setIsSubmitting(true);
    const toastId = toast.loading(`Saving ${activeSection}...`);

    try {
      const mappedData = mapMakeupArtistDataToBackend(activeSection, currentData);
      const payload = { ...mappedData, next_step: currentSectionIndex + 1 };
      console.log(`Payload for ${activeSection}:`, payload);
      await api.put(`/makeup_artists/update/${artistId}`, payload);

      toast.success("Saved successfully!", { id: toastId });

      if (currentSectionIndex < onboardingSectionIds.length - 1) {
        setActiveSection(onboardingSectionIds[currentSectionIndex + 1]);
        setCurrentIndex(currentIndex + 1);
      } else {
        toast.success("🎉 Onboarding complete!");
        router.push("/makeup_artist_dashboard");
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

  console.log("Current Active Section:", activeSection);

  // ========== RENDER ==========
  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="Attirelly Makeup Artist Onboarding" />

      <div className="flex flex-col md:flex-row gap-6 p-6 justify-center">
        <MakeupArtistSidebar
          currentIndex={currentIndex}
          activeSectionId={activeSection}
          onSectionClick={setActiveSection}
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
            {activeSection === "mediaBio" ? "Submit" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
