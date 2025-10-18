"use client";

import Image from "next/image";
import React from "react";

export type MakeupArtistSectionKey =
  | "basicInformation"
  | "clientServiceProfile"
  | "fashionOutfitInfluence"
  | "socialCollabs"
  | "attirellyCollab"
  | "commissionProgram"
  | "portfolioAndReviews"
  | "socialLinks"
  | "artistLocation"
  | "mediaKit"
  | "instagramInsights"
  | "mediaBio";

interface MakeupArtistSidebarProps {
  currentIndex: number;
  activeSectionId: MakeupArtistSectionKey;
  onSectionClick: (id: MakeupArtistSectionKey) => void;
}

// 💄 Section definitions for Makeup Artists
const sections: {
  id: MakeupArtistSectionKey;
  title: string;
  desc: string;
  iconUrl: string;
}[] = [
  {
    id: "basicInformation",
    title: "Basic Information",
    desc: "Your personal and business details.",
    iconUrl: "/OnboardingSections/business_details.png",
  },
  {
    id: "clientServiceProfile",
    title: "Services Offered",
    desc: "Specify the makeup services you provide.",
    iconUrl: "/OnboardingSections/services.png",
  },
  {
    id: "fashionOutfitInfluence",
    title: "Fashion & Outfit Influence",
    desc: "Specify your fashion and outfit influence.",
    iconUrl: "/OnboardingSections/business_details.png",
  },
  {
    id: "socialCollabs",
    title: "Social Media Collaborations",
    desc: "Specify your social media collaboration preferences.",
    iconUrl: "/OnboardingSections/business_details.png",
  },
  {
    id: "attirellyCollab",
    title: "Attirelly Collaborations",
    desc: "Specify your Attirelly collaboration preferences.",
    iconUrl: "/OnboardingSections/business_details.png",
  },
  {
    id: "commissionProgram",
    title: "Commission Program",
    desc: "Define your commission structure.",
    iconUrl: "/OnboardingSections/price_filters.png",
  },
  {
    id: "socialLinks",
    title: "Social Links",
    desc: "Add links to your social media profiles.",
    iconUrl: "/OnboardingSections/store_photos.png",
  },
  {
    id: "instagramInsights",
    title: "Instagram Insights",
    desc: "View your Instagram performance metrics.",
    iconUrl: "/OnboardingSections/instagram.svg",
  },
  {
    id: "artistLocation",
    title: "Availability & Location",
    desc: "Where you’re based and travel readiness.",
    iconUrl: "/OnboardingSections/where_to_sell.png",
  },
  {
    id: "mediaBio",
    title: "Media Bio",
    desc: "Your profile picture and portfolio file.",
    iconUrl: "/OnboardingSections/social_links.png",
  },
];

const MobileView = ({
  activeSectionId,
  onSectionClick,
  currentIndex,
}: MakeupArtistSidebarProps) => (
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
            onClick={() => {
              if (!disabled) onSectionClick(section.id);
            }}
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition min-w-[90px]
              ${isSelected ? "bg-gray-200" : "bg-transparent"}
              ${isActive ? "bg-blue-500 text-white" : "bg-gray-100"}
              ${
                disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-100"
              }`}
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

const DesktopView = ({
  activeSectionId,
  onSectionClick,
  currentIndex,
}: MakeupArtistSidebarProps) => (
  <div className="bg-white p-4 rounded-2xl w-full max-w-sm self-start text-black shadow-md">
    <h2 className="text-lg font-bold mb-4">Complete your profile</h2>
    <nav>
      <ul className="space-y-4">
        {sections.map((section, index) => {
          const isCurrent = section.id === activeSectionId;
          const disabled = index > currentIndex;
          console.log("disabled: ", disabled, "current index: ", currentIndex);
          return (
            <li key={section.id}>
              <button
                onClick={() => {
                  if (!disabled) onSectionClick(section.id);
                }}
                className={`flex items-start text-left w-full p-4 rounded-lg
                    ${
                      isCurrent
                        ? "border border-black border-2 bg-gray-50 focus:outline-none"
                        : "border-gray-200 bg-white shadow-sm hover:border-gray-300"
                    }
                    ${
                      disabled
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
                  <h3 className="font-semibold text-gray-900">
                    {section.title}
                  </h3>
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

export default function MakeupArtistSidebar({
  activeSectionId,
  onSectionClick,
  currentIndex,
}: MakeupArtistSidebarProps) {
  return (
    <>
      <div className="block md:hidden">
        <MobileView
          activeSectionId={activeSectionId}
          onSectionClick={onSectionClick}
          currentIndex={currentIndex}
        />
      </div>
      <div className="hidden md:block">
        <DesktopView
          activeSectionId={activeSectionId}
          onSectionClick={onSectionClick}
          currentIndex={currentIndex}
        />
      </div>
    </>
  );
}
