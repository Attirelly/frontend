'use client';

import { useState } from 'react';
import { useSellerStore } from '@/store/sellerStore';
import { api } from '@/lib/axios';

// Note: Some titles have been shortened for a cleaner mobile display.
const sections = [
  { id: 'brand', title: 'Business Details', iconUrl: '/OnboardingSections/business_details.png' },
  { id: 'price', title: 'Price Filters', iconUrl: '/OnboardingSections/price_filters.png' },
  { id: 'market', title: 'Where to Sell', iconUrl: '/OnboardingSections/where_to_sell.png' },
  { id: 'social', title: 'Social Links', iconUrl: '/OnboardingSections/social_links.png' },
  { id: 'photos', title: 'Store Photos', iconUrl: '/OnboardingSections/store_photos.png' },
  { id: 'one_product', title: 'Add Single', iconUrl: '/OnboardingSections/business_details.png' },
  { id: 'bulk_products', title: 'Add Bulk', iconUrl: '/OnboardingSections/business_details.png' },
  { id: 'all_products', title: 'All Products', iconUrl: '/OnboardingSections/business_details.png' },
  { id: 'qr_code', title: 'QR Code', iconUrl: '/OnboardingSections/business_details.png' },
];

const sectionGroups = [
  { heading: 'Store Profile', ids: ['brand', 'price', 'market', 'social', 'photos'] },
  { heading: 'Add Products', ids: ['one_product', 'bulk_products', 'all_products'] },
  { heading: 'QR Code', ids: ['qr_code'] },
];

export default function DashboardSidebar({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (id: string) => void;
}) {
  // All your existing state and data fetching logic remains unchanged.
  const {
    sellerId,
    storeId,
    businessDetailsValid,
    businessDetailsData,
    priceFiltersValid,
    whereToSellData,
    priceFiltersData,
    socialLinksData,
    storePhotosData,
    storePhotosValid
  } = useSellerStore();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    Object.fromEntries(sectionGroups.map((g) => [g.heading, true]))
  );

  const toggleGroup = (heading: string) => {
    setOpenGroups((prev) => ({ ...prev, [heading]: !prev[heading] }));
  };

  // Your handleUpdate function remains exactly the same.
  const handleUpdate = async () => {
      if (!businessDetailsValid || !businessDetailsData){
        alert('Fill all mandatory fields of Business Details Section');
        return;
      }
      if (!priceFiltersValid || !priceFiltersData){
        alert('Fill all mandatory fields of Price Filters Section');
        return;
      }
      if(!storePhotosValid || !storePhotosData){
        alert('Fill all mandatory fields of Store Photos Section');
        return;
      }
      const seller_up_payload = {
        email: businessDetailsData.ownerEmail,
        name: businessDetailsData.ownerName,
      };
      const store_up_payload = {
        store_owner_id: sellerId,
        store_name: businessDetailsData.brandName,
        pincode_id: businessDetailsData.pinCode[0].id,
        whatsapp_number: businessDetailsData.businessWpNum,
        store_address: businessDetailsData.brandAddress,
        rental: businessDetailsData.rentOutfits === 'Yes',
        store_types: businessDetailsData.brandTypes,
        genders: businessDetailsData.genders,
        area: businessDetailsData.area[0],
        city: businessDetailsData.city[0],
        pincode: businessDetailsData.pinCode[0],
        average_price_min: priceFiltersData.avgPriceMin,
        average_price_max: priceFiltersData.avgPriceMax,
        store_type_price_range_links: priceFiltersData.priceRanges,
        is_online: whereToSellData?.isOnline,
        instagram_link: socialLinksData?.instagramUrl,
        facebook_link: socialLinksData?.facebookUrl,
        shopify_url: socialLinksData?.websiteUrl,
        listing_page_image: storePhotosData.bannerUrl,
        profile_image : storePhotosData.profileUrl
      }

      try{
        await api.put(`/users/update_user/${sellerId}`, seller_up_payload);
        await api.put(`/stores/${storeId}`, store_up_payload);
        alert('store updated');
      }catch(error){
        alert(`Error : ${error}`);
      }
  };

  // ==> CHANGE START: We define two separate layouts.

  // 1. DESKTOP LAYOUT: Your original accordion sidebar with a fixed width.
  const DesktopSidebar = () => (
    <div className="bg-gray-100 p-4 rounded-2xl w-96 flex-shrink-0 self-start space-y-6 text-black">
      <h2 className="text-xl font-bold mb-4">Dashboard</h2>
      {sectionGroups.map((group) => (
        <div className="bg-white p-4 rounded-2xl" key={group.heading}>
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => toggleGroup(group.heading)}
          >
            <h3 className="text-md font-semibold">{group.heading}</h3>
            <span className="text-sm text-gray-500">
              {openGroups[group.heading] ? '^' : '⌄'}
            </span>
          </div>
          {openGroups[group.heading] && (
            <div className="mt-3 space-y-3">
              {group.ids.map((id) => {
                const section = sections.find((s) => s.id === id);
                if (!section) return null;
                return (
                  <div
                    key={section.id}
                    onClick={() => onSelect(section.id)}
                    className={`flex items-start gap-4 p-2 cursor-pointer rounded-2xl border transition 
                      ${selected === section.id ? 'border-black bg-gray-100' : 'border-gray-300 hover:bg-gray-50'}`}
                  >
                    <img
                      src={section.iconUrl}
                      alt={section.title}
                      className="w-7 h-7 rounded-full object-cover bg-white"
                    />
                    <div className="flex flex-col">
                      <p className="font-medium text-md">{section.title}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  // 2. MOBILE LAYOUT: A new, simple horizontal navigation bar.
  const MobileSidebar = () => (
    <nav className="w-full bg-white p-2 shadow-md rounded-lg">
      <div className="flex flex-row items-center space-x-2 overflow-x-auto whitespace-nowrap scrollbar-none">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSelect(section.id)}
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition min-w-[90px] ${
              selected === section.id ? 'bg-gray-200' : 'bg-transparent hover:bg-gray-100'
            }`}
          >
            <img
              src={section.iconUrl}
              alt={section.title}
              className="w-7 h-7 mb-1 rounded-full object-cover"
            />
            <span className="text-xs font-medium text-center">{section.title}</span>
          </button>
        ))}
      </div>
    </nav>
  );

  // 3. RESPONSIVE RENDER: Use Tailwind classes to show the correct layout.
  return (
    <>
      {/* Shows only on mobile (screens smaller than 'md') */}
      <div className="block md:hidden w-full">
        <MobileSidebar />
      </div>

      {/* Shows only on desktop (screens 'md' and larger) */}
      <div className="hidden md:block">
        <DesktopSidebar />
      </div>
    </>
  );
}

