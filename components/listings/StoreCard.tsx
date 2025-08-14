"use client";

import Image from "next/image";
import { event } from "@/lib/gtag";
import { manrope } from "@/font";
import { useSellerStore } from "@/store/sellerStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFilterStore, useProductFilterStore } from "@/store/filterStore";
import { format } from "path";

type StoreCardProps = {
  imageUrl: string;
  storeName: string;
  location: string;
  storeTypes: string[];
  priceRanges: string[];
  bestSelling?: string[] | [];
  discount?: number;
  instagramFollowers?: string;
  id: string;
};

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
  const { setFacetInit } = useProductFilterStore();
  const router = useRouter();

    function formatNumberStr(value?: string) {
  if (!value) return "";
  const num = Number(value);
  if (isNaN(num)) return value; // if not a number, just show as is
  if (num < 1000) return num.toString();
  if (num < 1_000_000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  if (num < 1_000_000_000)
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
}

 
  useEffect(() => {
    router.prefetch("/store_profile");
  }, []);

  const handleCardClick = () => {
    
    setStoreId(id);
    event({
      action: "Store",
      params: {
        store_name: storeName,
        store_id: id,
      },
    });
    // setFacetInit(false);
    router.push("/store_profile/" + id);
  };

  return (
    <div
      className="w-[912px] relative border border-[#F1F1F1] rounded-xl p-4 flex gap-4 bg-[#FFFFFF] hover:[box-shadow:0px_4px_20px_rgba(0,0,0,0.15)] transition-all cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Store Image */}
      <div className="relative w-[256px] h-[224px] overflow-hidden flex-shrink-0">
        <Image
          src={imageUrl}
          alt={storeName}
          fill
          className="object-cover object-top rounded-xl"
          sizes="(max-width: 640px) 100vw, 
                            (max-width: 1024px) 50vw, 
                             33vw"
        />
        {discount && (
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
            {/* <div className="absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-red to-red pointer-events-none" /> */}
          </div>
        )}
      </div>

      {/* Store Info */}
      <div
        className={`${manrope.className} flex flex-col justify-between w-full gap-[8.5px]`}
        style={{ fontWeight: 400 }}
      >
        <div className="flex flex-col gap-[8.5px]">
          <div className="flex justify-between items-start flex-wrap">
            <h3
              className="text-2xl text-black max-w-[80%]"
              style={{ fontWeight: 500 }}
            >
              {storeName}
            </h3>
            {/* Instagram Followers */}
            {instagramFollowers && (
              <div className="flex items-center gap-1 mt-2 text-xs text-[#333333]">
                <Image
                  src="/OnboardingSections/instagram.svg"
                  alt="Instagram"
                  width={20}
                  height={20}
                />
                <span className="text-[#0F0F0F]" style={{ fontWeight: 600 }}>
                  {formatNumberStr(instagramFollowers)}{" "}
                </span>
                Followers
              </div>
            )}
          </div>
          <div className="flex gap-1">
            <Image
              src="ListingPageHeader/location_pin.svg"
              alt="Location Pin"
              width={14}
              height={14}
            />
            <p className="text-[14px] text-[#5F5F5F]">{location}</p>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
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

          <div className="flex flex-wrap mt-2 gap-2">
            {priceRanges?.map((type, idx) => (
              <span
                key={idx}
                className="text-xs bg-[#F5F5F5] px-3 py-1 rounded-full text-black"
              >
                {type}
              </span>
            ))}
          </div>
        </div>
        {bestSelling.length > 0 && (
          <div className="flex flex-col gap-[8.5px]">
            <div className="border border-t border-[#D9D9D9]" />
            <p className={`${manrope.className} text-base text-black`} style={{fontWeight:500}}>Best Selling</p>
            <div className="flex gap-2">
{bestSelling?.map((item, index) => (
              <span key={index} className={`${manrope.className} mr-4 text-sm text-[#676363]`} style={{fontWeight:400}}>
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
