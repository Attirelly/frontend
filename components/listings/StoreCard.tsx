'use client';

import Image from 'next/image';
import type { StoreCardType } from '@/types/SellerTypes';

type StoreCardProps = {
    imageUrl: string;
    storeName: string;
    location: string;
    storeTypes: string[];
    priceRanges: string[];
    bestSelling?: string[] | []
    discount?: number;
    instagramFollowers?: string;
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
}: StoreCardProps) {
    return (
        <div className="relative border border-gray-200 rounded p-4 flex gap-4 bg-white hover:[box-shadow:0px_4px_20px_rgba(0,0,0,0.15)] transition-all">
            {/* Store Image */}
            <div className="relative w-60 h-60 overflow-hidden flex-shrink-0">
                <Image
                    src={imageUrl}
                    alt={storeName}
                    fill
                    className="object-cover rounded"
                    sizes="(max-width: 640px) 100vw, 
                            (max-width: 1024px) 50vw, 
                             33vw"
                />
                {/* absolute bottom-0 left-0 mb-4 w-fit h-7 flex items-center pl-2 pr-4 rounded-r-full bg-blue-600 relative overflow-hidden text-white text-xs font-medium */}
                {discount && (
                    <div className="absolute bottom-0 left-0 mb-4 w-fit h-7 flex items-center pl-2 pr-10 overflow-hidden bg-[linear-gradient(to_right,_#2563eb_60%,_transparent)]  text-white text-xs font-medium">
                        <Image
                            src="/ListingPageHeader/discount.svg"
                            alt="Discount"
                            width={15}
                            height={15}
                            className="mr-2"
                        />
                        Flat {discount}% OFF
                        {/* <div className="absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-red to-red pointer-events-none" /> */}
                    </div>
                )}
            </div>

            {/* Store Info */}
            <div className="flex flex-col justify-between w-full">
                <div>
                    <div className='flex justify-between items-start'>
                        <h3 className="text-2xl text-black">{storeName}</h3>
                        {/* Instagram Followers */}
                        {instagramFollowers && (
                            <div className="flex items-center gap-1 mt-2 text-sm">
                                <Image
                                    src='/OnboardingSections/instagram.svg'
                                    alt='Instagram'
                                    width={20}
                                    height={20}
                                />
                                <span className='font-bold'>{instagramFollowers} </span>
                                Followers
                            </div>
                        )}
                    </div>

                    <p className="text-xs text-gray-500">{location}</p>

                    <div className="flex flex-wrap mt-2 gap-2">
                        {storeTypes.map((type, idx) => (
                            <span
                                key={idx}
                                className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600"
                            >
                                {type}
                            </span>
                        ))}
                    </div>

                    <div className="flex flex-wrap mt-2 gap-2">
                        {priceRanges?.map((type, idx) => (
                            <span
                                key={idx}
                                className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600"
                            >
                                {type}
                            </span>
                        ))}
                    </div>


                </div>
                {bestSelling.length > 0 && (
                    <div>
                        <div className='border border-t border-gray-300 mb-5' />
                        <p className="text-xs text-gray-500 mb-5">Best Selling</p>
                        {bestSelling?.map((item, index) => (
                            <span key={index} className="mr-4">{item}</span>
                        ))}
                    </div>
                )}



            </div>
        </div>
    );
}
