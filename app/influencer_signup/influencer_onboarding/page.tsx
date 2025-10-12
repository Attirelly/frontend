'use client';

import { useInfluencerStore, InfluencerSectionKey } from '@/store/influencerStore';
import { toast } from 'sonner';
import { api } from '@/lib/axios'; // Your pre-configured axios instance
import { useRouter } from 'next/navigation';

// Import all your section components
import Header from '@/components/Header';
import InfluencerSidebar from '@/components/Influencer/Sidebar';
import BasicInformation from '@/components/Influencer/Sections/BasicInformation';
import SocialPreference from '@/components/Influencer/Sections/SocialPreference';
import AudienceInsights from '@/components/Influencer/Sections/AudienceInsights';
import CollaborationPreferences from '@/components/Influencer/Sections/CollaborationPreferences';
import PricingStructure from '@/components/Influencer/Sections/PricingStructure';
import PastWork from '@/components/Influencer/Sections/PastWork';
import LocationAvailability from '@/components/Influencer/Sections/LocationAvailability';
import InfluencerPhotos from '@/components/Influencer/Sections/InfluencerPhotos'; 

// Map of section keys to their corresponding components
const sectionComponents: { [key in InfluencerSectionKey]: React.FC<any> } = {
  basicInformation: BasicInformation,
  socialPresence: SocialPreference,
  audienceInsights: AudienceInsights,
  collaborationPreferences: CollaborationPreferences,
  pricingStructure: PricingStructure,
  pastWork: PastWork,
  locationAndAvailability: LocationAvailability,
  mediaKit: InfluencerPhotos,
};

const onboardingSectionIds = Object.keys(sectionComponents) as InfluencerSectionKey[];

export default function InfluencerOnboardingPage() {
  const store = useInfluencerStore();
  const router = useRouter();
  const { 
    activeSection, 
    setActiveSection, 
    influencerId, 
    setIsSubmitting,
  } = store;

  // This is our centralized "save and navigate" function
  const handleSaveAndNext = async () => {
    const currentData = store[activeSection];
    
    setIsSubmitting(true);
    toast.loading(`Saving ${activeSection}...`);

    try {
      let payload: any = currentData;
      const currentIndex = onboardingSectionIds.indexOf(activeSection);

      payload = { ...payload , "next_step" : currentIndex+1 }

      const respone = await api.put(`influencers/update/${influencerId}` , currentData);
    
      toast.success("Saved successfully!");

      // Navigate to the next section on success
      if (currentIndex < onboardingSectionIds.length - 1) {
        setActiveSection(onboardingSectionIds[currentIndex + 1]);
      } else {
        toast.success("Onboarding complete!");
        router.push('/influencer/dashboard');
      }
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.response?.data?.detail || "Failed to save data.");
      console.error(`Error saving ${activeSection}:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="Attirelly" actions={<div>...</div>} />
      <div className="flex flex-col md:flex-row gap-6 p-6 justify-center">
        <InfluencerSidebar
          activeSectionId={activeSection}
          onSectionClick={setActiveSection}
        />
        <div className="rounded-md bg-gray-100">
          {onboardingSectionIds.map(id => {
            const Component = sectionComponents[id];
            const isActive = id === activeSection;
            const isLastStep = id === onboardingSectionIds[onboardingSectionIds.length - 1];

            return (
              <div key={id} style={{ display: isActive ? 'block' : 'none' }}>
                <Component
                  // ✨ Pass the single, centralized handler to all children
                  onNext={handleSaveAndNext}
                  isLastStep={isLastStep}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}