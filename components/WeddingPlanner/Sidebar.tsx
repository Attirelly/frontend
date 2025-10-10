'use client';

import Image from 'next/image';
import React from 'react';

interface WeddingPlannerSidebarProps {
  activeSectionId: string;
  onSectionClick: (id: string) => void;
}

// Define the sections for the Wedding Planner onboarding flow
const sections = [
  {
    id: 'planner-details',
    title: 'Business Details',
    desc: 'Enter your company name, contact, and location.',
    iconUrl: '/OnboardingSections/business_details.png', 
  },
  {
    id: 'planner-pricing',
    title: 'Pricing & Packages',
    desc: 'Set your minimum price and package tiers.',
    iconUrl: '/OnboardingSections/price_filters.png', 
  },
  // --- FIX: UNCOMMENTED/RE-ADDED SERVICES SECTION HERE ---
  {
    id: 'planner-services',
    title: 'Services Offered',
    desc: 'Define the types of planning services you provide.',
    iconUrl: '/OnboardingSections/where_to_sell.png', // Reusing an appropriate icon
  },
  // -----------------------------------------------------
  {
    id: 'planner-social-links',
    title: 'Social Links',
    desc: 'Connect your Instagram and WhatsApp accounts.',
    iconUrl: '/OnboardingSections/social_links.png', // Using the appropriate icon
  },
  {
    id: 'planner-photos',
    title: 'Portfolio Photos',
    desc: 'Upload high-quality images of your work.',
    iconUrl: '/OnboardingSections/store_photos.png', 
  },
];

// --- Sub-component for Mobile View (Code remains the same) ---
const MobileView = ({ activeSectionId, onSectionClick }: WeddingPlannerSidebarProps) => {
// ... (rest of the MobileView component code)
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
                // Removed the rounded-full object-cover class to keep the icon look clean
                className="w-7 h-7 mb-1" 
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

// --- Sub-component for Desktop View (Code remains the same) ---
const DesktopView = ({ activeSectionId, onSectionClick }: WeddingPlannerSidebarProps) => {
// ... (rest of the DesktopView component code)
  return (
    <div className="bg-white p-4 rounded-2xl w-full max-w-sm self-start text-black">
      <h2 className="text-lg font-bold mb-4">Complete your profile</h2>
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

export default function WeddingPlannerSidebar({ activeSectionId, onSectionClick }: WeddingPlannerSidebarProps) {
  return (
    <>
      {/* Mobile view */}
      <div className="block md:hidden">
        <MobileView activeSectionId={activeSectionId} onSectionClick={onSectionClick} />
      </div>
      {/* Desktop view */}
      <div className="hidden md:block">
        <DesktopView activeSectionId={activeSectionId} onSectionClick={onSectionClick} />
      </div>
    </>
  );
}