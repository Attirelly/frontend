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

export default function OurNumbers() {
  const {storeType} = useHeaderStore();
  return (
    <div
      className={`${manrope.className} flex flex-col items-center gap-30 pt-30`}
    >
      {/* Section 1 */}
      <div className="flex flex-col items-center gap-20">
        <span
          className="text-[32px] text-[#1B1C57]"
          style={{ fontWeight: 800 }}
        >
          Our Numbers
        </span>
        <div className="flex gap-10">
          {numbers.map((item) => (
            <OurNumbersCard
              key={item.id}
              id={item.id}
              title={item.title}
              subtitle={item.subtitle}
              image={item.image}
            />
          ))}
        </div>
      </div>

      {/* Section 2 */}
      <div className="relative flex w-[1274px] bg-[#F7F9FC] rounded-xl">
        <div className="flex flex-col my-[94px] ml-[40px] w-[647px] h-[233px] gap-4">
          <span
            className="text-[36px] text-[#1B1C57]"
            style={{ fontWeight: 700 }}
          >
            Get Maximum ROI On Your <br /> Instagram
          </span>
          <span
            className="text-[18px] text-[#1B1C57]"
            style={{ fontWeight: 400 }}
          >
            Integrate your Instagram, Shopify, Pinterest board, Facebook to
            Attirelly and manage everything at once click
          </span>
          <button className="bg-black rounded p-2 text-white w-fit mt-2">
            Start Selling
          </button>
        </div>
        <div className="flex">
          <span className={`${rosario.className} absolute top-[44%] right-[23%] z-10 text-[29px] text-black`} style={{fontWeight:600}}>Attirelly</span>
          <Image
          src="/SellerLanding/spider_web.svg"
          alt="spider web"
          width={650}
          height={400}
          className="absolute right-0 bottom-0"/>
        </div>
      </div>
      
      {/* Section 3 */}
      <div className="flex flex-col items-center gap-4">
        <span className="text-[32px] text-[#1B1C57]" style={{fontWeight:700}}>Who can join?</span>
        <span className="text-[18px] text-[#1B1C57] mb-8" style={{fontWeight:400}}>if you sell ethnic wear, ranging from affordable to luxury wear, Attirelly is for you. We work with:</span>
        {/* <StoreTypeTabs defaultValue={process.env.NEXT_PUBLIC_RETAIL_STORE_TYPE || ''}/> */}
        <StoreTypeTabs/>
        {storeType?.store_type === 'Designer Label' 
        ? <DesignerStoreType/> : 
        storeType?.store_type === 'Retail Store' 
        ? <RetailStoreType/> :
        storeType?.store_type === 'Tailor'
        ? <TailorStoreType/> :
        storeType?.store_type === 'Stylist'
        ? <StylistStoreType/> : <div></div>}
      </div>

      {/* Section 4 */}
      <div className="w-full h-[792px] grid grid-cols-[1fr_2fr] bg-[#F7F9FC]">
      <span className="text-[32px] text-[#1B1C57] w-[326px] h-[88px] pl-[40px] mt-10" style={{fontWeight:800}}>What do you miss out on</span>
      <div className="relative">
         <div className="absolute top-0 -translate-y-1/8 shadow flex flex-col text-center w-[440px] h-[300px] py-[62px] px-[36px] bg-white rounded-2xl">
              <span className="text-[32px] text-[#1B1C57]" style={{fontWeight:800}}>Standout from the crowd</span>
              <span className="text-base text-[#1B1C57]" style={{fontWeight:500}}>Standout from 1000+ competitors who are more focused on traditional methods to gain customers with higher costs and lesser conversions </span>
         </div>

         <div className="absolute top-0 right-10 translate-y-1/4 shadow flex flex-col text-center w-[440px] h-[300px] py-[62px] px-[36px] bg-white rounded-2xl">
              <span className="text-[32px] text-[#1B1C57]" style={{fontWeight:800}}>Easy discovery by the customers</span>
              <span className="text-base text-[#1B1C57]" style={{fontWeight:500}}>We showcase your brand where your ideal customers are. No more scrolling across 100 Instagram reels to find the correct outfit.  </span>
         </div>

         <div className="absolute bottom-0 -translate-y-1/2 shadow flex flex-col text-center w-[440px] h-[300px] py-[62px] px-[36px] bg-white rounded-2xl">
              <span className="text-[32px] text-[#1B1C57]" style={{fontWeight:800}}>Reaching out to your Target audience</span>
              <span className="text-base text-[#1B1C57]" style={{fontWeight:500}}>Attirelly provides an effeicient way to reach out to your target audience. Be it bride to be, or GenZs, Users across various age groups and demographics shop on Attirelly.</span>
         </div>

         <div className="absolute bottom-0 right-10 -translate-y-1/8 shadow flex flex-col text-center w-[440px] h-[300px] py-[62px] px-[36px] bg-white rounded-2xl">
              <span className="text-[32px] text-[#1B1C57]" style={{fontWeight:800}}>Expanding your business this wedding</span>
              <span className="text-base text-[#1B1C57]" style={{fontWeight:500}}>Capture new customers and reach new shoppers this wedding season, witnessing revenue growth never heard before.</span>
         </div>
      </div>
      </div>

      {/* Section 5 */}

      <div className="relative flex w-[1247px] h-[347px] bg-[#F7F9FC] rounded-xl">
        <div className="flex flex-col my-[94px] ml-[40px] w-[647px] h-[189px] gap-4">
          <span
            className="text-[36px] text-[#1B1C57]"
            style={{ fontWeight: 700 }}
          >
            0% Commission rate
          </span>
          <span
            className="text-[18px] text-[#1B1C57]"
            style={{ fontWeight: 400 }}
          >
            Attirelly charges 0% commission rate across all product sales, allowing sellers to retain their full earnings on every sale

          </span>
          <button className="bg-black rounded p-2 text-white w-fit mt-2">
            Start Selling
          </button>
        </div>

        <div>
          <Image
        src="/SellerLanding/bg_dark_gray.svg"
        alt="bg dark gray"
        width={570}
        height={570}
        className="absolute right-0 bottom-0"
        />

<Image
        src="/SellerLanding/0_percent.svg"
        alt="0%"
        width={347}
        height={261}
        className="absolute right-40"
        />

        <Image
        src="/SellerLanding/thumbs_up_man.svg"
        alt="thumbs up"
        width={423}
        height={304}
        className="absolute bottom-0 right-0"
        />
        </div>


        

      </div>
    </div>
  );
}
