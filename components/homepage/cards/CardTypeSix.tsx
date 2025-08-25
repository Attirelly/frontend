// components/Card.tsx
import Image from "next/image";
import { manrope } from "@/font";

interface CardProps {
  imageUrl: string;
  title: string;
  description?: string;
}

const CardTypeSix: React.FC<CardProps> = ({ imageUrl, title, description }) => {
  return (
    <div>
    <div
      className={`${manrope.className}  relative w-[192px] h-[261px] lg:w-[293px] lg:h-[333px] rounded-2xl overflow-hidden`}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover object-top"
          priority
        />
      </div>

      {/* Overlay */}
      {/* <div className="absolute inset-0 bg-transparent z-10" /> */}

      {/* Text Content */}
      <div className="flex flex-col items-center justify-center absolute bottom-0 left-1/2 transform -translate-x-1/2 z-20 pb-7 text-white mx-auto">
      
        <h2 className="text-[16px] whitespace-nowrap" style={{ fontWeight: 400 }}>
          {description}
        </h2>
        <button
          className="w-[75px] h-[24px] lg:w-[100px] lg:h-[32px] text-sm bg-white text-black mt-4"
          style={{ fontWeight: 500 }}
        >
          SHOP NOW
        </button>
      </div>
    </div>

    <h3
        className="text-[13px] lg:text-[20px] text-black font-extrabold whitespace-nowrap z-50 text-center mt-2"
        style={{ fontWeight: 500 }}
      >
        <div>{title}</div>
      </h3>

    </div>
      
  );
};

export default CardTypeSix;
