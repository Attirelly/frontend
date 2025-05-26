'use client';
import { useSellerStore } from '@/store/sellerStore';
import { api } from '@/lib/axios';
import Header from '@/components/Header';
import ProfileSidebar from '@/components/ProfileSidebar';
import SocialLinksComponent from '@/components/OnboardingSections/SocialLinks';
import BusinessDetailsComponent from '@/components/OnboardingSections/BusinessDetails';
import PriceFiltersComponent from '@/components/OnboardingSections/PriceFilters';
import WhereToSellComponent from '@/components/OnboardingSections/WhereToSell';
import StorePhotosComponent from '@/components/OnboardingSections/StorePhotos';
import NextPrevNavigation from '@/components/OnboardingSections/NextPrevNavigation';

const sectionOrder = ['brand', 'price', 'market', 'social', 'photos'];

export default function SellerOnboardingPage() {
  const {
    sellerId,
    businessDetailsValid,
    businessDetailsData,
    setStoreId,
    storeId,
    priceFiltersData,
    priceFiltersValid,
    activeSection,
    setActiveSection,
    whereToSellData,
    socialLinksValid,
    socialLinksData,
    setFurthestStep,
    storePhotosData
  } = useSellerStore();

  const currentSectionIndex = sectionOrder.indexOf(activeSection ?? 'brand');

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

  const goToNextSection = async () => {
    if (activeSection === 'brand' && businessDetailsValid && businessDetailsData) {
      const seller_up_payload = {
        email: businessDetailsData.ownerEmail,
        name: businessDetailsData.ownerName,
      };
      const store_payload = {
        store_owner_id: sellerId,
        store_name: businessDetailsData.brandName,
        store_address: businessDetailsData.brandAddress,
        rental: businessDetailsData.rentOutfits === 'Yes',
        store_types: businessDetailsData.brandTypes,
        genders: businessDetailsData.genders,
        area: businessDetailsData.area[0],
        city: businessDetailsData.city[0],
      };

      try {
        await api.put(`/users/update_user/${sellerId}`, seller_up_payload);
        if (!storeId) {
          const response = await api.post('/stores/create', store_payload);
          setStoreId(response.data.store_id);
        }
        else {
          await api.put(`/stores/${storeId}`, store_payload);
        }

      } catch (error) {
        alert('Seller not updated');
        return;
      }
    }

    if (activeSection === 'price' && priceFiltersValid && priceFiltersData) {
      const price_payload = {
        average_price_min: priceFiltersData.avgPriceMin,
        average_price_max: priceFiltersData.avgPriceMax,
      };
      try {
        await api.put(`/stores/${storeId}`, price_payload);
        console.log('store updated');
      } catch (error) {
        alert('Cannot update store');
        return;
      }
    }

    if (activeSection === 'market' && whereToSellData) {
      const market_payload = {
        "is_online": whereToSellData.isOnline
      }
      try {
        await api.put(`/stores/${storeId}`, market_payload);
        console.log('store updated');
      } catch (error) {
        alert('Cannot update store')
        return;
      }
    }
    if (activeSection === 'social' && socialLinksValid && socialLinksData) {
      const social_payload = {
        "instagram_link": socialLinksData.instagramUrl,
        "facebook_link": socialLinksData.facebookUrl
      }
      try {
        await api.put(`/stores/${storeId}`, social_payload);
        console.log('store updated')
      } catch (error) {
        alert('Cannot update store');
        return;
      }
    }
    if (activeSection === 'photos' && storePhotosData) {
      const photos_payload = {
        "listing_page_image": storePhotosData.bannerUrl,
        "profile_image": storePhotosData.profileUrl
      }
      try {
        await api.put(`/stores/${storeId}`, photos_payload);
        console.log('store updated')
      } catch (error) {
        alert('Cannot update store');
        return;
      }
    }
    if (currentSectionIndex < sectionOrder.length - 1) {
      const nextStep = currentSectionIndex + 1;
      setActiveSection(sectionOrder[nextStep]);
      setFurthestStep((prev) => Math.max(prev, nextStep)); // 👈 prevents regress
    }
  };

  const goToPreviousSection = () => {
    if (currentSectionIndex > 0) {
      setActiveSection(sectionOrder[currentSectionIndex - 1]);
    }
  };

  const handleSidebarSelect = (key: string) => {
    if (sectionOrder.includes(key)) {
      setActiveSection(key);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        title="Attirelly"
        actions={
          <div>
            <a href="tel:+919738383838" className="text-blue-500 text-sm hover:underline">
              Need help? Call +91 97-38-38-38-38
            </a>
          </div>
        }
      />
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
  );
}
