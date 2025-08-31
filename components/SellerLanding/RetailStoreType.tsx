import { manrope } from "@/font";
import Image from "next/image";
type Props = {
    screenSize: string;
};
export default function RetailStoreType({ screenSize }: Props) {
    return (
        <div className="w-full bg-[#F7F9FC] rounded-4xl overflow-hidden">
            <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
                <div className={`${manrope.className} flex flex-col py-2 lg:py-[94px] items-center lg:items-start lg:pl-[80px]`}>

                    <h2 className="text-[24px] lg:text-[36px] text-[#1B1C57] mb-4" style={{fontWeight:700}}>
                        Attirely For Retail Stores
                    </h2>
                    <div>
                        <ul className="space-y-2 text-[14px] lg:text-[18px] w-[320px] lg:w-full text-[#1B1C57]" style={{fontWeight:400}}>
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
                <div className="flex items-end justify-center">
                    <Image
                src="/SellerLanding/retail_store_type.svg"
                alt="retail store type"
                width={screenSize === 'lg' || screenSize === 'xl' ? 560 : 328}
                height={screenSize === 'lg' || screenSize === 'xl' ? 411 : 218}
                className=""
                />

                {/* <Image
                src="/SellerLanding/retail_store_type_1.svg"
                alt="retail store type"
                width={473}
                height={316}
                className=""
                /> */}


                </div>
            </div>
        </div>
    );
}