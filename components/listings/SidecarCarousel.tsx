"use client";

import React, { useState, TouchEvent } from "react";
import { MediaUrlType } from "@/types/SellerTypes";
import clsx from "clsx";
import { useSwipeable } from "react-swipeable";

/**
 * @interface Props
 * @description Defines the props for the SidecarCarousel component.
 */
type Props = {
  /**
   * @description An array of media objects from a scraped Instagram "Sidecar" (carousel) post.
   * Each object contains a `media_url` and a `type` ('Image' or 'Video').
   */
  mediaUrls: MediaUrlType[];
  /**
   * @description An optional boolean prop that adjusts the component's styling, such as adding padding, when it's used inside a dialog or modal.
   * @default false
   */
  isDialogMode?: boolean;
};

/**
 * A responsive and touch-enabled carousel component for displaying mixed media from a scraped Instagram post.
 *
 * This component is specifically designed to render the contents of an Instagram "Sidecar" post,
 * which can contain multiple images and videos. It supports navigation via both on-screen buttons
 * on desktop and intuitive swipe gestures on mobile and desktop.
 *
 * ### Features
 * - **Swipe Gestures**: Integrated with `react-swipeable` to allow users to swipe left and right to navigate through media. This also works with mouse dragging on desktop.
 * - **Responsive Controls**: Displays prominent "Previous" and "Next" buttons on desktop for easy navigation, which are hidden on mobile to prioritize the swipe experience.
 * - **Slide Indicators**: Renders a series of dots at the bottom to visually indicate the user's current position within the carousel.
 * - **Mixed Media Support**: Correctly renders both `<img>` and `<video>` tags based on the `type` of the current slide.
 *
 * @param {Props} props - The props for the component.
 * @returns {JSX.Element} A fully interactive media carousel.
 * @see {@link https://github.com/FormidableLabs/react-swipeable | react-swipeable Documentation}
 * @see {@link https://github.com/lukeed/clsx | clsx Documentation}
 * @see {@link https://react.dev/reference/react/useState | React useState Hook}
 */
export default function SidecarCarousel({
  mediaUrls,
  isDialogMode = false,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  // const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const currentMedia = mediaUrls[currentIndex];
  // --- Navigation Functions ---
  /**
   * Navigates to the next slide in the carousel.
   * Uses the functional form of setState to ensure the update is based on the latest state.
   */
  const next = () =>
    setCurrentIndex((prev) => (prev < mediaUrls.length - 1 ? prev + 1 : prev));
  const prev = () => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  /**
   * Sets up swipe event handlers using the `react-swipeable` library.
   */
  const handlers = useSwipeable({
    onSwipedLeft: () => next(),
    onSwipedRight: () => prev(),
    preventScrollOnSwipe: true, // Prevents vertical scrolling when swiping horizontally
    trackMouse: false, // Don't track mouse movements as swipes
  });

  return (
    <div
      className={clsx(
        "relative flex items-center justify-center w-full h-full",
        isDialogMode && "md:px-16"
      )}
      {...handlers}
    >
      {/* Conditionally render a video or image tag based on the media type. */}
      {currentMedia.type === "Video" ? (
        <video
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
          // The image URL is passed through a proxy for optimization and to handle potential CORS issues.

          src={`https://image-proxy.ranarahul16-rr.workers.dev/?url=${encodeURIComponent(
            currentMedia.media_url
          )}`}
          alt="Instagram post media"
          className="max-w-full max-h-full object-contain"
        />
      )}

      {/* ✅ Container for Bottom Controls (Buttons and Indicators) */}
      <div className="flex absolute bottom-4 left-1/2 -translate-x-1/2 w-full  flex-col items-center gap-2 z-10">
        {/* ✅ Next/Prev Text Buttons */}
        <div className="hidden md:flex justify-between w-full max-w-xs px-4">
          {/* Previous Button */}
          <button
            onClick={prev}
            className={clsx(
              "text-black px-2 py-1 rounded-md  bg-white text-sm font-semibold opacity-80 hover:opacity-100 transition",
              currentIndex === 0 && "opacity-30 pointer-events-none" // Hide if it's the first slide
            )}
          >
            Previous
          </button>

          {/* Next Button */}
          <button
            onClick={next}
            className={clsx(
              "text-black px-2 py-1 rounded-md  bg-white text-sm font-semibold opacity-80 hover:opacity-100 transition",
              currentIndex === mediaUrls.length - 1 &&
                "opacity-30 pointer-events-none" // Hide if it's the last slide
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
                currentIndex === index ? "bg-black" : "bg-white"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
