// import Image from "next/image";
// import { manrope } from "@/font";

// const TRUNCATE_LENGTH = 45; // Adjust the value as needed

// interface CardTwoTypeProps {
//   imageUrl: string;
//   title: string;
//   description: string;
//   price: number;
//   mrp: number;
//   discount: number;
//   screenSize?: string;
// }

// export default function CardTypeFive({
//   imageUrl,
//   title,
//   description,
//   price,
//   mrp,
//   discount,
//   screenSize = "sm",
// }: CardTwoTypeProps) {
//   return (
//     <div
//       className={`${manrope.className} relative
//       ${screenSize === "sm" ? "w-[170px]" : ""}
//       ${screenSize === "md" ? "w-[210px]" : ""}
//       ${screenSize === "lg" ? "w-[220px]" : ""}
//       ${screenSize === "xl" ? "w-[233px]" : ""}
//       rounded-2xl overflow-hidden`}
//     >
//       {/* Image */}
//       <div
//         className={`relative w-full rounded-xl
//       ${screenSize === "sm" ? "h-[217px]" : ""}
//       ${screenSize === "md" ? "h-[230px]" : ""}
//       ${screenSize === "lg" ? "h-[240px]" : ""}
//       ${screenSize === "xl" ? "h-[260px]" : ""}
//         `}
//       >
//         <Image
//           src={imageUrl}
//           alt="Card Type Two Image"
//           fill
//           className="object-cover object-top rounded-xl"
//         />
//       </div>

//       {/* Text */}
//       <div
//         className={`${manrope.className} w-full flex flex-col gap-2`}
//         style={{ fontWeight: 500 }}
//       >
//         <span
//           className={`${screenSize === "sm" ? "text-[14px]" : ""}
//                           ${screenSize === "md" ? "text-[16px]" : ""}
//                           ${
//                             screenSize === "lg" || screenSize === "xl"
//                               ? "text-[20px]"
//                               : ""
//                           }
//                           text-[#1E1E1E]`}
//         >
//           {title.length > TRUNCATE_LENGTH ? `${title.slice(0, TRUNCATE_LENGTH)}...` : title}
//         </span>
//         <span
//           className={`${screenSize === "sm" ? "text-[12px]" : ""}
//                       ${screenSize === "md" ? "text-[14px]" : ""}
//                       ${
//                         screenSize === "lg" || screenSize === "xl"
//                           ? "text-[16px]"
//                           : ""
//                       }
//              text-[#1E1E1E] truncate`}
//           style={{ fontWeight: 300 }}
//         >
//           {description}
//         </span>
//         <div className="flex gap-1 items-center">
//           <span
//             className={`${screenSize === "sm" ? "text-[12px]" : ""}
//                           ${screenSize === "md" ? "text-[14px]" : ""}
//                           ${
//                             screenSize === "lg" || screenSize === "xl"
//                               ? "text-[16px]"
//                               : ""
//                           } 
//           text-black`}
//           >
//             ₹{price.toLocaleString()}
//           </span>
//           {price !== mrp && (
//             <span
//               className={`line-through
//                ${screenSize === "sm" ? "text-[10px]" : ""}
//                           ${screenSize === "md" ? "text-[12px]" : ""}
//                           ${
//                             screenSize === "lg" || screenSize === "xl"
//                               ? "text-[14px]"
//                               : ""
//                           } 
//              text-xs text-gray-400`}
//             >
//               ₹{mrp.toLocaleString()}
//             </span>
//           )}
//           {price !== mrp && (
//             <span
//               className={`text-green-600
//                  ${screenSize === 'sm' ? 'text-[9px]' : ''}
//                           ${screenSize === 'md' ? 'text-[11px]' : ''}
//                           ${screenSize === 'lg' || screenSize === 'xl' ? 'text-[11px]' : ''} 
//                  `}
//               style={{ fontWeight: 600 }}
//             >
//               {discount}% OFF
//             </span>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import Image from "next/image";
import { manrope } from "@/font";

interface CardFiveProps {
  imageUrl: string;
  title: string;
  description: string;
  price: number;
  mrp: number;
  discount: number;
  // REMOVED: screenSize prop is no longer needed.
}

export default function CardTypeFive({
  imageUrl,
  title,
  description,
  price,
  mrp,
  discount,
}: CardFiveProps) {
  return (
    // The main container is now a simple flex column.
    <div className={`${manrope.className} flex flex-col`}>
      {/* Image container is now fluid with a fixed aspect ratio */}
      <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover object-center"
          // ADDED: An optimized sizes attribute for the new carousel layout
          sizes="
            (max-width: 767px) 50vw,
            (max-width: 1023px) 33vw,
            20vw"
        />
      </div>

      {/* Text content with responsive font sizes */}
      <div className={`${manrope.className} w-full flex flex-col gap-1 mt-2`} style={{ fontWeight: 500 }}>
        <span className="text-sm md:text-base text-[#1E1E1E] truncate" title={title}>
          {title}
        </span>
        <span className="text-xs md:text-sm text-gray-600 truncate" style={{ fontWeight: 300 }} title={description}>
          {description}
        </span>
        <div className="flex flex-wrap items-center gap-x-2">
          <span className="text-sm md:text-base text-black">
            ₹{price.toLocaleString()}
          </span>
          {price < mrp && (
            <span className="text-xs md:text-sm text-gray-400 line-through">
              ₹{mrp.toLocaleString()}
            </span>
          )}
          {discount > 0 && (
            <span className="text-xs md:text-sm text-green-600 font-semibold">
              {discount}% OFF
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
