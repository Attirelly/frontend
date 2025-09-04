"use client";

import { manrope } from "@/font";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  screenSize?: string;
};

export default function AmbassadorHero({ screenSize = 'sm' }: Props) {

  return (
    <div className={`${manrope.className} relative w-full h-[751px] lg:h-[565px]`}>
      <Image
        src="/SellerLanding/hero_bg_gradiant.svg"
        alt="Gray Gradiant"
        fill
        className="object-cover object-top"
      />
      <div className="absolute flex flex-col lg:flex-row lg:items-center lg:justify-between inset-0">
        <p className="flex flex-col gap-4 ml-[40px] mt-[55px] md:ml-[60px] md:mt-[30px] lg:ml-[90px] lg:mt-0">
          <span className="text-[18px] text-white" style={{ fontWeight: 600 }}>
            ATTIRELLY AMBASSADOR PROGRAM
          </span>
          <div
            className="flex flex-col text-[18px] md:text-[24px] lg::text-[32px] justify-center"
            style={{ fontWeight: 800 }}
          >
            <span className="text-[#959595]">Become an Attirelly</span>
            <span className="text-white">Ambassador</span>
            <span className={`
            ${screenSize === 'sm' ? 'w-full' : ''}
            ${screenSize === 'md' ? 'w-full' : ''}
            ${screenSize === 'lg' ? 'w-[400px]' : ''}
            ${screenSize === 'xl' ? 'w-[585px]' : ''}
                text-white text-[14px] lg:text-[20px] mt-2`} style={{ fontWeight: 400 }}>Step into the booming fashion e-commerce industry and unlock your potential with earning potential of more than 25,000</span>
          </div>
          <button className="text-[18px] text-white w-fit bg-black rounded px-[28px] py-[10px]">
            Start Earning
          </button>
        </p>

        <div>
          <Image src="/CollegeAmbassador/smallest.svg" alt='Stylist shop' width={135} height={135} className={`absolute w-[102px] h-[102px] md:w-[135px] md:h-[135px] object-cover object-top rounded-full  
                  ${screenSize === 'sm' ? 'top-[310px] left-[30px]' : ''}
                  ${screenSize === 'md' ? 'top-[270px] left-[120px]' : ''}
                  ${screenSize === 'lg' ? 'top-[40px] right-[418px]' : ''} 
                  ${screenSize === 'xl' ? 'top-[40px] right-[418px]' : ''} 
                  `} />

          <Image src="/CollegeAmbassador/largest.svg" alt='Stylist shop' width={440} height={440} className={`absolute w-[320px] h-[320px] md:w-[440px] md:h-[440px] object-cover object-top rounded-full   
                  ${screenSize === 'sm' ? 'bottom-[45px] right-0' : ''}
                  ${screenSize === 'md' ? 'bottom-[40px] right-[80px]' : ''}
                  ${screenSize === 'lg' ? 'top-[94px] right-[41px]' : ''}
                  ${screenSize === 'xl' ? 'top-[94px] right-[41px]' : ''}
                  `} />
          <Image src="/CollegeAmbassador/second_largest.svg" alt='Stylist shop' width={168} height={168} className={`absolute w-[128px] h-[128px] md:w-[168px] md:h-[168px] object-cover object-top rounded-full  
                  ${screenSize === 'sm' ? 'bottom-[148px] -left-5' : ''}
                  ${screenSize === 'md' ? 'bottom-[150px] left-[130px]' : ''}
                  ${screenSize === 'lg' ? 'top-[230px] right-[454px]' : ''}
                  ${screenSize === 'xl' ? 'top-[230px] right-[454px]' : ''}
                  `} />
        </div>
      </div>
    </div>
  );
}
