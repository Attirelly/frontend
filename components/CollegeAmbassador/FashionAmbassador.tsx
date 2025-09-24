import { manrope } from "@/font";
import Image from "next/image";
type Props = {
    screenSize?: string;
};
export default function FashionAmbassador({ screenSize }: Props) {
    return (
        <div className="w-full max-w-[90vw] lg:max-w-[90vw] mx-auto bg-[#F7F9FC] rounded-4xl overflow-hidden">
            <div className="flex flex-col md:flex-row lg:flex-row lg:items-stretch lg:justify-between h-full">
                {/* Content Section */}
                <div className={`${manrope.className} flex flex-col py-8 px-6 md:py-12 md:px-8 lg:py-[60px] lg:pl-[50px] lg:pr-4 items-center md:items-start lg:items-start flex-1`}>
                    <h2 className="text-[24px] md:text-[28px] lg:text-[36px] text-[#1B1C57] mb-6 text-center md:text-left lg:text-left whitespace-nowrap" style={{ fontWeight: 700 }}>
                        Ambassador for Fashion Enthusiasts
                    </h2>
                    <div className="w-full max-w-[500px] lg:max-w-none">
                        <ul className="space-y-3 text-[14px] md:text-[16px] lg:text-[18px] text-[#1B1C57]" style={{ fontWeight: 400 }}>
                            <li className="flex items-start gap-3">
                                <span className="w-[10px] h-[10px] bg-gray-700 rounded-full mt-1 flex-shrink-0"></span>
                                <span className="leading-relaxed">An exciting opportunity to build your career in dynamic field of fashion</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-[10px] h-[10px] bg-gray-700 rounded-full mt-1 flex-shrink-0"></span>
                                <span className="leading-relaxed">Connect with the largest designer labels from India</span>
                            </li>
                            {/* <li className="flex items-center gap-2">
                                <span className="w-[10px] h-[10px] bg-gray-700 rounded-full"></span>
                                <span>Earn upto 1 Lakh per month from client consultations</span>
                            </li> */}
                        </ul>
                    </div>

                </div>

                {/* Image Section */}
                <div className="flex items-end justify-center md:justify-end lg:justify-end pt-6 px-6 md:pt-0 md:px-0 md:pr-[40px] lg:pr-[40px] md:flex-shrink-0 lg:flex-shrink-0 md:self-end lg:self-end">
                    <Image
                        src="/CollegeAmbassador/fashion_enthu.svg"
                        alt="designer store type"
                        width={480}
                        height={286}
                        className="w-3/5 h-auto max-w-[286px] md:w-[286px] md:h-auto lg:w-[286px] lg:h-auto object-contain transition-transform duration-300 ease-in-out "
                    />
                </div>
                {/* <div className="flex items-end justify-center">
                    <Image
                src="/CollegeAmbassador/fashion_enthu.svg"
                alt="designer store type"
                width={screenSize === 'sm' ? 250 : 480}
                height={screenSize === 'sm' ? 143 : 286}
                />

                </div> */}
            </div>
        </div>
    );
}