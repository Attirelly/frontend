'use client';
import { useStylist } from '@/store/stylist';
import { api } from '@/lib/axios';
import Header from '@/components/Header';
import ProfileSidebar from '@/components/Seller/ProfileSidebar';
import SocialLinksComponent from '@/components/Seller/Sections/SocialLinks';
import BusinessDetailsComponent from '@/components/Seller/Sections/BusinessDetails';
import PriceFiltersComponent from '@/components/Seller/Sections/PriceFilters';
import WhereToSellComponent from '@/components/Seller/Sections/WhereToSell';
import StorePhotosComponent from '@/components/Seller/Sections/StorePhotos';
import NextPrevNavigation from '@/components/Seller/NextPrevNavigation';
import { useEffect } from 'react';
import { useUpdateStore } from '@/utils/handleUpdate';
import { toast } from 'sonner';
import ProtectedRoute from '@/components/ProtectedRoute';
import { City, Area, Pincode } from '@/types/SellerTypes';
// import Toast from '@/components/ui/Toast';

const sectionOrder = ['brand', 'price', 'market', 'social', 'photos'];


/**
 * StylistOnboardingPage component  [DISCLAIMER] --> most of the components is being reused from the seller Onboarding components
 * 
 * The main page for the multi-step stylist onboarding process. This component acts as a
 * container that fetches existing stylist data, renders the currently active form section,
 * and handles navigation and data saving between the different steps.
 *
 * ## Features
 * - A multi-step form broken down into distinct sections (Brand, Price, Market, Social, Photos).
 * - **Stateful Sidebar Navigation**: A `ProfileSidebar` displays all sections, highlighting the active one and tracking completion. Users can navigate between unlocked sections.
 * - **Dynamic Section Rendering**: A `renderSection` function uses a `switch` statement to display the correct form component based on the current `activeSection` state.
 * - **Data Persistence**: On initial load, it fetches all existing data for the seller's store and populates a global Zustand store, ensuring progress is saved.
 * - **Progress Tracking**: Tracks the `furthestStep` the user has reached to manage navigation access.
 * - **Save on Navigation**: When the user clicks "Next", data for the current section is saved to the backend via the `handleUpdate` hook before proceeding.
 * - **Protected Route**: The entire page is wrapped in a `ProtectedRoute`, ensuring only authenticated users with the correct role can access it.
 *
 * ## Logic Flow
 * 1.  The `ProtectedRoute` wrapper first verifies the user's authentication and role.
 * 2.  On component mount, a `useEffect` hook triggers `fetchInitialData`.
 * 3.  `fetchInitialData` makes API calls (`GET /stores/store_by_owner` and `GET /stores/store_type_price_ranges`) using the `sellerId` from the global store.
 * 4.  The response data is used to populate multiple slices of the `useSellerStore`, pre-filling all form sections with any existing data.
 * 5.  The `activeSection` state (from the store) determines which form component is rendered via the `renderSection` function.
 * 6.  The user interacts with the rendered form section, which updates the global Zustand store in real-time.
 * 7.  When the user clicks "Next", the `goToNextSection` function is called. This function first calls the `handleUpdate` hook, which saves the current section's data from the store to the backend.
 * 8.  If the save is successful, the `activeSection` state is updated to the next step in the `sectionOrder` array, causing the next form to be rendered.
 *
 * ## Imports
 * - **Core/Libraries**: `useEffect`, `useState` from `react`; `useRouter` from `next/navigation`; `toast` from `sonner`.
 * - **State (Zustand Stores)**:
 *    - `useSellerStore`: The central store for all seller and onboarding-related data.
 * - **Key Components**:
 *    - {@link Header}: The main page header.
 *    - {@link ProfileSidebar}: The navigation sidebar for the onboarding steps.
 *    - {@link NextPrevNavigation}: The back/next buttons for navigating between steps.
 *    - {@link ProtectedRoute}: A higher-order component that protects the page from unauthorized access.
 *    - {@link SocialLinksComponent} : The form for managing social media and website links.
 *    - {@link BusinessDetailsComponent} : The form for managing core business and brand details.
 *    - {@link PriceFiltersComponent} : The form for setting price ranges and average prices.
 *    - {@link WhereToSellComponent} : The form for specifying online/offline market presence.
 *    - {@link StorePhotosComponent} : The form for uploading profile and banner images.
 * - All section form components (e.g., `BusinessDetailsComponent`, `SocialLinksComponent`).
 * - **Hooks**:
 *    - `useUpdateStore`: A custom hook that encapsulates the logic for saving store data.
 * - **Types**:
 *    - {@link City}, {@link Area}, {@link Pincode}: TypeScript types for location data.
 * - **Utilities**:
 *    - `api` from `@/lib/axios`: The configured Axios instance for API calls.
 *
 * ## API Calls
 * - GET `/stores/store_by_owner`: Fetches all existing data for the seller's store on initial load.
 * - GET `/stores/store_type_price_ranges`: Fetches the price ranges associated with the store's type.
 * - Triggers `UPDATE` and `CREATE` calls  via the `handleUpdate` hook when navigating to the next section.
 *
 * ## Props
 * - This is a page component and does not accept any props.
 *
 * @returns {JSX.Element} The rendered seller onboarding page.
 */
export default function StylistOnboardingPage() {
  const { handleUpdate } = useUpdateStore();
  const {
    stylistId,
    stylistName,
    stylistEmail,
    // setStoreNameString,
    setBusinessDetailsData,
    setStylistId,
    setPriceFiltersData,
    setSocialLinksData,
    setWhereToSellData,
    setStorePhotosData,
    activeSection,
    setActiveSection,
    setFurthestStep,
    furthestStep

    

  } = useStylist();

  /**
   * fetch intial store data using seller id
   * this is done to handle the case if seller onboarding was not complete previously 
   * then start from the last section
   * (data will be synced)
   */
  useEffect(() => {
      if (!stylistId || !stylistName) return;
      const fetchInitialData = async () => {
        try {
          console.log(stylistId)
          const response = await api.get('/stylist/stylist_info', { params: { stylist_id: stylistId } });
          const stylistData = response.data;
          setFurthestStep(stylistData.curr_section);
          
  
          const cityData: City[] = stylistData.city ? [stylistData.city] : [];
          const areaData: Area[] = stylistData.area ? [stylistData.area] : [];
          const pincodeData: Pincode[] = stylistData.pincode ? [stylistData.pincode] : [];
  
          setStylistId(stylistData.stylist_id);
          // setStoreNameString(storeData.store_name);
  
          // const priceRangeRes = await api.get('stores/store_type_price_ranges', { params: { store_id: storeData.store_id } });
      
          setBusinessDetailsData({
            ownerName: stylistName || '',
            ownerEmail: stylistEmail || '',
            brandName: storeData.store_name || '',
            businessWpNum: stylistData.whatsapp_number || '',
            brandTypes: storeData.store_types || [],
            categories: stylistData.categories || [],
            genders: stylistData.genders || [],
            rentOutfits: storeData.rental === true ? 'Yes' : 'No',
            city: cityData || [],
            area: areaData || [],
            pinCode: pincodeData || [],
            brandAddress: storeData.store_address || '',
            returnDays: storeData.return_days || 0,
            exchangeDays: storeData.exchange_days || 0,
          });
  
          setPriceFiltersData({
            avgPriceMin: storeData.average_price_min || null,
            avgPriceMax: storeData.average_price_max || null,
            priceRanges: priceRangeRes.data || [],
            priceRangesStr: priceRangeRes?.data.map((item) => ({
                "id" : item.price_range_id,
                "label" : item.price_range
            }))
          });
  
          setWhereToSellData({
            isOnline: storeData.is_online === true ? true : false,
            isBoth: storeData.is_both === true ? true : false
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
        }
      };
      fetchInitialData();
    }, [sellerId]);


  // set current index based on active section, if not any active section then set 'brand'
  const currentSectionIndex = sectionOrder.indexOf(activeSection ?? 'brand');

  // function to render section based on active section
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

  /**
   * called when Next button is clicked, handleUpdate is called and next section is set
   */
  const goToNextSection = async () => {
    const nextStep = currentSectionIndex + 1;
    
    const res = await handleUpdate(activeSection, true, Math.max(furthestStep, nextStep));
    if(res){
      toast.success("Store updated!")
    }
    else{
      toast.error("Store not updated!")
      return;
    }
    setFurthestStep((prev) => Math.max(prev, nextStep)); // 👈 prevents regress

    if (currentSectionIndex < sectionOrder.length - 1) {
      setActiveSection(sectionOrder[nextStep]);
    }
  };
  

  const goToPreviousSection = () => {
    if (currentSectionIndex > 0) {
      setActiveSection(sectionOrder[currentSectionIndex - 1]);
    }
  };

  /**
   * change active section when clicked on sidebar tabs
   */
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
            <a href="tel:+918699892707" className="text-blue-500 text-[10px] md:text-sm hover:underline">
              Need help? Call +91-8699892707
            </a>
          </div>
        }
      />
      <div className="flex flex-col md:flex-row gap-6 p-6 justify-center">
        <ProfileSidebar selected={activeSection} onSelect={handleSidebarSelect} />
        {/* <div className="flex flex-col w-full max-w-2xl gap-6"> */}
          <div className="rounded-md bg-gray-100">
            {renderSection()}

            <NextPrevNavigation
            onNext={goToNextSection}
            onBack={goToPreviousSection}
            isFirst={currentSectionIndex === 0}
            isLast={currentSectionIndex === sectionOrder.length - 1}
          />
          </div>
          
        {/* </div> */}
      </div>
    </div>
    </ProtectedRoute>
  );
}
