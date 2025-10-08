'use client';

import { useState } from 'react';
import { Building2, Filter, MapPin, Share2, Image as ImageIcon, LucideIcon } from 'lucide-react';

// Import Components
import Sidebar from '@/components/Stylist/Sidebar';
import Details from '@/components/Stylist/Sections/Details';
import Price from '@/components/Stylist/Sections/Price';
import Availability from '@/components/Stylist/Sections/Availability';
import SocialLinks from '@/components/Stylist/Sections/SocialLinks';
import Photos from '@/components/Stylist/Sections/Photos';

// Define the shape of a section, including the component to render
export interface OnboardingSection {
  name: string;
  icon: LucideIcon;
  component: React.FC<{ onNext: () => void }>;
}

// Array of all onboarding sections
const onboardingSections: OnboardingSection[] = [
  { name: 'Business Details', icon: Building2, component: Details },
  { name: 'Price Filters', icon: Filter, component: Price },
  { name: 'Mode of Service', icon: MapPin, component: Availability },
  { name: 'Social Links', icon: Share2, component: SocialLinks },
  { name: 'Stylist Photos', icon: ImageIcon, component: Photos },
];

export default function OnboardingPage() {
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);

  /**
   * Moves to the next section in the onboarding flow.
   * It stops at the last section.
   */
  const handleNext = () => {
    setActiveSectionIndex((prevIndex) =>
      Math.min(prevIndex + 1, onboardingSections.length - 1)
    );
  };

  /**
   * Sets the active section directly. Used by the sidebar.
   * @param index - The index of the section to make active.
   */
  const handleSectionClick = (index: number) => {
    setActiveSectionIndex(index);
  };

  // Determine which component to render based on the active index
  const ActiveComponent = onboardingSections[activeSectionIndex].component;

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar
        sections={onboardingSections}
        activeSectionIndex={activeSectionIndex}
        onSectionClick={handleSectionClick}
      />
      <main className="flex-1 p-8 overflow-y-auto">
        {/* The max-w-4xl and mx-auto will center the content area */}
        <div className="max-w-4xl mx-auto">
          {/* Render the active component and pass the handleNext function as a prop */}
          <ActiveComponent onNext={handleNext} />
        </div>
      </main>
    </div>
  );
}