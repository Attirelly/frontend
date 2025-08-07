import { manrope } from "@/font";
import Image from "next/image";
import React from "react";
import StepsCard from "./StepsCard";

const steps = [
  {
    id:1,
    title:"Join Attirely",
    subtitle:"Enter your store details, integrate your instagram and you are good to go",
    image:"/SellerLanding/signup.svg",
  },
  {
    id:2,
    title:"List Products and Catalogues",
    subtitle:"Upload products directly from shopify or manually upload your catalogue",
    image:"/SellerLanding/list_products.svg",
  },
  {
    id:3,
    title:"Get Orders on WhatsApp",
    subtitle:"Get interested leads and potential customers directly from Whatsapp for online + offline sales",
    image:"/SellerLanding/whatsapp.svg",
  },
  {
    id:4,
    title:"Receive payment and ship",
    subtitle:"Receive payments directly from customer(no commission) and ship directly to them to build trust.",
    image:"/SellerLanding/payment.svg",
  },
]

const Benefits: React.FC = () => {
  return (
    <div className="flex flex-col gap-[104px]">
      {/* Section 1 */}
      <div className={`${manrope.className} flex flex-col mt-[23px] gap-40`} style={{ fontWeight: 600 }}>
      <div className="flex flex-col items-center" style={{ fontWeight: 700 }}>
        <span className="text-[32px] text-[#1B1C57] mb-4" style={{ fontWeight: 800 }}>Why Attirelly?</span>
        <span className="text-[20px] text-[#1B1C57]">We are making discovery & shopping of ethnic outfits easy in India</span>
        <span className="text-[20px] text-[#1B1C57]" style={{ fontWeight: 400 }}>Providing daily wear to wedding wear at one place.</span>
      </div>

      <div className="flex relative justify-center gap-[40px] ml-30">
        <div className="flex flex-col items-center px-8 py-4">
          <Image src="/SellerLanding/bg_blue_lasso.svg" alt="bg blue" width={245} height={247} className="relative"/>
          <Image src="/SellerLanding/zero_commision.svg" alt="zero commision" width={309} height={233} className="absolute"/>
          <span className="text-[28px] text-[#1B1C57] mt-5">0% Commision</span>
          <span className="w-[275px] text-[#374151] text-sm text-center" style={{ fontWeight: 400 }}>Sell products online to existing and new customers at 0% commission</span>
        </div>
        <div className="flex flex-col items-center px-8 py-4">
          <Image src="/SellerLanding/bg_blue_lasso.svg" alt="bg blue" width={245} height={247} className="relative"/>
          <Image src="/SellerLanding/grow_brand.svg" alt="zero commision" width={213} height={213} className="absolute"/>
          <span className="text-[28px] text-[#1B1C57] mt-5">Grow Your Brand</span>
          <span className="w-[275px] text-[#374151] text-sm text-center" style={{ fontWeight: 400 }}>We connect regional fashion stores, boutiques and designer with online and offline shoppers</span>
        </div>
        <div className="flex flex-col items-center px-8 py-4">
          <Image src="/SellerLanding/bg_blue_lasso.svg" alt="bg blue" width={245} height={247} className="relative"/>
          <Image src="/SellerLanding/homegrown.svg" alt="zero commision" width={145} height={145} className="absolute translate-y-1/4"/>
          <span className="text-[28px] text-[#1B1C57] mt-5">Homegrown To Well-Known</span>
          <span className="w-[275px] text-[#374151] text-sm text-center" style={{ fontWeight: 400 }}>On an average 71% of the new seller get their first sales within 4 weeks of starting their business</span>
        </div>
      </div>

    </div>

    {/* Section 2 */}

    <div className={`${manrope.className} flex flex-col gap-[64px]`} style={{fontWeight:700}}>
      <div className="flex flex-col items-center" style={{ fontWeight: 700 }}>
        <span className="text-[32px] text-[#1B1C57] mb-4" style={{ fontWeight: 800 }}>We Promise you</span>
        <span className="w-[641px] text-[18px] text-[#1B1C57] text-center" style={{fontWeight:400}}>Whether you run a boutique in Jaipur, a store in Chandni Chowk, or a tailor shop in Surat—Attirelly helps you grow your business online and offline.</span>
      </div>

      <div className="flex justify-center gap-[28px]">
        <div className="flex flex-col items-center px-8 py-4">
          <Image src="/SellerLanding/rupee.svg" alt="zero commision" width={86} height={86}/>
          <span className="text-[24px] text-black mt-[43px]">Earn upto 5 Lakhs in first month</span>
          <span className="w-[351px] text-[#374151] text-base text-center" style={{ fontWeight: 400 }}>Increase your sales upto 5 Lakhs from first month</span>
        </div>
        <div className="flex flex-col items-center px-8 py-4">
          <Image src="/SellerLanding/discovered.svg" alt="zero commision" width={86} height={86}/>
          <span className="text-[24px] text-black mt-[43px]">Get Discovered</span>
          <span className="w-[351px] text-[#374151] text-base text-center" style={{ fontWeight: 400 }}>Shoppers from your region discover your store and catalogue. Run offers, show discounts, and attract more customers easily.
</span>
        </div>
        <div className="flex flex-col items-center px-8 py-4">
          <Image src="/SellerLanding/instagram.svg" alt="zero commision" width={86} height={86}/>
          <span className="text-[24px] text-[#1B1C57] mt-[43px]">More sales from Instagram</span>
          <span className="w-[351px] text-[#374151] text-base text-center" style={{ fontWeight: 400 }}>Reach your customers more efficiently and unlock new growth channels</span>
        </div>
      </div>

    </div>

    {/* Section 3 */}

    <div className={`${manrope.className} flex flex-col gap-[64px] bg-[#F7F9FC] rounded-tl-4xl rounded-tr-4xl`} style={{fontWeight:700}}>
      <div className="flex flex-col items-center mt-16" style={{ fontWeight: 700 }}>
        <span className="text-[32px] text-[#1B1C57] mb-4" style={{ fontWeight: 800 }}>How it works</span>
        <span className="w-[641px] text-[18px] text-[#1B1C57] text-center" style={{fontWeight:400}}>Whether you run a boutique in Jaipur, a store in Chandni Chowk, or a tailor shop in Surat—Attirelly helps you grow your business online and offline.</span>
      </div>

      <div className="flex justify-center gap-[28px] mb-10">
        {steps.map((item) => (
<StepsCard key={item.id} id={item.id} title={item.title} subtitle={item.subtitle} image={item.image}/>
        ))}
      </div>

    </div>
    
    </div>
    
  );
};

export default Benefits;
