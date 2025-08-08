import { manrope } from "@/font";
import Image from "next/image";
export default function RetailStoreType() {
    return (
        <div className="w-[1280px] h-[340px] bg-[#F7F9FC] rounded-4xl overflow-hidden">
            <div className="flex justify-between">
                <div className={`${manrope.className} flex flex-col py-[94px] pl-[80px]`}>

                    <h2 className="text-[36px] text-[#1B1C57] mb-4" style={{fontWeight:700}}>
                        Attirely For Retail Stores
                    </h2>
                    <div>
                        <ul className="space-y-2 text-[18px] text-[#1B1C57]" style={{fontWeight:400}}>
                            <li className="flex items-center gap-2">
                                <span className="w-[10px] h-[10px] bg-gray-700 rounded-full"></span>
                                <span>Put your store on the fashion map — online & offline.</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-[10px] h-[10px] bg-gray-700 rounded-full"></span>
                                <span>Get footfall from Google, ONDC & Attirelly discovery.</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-[10px] h-[10px] bg-gray-700 rounded-full"></span>
                                <span>Upload catalog directly from Instagram and Shopify. No tech needed.</span>
                            </li>
                        </ul>
                    </div>

                </div>
                <div className="relative flex">
                    <Image
                src="/SellerLanding/retail_store_type_2.svg"
                alt="retail store type"
                width={351}
                height={234}
                className="absolute bottom-0"
                />

                <Image
                src="/SellerLanding/retail_store_type_1.svg"
                alt="retail store type"
                width={473}
                height={316}
                className=""
                />


                </div>
            </div>
        </div>
    );
}