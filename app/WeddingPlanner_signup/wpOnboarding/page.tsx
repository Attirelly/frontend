'use client';

import { useState, useRef } from 'react';

// Import all components (except Photos)
import Header from '@/components/Header';
import WeddingPlannerSidebar from '@/components/WeddingPlanner/Sidebar';
import BasicInformation from '@/components/WeddingPlanner/Sections/BasicInformation';
import BusinessProfile from '@/components/WeddingPlanner/Sections/BusinessProfile';
import InfluenceNetwork from '@/components/WeddingPlanner/Sections/InfluenceNetwork';
import CollaborationPreferences from '@/components/WeddingPlanner/Sections/CollaborationPreferences';
import SocialLinks from '@/components/WeddingPlanner/Sections/SocialLinks';
import InstaInsights from '@/components/WeddingPlanner/Sections/InstaInsights';

// Map of all section IDs to their components (Photos removed)
const sectionComponents: { [key: string]: React.FC<any> } = {
  'basic-information': BasicInformation,
  'business-profile': BusinessProfile,
  'influence-network': InfluenceNetwork,
  'collaboration-preferences': CollaborationPreferences,
  'social-links': SocialLinks,
  'insta-insights': InstaInsights,
};

const onboardingSectionIds = Object.keys(sectionComponents);

export default function WeddingPlannerOnboardingPage() {
  const [activeSectionId, setActiveSectionId] = useState(onboardingSectionIds[0]);

  // Create a ref for every section (Photos removed)
  const sectionRefs = {
    'basic-information': useRef<any>(null),
    'business-profile': useRef<any>(null),
    'influence-network': useRef<any>(null),
    'collaboration-preferences': useRef<any>(null),
    'social-links': useRef<any>(null),
    'insta-insights': useRef<any>(null),
  };

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
        <WeddingPlannerSidebar activeSectionId={activeSectionId} onSectionClick={setActiveSectionId} />
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