'use client';

import Image from 'next/image';
import { ProductCardType } from '@/types/ProductTypes';
import { roboto } from '@/font';

export default function ProductCard({
  imageUrl,
  title,
  description,
  price,
  originalPrice,
  discountPercentage,
}: ProductCardType) {
  return (
    <div className="w-[279px] rounded-xl hover:shadow-lg transition-shadow duration-300 cursor-pointer bg-white p-2">
      <div className="relative w-full h-[321px] rounded-xl overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <div className={`${roboto.className}`}
      style={{fontWeight:500}}>
        <h3 className="text-lg text-black mt-2 mb-1">
        {title}
      </h3>
      <p className="text-base mb-2 truncate"
      style={{fontWeight:300}}>{description}</p>
      <div className="flex items-center gap-2 text-[14px] font-medium">
        <span className="text-lg">₹{price.toLocaleString()}</span>
        <span className="line-through text-gray-400 text-[15px]">₹{originalPrice.toLocaleString()}</span>
        <span className="text-green-600">{discountPercentage}% OFF</span>
      </div>
      </div>
      
    </div>
  );
}
