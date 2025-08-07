import { manrope } from "@/font";
import Image from "next/image";
export default function DesignerStoreType() {
    return (
        <div className="w-[1280px] h-[340px] bg-[#F7F9FC] rounded-4xl overflow-hidden">
            <div className="flex justify-between">
                <div className={`${manrope.className} flex flex-col py-[94px] pl-[80px]`}>

                    <h2 className="text-[36px] text-[#1B1C57] mb-4" style={{fontWeight:700}}>
                        Attirely For Designers
                    </h2>
                    <div>
                        <ul className="space-y-2 text-[18px] text-[#1B1C57]" style={{fontWeight:400}}>
                            <li className="flex items-center gap-2">
                                <span className="w-[10px] h-[10px] bg-gray-700 rounded-full"></span>
                                <span>Build your label. Get discovered by wedding shoppers & influencers.</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-[10px] h-[10px] bg-gray-700 rounded-full"></span>
                                <span>Launch collections with zero setup. Reach across India.</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-[10px] h-[10px] bg-gray-700 rounded-full"></span>
                                <span>Showcase your Instagram, not just products.</span>
                            </li>
                        </ul>
                    </div>

                </div>

                <Image
                src="/SellerLanding/designer_store_type.svg"
                alt="designer store type"
                width={473}
                height={316}
                className="pb-0"
                />

            </div>





            {/* <div className="flex flex-col md:flex-row items-center px-6 py-8 gap-6">
        <div className="flex flex-col max-w-[647px] px-auto">
          
        </div>

        <div className="flex flex-row gap-4 justify-center items-end">
          <Image
            src="/images/mannequin.png"
            alt="Mannequin"
            width={120}
            height={200}
            className="object-contain"
          />
          <Image
            src="/images/woman.png"
            alt="Woman Designer"
            width={120}
            height={200}
            className="object-contain"
          />
        </div>
      </div> */}
        </div>
    );
}