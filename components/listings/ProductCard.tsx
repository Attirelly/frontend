'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ProductCardType } from '@/types/ProductTypes';
import { manrope } from '@/font';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { sendClickEvent } from '@/lib/algoliaInsights';


// 2. Update the props to accept queryID and position
interface ProductCardProps extends ProductCardType {
  queryID?: string | null;
  position?: number;
}

export default function ProductCard({
  id,
  imageUrl,
  title,
  description,
  price,
  originalPrice,
  discountPercentage,
  queryID, // <-- New prop
  position, // <-- New prop
}: ProductCardProps) {
  const [imageIndex, setImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered || !imageUrl || imageUrl.length <= 1) return;

    const nextIndex = (imageIndex + 1) % imageUrl.length;
    const prevIndex = (imageIndex - 1 + imageUrl.length) % imageUrl.length;

    [nextIndex, prevIndex].forEach((idx) => {
      const img = new window.Image();
      img.src = imageUrl[idx];
    });
  }, [isHovered, imageIndex, imageUrl]);

  const handleNext = () => {
    if (!imageUrl) return;
    setImageIndex((prevIndex) => (prevIndex + 1) % imageUrl.length);
  };

  const handlePrev = () => {
    if (!imageUrl) return;
    setImageIndex(
      (prevIndex) => (prevIndex - 1 + imageUrl.length) % imageUrl.length
    );
  };

  // 3. Create the main click handler function
  const handleClick = () => {
    // Send the Algolia event if a queryID exists
    if (queryID) {
      sendClickEvent(
        id,
        queryID,
        "products", 
        position??0
      );
    }
    // Handle navigation (opens in a new tab)
    window.open(`/product_detail/${id}?queryId=${queryID}`, '_blank', 'noopener,noreferrer');
  };

  return (
    // 4. Replace <a> tag with a div and attach the handleClick function
    <div
      onClick={handleClick}
      className="block w-full"
    >
      {/* Card container with responsive padding */}
      <div className="rounded-xl hover:shadow-lg transition-shadow duration-300 cursor-pointer bg-white p-2 md:p-3 lg:p-4 w-full">
        {/* Product Image Carousel */}
        <div
          className="relative w-full aspect-[3/4] rounded-xl overflow-hidden group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {imageUrl && imageUrl.length > 0 ? (
            <Image
              src={imageUrl[imageIndex]}
              alt={title}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              loading={imageIndex === 0 ? 'eager' : 'lazy'}
              className="object-cover object-top transition-all duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-sm">No Image</span>
            </div>
          )}
          {imageUrl && imageUrl.length > 1 && (
            <>
              {/* Prev Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white bg-black/60 hover:bg-black/80 rounded-full p-1 md:p-1.5 z-10 block lg:hidden lg:group-hover:block cursor-pointer"
              >
                <ChevronLeft className="h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5" />
              </button>
              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-black/60 hover:bg-black/80 rounded-full p-1 md:p-1.5 z-10 block lg:hidden lg:group-hover:block cursor-pointer"
              >
                <ChevronRight className="h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5" />
              </button>
            </>
          )}
        </div>

        {/* Product Info */}
        <div className={`${manrope.className} pt-2 md:pt-3`} style={{ fontWeight: 500 }}>
          <h3 className="text-sm md:text-base lg:text-lg text-black mb-1 truncate">
            {title}
          </h3>
          <p
            className="text-xs md:text-sm lg:text-base text-[#333333] mb-1.5 md:mb-2 truncate"
            style={{ fontWeight: 300 }}
          >
            {description
              ? description.charAt(0).toUpperCase() + description.slice(1)
              : ''}
          </p>
          <div className="flex items-center gap-1.5 md:gap-2 font-medium flex-wrap">
            <span className="text-sm md:text-base lg:text-lg text-black">
              ₹{price?.toLocaleString()}
            </span>
            {price !== originalPrice && (
              <span className="line-through text-gray-400 text-[11px] md:text-xs lg:text-sm">
                ₹{originalPrice?.toLocaleString()}
              </span>
            )}
            {price !== originalPrice && (
              <span className="text-green-600 text-[10px] md:text-xs lg:text-sm">
                {discountPercentage}% OFF
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}