// 'use client';
// import { useEffect, useState } from 'react';
// import DashboardSidebar from '@/components/Seller/DashboardSidebar';
// import SocialLinksComponent from '@/components/Seller/Sections/SocialLinks';
// import BusinessDetailsComponent from '@/components/Seller/Sections/BusinessDetails';
// import PriceFiltersComponent from '@/components/Seller/Sections/PriceFilters';
// import WhereToSellComponent from '@/components/Seller/Sections/WhereToSell';
// import StorePhotosComponent from '@/components/Seller/Sections/StorePhotos';
// import QrCodeGeneration from '@/components/Seller/Sections/QrGeneration';
// import ViewAllProducts from '@/components/Seller/Sections/ViewAllProducts'
// import BulkUploadPage from '@/components/Seller/Sections/BulkUploadProducts';
// import UpdateButton from '@/components/Seller/UpdateButton';
// import Header from '@/components/Header';
// import { useSellerStore } from '@/store/sellerStore'
// import { api } from '@/lib/axios';
// import ProtectedRoute from '@/components/ProtectedRoute';
// import { logout } from '@/utils/logout';
// import { useUpdateStore } from '@/utils/handleUpdate';
// import { useParams, useSearchParams } from "next/navigation";
// // import Toast from '@/components/ui/Toast';


// import ProductUploadPage from "../product_upload/page";
// import { toast } from "sonner";
// import { City, Area, Pincode } from "@/types/SellerTypes";

// // type City = { id: string; name: string; state_id: string };

// // type Area = { id: string, name: string, city_id: string };

// // type Pincode = { id: string, code: string, city_id: string };

// export default function SellerDashboardPage() {
//   const { handleUpdate } = useUpdateStore();
//   // const [toastMessage, setToastMessage] = useState("");
//   // const [toastType, setToastType] = useState<"success" | "error">("success");
//   const {
//     setStoreId,
//     setStoreNameString,
//     sellerId,
//     sellerName,
//     sellerEmail,
//     setBusinessDetailsData,
//     setPriceFiltersData,
//     setWhereToSellData,
//     setSocialLinksData,
//     setStorePhotosData,
//     setQrId,
//     setFurthestStep,
//     setSellerEmail,
//     setSellerName,
//     setSellerNumber
//   } = useSellerStore();
//   const [activeSection, setActiveSection] = useState('');
//   const searchParams = useSearchParams();
//   const storeId = searchParams.get('storeId');
//   console.log(storeId)

//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         console.log(sellerId)
//         let response;
//         let fetchedSellerName;
//         let fetchedSellerEmail;
//         if(sellerId){
//           response = await api.get('/stores/store_by_owner', { params: { store_owner_id: sellerId } })
//         }
//         else if(storeId){
//           response = await api.get(`stores/${storeId}`);
//           const store_owner_id = response.data.store_owner_id;
//           const resSeller = await api.get(`/users/user`, {params: {user_id: store_owner_id}});
//           const resData = resSeller.data;
//           console.log(resData);
//           setSellerEmail(resData.email);
//           setSellerName(resData.name);
//           setSellerNumber(resData.contact_number);
//           fetchedSellerEmail = resData.email;
//           fetchedSellerName = resData.name;
//         }
        
//         const storeData = response?.data;
//         console.log("response" , storeData);
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

//         const priceRangeRes = await api.get("stores/store_type_price_ranges", {
//           params: { store_id: storeData.store_id },
//         });
//         console.log("price range data", priceRangeRes);
//         if (curr_section >= 1) {
//           setBusinessDetailsData({
//             ownerName: sellerName || fetchedSellerName || '',
//             ownerEmail: sellerEmail || fetchedSellerEmail || '',
//             brandName: storeData.store_name || '',
//             businessWpNum: storeData.whatsapp_number || '',
//             brandTypes: storeData.store_types || [],
//             categories: storeData.categories || [],
//             genders: storeData.genders || [],
//             rentOutfits: storeData.rental === true ? "Yes" : "No",
//             city: cityData || [],
//             area: areaData || [],
//             pinCode: pincodeData || [],
//             brandAddress: storeData.store_address || "",
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
//         alert("error fetching data, signin again");
//       }
//     };
//     fetchInitialData();
//   }, [sellerId, storeId]);

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
//     console.log("activesession", activeSection);
//     const res = await handleUpdate(activeSection, false);
//     if (res) {
//       // setToastMessage("Store updated!");
//       // setToastType("success");
//       toast.success("Store Updated!");
//     } else {
//       // setToastMessage("Store not updated!");
//       // setToastType("error");
//       toast.error("Store not updated!");
//     }
//   };

//   return (
//     <ProtectedRoute role={["admin","super_admin"]}>
//       <div className='min-h-screen bg-gray-100'>
//         <Header
//           title="Attirelly"
//           actions={
//             <button
//               className="bg-white text-black rounded-2xl shadow-md p-2 cursor-pointer border transition hover:bg-gray-200"
//               onClick={() => logout("/seller_signin")}
//             >
//               Log Out
//             </button>
//           }
//         />
//         <div className="flex flex-col md:flex-row gap-6 p-6 justify-center">
//           <DashboardSidebar
//             selected={activeSection}
//             onSelect={setActiveSection}
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



import SellerDashboardContainer from "@/components/Seller/SellerDashboardContainer";
import { Suspense } from "react";
import {useRouter} from "next/navigation";

export default function SellerDashboardPage(){
  return (
    <Suspense>
      <SellerDashboardContainer/>
    </Suspense>
  )
}