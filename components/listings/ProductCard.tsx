'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ProductCardType } from '@/types/ProductTypes';
import { roboto } from '@/font';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductCard({
  imageUrl,
  title,
  description,
  price,
  originalPrice,
  discountPercentage,
}: ProductCardType) {
  const [imageIndex, setImageIndex] = useState(0);

  // useEffect(() => {
  //   const nextIndex = (imageIndex + 1) % imageUrl.length;
  //   const img = new window.Image();
  //   img.src = imageUrl[nextIndex];
  // }, [imageIndex]);

  useEffect(() => {
    imageUrl.forEach((url) => {
      const img = new window.Image();
      img.src = url;
    });
  }, []);

  const handleNext = () => {
    setImageIndex((prevIndex) =>
      prevIndex < imageUrl.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handlePrev = () => {
    setImageIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : imageUrl.length - 1
    );
  };

  return (
    <div className="w-[279px] rounded-xl hover:shadow-lg transition-shadow duration-300 cursor-pointer bg-white p-2">
      <div className="relative w-full h-[321px] rounded-xl overflow-hidden group">
        <Image
          src={imageUrl[imageIndex]}
          alt={title}
          fill
          className="object-cover transition-all duration-300"
        />

        {/* Navigation Buttons */}
        {imageUrl.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white bg-black/60 hover:bg-black/80 rounded-full p-1 z-10 hidden group-hover:block"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-black/60 hover:bg-black/80 rounded-full p-1 z-10 hidden group-hover:block"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      <div className={`${roboto.className}`} style={{ fontWeight: 500 }}>
        <h3 className="text-lg text-black mt-2 mb-1">{title}</h3>
        <p className="text-base mb-2 truncate" style={{ fontWeight: 300 }}>
          {description}
        </p>
        <div className="flex items-center gap-2 text-[14px] font-medium">
          <span className="text-lg">₹{price.toLocaleString()}</span>
          <span className="line-through text-gray-400 text-[15px]">
            ₹{originalPrice.toLocaleString()}
          </span>
          <span className="text-green-600">{discountPercentage}% OFF</span>
        </div>
      </div>
    </div>
  );
}
