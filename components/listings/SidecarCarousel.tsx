// // 'use client';

// // import React, { useState } from 'react';
// // import { ChevronLeft, ChevronRight } from 'lucide-react';
// // import { MediaUrlType } from '@/types/SellerTypes';

// // type Props = {
// //   mediaUrls: MediaUrlType[];
// // };

// // export default function SidecarCarousel({ mediaUrls }: Props) {
// //   const [currentIndex, setCurrentIndex] = useState(0);
// //   const currentMedia = mediaUrls[currentIndex];

// //   const next = () => {
// //     if (currentIndex < mediaUrls.length - 1) setCurrentIndex(currentIndex + 1);
// //   };

// //   const prev = () => {
// //     if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
// //   };

// //   return (
// //     <div className="relative flex items-center justify-center w-full h-full">
// //       {currentMedia.type === 'Video' ? (
// //         <video
// //           src={currentMedia.media_url}
// //           controls
// //           autoPlay
// //           muted
// //           className="max-w-full max-h-full object-contain"
// //         />
// //       ) : (
// //         <img
// //           // src={currentMedia.media_url}
// //           src={`https://image-proxy.ranarahul16-rr.workers.dev/?url=${encodeURIComponent(currentMedia.media_url)}`}
// //           alt="Instagram post media"
// //           className="max-w-full max-h-full object-contain"
// //         />
// //       )}

// //       {currentIndex > 0 && (
// //         <button
// //           onClick={prev}
// //           className="absolute top-1/2 -translate-y-1/2 text-white bg-black/60 p-1 rounded-full"
// //         >
// //           <ChevronLeft size={22} />
// //         </button>
// //       )}
// //       {currentIndex < mediaUrls.length - 1 && (
// //         <button
// //           onClick={next}
// //           className="absolute top-1/2 -translate-y-1/2 text-white bg-black/60 p-1 rounded-full"
// //         >
// //           <ChevronRight size={22} />
// //         </button>
// //       )}
// //     </div>
// //   );
// // }

// 'use client';

// import React, { useState, TouchEvent } from 'react';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
// import { MediaUrlType } from '@/types/SellerTypes';
// import clsx from 'clsx';

// type Props = {
//   mediaUrls: MediaUrlType[];
// };

// export default function SidecarCarousel({ mediaUrls }: Props) {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   // ✅ State for handling swipe gestures
//   const [touchStartX, setTouchStartX] = useState<number | null>(null);
  
//   const currentMedia = mediaUrls[currentIndex];

//   const next = () => {
//     setCurrentIndex((prev) => (prev < mediaUrls.length - 1 ? prev + 1 : prev));
//   };

//   const prev = () => {
//     setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
//   };

//   // ✅ Handlers for swipe gestures
//   const handleTouchStart = (e: TouchEvent) => {
//     setTouchStartX(e.targetTouches[0].clientX);
//   };

//   const handleTouchEnd = (e: TouchEvent) => {
//     if (touchStartX === null) return;
//     const touchEndX = e.changedTouches[0].clientX;
//     const diff = touchEndX - touchStartX;
//     const SWIPE_THRESHOLD = 50; // Min pixels for a swipe

//     if (diff > SWIPE_THRESHOLD) {
//       prev(); // Swiped right
//     } else if (diff < -SWIPE_THRESHOLD) {
//       next(); // Swiped left
//     }
//     setTouchStartX(null);
//   };

//   return (
//     <div
//       className="relative flex items-center justify-center w-full h-full px-16"
//       // ✅ Added touch event listeners
//       onTouchStart={handleTouchStart}
//       onTouchEnd={handleTouchEnd}
//     >
//       {currentMedia.type === 'Video' ? (
//         <video
//           src={currentMedia.media_url}
//           controls
//           autoPlay
//           muted
//           className="max-w-full max-h-full object-contain"
//         />
//       ) : (
//         <img
//           src={`https://image-proxy.ranarahul16-rr.workers.dev/?url=${encodeURIComponent(currentMedia.media_url)}`}
//           alt="Instagram post media"
//           className="max-w-full max-h-full object-contain"
//         />
//       )}

//       {/* Navigation Arrows (for desktop) */}
//       {currentIndex > 0 && (
//         <button
//           onClick={prev}
//           className="absolute left-10 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/60 p-1 rounded-full z-10 hidden md:block"
//           aria-label="Previous"
//         >
//           <ChevronLeft size={24} />
//         </button>
//       )}
//       {currentIndex < mediaUrls.length - 1 && (
//         <button
//           onClick={next}
//           className="absolute right-10 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/60 p-1 rounded-full z-10 hidden md:block"
//           aria-label="Next"
//         >
//           <ChevronRight size={24} />
//         </button>
//       )}

//       {/* ✅ Slide Indicators */}
//       <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
//         {mediaUrls.map((_, index) => (
//           <div
//             key={index}
//             className={clsx(
//               "h-2 w-2 rounded-full transition-all duration-300",
//               currentIndex === index ? "bg-white" : "bg-white/50"
//             )}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }


'use client';

import React, { useState, TouchEvent } from 'react';
import { MediaUrlType } from '@/types/SellerTypes';
import clsx from 'clsx';

type Props = {
  mediaUrls: MediaUrlType[];
  isDialogMode?: boolean;
};

export default function SidecarCarousel({ mediaUrls, isDialogMode = false }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  
  const currentMedia = mediaUrls[currentIndex];

  const next = () => setCurrentIndex((prev) => (prev < mediaUrls.length - 1 ? prev + 1 : prev));
  const prev = () => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));

  const handleTouchStart = (e: TouchEvent) => setTouchStartX(e.targetTouches[0].clientX);
  const handleTouchEnd = (e: TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX;
    if (diff > 50) prev();
    else if (diff < -50) next();
    setTouchStartX(null);
  };

  return (
    <div
      className={clsx(
        "relative flex items-center justify-center w-full h-full",
        isDialogMode && "md:px-16"
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {currentMedia.type === 'Video' ? (
        <video
          src={currentMedia.media_url}
          controls autoPlay muted
          className="max-w-full max-h-full object-contain"
        />
      ) : (
        <img
          src={`https://image-proxy.ranarahul16-rr.workers.dev/?url=${encodeURIComponent(currentMedia.media_url)}`}
          alt="Instagram post media"
          className="max-w-full max-h-full object-contain"
        />
      )}

      {/* ✅ Container for Bottom Controls (Buttons and Indicators) */}
      <div className="hidden md:flex absolute bottom-4 left-1/2 -translate-x-1/2 w-full  flex-col items-center gap-2 z-10">
        
        {/* ✅ Next/Prev Text Buttons */}
        <div className="flex justify-between w-full max-w-xs px-4">
          {/* Previous Button */}
          <button 
            onClick={prev}
            className={clsx(
              "text-white text-sm font-semibold opacity-80 hover:opacity-100 transition",
              currentIndex === 0 && "opacity-30 pointer-events-none" // Hide if it's the first slide
            )}
          >
            Previous
          </button>

          {/* Next Button */}
          <button 
            onClick={next}
            className={clsx(
              "text-white text-sm font-semibold opacity-80 hover:opacity-100 transition",
              currentIndex === mediaUrls.length - 1 && "opacity-30 pointer-events-none" // Hide if it's the last slide
            )}
          >
            Next
          </button>
        </div>

        {/* Slide Indicators */}
        <div className="flex gap-1.5">
          {mediaUrls.map((_, index) => (
            <div
              key={index}
              className={clsx(
                "h-2 w-2 rounded-full transition-all duration-300",
                currentIndex === index ? "bg-white" : "bg-white/50"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}