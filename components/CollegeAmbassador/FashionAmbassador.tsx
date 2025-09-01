import { manrope } from "@/font";
import Image from "next/image";
type Props = {
    screenSize?: string;
};
export default function FashionAmbassador({ screenSize }: Props) {
    return (
        <div className="w-full bg-[#F7F9FC] rounded-4xl overflow-hidden">
            <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
                <div className={`${manrope.className} flex flex-col py-2 lg:py-[94px] items-center lg:items-start lg:pl-[80px]`}>

                    <h2 className="text-[24px] lg:text-[36px] text-[#1B1C57] mb-4 text-center" style={{fontWeight:700}}>
                        Ambassador for Fashion Enthusiasts
                    </h2>
                    <div>
                        <ul className="space-y-2 text-[14px] lg:text-[18px] w-[320px] lg:w-full text-[#1B1C57]" style={{fontWeight:400}}>
                            <li className="flex items-center gap-2">
                                <span className="w-[10px] h-[10px] bg-gray-700 rounded-full"></span>
                                <span>An exciting opportunity to build your career in dynamic field of fashion</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-[10px] h-[10px] bg-gray-700 rounded-full"></span>
                                <span>Connect with the largest designer labels from India</span>
                            </li>
                            {/* <li className="flex items-center gap-2">
                                <span className="w-[10px] h-[10px] bg-gray-700 rounded-full"></span>
                                <span>Earn upto 1 Lakh per month from client consultations</span>
                            </li> */}
                        </ul>
                    </div>

                </div>
                <div className="flex items-end justify-center">
                    <Image
                src="/CollegeAmbassador/fashion_enthu.svg"
                alt="designer store type"
                width={screenSize === 'sm' ? 250 : 480}
                height={screenSize === 'sm' ? 143 : 286}
                />

                </div>
            </div>
        </div>
    );
}