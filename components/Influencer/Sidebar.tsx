'use client';

import Image from 'next/image';
import React from 'react';

interface InfluencerSidebarProps {
  activeSectionId: string;
  onSectionClick: (id: string) => void;
}

// ==========================================================
// >> THIS IS THE UPDATED PART <<
// The 'sections' array now includes all 8 steps of the onboarding process.
// ==========================================================
const sections = [
  { id: 'basic-information', title: 'Basic Information', desc: 'Your personal and contact details.', iconUrl: '/OnboardingSections/business_details.png' },
  { id: 'social-preference', title: 'Social Preference', desc: 'Your platforms, niche, and style.', iconUrl: '/OnboardingSections/social_links.png' },
  { id: 'audience-insights', title: 'Audience Insights', desc: 'Demographics and engagement data.', iconUrl: '/OnboardingSections/instagram.svg' },
  { id: 'collaboration-preferences', title: 'Collaboration Preferences', desc: 'The types of collabs you prefer.', iconUrl: '/OnboardingSections/instagram.svg' },
  { id: 'pricing-structure', title: 'Pricing Structure', desc: 'Your rates for different content.', iconUrl: '/OnboardingSections/price_filters.png' },
  { id: 'past-work', title: 'Past Work', desc: 'Showcase your experience.', iconUrl: '/OnboardingSections/instagram.svg' },
  { id: 'location-availability', title: 'Location & Availability', desc: 'Where you are and your availability.', iconUrl: '/OnboardingSections/where_to_sell.png' },
  { id: 'influencer-photos', title: 'Photos', desc: 'Upload your profile photos.', iconUrl: '/OnboardingSections/store_photos.png' },
];

// --- Sub-component for Mobile View (No changes needed here) ---
const MobileView = ({ activeSectionId, onSectionClick }: InfluencerSidebarProps) => {
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

// --- Sub-component for Desktop View (No changes needed here) ---
const DesktopView = ({ activeSectionId, onSectionClick }: InfluencerSidebarProps) => {
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

export default function InfluencerSidebar({ activeSectionId, onSectionClick }: InfluencerSidebarProps) {
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