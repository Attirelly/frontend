"use client";

import { manrope } from "@/font";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AmbassadorHero() {
  return (
    <div className={`${manrope.className} relative w-full h-[565px]`}>
      <Image
        src="/SellerLanding/hero_bg_gradiant.svg"
        alt="Gray Gradiant"
        fill
        className="object-cover object-top"
      />
      <div className="absolute flex items-center justify-between inset-0">
        <p className="flex flex-col gap-4 ml-[90px]">
          <span className="text-[18px] text-white" style={{ fontWeight: 600 }}>
            ATTIRELLY AMBASSADOR PROGRAM
          </span>
          <div
            className="flex flex-col text-[32px] justify-center"
            style={{ fontWeight: 800 }}
          >
              <span className="text-[#959595]">Become an Attirelly</span>
              <span className="text-white">Ambassador</span>
              <span className="w-[585px] text-white text-[20px] mt-2" style={{fontWeight:400}}>Step into the booming fashion e-commerce industry and unlock your potential with earning potential of more than 25K</span>
          </div>
          <button className="text-[18px] text-white w-fit bg-black rounded px-[28px] py-[10px]">
Start Earning
          </button>
        </p>

        <div>
          <Image src="/CollegeAmbassador/smallest.svg" alt='Stylist shop' width={135} height={135} className="absolute w-[135px] h-[135px] object-cover object-top rounded-full top-[40px] right-[418px]"/>
          
          <Image src="/CollegeAmbassador/largest.svg" alt='Stylist shop' width={440} height={440} className="absolute w-[440px] h-[440px] object-cover object-top rounded-full top-[94px] right-[41px]"/>
<Image src="/CollegeAmbassador/second_largest.svg" alt='Stylist shop' width={168} height={168} className="absolute w-[168px] h-[168px] object-cover object-top rounded-full top-[230px] right-[454px]"/>
        </div>
      </div>
    </div>
  );
}
