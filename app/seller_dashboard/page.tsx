'use client';
import { useEffect, useState } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import SocialLinksComponent from '@/components/OnboardingSections/SocialLinks';
import BusinessDetailsComponent from '@/components/OnboardingSections/BusinessDetails';
import PriceFiltersComponent from '@/components/OnboardingSections/PriceFilters';
import WhereToSellComponent from '@/components/OnboardingSections/WhereToSell';
import StorePhotosComponent from '@/components/OnboardingSections/StorePhotos';
import QrCodeGeneration from '@/components/OnboardingSections/QrGeneration';
import ViewAllProducts from '@/components/OnboardingSections/ViewAllProducts'
import BulkUploadPage from '@/components/OnboardingSections/BulkuploadProducts';
import UpdateButton from '@/components/OnboardingSections/UpdateButton';
import Header from '@/components/Header';
import { useSellerStore } from '@/store/sellerStore'
import { api } from '@/lib/axios';
import ProtectedRoute from '@/components/ProtectedRoute';
import { logout } from '@/utils/logout';
import { useUpdateStore } from '@/utils/handleUpdate';

import ProductUploadPage from '../product_upload/page';

type City = { id: string; name: string; state_id: string };

type Area = { id: string, name: string, city_id: string }

export default function SellerDashboardPage() {
  const {
    setStoreId,
    storeId,
    sellerNumber,
    sellerId,
    sellerName,
    sellerEmail,
    setBusinessDetailsData,
    setBusinessDetailsValid,
    setPriceFiltersData,
    setPriceFiltersValid,
    setWhereToSellData,
    setSocialLinksData,
    setStorePhotosData,
    setQrId
  } = useSellerStore();
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    if (!sellerId) return;
    const fetchInitialData = async () => {
      try {
        console.log(sellerId)
        const response = await api.get('/stores/store_by_owner', { params: { store_owner_id: sellerId } })
        const storeData = response.data;
        console.log(storeData);

        const cityData: City[] = storeData.city ? [storeData.city] : [];
        const areaData: Area[] = storeData.area ? [storeData.area] : [];

        setStoreId(storeData.store_id);
        setQrId(storeData.qr_id);

        const priceRangeRes = await api.get('stores/store_type_price_ranges', { params: { store_id: storeData.store_id } });
        console.log(priceRangeRes);

        setBusinessDetailsData({
          ownerName: sellerName || '',
          ownerEmail: sellerEmail || '',
          brandName: storeData.store_name || '',
          businessWpNum: storeData.whatsapp_number || '',
          brandTypes: storeData.store_types || [],
          genders: storeData.genders || [],
          rentOutfits: storeData.rental === true ? 'Yes' : 'No',
          city: cityData || [],
          area: areaData || [],
          pinCode: storeData.pincode || '',
          brandAddress: storeData.store_address || ''
        });

        // setBusinessDetailsValid(true);

        setPriceFiltersData({
          avgPriceMin: storeData.average_price_min,
          avgPriceMax: storeData.average_price_max,
          priceRanges: priceRangeRes.data
        });

        setWhereToSellData({
          isOnline: storeData.is_online === true ? true : true,
          isBoth: false
        });

        setSocialLinksData({
          instagramUsname: storeData.instagram_link ? new URL(storeData.instagram_link).pathname.split('/').filter(Boolean)[0] : null,
          instagramUrl: storeData.instagram_link || '',
          facebookUrl: storeData.facebook_link || '',
          websiteUrl: storeData.shopify_url || ''
        });

        setStorePhotosData({
          profileUrl: storeData.profile_image || '',
          bannerUrl: storeData.listing_page_image || ''
        });

      } catch (error) {
        console.error('Error fetching initial data:', error);
        alert('error fetching data, signin again');
      }
    };
    fetchInitialData();
  }, [sellerId]);

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
      case 'qr_code':
        return <QrCodeGeneration />;
      case 'all_products':
        return <ViewAllProducts />;
      case 'bulk_products':
        return <BulkUploadPage />;
      case 'one_product':
        return <ProductUploadPage />;
      default:
        return null;
    }
  };

  return (
    <ProtectedRoute role="admin">
      <div className='min-h-screen bg-gray-100'>
        <Header
          title='Attirelly'
          actions={
            <button className='bg-white text-black rounded-2xl shadow-md p-2 cursor-pointer border transition hover:bg-gray-200'
              onClick={() => logout("/seller_signin")}>Log Out</button>
          } />
        <div className="flex flex-col md:flex-row gap-6 p-6 justify-center">
          <DashboardSidebar selected={activeSection} onSelect={setActiveSection} />
          <div className="flex flex-col w-3xl md-w-2xl gap-6">
            <div className="overflow-auto mt-[60px] rounded-md bg-gray-100">{renderSection()}</div>
            {['brand', 'price', 'market', 'social', 'photos'].includes(activeSection) && (
              <UpdateButton
                onClick={() => {
                  console.log(`Update clicked for section: ${activeSection}`);
                  // TODO: implement update logic based on section
                }}
                disabled={false} // Replace with logic to enable/disable based on validation
              />
            )}
          </div>

        </div>

      </div>
    </ProtectedRoute>


  )
}