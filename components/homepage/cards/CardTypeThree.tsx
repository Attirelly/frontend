// // components/Card.tsx
// import Image from 'next/image';
// import { manrope } from '@/font';

// interface CardProps {
//   imageUrl: string;
//   discountText?: string;
//   title: string;
//   description?: string;
// }

// const CardTypeThree: React.FC<CardProps> = ({ imageUrl, discountText, title, description }) => {
//   return (
//     <div className={`${manrope.className} relative w-58 h-79 rounded-2xl overflow-hidden`}>
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
//       <div className="flex flex-col items-center justify-center absolute bottom-0 left-1/2 transform -translate-x-1/2 z-20 pb-7 text-white mx-auto">
//   <h3 className="text-[20px] whitespace-nowrap" style={{ fontWeight: 500 }}>
//     {title}
//   </h3>
//   <h2 className="text-[16px] whitespace-nowrap" style={{ fontWeight: 400 }}>
//     {description}
//   </h2>
// </div>
//     </div>
//   );
// };

// export default CardTypeThree;

// components/cards/CardTypeThree.tsx
import Image from 'next/image';
import { manrope } from '@/font';

interface CardProps {
  imageUrl: string;
  discountText?: string;
  title: string;
  description?: string;
}

const CardTypeThree: React.FC<CardProps> = ({ imageUrl, title, description }) => {
  return (
    // CHANGED: The container is now fluid with a portrait aspect ratio.
    <div className={`${manrope.className} relative w-full aspect-[3/4] rounded-2xl overflow-hidden group`}>
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
          // ADDED: An optimized sizes attribute for the new carousel layout.
          sizes="
            (max-width: 767px) 50vw,
            (max-width: 1023px) 33vw,
            20vw"
          priority
        />
      </div>

      {/* ADDED: A gradient overlay to ensure text is always readable. */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />

      {/* Text Content with responsive font sizes */}
      <div className="flex flex-col items-center justify-end text-center absolute inset-0 z-20 p-4 md:p-6 text-white">
        <h3 className="text-lg md:text-xl font-medium whitespace-nowrap" style={{ fontWeight: 500 }}>
          {title}
        </h3>
        <h2 className="text-sm md:text-base whitespace-nowrap" style={{ fontWeight: 400 }}>
          {description}
        </h2>
      </div>
    </div>
  );
};

export default CardTypeThree;