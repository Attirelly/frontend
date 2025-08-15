'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ProductCardType } from '@/types/ProductTypes';
import { manrope } from '@/font';
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
  const [isHovered, setIsHovered] = useState(false);

  // ✅ Preload all product images immediately on mount
  // useEffect(() => {
  //   if (!imageUrl || imageUrl.length === 0) return;
  //   imageUrl.forEach((url) => {
  //     const img = new window.Image();
  //     img.src = url;
  //   });
  // }, [imageUrl]);

  useEffect(() => {
    if (!isHovered || imageUrl.length <= 1) return;

    const nextIndex = (imageIndex + 1) % imageUrl.length;
    const prevIndex = (imageIndex - 1 + imageUrl.length) % imageUrl.length;

    [nextIndex, prevIndex].forEach(idx => {
      // if (!loadedImages[idx]) {
        const img = new window.Image();
        img.src = imageUrl[idx];
      // }
    });
  }, [isHovered, imageIndex, imageUrl]);

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
      <div className="rounded-xl hover:shadow-lg transition-shadow duration-300 cursor-pointer bg-white p-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
        
        {/* Product Image Carousel */}
        <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden group">
          <Image
            src={imageUrl[imageIndex]}
            alt={title}
            fill
            // unoptimized 
            // priority={imageIndex === 0} 
            loading={imageIndex === 0 ? 'eager' : 'lazy'} 
            className="object-cover object-top transition-all duration-300"
          />

          {imageUrl.length > 1 && (
            <>
              {/* Prev Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white bg-black/60 hover:bg-black/80 rounded-full p-1 z-10 hidden group-hover:block cursor-pointer"
              >
                <ChevronLeft size={20} />
              </button>

              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-black/60 hover:bg-black/80 rounded-full p-1 z-10 hidden group-hover:block cursor-pointer"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>

        {/* Product Info */}
        <div className={`${manrope.className}`} style={{ fontWeight: 500 }}>
          <h3 className="text-sm text-black mt-2 mb-1">{title}</h3>
          <p
            className="text-xs text-[#333333] mb-2 truncate"
            style={{ fontWeight: 300 }}
          >
            {description
              ? description.charAt(0).toUpperCase() + description.slice(1)
              : ''}
          </p>
          <div className="flex items-center gap-2 font-medium">
            <span className="text-sm text-black">₹{price.toLocaleString()}</span>
            {price !== originalPrice && (
              <span className="line-through text-gray-400 text-[11px]">
                ₹{originalPrice.toLocaleString()}
              </span>
            )}
            {price !== originalPrice && (
              <span className="text-green-600 text-[10px]">
                {discountPercentage}% OFF
              </span>
            )}
          </div>
        </div>
      </div>
    </a>
  );
}
