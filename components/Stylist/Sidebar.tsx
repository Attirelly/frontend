// import type { OnboardingSection } from "@/app/stylist_signup/stylistOnboarding/page";

// // Define the props for the Sidebar component
// interface SidebarProps {
//   sections: Omit<OnboardingSection, 'component'>[]; // Sidebar doesn't need the component part
//   activeSectionIndex: number;
//   onSectionClick: (index: number) => void;
// }

// export default function Sidebar({
//   sections,
//   activeSectionIndex,
//   onSectionClick,
// }: SidebarProps) {
//   return (
//     <aside className="w-72 bg-white border-r p-6 flex flex-col">
//       <header>
//         <h1 className="text-3xl font-bold mb-10">Attirelly</h1>
//         <h2 className="text-sm font-semibold text-gray-500 mb-3 px-2 uppercase tracking-wider">
//           Store Profile
//         </h2>
//       </header>
//       <nav className="flex-1">
//         <ul>
//           {sections.map((section, index) => {
//             const isActive = index === activeSectionIndex;
//             const Icon = section.icon;

//             return (
//               <li key={section.name} className="mb-2">
//                 <button
//                   onClick={() => onSectionClick(index)}
//                   className={`w-full flex items-center p-3 rounded-lg text-left transition-colors duration-200 ease-in-out
//                     ${
//                       isActive
//                         ? 'bg-gray-100 border border-gray-900 text-gray-900 font-semibold shadow-sm'
//                         : 'text-gray-600 hover:bg-gray-50'
//                     }`}
//                 >
//                   <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
//                   <span className="flex-1">{section.name}</span>
//                 </button>
//               </li>
//             );
//           })}
//         </ul>
//       </nav>
//       <div className="mt-auto">
//         <button className="w-full text-left font-semibold p-2 rounded-md hover:bg-gray-100">
//           Log Out
//         </button>
//       </div>
//     </aside>
//   );
// }

// 'use client';

'use client';

import { useRef, useLayoutEffect } from 'react';
import Image from 'next/image';
import type { OnboardingSection } from "@/app/stylist_signup/stylistOnboarding/page";

interface SidebarProps {
  activeSectionId: string;
  onSectionClick: (id: string) => void;
}

const sections = [
  {
    id: 'business-details',
    title: 'Business details',
    desc: 'Enter your business details.',
    iconUrl: '/OnboardingSections/business_details.png',
  },
  {
    id: 'price-filters',
    title: 'Price filters',
    desc: 'Define your service tiers...',
    iconUrl: '/OnboardingSections/price_filters.png',
  },
  {
    id: 'mode-of-service',
    title: 'Mode of Service',
    desc: 'Choose mode of service',
    iconUrl: '/OnboardingSections/where_to_sell.png',
  },
  {
    id: 'social-links',
    title: 'Social links',
    desc: 'Connect your Instagram and WhatsApp accounts.',
    iconUrl: '/OnboardingSections/social_links.png',
  },
  {
    id: 'stylist-photos',
    title: 'Stylist Photos',
    desc: 'Upload your photos.',
    iconUrl: '/OnboardingSections/store_photos.png',
  },
];

// --- Sub-component for Mobile View ---
const MobileView = ({ activeSectionId, onSectionClick }: SidebarProps) => {
  return (
    <nav className="w-full p-2 rounded-lg text-black bg-white">
      <div className="flex flex-row items-stretch space-x-2 overflow-x-auto whitespace-nowrap scrollbar-none">
        {sections.map((section) => {
          const isSelected = activeSectionId === section.id;
          return (
            <button
              key={section.id}
              onClick={() => onSectionClick(section.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition min-w-[90px] ${
                isSelected ? "bg-gray-200" : "bg-transparent"
              } hover:bg-gray-100 cursor-pointer`}
            >
              <Image
                src={section.iconUrl}
                alt={section.title}
                width={28}
                height={28}
                className="w-7 h-7 mb-1 rounded-full object-cover"
              />
              <span className="text-xs font-[400] text-center whitespace-normal">
                {section.title}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

// --- Sub-component for Desktop View ---
const DesktopView = ({ activeSectionId, onSectionClick }: SidebarProps) => {
  return (
    <div className="bg-white p-4 rounded-2xl w-full max-w-sm self-start text-black">
      <h2 className="text-lg font-bold mb-4">Complete your profile</h2>
      {/* <h2 className="text-xl font-bold mb-6">Complete your profile</h2> */}
      <nav>
        <ul className="space-y-4">
          {sections.map((section) => {
            const isCurrent = section.id === activeSectionId;

            return (
              <li key={section.id}>
                <button
                  onClick={() => onSectionClick(section.id)}
                  className={`flex items-start text-left w-full p-4 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black
                    ${isCurrent ? 'border-black bg-gray-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                >
                  <Image
                    src={section.iconUrl}
                    alt={section.title}
                    width={24}
                    height={24}
                    className="h-6 w-6 flex-shrink-0"
                  />
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-900">{section.title}</h3>
                    <p className="text-gray-600 text-sm">{section.desc}</p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default function Sidebar({ activeSectionId, onSectionClick }: SidebarProps) {
  return (
    <>
      <div className="block md:hidden">
        <MobileView activeSectionId={activeSectionId} onSectionClick={onSectionClick} />
      </div>
      <div className="hidden md:block">
        <DesktopView activeSectionId={activeSectionId} onSectionClick={onSectionClick} />
      </div>
    </>
  );
}