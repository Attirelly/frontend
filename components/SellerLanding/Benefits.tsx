import { manrope } from "@/font";
import Image from "next/image";
import React from "react";
import StepsCard from "./StepsCard";

type Props = {
  screenSize?: string;
};

const Benefits: React.FC<Props> = ({ screenSize = 'sm' }) => {
  return (
    <div className="flex flex-col gap-[104px]">
      {/* Section 1 */}
      <div className={`${manrope.className} flex flex-col mt-[23px] gap-[80px]`} style={{ fontWeight: 600 }}>
      <div className="flex flex-col items-center" style={{ fontWeight: 700 }}>
        <span className=" text-[24px] lg:text-[32px] text-[#1B1C57] mb-4" style={{ fontWeight: 800 }}>Why Attirelly?</span>
        <span className="text-[14px] md:text-[20px] text-[#1B1C57]">{screenSize === 'sm' ? `India's 1st ethnic wear fashion platform providing daily` : 'We are making discovery & shopping of ethnic outfits easy in India'}</span>
        <span className=" text-[14px] md:text-[20px] text-[#1B1C57]" style={{ fontWeight: 400 }}>{screenSize === 'sm' ? `wear to wedding wear at one place.` : `Providing daily wear to wedding wear at one place.`}</span>
      </div>

      <div className="flex flex-col lg:flex-row justify-center gap-[40px] mx-auto">
        <div className="flex flex-col items-center px-8 py-4">
          {/* <Image src="/SellerLanding/bg_blue_lasso.svg" alt="bg blue" width={245} height={247} className="relative"/> */}
          <Image src="/SellerLanding/zero_commision.svg" alt="zero commision" width={screenSize === 'sm' ? 220 : 320} height={screenSize === 'sm' ? 180 : 247} className=""/>
          <span className="text-[20px] md:text-[28px] text-[#1B1C57] mt-5">0% Commision</span>
          <span className="w-[204px] md:w-[275px] text-[#374151] text-sm text-center" style={{ fontWeight: 400 }}>Sell products online to existing and new customers at 0% commission</span>
        </div>
        <div className="flex flex-col items-center px-8 py-4">
          {/* <Image src="/SellerLanding/bg_blue_lasso.svg" alt="bg blue" width={245} height={247} className="relative"/> */}
          <Image src="/SellerLanding/grow_brand.svg" alt="zero commision" width={screenSize === 'sm' ? 180 : 245} height={screenSize === 'sm' ? 180 : 245} className=""/>
          <span className="text-[20px] md:text-[28px] text-[#1B1C57] mt-5">Grow Your Brand</span>
          <span className="w-[204px] md:w-[275px] text-[#374151] text-sm text-center" style={{ fontWeight: 400 }}>We connect regional fashion stores, boutiques and designer with online and offline shoppers</span>
        </div>
        <div className="flex flex-col items-center px-8 py-4">
          {/* <Image src="/SellerLanding/bg_blue_lasso.svg" alt="bg blue" width={245} height={247} className="relative"/> */}
          <Image src="/SellerLanding/homegrown.svg" alt="zero commision" width={screenSize === 'sm' ? 180 : 245} height={screenSize === 'sm' ? 180 : 245} className=""/>
          <span className="text-[20px] md:text-[28px] text-[#1B1C57] mt-5">Homegrown To Well-Known</span>
          <span className="w-[204px] md:w-[275px] text-[#374151] text-sm text-center" style={{ fontWeight: 400 }}>On an average 71% of the new seller get their first sales within 4 weeks of starting their business</span>
        </div>
      </div>

    </div>

    {/* Section 2 */}

    <div className={`${manrope.className} flex flex-col gap-[64px]`} style={{fontWeight:700}}>
      <div className="flex flex-col items-center" style={{ fontWeight: 700 }}>
        <span className="text-[24px] md:text-[32px] text-[#1B1C57] mb-4" style={{ fontWeight: 800 }}>We Promise you</span>
        <span className="w-[350px] md:w-[641px] text-[14px] md:text-[18px] text-[#1B1C57] text-center" style={{fontWeight:400}}>Whether you run a boutique in Jaipur, a store in Chandni Chowk, or a tailor shop in Surat—Attirelly helps you grow your business online and offline.</span>
      </div>

      <div className="flex flex-col lg:flex-row justify-center gap-[28px]">
        <div className={`flex flex-col items-center px-8 py-4`}>
          <Image src="/SellerLanding/rupee.svg" alt="zero commision" width={86} height={86}/>
          <span className="text-[20px] md:text-[24px] text-black mt-[43px]">Earn upto 5 Lakhs in first month</span>
          <span className="w-[351px] text-[#374151] text-base text-center" style={{ fontWeight: 400 }}>Increase your sales upto 5 Lakhs from first month</span>
        </div>
        <div className="flex flex-col items-center px-8 py-4">
          <Image src="/SellerLanding/discovered.svg" alt="zero commision" width={86} height={86}/>
          <span className="text-[20px] md:text-[24px] text-black mt-[43px]">Get Discovered</span>
          <span className="w-[351px] text-[#374151] text-base text-center" style={{ fontWeight: 400 }}>Shoppers from your region discover your store and catalogue. Run offers, show discounts, and attract more customers easily.</span>

        </div>
        <div className="flex flex-col items-center px-8 py-4">
          <Image src="/SellerLanding/instagram.svg" alt="zero commision" width={86} height={86}/>
          <span className="text-[20px] md:text-[24px] text-[#1B1C57] mt-[43px]">More sales from Instagram</span>
          <span className="w-[351px] text-[#374151] text-base text-center" style={{ fontWeight: 400 }}>Reach your customers more efficiently and unlock new growth channels</span>
        </div>
      </div>

    </div>

    <div className={`${manrope.className} flex flex-col gap-[64px]`} style={{fontWeight:700}}>
      <div className="flex flex-col items-center" style={{ fontWeight: 700 }}>
        <span className="text-[24px] md:text-[32px] text-[#1B1C57] mb-4" style={{ fontWeight: 800 }}>Instagram Insights For Every Creator</span>
        <span className="w-[350px] md:w-[641px] text-[14px] md:text-[18px] text-[#1B1C57] text-center" style={{fontWeight:400}}>Brands will be able to see Instagram Insights of the creators</span>
      </div>

      <div className="flex flex-col lg:flex-row justify-center gap-[0px]">
        <div className={`flex flex-col justify-center items-center px-8 py-4`}>
          <Image src="/SellerLanding/rupee.svg" alt="zero commision" width={86} height={86}/>
          <span className="text-[20px] w-[400px] text-center item-center md:text-[24px] text-black mt-[43px] md:min-h-[64px]">Check audience credebility, demographics & engagement instantly</span>
          <span className="w-[351px] text-[#374151] text-base text-center" style={{ fontWeight: 400 }}>Insights that matter instantly match with influencers whose folloers mirror your customer base - ethinic, fusion, bridal, premium or everyday fashion.</span>
        </div>
        <div className="flex flex-col items-center px-8 py-4">
          <Image src="/SellerLanding/discovered.svg" alt="zero commision" width={86} height={86}/>
          <span className="text-[20px] w-[351px] text-center md:text-[24px] text-black mt-[43px] md:min-h-[64px]">Authentic Fashion Content</span>
          <span className="w-[351px] text-[#374151] text-base text-center" style={{ fontWeight: 400 }}>Launch collabs, lookbooks, shoots, & reels that feel stylish - not sponsored. Creators match your vibe, so content feels native to your brand.</span>

        </div>
        <div className="flex flex-col items-center px-8 py-4">
          <Image src="/SellerLanding/instagram.svg" alt="zero commision" width={86} height={86}/>
          <span className="text-[20px] w-[351px] text-center text-black md:text-[24px] text-[#1B1C57] mt-[43px] md:min-h-[64px]">Real Performance You can Track</span>
          <span className="w-[351px] text-[#374151] text-base text-center" style={{ fontWeight: 400 }}>Track reach, engagement, clicks, conversions & campaign insights. Optimize with proof - not assumptions.</span>
        </div>
      </div>

    </div>

    
    </div>
    
  );
};

export default Benefits;
