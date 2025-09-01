import { manrope } from "@/font";
import Image from "next/image";

interface RoadmapCardProps {
    id: number,
    title: string,
    subtitle: string,
    image: string,
    screenSize?: string,
}
export default function RoadmapCard({ id, title, subtitle, image, screenSize }: RoadmapCardProps) {
    return (
    <div className="relative w-[320px] ml-[20px] h-[120px] pl-[30px] py-[25px] md:w-[490px] md:h-[208px] md:py-[38px] md:pl-[77px] md:pr-[51px] shadow-2xl rounded-tr-full rounded-br-full">
        <div className={`${manrope.className} flex flex-col`} style={{fontWeight:400}}>
            <span className="text-[#223140] text-[14px] md:text-[21px]" style={{fontWeight:600}}>{title}</span>
            <span className="text-[#535558] text-[10px] md:text-[16px]" style={{fontWeight:600}}>{subtitle}</span>
        </div>
        <Image
        src={image}
        alt={title}
        width={screenSize === 'sm' ? 60 :121}
        height={screenSize === 'sm' ? 60 :121}
        className={`absolute left-0 -translate-x-1/2 top-8 md:top-10  rounded-full ${image === "/SellerLanding/artificial_intelligence.svg" ? 'bg-white shadow-lg' : ''} `}
        />
    </div>
)
}