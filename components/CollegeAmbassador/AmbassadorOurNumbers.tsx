"use client";
import { manrope, rosario } from "@/font";
import Image from "next/image";
import { useHeaderStore } from "@/store/listing_header_store";
import WhoCanJoinTabs from "./WhoCanJoinTabs";
import StudentAmbassador from "./StudentAmbassador";
import HouseMakerAmbassador from "./HouseMakerAmbassador";
import InfluencerAmbassador from "./InfluencerAmbassador";
import FashionAmbassador from "./FashionAmbassador";
// import DesignerStoreType from "./DesignerStoreType";
// import RetailStoreType from "./RetailStoreType";
// import TailorStoreType from "./TailorStoreType";
// import StylistStoreType from "./StylistStoreType";

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

export default function OurNumbers({ screenSize }: Props) {
  const {ambassadorType} = useHeaderStore();
  return (
    <div
      className={`${manrope.className} flex flex-col items-center gap-30 pt-30`}
    > 
    {/* Section 4 */}
      <div className="w-full hidden h-[792px] lg:grid grid-cols-[1fr_3fr] bg-[#F7F9FC]">
      <span className="text-[32px] text-[#1B1C57] w-[326px] h-[88px] pl-[40px] mt-10" style={{fontWeight:800}}>Benefits worth 
₹35000+</span>
      <div className="relative">
         <div className={`absolute top-0 -translate-y-1/8 shadow flex flex-col text-center 
         ${screenSize === 'lg' ? 'w-[400px] h-[262px]' : 'w-[484px] h-[262px]'}
         py-[62px] px-[36px] bg-white rounded-2xl`}>
         <Image
         src="/CollegeAmbassador/person_over_hand.svg"
         alt="Person over hand"
         width={152}
         height={102}
         className={`absolute top-0
         ${screenSize === 'lg' ? 'left-30' : 'left-40'}
          -translate-y-1/2`}/>
              <span className="text-[36px] text-[#1E1E1E] mb-2" style={{fontWeight:800}}>Get Featured</span>
              <span className="text-[18px] text-[#1B1C57]" style={{fontWeight:500}}>Be showcased on designer labels & retail store pages via their social media platforms.</span>
         </div>

         <div className={`absolute top-0 right-10 translate-y-3/4 shadow flex flex-col text-center
          ${screenSize === 'lg' ? 'w-[400px] h-[262px]' : 'w-[484px] h-[262px]'}
          py-[62px] px-[36px] bg-white rounded-2xl`}>
              <Image
         src="/CollegeAmbassador/wallet.svg"
         alt="Person over hand"
         width={102}
         height={102}
         className={`absolute top-0
          ${screenSize === 'lg' ? 'left-40' : 'left-50'} 
          -translate-y-1/2`}/>
              <span className="text-[36px] text-[#1E1E1E] mb-2" style={{fontWeight:800}}>Build your portfolio</span>
              <span className="text-[18px] text-[#1B1C57]" style={{fontWeight:500}}>Stand out with real-world experience in fashion brand-building and community growth.</span>
         </div>

         <div className={`absolute bottom-0 -translate-y-1/2 shadow flex flex-col text-center 
          ${screenSize === 'lg' ? 'w-[400px] h-[262px]' : 'w-[484px] h-[262px]'}
          py-[62px] px-[36px] bg-white rounded-2xl`}>
              <Image
         src="/CollegeAmbassador/people_network.svg"
         alt="Person over hand"
         width={162}
         height={132}
         className={`absolute top-0 
         ${screenSize === 'lg' ? 'left-30' : 'left-40'}
         -translate-y-1/2`}/>
              <span className="text-[36px] text-[#1E1E1E] mb-2" style={{fontWeight:800}}>Network with fashion leaders</span>
              <span className="text-[18px] text-[#1B1C57]" style={{fontWeight:500}}>Connect with boutique owners, designers, stylists, and store founders.</span>
         </div>
      </div>
      </div>
      {/* Section 3 */}
      <div className="flex flex-col items-center gap-4 px-2">
        <span className="text-[24px] md:text-[32px] text-[#1B1C57]" style={{fontWeight:700}}>Who can join?</span>
        <span className="text-[14px] w-[350px] md:w-[450px] lg:w-full md:text-[18px] text-[#1B1C57] mb-8 text-center" style={{fontWeight:400}}>if you sell ethnic wear, ranging from affordable to luxury wear, Attirelly is for you. We work with:</span>
        <WhoCanJoinTabs defaultValue="Students"/>
        {ambassadorType === 'Students' 
        ? <StudentAmbassador screenSize={screenSize}/> : 
        ambassadorType === 'House makers' 
        ? <HouseMakerAmbassador screenSize={screenSize}/> :
        ambassadorType === 'Influencers'
        ? <InfluencerAmbassador screenSize={screenSize}/> :
        ambassadorType === 'Fashion'
        ? <FashionAmbassador screenSize={screenSize}/> : <div></div>}
      </div>

      
    </div>
  );
}
