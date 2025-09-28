import { manrope } from "@/font";
import Image from "next/image";
import React from "react";

type Props = {
  screenSize?: string;
};

const AmbassadorBenefits: React.FC<Props> = ({ screenSize = 'sm' }) => {
  return (
    <div className={`${manrope.className} flex flex-col gap-16 md:gap-20 lg:gap-[104px]`}>
      {/* Section 1 - Benefits Cards */}
      <div className={`${manrope.className} flex flex-col mt-6 md:mt-8 lg:mt-[23px] gap-12 md:gap-16 lg:gap-[80px]`}>
        {/* Header */}
        <div className="flex flex-col items-center px-4 sm:px-6 md:px-8">
          <h2 className="text-[24px] md:text-[28px] lg:text-[32px] text-[#1B1C57] mb-4 text-center leading-tight" style={{ fontWeight: 800 }}>
            Why become Attirelly Ambassador?
          </h2>
          <p className="max-w-[346px] md:max-w-[500px] lg:max-w-[602px] text-[14px] md:text-[16px] lg:text-[20px] text-[#1B1C57] text-center leading-relaxed" style={{ fontWeight: 400 }}>
            Everything you need about finding the best, safe and affordable storage space near you.
          </p>
        </div>

        {/* Benefits Cards */}
        <div className="flex flex-col md:flex-row lg:flex-row justify-center items-center lg:items-stretch gap-10 md:gap-12 lg:gap-40 px-6 sm:px-8 md:px-12 lg:px-20">

          {/* Card 1 */}
          <div className="flex flex-col items-center px-6 py-8 max-w-[320px] lg:max-w-[275px]">
            <Image
              src="/CollegeAmbassador/money.svg"
              alt="zero commision"
              width={245}
              height={245}
              className="w-2/5 h-auto max-w-[190px] md:w-3/5 md:max-w-[220px] lg:w-[245px] lg:h-[245px] object-contain transition-transform duration-300 ease-in-out hover:scale-105"
            />
            <h3 className="text-[18px] md:text-[22px] lg:text-[28px] text-[#1B1C57] mt-5 mb-3 text-center font-semibold">
              Earn up to Rs 25,000/Month
            </h3>
            <p className="text-[#374151] text-sm md:text-base text-center leading-relaxed" style={{ fontWeight: 400 }}>
              Promote India's fastest-growing hyper local fashion marketplace and earn for every successful referral, event, and content initiative
            </p>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col items-center px-6 py-8 max-w-[320px] lg:max-w-[275px]">
            <Image
              src="/CollegeAmbassador/people_web.svg"
              alt="zero commision"
              width={245}
              height={245}
              className="w-2/5 h-auto max-w-[190px] md:w-3/5 md:max-w-[220px] lg:w-[245px] lg:h-[245px] object-contain transition-transform duration-300 ease-in-out hover:scale-105"
            />
            <h3 className="text-[18px] md:text-[22px] lg:text-[28px] text-[#1B1C57] mt-5 mb-3 text-center font-semibold">
              Real Industry Exposure
            </h3>
            <p className="text-[#374151] text-sm md:text-base text-center leading-relaxed" style={{ fontWeight: 400 }}>
              Get hands-on experience in the world of fashion-tech, marketing, and influencer outreach
            </p>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col items-center px-6 py-8 max-w-[320px] lg:max-w-[275px]">
            <Image
              src="/CollegeAmbassador/two_hand.svg"
              alt="zero commision"
              width={260}
              height={245}
              className="w-2/5 h-auto max-w-[190px] md:w-3/5 md:max-w-[220px] lg:w-[260px] lg:h-[245px] object-contain transition-transform duration-300 ease-in-out hover:scale-105"
            />
            <h3 className="text-[18px] md:text-[22px] lg:text-[28px] text-[#1B1C57] mt-5 mb-3 text-center font-semibold">
              Gain practical Experience
            </h3>
            <p className="text-[#374151] text-sm md:text-base text-center leading-relaxed" style={{ fontWeight: 400 }}>
              Learn how to build and promote your brand through an exciting 0 → 100 journey
            </p>
          </div>
        </div>
      </div>

      {/* Section 2 - Why Attirelly */}
      <div className="md:px-8 lg:px-0">
        <div className="w-full max-w-[90vw] lg:max-w-[90vw] mx-auto mt-10 overflow-hidden bg-[#F7F9FC] rounded-4xl">
          <div className="flex flex-col lg:flex-row lg:items-stretch lg:justify-between h-full">
            {/* Content Section */}
            <div className="text-center lg:text-left flex flex-col items-center lg:items-start py-8 px-6 lg:py-12 lg:px-8 xl:py-[60px] xl:pl-[50px] xl:pr-4 flex-1">
              <h2
                className="text-[24px] md:text-[28px] lg:text-[36px] text-[#0B0B0B] leading-tight"
                style={{ fontWeight: 800 }}
              >
                Why Attirelly
              </h2>
              <p
                className="text-[14px] md:text-[16px] lg:text-[18px] text-[#0B0B0B] max-w-[500px] lg:max-w-[641px] leading-relaxed mt-4"
                style={{ fontWeight: 400 }}
              >
                Attirelly bridges the gap between 700K+ local boutiques and 500M+ shoppers across India. We curate regional ethnic styles and help fashion lovers discover hidden local gems — all through one powerful hyperlocal fashion platform.
              </p>
            </div>

            {/* Image Section */}
            <div className="lg:flex lg:justify-end lg:flex-shrink-0 h-full">
              {/* --- Desktop Image --- */}
              <Image
                src="/CollegeAmbassador/lady_image.svg"
                alt="lady white image"
                width={630}
                height={630}
                className="hidden lg:block h-full w-auto object-contain"
              />
              {/* --- Mobile/Medium Image --- */}
              <Image
                src="/CollegeAmbassador/lady_image_mobile.svg"
                alt="lady white image"
                width={630}
                height={630}
                className="w-full h-auto lg:hidden"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmbassadorBenefits;
