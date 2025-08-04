'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ProductCardType } from '@/types/ProductTypes';
import { manrope, roboto } from '@/font';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductCard({
  id,
  imageUrl,
  title,
  description,
  price,
  originalPrice,
  discountPercentage,
}: ProductCardType) {
  const [imageIndex, setImageIndex] = useState(0);

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
    <a
      href={`/product_detail/${id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full"
    >
      <div
        className="rounded-xl hover:shadow-lg transition-shadow duration-300 cursor-pointer bg-white p-2"
      >
        <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden group">
          <div
          //  onMouseEnter={handleNext} onMouseLeave={handlePrev}
           >
            <Image
              src={imageUrl[imageIndex]}
              alt={title}
              fill
              className="object-cover object-top transition-all duration-300"
            />
            
          </div>

          {imageUrl.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault(); // Prevent anchor navigation
                  e.stopPropagation(); // Prevent click bubbling
                  handlePrev();
                }}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white bg-black/60 hover:bg-black/80 rounded-full p-1 z-10 hidden group-hover:block"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
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

        <div className={`${manrope.className}`} style={{ fontWeight: 500 }}>
          <h3 className="text-sm text-black mt-2 mb-1">{title}</h3>
          <p className="text-xs text-[#333333] mb-2 truncate" style={{ fontWeight: 300 }}>
            {description? description.charAt(0).toUpperCase() + description.slice(1) : ''}
          </p>
          <div className="flex items-center gap-2 font-medium">
            <span className="text-sm text-black">₹{price.toLocaleString()}</span>
            {price !== originalPrice && (

<span className="line-through text-gray-400 text-[11px]">
              ₹{originalPrice.toLocaleString()}
            </span>
            )}
            {price !== originalPrice && (
<span className="text-green-600 text-[10px]">{discountPercentage}% OFF</span>
            )}
            
            
            
          </div>
        </div>
      </div>
    </a>
  );
}
