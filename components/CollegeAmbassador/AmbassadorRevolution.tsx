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
        <div className="md:px-8 lg:px-0">
            <div className="w-full max-w-[90vw] lg:max-w-[90vw] mx-auto mt-10 overflow-hidden bg-[#F7F9FC] rounded-4xl">
                <div className="flex flex-col md:flex-row md:items-stretch md:justify-between h-full">

                    {/* Content Section */}
                    <div className={`${manrope.className}  text-center md:text-left flex flex-col items-center md:items-start py-8 px-6 md:py-12 md:px-8 lg:py-[60px] lg:pl-[50px] lg:pr-4 flex-1`}>
                        <h2
                            className="text-[24px] md:text-[28px] lg:text-[36px] text-[#1B1C57] mb-4"
                            style={{ fontWeight: 700 }}
                        >
                            Join the revolution
                        </h2>
                        <p
                            className="text-[16px] lg:text-[18px] text-[#1B1C57] mb-8 max-w-xl"
                            style={{ fontWeight: 400 }}
                        >
                            Build, earn, and learn — all while being a trendsetter on your campus
                        </p>
                        <button
                            className="bg-black rounded-md py-3 px-8 text-white text-base font-semibold cursor-pointer hover:bg-gray-800 transition-colors"
                            onClick={() => handleClick("Contact Us", "Contact Us")}
                        >
                            Apply Now
                        </button>
                    </div>

                    {/* Image Section */}
                    <div className="md:flex  md:justify-end md:flex-shrink-0 h-full">
                        {/* --- Mobile Image (Visible on small screens) --- */}
                        <Image
                            src="/CollegeAmbassador/revolution_2.svg"
                            alt="Join the revolution"
                            width={600}
                            height={400}
                            className="w-full h-auto md:hidden"
                        />
                        {/* --- Desktop Image (Visible on medium screens and up) --- */}
                        <Image
                            src="/CollegeAmbassador/revolution.svg"
                            alt="Join the revolution"
                            width={580}
                            height={1000}
                            className="hidden h-auto object-contain object-bottom md:block h-full md:max-w-[700px] md:max-h-[700px] lg:max-h-[700px] xl:max-h-[700px]"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}