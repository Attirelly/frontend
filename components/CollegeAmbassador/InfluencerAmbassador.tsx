import { manrope } from "@/font";
import Image from "next/image";
export default function InfluencerAmbassador() {
    return (
        <div className="w-[1280px] h-[340px] bg-[#F7F9FC] rounded-4xl overflow-hidden">
            <div className="flex justify-between">
                <div className={`${manrope.className} flex flex-col py-[94px] pl-[80px]`}>

                    <h2 className="text-[36px] text-[#1B1C57] mb-4" style={{fontWeight:700}}>
                        Ambassador for Influencers
                    </h2>
                    <div>
                        <ul className="space-y-2 text-[18px] text-[#1B1C57]" style={{fontWeight:400}}>
                            <li className="flex items-center gap-2">
                                <span className="w-[10px] h-[10px] bg-gray-700 rounded-full"></span>
                                <span>Build your personal brand both offline and online</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-[10px] h-[10px] bg-gray-700 rounded-full"></span>
                                <span>Get access to followers of top Designer Labels, Fashion Stores and Stylists</span>
                            </li>
                            {/* <li className="flex items-center gap-2">
                                <span className="w-[10px] h-[10px] bg-gray-700 rounded-full"></span>
                                <span>Upload catalog directly from Instagram and Shopify. No tech needed.</span>
                            </li> */}
                        </ul>
                    </div>

                </div>
                {/* Image Section */}
                <div className="relative w-[600px]">
                    {/* Background Camera Image */}
                    <Image
                        src="/CollegeAmbassador/camera.svg"
                        alt="Camera"
                        width={400}
                        height={400}
                        className="absolute bottom-0 right-0  z-0"
                    />
                    {/* Foreground Influencer Image */}
                    <Image
                        src="/CollegeAmbassador/influencer_person.svg"
                        alt="Influencer"
                        width={600}
                        height={600}
                        className="absolute bottom-0 right-0 z-10"
                    />
                </div>

            </div>
        </div>
    );
}