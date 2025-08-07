import { manrope } from "@/font";
import OurNumbersCard from "./OurNumbersCard";
import Image from "next/image";
import StoreTypeTabs from "../listings/StoreTypes";

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
          <Image
          src="/SellerLanding/spider_web.svg"
          alt="spider web"
          width={650}
          height={400}
          className="absolute right-0 bottom-0"/>
        </div>
      </div>
      
      {/* Section 3 */}
      <div className="flex flex-col items-center">
        <span className="text-[32px] text-[#1B1C57]" style={{fontWeight:700}}>Who can join?</span>
        <span className="text-[18px] text-[#1B1C57]" style={{fontWeight:400}}>if you sell ethnic wear, ranging from affordable to luxury wear, Attirelly is for you. We work with:</span>
        <StoreTypeTabs defaultValue={process.env.NEXT_PUBLIC_RETAIL_STORE_TYPE || ''}/>
      </div>
    </div>
  );
}
