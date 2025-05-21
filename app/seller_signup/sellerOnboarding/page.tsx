'use client';
import { useState } from 'react';

// Components
import Header from '@/components/Header';
import ProfileSidebar from '@/components/ProfileSidebar';
import SocialLinksComponent from '@/components/OnboardingSections/SocialLinks';
import BusinessDetailsComponent from '@/components/OnboardingSections/BusinessDetails';
import PriceFiltersComponent from '@/components/OnboardingSections/PriceFilters';
import WhereToSellComponent from '@/components/OnboardingSections/WhereToSell';
import StorePhotosComponent from '@/components/OnboardingSections/StorePhotos';
import NextPrevNavigation from '@/components/OnboardingSections/NextPrevNavigation';
import { FormValidationProvider } from '@/components/FormValidationContext';

export default function SellerOnboardingPage() {
    const sectionOrder = ['brand','price',  'market', 'social','photos'];
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const activeSection = sectionOrder[currentSectionIndex];

  const renderSection = () => {
    switch (activeSection) {
      case 'brand':
        return <BusinessDetailsComponent />;
      case 'social':
        return <SocialLinksComponent />;
      case 'price':
        return <PriceFiltersComponent />;
      case 'market':
        return <WhereToSellComponent />;
      case 'photos':
        return <StorePhotosComponent />;
      default:
        return null;
    }
  };

  const goToNextSection = () => {
    if (currentSectionIndex < sectionOrder.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    }
  };

  const goToPreviousSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };

  const handleSidebarSelect = (key: string) => {
    const index = sectionOrder.indexOf(key);
    if (index !== -1) setCurrentSectionIndex(index);
  };

  return (
    <FormValidationProvider>
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-col md:flex-row gap-6 p-6 justify-center">
        <ProfileSidebar selected={activeSection} onSelect={handleSidebarSelect} />

        <div className="flex flex-col w-full max-w-2xl gap-6">
          <div className="rounded-md bg-gray-100">{renderSection()}</div>

          <NextPrevNavigation
            onNext={goToNextSection}
            onBack={goToPreviousSection}
            isFirst={currentSectionIndex === 0}
            isLast={currentSectionIndex === sectionOrder.length - 1}
          />
        </div>
      </div>
    </div>
    </FormValidationProvider>
  );
}
