import Image from "next/image";
import { manrope } from "@/font";
interface CardTwoTypeProps {
    imageUrl: string;
    title: string;
    description: string;
}
export default function CardTwoType({ imageUrl, title, description }: CardTwoTypeProps) {
    return (
        <div className="flex flex-col items-center justify-center gap-2">
            <div className="relative w-66 h-66">
                <Image
                    src={imageUrl}
                    alt="Card Type Two Image"
                    fill
                    className="object-contain rounded-xl"
                />
            </div>
            <div className="flex flex-col gap-1 items-center justify-center">
                <span className={`${manrope.className} text-[20px] text-black`} style={{ fontWeight: 500 }}>{title}</span>
                <span className={`${manrope.className} text-[16px] text-[#5F5F5F]`} style={{ fontWeight: 400 }}>{description}</span>
            </div>
        </div>


    )
}