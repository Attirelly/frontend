import { manrope } from "@/font";
import Image from "next/image";
export default function HouseMakerAmbassador() {
    return (
        <div className="w-[1280px] h-[340px] bg-[#F7F9FC] rounded-4xl overflow-hidden">
            <div className="flex h-full justify-center">
                <div className={`${manrope.className} flex flex-col py-[94px] pl-[80px]`}>

                    <h2 className="text-[36px] text-[#1B1C57] mb-4" style={{fontWeight:700}}>
                        Ambassador for House Makers
                    </h2>
                    <div>
                        <ul className="space-y-2 text-[18px] text-[#1B1C57]" style={{fontWeight:400}}>
                            <li className="flex items-center gap-2">
                                <span className="w-[10px] h-[10px] bg-gray-700 rounded-full"></span>
                                <span>Utilize your time to earn and become independent</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-[10px] h-[10px] bg-gray-700 rounded-full"></span>
                                <span>Connect with like minded individuals through exciting events and get togethers</span>
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
                src="/CollegeAmbassador/house_maker.svg"
                alt="house maker"
                width={473}
                height={316}
                />

                </div>
            </div>
        </div>
    );
}