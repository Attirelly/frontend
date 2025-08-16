// components/Card.tsx
import Image from 'next/image';
import { manrope } from '@/font';

interface CardProps {
  imageUrl: string;
  title: string;
  description?: string;
}

const CardTypeSix: React.FC<CardProps> = ({ imageUrl, title, description }) => {
  return (
    <div className={`${manrope.className} relative w-[293px] h-[333px] rounded-2xl overflow-hidden`}>
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
  <h3 className="text-base whitespace-nowrap" style={{ fontWeight: 500 }}>
    {title}
  </h3>
  <h2 className="text-xs whitespace-nowrap" style={{ fontWeight: 400 }}>
    {description}
  </h2>
  <button className='w-[100px] h-[32px] text-sm bg-white text-black mt-4' style={{fontWeight:500}}>
     SHOP NOW
  </button>
</div>
    </div>
  );
};

export default CardTypeSix;
