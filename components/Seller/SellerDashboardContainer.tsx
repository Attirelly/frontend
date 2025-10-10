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
// ✅ ADDED: Import the new discount component
import DiscountComponent from "@/components/Seller/Sections/DiscountComponent";
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
import OcassionPage from "./Sections/AddToOcassion";
import ViewOccasionPage from "./Sections/ViewOcassion";

export default function SellerDashboardContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sectionFromUrl = searchParams.get("section") || "one_product";

  const { handleUpdate } = useUpdateStore();

  const {
    // ✅ ADDED: Destructure storeId to pass to the discount component
    storeId: storeIdFromStore,
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
  const storeIdFromUrl = searchParams.get("storeId"); // Keep this for admin use case

  // Use the storeId from Zustand store, which is populated on initial fetch
  const storeIdToUse = storeIdFromStore || storeIdFromUrl;

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        let response;
        let fetchedSellerName;
        let fetchedSellerEmail;
        if (sellerId) {
          response = await api.get("/stores/store_by_owner", {
            params: { store_owner_id: sellerId },
          });
        } else if (storeIdFromUrl) {
          response = await api.get(`stores/${storeIdFromUrl}`);
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
  }, [sellerId, storeIdFromUrl, setBusinessDetailsData, setSellerId, setSellerEmail, setSellerName, setSellerNumber, setStoreId, setQrId, setFurthestStep, setStoreNameString, setIsInstagramConnected, setPriceFiltersData, setWhereToSellData, setSocialLinksData, setStorePhotosData, sellerEmail, sellerName]);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("section", section);
    router.push(`?${current.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const section = searchParams.get("section") || "one_product";
    setActiveSection(section);
  }, [searchParams]);

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
      // ✅ MODIFIED: Conditionally render DiscountComponent only when storeIdToUse is a valid string.
      case "discounts":
        console.log(storeIdToUse)
        return storeIdToUse ? (
          <DiscountComponent storeId={storeIdToUse} />
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 w-full max-w-4xl mx-auto text-center">
            <p className="text-gray-600">Loading store information... Please complete the 'Business Details' section if you haven't already.</p>
          </div>
        );
      case "qr_code":
        return <QrCodeGeneration />;
      case "all_products":
        return <ViewAllProducts />;
      case "bulk_products":
        return <BulkUploadPage />;
      case "one_product":
        return <ProductUploadPage />;
      case "size_charts":
        return <SizeChartPage />;
      case "add_to_ocassion":
        return <OcassionPage/>;
      case "view_ocassion":
        return <ViewOccasionPage/>;
      default:
        return null;
    }
  };

  const handleUpdateClick = async () => {
    const res = await handleUpdate(activeSection, false);
    if (res) {
      toast.success("Store Updated!");
    } else {
      toast.error("Store not updated!");
    }
  };

  return (
    <ProtectedRoute role={["admin", "super_admin"]}>
      <div className="bg-gray-100">
        <Header
          title="Attirelly"
          actions={
            <button onClick={() => logout("/seller_signin")}>Log Out</button>
          }
        />
        <div className="flex flex-col md:flex-row gap-3 md:gap-6 p-4 md:p-6 justify-around">
          <div className="max-w-3xl lg:max-w-4xl">
            <DashboardSidebar
              selected={activeSection}
              onSelect={handleSectionChange}
            />
          </div>
          
          <div className="flex-1 flex flex-col max-w-3xl lg:max-w-4xl gap-6">
            <div className="rounded-md bg-gray-100">{renderSection()}</div>
            {["brand", "price", "market", "social", "photos"].includes(
              activeSection
            ) && (
              <UpdateButton
                onClick={handleUpdateClick}
                disabled={false}
              />
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

