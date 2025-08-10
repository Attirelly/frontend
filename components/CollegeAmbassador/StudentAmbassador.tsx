import { manrope } from "@/font";
import Image from "next/image";
export default function StudentAmbassador() {
    return (
        <div className="w-[1280px] h-[340px] bg-[#F7F9FC] rounded-4xl overflow-hidden">
            <div className="flex justify-between">
                <div className={`${manrope.className} flex flex-col py-[94px] pl-[80px]`}>

                    <h2 className="text-[36px] text-[#1B1C57] mb-4" style={{fontWeight:700}}>
                        Ambassador for Students
                    </h2>
                    <div>
                        <ul className="space-y-2 text-[18px] text-[#1B1C57]" style={{fontWeight:400}}>
                            <li className="flex items-center gap-2">
                                <span className="w-[10px] h-[10px] bg-gray-700 rounded-full"></span>
                                <span>Build your network by working with India’s top designer labels and fashion influencers</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-[10px] h-[10px] bg-gray-700 rounded-full"></span>
                                <span>Learn and upskill in the field of fashion and marketing</span>
                            </li>
                            {/* <li className="flex items-center gap-2">
                                <span className="w-[10px] h-[10px] bg-gray-700 rounded-full"></span>
                                <span>Showcase your Instagram, not just products.</span>
                            </li> */}
                        </ul>
                    </div>

                </div>
                <div className="flex flex-col justify-end items-center pr-8">
                    <Image
                src="/CollegeAmbassador/student.svg"
                alt="Student"
                width={473}
                height={316}
                />

                </div>
            </div>
        </div>
    );
}