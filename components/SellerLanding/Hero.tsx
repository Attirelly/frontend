"use client";

import { manrope } from "@/font";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  screenSize?: string;
};

export default function Hero({ screenSize= 'sm' }: Props) {

  return (
    <div className={`${manrope.className} relative w-full h-[751px] lg:h-[565px]`}>
      <Image
        src="/SellerLanding/hero_bg_gradiant.svg"
        alt="Gray Gradiant"
        fill
        className="object-cover object-top"
      />
      <div className="absolute flex flex-col lg:flex-row lg:items-center lg:justify-between inset-0">
        <p className="flex flex-col gap-4 ml-[40px] mt-[55px] md:ml-[60px] lg:ml-[90px] lg:mt-0">
          <span className="text-[18px] text-white" style={{ fontWeight: 600 }}>
            SELL EVERYWHERE
          </span>
          <div
            className={`flex flex-col 
              ${screenSize === 'sm' ? 'text-[18px]' : ''}
              ${screenSize === 'md' ? 'text-[32px]' : ''}
              ${screenSize === 'lg' ? 'text-[28px]' : ''}
              ${screenSize === 'xl' ? 'text-[32px]' : ''}
              justify-center`}
            style={{ fontWeight: 800 }}
          >
            <div className="flex flex-col md:flex-row md:gap-2">
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
          <Image src="/SellerLanding/smallest.png" alt='Stylist shop' width={135} height={135} className={`absolute w-[102px] h-[102px] md:w-[135px] md:h-[135px] object-cover object-top rounded-full  border-white border-[5px]
          ${screenSize === 'sm' ? 'top-[310px] left-[30px]' : ''}
          ${screenSize === 'md' ? 'top-[270px] left-[120px]' : ''}
          ${screenSize === 'lg' ? 'top-[40px] right-[418px]' : ''} 
          ${screenSize === 'xl' ? 'top-[40px] right-[418px]' : ''} 
          `}/>

          <Image src="/SellerLanding/largest.png" alt='Stylist shop' width={440} height={440} className={`absolute w-[320px] h-[320px] md:w-[440px] md:h-[440px] object-cover object-top rounded-full  border-white border-[5px] 
          ${screenSize === 'sm' ? 'bottom-[45px] right-0' : ''}
          ${screenSize === 'md' ? 'bottom-[40px] right-[80px]' : ''}
          ${screenSize === 'lg' ? 'top-[94px] right-[41px]' : ''}
          ${screenSize === 'xl' ? 'top-[94px] right-[41px]' : ''}
          `}/>
          <Image src="/SellerLanding/second_largest.png" alt='Stylist shop' width={168} height={168} className={`absolute w-[128px] h-[128px] md:w-[168px] md:h-[168px] object-cover object-top rounded-full border-white border-[5px] 
          ${screenSize === 'sm' ? 'bottom-[148px] -left-5' : ''}
          ${screenSize === 'md' ? 'bottom-[150px] left-[130px]' : ''}
          ${screenSize === 'lg' ? 'top-[230px] right-[454px]' : ''}
          ${screenSize === 'xl' ? 'top-[230px] right-[454px]' : ''}
          `}/>
        </div>
      </div>
    </div>
  );
}
