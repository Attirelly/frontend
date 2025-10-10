'use client';

import { useState } from 'react';

// Import Components
import Header from '@/components/Header';
import WeddingPlannerSidebar from '@/components/WeddingPlanner/Sidebar';
import WeddingPlannerDetails from '@/components/WeddingPlanner/Sections/WeddingPlannerDetails';
import WeddingPlannerSocialLinks from '@/components/WeddingPlanner/Sections/WeddingPlannerSocialLinks';
import WeddingPlannerPricing from '@/components/WeddingPlanner/Sections/WeddingPlannerPricing';
// IMPORT the actual services component here once built, for now, use the placeholder
//  import WeddingPlannerServices from '@/components/WeddingPlanner/Sections/WeddingPlannerServices'; 
import WeddingPlannerPhotos from '@/components/WeddingPlanner/Sections/WeddingPlannerPhotos';


// --- Placeholder Component (Temporary until the real one is built) ---
const WeddingPlannerServicesPlaceholder: React.FC<{ onNext: () => void }> = ({ onNext }) => (
    <div className="bg-white p-8 rounded-lg shadow-sm border text-black">
        <h2 className="text-2xl font-semibold mb-4">Services Offered (Placeholder)</h2>
        <p className="mb-8">This section is currently under construction. Click next to continue the flow.</p>
        <div className="flex justify-end pt-4">
            <button
                onClick={onNext}
                className="px-8 py-3 bg-black text-white rounded-md font-semibold hover:bg-gray-800"
            >
                Next →
            </button>
        </div>
    </div>
);
// ----------------------------------------------------------------------


// Map of section IDs to their components
const sectionComponents: { [key: string]: React.FC<{ onNext: () => void }> } = {
  'planner-details': WeddingPlannerDetails,
  'planner-pricing': WeddingPlannerPricing,
  // --- FIX: Add the services section back using the placeholder ---
  'planner-services': WeddingPlannerServicesPlaceholder,
  // ------------------------------------------------------------
  'planner-social-links': WeddingPlannerSocialLinks,
  'planner-photos': WeddingPlannerPhotos,
};

// Array of all onboarding section IDs to maintain order
// This will now include the services section
const onboardingSectionIds = [
  'planner-details',
  'planner-pricing',
  'planner-services',
  'planner-social-links',
  'planner-photos',
];


export default function WeddingPlannerOnboardingPage() {
  const [activeSectionId, setActiveSectionId] = useState(onboardingSectionIds[0]);

  const handleNext = () => {
    const currentIndex = onboardingSectionIds.indexOf(activeSectionId);
    if (currentIndex < onboardingSectionIds.length - 1) {
      setActiveSectionId(onboardingSectionIds[currentIndex + 1]);
    }
  };

  const handleSectionClick = (id: string) => {
    setActiveSectionId(id);
  };

  // Determine which component to render based on the active ID
  const ActiveComponent = sectionComponents[activeSectionId];

  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        title="Attirelly"
        actions={
          <div>
            <a href="tel:+918699892707" className="text-blue-500 text-[10px] md:text-sm hover:underline">
              Need help? Call +91-8699892707
            </a>
          </div>
        }
      />

      

      <div className="flex flex-col md:flex-row gap-6 p-6 justify-center">
        <WeddingPlannerSidebar
          activeSectionId={activeSectionId}
          onSectionClick={handleSectionClick}
        />
        <div className="rounded-md bg-gray-100"> 
          {/* Ensure component exists before rendering */}
          {ActiveComponent && <ActiveComponent onNext={handleNext} />}
        </div>
      </div>
    </div>
  );
}