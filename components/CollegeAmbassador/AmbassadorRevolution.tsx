"use client";
import { manrope, rosario } from "@/font";
import Image from "next/image";
import { useHeaderStore } from "@/store/listing_header_store";

export default function OurNumbers() {
    const { storeType } = useHeaderStore();
    return (
         <div
              className={`${manrope.className} flex flex-col items-center gap-30 pt-30`}
            >
        <div className="relative flex w-[1247px] h-[347px] bg-[#F7F9FC] rounded-xl overflow-hidden">
            <div className="flex flex-col my-[94px] ml-[40px] w-[647px] h-[189px] gap-4">
                <span
                    className="text-[36px] text-[#1B1C57]"
                    style={{ fontWeight: 700 }}
                >
                    Join the revolution
                </span>
                <span
                    className="text-[18px] text-[#1B1C57]"
                    style={{ fontWeight: 400 }}
                >
                    Build, earn, and learn — all while being a trendsetter on your campus

                </span>
                <button className="bg-black rounded p-2 text-white w-fit mt-2">
                    Apply Now
                </button>
            </div>

            <div>
                <Image
                    src="/SellerLanding/bg_dark_gray.svg"
                    alt="bg dark gray"
                    width={570}
                    height={570}
                    className="absolute right-0 bottom-0"
                />

                <Image
                    src="/CollegeAmbassador/revolution.svg"
                    alt="Revolution"
                    width={598}
                    height={399}
                    className="absolute bottom-0 right-0"
                />
            </div>
        </div>
        </div>
    );
}
