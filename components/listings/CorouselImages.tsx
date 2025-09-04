// 'use client';

// import React, { useState } from 'react';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
// import { CorouselImagesType} from '@/types/SellerTypes';

// type Props = {
//   mediaUrls: CorouselImagesType[];
// };

// export default function CarouselImages({ mediaUrls }: Props) {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const currentMedia = mediaUrls[currentIndex];

//   const next = () => {
//     if (currentIndex < mediaUrls.length - 1) setCurrentIndex(currentIndex + 1);
//   };

//   const prev = () => {
//     if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
//   };

//   return (
//     <div className="relative flex items-center justify-center w-full h-full">
//       {currentMedia.media_type === 'VIDEO' ? (
//         <video
//           src={currentMedia.media_url}
//           controls
//             autoPlay
//             muted
//             controlsList="nodownload noplaybackrate noremoteplayback"
//             disablePictureInPicture
//           className="max-w-full max-h-full object-contain"
//         />
//       ) : (
//         <img
//           // src={currentMedia.media_url}
//           src={currentMedia.media_url}
//           alt="Instagram post media"
//           className="max-w-full max-h-full object-contain"
//         />
//       )}

//       {currentIndex > 0 && (
//         <button
//           onClick={prev}
//           className="absolute left-2 top-1/2 -translate-y-1/2 text-white bg-black/60 p-1 rounded-full"
//         >
//           <ChevronLeft size={22} />
//         </button>
//       )}
//       {currentIndex < mediaUrls.length - 1 && (
//         <button
//           onClick={next}
//           className="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-black/60 p-1 rounded-full"
//         >
//           <ChevronRight size={22} />
//         </button>
//       )}
//     </div>
//   );
// }

'use client';

import React, { useState } from 'react';
import { CorouselImagesType } from '@/types/SellerTypes';
import { useSwipeable } from 'react-swipeable';
import clsx from 'clsx';

type Props = {
  mediaUrls: CorouselImagesType[];
  isDialogMode?: boolean; // Optional prop to add padding in dialog view
};

export default function CarouselImages({ mediaUrls, isDialogMode = false }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentMedia = mediaUrls[currentIndex];

  // More robust state updates using functional form
  const next = () => {
    setCurrentIndex((prev) => (prev < mediaUrls.length - 1 ? prev + 1 : prev));
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  // Handlers for swipe gestures using react-swipeable
  const handlers = useSwipeable({
    onSwipedLeft: () => next(),
    onSwipedRight: () => prev(),
    preventScrollOnSwipe: true,
    trackMouse: true, // Allows mouse dragging on desktop
  });

  return (
    <div
      className={clsx(
        'relative flex items-center justify-center w-full h-full',
        isDialogMode && 'md:px-16' // Adds horizontal padding on desktop if in a dialog
      )}
      {...handlers} // Spread the swipe handlers onto the main container
    >
      {currentMedia.media_type === 'VIDEO' ? (
        <video
          key={currentMedia.media_url} // Add key to force re-render on source change
          src={currentMedia.media_url}
          controls
          autoPlay
          muted
          controlsList="nodownload noplaybackrate noremoteplayback"
          disablePictureInPicture
          className="max-w-full max-h-full object-contain"
        />
      ) : (
        <img
          src={currentMedia.media_url}
          alt="Instagram post media"
          className="max-w-full max-h-full object-contain"
        />
      )}

      {/* Container for Bottom Controls (Buttons and Indicators) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex w-full flex-col items-center gap-3 z-10">
        
        {/* Next/Prev Text Buttons for Desktop */}
        <div className="hidden md:flex justify-between w-full max-w-xs px-4">
          <button
            onClick={prev}
            className={clsx(
              'text-black px-3 py-1 rounded-md bg-white text-sm font-semibold opacity-80 hover:opacity-100 transition',
              currentIndex === 0 && 'opacity-30 pointer-events-none'
            )}
            aria-label="Previous"
          >
            Previous
          </button>
          <button
            onClick={next}
            className={clsx(
              'text-black px-3 py-1 rounded-md bg-white text-sm font-semibold opacity-80 hover:opacity-100 transition',
              currentIndex === mediaUrls.length - 1 && 'opacity-30 pointer-events-none'
            )}
            aria-label="Next"
          >
            Next
          </button>
        </div>

        {/* Slide Indicators */}
        {mediaUrls.length > 1 && (
            <div className="flex gap-1.5">
                {mediaUrls.map((_, index) => (
                    <div
                    key={index}
                    className={clsx(
                        'h-2 w-2 rounded-full transition-all duration-300',
                        currentIndex === index ? "bg-black" : "bg-white"
                    )}
                    />
                ))}
            </div>
        )}
      </div>
    </div>
  );
}
