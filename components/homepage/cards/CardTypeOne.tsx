// components/Card.tsx
import Image from 'next/image';
import { manrope } from '@/font';

interface CardProps {
  imageUrl: string;
  discountText?: string;
  title: string;
  description?: string;
}

const Card: React.FC<CardProps> = ({ imageUrl, discountText, title, description }) => {
  return (
    <div className={`${manrope.className} relative w-[392px] h-full rounded-xl overflow-hidden shadow-lg`}>
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-transparent z-10" />

      {/* Discount Badge */}
      {/* <div className="absolute top-0 right-0 z-20 bg-black text-white text-sm font-semibold px-3 py-1 rounded-bl-xl shadow-md">
        Sale : {discountText} %
      </div> */}

      {/* Text Content */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-20 text-center  pb-4 text-white">
        <h3 className="text-2xl" style={{fontWeight:500}}>{title}</h3>
        <h4 className='text-base' style={{fontWeight:400}}>{description}</h4>
      </div>
    </div>
  );
};

export default Card;
