// 'use client';

// import { useState } from 'react';
// import { Building2, Filter, MapPin, Share2, Image as ImageIcon, LucideIcon } from 'lucide-react';

// // Import Components
// import Sidebar from '@/components/Stylist/Sidebar';
// import Details from '@/components/Stylist/Sections/Details';
// import Price from '@/components/Stylist/Sections/Price';
// import Availability from '@/components/Stylist/Sections/Availability';
// import SocialLinks from '@/components/Stylist/Sections/SocialLinks';
// import Photos from '@/components/Stylist/Sections/Photos';

// // Define the shape of a section, including the component to render
// export interface OnboardingSection {
//   name: string;
//   icon: LucideIcon;
//   component: React.FC<{ onNext: () => void }>;
// }

// // Array of all onboarding sections
// const onboardingSections: OnboardingSection[] = [
//   { name: 'Business Details', icon: Building2, component: Details },
//   { name: 'Price Filters', icon: Filter, component: Price },
//   { name: 'Mode of Service', icon: MapPin, component: Availability },
//   { name: 'Social Links', icon: Share2, component: SocialLinks },
//   { name: 'Stylist Photos', icon: ImageIcon, component: Photos },
// ];

// export default function OnboardingPage() {
//   const [activeSectionIndex, setActiveSectionIndex] = useState(0);

//   /**
//    * Moves to the next section in the onboarding flow.
//    * It stops at the last section.
//    */
//   const handleNext = () => {
//     setActiveSectionIndex((prevIndex) =>
//       Math.min(prevIndex + 1, onboardingSections.length - 1)
//     );
//   };

//   /**
//    * Sets the active section directly. Used by the sidebar.
//    * @param index - The index of the section to make active.
//    */
//   const handleSectionClick = (index: number) => {
//     setActiveSectionIndex(index);
//   };

//   // Determine which component to render based on the active index
//   const ActiveComponent = onboardingSections[activeSectionIndex].component;

//   return (
//     <div className="flex h-screen bg-gray-50 font-sans">
//       <Sidebar
//         sections={onboardingSections}
//         activeSectionIndex={activeSectionIndex}
//         onSectionClick={handleSectionClick}
//       />
//       <main className="flex-1 p-8 overflow-y-auto">
//         {/* The max-w-4xl and mx-auto will center the content area */}
//         <div className="max-w-4xl mx-auto">
//           {/* Render the active component and pass the handleNext function as a prop */}
//           <ActiveComponent onNext={handleNext} />
//         </div>
//       </main>
//     </div>
//   );
// }


// 'use client';

// import { useState } from 'react';
// import { Building2, Filter, MapPin, Share2, Image as ImageIcon, LucideIcon } from 'lucide-react';

// // Import Components
// import Header from '@/components/Header';
// import Sidebar from '@/components/Stylist/Sidebar';
// import Details from '@/components/Stylist/Sections/Details';
// import Price from '@/components/Stylist/Sections/Price';
// import Availability from '@/components/Stylist/Sections/Availability';
// import SocialLinks from '@/components/Stylist/Sections/SocialLinks';
// import Photos from '@/components/Stylist/Sections/Photos';

// // Define the shape of a section, including the component to render
// export interface OnboardingSection {
//   name: string;
//   icon: LucideIcon;
//   component: React.FC<{ onNext: () => void }>;
// }

// // Array of all onboarding sections
// const onboardingSections: OnboardingSection[] = [
//   { name: 'Business Details', icon: Building2, component: Details },
//   { name: 'Price Filters', icon: Filter, component: Price },
//   { name: 'Mode of Service', icon: MapPin, component: Availability },
//   { name: 'Social Links', icon: Share2, component: SocialLinks },
//   { name: 'Stylist Photos', icon: ImageIcon, component: Photos },
// ];

// export default function OnboardingPage() {
//   const [activeSectionIndex, setActiveSectionIndex] = useState(0);

//   const handleNext = () => {
//     setActiveSectionIndex((prevIndex) =>
//       Math.min(prevIndex + 1, onboardingSections.length - 1)
//     );
//   };

//   const handleSectionClick = (index: number) => {
//     setActiveSectionIndex(index);
//   };

//   const ActiveComponent = onboardingSections[activeSectionIndex].component;

//   return (

    // <div className="min-h-screen bg-gray-100">
    //       <Header
    //         title="Attirelly"
    //         actions={
    //           <div>
    //             <a href="tel:+918699892707" className="text-blue-500 text-[10px] md:text-sm hover:underline">
    //               Need help? Call +91-8699892707
    //             </a>
    //           </div>
    //         }
//     />

//     <div className="flex min-h-screen bg-gray-100 font-sans">
//       <Sidebar
//         sections={onboardingSections}
//         activeSectionIndex={activeSectionIndex}
//         onSectionClick={handleSectionClick}
//       />
//       <main className="flex-1 p-8 overflow-y-auto">
//         <div className="max-w-7xl mx-auto">
//           <ActiveComponent onNext={handleNext} />
//         </div>
//       </main>
//     </div>

//    </div> 
//   );
// }

// 'use client';

// import { useState, useRef } from 'react';

// // Import Components
// import Header from '@/components/Header';
// import Sidebar from '@/components/Stylist/Sidebar';
// import Details from '@/components/Stylist/Sections/Details';
// import Price from '@/components/Stylist/Sections/Price';
// import Availability from '@/components/Stylist/Sections/Availability';
// import SocialLinks from '@/components/Stylist/Sections/SocialLinks';
// import Photos from '@/components/Stylist/Sections/Photos';

// // Map of section IDs to their components
// const sectionComponents: { [key: string]: React.FC<{ onNext: () => void }> } = {
//   'business-details': Details,
//   'price-filters': Price,
//   'mode-of-service': Availability,
//   'social-links': SocialLinks,
//   'stylist-photos': Photos,
// };

// // Array of all onboarding section IDs to maintain order
// const onboardingSectionIds = Object.keys(sectionComponents);

// export default function OnboardingPage() {
//   const [activeSectionId, setActiveSectionId] = useState(onboardingSectionIds[0]);

//   // Create refs to "get" data from each section
//   const detailsRef = useRef<any>(null);
//   const priceRef = useRef<any>(null);
//   const availabilityRef = useRef<any>(null);
//   const socialRef = useRef<any>(null);
//   const photosRef = useRef<any>(null);

//   const sectionRefs = {
//     'business-details': detailsRef,
//     'price-filters': priceRef,
//     'mode-of-service': availabilityRef,
//     'social-links': socialRef,
//     'stylist-photos': photosRef,
//   };

//   const handleFinalSubmit = async () => {
//     // Collect data from all sections using the refs
//     // ADD THIS LOG AT THE VERY TOP
//   console.log('SUCCESS: handleFinalSubmit function has started!');
//     const detailsData = detailsRef.current?.getData();
//     const priceData = priceRef.current?.getData();
//     const availabilityData = availabilityRef.current?.getData();
//     const socialData = socialRef.current?.getData();
//     const photoData = photosRef.current?.getData();

//     // Combine all data
//     const finalData = { ...detailsData, ...priceData, ...availabilityData, ...socialData };
    
//     // Create FormData for the API call
//     const apiFormData = new FormData();
//     Object.entries(finalData).forEach(([key, value]: [string, any]) => {
//       if (Array.isArray(value)) {
//         value.forEach(item => apiFormData.append(key, item));
//       } else if (value) {
//         apiFormData.append(key, value);
//       }
//     });

//     apiFormData.append('profile_photo', photoData.profile_photo);
//     apiFormData.append('additional_photo_1', photoData.additional_photo_1);
//     apiFormData.append('additional_photo_2', photoData.additional_photo_2);

//     // Send to backend
//     const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/stylists/onboard`;
//     try {
//       const response = await fetch(apiUrl, { method: 'POST', body: apiFormData });
//       if (response.ok) {
//         alert('Stylist onboarded successfully!');
//       } else {
//         const errorData = await response.json();
//         alert(`Error: ${errorData.detail?.[0]?.msg || 'Something went wrong.'}`);
//       }
//     } catch (error) {
//       alert('A network error occurred. Please try again.');
//     }
//   };

//   const handleNext = () => {
//     console.log('LOG: Parent handleNext called. Current section:', activeSectionId);
//     const currentIndex = onboardingSectionIds.indexOf(activeSectionId);
//     if (currentIndex < onboardingSectionIds.length - 1) {
//       setActiveSectionId(onboardingSectionIds[currentIndex + 1]);
//     }
//      console.log('LOG: Last step detected, calling handleFinalSubmit...');
//   };

//   const handleSectionClick = (id: string) => {
//     setActiveSectionId(id);
//   };

//   // Determine which component to render based on the active ID
//   const ActiveComponent = sectionComponents[activeSectionId];

//   return (


//   <div className="min-h-screen bg-gray-100">
//       <Header
//         title="Attirelly"
//           actions={
//         <div>
//           <a href="tel:+918699892707" className="text-blue-500 text-[10px] md:text-sm hover:underline">
//           Need help? Call +91-8699892707
//           </a>
//         </div>
//     }
//     />



//     <div className="flex flex-col md:flex-row gap-6 p-6 justify-center">
//       <Sidebar
//         activeSectionId={activeSectionId}
//         onSectionClick={handleSectionClick}
//       />
//       {/* <main className="flex-1 overflow-y-auto"> */}
//         <div className="rounded-md bg-gray-100">
//           <ActiveComponent onNext={handleNext} />
//         </div>
//       {/* </main> */}
//     </div>      

//     </div>
//   );
// }


'use client';

import { useState, useRef } from 'react';

// Import Components
import Header from '@/components/Header';
import Sidebar from '@/components/Stylist/Sidebar';
import Details from '@/components/Stylist/Sections/Details';
import Price from '@/components/Stylist/Sections/Price';
import Availability from '@/components/Stylist/Sections/Availability';
import SocialLinks from '@/components/Stylist/Sections/SocialLinks';
import Photos from '@/components/Stylist/Sections/Photos';

// Map of section IDs to their components
const sectionComponents: { [key: string]: React.FC<any> } = {
  'business-details': Details,
  'price-filters': Price,
  'mode-of-service': Availability,
  'social-links': SocialLinks,
  'stylist-photos': Photos,
};

// Array of all onboarding section IDs to maintain order
const onboardingSectionIds = Object.keys(sectionComponents);

export default function OnboardingPage() {
  const [activeSectionId, setActiveSectionId] = useState(onboardingSectionIds[0]);

  // Create refs to "get" data from each section
  const detailsRef = useRef<any>(null);
  const priceRef = useRef<any>(null);
  const availabilityRef = useRef<any>(null);
  const socialRef = useRef<any>(null);
  const photosRef = useRef<any>(null);

  const sectionRefs: { [key: string]: React.RefObject<any> } = {
    'business-details': detailsRef,
    'price-filters': priceRef,
    'mode-of-service': availabilityRef,
    'social-links': socialRef,
    'stylist-photos': photosRef,
  };

  const handleFinalSubmit = async () => {
    console.log('SUCCESS: handleFinalSubmit function has started!');
    
    const detailsData = detailsRef.current?.getData();
    const priceData = priceRef.current?.getData();
    const availabilityData = availabilityRef.current?.getData();
    const socialData = socialRef.current?.getData();
    const photoData = photosRef.current?.getData();

    // Added a check to prevent errors if data is missing
    if (!detailsData || !priceData || !availabilityData || !socialData || !photoData) {
      alert("Could not retrieve data from all sections. Please check the console for errors.");
      console.error("Data retrieval failed:", { detailsData, priceData, availabilityData, socialData, photoData });
      return;
    }

    const finalData = { ...detailsData, ...priceData, ...availabilityData, ...socialData };
    
    const apiFormData = new FormData();
    Object.entries(finalData).forEach(([key, value]: [string, any]) => {
      if (Array.isArray(value)) {
        value.forEach(item => apiFormData.append(key, item));
      } else if (value) {
        apiFormData.append(key, value);
      }
    });

    if (photoData?.profile_photo) apiFormData.append('profile_photo', photoData.profile_photo);
    if (photoData?.additional_photo_1) apiFormData.append('additional_photo_1', photoData.additional_photo_1);
    if (photoData?.additional_photo_2) apiFormData.append('additional_photo_2', photoData.additional_photo_2);

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/stylists/onboard`;
    try {
      const response = await fetch(apiUrl, { method: 'POST', body: apiFormData });
      if (response.ok) {
        alert('Stylist onboarded successfully!');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.detail?.[0]?.msg || 'Something went wrong.'}`);
      }
    } catch (error) {
      alert('A network error occurred. Please try again.');
    }
  };

  // ==========================================================
  // >> FIX 1: Corrected the logic for handling the next step
  // ==========================================================
  const handleNext = () => {
    console.log('LOG: Parent handleNext called. Current section:', activeSectionId);
    const currentIndex = onboardingSectionIds.indexOf(activeSectionId);

    if (currentIndex < onboardingSectionIds.length - 1) {
      setActiveSectionId(onboardingSectionIds[currentIndex + 1]);
    } else {
      console.log('LOG: Last step detected, calling handleFinalSubmit...');
      handleFinalSubmit();
    }
  };

  const handleSectionClick = (id: string) => {
    setActiveSectionId(id);
  };

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
        <Sidebar
          activeSectionId={activeSectionId}
          onSectionClick={handleSectionClick}
        />
        <div className="rounded-md bg-gray-100">
          {/* ========================================================== */}
          {/* >> FIX 2: Render all components but hide inactive ones    */}
          {/* This ensures all the data is available on the final step */}
          {/* ========================================================== */}
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