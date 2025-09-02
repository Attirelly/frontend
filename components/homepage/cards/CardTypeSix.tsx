// // components/Card.tsx
// import Image from "next/image";
// import { manrope } from "@/font";

// interface CardProps {
//   imageUrl: string;
//   title: string;
//   description?: string;
//   screenSize?:string;
// }

// const CardTypeSix: React.FC<CardProps> = ({ imageUrl, title, description, screenSize='sm' }) => {
//   return (
//     <div>
//     <div
//       className={`${manrope.className} relative
//       ${screenSize === 'sm' ? 'w-[170px] h-[250px]' : ''}
//       ${screenSize === 'md' ? 'w-[210px] h-[310px]' : ''}
//       ${screenSize === 'lg' ? 'w-[250px] h-[310px]' : ''}
//       ${screenSize === 'xl' ? 'w-[293px] h-[333px]' : ''}
//       rounded-2xl overflow-hidden`}
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
//       {/* <div className="absolute inset-0 bg-transparent z-10" /> */}

//       {/* Text Content */}
//       <div className="flex flex-col items-center justify-center absolute bottom-0 left-1/2 transform -translate-x-1/2 z-20 pb-7 text-white mx-auto">
      
//         <h2 className="text-[16px] whitespace-nowrap" style={{ fontWeight: 400 }}>
//           {description}
//         </h2>
//         <button
//           className="w-[75px] h-[24px] lg:w-[100px] lg:h-[32px] text-sm bg-white text-black mt-4"
//           style={{ fontWeight: 500 }}
//         >
//           SHOP NOW
//         </button>
//       </div>
//     </div>

//     <h3
//         className="text-[13px] lg:text-[20px] text-black font-extrabold whitespace-nowrap z-50 text-center mt-2"
//         style={{ fontWeight: 500 }}
//       >
//         <div>{title}</div>
//       </h3>

//     </div>
      
//   );
// };

// export default CardTypeSix;


import Image from "next/image";
import { manrope } from "@/font";

interface CardProps {
  imageUrl: string;
  title: string;
  description?: string;
}

// REMOVED: The screenSize prop is gone.
const CardTypeSix: React.FC<CardProps> = ({ imageUrl, title, description }) => {
  return (
    // This outer div now just acts as a container for the card and its title below.
    <div>
      {/* CHANGED: Main container is now fluid with an aspect ratio. */}
      <div className={`${manrope.className} relative w-full aspect-[3/4] rounded-2xl overflow-hidden group`}>
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
            // ADDED: A sizes attribute optimized for the parent's new grid layout.
            sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
            priority
          />
        </div>

        {/* ADDED: A gradient overlay for better text readability. */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />

        {/* Text Content */}
        <div className="flex flex-col items-center justify-end text-center absolute inset-0 z-20 p-4 lg:p-6 text-white">
          <h2 className="text-base md:text-lg font-medium whitespace-nowrap" style={{ fontWeight: 400 }}>
            {description}
          </h2>
          {/* CHANGED: Button now uses padding and responsive text for flexible sizing. */}
          <button
            className="px-4 py-1 lg:px-6 lg:py-2 text-xs lg:text-sm bg-white text-black mt-3 lg:mt-4 rounded-md"
            style={{ fontWeight: 500 }}
          >
            SHOP NOW
          </button>
        </div>
      </div>

      {/* CHANGED: Title below the card is now responsive. */}
      <h3
        className="text-sm md:text-base lg:text-lg text-black font-medium whitespace-nowrap text-center mt-2"
        style={{ fontWeight: 500 }}
      >
        {title}
      </h3>
    </div>
  );
};

export default CardTypeSix;