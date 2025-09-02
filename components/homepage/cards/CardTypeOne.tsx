// // components/Card.tsx
// import Image from 'next/image';
// import { manrope } from '@/font';

// interface CardProps {
//   imageUrl: string;
//   discountText?: string;
//   title: string;
//   description?: string;
//   screenSize?:string;
// }

// const Card: React.FC<CardProps> = ({ imageUrl, discountText, title, description, screenSize='sm' }) => {
//   return (
//     <div className={`${manrope.className} relative
//      ${screenSize === 'sm' ? 'w-[350px]' : ''}
//       ${screenSize === 'md' ? 'w-[210px]' : ''}
//       ${screenSize === 'lg' ? 'w-[250px]' : ''}
//       ${screenSize === 'xl' ? 'w-[293px]' : ''}
//       h-full rounded-xl overflow-hidden shadow-lg`}>
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
//       <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-20 text-center  pb-4 text-white w-full">
//         <h3 className="text-[20px]" style={{fontWeight:500}}>{title}</h3>
//         <h4 className='text-base' style={{fontWeight:400}}>{description}</h4>
//       </div>
//     </div>
//   );
// };

// export default Card;

// components/cards/CardTypeOne.tsx
import Image from 'next/image';
import { manrope } from '@/font';

interface CardProps {
  imageUrl: string;
  title: string;
  description?: string;
}

// REMOVED: screenSize prop is no longer needed
const CardTypeOne: React.FC<CardProps> = ({ imageUrl, title, description }) => {
  return (
    // CHANGED: The container is now fluid, filling its parent
    <div className={`${manrope.className} relative w-full h-full rounded-xl overflow-hidden shadow-lg`}>
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover object-center"
          // ADDED: A sizes attribute to optimize image loading
          sizes="(max-width: 768px) 80vw, 400px"
          priority
        />
      </div>

      {/* ADDED: Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />

      {/* Text Content with responsive typography */}
      <div className="absolute bottom-0 left-0 right-0 z-20 text-center p-4 md:p-6 text-white">
        <h3 className="text-lg md:text-xl font-medium" style={{ fontWeight: 500 }}>{title}</h3>
        <h4 className='text-sm md:text-base' style={{ fontWeight: 400 }}>{description}</h4>
      </div>
    </div>
  );
};

export default CardTypeOne;