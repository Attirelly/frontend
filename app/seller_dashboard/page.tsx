'use client';
import { useState } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import SocialLinksComponent from '@/components/OnboardingSections/SocialLinks';
import BusinessDetailsComponent from '@/components/OnboardingSections/BusinessDetails';
import PriceFiltersComponent from '@/components/OnboardingSections/PriceFilters';
import WhereToSellComponent from '@/components/OnboardingSections/WhereToSell';
import StorePhotosComponent from '@/components/OnboardingSections/StorePhotos';

import Header from '@/components/Header';
import { FormValidationProvider } from '@/components/FormValidationContext';

export default function SellerDashboardPage() {
    const [activeSection, setActiveSection] = useState('brand');

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

    return (
        <FormValidationProvider>
        <div className='min-h-screen bg-gray-100'>
            <Header
                title='Attirelly'
                actions={
                    <button className='bg-white text-black rounded-2xl shadow-md p-2 cursor-pointer border transition hover:bg-gray-200'>Log Out</button>
                } />
            <div className="flex flex-col md:flex-row gap-6 p-6 justify-center">
                <DashboardSidebar selected={activeSection} onSelect={setActiveSection} />
                <div className="rounded-md bg-gray-100">{renderSection()}</div>
            </div>

        </div>
        </FormValidationProvider>

    )
}