
"use client";

import React, { useEffect, useRef } from "react";
import { instaMediaType } from "@/types/SellerTypes";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useHeaderStore } from "@/store/listing_header_store";
import { manrope } from "@/font";
import CorouselImages from "./CorouselImages";
import clsx from "clsx";
/**
 * @interface Props
 * @description Defines the props for the PostDialogue component.
 */
type Props = {
  /**
   * @description A boolean that controls the visibility of the dialog.
   */
  isOpen: boolean;
  /**
   * @description The Instagram post data object to be displayed.
   */
  post: instaMediaType;
  /**
   * @description A callback function to be invoked when the dialog should be closed (e.g., by clicking the close button or outside the dialog).
   */
  onClose: () => void;
  /**
   * @description A callback function to navigate to the next post in the sequence.
   */
  onNext: () => void;
  /**
   * @description A callback function to navigate to the previous post in the sequence.
   */
  onPrev: () => void;
  /**
   * @description A boolean indicating if the current post is the first in the list, used to hide the 'previous' button.
   */
  isFirst: boolean;
  /**
   * @description A boolean indicating if the current post is the last in the list, used to hide the 'next' button.
   */
  isLast: boolean;
};

/**
 * A modal dialog component for displaying a detailed view of a single Instagram post.
 *
 * This component is designed to be a fully controlled, responsive modal. It takes all its data
 * and state via props and communicates user actions (like closing or navigating) back to the
 * parent component through callbacks. It can render different media types, including single images,
 * videos, and carousels.
 *
 * ### Features
 * - **Controlled Component**: Its visibility (`isOpen`) and content (`post`) are managed by the parent.
 * - **Responsive Design**: Adapts its layout from a stacked vertical view on mobile to a side-by-side view on desktop.
 * - **Click Outside to Close**: The dialog can be dismissed by clicking on the backdrop, a common and intuitive UX pattern.
 * - **Media Handling**: Conditionally renders the correct media viewer (`<img>`, `<video>`, or the `CorouselImages` component) based on the `post.media_type`.
 * - **Post Navigation**: Displays "next" and "previous" buttons, allowing the user to browse through a sequence of posts without closing the dialog.
 *
 * @param {Props} props - The props for the component.
 * @returns {JSX.Element | null} The rendered dialog modal, or `null` if `isOpen` is false.
 * @see {@link CorouselImages}
 * @see {@link https://react.dev/reference/react/useEffect | React useEffect Hook}
 * @see {@link https://lucide.dev/ | Lucide React Icons}
 */
export default function PostDialogue({
  isOpen,
  post,
  onClose,
  onNext,
  onPrev,
  isFirst,
  isLast,
}: Props) {
  const { storeName } = useHeaderStore();
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    // Backdrop with padding for mobile
    <div className="fixed inset-0 z-50 bg-neutral-900/80 flex justify-center items-center p-4">
      {/* Main dialog container: responsive width, height, and flex direction */}
      <div
        ref={wrapperRef}
        className="w-full h-full md:h-auto md:w-auto max-h-[90vh] max-w-4xl flex flex-col md:flex-row rounded-lg overflow-hidden"
      >
        {/* Media Container: flexible, relative for buttons */}
        <div className="flex-1 flex justify-center items-center bg-black">
          {post.media_type === "CAROUSEL_ALBUM" ? (
            <CorouselImages key={post.id} mediaUrls={post.carousel_images} />
          ) : post.media_type === "VIDEO" ? (
            <video
              src={post.media_url}
              controls
              autoPlay
              muted
              controlsList="nodownload noplaybackrate"
              disablePictureInPicture
              className="w-full h-full object-contain"
            />
          ) : (
            <img
              src={post.media_url}
              alt="Instagram post"
              className="w-full h-full object-contain"
            />
          )}

          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-white bg-black/40 rounded-full p-2 z-20"
            aria-label="Close dialog"
          >
            <X size={24} />
          </button>

          {/* Previous Button (Inside Media) */}
          {!isFirst && (
            <button
              onClick={onPrev}
              className="absolute left-[0px] md:left-[20px] top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/60 rounded-full p-2 z-10"
              aria-label="Previous post"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Next Button (Inside Media) */}
          {!isLast && (
            <button
              onClick={onNext}
              className="absolute right-[0px] md:right-[20px] top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/60 rounded-full p-2 z-10"
              aria-label="Next post"
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>

        {/* Info/Caption Sidebar */}
        <div
          className={clsx(
            manrope.className,
            // Responsive width, full on mobile, fixed on desktop
            "w-full md:w-[350px] lg:w-[400px] flex-shrink-0 bg-white p-4 flex flex-col gap-4"
          )}
        >
          <div className="flex pt-2 gap-4 items-center">
            <img
              src="/ListingPageHeader/insta_black_logo.svg"
              alt="Instagram Logo"
              className="w-7 h-7"
            />
            <span className="text-lg font-bold text-black">
              {storeName} x Attirelly
            </span>
          </div>
          <hr className="border-gray-200" />
          {/* Scrollable container for long captions */}
          <div className="overflow-y-auto flex-1 scrollbar-none">
            <p className="text-sm text-black font-normal whitespace-pre-line">
              {post.caption || ""}
            </p>
          </div>
        </div>

        {/* Close Button (Global) */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white bg-black/40 rounded-full p-2 z-20 md:text-black md:bg-white md:top-[-40px] md:right-[-40px]"
          aria-label="Close dialog"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
}
