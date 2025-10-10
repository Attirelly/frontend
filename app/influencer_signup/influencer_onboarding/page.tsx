// In influencer_signup/influencer_onboarding/page.tsx

'use client';

import { useState, useRef } from 'react';

// Import all your components
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

// Map of ALL section IDs to their components
const sectionComponents: { [key: string]: React.FC<any> } = {
  'basic-information': BasicInformation,
  'social-preference': SocialPreference,
  'audience-insights': AudienceInsights,
  'collaboration-preferences': CollaborationPreferences,
  'pricing-structure': PricingStructure,
  'past-work': PastWork,
  'location-availability': LocationAvailability,
  'influencer-photos': InfluencerPhotos,
};

const onboardingSectionIds = Object.keys(sectionComponents);

export default function InfluencerOnboardingPage() {
  const [activeSectionId, setActiveSectionId] = useState(onboardingSectionIds[0]);

  // Create a ref for every section
  const sectionRefs = {
    'basic-information': useRef<any>(null),
    'social-preference': useRef<any>(null),
    'audience-insights': useRef<any>(null),
    'collaboration-preferences': useRef<any>(null),
    'pricing-structure': useRef<any>(null),
    'past-work': useRef<any>(null),
    'location-availability': useRef<any>(null),
    'influencer-photos': useRef<any>(null),
  };

  const handleFinalSubmit = async () => {
    // Collect data from all sections using their refs
    const allData = onboardingSectionIds.map(id => sectionRefs[id].current?.getData());
    
    if (allData.some(data => !data)) {
      alert("Could not retrieve data from all sections.");
      return;
    }

    const finalData = Object.assign({}, ...allData);
    const { profile_photo, additional_photo_1, additional_photo_2, ...formDataFields } = finalData;
    const apiFormData = new FormData();
    
    Object.entries(formDataFields).forEach(([key, value]: [string, any]) => {
      if (Array.isArray(value)) {
        value.forEach(item => apiFormData.append(key, item));
      } else if (value !== null && value !== undefined) {
        apiFormData.append(key, String(value));
      }
    });

    if (profile_photo) apiFormData.append('profile_photo', profile_photo);
    if (additional_photo_1) apiFormData.append('additional_photo_1', additional_photo_1);
    if (additional_photo_2) apiFormData.append('additional_photo_2', additional_photo_2);
    
    console.log("Submitting final form data:", Object.fromEntries(apiFormData.entries()));
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/influencers/onboard`;
    // ... fetch logic ...
  };

  const handleNext = () => {
    const currentIndex = onboardingSectionIds.indexOf(activeSectionId);
    if (currentIndex < onboardingSectionIds.length - 1) {
      setActiveSectionId(onboardingSectionIds[currentIndex + 1]);
    } else {
      handleFinalSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="Attirelly" actions={<div>...</div>} />
      <div className="flex flex-col md:flex-row gap-6 p-6 justify-center">
        <InfluencerSidebar activeSectionId={activeSectionId} onSectionClick={setActiveSectionId} />
        <div className="rounded-md bg-gray-100">
          {onboardingSectionIds.map(id => {
            const Component = sectionComponents[id];
            const isActive = id === activeSectionId;
            const isLastStep = id === onboardingSectionIds[onboardingSectionIds.length - 1];

            return (
              <div key={id} style={{ display: isActive ? 'block' : 'none' }}>
                <Component
                  ref={sectionRefs[id]}
                  onNext={handleNext}
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