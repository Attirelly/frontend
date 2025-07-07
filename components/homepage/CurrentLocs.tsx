import { manrope } from "@/font";
import Image from "next/image";

const locs = [
    { location: "Ludhiana" },
    { location: "Jaipur" },
    { location: "Patiala" },
    { location: "Chandigarh" },
    { location: "New Delhi" },
    { location: "Manali" },
];

export default function CurrentLocs() {
    return (
        <div className={`${manrope.className} flex flex-col gap-10 items-center my-13`} style={{ fontWeight: 500 }}>
            <span className="text-[32px] text-center">CURRENTLY OPERATING IN</span>
            <div className="grid grid-cols-3 gap-x-15">
                {locs.map((location) => (
                    <span className="text-xl gap-y-6 px-5 py-3">{location.location}</span>
                ))}
            </div>
            <div className="flex gap-3 items-center">
                <span className="text-[28px] ml-11">Supported By</span>
                <Image
                    src="/Homepage/ISB_AIC.svg"
                    alt="ISB AIC"
                    width={217}
                    height={70}
                />
                <Image
                    src="/Homepage/Razorpay.svg"
                    alt="Razorpay"
                    width={186}
                    height={70}
                    className="mr-11"
                />

            </div>
        </div>
    )
}