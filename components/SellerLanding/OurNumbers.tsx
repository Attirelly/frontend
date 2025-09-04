"use client";
import { manrope, rosario } from "@/font";
import OurNumbersCard from "./OurNumbersCard";
import Image from "next/image";
import StoreTypeTabs from "../listings/StoreTypes";
import { useHeaderStore } from "@/store/listing_header_store";
import DesignerStoreType from "./DesignerStoreType";
import RetailStoreType from "./RetailStoreType";
import TailorStoreType from "./TailorStoreType";
import StylistStoreType from "./StylistStoreType";
import Link from "next/link";

const numbers = [
  {
    id: 1,
    title: "500M+",
    subtitle: "Potential shoppers in India",
    image: "/SellerLanding/potential_shopper.svg",
  },
  {
    id: 2,
    title: "600+",
    subtitle: "Ethnic fashion stores already onboarded",
    image: "/SellerLanding/ethnic_stores.svg",
  },
  {
    id: 3,
    title: "7+",
    subtitle: "Live in 7+ cities including NCR and Tricity",
    image: "/SellerLanding/live_cities.svg",
  },
  {
    id: 4,
    title: "Upto 15%",
    subtitle: "M-o-M revenue growth expected",
    image: "/SellerLanding/revenue_growth.svg",
  },
];

type Props = {
  screenSize?: string;
};

export default function OurNumbers({ screenSize = 'sm' }: Props) {
  const { storeType } = useHeaderStore();
  return (
    <div
      className={`${manrope.className} flex flex-col items-center gap-30 pt-30`}
    >
      {/* Section 1 */}
      <div className="flex flex-col items-center gap-20">
        <span
          className=" text-[24px] md:text-[32px] text-[#1B1C57]"
          style={{ fontWeight: 800 }}
        >
          Our Numbers
        </span>
        <div className="flex flex-col gap-30 lg:flex-row lg:gap-10">
          {numbers.map((item) => (
            <div className={`${screenSize !== 'xl' ? 'w-[250px]' : ''}`}>
              <OurNumbersCard
                key={item.id}
                id={item.id}
                title={item.title}
                subtitle={item.subtitle}
                image={item.image}
              />
            </div>

          ))}
        </div>
      </div>

      {/* Section 2 */}
      <div className={`w-fit px-8 
          ${screenSize === 'lg' ? 'px-[40px]' : ''}
          ${screenSize === 'xl' ? 'px-[80px]' : ''}`}>

        <div className={`flex flex-col lg:flex-row
          bg-[#F7F9FC] rounded-xl`}>
          <div className={`flex flex-col lg:my-[94px] ml-[40px] w-[332px] md:w-[647px] h-[233px] gap-4 items-center lg:items-start
          ${screenSize !== 'xl' && screenSize !== 'lg' ? 'text-center' : ''}`}>
            <span
              className="text-[24px] lg:text-[36px] text-[#1B1C57]"
              style={{ fontWeight: 700 }}
            >
              Get Maximum ROI On Your <br className="hidden lg:block" /> Instagram
            </span>
            <span
              className="text-[14px] md:text-[18px] text-[#1B1C57]"
              style={{ fontWeight: 400 }}
            >
              Integrate your Instagram, Shopify, Pinterest board, Facebook to
              Attirelly and manage everything at once click
            </span>
            <Link href="/seller_signup" className="bg-black rounded p-2 text-white w-fit mt-2 cursor-pointer">
              Start Selling
            </Link>
          </div>
          <div className="relative flex justify-center">
            {/* <span className={`${rosario.className} absolute top-[44%] right-[23%] z-10 text-[29px] text-black`} style={{ fontWeight: 600 }}>Attirelly</span> */}
            <Image
              src="/SellerLanding/spider_web_2.svg"
              alt="spider web"
              width={570}
              height={400}
              // className="hidden lg:flex" 
              />
            {/* <Image
              src="/SellerLanding/spider_web.svg"
              alt="spider web"
              width={570}
              height={400}
              className="flex lg:hidden" /> */}
          </div>
        </div>

      </div>


      {/* Section 3 */}
      <div className="flex flex-col items-center gap-4 px-2">
        <span className="text-[24px] md:text-[32px] text-[#1B1C57]" style={{ fontWeight: 700 }}>Who can join?</span>
        <span className="text-[14px] md:text-[18px] text-[#1B1C57] mb-8 text-center px-5" style={{ fontWeight: 400 }}>if you sell ethnic wear, ranging from affordable to luxury wear, Attirelly is for you. We work with:</span>
        {/* <StoreTypeTabs defaultValue={process.env.NEXT_PUBLIC_RETAIL_STORE_TYPE || ''}/> */}
        <StoreTypeTabs context="user" defaultValue="f923d739-4c06-4472-9bfd-bb848b32594b"/>
        {storeType?.store_type === 'Designer Label'
          ? <DesignerStoreType screenSize={screenSize}/> :
          storeType?.store_type === 'Retail Store'
            ? <RetailStoreType screenSize={screenSize}/> :
            storeType?.store_type === 'Tailor'
              ? <TailorStoreType screenSize={screenSize} /> :
              storeType?.store_type === 'Stylist'
                ? <StylistStoreType screenSize={screenSize} /> : <div></div>}
      </div>

      {/* Section 4 */}
      <div className={`w-full flex flex-col ${screenSize === 'sm' || screenSize === 'md' ? 'items-center gap-4' : ''}  lg:h-[792px] lg:grid lg:grid-cols-[1fr_2fr] bg-[#F7F9FC]`}>
        <span className="text-[24px] md:text-[32px] text-[#1B1C57] lg:w-[326px] lg:h-[88px] lg:pl-[40px] mt-10" style={{ fontWeight: 800 }}>What do you miss out on</span>
        <div className={`flex flex-col gap-4 ${screenSize === 'sm' || screenSize === 'md' ? 'items-center' : ''}  lg:relative`}>
          <div className={`lg:absolute lg:top-0 lg:-translate-y-1/8 shadow flex flex-col text-center
          ${screenSize === 'sm' ? 'w-[300px] py-3' : ''}
          ${screenSize === 'md' ? 'w-[440px] h-[300px]' : ''}
          ${screenSize === 'lg' ? 'w-[390px] h-[300px]' : ''}
          ${screenSize === 'xl' ? 'w-[440px] h-[300px]' : ''}
           justify-center px-[36px] bg-white rounded-2xl`}>
            <span className="text-[24px] md:text-[32px] text-[#1B1C57]" style={{ fontWeight: 800 }}>Standout from the crowd</span>
            <span className="text-[14px] md:text-base text-[#1B1C57]" style={{ fontWeight: 500 }}>Standout from 1000+ competitors who are more focused on traditional methods to gain customers with higher costs and lesser conversions </span>
          </div>

          <div className={`lg:absolute lg:top-0 lg:right-10 lg:translate-y-1/4 shadow flex flex-col text-center
             ${screenSize === 'sm' ? 'w-[300px] py-3' : ''}
            ${screenSize === 'md' ? 'w-[440px] h-[300px]' : ''}
            ${screenSize === 'lg' ? 'w-[390px] h-[300px]' : ''}
            ${screenSize === 'xl' ? 'w-[440px] h-[300px]' : ''}
             justify-center px-[36px] bg-white rounded-2xl`}>
            <span className="text-[24px] md:text-[32px] text-[#1B1C57]" style={{ fontWeight: 800 }}>Easy discovery by the customers</span>
            <span className="text-[14px] md:text-base text-[#1B1C57]" style={{ fontWeight: 500 }}>We showcase your brand where your ideal customers are. No more scrolling across 100 Instagram reels to find the correct outfit.  </span>
          </div>

          <div className={`lg:absolute lg:bottom-0 lg:-translate-y-1/2 shadow flex flex-col text-center
             ${screenSize === 'sm' ? 'w-[300px] py-3' : ''}
            ${screenSize === 'md' ? 'w-[440px] h-[300px]' : ''}
            ${screenSize === 'lg' ? 'w-[390px] h-[300px]' : ''}
            ${screenSize === 'xl' ? 'w-[440px] h-[300px]' : ''}
             justify-center px-[36px] bg-white rounded-2xl`}>
            <span className="text-[24px] md:text-[32px] text-[#1B1C57]" style={{ fontWeight: 800 }}>Reaching out to your Target audience</span>
            <span className="text-[14px] md:text-base text-[#1B1C57]" style={{ fontWeight: 500 }}>Attirelly provides an effeicient way to reach out to your target audience. Be it bride to be, or GenZs, Users across various age groups and demographics shop on Attirelly.</span>
          </div>

          <div className={`lg:absolute lg:bottom-0 lg:right-10 lg:-translate-y-1/8 shadow flex flex-col text-center
             ${screenSize === 'sm' ? 'w-[300px] py-3' : ''}
            ${screenSize === 'md' ? 'w-[440px] h-[300px]' : ''}
            ${screenSize === 'lg' ? 'w-[390px] h-[300px]' : ''}
            ${screenSize === 'xl' ? 'w-[440px] h-[300px]' : ''} 
             justify-center px-[36px] bg-white rounded-2xl`}>
            <span className="text-[24px] md:text-[32px] text-[#1B1C57]" style={{ fontWeight: 800 }}>Expanding your business this wedding</span>
            <span className="text-[14px] md:text-base text-[#1B1C57]" style={{ fontWeight: 500 }}>Capture new customers and reach new shoppers this wedding season, witnessing revenue growth never heard before.</span>
          </div>
        </div>
      </div>

      {/* Section 5 */}
      <div className="px-4">

        <div className={`flex w-full flex-col ${screenSize === 'sm' || screenSize === 'md' ? 'items-center' : ''} lg:flex-row lg:w-[1247px] lg:h-[347px] bg-[#F7F9FC] rounded-xl`}>
        <div className={`flex flex-col ${screenSize === 'sm' || screenSize === 'md' ? 'items-center text-center' : ''}  md:my-[94px] md:ml-[40px] md:w-[647px] md:h-[189px] gap-4`}>
          <span
            className="text-[24px] md:text-[36px] text-[#1B1C57]"
            style={{ fontWeight: 700 }}
          >
            0% Commission rate
          </span>
          <span
            className="text-[14px] md:text-[18px] text-[#1B1C57]"
            style={{ fontWeight: 400 }}
          >
            Attirelly charges 0% commission rate across all product sales, allowing sellers to retain their full earnings on every sale

          </span>
          <Link href="/seller_signup" className="bg-black rounded p-2 text-white w-fit mt-2 cursor-pointer">
            Start Selling
          </Link>
        </div>

        <div className="flex justify-end">
          <Image
            src="/SellerLanding/thumbs_up_man.svg"
            alt="thumbs up"
            width={640}
            height={304}
            className="rounded-xl hidden lg:block"
          />

          <Image
            src="/SellerLanding/thumbs_up_man_2.svg"
            alt="thumbs up"
            width={400}
            height={304}
            className="rounded-xl lg:hidden"
          />          
        </div>
      </div>
      </div>
    </div>
  );
}
