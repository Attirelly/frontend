import { useWeddingPlannerStore } from "@/store/weddingPlannerStore";

export const handleWeddingPlannerValidations = () => {
  const {
    basicInformation,
    businessProfile,
    influenceNetwork,
    collaborationPreferences,
    socialLinks,
    instaInsights,
    activeSection,
  } = useWeddingPlannerStore();

  const handleValidations = () => {
    switch (activeSection) {
      case "basicInformation":
        if (
          !basicInformation.fullName ||
          !basicInformation.businessName ||
          !basicInformation.email ||
          !basicInformation.internalPhone ||
          !basicInformation.whatsappPhone
        ) {
          alert("Please fill out all mandatory fields in Basic Information.");
          return false;
        }
        break;

      case "businessProfile":
        if (
          !businessProfile.clientPersona ||
          businessProfile.weddingAestheticStyles.length === 0 ||
          !businessProfile.baseLocation ||
          businessProfile.primaryCities.length === 0 ||
          !businessProfile.averageWeddingBudget ||
          !businessProfile.weddingsManagedLastYear ||
          !businessProfile.averageGuestSize ||
          !businessProfile.yearsOfExperience ||
          !businessProfile.teamSize
        ) {
          alert("Please fill out all mandatory fields in Business Profile.");
          return false;
        }
        break;

      case "influenceNetwork":
        if (
          influenceNetwork.clientAcquisationMethods.length === 0 ||
          influenceNetwork.assistsWithOutfits === null || 
          influenceNetwork.recommendsDesigners === null ||
          influenceNetwork.partnerDesigners.length === 0 ||
          !influenceNetwork.bridesGuidedPerYear ||
          influenceNetwork.collaboratesWithStylistsMuas === null ||
          influenceNetwork.recommendedFashionCategories.length === 0 ||
          !influenceNetwork.referralPotential
        ) {
          alert("Please fill out all mandatory fields in Influence & Network.");
          return false;
        }
        break;

      case "collaborationPreferences":
        if (
          collaborationPreferences.interestedInCollaborationsWith.length === 0 ||
          collaborationPreferences.preferredCollaborationType.length === 0 ||
          !collaborationPreferences.preferredCommissionModel ||
          !collaborationPreferences.barterAcceptance ||
          !collaborationPreferences.monthlyCollaborationsOpenTo
        ) {
          alert("Please fill out all mandatory fields in Collaboration Preferences.");
          return false;
        }
        break;

      case "socialLinks":
        if (
          !socialLinks.instagramUrl
        ) {
          alert("Please fill out all mandatory fields in Social Links.");
          return false;
        }
        break;

      case "instaInsights":
        if (
          !instaInsights.totalFollowers ||
          !instaInsights.totalPosts ||
          !instaInsights.engagementRate ||
          !instaInsights.averageStoryViews ||
          !instaInsights.averageReelViews
        ) {
          alert("Please fill out all mandatory fields in Insta Insights.");
          return false;
        }   
        break;

      default:
        return true;
    }

    // If no case returned false, validation passed for this section
    return true;
  };

  return { handleValidations };
};