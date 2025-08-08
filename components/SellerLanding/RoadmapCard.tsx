import { manrope } from "@/font";
import Image from "next/image";

interface RoadmapCardProps {
    id: number,
    title: string,
    subtitle: string,
    image: string,
}
export default function RoadmapCard({ id, title, subtitle, image }: RoadmapCardProps) {
    return (
    <div className="relative w-[490px] h-[208px] py-[38px] pl-[77px] pr-[51px] shadow-2xl rounded-tr-full rounded-br-full">
        <div className={`${manrope.className} flex flex-col`} style={{fontWeight:400}}>
            <span className="text-[#223140] text-[21px]" style={{fontWeight:600}}>{title}</span>
            <span className="text-[#535558] text-[16px]" style={{fontWeight:600}}>{subtitle}</span>
        </div>
        <Image
        src={image}
        alt={title}
        width={121}
        height={121}
        className={`absolute left-0 -translate-x-1/2 top-10 rounded-full ${image === "/SellerLanding/artificial_intelligence.svg" ? 'bg-white shadow-lg' : ''} `}
        />
    </div>
)
}