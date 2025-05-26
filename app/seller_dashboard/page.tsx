'use client';
import { useEffect, useState } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import SocialLinksComponent from '@/components/OnboardingSections/SocialLinks';
import BusinessDetailsComponent from '@/components/OnboardingSections/BusinessDetails';
import PriceFiltersComponent from '@/components/OnboardingSections/PriceFilters';
import WhereToSellComponent from '@/components/OnboardingSections/WhereToSell';
import StorePhotosComponent from '@/components/OnboardingSections/StorePhotos';
import Header from '@/components/Header';
import { useSellerStore } from '@/store/sellerStore'
import { api } from '@/lib/axios';

type City = { id: string; name: string; state_id: string };

type Area = { id: string, name: string, city_id: string }

export default function SellerDashboardPage() {
  const {
    setStoreId,
    sellerNumber,
    sellerId,
    sellerName,
    sellerEmail,
    setBusinessDetailsData,
    setPriceFiltersData,
    setWhereToSellData,
    setSocialLinksData,
    setStorePhotosData
  } = useSellerStore();
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await api.get('/stores/store_by_owner', { params: { store_owner_id: sellerId } })

        const storeData = response.data;

        console.log(storeData);

        const cityData: City[] = storeData.city ? [storeData.city] : [];
        const areaData: Area[] = storeData.area ? [storeData.area] : [];

        setStoreId(storeData.store_id)

        setBusinessDetailsData({
          ownerName: sellerName,
          ownerEmail: sellerEmail,
          brandName: storeData.store_name,
          businessWpNum: storeData.whatsapp_number,
          brandTypes: storeData.store_types,
          genders: storeData.genders,
          rentOutfits: storeData.rental === true ? 'Yes' : 'No',
          city: cityData,
          area: areaData,
          pinCode: '123456',
          brandAddress: storeData.store_address
        });

        setPriceFiltersData({
          avgPriceMin: storeData.average_price_min,
          avgPriceMax: storeData.average_price_max,
          priceRanges: {}
        });
        
        setWhereToSellData({ 
          isOnline : storeData.is_online === true ? true : true, 
          isBoth : false
        });

        setSocialLinksData({
      instagramUsname : storeData.instagram_link,
      instagramUrl : storeData.instagram_link,
      facebookUrl : storeData.facebook_link,
      websiteUrl : 'jbads'
    });

      } catch (error) {
        alert('error fetching data, signin again');
      }
    };
    fetchInitialData();
  }, [sellerNumber]);

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


  )
}