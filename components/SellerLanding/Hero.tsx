"use client";

import { manrope } from "@/font";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Hero() {
  return (
    <div className={`${manrope.className} relative w-full h-[565px]`}>
      <Image
        src="/SellerLanding/hero_bg_gradiant.svg"
        alt="Gray Gradiant"
        fill
        className="object-cover"
      />
      <div className="absolute flex items-center justify-between inset-0">
        <p className="flex flex-col gap-4 ml-[90px]">
          <span className="text-[18px] text-white" style={{ fontWeight: 600 }}>
            SELL EVERYWHERE
          </span>
          <div
            className="flex flex-col text-[32px] justify-center"
            style={{ fontWeight: 800 }}
          >
            <div className="flex gap-2">
              <span className="text-[#959595]">Find new customers,</span>
              <span className="text-white">sell your products</span>
            </div>
            <div className="flex gap-2">
              <span className="text-white">online & offline</span>
              <span className="text-[#959595]">through Attirelly</span>
            </div>
          </div>
          <button className="text-[18px] text-white w-fit bg-black rounded px-[28px] py-[10px]">
Get Free Credits
          </button>
        </p>

        <div>
          <Image src="/SellerLanding/smallest.png" alt='Stylist shop' width={135} height={135} className="absolute w-[135px] h-[135px] object-cover rounded-full border border-white border-[5px] top-[40px] right-[418px]"/>
          
          <Image src="/SellerLanding/largest.png" alt='Stylist shop' width={440} height={440} className="absolute w-[440px] h-[440px] object-cover rounded-full border border-white border-[5px] top-[94px] right-[41px]"/>
<Image src="/SellerLanding/second_largest.png" alt='Stylist shop' width={168} height={168} className="absolute w-[168px] h-[168px] object-cover rounded-full border border-white border-[5px] top-[230px] right-[454px]"/>
        </div>
      </div>
    </div>
  );
}
