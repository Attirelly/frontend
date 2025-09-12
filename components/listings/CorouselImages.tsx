'use client';

import React, { useState } from 'react';
import { CorouselImagesType } from '@/types/SellerTypes';
import { useSwipeable } from 'react-swipeable';
import clsx from 'clsx';

/**
 * @interface Props
 * @description Defines the props for the CarouselImages component.
 */
type Props = {
  /**
   * @description An array of media objects, where each object contains a `media_url` and `media_type` ('IMAGE' or 'VIDEO').
   */
  mediaUrls: CorouselImagesType[];
  /**
   * @description An optional boolean prop that adjusts the component's styling, such as adding padding, when it's used inside a dialog or modal.
   * @default false
   */
  isDialogMode?: boolean;
};

/**
 * A responsive and touch-enabled carousel component for displaying a series of images and videos.
 *
 * This component is designed to render media from an Instagram carousel post. It supports both
 * click/tap navigation through on-screen buttons and intuitive swipe gestures for a mobile-first
 * user experience, which also works with mouse dragging on desktop.
 *
 * ### Features
 * - **Swipe Gestures**: Integrated with `react-swipeable` to allow users to swipe left and right to navigate through media.
 * - **Responsive Controls**: Displays large, clear text buttons for navigation on desktop, while relying on swipe for mobile to maintain a clean UI.
 * - **Slide Indicators**: Renders a series of dots to indicate the total number of slides and the current position.
 * - **Mixed Media Support**: Correctly renders both `<img>` and `<video>` tags based on the `media_type` of the current slide.
 * - **Context-Aware Styling**: The `isDialogMode` prop allows for adaptive styling when the component is used in different contexts, such as a full-screen modal.
 *
 * @param {Props} props - The props for the component.
 * @returns {JSX.Element} A fully interactive media carousel.
 * @see {@link https://github.com/FormidableLabs/react-swipeable | react-swipeable Documentation}
 * @see {@link https://github.com/lukeed/clsx | clsx Documentation}
 * @see {@link https://react.dev/reference/react/useState | React useState Hook}
 */
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

        {/* Slide Indicator Dots */}
        {/* Only show indicators if there is more than one slide. */}
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
