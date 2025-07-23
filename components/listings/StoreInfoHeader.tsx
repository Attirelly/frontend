import Image from "next/image";
import { StoreInfoType } from "@/types/SellerTypes";
import { manrope } from "@/font";
import { useState } from "react";
import { toast } from "sonner";

const StoreTypeImage = [
  { name: "Designer Label", url: "/ListingPageHeader/designer_labels.svg" },
  { name: "Retail Brands", url: "/ListingPageHeader/retail_stores.svg" },
  { name: "Boutiques", url: "/ListingPageHeader/boutiques.svg" },
];

// ✅ Utility function to format numbers into K / M / B
function formatNumber(num?: number) {
  if (num === undefined || num === null) return "";
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
  const [copied, setCopied] = useState(false);

  const handleLocationRoute = () => {
    console.log(locationUrl);
    window.open(locationUrl, "_blank", "noopener,noreferrer");
  };

  const handlePhoneClick = () => {
    console.log(phone_number);
    window.open(`tel:${phone_number}`, "_blank", "noopener,noreferrer");
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
            src={imageUrl}
            alt={storeName}
            fill
            className="rounded-full object-cover"
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
          className="flex items-center gap-2 mt-6 cursor-pointer"
          onClick={handleLocationRoute}
        >
          <Image
            src="/ListingPageHeader/location_pin_black.svg"
            alt="Location"
            width={16}
            height={16}
          />
          <span
            className={`${manrope.className} text-sm`}
            style={{ fontWeight: 400 }}
          >
            {area}, {city}
          </span>
        </div>
      </div>

      {/* Right: Store Info */}
      <div className={`${manrope.className} flex flex-col`}>
        <div className="flex justify-between items-start flex-wrap">
          <h2
            className="text-xl mb-2 max-w-[60%]"
            style={{ fontWeight: 500 }}
          >
            {storeName}
          </h2>
          <div className="flex gap-2.5 flex-shrink-0">
            <button
              className="flex border rounded-full items-center justify-center px-4"
              onClick={handlePhoneClick}
            >
              <Image
                src="/ListingPageHeader/phone.svg"
                alt="call"
                width={18}
                height={18}
              />
            </button>
            <button
              className="flex border rounded-full items-center justify-center gap-2 px-4"
              onClick={handleCopyUrl}
            >
              <span style={{ fontWeight: 400 }}>Share</span>
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
              {post_count && post_count > 0 ? (
                <div className="flex flex-col gap-1">
                  <h2 style={{ fontWeight: 700 }}>
                    {formatNumber(post_count)}
                  </h2>
                  <span style={{ fontWeight: 400 }}>Posts</span>
                </div>
              ) : (
                <div></div>
              )}

              {instagramFollowers && instagramFollowers > 0 ? (
                <div className="flex flex-col gap-1">
                  <h2 style={{ fontWeight: 700 }}>
                    {formatNumber(instagramFollowers)}
                  </h2>
                  <span style={{ fontWeight: 400 }}>Followers</span>
                </div>
              ) : (
                <div></div>
              )}

              {product_count && product_count > 0 ? (
                <div className="flex flex-col gap-1">
                  <h2 style={{ fontWeight: 700 }}>
                    {formatNumber(product_count)}
                  </h2>
                  <span style={{ fontWeight: 400 }}>Products</span>
                </div>
              ) : (
                <div></div>
              )}
            </div>

            {/* Bio with line breaks */}
            {bio && (
              <p style={{ fontWeight: 400, whiteSpace: "pre-line" }}>{bio}</p>
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
                    {imageObj && (
                      <Image
                        src={imageObj.url}
                        alt="Store Type"
                        width={18}
                        height={18}
                      />
                    )}
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
