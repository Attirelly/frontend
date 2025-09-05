"use client";
import { manrope, rosario } from "@/font";
import Image from "next/image";
import { useHeaderStore } from "@/store/listing_header_store";
type Props = {
    screenSize?: string;
};

export default function OurNumbers({ screenSize }: Props) {
    const { storeType } = useHeaderStore();

    const handleClick = (title: string, id: string) => {
    window.history.pushState(null, "", `#${id}`);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };
    return (
        <div className="px-10 lg:px-0">

            <div className="w-full md:max-w-[600px] lg:max-w-[1247px] mx-auto bg-[#F7F9FC] rounded-4xl overflow-hidden mt-10">
            <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
                <div className={`${manrope.className} flex flex-col py-2 lg:py-[94px] items-center lg:items-start lg:pl-[80px]`}>
                <span
                    className="text-[24px] lg:text-[36px] text-[#1B1C57]"
                    style={{ fontWeight: 700 }}
                >
                    Join the revolution
                </span>
                <span
                    className="text-[14px] md:text-[18px] text-[#1B1C57] text-center lg:text-start"
                    style={{ fontWeight: 400 }}
                >
                    Build, earn, and learn — all while being a trendsetter on your campus

                </span>
                <button className="bg-black rounded p-2 text-white w-fit mt-2 cursor-pointer"
                onClick={() => handleClick("Contact Us", "Contact Us")}>
                    Apply Now
                </button>
            </div>

            <div className="flex items-end justify-center">
                <Image
                    src="/CollegeAmbassador/revolution.svg"
                    alt="Revolution"
                    width={screenSize === 'sm' ? 143 : 580}
                height={screenSize === 'sm' ? 143 : 1000}
                    className="hidden lg:block"
                />
                <Image
                    src="/CollegeAmbassador/revolution_2.svg"
                    alt="Revolution"
                    width={screenSize === 'sm' ? 300 : screenSize === 'md' ? 600 : 580}
                height={screenSize === 'sm' ? 300 : screenSize === 'md' ? 400 : 580}
                    className="lg:hidden"
                />

            </div>
        </div>
        </div>

        </div>
        
    );
}