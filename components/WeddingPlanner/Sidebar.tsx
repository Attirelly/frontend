'use client';

import { WeddingPlannerSectionKey } from '@/store/weddingPlannerStore';
import Image from 'next/image';
import React from 'react';

interface WeddingPlannerSidebarProps {
  currentIndex?: number;
  activeSectionId: WeddingPlannerSectionKey;
  onSectionClick: (id: WeddingPlannerSectionKey) => void;
}

// Updated sections array with the 'Photos' section removed
const sections: {
  id: WeddingPlannerSectionKey;
  title: string;
  desc: string;
  iconUrl: string;
}[] = [
  { id: 'basicInformation', title: 'Basic Information', desc: 'Your business and contact details.', iconUrl: '/OnboardingSections/business_details.png' },
  { id: 'businessProfile', title: 'Business Profile & Scale', desc: 'Your clientele, style, and scale.', iconUrl: '/OnboardingSections/analytics.png' },
  { id: 'influenceNetwork', title: 'Influence & Network', desc: 'Your professional network.', iconUrl: '/OnboardingSections/collab.png' },
  { id: 'collaborationPreferences', title: 'Collaboration Preferences', desc: 'Define how you like to collaborate.', iconUrl: '/OnboardingSections/collab.png' },
  { id: 'socialLinks', title: 'Social Links', desc: 'Connect your social media.', iconUrl: '/OnboardingSections/social_links.png' },
  { id: 'instaInsights', title: 'Insta Insights', desc: 'Your key Instagram metrics.', iconUrl: '/OnboardingSections/analytics.png' },
];

// --- Sub-component for Mobile View ---
const MobileView = ({ currentIndex=6,activeSectionId, onSectionClick }: WeddingPlannerSidebarProps) => {
  return (
    <nav className="w-full p-2 rounded-lg text-black bg-white">
      <div className="flex flex-row items-stretch space-x-2 overflow-x-auto whitespace-nowrap scrollbar-none">
        {sections.map((section, index) => {
          const isSelected = activeSectionId === section.id;
          const disabled = index > currentIndex;
          const isActive = section.id === activeSectionId;
          return (
            <button
              key={section.id}
              disabled={disabled}
              onClick={() => {if (!disabled) onSectionClick(section.id)}}
               className={`flex flex-col items-center justify-center p-2 rounded-lg transition min-w-[90px] ${isSelected ? "bg-gray-200" : "bg-transparent"
                } ${isActive ? "bg-blue-500 text-white" : "bg-gray-100"}
              ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-100"
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
const DesktopView = ({ currentIndex = 6, activeSectionId, onSectionClick }: WeddingPlannerSidebarProps) => {
  return (
    <div className="bg-white p-4 rounded-2xl w-full max-w-sm self-start text-black">
      <h2 className="text-lg font-bold mb-4">Complete your profile</h2>
      <nav>
        <ul className="space-y-4">
          {sections.map((section, index) => {
            const isCurrent = section.id === activeSectionId;
            const disabled = index > currentIndex;
            const isActive = section.id === activeSectionId;

            return (
              <li key={section.id}>
                <button
                  onClick={() => {if (!disabled) onSectionClick(section.id)}}
                  className={`flex items-start text-left w-full p-4 rounded-lg
                    ${isCurrent
                      ? "border border-black border-2 bg-gray-50 focus:outline-none"
                      : "border-gray-200 bg-white shadow-sm hover:border-gray-300"
                    }
                    ${disabled
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-50 cursor-pointer"
                    }`}
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

export default function WeddingPlannerSidebar({ currentIndex = 6, activeSectionId, onSectionClick }: WeddingPlannerSidebarProps) {
  return (
    <>
      <div className="block md:hidden">
        <MobileView activeSectionId={activeSectionId} onSectionClick={onSectionClick} currentIndex={currentIndex} />
      </div>
      <div className="hidden md:block">
        <DesktopView activeSectionId={activeSectionId} onSectionClick={onSectionClick} currentIndex={currentIndex} />
      </div>
    </>
  );
}