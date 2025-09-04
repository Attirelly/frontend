// "use client";

// import Image from "next/image";
// import { event } from "@/lib/gtag";
// import { manrope } from "@/font";
// import { useSellerStore } from "@/store/sellerStore";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";
// import { useFilterStore, useProductFilterStore } from "@/store/filterStore";
// import { format } from "path";

// type StoreCardProps = {
//   imageUrl: string;
//   storeName: string;
//   location: string;
//   storeTypes: string[];
//   priceRanges: string[];
//   bestSelling?: string[] | [];
//   discount?: number;
//   instagramFollowers?: string;
//   id: string;
// };

// export default function StoreCard({
//   imageUrl,
//   storeName,
//   location,
//   storeTypes,
//   priceRanges,
//   bestSelling = [],
//   discount,
//   instagramFollowers,
//   id,
// }: StoreCardProps) {
//   const { setStoreId } = useSellerStore();
//   const { setFacetInit } = useProductFilterStore();
//   const router = useRouter();

//     function formatNumberStr(value?: string) {
//   if (!value) return "";
//   const num = Number(value);
//   if (isNaN(num)) return value; // if not a number, just show as is
//   if (num < 1000) return num.toString();
//   if (num < 1_000_000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
//   if (num < 1_000_000_000)
//     return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
//   return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
// }

//   useEffect(() => {
//     router.prefetch("/store_profile");
//   }, []);

//   const handleCardClick = () => {

//     setStoreId(id);
//     event({
//       action: "Store",
//       params: {
//         store_name: storeName,
//         store_id: id,
//       },
//     });
//     // setFacetInit(false);
//     router.push("/store_profile/" + id);
//   };

//   return (
//     <div
//       className="w-[912px] relative border border-[#F1F1F1] rounded-xl p-4 flex gap-4 bg-[#FFFFFF] hover:[box-shadow:0px_4px_20px_rgba(0,0,0,0.15)] transition-all cursor-pointer"
//       onClick={handleCardClick}
//     >
//       {/* Store Image */}
//       <div className="relative w-[256px] h-[224px] overflow-hidden flex-shrink-0">
//         <Image
//           src={imageUrl}
//           alt={storeName}
//           fill
//           className="object-cover object-top rounded-xl"
//           sizes="(max-width: 640px) 100vw,
//                             (max-width: 1024px) 50vw,
//                              33vw"
//         />
//         {discount && (
//           <div
//             className={`absolute bottom-0 left-0 mb-4 w-fit h-7 flex items-center pl-2 pr-10 overflow-hidden bg-[linear-gradient(to_right,_#2563eb_60%,_transparent)] ${manrope.className} text-white text-xs font-medium`}
//           >
//             <Image
//               src="/ListingPageHeader/discount.svg"
//               alt="Discount"
//               width={15}
//               height={15}
//               className="mr-2"
//             />
//             Upto {discount}% OFF
//             {/* <div className="absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-red to-red pointer-events-none" /> */}
//           </div>
//         )}
//       </div>

//       {/* Store Info */}
//       <div
//         className={`${manrope.className} flex flex-col justify-between w-full gap-[8.5px]`}
//         style={{ fontWeight: 400 }}
//       >
//         <div className="flex flex-col gap-[8.5px]">
//           <div className="flex justify-between items-start flex-wrap">
//             <h3
//               className="text-2xl text-black max-w-[80%]"
//               style={{ fontWeight: 500 }}
//             >
//               {storeName}
//             </h3>
//             {/* Instagram Followers */}
//             {instagramFollowers && (
//               <div className="flex items-center gap-1 mt-2 text-xs text-[#333333]">
//                 <Image
//                   src="/OnboardingSections/instagram.svg"
//                   alt="Instagram"
//                   width={20}
//                   height={20}
//                 />
//                 <span className="text-[#0F0F0F]" style={{ fontWeight: 600 }}>
//                   {formatNumberStr(instagramFollowers)}{" "}
//                 </span>
//                 Followers
//               </div>
//             )}
//           </div>
//           <div className="flex gap-1">
//             <Image
//               src="ListingPageHeader/location_pin.svg"
//               alt="Location Pin"
//               width={14}
//               height={14}
//             />
//             <p className="text-[14px] text-[#5F5F5F]">{location}</p>
//           </div>

//           <div className="flex flex-wrap gap-2 mt-2">
//             {storeTypes.map((type, idx) => (
//               <span
//                 key={idx}
//                 className="text-xs bg-[#F5F5F5] px-3 py-1 rounded-full text-black"
//                 style={{ fontWeight: 500 }}
//               >
//                 {type}
//               </span>
//             ))}
//           </div>

//           <div className="flex flex-wrap mt-2 gap-2">
//             {priceRanges?.map((type, idx) => (
//               <span
//                 key={idx}
//                 className="text-xs bg-[#F5F5F5] px-3 py-1 rounded-full text-black"
//               >
//                 {type}
//               </span>
//             ))}
//           </div>
//         </div>
//         {bestSelling.length > 0 && (
//           <div className="flex flex-col gap-[8.5px]">
//             <div className="border border-t border-[#D9D9D9]" />
//             <p className={`${manrope.className} text-base text-black`} style={{fontWeight:500}}>Best Selling</p>
//             <div className="flex gap-2">
// {bestSelling?.map((item, index) => (
//               <span key={index} className={`${manrope.className} mr-4 text-sm text-[#676363]`} style={{fontWeight:400}}>
//                 {item}
//               </span>
//             ))}
//             </div>

//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
"use client";

import Image from "next/image";
import { useEffect } from "react";
import { StoreCardType } from "@/types/SellerTypes";
import { manrope } from "@/font";
import { useRouter } from "next/navigation";
import { useSellerStore } from "@/store/sellerStore";
import { event } from "@/lib/gtag";

// NOTE: The props interface was updated to match the component's usage.
interface StoreCardProps extends StoreCardType {}

export default function StoreCard({
  imageUrl,
  storeName,
  location,
  storeTypes,
  priceRanges,
  bestSelling = [],
  discount,
  instagramFollowers,
  id,
}: StoreCardProps) {
  const { setStoreId } = useSellerStore();
  const router = useRouter();

  function formatNumberStr(value?: string) {
    if (!value) return "";
    const num = Number(value);
    if (isNaN(num)) return value;
    if (num < 1000) return num.toString();
    if (num < 1_000_000)
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    if (num < 1_000_000_000)
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  }

  useEffect(() => {
    router.prefetch("/store_profile/" + id);
  }, [id, router]);

  const handleCardClick = () => {
    setStoreId(id);
    event({
      action: "Store Card Click",
      params: { store_name: storeName, store_id: id },
    });
    router.push("/store_profile/" + id);
  };

  return (
    <div
      // ✅ 1. Layout is now responsive: stacks vertically on mobile, row on desktop.
      // Width is now flexible instead of fixed.
      className="w-full max-w-[912px] mx-auto relative border border-[#F1F1F1] rounded-xl p-4 flex flex-col md:flex-row gap-4 bg-white hover:[box-shadow:0px_4px_20px_rgba(0,0,0,0.15)] transition-all cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Store Image */}
      {/* ✅ 2. Image size is responsive: full-width on mobile, fixed-width on desktop. */}
      {/* Aspect ratio is maintained for a consistent look on mobile. */}
      <div className="relative w-full md:w-[256px] aspect-[1] md:h-[224px] md:aspect-auto  flex-shrink-0">
        <Image
          src={imageUrl}
          alt={storeName}
          fill
          className="object-cover object-top rounded-xl"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* {discount && (
          <div
            className={`absolute bottom-0 left-0 mb-4 w-fit h-7 flex items-center pl-2 pr-10 overflow-hidden bg-[linear-gradient(to_right,_#2563eb_60%,_transparent)] ${manrope.className} text-white text-xs font-medium`}
          >
            <Image
              src="/ListingPageHeader/discount.svg"
              alt="Discount"
              width={15}
              height={15}
              className="mr-2"
            />
            Upto {discount}% OFF
          </div>
        )} */}
        {instagramFollowers && (
          <div className="md:hidden absolute -bottom-5 -left-1">
            <Image
            src="/ListingPageHeader/curved_background.svg"
            alt="Instagram Background"
            width={180}
            height={20}
            className=""/>

            <div
            className={`absolute bottom-0 left-0 w-fit h-9 flex items-start pl-4 pr-10 pt-1 overflow-hidden ${manrope.className} text-black text-xs font-medium`}
          >
            <Image
              src="/OnboardingSections/instagram.svg"
              alt="Instagram"
              width={15}
              height={15}
              className="mr-2"
            />
            {formatNumberStr(instagramFollowers)} Followers
          </div>

          </div>
          
        )}
      </div>

      {/* Store Info */}
      <div
        className={`${manrope.className} flex flex-col justify-between w-full gap-2 md:gap-1`}
        style={{ fontWeight: 400 }}
      >
        <div className="flex flex-col gap-2"> {/* Increased gap for better spacing */}
          <div className="flex justify-between items-start flex-wrap gap-2">
            <div className="flex-grow">
              <h3
                className="text-lg md:text-2xl text-black"
                style={{ fontWeight: 500 }}
              >
                {storeName}
              </h3>
            </div>
            {instagramFollowers && (
              <div className="hidden flex-shrink-0 md:flex items-center gap-1 text-xs text-[#333333] pt-1.5">
                <Image
                  src="/OnboardingSections/instagram.svg"
                  alt="Instagram"
                  width={20}
                  height={20}
                />
                <span className="text-[#0F0F0F]" style={{ fontWeight: 600 }}>
                  {formatNumberStr(instagramFollowers)}{" "}
                </span>
                <span>Followers</span>
              </div>
            )}
          </div>
          <div className="flex gap-1 items-center">
            <Image
              src="ListingPageHeader/location_pin.svg"
              alt="Location Pin"
              width={14}
              height={14}
            />
            <p className="text-sm text-[#5F5F5F]">{location}</p>
          </div>

          <div className="flex flex-col flex-wrap gap-2 mt-1">
            <div>
            {storeTypes.map((type, idx) => (
              <span
                key={idx}
                className="text-xs bg-[#F5F5F5] px-3 py-1 rounded-full text-black"
                style={{ fontWeight: 500 }}
              >
                {type}
              </span>
            ))}
            </div>
            <div>
              {priceRanges &&
                  [...new Set(priceRanges)].map((type) => (
                    <span
                      key={type} // Use the unique price range as the key
                      className="text-xs bg-[#F5F5F5] px-3 py-1 rounded-full text-black"
                      style={{ fontWeight: 400 }}
                    >
                      {type}
                    </span>
                  ))}
            </div>
          </div>
        </div>
        {bestSelling && bestSelling.length > 0 && (
          <div className="flex flex-col gap-2 pt-2 mt-auto">
            <div className="border-t border-[#D9D9D9]" />
            <p className="text-base text-black" style={{ fontWeight: 500 }}>
              Best Selling
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {bestSelling.map((item, index) => (
                <span
                  key={index}
                  className="text-sm text-[#676363]"
                  style={{ fontWeight: 400 }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
