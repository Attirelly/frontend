// components/Card.tsx
import Image from 'next/image';
import { manrope } from '@/font';

interface CardProps {
  imageUrl: string;
  title: string;
  description?: string;
  screenSize?: string;
}

const CardTypeFour: React.FC<CardProps> = ({ imageUrl, title, description, screenSize='sm' }) => {
  return (
    <div className={`${manrope.className} relative 
                  ${screenSize === 'sm' ? 'w-[170px] h-[170px]' : ''}
                  ${screenSize === 'md' ? 'w-[140px] h-[140px]' : ''}
                  ${screenSize === 'lg' ? 'w-[175px] h-[175px]' : ''}
                  ${screenSize === 'xl' ? 'w-[200px] h-[200px]' : ''}
     overflow-hidden rounded-sm`}>
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
      <div className="absolute inset-0 bg-transparent z-10" />

      {/* Discount Badge */}
      {/* <div className="absolute top-0 right-0 z-20 bg-black text-white text-sm font-semibold px-3 py-1 rounded-bl-xl shadow-md">
        Sale : {discountText} %
      </div> */}

      {/* Text Content */}
      <div className="flex flex-col items-center justify-center absolute bottom-0 left-1/2 transform -translate-x-1/2 z-20 mb-4 text-white mx-auto">
  <h3 className={`${screenSize === 'sm' ? 'text-[14px]' : ''}
                  ${screenSize === 'md' ? 'text-[16px]' : ''}
                  ${screenSize === 'lg' ? 'text-[18px]' : ''}
                  ${screenSize === 'xl' ? 'text-[20px]' : ''}
                  whitespace-nowrap text-white`} 
                  style={{ fontWeight: 400 }}>
    {title}
  </h3>
  <h2 className={`${screenSize === 'sm' ? 'text-[9px]' : ''}
                  ${screenSize === 'md' ? 'text-[11px]' : ''}
                  ${screenSize === 'lg' ? 'text-[13px]' : ''}
                  ${screenSize === 'xl' ? 'text-[16px]' : ''}
                  whitespace-nowrap text-white`} 
                  style={{ fontWeight: 400 }}>
    {description}
  </h2>
</div>
    </div>
  );
};

export default CardTypeFour;
