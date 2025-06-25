'use client';

import Image from 'next/image';

import { ProductCardType } from '@/types/ProductTypes';


export default function ProductCard({
  imageUrl,
  title,
  description,
  price,
  originalPrice,
  discountPercentage,
}: ProductCardType) {
  return (
    <div className="rounded-xl hover:shadow-lg transition-shadow duration-300 cursor-pointer bg-white p-2">
      {/* <div className="rounded-xl"> */}
        <Image
          src={imageUrl}
          alt={title}
          width={279}
          height={321}
          className="object-cover rounded-xl"
        />
      {/* </div> */}
      {/* <div className="p-4"> */}
        <h3 className="text-[16px] font-semibold text-black mb-1">{title}</h3>
        <p className="text-sm text-gray-600 mb-2 truncate">{description}</p>
        <div className="flex items-center gap-2 text-[14px] font-medium">
          <span className="text-black">₹{price.toLocaleString()}</span>
          <span className="line-through text-gray-400">₹{originalPrice.toLocaleString()}</span>
          <span className="text-green-600">{discountPercentage}% OFF</span>
        </div>
      </div>
    // </div>
  );
}