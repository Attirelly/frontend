// 'use client';

// import { useState, useRef } from 'react';

// // Import all your components
// import Header from '@/components/Header';
// import InfluencerSidebar from '@/components/Influencer/Sidebar';
// import BasicInformation from '@/components/Influencer/Sections/BasicInformation';
// import SocialPreference from '@/components/Influencer/Sections/SocialPreference';
// import AudienceInsights from '@/components/Influencer/Sections/AudienceInsights';
// import CollaborationPreferences from '@/components/Influencer/Sections/CollaborationPreferences';
// import PricingStructure from '@/components/Influencer/Sections/PricingStructure';
// import PastWork from '@/components/Influencer/Sections/PastWork';
// import LocationAvailability from '@/components/Influencer/Sections/LocationAvailability';
// import InfluencerPhotos from '@/components/Influencer/Sections/InfluencerPhotos';

// // Map of ALL section IDs to their components
// const sectionComponents: { [key: string]: React.FC<any> } = {
//   'basic-information': BasicInformation,
//   'social-preference': SocialPreference,
//   'audience-insights': AudienceInsights,
//   'collaboration-preferences': CollaborationPreferences,
//   'pricing-structure': PricingStructure,
//   'past-work': PastWork,
//   'location-availability': LocationAvailability,
//   'influencer-photos': InfluencerPhotos,
// };

// const onboardingSectionIds = Object.keys(sectionComponents);

// export default function InfluencerOnboardingPage() {
//   const [activeSectionId, setActiveSectionId] = useState(onboardingSectionIds[0]);

//   // Create a ref for every section
//   const sectionRefs = {
//     'basic-information': useRef<any>(null),
//     'social-preference': useRef<any>(null),
//     'audience-insights': useRef<any>(null),
//     'collaboration-preferences': useRef<any>(null),
//     'pricing-structure': useRef<any>(null),
//     'past-work': useRef<any>(null),
//     'location-availability': useRef<any>(null),
//     'influencer-photos': useRef<any>(null),
//   };

//   const handleFinalSubmit = async () => {
//     // Collect data from all sections using their refs
//     const allData = onboardingSectionIds.map(id => sectionRefs[id].current?.getData());
    
//     if (allData.some(data => !data)) {
//       alert("Could not retrieve data from all sections.");
//       return;
//     }

//     const finalData = Object.assign({}, ...allData);
//     const { profile_photo, additional_photo_1, additional_photo_2, ...formDataFields } = finalData;
//     const apiFormData = new FormData();
    
//     Object.entries(formDataFields).forEach(([key, value]: [string, any]) => {
//       if (Array.isArray(value)) {
//         value.forEach(item => apiFormData.append(key, item));
//       } else if (value !== null && value !== undefined) {
//         apiFormData.append(key, String(value));
//       }
//     });

//     if (profile_photo) apiFormData.append('profile_photo', profile_photo);
//     if (additional_photo_1) apiFormData.append('additional_photo_1', additional_photo_1);
//     if (additional_photo_2) apiFormData.append('additional_photo_2', additional_photo_2);
    
//     console.log("Submitting final form data:", Object.fromEntries(apiFormData.entries()));
//     const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/influencers/onboard`;
//     // ... fetch logic ...
//   };

//   const handleNext = () => {
//     const currentIndex = onboardingSectionIds.indexOf(activeSectionId);
//     if (currentIndex < onboardingSectionIds.length - 1) {
//       setActiveSectionId(onboardingSectionIds[currentIndex + 1]);
//     } else {
//       handleFinalSubmit();
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Header title="Attirelly" actions={<div>...</div>} />
//       <div className="flex flex-col md:flex-row gap-6 p-6 justify-center">
//         <InfluencerSidebar activeSectionId={activeSectionId} onSectionClick={setActiveSectionId} />
//         <div className="rounded-md bg-gray-100">
//           {onboardingSectionIds.map(id => {
//             const Component = sectionComponents[id];
//             const isActive = id === activeSectionId;
//             const isLastStep = id === onboardingSectionIds[onboardingSectionIds.length - 1];

//             return (
//               <div key={id} style={{ display: isActive ? 'block' : 'none' }}>
//                 <Component
//                   ref={sectionRefs[id]}
//                   onNext={handleNext}
//                   isLastStep={isLastStep}
//                 />
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }

// In influencer_signup/influencer_onboarding/page.tsx

'use client';

// ✨ No more useState or useRef needed from React
import { useInfluencerStore, InfluencerSectionKey } from '@/store/influencerStore';
 // A good idea for user feedback

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
import InfluencerPhotos from '@/components/Influencer/Sections/InfluencerPhotos'; // Assuming this is your MediaKit component
import { toast } from 'sonner';

// Map of section keys from the store to their components
const sectionComponents: { [key in InfluencerSectionKey]: React.FC<any> } = {
  basicInformation: BasicInformation,
  socialPresence: SocialPreference,
  audienceInsights: AudienceInsights,
  collaborationPreferences: CollaborationPreferences,
  pricingStructure: PricingStructure,
  pastWork: PastWork,
  locationAndAvailability: LocationAvailability,
  mediaKit: InfluencerPhotos, // Mapped 'mediaKit' section to your 'InfluencerPhotos' component
};

const onboardingSectionIds = Object.keys(sectionComponents) as InfluencerSectionKey[];

export default function InfluencerOnboardingPage() {
  // ✨ Get ALL state and actions directly from the Zustand store
  const {
    activeSection,
    setActiveSection,
    setIsSubmitting,
    isSubmitting,
    ...fullStoreData // The rest of the store contains all our form data
  } = useInfluencerStore();

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    toast.loading('Submitting your profile...');

    console.log("Submitting this data directly from the store:", fullStoreData);

    const apiFormData = new FormData();

    // ✨ A more robust helper to flatten the store data for FormData
    // This handles nested objects and arrays correctly.
    const appendFormData = (data: any, parentKey?: string) => {
      if (data && typeof data === 'object' && !(data instanceof File)) {
        Object.keys(data).forEach(key => {
          const newKey = parentKey ? `${parentKey}[${key}]` : key;
          // Skip functions (like the update actions that might be in the spread)
          if(typeof data[key] !== 'function') {
            appendFormData(data[key], newKey);
          }
        });
      } else if (data !== null && data !== undefined) {
        apiFormData.append(parentKey!, data);
      }
    };

    // Flatten the entire store data object
    appendFormData(fullStoreData);
    
    // The mediaKit files need to be appended directly
    if (fullStoreData.mediaKit.profilePhoto) {
      apiFormData.set('mediaKit[profilePhoto]', fullStoreData.mediaKit.profilePhoto);
    }
    if (fullStoreData.mediaKit.portfolioFile) {
      apiFormData.set('mediaKit[portfolioFile]', fullStoreData.mediaKit.portfolioFile);
    }
    // Add any other files you have in the same way...

    console.log("Final FormData to be sent:", Object.fromEntries(apiFormData.entries()));
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/influencers/onboard`;

    try {
      // --- Example Fetch Logic ---
      // const response = await fetch(apiUrl, {
      //   method: 'POST',
      //   body: apiFormData,
      //   // Add authorization headers if needed
      // });

      // if (!response.ok) {
      //   throw new Error('Submission failed!');
      // }

      // const result = await response.json();
      toast.dismiss();
      toast.success('Profile submitted successfully!');
      // router.push('/influencer/dashboard'); // Redirect on success
      
    } catch (error) {
      toast.dismiss();
      toast.error('There was an error submitting your profile.');
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    const currentIndex = onboardingSectionIds.indexOf(activeSection);
    if (currentIndex < onboardingSectionIds.length - 1) {
      const nextSection = onboardingSectionIds[currentIndex + 1];
      // ✨ Use the store's action to navigate
      setActiveSection(nextSection);
    } else {
      // This is the last step, so trigger the final submission
      handleFinalSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="Attirelly" actions={<div>...</div>} />
      <div className="flex flex-col md:flex-row gap-6 p-6 justify-center">
        <InfluencerSidebar
          // 👈 Pass the active section from the store
          activeSectionId={activeSection}
          // 👈 Use the store's action directly for sidebar clicks
          onSectionClick={setActiveSection}
        />
        <div className="rounded-md bg-gray-100">
          {onboardingSectionIds.map(id => {
            const Component = sectionComponents[id];
            // 👈 Check against the active section from the store
            const isActive = id === activeSection;
            const isLastStep = id === onboardingSectionIds[onboardingSectionIds.length - 1];

            return (
              <div key={id} style={{ display: isActive ? 'block' : 'none' }}>
                <Component
                  // ✨ No more ref needed! The component is self-contained.
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