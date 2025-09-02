// 'use client';

// import Image from 'next/image';
// import { useEffect, useState } from 'react';
// import { ProductCardType } from '@/types/ProductTypes';
// import { manrope } from '@/font';
// import { ChevronLeft, ChevronRight } from 'lucide-react';

// export default function ProductCard({
//   id,
//   imageUrl,
//   title,
//   description,
//   price,
//   originalPrice,
//   discountPercentage,
// }: ProductCardType) {
//   const [imageIndex, setImageIndex] = useState(0);
//   const [isHovered, setIsHovered] = useState(false);

//   // ✅ Preload all product images immediately on mount
//   // useEffect(() => {
//   //   if (!imageUrl || imageUrl.length === 0) return;
//   //   imageUrl.forEach((url) => {
//   //     const img = new window.Image();
//   //     img.src = url;
//   //   });
//   // }, [imageUrl]);

//   useEffect(() => {
//     if (!isHovered || imageUrl.length <= 1) return;

//     const nextIndex = (imageIndex + 1) % imageUrl.length;
//     const prevIndex = (imageIndex - 1 + imageUrl.length) % imageUrl.length;

//     [nextIndex, prevIndex].forEach(idx => {
//       // if (!loadedImages[idx]) {
//         const img = new window.Image();
//         img.src = imageUrl[idx];
//       // }
//     });
//   }, [isHovered, imageIndex, imageUrl]);

//   const handleNext = () => {
//     setImageIndex((prevIndex) =>
//       prevIndex < imageUrl.length - 1 ? prevIndex + 1 : 0
//     );
//   };

//   const handlePrev = () => {
//     setImageIndex((prevIndex) =>
//       prevIndex > 0 ? prevIndex - 1 : imageUrl.length - 1
//     );
//   };

//   return (
//     <a
//       href={`/product_detail/${id}`}
//       target="_blank"
//       rel="noopener noreferrer"
//       className="block w-full"
//     >
//       <div className="rounded-xl hover:shadow-lg transition-shadow duration-300 cursor-pointer bg-white p-2">
        
//         {/* Product Image Carousel */}
//         <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden group"
//         onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}>
//           <Image
//             src={imageUrl[imageIndex]}
//             alt={title}
//             fill
//             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 300px"
//             loading={imageIndex === 0 ? 'eager' : 'lazy'} 
//             className="object-cover object-top transition-all duration-300"
//           />

//           {imageUrl.length > 1 && (
//             <>
//               {/* Prev Button */}
//               <button
//                 onClick={(e) => {
//                   e.preventDefault();
//                   e.stopPropagation();
//                   handlePrev();
//                 }}
//                 className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white bg-black/60 hover:bg-black/80 rounded-full p-1 z-10 hidden group-hover:block cursor-pointer"
//               >
//                 <ChevronLeft size={20} />
//               </button>

//               {/* Next Button */}
//               <button
//                 onClick={(e) => {
//                   e.preventDefault();
//                   e.stopPropagation();
//                   handleNext();
//                 }}
//                 className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-black/60 hover:bg-black/80 rounded-full p-1 z-10 hidden group-hover:block cursor-pointer"
//               >
//                 <ChevronRight size={20} />
//               </button>
//             </>
//           )}
//         </div>

//         {/* Product Info */}
//         <div className={`${manrope.className}`} style={{ fontWeight: 500 }}>
//           <h3 className="text-sm text-black mt-2 mb-1 truncate">{title}</h3>
//           <p
//             className="text-xs text-[#333333] mb-2 truncate"
//             style={{ fontWeight: 300 }}
//           >
//             {description
//               ? description.charAt(0).toUpperCase() + description.slice(1)
//               : ''}
//           </p>
//           <div className="flex items-center gap-2 font-medium">
//             <span className="text-sm text-black">₹{price?.toLocaleString()}</span>
//             {price !== originalPrice && (
//               <span className="line-through text-gray-400 text-[11px]">
//                 ₹{originalPrice.toLocaleString()}
//               </span>
//             )}
//             {price !== originalPrice && (
//               <span className="text-green-600 text-[10px]">
//                 {discountPercentage}% OFF
//               </span>
//             )}
//           </div>
//         </div>
//       </div>
//     </a>
//   );
// }

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