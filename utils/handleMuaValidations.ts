import { useMakeupArtistStore } from "@/store/makeUpArtistStore";

export const handleMuaValidations = () => {
    const { basicInformation, clientServiceProfile, fashionOutfitInfluence, socialCollabs, attirellyCollab, commissionProgram, socialLinks, instagramInsights, artistLocation, mediaBio, activeSection } = useMakeupArtistStore();
    const handleValidations = () => {
        switch (activeSection) {
            case "basicInformation":
                if(!basicInformation.fullName || !basicInformation.email || !basicInformation.whatsappNumber || !basicInformation.yearsExperience || !basicInformation.teamSize || !basicInformation.artistType) {
                    alert("Please fill all required fields in Basic Information.");
                    return false;
                }
                return true;

            case "clientServiceProfile":
                if (!clientServiceProfile.clientTypes.length || !clientServiceProfile.occasionFocus.length || !clientServiceProfile.avgBookingsPerMonth || !clientServiceProfile.avgPriceRange) {
                    alert("Please fill all required fields in Client Service Profile.");
                    return false;
                }
                return true;

            case "fashionOutfitInfluence":
                if(!fashionOutfitInfluence.guidanceTypes.length || !fashionOutfitInfluence.guidesOnTrends.length) {
                    alert("Please fill all required fields in Fashion Outfit Influence.");
                    return false;
                }
                return true;

            case "socialCollabs":
                if(!socialCollabs.collabTypes.length || !socialCollabs.collabNature || !socialCollabs.collabFrequency) {
                    alert("Please fill all required fields in Social Media Collaborations.");
                    return false;
                }
                return true;

            case "attirellyCollab":
                if(!attirellyCollab.attirellyCollabTypes.length || !attirellyCollab.attirellyCollabModel || !attirellyCollab.attirellyCollabFrequency || !attirellyCollab.referralPotential) {
                    alert("Please fill all required fields in Attirelly Collaboration.");
                    return false;
                }
                return true;

            case "commissionProgram":
                if(!commissionProgram.avgMonthlyReferrals){
                    alert("Please fill all required fields in Commission Program.");
                    return false;
                }
                return true;

            case "socialLinks":
                const hasAnyLink = Object.values(socialLinks.socialLinks).some((val) => val.trim() !== "");
                if (!hasAnyLink) {
                    alert("Please add at least one social media link.");
                    return false;
                }
                return true;

            case "instagramInsights":
                if(!instagramInsights.instagramHandle.trim()){
                    alert("Please provide your Instagram handle.");
                    return false;
                }
                return true;

            case "artistLocation":
                if(!artistLocation.state || !artistLocation.city){
                    alert("Please fill all required fields in Artist Location.");
                    return false;
                }
                return true;

            case "mediaBio":
                if(!mediaBio.shortBio){
                    alert("Please provide your Short Bio.");
                    return false;
                }
                return true;
            default:
                return true;
        }
    };
    return { handleValidations };
};