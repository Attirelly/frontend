'use client';

import Image from 'next/image';
import React from 'react';

interface WeddingPlannerSidebarProps {
  activeSectionId: string;
  onSectionClick: (id: string) => void;
}

// Updated sections array with the 'Photos' section removed
const sections = [
    { id: 'basicInformation', title: 'Basic Information', desc: 'Your business and contact details.', iconUrl: '/OnboardingSections/business_details.png' },
    { id: 'businessProfile', title: 'Business Profile & Scale', desc: 'Your clientele, style, and scale.', iconUrl: '/OnboardingSections/analytics.png' },
    { id: 'influenceNetwork', title: 'Influence & Network', desc: 'Your professional network.', iconUrl: '/OnboardingSections/collab.png' },
    { id: 'collaborationPreferences', title: 'Collaboration Preferences', desc: 'Define how you like to collaborate.', iconUrl: '/OnboardingSections/collab.png' },
    { id: 'socialLinks', title: 'Social Links', desc: 'Connect your social media.', iconUrl: '/OnboardingSections/social_links.png' },
    { id: 'instaInsights', title: 'Insta Insights', desc: 'Your key Instagram metrics.', iconUrl: '/OnboardingSections/analytics.png' },
];

// --- Sub-component for Mobile View ---
const MobileView = ({ activeSectionId, onSectionClick }: WeddingPlannerSidebarProps) => {
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
const DesktopView = ({ activeSectionId, onSectionClick }: WeddingPlannerSidebarProps) => {
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
      <div className="block md:hidden">
        <MobileView activeSectionId={activeSectionId} onSectionClick={onSectionClick} />
      </div>
      <div className="hidden md:block">
        <DesktopView activeSectionId={activeSectionId} onSectionClick={onSectionClick} />
      </div>
    </>
  );
}