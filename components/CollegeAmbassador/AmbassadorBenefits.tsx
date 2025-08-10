import { manrope } from "@/font";
import Image from "next/image";
import React from "react";



const AmbassadorBenefits: React.FC = () => {
  return (
    <div className={`${manrope.className} flex flex-col gap-[104px]`}>
      {/* Section 1 */}
      <div className={`${manrope.className} flex flex-col mt-[23px] gap-20`} style={{ fontWeight: 600 }}>
      <div className="flex flex-col items-center" style={{ fontWeight: 400 }}>
        <span className="text-[32px] text-[#1B1C57] mb-4" style={{ fontWeight: 800 }}>Why become Attirelly Ambassador?</span>
        <span className="w-[602px] text-[20px] text-[#1B1C57] text-center">Everything you need about finding the best, safe and affordable storage space near you.</span>
      </div>

      <div className="flex relative justify-center gap-[40px] mx-auto">
        <div className="flex relative flex-col items-center px-8 py-4">
          <Image src="/SellerLanding/bg_blue_lasso.svg" alt="bg blue" width={245} height={247} className="relative"/>
          <Image src="/CollegeAmbassador/money.svg" alt="zero commision" width={147} height={147} className="absolute top-15"/>
          <span className="text-[28px] text-[#1B1C57] mt-5">Earn up to 25,000/Month</span>
          <span className="w-[275px] text-[#374151] text-sm text-center" style={{ fontWeight: 400 }}>
Promote India's fastest-growing hyper local fashion marketplace and earn for every successful referral, event, and content initiative</span>
        </div>
        <div className="flex flex-col items-center px-8 py-4">
          <Image src="/SellerLanding/bg_blue_lasso.svg" alt="bg blue" width={245} height={247} className="relative"/>
          <Image src="/CollegeAmbassador/people_web.svg" alt="zero commision" width={213} height={213} className="absolute"/>
          <span className="text-[28px] text-[#1B1C57] mt-5">Real Industry Exposure</span>
          <span className="w-[275px] text-[#374151] text-sm text-center" style={{ fontWeight: 400 }}>Get hands-on experience in the world of fashion-tech, marketing, and influencer outreach</span>
        </div>
        <div className="flex flex-col items-center px-8 py-4">
          <Image src="/SellerLanding/bg_blue_lasso.svg" alt="bg blue" width={245} height={247} className="relative"/>
          <Image src="/CollegeAmbassador/two_hand.svg" alt="zero commision" width={145} height={145} className="absolute translate-y-1/2"/>
          <span className="text-[28px] text-[#1B1C57] mt-5">Gain practical Experience</span>
          <span className="w-[275px] text-[#374151] text-sm text-center" style={{ fontWeight: 400 }}>Learn how to build and promote your brand through an exciting 0 → 100 journey</span>
        </div>
      </div>

    </div>

    {/* Section 2 */}

    <div className="relative flex w-[1247px] h-[347px] border border-[#D8D8D8] bg-[#F7F9FC] rounded-xl mx-auto overflow-hidden">
            <div className="flex flex-col my-[94px] ml-[40px] w-[647px] h-[189px] gap-4">
              <span
                className="text-[36px] text-[#0B0B0B]"
                style={{ fontWeight: 800 }}
              >
                Why Attirelly
              </span>
              <span
                className="w-[641px] text-[18px] text-[#0B0B0B]"
                style={{ fontWeight: 400 }}
              >
                 Attirelly bridges the gap between 700K+ local boutiques and 500M+ shoppers across India. We curate regional ethnic styles and help fashion lovers discover hidden local gems — all through one powerful hyperlocal fashion platform.
    
              </span>
              {/* <button className="bg-black rounded p-2 text-white w-fit mt-2">
                Start Selling
              </button> */}
            </div>
    
            <div>
              <Image
            src="/CollegeAmbassador/ellipse_white.svg"
            alt="Ellipse White"
            width={570}
            height={570}
            className="absolute right-0 bottom-0"
            />
    
    <Image
            src="/CollegeAmbassador/star3.svg"
            alt="star 3"
            width={45}
            height={45}
            className="absolute bottom-30 right-100"
            />

            <Image
            src="/CollegeAmbassador/star2.svg"
            alt="star 2"
            width={45}
            height={45}
            className="absolute right-8 top-16"
            />

            <Image
            src="/CollegeAmbassador/Attirelly.svg"
            alt="lady white image"
            width={163}
            height={47}
            className="absolute top-6 right-5"
            />
    
            <Image
            src="/CollegeAmbassador/lady_image.svg"
            alt="lady white image"
            width={423}
            height={304}
            className="absolute bottom-0 right-0"
            />
            </div>
    
    
            
    
          </div>

    </div>
    
  );
};

export default AmbassadorBenefits;
