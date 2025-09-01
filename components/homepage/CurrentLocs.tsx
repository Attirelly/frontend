import { manrope } from "@/font";
import Image from "next/image";

const locs = [
    { location: "Ludhiana" },
    { location: "Jaipur" },
    { location: "Patiala" },
    { location: "Chandigarh" },
    { location: "New Delhi" },
    { location: "Mohali" },
];

export default function CurrentLocs() {
  return (
    <div
      className={`${manrope.className} flex flex-col gap-16 justify-center items-center my-13`}
      style={{ fontWeight: 500 }}
    >
      {/* Left Column: Location Info */}
      <div className="flex flex-col gap-10 items-center">
        <span className={`text-[18px] md:text-[30px] lg:text-[32px] 
        text-center text-black`}>
          CURRENTLY OPERATING IN
        </span>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 justify-items-center">
          {locs.map((location) => (
            <span
              key={location.location}
              className="text-[14px] md:text-xl text-black px-5 py-3"
            >
              {location.location}
            </span>
          ))}
        </div>
      </div>

      {/* Right Column: Supported By */}
      <div className="flex flex-col items-center justify-start gap-5">
        <span className="text-[16px] md:text-[24px] lg:text-[28px] text-black">Supported By</span>
        {/* <div className="flex gap-3 items-center"> */}
          <Image
            src="/Homepage/ISB_AIC.svg"
            alt="ISB AIC"
            width={217}
            height={70}
            className="w-[127px] h-[40px] md:w-[217px] md:h-[70px]"
          />
          <Image
            src="/Homepage/Razorpay.svg"
            alt="Razorpay"
            width={310}
            height={61}
            className="w-[181px] h-[36px] md:w-[310px] md:h-[61px]"
          />
        {/* </div> */}
      </div>
    </div>
  );
}