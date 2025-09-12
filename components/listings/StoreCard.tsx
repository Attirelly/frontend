"use client";

import Image from "next/image";
import { useEffect } from "react";
import { StoreCardType } from "@/types/SellerTypes";
import { manrope } from "@/font";
import { useRouter } from "next/navigation";
import { useSellerStore } from "@/store/sellerStore";
import { event } from "@/lib/gtag";

/**
 * @interface StoreCardProps
 * @description Defines the props for the StoreCard component, extending the base `StoreCardType`.
 * @see StoreCardType
 */
interface StoreCardProps extends StoreCardType {}

/**
 * A responsive card component for displaying a summary of a single store.
 *
 * This component renders key information about a store, such as its name, location, and specialties.
 * It's designed to be used in a list of stores and is fully responsive, adapting its layout
 * from a vertical stack on mobile to a horizontal row on desktop. The entire card is clickable,
 * navigating the user to the store's detailed profile page.
 *
 * ### State Management
 * - It interacts with the `useSellerStore` (a Zustand store) to set the `storeId` globally when
 * a card is clicked. This allows the destination page (`/store_profile/[id]`) to know which
 * store to load without needing to pass the ID as a prop.
 *
 * ### Performance
 * - To improve perceived navigation speed, the component uses `router.prefetch()` in a `useEffect`
 * hook. This tells Next.js to start loading the data for the store's profile page in the
 * background as soon as the card is rendered, making the subsequent navigation feel faster.
 *
 * ### Analytics
 * - A Google Analytics event is fired via the `event` utility whenever a card is clicked,
 * tracking user engagement with specific stores.
 *
 * @param {StoreCardProps} props - The data for the store to be displayed.
 * @returns {JSX.Element} A responsive and interactive store card.
 * @see {@link https://nextjs.org/docs/app/api-reference/functions/use-router | Next.js useRouter}
 * @see {@link https://nextjs.org/docs/pages/api-reference/components/image | Next.js Image Component}
 * @see {@link https://docs.pmnd.rs/zustand/getting-started/introduction | Zustand Documentation}
 */
export default function StoreCard({
  imageUrl,
  storeName,
  location,
  storeTypes,
  priceRanges,
  bestSelling = [],
  instagramFollowers,
  id,
}: StoreCardProps) {
  const { setStoreId } = useSellerStore();
  const router = useRouter();

  /**
   * Formats a number string into a compact, human-readable format (e.g., 1200 -> "1.2K").
   * @param {string} [value] - The numeric string to format.
   * @returns {string} The formatted string (e.g., "1.2K", "5.5M") or the original value if invalid.
   */
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

  /**
   * This effect prefetches the store's profile page to make navigation feel faster.
   * It runs once when the component mounts.
   */
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
      className="w-full max-w-[912px] mx-auto relative border border-[#F1F1F1] rounded-xl p-4 flex flex-col md:flex-row gap-4 bg-white hover:[box-shadow:0px_4px_20px_rgba(0,0,0,0.15)] transition-all cursor-pointer"
      onClick={handleCardClick}
    >
      {/* --- Store Image --- */}
      {/* The image container is responsive: full-width on mobile with a 1:1 aspect ratio, and a fixed size on desktop. */}

      <div className="relative w-full md:w-[256px] aspect-[1] md:h-[224px] md:aspect-auto  flex-shrink-0">
        <Image
          src={imageUrl}
          alt={storeName}
          fill
          className="object-cover object-top rounded-xl"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Mobile-only Instagram followers display, overlaid on the image. */}
        {instagramFollowers && (
          <div className="md:hidden absolute -bottom-5 -left-1">
            <Image
              src="/ListingPageHeader/curved_background.svg"
              alt="Instagram Background"
              width={180}
              height={20}
              className=""
            />

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
        <div className="flex flex-col gap-2">
          {" "}
          {/* Increased gap for better spacing */}
          <div className="flex justify-between items-start flex-wrap gap-2">
            <div className="flex-grow">
              <h3
                className="text-lg md:text-2xl text-black"
                style={{ fontWeight: 500 }}
              >
                {storeName}
              </h3>
            </div>
            {/* Desktop-only Instagram followers display. */}
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
          {/* Tags for Store Types and Price Ranges */}
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
