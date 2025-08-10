import { manrope } from "@/font";
import Image from "next/image";
export default function FashionAmbassador() {
    return (
        <div className="w-[1280px] h-[340px] bg-[#F7F9FC] rounded-4xl overflow-hidden">
            <div className="flex justify-between h-full">
                <div className={`${manrope.className} flex flex-col py-[94px] pl-[80px]`}>

                    <h2 className="text-[36px] text-[#1B1C57] mb-4" style={{fontWeight:700}}>
                        Ambassador for Fashion Enthusiasts
                    </h2>
                    <div>
                        <ul className="space-y-2 text-[18px] text-[#1B1C57]" style={{fontWeight:400}}>
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
                <div className="flex flex-col justify-end items-center pr-8">
                    <Image
                src="/CollegeAmbassador/fashion_enthu.svg"
                alt="designer store type"
                width={473}
                height={316}
                />

                </div>
            </div>
        </div>
    );
}