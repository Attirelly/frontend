'use client';

import { useState, useRef, useEffect } from 'react';

import { WeddingPlannerSectionKey } from '@/store/weddingPlannerStore';
import { useRouter } from 'next/navigation';

// Import all components (except Photos)
import Header from '@/components/Header';
import WeddingPlannerSidebar from '@/components/WeddingPlanner/Sidebar';
import BasicInformation from '@/components/WeddingPlanner/Sections/BasicInformation';
import BusinessProfile from '@/components/WeddingPlanner/Sections/BusinessProfile';
import InfluenceNetwork from '@/components/WeddingPlanner/Sections/InfluenceNetwork';
import CollaborationPreferences from '@/components/WeddingPlanner/Sections/CollaborationPreferences';
import SocialLinks from '@/components/WeddingPlanner/Sections/SocialLinks';
import InstaInsights from '@/components/WeddingPlanner/Sections/InstaInsights';
import { useWeddingPlannerStore } from '@/store/weddingPlannerStore';
import { toast } from 'sonner';
import { api } from '@/lib/axios';
import { mapWeddingPlannerDataToBackend } from '@/utils/convertWeddingPlanner';
import useAuthStore from '@/store/auth';
import { handleWeddingPlannerValidations } from '@/utils/handleWeddingPlannerValidations';

// Map of all section IDs to their components (Photos removed)
const sectionComponents: { [key: string]: React.FC<any> } = {
    "basicInformation": BasicInformation,
    "businessProfile": BusinessProfile,
    "influenceNetwork": InfluenceNetwork,
    "collaborationPreferences": CollaborationPreferences,
    "socialLinks": SocialLinks,
    "instaInsights": InstaInsights,
};

const onboardingSectionIds = Object.keys(sectionComponents) as WeddingPlannerSectionKey[];

export default function WeddingPlannerOnboardingPage() {
    //   const [activeSectionId, setActiveSectionId] = useState(onboardingSectionIds[0]);
    const router = useRouter();
    const store = useWeddingPlannerStore();
    const { handleValidations } = handleWeddingPlannerValidations();
    const { user } = useAuthStore(); // Get authenticated user
    const {
        activeSection,
        setActiveSection,
        setIsSubmitting,
        plannerId,
        setPlannerId,
        updateBasicInformation,
        updateBusinessProfile,
        updateInfluenceNetwork,
        updateCollaborationPreferences,
        updateSocialLinks,
        updateInstaInsights
    } = store;
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    // Create a ref for every section (Photos removed)
    const sectionRefs = {
        "basicInformation": useRef<any>(null),
        "businessProfile": useRef<any>(null),
        "influenceNetwork": useRef<any>(null),
        "collaborationPreferences": useRef<any>(null),
        "socialLinks": useRef<any>(null),
        "instaInsights": useRef<any>(null),
    };

    useEffect(() => {
        const fetchWeddingPlannerDetails = async () => {
            if (!user?.id) return; // Don't fetch if user is not loaded

            try {
                let response;
                if (plannerId) {
                    // If ID is already in store, fetch by ID
                    response = await api.get(`/wedding_planner/${plannerId}`);
                } else {
                    // Otherwise, fetch by the authenticated user's ID
                    response = await api.get("/wedding_planner/by-user", {
                        params: { user_id: user.id },
                    });
                }

                const data = response.data;
                if (!data) throw new Error("Planner not found");

                console.log("Fetched Planner Data:", data);

                // --- Update store sections ---
                setPlannerId(data.id);
                setCurrentIndex(data.onboarding_step || 0);

                // Section 1: Basic Information
                updateBasicInformation({
                    fullName: data.full_name || "",
                    businessName: data.business_name || "",
                    email: data.email || "",
                    internalPhone: data.internal_phone || "",
                    whatsappPhone: data.whatsapp_phone || "",
                    publicPhone: data.public_phone || "",
                });

                // Section 2: Business Profile
                updateBusinessProfile({
                    clientPersona: data.client_persona || null,
                    weddingAestheticStyles: data.wedding_aesthetic_styles || [],
                    baseLocation: data.base_location || "",
                    primaryCities: data.primary_cities || [],
                    averageWeddingBudget: data.average_wedding_budget || null,
                    weddingsManagedLastYear: data.weddings_managed_last_year || null,
                    averageGuestSize: data.average_guest_size || null,
                    yearsOfExperience: data.years_of_experience || null,
                    teamSize: data.team_size || null,
                });

                // Section 3: Influence & Network
                updateInfluenceNetwork({
                    clientAcquisationMethods: data.client_acquisation_methods || [],
                    assistsWithOutfits: !!data.assists_with_outfits,
                    recommendsDesigners: !!data.recommends_designers,
                    partnerDesigners: data.partner_designers || [],
                    bridesGuidedPerYear: data.brides_guided_per_year || null,
                    collaboratesWithStylistsMuas: !!data.collaborates_with_stylists_muas,
                    recommendedFashionCategories: data.recommended_fashion_categories || [],
                    partnerVendorHandles: data.partner_vendor_handles || {}, // Default to empty object
                    referralPotential: data.referral_potential || null,
                });

                // Section 4: Collaboration Preferences
                updateCollaborationPreferences({
                    interestedInCollaborationsWith: data.interested_in_collaborations_with || [],
                    preferredCollaborationType: data.preferred_collaboration_type || [],
                    preferredCommissionModel: data.preferred_commission_model || null,
                    barterAcceptance: data.barter_acceptance || "Depends",
                    monthlyCollaborationsOpenTo: data.monthly_collaborations_open_to || null,
                });

                // Section 5: Social Links (as per component split)
                updateSocialLinks({
                    instagramUrl: data.instagram_url || "",
                    youtubeLink: data.youtube_link || "",
                    websiteUrl: data.website_url || "",
                    facebookLink: data.facebook_link || "",
                    // These fields seem to be in the wrong type, but hydrating them here
                    // as per your store's `SocialLinks` type.
                    totalFollowers: data.total_followers || "",
                    totalPosts: data.total_posts || "",
                    engagementRate: data.engagement_rate || "",
                    averageStoryViews: data.average_story_views || "",
                    averageReelViews: data.average_reel_views || "",
                });

                // Section 6: Insta Insights (parsing strings to numbers)
                updateInstaInsights({
                    totalFollowers: data.total_followers || null,
                    totalPosts: data.total_posts || null,
                    engagementRate: data.engagement_rate || null,
                    averageStoryViews: data.average_story_views || null,
                    averageReelViews: data.average_reel_views || null,
                });

            } catch (error) {
                console.error("Error fetching wedding planner details:", error);
                toast.error("Failed to load your profile. Please try again.");
            }
        };

        fetchWeddingPlannerDetails();
    }, [
        user?.id,
        plannerId,
        setPlannerId,
        updateBasicInformation,
        updateBusinessProfile,
        updateInfluenceNetwork,
        updateCollaborationPreferences,
        updateSocialLinks,
        updateInstaInsights
    ]);
    // ===================================================

    const handleFinalSubmit = async () => {
        const allData = onboardingSectionIds.map(id => sectionRefs[id].current?.getData());

        if (allData.some(data => !data)) {
            alert("Could not retrieve data from all sections.");
            return;
        }

        // Combine all data objects into one (no need to handle photos)
        const finalData = Object.assign({}, ...allData);

        const apiFormData = new FormData();

        // Append all fields to FormData
        Object.entries(finalData).forEach(([key, value]: [string, any]) => {
            if (Array.isArray(value)) {
                value.forEach(item => apiFormData.append(key, item));
            } else if (value !== null && value !== undefined) {
                apiFormData.append(key, String(value));
            }
        });

        console.log("Submitting WP form data:", Object.fromEntries(apiFormData.entries()));
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/wedding_planners/onboard`;

        // try {
        //   ... your fetch logic will go here ...
        // } catch (error) {
        //   ...
        // }
    };

    //   const handleNext = () => {
    //     const currentIndex = onboardingSectionIds.indexOf(activeSectionId);
    //     if (currentIndex < onboardingSectionIds.length - 1) {
    //       setActiveSectionId(onboardingSectionIds[currentIndex + 1]);
    //     } else {
    //       handleFinalSubmit();
    //     }
    //   };
    console.log("Planner ID: ", plannerId);
    const handleSaveAndNext = async () => {
        const isValid = handleValidations();
        if (isValid === false) return;
        const currentData = store[activeSection];
        const currentIndex = onboardingSectionIds.indexOf(activeSection);

        setIsSubmitting(true);
        const toastId = toast.loading(`Saving ${activeSection}...`);
        try {
            const mappedData = mapWeddingPlannerDataToBackend(activeSection, currentData);

            const payload = { ...mappedData, onboarding_step: currentIndex + 1 };
            console.log("update payload", payload);
            await api.put(`/wedding_planner/update/${plannerId}`, payload);

            toast.success("Saved successfully!", { id: toastId });

            if (currentIndex < onboardingSectionIds.length - 1) {
                setActiveSection(onboardingSectionIds[currentIndex + 1]);
                setCurrentIndex(currentIndex + 1);
            } else {
                toast.success("🎉 Onboarding complete!");
                router.push("/wedding_planner_dashboard");
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
    return (
        <div className="min-h-screen bg-gray-100">
            <Header title="Attirelly" actions={<div>...</div>} />
            <div className="flex flex-col md:flex-row gap-6 p-6 justify-center">
                <WeddingPlannerSidebar activeSectionId={activeSection} onSectionClick={setActiveSection} currentIndex={currentIndex} />
                <div className="flex flex-col gap-3 rounded-md bg-gray-100">
                    {onboardingSectionIds.map(id => {
                        const Component = sectionComponents[id];
                        const isActive = id === activeSection;
                        const isLastStep = id === onboardingSectionIds[onboardingSectionIds.length - 1];

                        return (
                            <div key={id} style={{ display: isActive ? 'block' : 'none' }}>
                                <Component
                                    ref={sectionRefs[id]}
                                    onNext={handleSaveAndNext}
                                    isLastStep={isLastStep}
                                />
                            </div>
                        );
                    })}
                    <button
                        className="bg-black text-white px-6 py-3 rounded-lg ml-auto cursor-pointer"
                        onClick={handleSaveAndNext}
                    >
                        {activeSection === "instaInsights" ? "Submit" : "Next"}
                    </button>
                </div>
            </div>
        </div>
    );
}