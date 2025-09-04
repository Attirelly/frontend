import { manrope } from "@/font";
import Image from "next/image";
import React from "react";

type Props = {
  screenSize?: string;
};

const AmbassadorBenefits: React.FC<Props> = ({ screenSize = 'sm' }) => {
  return (
    <div className={`${manrope.className} flex flex-col gap-[104px]`}>
      {/* Section 1 */}
      <div className={`${manrope.className} flex flex-col mt-[23px] gap-[80px]`} style={{ fontWeight: 600 }}>
        <div className="flex flex-col items-center" style={{ fontWeight: 400 }}>
          <span className=" text-[24px] md:text-[32px] text-[#1B1C57] mb-4 text-center" style={{ fontWeight: 800 }}>Why become Attirelly Ambassador?</span>
          <span className=" w-[346px] md:w-[602px] text-[14px] md:text-[20px] text-[#1B1C57] text-center">Everything you need about finding the best, safe and affordable storage space near you.</span>
        </div>

        <div className="flex flex-col lg:flex-row justify-center gap-[40px] mx-auto">
          <div className="flex relative flex-col items-center px-8 py-4">
            {/* <Image src="/SellerLanding/bg_blue_lasso.svg" alt="bg blue" width={245} height={247} className="relative"/> */}
            <Image src="/CollegeAmbassador/money.svg" alt="zero commision" width={screenSize === 'sm' ? 190 : 245} height={screenSize === 'sm' ? 190 : 245} className="" />
            <span className="text-[20px] md:text-[28px] text-[#1B1C57] mt-5 text-center">Earn up to Rs 25,000/Month</span>
            <span className="w-[275px] text-[#374151] text-sm text-center" style={{ fontWeight: 400 }}>
              Promote India's fastest-growing hyper local fashion marketplace and earn for every successful referral, event, and content initiative</span>
          </div>
          <div className="flex flex-col items-center px-8 py-4">
            {/* <Image src="/SellerLanding/bg_blue_lasso.svg" alt="bg blue" width={245} height={247} className="relative"/> */}
            <Image src="/CollegeAmbassador/people_web.svg" alt="zero commision" width={screenSize === 'sm' ? 190 : 245} height={screenSize === 'sm' ? 190 : 245} className="" />
            <span className="text-[20px] md:text-[28px] text-[#1B1C57] mt-5 text-center">Real Industry Exposure</span>
            <span className="w-[275px] text-[#374151] text-sm text-center" style={{ fontWeight: 400 }}>Get hands-on experience in the world of fashion-tech, marketing, and influencer outreach</span>
          </div>
          <div className="flex flex-col items-center px-8 py-4">
            {/* <Image src="/SellerLanding/bg_blue_lasso.svg" alt="bg blue" width={245} height={247} className="relative"/> */}
            <Image src="/CollegeAmbassador/two_hand.svg" alt="zero commision" width={screenSize === 'sm' ? 190 : 260} height={screenSize === 'sm' ? 190 : 245} className="" />
            <span className="text-[20px] md:text-[28px] text-[#1B1C57] mt-5 text-center">Gain practical Experience</span>
            <span className="w-[275px] text-[#374151] text-sm text-center" style={{ fontWeight: 400 }}>Learn how to build and promote your brand through an exciting 0 → 100 journey</span>
          </div>
        </div>

      </div>

      {/* Section 2 */}
      <div className="w-full px-[20px] md:px-[40px]">
        <div className="relative flex flex-col lg:flex-row lg:h-[347px] border border-[#D8D8D8] bg-[#F7F9FC] rounded-xl mx-auto overflow-hidden">
          <div className="flex flex-col items-center lg:my-[94px] lg:ml-[40px] lg:w-[647px] lg:h-[189px] lg:items-start gap-4">
            <span
              className="text-[24px] md:text-[36px] text-[#0B0B0B] text-center lg:text-left"
              style={{ fontWeight: 800 }}
            >
              Why Attirelly
            </span>
            <span
              className={`
                ${screenSize === 'sm' ? 'w-[340px]' : ''}
                ${screenSize === 'md' ? 'w-[500px]' : ''}
                ${screenSize === 'lg' ? 'w-[600px]' : ''}
                ${screenSize === 'xl' ? 'w-[641px]' : ''}
                 text-[14px] md:text-[18px] text-[#0B0B0B] text-center lg:text-left`}
              style={{ fontWeight: 400 }}
            >
              Attirelly bridges the gap between 700K+ local boutiques and 500M+ shoppers across India. We curate regional ethnic styles and help fashion lovers discover hidden local gems — all through one powerful hyperlocal fashion platform.

            </span>
            {/* <button className="bg-black rounded p-2 text-white w-fit mt-2">
                Start Selling
              </button> */}
          </div>

          <div>
            {/* <Image
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
            /> */}

            <Image
              src="/CollegeAmbassador/lady_image.svg"
              alt="lady white image"
              width={630}
              height={630}
              className="lg:absolute bottom-0 right-0 hidden lg:flex"
            />
            <Image
              src="/CollegeAmbassador/lady_image_mobile.svg"
              alt="lady white image"
              width={630}
              height={630}
              className="lg:absolute bottom-0 right-0 lg:hidden"
            />
          </div>
        </div>

      </div>

    </div>

  );
};

export default AmbassadorBenefits;
