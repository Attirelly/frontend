// // components/Card.tsx
// import Image from "next/image";
// import { manrope } from "@/font";

// interface CardProps {
//   imageUrl: string;
//   title: string;
//   description?: string;
//   screenSize?: string;
// }

// const CardTypeFour: React.FC<CardProps> = ({
//   imageUrl,
//   title,
//   description,
//   screenSize = "sm",
// }) => {
//   return (
//     <div
//       className={`${manrope.className} relative
//                   ${screenSize === "sm" ? "w-[120px] h-[120px]" : ""}
//                   ${screenSize === "md" ? "w-[140px] h-[140px]" : ""}
//                   ${screenSize === "lg" ? "w-[175px] h-[175px]" : ""}
//                   ${screenSize === "xl" ? "w-[200px] h-[200px]" : ""}
//      overflow-hidden rounded-sm`}
//     >
//       {/* Background Image */}
//       <div className="absolute inset-0 z-0">
//         <Image
//           src={imageUrl}
//           alt={title}
//           fill
//           className="object-cover object-top"
//           priority
//         />
//       </div>

//       {/* Overlay */}
//       <div className="absolute inset-0 bg-transparent z-10" />

//       {/* Discount Badge */}
//       {/* <div className="absolute top-0 right-0 z-20 bg-black text-white text-sm font-semibold px-3 py-1 rounded-bl-xl shadow-md">
//         Sale : {discountText} %
//       </div> */}

//       {/* Text Content */}
//       <div className="flex flex-col items-center justify-center absolute bottom-0 left-1/2 transform -translate-x-1/2 z-20 mb-4 text-white mx-auto">
//         <h3
//           className={`${screenSize === "sm" ? "text-[14px]" : ""}
//                   ${screenSize === "md" ? "text-[16px]" : ""}
//                   ${screenSize === "lg" ? "text-[18px]" : ""}
//                   ${screenSize === "xl" ? "text-[20px]" : ""}
//                   whitespace-nowrap text-white`}
//           style={{ fontWeight: 400 }}
//         >
//           {title}
//         </h3>
//         <h2
//           className={`${screenSize === "sm" ? "text-[9px]" : ""}
//                   ${screenSize === "md" ? "text-[11px]" : ""}
//                   ${screenSize === "lg" ? "text-[13px]" : ""}
//                   ${screenSize === "xl" ? "text-[16px]" : ""}
//                   whitespace-nowrap text-white`}
//           style={{ fontWeight: 400 }}
//         >
//           {description}
//         </h2>
//       </div>
//     </div>
//   );
// };

// export default CardTypeFour;

import Image from "next/image";
import { manrope } from "@/font";

interface CardProps {
  imageUrl: string;
  title: string;
  description?: string;
}

const CardTypeFour: React.FC<CardProps> = ({
  imageUrl,
  title,
  description,
}) => {
  return (
    <div
      className={`${manrope.className} relative w-full aspect-square overflow-hidden rounded-sm group`}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="
            (max-width: 639px) 50vw,
            (max-width: 767px) 33vw,
            (max-width: 1023px) 25vw,
            17vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
          priority
        />
      </div>

      {/* Gradient Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />

      {/* Text Content */}
      <div className="flex flex-col items-center justify-end absolute inset-0 z-20 p-2 md:p-4 text-center text-white">
        <h3
          className="text-sm md:text-base lg:text-lg font-semibold whitespace-nowrap"
          style={{ fontWeight: 400 }}
        >
          {title}
        </h3>
        {description && (
          <h2
            className="text-xs md:text-sm lg:text-base whitespace-nowrap"
            style={{ fontWeight: 400 }}
          >
            {description}
          </h2>
        )}
      </div>
    </div>
  );
};

export default CardTypeFour;
