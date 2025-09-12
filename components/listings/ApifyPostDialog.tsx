"use client";

import React, { useEffect, useRef } from "react";
import { MediaItemType } from "@/types/SellerTypes";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useHeaderStore } from "@/store/listing_header_store";
import { manrope } from "@/font";
import SidecarCarousel from "./SidecarCarousel";
import clsx from "clsx";

/**
 * @interface Props
 * @description Defines the props for the ApifyPostDialog component.
 */
type Props = {
  /**
   * @description A boolean that controls the visibility of the dialog.
   */
  isOpen: boolean;
  /**
   * @description The scraped post data object (from Apify) to be displayed.
   */
  post: MediaItemType;
  /**
   * @description A callback function to be invoked when the dialog should be closed.
   */
  onClose: () => void;
  /**
   * @description A callback function to navigate to the next post.
   */
  onNext: () => void;
  /**
   * @description A callback function to navigate to the previous post.
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
 * A responsive modal dialog for displaying a detailed view of a single Instagram post fetched via Apify.
 *
 * This component is a controlled modal, meaning its visibility and the content it displays are managed
 * entirely by its parent component. It is designed to handle various scraped media types, including
 * single images, videos, and carousels ("Sidecar" type).
 *
 * ### Features
 * - **Responsive Layout**: The dialog adapts its layout, stacking the media and caption vertically on mobile screens and displaying them side-by-side on larger screens.
 * - **Click Outside to Close**: Users can dismiss the modal by clicking on the semi-transparent backdrop, providing an intuitive user experience.
 * - **Media Handling**: It conditionally renders the correct element (`<img>`, `<video>`, or the `SidecarCarousel` component) based on the `post.media_type`.
 * - **Post Navigation**: It includes "next" and "previous" arrow buttons, allowing users to cycle through posts without closing the dialog.
 *
 * @param {Props} props - The props for the component.
 * @returns {JSX.Element | null} The rendered dialog modal, or `null` if `isOpen` is false.
 * @see {@link SidecarCarousel}
 * @see {@link https://react.dev/reference/react/useEffect | React useEffect Hook}
 * @see {@link https://lucide.dev/ | Lucide React Icons}
 */
export default function ApifyPostDialog({
  isOpen,
  post,
  onClose,
  onNext,
  onPrev,
  isFirst,
  isLast,
}: Props) {
  const { storeName } = useHeaderStore();
  const dialogContentRef = useRef<HTMLDivElement | null>(null);


  /**
   * This effect adds an event listener to the document to handle clicks outside the dialog.
   * If a click occurs outside the `dialogContentRef` element, it calls the `onClose` callback.
   */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dialogContentRef.current &&
        !dialogContentRef.current.contains(e.target as Node)
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
       // Backdrop: a semi-transparent overlay that covers the entire screen.
    <div className="fixed inset-0 z-50 bg-neutral-900/80 flex justify-center items-center p-4">
      <div
        ref={dialogContentRef}
        className=" w-full h-full md:h-auto md:w-auto max-h-[90vh] max-w-4xl flex flex-col md:flex-row rounded-lg overflow-y-auto scrollbar-none"
      >
        {/* Media Container */}
        <div className="flex-1 flex justify-center items-center bg-black ">
          {post.media_type === "Sidecar" ? (
            <SidecarCarousel key={post.id} mediaUrls={post.media_urls} />
          ) : post.media_type === "Video" ? (
            <video
              src={post.media_urls[0].media_url}
              controls
              autoPlay
              muted
              className="w-full h-full object-contain"
            />
          ) : (
            <img
              src={`https://image-proxy.ranarahul16-rr.workers.dev/?url=${encodeURIComponent(
                post.media_urls[0].media_url
              )}`}
              alt="Instagram post"
              className="w-full h-full object-contain"
            />
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-white bg-black/40 rounded-full p-2 z-20"
            aria-label="Close dialog"
          >
            <X size={24} />
          </button>

          {/* Wrapper for Navigation Arrows */}
          {!isFirst && (
            <button
              onClick={onPrev}
              className="absolute left-[0px] md:left-[20px] top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/60 rounded-full p-1 md:p-2 z-100"
              aria-label="Previous post"
            >
              <ChevronLeft size={28} />
            </button>
          )}

          {/* Next Button */}
          {!isLast && (
            <button
              onClick={onNext}
              className="absolute right-[0px] md:right-[20px] top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/60 rounded-full p-1 md:p-2 z-10"
              aria-label="Next post"
            >
              <ChevronRight size={28} />
            </button>
          )}
        </div>

        {/* Info/Caption Sidebar (hidden on mobile) */}
        <div
          className={clsx(
            manrope.className,
            "w-full md:w-[350px] lg:w-[400px] flex-shrink-0 bg-white p-4 flex-col gap-4 flex"
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
          <div className="overflow-y-auto flex-1 scrollbar-none">
            <p className="text-sm text-black font-normal whitespace-pre-line">
              {post.caption || ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
