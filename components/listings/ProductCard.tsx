'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ProductCardType } from '@/types/ProductTypes';
import { manrope } from '@/font';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * A responsive card component to display individual product information.
 *
 * This component renders a visual representation of a product, including its name, price,
 * and an image.Hover-activated image carousel with preloading capabilities. The entire card acts as a
 * single link to the product's detail page.
 *
 * ### Interactive Image Carousel
 * When a product has multiple images, a carousel is available. The navigation controls
 * for the carousel are hidden by default and appear when the user hovers over the image.
 *
 * ### Performance Optimizations
 * Several strategies are used to ensure fast load times and a smooth experience:
 * 1.  **Image Preloading**: A `useEffect` hook proactively preloads the next and previous images
 * in the carousel as soon as the user hovers over the card. This makes image transitions
 * feel instantaneous when the user clicks the navigation buttons.
 * 
 * 2.  **Responsive Images (`sizes` prop)**: The `next/image` component is configured with a `sizes`
 * prop, which instructs the browser to download the most appropriately sized image based on the
 * user's viewport. This prevents serving large desktop-sized images to mobile devices.
 * 
 * 3.  **Strategic Loading (`loading` prop)**: The first image of the card is loaded eagerly (`eager`)
 * to improve the Largest Contentful Paint (LCP) metric. Subsequent images in the carousel are
 * loaded lazily (`lazy`) to avoid unnecessary initial network requests.
 *
 * @param {ProductCardType} props - The product data to be displayed on the card.
 * @param {string} props.id - The unique identifier for the product, used for the link URL.
 * @param {string[]} props.imageUrl - An array of image URLs for the product.
 * @param {string} props.title - The main title or name of the product.
 * @param {string} props.description - A short description of the product.
 * @param {number} props.price - The current selling price of the product.
 * @param {number} props.originalPrice - The original price, used to show a discount.
 * @param {string} props.discountPercentage - The calculated discount percentage to display.
 * @returns {JSX.Element} A fully interactive and responsive product card.
 * @see {@link https://nextjs.org/docs/pages/api-reference/components/image | Next.js Image Component}
 * @see {@link https://react.dev/reference/react/useEffect | React useEffect Hook}
 * @see {@link https://lucide.dev/ | Lucide React Icons}
 */
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

   /**
   * This effect preloads the next and previous images in the carousel to ensure smooth transitions.
   * It runs when the user hovers over the image, creating a seamless experience by fetching
   * the images before they are requested by a click.
   */
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

  return (
    <a
      href={`/product_detail/${id}`}
      target="_blank"
      rel="noopener noreferrer"
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
           {/* Render carousel controls only if there is more than one image. */}
          {imageUrl && imageUrl.length > 1 && (
            <>
              {/* Prev Button with responsive padding and icon size */}
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
              {/* Next Button with responsive padding and icon size */}
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

        {/* Product Info with responsive text and margins */}
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
    </a>
  );
}