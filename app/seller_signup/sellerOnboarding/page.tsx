'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import ProfileSidebar from '@/components/ProfileSidebar';
import SocialLinksComponent from '@/components/OnboardingSections/SocialLinks';
import BusinessDetailsComponent from '@/components/OnboardingSections/BusinessDetails';
import PriceFiltersComponent from '@/components/OnboardingSections/PriceFilters';
import WhereToSellComponent from '@/components/OnboardingSections/WhereToSell';
import StorePhotosComponent from '@/components/OnboardingSections/StorePhotos';
export default function SellerOnboardingPage() {
    const [activeSection, setActiveSection] = useState('brand');

    const renderSection = () => {
    switch (activeSection) {
      case 'social': return <SocialLinksComponent />;
      case 'brand': return <BusinessDetailsComponent />;
      case 'price': return <PriceFiltersComponent />;
      case 'market': return <WhereToSellComponent />;
      case 'photos': return <StorePhotosComponent />;
      // Add others...
      default: return null;
    }
  };

   return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-col md:flex-row gap-6 p-6 justify-center">
        <ProfileSidebar selected={activeSection} onSelect={setActiveSection} />
        <div className='flex rounded-md w-full max-w-xl justify-center'>{renderSection()}</div>
      </div>
    </div>
  );
    
}

