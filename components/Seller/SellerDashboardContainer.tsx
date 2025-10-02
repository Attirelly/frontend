"use client";
import { useEffect, useState } from "react";
import DashboardSidebar from "@/components/Seller/DashboardSidebar";
import SocialLinksComponent from "@/components/Seller/Sections/SocialLinks";
import BusinessDetailsComponent from "@/components/Seller/Sections/BusinessDetails";
import PriceFiltersComponent from "@/components/Seller/Sections/PriceFilters";
import WhereToSellComponent from "@/components/Seller/Sections/WhereToSell";
import StorePhotosComponent from "@/components/Seller/Sections/StorePhotos";
import QrCodeGeneration from "@/components/Seller/Sections/QrGeneration";
import ViewAllProducts from "@/components/Seller/Sections/ViewAllProducts";
import BulkUploadPage from "@/components/Seller/Sections/BulkUploadProducts";
import UpdateButton from "@/components/Seller/UpdateButton";
import Header from "@/components/Header";
import { useSellerStore } from "@/store/sellerStore";
import { api } from "@/lib/axios";
import ProtectedRoute from "@/components/ProtectedRoute";
import { logout } from "@/utils/logout";
import { useUpdateStore } from "@/utils/handleUpdate";
import { useRouter, useSearchParams } from "next/navigation";
import ProductUploadPage from "@/app/product_upload/page";
import { toast } from "sonner";
import { City, Area, Pincode } from "@/types/SellerTypes";
import SizeChartPage from "./Sections/SizeChart";


/**
 * SellerDashboardContainer component
 * 
 * The main container component for the seller dashboard. It acts as a central hub that
 * fetches all relevant seller and store data, and then renders different management sections
 * (like business details, product uploads, etc.) based on user navigation driven by URL query parameters.
 *
 * ## Features
 * - **Protected Route**: The entire page is wrapped in a `ProtectedRoute` to ensure only authorized users can access it.
 * - **URL-Driven Navigation**: Uses Next.js `useSearchParams` to read the `?section=` query parameter, which dictates which dashboard section is displayed.
 * - **Dynamic Section Rendering**: A `renderSection` function uses a `switch` statement to display the correct management component based on the active section.
 * - **Comprehensive Data Fetching**: On initial load, it fetches all necessary data for the entire dashboard (store details, owner details, etc.) and populates a global Zustand store, pre-filling all forms.
 * - **Stateful Sidebar**: A `DashboardSidebar` component displays all available sections and highlights the active one. Clicking an item updates the URL and changes the rendered section.
 * - **Data Saving**: An `UpdateButton` is displayed for editable sections, which uses the `useUpdateStore` custom hook to save the current section's data to the backend.
 *
 * ## Logic Flow
 * 1.  The `ProtectedRoute` wrapper first verifies the user's role.
 * 2.  The component reads the `section` and `storeId` from the URL search parameters on mount.
 * 3.  A `useEffect` hook triggers a comprehensive `fetchInitialData` function. This function can load data using either a `sellerId` from the global store or a `storeId` from the URL.
 * 4.  It makes a series of API calls to get all store data, owner data, price ranges, and Instagram connection status.
 * 5.  The fetched data is then used to populate multiple slices of the `useSellerStore`, ensuring all child components have the data they need. The data population is conditional based on the user's `curr_section` progress.
 * 6.  The `activeSection` state, synced with the URL's `?section=` parameter, determines which component is rendered by the `renderSection` function.
 * 7.  When the user clicks a navigation item in the `DashboardSidebar`, the `handleSectionChange` function updates the URL, which in turn updates the `activeSection` state and re-renders the content area.
 * 8.  For sections that are editable, the user can make changes (which update the Zustand store) and click the `UpdateButton` to persist them via the `useUpdateStore` hook.
 *
 * ## Imports
 * - **Core/Libraries**:
 *    - `useEffect`, `useState` from `react`: For managing component lifecycle and state.
 *    - `useRouter`, `useSearchParams` from `next/navigation`: Hooks for programmatic routing and reading URL query parameters.
 *    - `toast` from `sonner`: For displaying user-friendly notifications.
 * - **State (Zustand Stores)**:
 *    - `useSellerStore`: The central store for all seller and dashboard-related data.
 * - **Key Components**:
 *    - {@link DashboardSidebar}: The primary navigation for the dashboard sections.
 *    - {@link SocialLinksComponent}: The form for managing social media and website links.
 *    - {@link BusinessDetailsComponent}: The form for managing core business and brand details.
 *    - {@link PriceFiltersComponent}: The form for setting price ranges and average prices.
 *    - {@link WhereToSellComponent}: The form for specifying online/offline market presence.
 *    - {@link StorePhotosComponent}: The form for uploading profile and banner images.
 *    - {@link QrCodeGeneration}: The section for displaying and managing the store's QR code.
 *    - {@link ViewAllProducts}: The section for viewing and managing all existing products.
 *    - {@link BulkUploadPage}: The page/section for bulk uploading products.
 *    - {@link ProductUploadPage}: The page/section for uploading a single product.
 *    - {@link UpdateButton}: The button used to save changes in editable sections.
 *    - {@link Header}: The main page header.
 *    - {@link ProtectedRoute}: A higher-order component that protects the page from unauthorized access.
 * - **Hooks**:
 *    - `useUpdateStore`: A custom hook that encapsulates the logic for saving store data.
 * - **Types**:
 *    - `City`, `Area`, `Pincode`: TypeScript types for location data.
 * - **Utilities**:
 *    - `api` from `@/lib/axios`: The configured Axios instance for API calls.
 *    - {@link logout} from `@/utils/logout`: A function to handle user logout.
 *
 * ## API Calls
 * - GET `/stores/store_by_owner`: Fetches store data using the owner's ID from the global store.
 * - GET `/stores/{storeId}`: Fetches store data using the store's ID from the URL (used by admins).
 * - GET `/users/user`: Fetches the store owner's user data.
 * - GET `/instagram/connect_check/{storeId}`: Checks if the store's Instagram is connected.
 * - GET `/stores/store_type_price_ranges`: Fetches price ranges associated with the store.
 * - Triggers `UPDATE` and `CREATE` via the `useUpdateStore` hook.
 *
 * ## Props
 * - This is a page component and does not accept any props.
 *
 * @returns {JSX.Element} The rendered seller dashboard page.
 */
export default function SellerDashboardContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sectionFromUrl = searchParams.get("section") || "one_product";

  const { handleUpdate } = useUpdateStore();

  const {
    setStoreId,
    setStoreNameString,
    sellerId,
    setSellerId,
    sellerName,
    sellerEmail,
    setBusinessDetailsData,
    setPriceFiltersData,
    setWhereToSellData,
    setSocialLinksData,
    setStorePhotosData,
    setQrId,
    setFurthestStep,
    setSellerEmail,
    setSellerName,
    setSellerNumber,
    setIsInstagramConnected,
  } = useSellerStore();

  const [activeSection, setActiveSection] = useState(sectionFromUrl);
  const storeId = searchParams.get("storeId");

  useEffect(() => {
    /**
     * fetch store data based on seller id or store id (whatever is available)
     * set zustand states for different sections
     */
    const fetchInitialData = async () => {
      try {
        let response;
        let fetchedSellerName;
        let fetchedSellerEmail;
        if (sellerId) {
          response = await api.get("/stores/store_by_owner", {
            params: { store_owner_id: sellerId },
          });
        } else if (storeId) {
          response = await api.get(`stores/${storeId}`);
          const store_owner_id = response.data.store_owner_id;
          const resSeller = await api.get(`/users/user`, {
            params: { user_id: store_owner_id },
          });
          const resData = resSeller.data;
          setSellerId(store_owner_id);
          setSellerEmail(resData.email);
          setSellerName(resData.name);
          setSellerNumber(resData.contact_number);
          fetchedSellerEmail = resData.email;
          fetchedSellerName = resData.name;
        }

        if (!response) return;

        const storeData = response.data;
        const curr_section = storeData.curr_section;
        const cityData: City[] = storeData.city ? [storeData.city] : [];
        const areaData: Area[] = storeData.area ? [storeData.area] : [];
        const pincodeData: Pincode[] = storeData.pincode
          ? [storeData.pincode]
          : [];

        setStoreId(storeData.store_id);
        setQrId(storeData.qr_id);
        setFurthestStep(curr_section);
        setStoreNameString(storeData.store_name);

        const instagramCheck = await api.get(
          `/instagram/connect_check/${storeData.store_id}`
        );
        setIsInstagramConnected(instagramCheck?.data);

        const priceRangeRes = await api.get("stores/store_type_price_ranges", {
          params: { store_id: storeData.store_id },
        });

        if (curr_section >= 1) {
          setBusinessDetailsData({
            ownerName: sellerName || fetchedSellerName || "",
            ownerEmail: sellerEmail || fetchedSellerEmail || "",
            brandName: storeData.store_name || "",
            businessWpNum: storeData.whatsapp_number || "",
            brandTypes: storeData.store_types || [],
            categories: storeData.categories || [],
            genders: storeData.genders || [],
            rentOutfits: storeData.rental === true ? "Yes" : "No",
            city: cityData,
            area: areaData,
            pinCode: pincodeData,
            brandAddress: storeData.store_address || "",
            returnDays: storeData.return_days || 0,
            exchangeDays: storeData.exchange_days || 0,
          });
        }

        if (curr_section >= 2) {
          setPriceFiltersData({
            avgPriceMin: storeData.average_price_min || null,
            avgPriceMax: storeData.average_price_max || null,
            priceRanges: priceRangeRes.data || [],
            priceRangesStr: priceRangeRes?.data.map((item: any) => ({
              id: item.price_range_id,
              label: item.price_range,
            })),
          });
        }

        if (curr_section >= 3) {
          setWhereToSellData({
            isOnline: storeData.is_online === true,
            isBoth: storeData.is_both === true,
          });
        }

        if (curr_section >= 4) {
          setSocialLinksData({
            instagramUsname: storeData.instagram_link
              ? new URL(storeData.instagram_link).pathname
                  .split("/")
                  .filter(Boolean)[0]
              : null,
            instagramUrl: storeData.instagram_link || "",
            facebookUrl: storeData.facebook_link || "",
            websiteUrl: storeData.shopify_url || "",
          });
        }

        if (curr_section >= 5) {
          setStorePhotosData({
            profileUrl: storeData.profile_image || "",
            bannerUrl: storeData.listing_page_image || "",
          });
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };
    fetchInitialData();
  }, [sellerId, storeId]);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("section", section);
    router.push(`?${current.toString()}`, { scroll: false });
  };

  /**
   * set active section as per user selection
   * set 'add single product' as active section by default
   */
  useEffect(() => {
    const section = searchParams.get("section") || "one_product";
    setActiveSection(section);
  }, [searchParams]);

  //set rendered section(form) based on active section 
  const renderSection = () => {
    switch (activeSection) {
      case "brand":
        return <BusinessDetailsComponent />;
      case "social":
        return <SocialLinksComponent />;
      case "price":
        return <PriceFiltersComponent />;
      case "market":
        return <WhereToSellComponent />;
      case "photos":
        return <StorePhotosComponent />;
      case "qr_code":
        return <QrCodeGeneration />;
      case "all_products":
        return <ViewAllProducts/>;
      case "bulk_products":
        return <BulkUploadPage />;
      case "one_product":
        return <ProductUploadPage />;
      case "size_charts":
        return <SizeChartPage />;
      default:
        return null;
    }
  };

  // handle the update logic for store 
  const handleUpdateClick = async () => {
    const res = await handleUpdate(activeSection, false);
    if (res) {
      toast.success("Store Updated!");
    } else {
      toast.error("Store not updated!");
    }
  };

  return (
    // both admin(seller) and super_admin(actual admin) can access the seller dashboard
    <ProtectedRoute role={["admin", "super_admin"]}>
      <div className="bg-gray-100">
        <Header
          title="Attirelly"
          actions={
            <button onClick={() => logout("/seller_signin")}>Log Out</button>
          }
        />
        {/* Main content container with responsive padding */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-6 p-4 md:p-6 justify-around">
          <div className="max-w-3xl lg:max-w-4xl">
            <DashboardSidebar
              selected={activeSection}
              onSelect={handleSectionChange}
            />
          </div>
          
          {/* Content area with responsive max-width */}
          <div className="flex-1 flex flex-col max-w-3xl lg:max-w-4xl gap-6">
            <div className="rounded-md bg-gray-100">{renderSection()}</div>
            {["brand", "price", "market", "social", "photos"].includes(
              activeSection
            ) && (
              <UpdateButton
                onClick={handleUpdateClick}
                disabled={false} // Replace with logic to enable/disable based on validation
              />
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
