import Image from "next/image";

interface OurNumbersCardProps {
 id:number,
 title:string,
 subtitle:string,
 image:string,
}
export default function OurNumbersCard({id, title, subtitle, image} : OurNumbersCardProps){
 return (
    <div className="relative flex flex-col pt-[62px] pb-[24px] px-[22px] shadow-2xl rounded-2xl items-center">
        <Image
        src={image}
        alt={title}
        width={100}
        height={100}
        className="absolute top-0 -translate-y-1/2"
        />
        <div className="w-[247px] h-[77px] flex flex-col items-center">
<span className="text-[24px] text-[#1B1C57]" style={{fontWeight:600}}>{title}</span>
        <span className="text-[18px] text-[#1B1C57] text-center" style={{fontWeight:500}}>{subtitle}</span>
        </div>
        
    </div>
 )
}