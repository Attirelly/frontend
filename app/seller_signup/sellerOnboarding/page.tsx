'use client';
import { useSellerStore } from '@/store/sellerStore';
import { api } from '@/lib/axios';
import Header from '@/components/Header';
import ProfileSidebar from '@/components/Seller/ProfileSidebar';
import SocialLinksComponent from '@/components/Seller/Sections/SocialLinks';
import BusinessDetailsComponent from '@/components/Seller/Sections/BusinessDetails';
import PriceFiltersComponent from '@/components/Seller/Sections/PriceFilters';
import WhereToSellComponent from '@/components/Seller/Sections/WhereToSell';
import StorePhotosComponent from '@/components/Seller/Sections/StorePhotos';
import NextPrevNavigation from '@/components/Seller/NextPrevNavigation';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUpdateStore } from '@/utils/handleUpdate';
import { toast } from 'sonner';
import ProtectedRoute from '@/components/ProtectedRoute';
import { City, Area, Pincode } from '@/types/SellerTypes';
// import Toast from '@/components/ui/Toast';

const sectionOrder = ['brand', 'price', 'market', 'social', 'photos'];

export default function SellerOnboardingPage() {
  const { handleUpdate } = useUpdateStore();
  // const [toastMessage, setToastMessage] = useState("");
  //   const [toastType, setToastType] = useState<"success" | "error">("success");
  const {
    sellerId,
    sellerName,
    sellerEmail,
    setBusinessDetailsData,
    setStoreId,
    setPriceFiltersData,
    setSocialLinksData,
    setWhereToSellData,
    setStorePhotosData,
    activeSection,
    setActiveSection,
    setFurthestStep,
    furthestStep
  } = useSellerStore();
  console.log(sellerId);

  const router = useRouter();

  useEffect(() => {
    console.log(sellerName)
      if (!sellerId || !sellerName) return;
      const fetchInitialData = async () => {
        try {
          console.log(sellerId)
          const response = await api.get('/stores/store_by_owner', { params: { store_owner_id: sellerId } });
          const storeData = response.data;
          setFurthestStep(storeData.curr_section);
          console.log(storeData);
  
          const cityData: City[] = storeData.city ? [storeData.city] : [];
          const areaData: Area[] = storeData.area ? [storeData.area] : [];
          const pincodeData: Pincode[] = storeData.pincode ? [storeData.pincode] : [];
  
          setStoreId(storeData.store_id);
          // setQrId(storeData.qr_id);
  
          const priceRangeRes = await api.get('stores/store_type_price_ranges', { params: { store_id: storeData.store_id } });
          console.log(priceRangeRes);
  
          setBusinessDetailsData({
            ownerName: sellerName || '',
            ownerEmail: sellerEmail || '',
            brandName: storeData.store_name || '',
            businessWpNum: storeData.whatsapp_number || '',
            brandTypes: storeData.store_types || [],
            categories: storeData.categories || [],
            genders: storeData.genders || [],
            rentOutfits: storeData.rental === true ? 'Yes' : 'No',
            city: cityData || [],
            area: areaData || [],
            pinCode: pincodeData || [],
            brandAddress: storeData.store_address || ''
          });
  
          // setBusinessDetailsValid(true);
  
          setPriceFiltersData({
            avgPriceMin: storeData.average_price_min || null,
            avgPriceMax: storeData.average_price_max || null,
            priceRanges: priceRangeRes.data || []
          });
  
          setWhereToSellData({
            isOnline: storeData.is_online === true ? true : false,
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
    const nextStep = currentSectionIndex + 1;
    console.log(currentSectionIndex, furthestStep, activeSection);
    const res = await handleUpdate(activeSection, true, Math.max(furthestStep, nextStep));
    if(res){
      // setToastMessage("Store updated!");
      // setToastType("success");
      toast.success("Store updated!")
    }
    else{
      // setToastMessage("Store not updated!");
      // setToastType("error");
      toast.error("Store not updated!")
      return;
    }
    setFurthestStep((prev) => Math.max(prev, nextStep)); // 👈 prevents regress

    if (currentSectionIndex < sectionOrder.length - 1) {
      setActiveSection(sectionOrder[nextStep]);
    }
  };
  console.log(furthestStep);

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
    <ProtectedRoute role='admin'>
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
    </ProtectedRoute>
  );
}
