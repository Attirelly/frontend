import Image from "next/image";
import { StoreInfoType } from "@/types/SellerTypes";
import { manrope } from "@/font";
import { useState } from "react";
import { toast } from "sonner";

const StoreTypeImage = [
  { name: "Designer Label", url: "/Homepage/designer_labels.svg" },
  { name: "Retail Store", url: "/Homepage/retail_stores.svg" },
  { name: "Boutiques", url: "/ListingPageHeader/boutiques.svg" },
  { name: "Tailor", url: "/Homepage/tailor.svg" },
  { name: "Stylist", url: "/Homepage/styler.svg" },
];

// ✅ Utility: safely parse and format number strings into K / M / B
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

export default function StoreInfoPage({
  id,
  imageUrl,
  locationUrl,
  storeName,
  post_count,
  instagramFollowers,
  product_count,
  bio,
  storeTypes,
  priceRanges,
  city,
  area,
  phone_number,
}: StoreInfoType) {
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const TRUNCATE_LENGTH = 111;

  const handleLocationRoute = () => {
    if (typeof locationUrl === "string" && locationUrl) {
      window.open(locationUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handlePhoneClick = () => {
    // window.open(`tel:${phone_number}`, "_blank", "noopener,noreferrer");
    setShowPhone(!showPhone);
  };

  const handleCopyUrl = async () => {
    try {
      const currentUrl = window.location.href;
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      toast.success("Store Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 p-6">
      {/* Left: Circular Store Image */}
      <div className="flex flex-col items-center justify-center">
        <div className="relative w-32 h-32">
          <Image
            src={`https://image-proxy.ranarahul16-rr.workers.dev/?url=${encodeURIComponent(imageUrl)}`}
            alt={storeName}
            fill
            className="rounded-full object-cover object-top"
          />

          {/* Verified Badge */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
            <Image
              src="/ListingPageHeader/verified_logo.svg"
              alt="Verified"
              width={24}
              height={24}
            />
          </div>
        </div>

        {/* Location */}
        <div
  className={`
    group flex items-center gap-2 mt-6 
    ${locationUrl ? "cursor-pointer" : "cursor-default"}
  `}
  onClick={locationUrl ? handleLocationRoute : undefined}
>
  <Image
    src="/ListingPageHeader/location_pin_black.svg"
    alt="Location"
    width={16}
    height={16}
    className={`${locationUrl ? "transition-transform duration-200 ease-in-out group-hover:-translate-y-1" : ""}`}
  />
  <span
    className={`
      ${manrope.className} text-sm text-black ${locationUrl ? "transition-colors duration-200 group-hover:text-gray-400" : ""}
    `}
    style={{ fontWeight: 400 }}
  >
    {area === 'Others' ? '' : `${area},`} {city}
  </span>
</div>
      </div>

      {/* Right: Store Info */}
      <div className={`${manrope.className} flex flex-col`}>
        <div className="flex justify-between items-start flex-wrap">
          <h2 className="text-xl text-black mb-2 max-w-[60%] " style={{ fontWeight: 500, wordSpacing: "2px" }}>
            {storeName}
          </h2>
          <div className="flex gap-2.5 flex-shrink-0">
            <button
              className={`flex border border-black rounded-full items-center justify-center gap-2 px-4 transition-all duration-300 ${showPhone ? "bg-gray-100" : ""
                }`}
              onClick={handlePhoneClick}
            >
              <Image
                src="/ListingPageHeader/phone.svg"
                alt="call"
                width={18}
                height={18}
              />
              {showPhone && (
                <span className="text-black text-sm" style={{ fontWeight: 400 }}>
                  {phone_number.startsWith("11111", 0) ? "9915916707" : phone_number}
                </span>
              )}
            </button>
            <button
              className="flex border border-black rounded-full items-center justify-center gap-2 px-4"
              onClick={handleCopyUrl}
            >
              <span className="text-black" style={{ fontWeight: 400 }}>Share</span>
              <Image
                src="/ListingPageHeader/share.svg"
                alt="share"
                width={18}
                height={18}
              />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-6">
            <div className="flex gap-12">
              {post_count && post_count !== "0" ? (
                <div className="flex flex-col gap-1 items-center">
                  <h2 className="text-black" style={{ fontWeight: 700 }}>
                    {formatNumberStr(post_count)}
                  </h2>
                  <span className="text-black" style={{ fontWeight: 400 }}>Posts</span>
                </div>
              ) : (
                <div></div>
              )}

              {instagramFollowers && instagramFollowers !== "0" ? (
                <div className="flex flex-col gap-1 items-center">
                  <h2 className="text-black" style={{ fontWeight: 700 }}>
                    {formatNumberStr(instagramFollowers)}
                  </h2>
                  <span className="text-black" style={{ fontWeight: 400 }}>Followers</span>
                </div>
              ) : (
                <div></div>
              )}

              {product_count && product_count !== "0" ? (
                <div className="flex flex-col gap-1 items-center">
                  <h2 className="text-black" style={{ fontWeight: 700 }}>
                    {formatNumberStr(product_count)}
                  </h2>
                  <span className="text-black" style={{ fontWeight: 400 }}>Products</span>
                </div>
              ) : (
                <div></div>
              )}
            </div>

            {/* Bio */}
            {bio && (
              <p className={`text-black ${bio.length > TRUNCATE_LENGTH ? "cursor-pointer" : ""}`}  style={{ fontWeight: 400, whiteSpace: "pre-line" }}
              onClick={() => setIsBioExpanded(!isBioExpanded)}>
                {isBioExpanded || bio.length <= TRUNCATE_LENGTH
                  ? bio
                  : `${bio.substring(0, TRUNCATE_LENGTH)}...`}

                {/* more button */}
                {bio.length > TRUNCATE_LENGTH && !isBioExpanded && (
                  <button
                    className="text-gray-500 ml-1 cursor-pointer bg-transparent border-none p-0"
                    style={{ fontWeight: 500 }}
                  >
                    more
                  </button>
                )}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {/* Store Types */}
            <div className="flex flex-wrap mt-2 gap-2">
              {storeTypes.map((type, idx) => {
                const imageObj = StoreTypeImage.find((img) => img.name === type);
                return (
                  <span
                    key={idx}
                    className="bg-[#F8F8F8] px-2 py-1 rounded-full text-black flex gap-1"
                    style={{ fontWeight: 400 }}
                  >
                    {/* {imageObj && (
                      <Image
                        src={imageObj.url}
                        alt="Store Type"
                        width={18}
                        height={18}
                      />
                    )} */}
                    {type}
                  </span>
                );
              })}
            </div>

            {/* Price Ranges */}
            <div className="flex flex-wrap mt-2 gap-2">
              {priceRanges?.map((type, idx) => (
                <span
                  key={idx}
                  className="text-sm bg-[#F5F5F5] px-2 py-1 rounded-full text-black px-6"
                  style={{ fontWeight: 400 }}
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
