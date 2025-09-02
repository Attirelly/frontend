// import Image from "next/image";
// import { manrope } from "@/font";
// interface CardTwoTypeProps {
//   imageUrl: string;
//   title: string;
//   description: string;
//   screenSize?: string;
// }
// export default function CardTwoType({
//   imageUrl,
//   title,
//   description,
//   screenSize = "sm",
// }: CardTwoTypeProps) {
//   return (
//     <div className="flex flex-col items-center justify-center gap-2">
//       <div
//         className={`relative
//                 ${screenSize === "sm" ? "w-[178px] h-[178px]" : ""}
//                 ${screenSize === "md" ? "w-[160px] h-[160px]" : ""}
//                 ${screenSize === "lg" ? "w-[265px] h-[265px]" : ""}
//                 ${screenSize === "xl" ? "w-[265px] h-[265px]" : ""}
//                  `}
//       >
//         <Image
//           src={imageUrl}
//           alt="Card Type Two Image"
//           fill
//           className="object-contain rounded-xl"
//         />
//       </div>
//       <div className="flex flex-col gap-1 items-center justify-center">
//         <span
//           className={`${manrope.className}
//           ${screenSize === 'sm' ? 'text-[16px]' : ''}
//           ${screenSize === 'md' ? 'text-[18px]' : ''}
//           ${screenSize === 'lg' || screenSize === 'xl' ? 'text-[20px]' : ''}
//             text-black`}
//           style={{ fontWeight: 500 }}
//         >
//           {title}
//         </span>
//         <span
//           className={`${manrope.className}
//           ${screenSize === 'sm' ? 'text-[12px]' : ''}
//           ${screenSize === 'md' ? 'text-[14px]' : ''}
//           ${screenSize === 'lg' || screenSize === 'xl' ? 'text-[16px]' : ''}
//             text-[#5F5F5F]`}
//           style={{ fontWeight: 400 }}
//         >
//           {description}
//         </span>
//       </div>
//     </div>
//   );
// }


import Image from "next/image";
import { manrope } from "@/font";

interface CardTwoTypeProps {
  imageUrl: string;
  title: string;
  description: string;
  // REMOVED: screenSize prop is no longer needed.
}

export default function CardTwoType({
  imageUrl,
  title,
  description,
}: CardTwoTypeProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {/* CHANGED: This container is now fluid and maintains a square shape */}
      <div className="relative w-full aspect-square">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-contain rounded-xl"
          // ADDED: A sizes attribute optimized for the parent's new grid layout
          sizes="(max-width: 767px) 50vw, 25vw"
        />
      </div>
      <div className="flex flex-col gap-1 items-center justify-center text-center">
        <span
          // CHANGED: Using responsive prefixes for text size
          className={`${manrope.className} text-base md:text-lg lg:text-xl text-black`}
          style={{ fontWeight: 500 }}
        >
          {title}
        </span>
        <span
          // CHANGED: Using responsive prefixes for text size
          className={`${manrope.className} text-sm md:text-base lg:text-lg text-[#5F5F5F]`}
          style={{ fontWeight: 400 }}
        >
          {description}
        </span>
      </div>
    </div>
  );
}