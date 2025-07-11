import Image from "next/image";
import { StoreInfoType } from "@/types/SellerTypes";
import { manrope, roboto } from "@/font";
import { useState } from "react";
import CustomerSignIn from "../Customer/CustomerSignIn";

const StoreTypeImage = [
    { name: "Designer Labels", url: "/ListingPageHeader/designer_labels.svg" },
    { name: "Retail Stores", url: "/ListingPageHeader/retail_stores.svg" },
    { name: "Boutiques", url: "/ListingPageHeader/boutiques.svg" }

]

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
    area
}: StoreInfoType) {
    console.log(imageUrl);
    const handleLocationRoute = () => {
       console.log(locationUrl);
       window.open(locationUrl, '_blank', 'noopener,noreferrer');
    };
    return (
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 p-6">
            {/* Left: Circular Store Image */}
            <div className="flex justify-center items-center w-76.5 h-63.75 bg-[#F8F8F8] p-4 rounded-2xl">
                <div className="flex flex-col items-center">
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
                    <div className="flex items-center gap-2 mt-6 cursor-pointer"
                    onClick={handleLocationRoute}>
                        <Image
                            src="/ListingPageHeader/location_pin_black.svg"
                            alt="Location"
                            width={16}
                            height={16}
                        />
                        <span className={`${manrope.className} text-sm`}
                            style={{ fontWeight: 400 }}>{area}, {city}</span>
                    </div>
                </div>

            </div>

            {/* Right: Store Info (expand as needed) */}
            <div className={`${roboto.className} flex flex-col`}
            >
                <div className="flex justify-between items-start flex-wrap">
                    <h2 className="text-xl mb-2 max-w-[60%]"
                        style={{ fontWeight: 500 }}>{storeName}</h2>
                    <div className="flex gap-2.5 flex-shrink-0">
                        <button className="flex border rounded-full items-center justify-center px-4">
                            <Image
                                src="/ListingPageHeader/phone.svg"
                                alt="call"
                                width={18}
                                height={18}
                            />
                        </button>
                        <button className="flex border rounded-full items-center justify-center gap-2 px-4">
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
                            {post_count?.length === 0 ? <div></div> : <div className="flex gap-1">
                                <h2 style={{ fontWeight: 700 }}>{post_count}</h2>
                                <span style={{ fontWeight: 400 }}>Posts</span>
                            </div>}
                            {instagramFollowers?.length === 0 ? <div></div> : <div className="flex gap-1">
                                <Image
                                    src='/OnboardingSections/instagram.svg'
                                    alt='Instagram'
                                    width={20}
                                    height={20}
                                />
                                <h2 style={{ fontWeight: 700 }}>{instagramFollowers}</h2>
                                <span style={{ fontWeight: 400 }}>Followers</span>
                            </div>}
                            {product_count?.length === 0 ? <div></div> :<div className="flex gap-1">
                                <h2 style={{ fontWeight: 700 }}>{product_count}</h2>
                                <span style={{ fontWeight: 400 }}>Products</span>
                            </div>}
                        </div>

                        <p style={{ fontWeight: 400 }}>{bio}</p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex flex-wrap mt-2 gap-2">
                            {storeTypes.map((type, idx) => {
                                const imageObj = StoreTypeImage.find(img => img.name === type);
                                return (
                                    <span
                                        key={idx}
                                        className="bg-[#F8F8F8] px-2 py-1 rounded-full text-black flex gap-1"
                                        style={{ fontWeight: 400 }}>
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
                            })
                            }
                        </div>

                        <div className="flex flex-wrap mt-2 gap-2">
                            {priceRanges?.map((type, idx) => (
                                <span
                                    key={idx}
                                    className="text-sm bg-[#F5F5F5] px-2 py-1 rounded-full text-black px-6"
                                    style={{fontWeight:400}}
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
