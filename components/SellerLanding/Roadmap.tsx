import { manrope } from "@/font";
import RoadmapCard from "./RoadmapCard";

type Props = {
  screenSize?: string;
};

const roadmap = [
    {
        id:1,
        title:"Get easy access to whole ONDC network",
        subtitle:"Attirelly acts as an enabler for store owners to list their store and catalogue on government's owned ONDC platform.",
        image:"/SellerLanding/ondc_image.svg",
    },
    {
        id:2,
        title:"Single workspace platform for Discovery, Sales and Logistics",
        subtitle:"Attirelly acts as a single platform to cater to all the needs of your store from Marketing, Discovery, Sales and Logistics. One dashboard to control everything. ",
        image:"/SellerLanding/sales_logistics.svg",
    },
    {
        id:3,
        title:"Use AI + Analytics That Actually Work for your bussiness",
        subtitle:`Know your top-performing products, trends, and price points. Voice reports: "What sold the most last week?"`,
        image:"/SellerLanding/artificial_intelligence.svg",
    },
    {
        id:4,
        title:"Voice-Powered Catalog Upload for fast catalog upload and update",
        subtitle:"Even if you’re not tech-savvy — just speak your product details and we will upload your products seamlessly.",
        image:"/SellerLanding/mic_image.svg",
    },
];

export default function Roadmap({ screenSize }: Props) {
    return(
        <div className={`${manrope.className} flex flex-col items-center mt-20 gap-4`} style={{ fontWeight: 800 }}>
  <span className="text-[20px] md:text-[32px] text-[#1B1C57] text-center">
    Future roadmap to help you increase your sales
  </span>
  <span
    className="px-4 md:w-[500px] lg:w-[560px] text-[14px] md:text-[16px] text-[#1B1C57] text-center"
    style={{ fontWeight: 500 }}
  >
    Attirelly aims to provide the best experience to our partners. We plan to introduce multiple features in coming months to help you expand your business and generate more revenue.
  </span>

  <div className="flex justify-center w-full mt-10">
    <div className="flex flex-col gap-5 lg:grid lg:grid-cols-2 lg:gap-x-[80px] lg:gap-y-[47px] w-fit">
      {roadmap.map((item) => (
        <RoadmapCard
          key={item.id}
          id={item.id}
          title={item.title}
          subtitle={item.subtitle}
          image={item.image}
          screenSize={screenSize}
        />
      ))}
    </div>
  </div>
</div>

    )
}