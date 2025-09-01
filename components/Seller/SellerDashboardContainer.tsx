// "use client";
// import { useEffect, useState } from "react";
// import DashboardSidebar from "@/components/Seller/DashboardSidebar";
// import SocialLinksComponent from "@/components/Seller/Sections/SocialLinks";
// import BusinessDetailsComponent from "@/components/Seller/Sections/BusinessDetails";
// import PriceFiltersComponent from "@/components/Seller/Sections/PriceFilters";
// import WhereToSellComponent from "@/components/Seller/Sections/WhereToSell";
// import StorePhotosComponent from "@/components/Seller/Sections/StorePhotos";
// import QrCodeGeneration from "@/components/Seller/Sections/QrGeneration";
// import ViewAllProducts from "@/components/Seller/Sections/ViewAllProducts";
// import BulkUploadPage from "@/components/Seller/Sections/BulkUploadProducts";
// import UpdateButton from "@/components/Seller/UpdateButton";
// import Header from "@/components/Header";
// import { useSellerStore } from "@/store/sellerStore";
// import { api } from "@/lib/axios";
// import ProtectedRoute from "@/components/ProtectedRoute";
// import { logout } from "@/utils/logout";
// import { useUpdateStore } from "@/utils/handleUpdate";
// import { useParams, useRouter, useSearchParams } from "next/navigation";
// // import Toast from '@/components/ui/Toast';

// import ProductUploadPage from "@/app/product_upload/page";
// import { toast } from "sonner";
// import { City, Area, Pincode } from "@/types/SellerTypes";

// // type City = { id: string; name: string; state_id: string };

// // type Area = { id: string, name: string, city_id: string };

// // type Pincode = { id: string, code: string, city_id: string };

// export default function SellerDashboardContainer() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const sectionFromUrl = searchParams.get("section") || "one_product";

//   const { handleUpdate } = useUpdateStore();
//   // const [toastMessage, setToastMessage] = useState("");
//   // const [toastType, setToastType] = useState<"success" | "error">("success");
//   const {
//     setStoreId,
//     setStoreNameString,
//     sellerId,
//     setSellerId,
//     sellerName,
//     sellerEmail,
//     isInstagramConnected,
//     setBusinessDetailsData,
//     setPriceFiltersData,
//     setWhereToSellData,
//     setSocialLinksData,
//     setStorePhotosData,
//     setQrId,
//     setFurthestStep,
//     setSellerEmail,
//     setSellerName,
//     setSellerNumber,
//     setIsInstagramConnected,
//   } = useSellerStore();
//   // const [activeSection, setActiveSection] = useState("");
//   const [activeSection, setActiveSection] = useState(sectionFromUrl);
//   const storeId = searchParams.get("storeId");
//   console.log(sellerId);

//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         let response;
//         let fetchedSellerName;
//         let fetchedSellerEmail;
//         if (sellerId) {
//           response = await api.get("/stores/store_by_owner", {
//             params: { store_owner_id: sellerId },
//           });
//         } else if (storeId) {
//           response = await api.get(`stores/${storeId}`);
//           const store_owner_id = response.data.store_owner_id;
//           const resSeller = await api.get(`/users/user`, {
//             params: { user_id: store_owner_id },
//           });
//           const resData = resSeller.data;
//           console.log(resData);
//           setSellerId(store_owner_id);
//           setSellerEmail(resData.email);
//           setSellerName(resData.name);
//           setSellerNumber(resData.contact_number);
//           fetchedSellerEmail = resData.email;
//           fetchedSellerName = resData.name;
//         }

//         const storeData = response?.data;

//         const curr_section = storeData.curr_section;

//         const cityData: City[] = storeData.city ? [storeData.city] : [];
//         const areaData: Area[] = storeData.area ? [storeData.area] : [];
//         const pincodeData: Pincode[] = storeData.pincode
//           ? [storeData.pincode]
//           : [];

//         setStoreId(storeData.store_id);

//         setQrId(storeData.qr_id);
//         setFurthestStep(curr_section);
//         setStoreNameString(storeData.store_name);

//         const instagramCheck = await api.get(
//           `/instagram/connect_check/${storeData.store_id}`
//         );

//         console.log("instagram check", instagramCheck);

//         setIsInstagramConnected(instagramCheck?.data);

//         const priceRangeRes = await api.get("stores/store_type_price_ranges", {
//           params: { store_id: storeData.store_id },
//         });

//         if (curr_section >= 1) {
//           setBusinessDetailsData({
//             ownerName: sellerName || fetchedSellerName || "",
//             ownerEmail: sellerEmail || fetchedSellerEmail || "",
//             brandName: storeData.store_name || "",
//             businessWpNum: storeData.whatsapp_number || "",
//             brandTypes: storeData.store_types || [],
//             categories: storeData.categories || [],
//             genders: storeData.genders || [],
//             rentOutfits: storeData.rental === true ? "Yes" : "No",
//             city: cityData || [],
//             area: areaData || [],
//             pinCode: pincodeData || [],
//             brandAddress: storeData.store_address || "",
//             returnDays: storeData.return_days || 0,
//             exchangeDays: storeData.exchange_days || 0,
//           });
//         }

//         // setBusinessDetailsValid(true);
//         if (curr_section >= 2) {
//           setPriceFiltersData({
//             avgPriceMin: storeData.average_price_min || null,
//             avgPriceMax: storeData.average_price_max || null,
//             priceRanges: priceRangeRes.data || [],
//             priceRangesStr: priceRangeRes?.data.map((item) => ({
//               id: item.price_range_id,
//               label: item.price_range,
//             })),
//           });
//         }

//         if (curr_section >= 3) {
//           setWhereToSellData({
//             isOnline: storeData.is_online === true ? true : false,
//             isBoth: storeData.is_both === true ? true : false,
//           });
//         }

//         if (curr_section >= 4) {
//           setSocialLinksData({
//             instagramUsname: storeData.instagram_link
//               ? new URL(storeData.instagram_link).pathname
//                   .split("/")
//                   .filter(Boolean)[0]
//               : null,
//             instagramUrl: storeData.instagram_link || "",
//             facebookUrl: storeData.facebook_link || "",
//             websiteUrl: storeData.shopify_url || "",
//           });
//         }

//         if (curr_section >= 5) {
//           setStorePhotosData({
//             profileUrl: storeData.profile_image || "",
//             bannerUrl: storeData.listing_page_image || "",
//           });
//         }
//       } catch (error) {
//         console.error("Error fetching initial data:", error);
//         // alert("error fetching data, signin again");
//       }
//     };
//     fetchInitialData();
//   }, [sellerId, storeId]);

//   const handleSectionChange = (section: string) => {
//     setActiveSection(section);
//     const current = new URLSearchParams(Array.from(searchParams.entries()));
//     current.set("section", section);
//     router.push(`?${current.toString()}`, { scroll: false });
//   };

//   useEffect(() => {
//     const section = searchParams.get("section") || "one_product";
//     setActiveSection(section);
//   }, [searchParams]);

//   const renderSection = () => {
//     switch (activeSection) {
//       case "brand":
//         return <BusinessDetailsComponent />;
//       case "social":
//         return <SocialLinksComponent />;
//       case "price":
//         return <PriceFiltersComponent />;
//       case "market":
//         return <WhereToSellComponent />;
//       case "photos":
//         return <StorePhotosComponent />;
//       case "qr_code":
//         return <QrCodeGeneration />;
//       case "all_products":
//         return <ViewAllProducts />;
//       case "bulk_products":
//         return <BulkUploadPage />;
//       case "one_product":
//         return <ProductUploadPage />;
//       default:
//         return null;
//     }
//   };

//   const handleUpdateClick = async () => {
//     const res = await handleUpdate(activeSection, false);
//     if (res) {
//       toast.success("Store Updated!");
//     } else {
//       toast.error("Store not updated!");
//     }
//   };

//   return (
//     <ProtectedRoute role={["admin", "super_admin"]}>
//       <div className="min-h-screen bg-gray-100">
//         <Header
//           title="Attirelly"
//           actions={
//             <button
//              onClick={() => logout("/seller_signin")}
//             >
//               Log Out
//             </button>
//           }
//         />
//         <div className="flex flex-col md:flex-row gap-6 p-6 justify-center">
//           <DashboardSidebar
//             selected={activeSection}
//             onSelect={handleSectionChange}
//           />
//           <div className="flex flex-col w-full md-w-2xl gap-6">
//             <div className=" mt-[60px] rounded-md bg-gray-100">
//               {renderSection()}
//             </div>
//             {["brand", "price", "market", "social", "photos"].includes(
//               activeSection
//             ) && (
//               <UpdateButton
//                 onClick={handleUpdateClick}
//                 disabled={false} // Replace with logic to enable/disable based on validation
//               />
//             )}
//           </div>
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// }

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
      case "qr_code":
        return <QrCodeGeneration />;
      case "all_products":
        return <ViewAllProducts />;
      case "bulk_products":
        return <BulkUploadPage />;
      case "one_product":
        return <ProductUploadPage />;
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
      <div className="min-h-screen bg-gray-100">
        <Header
          title="Attirelly"
          actions={
            <button onClick={() => logout("/seller_signin")}>Log Out</button>
          }
        />
        {/* Main content container with responsive padding */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 p-4 md:p-6 justify-around">
          <div className="max-w-3xl lg:max-w-4xl">
            <DashboardSidebar
              selected={activeSection}
              onSelect={handleSectionChange}
            />
          </div>

          {/* Content area with responsive max-width */}
          <div className="flex flex-col max-w-3xl lg:max-w-4xl gap-6">
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
