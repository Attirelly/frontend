import { useInfluencerStore } from "@/store/influencerStore";
import { toast } from "sonner";

export const handleInfluencerValidations = () => {
    const {
        basicInformation,
        socialPresence,
        audienceInsights,
        collaborationPreferences,
        pricingStructure,
        pastWork,
        locationAndAvailability,
        mediaKit,
        activeSection
      } = useInfluencerStore();

    const handleValidations = () => {
    // const currentData = store[activeSection];
    switch (activeSection) {
      case "basicInformation":
        if (
          !basicInformation.name ||
          !basicInformation.email ||
          !basicInformation.phoneInternal ||
          !basicInformation.gender_id || // Changed from genderValue
          !basicInformation.age_group_id || // Changed from ageGroup
          basicInformation.languages.length === 0
        ) {
          alert(
            "Please fill out all mandatory fields marked with an asterisk (*)."
          );
          return false;
        }
      case "socialPresence":
        if (
          !socialPresence.primaryPlatform ||
          !socialPresence.socialLinks.instagram ||
          socialPresence.categoryNiche.length === 0 ||
          socialPresence.contentStyle.length === 0
        ) {
          alert(
            "Please fill out all mandatory fields marked with an asterisk (*)."
          );
          return false;
        }

      case "audienceInsights":
        if (
          !audienceInsights.followers.instagram ||
          !audienceInsights.engagementMetrics.engagementRate ||
          !audienceInsights.engagementMetrics.avgLikesPerReel ||
          !audienceInsights.engagementMetrics.avgCommentsPerReel ||
          audienceInsights.topAgeGroups.length === 0
          // ||
          // audienceInsights.topLocations.length === 0
          // !audienceInsights.audienceInterests || audienceInsights.audienceInterests.length === 0
        ) {
          alert(
            "Please fill out all mandatory fields marked with an asterisk (*)."
          );
          return false;
        }

      case "collaborationPreferences":
        if (
          collaborationPreferences.preferredCollabTypes.length === 0 ||
          !collaborationPreferences.openToBarter
          // || !collaborationPreferences.collabFrequency // ⚠️ Uncomment after adding `collabFrequency` to store
        ) {
          alert(
            "Please fill out all mandatory fields marked with an asterisk (*)."
          );
          return false;
        }

      case "pricingStructure":
        const { reel, story, post, campaign_min, campaign_max } =
          pricingStructure.pricing;
        if (
          reel === null ||
          story === null ||
          post === null ||
          campaign_min === null ||
          campaign_max === null
        ) {
          alert(
            "Please fill out all mandatory pricing fields marked with an asterisk (*)."
          );
          return false;
        }
        if (
          reel < 0 ||
          story < 0 ||
          post < 0 ||
          campaign_min < 0 ||
          campaign_max < 0
        ) {
          alert("Prices cannot be negative. Please enter valid amounts.");
          return false;
        }

      case "pastWork":
        if (pastWork.brandsWorkedWith.length === 0) {
          alert("Please add at least one brand you have worked with.");
          return false;
        }

      case "locationAndAvailability":
        if (
          !locationAndAvailability.state ||
          !locationAndAvailability.city ||
          !locationAndAvailability.travelReadiness
        ) {
          alert("Please fill out all mandatory fields marked with *");
          return false;
        }

      case "mediaKit":
        if (mediaKit.profilePhoto && mediaKit.portfolioFile) {
          return true;
        } else {
          toast.error("Please upload all three images before continuing.");
          return false;
        }
    }
  };

    return { handleValidations }
    
    
}