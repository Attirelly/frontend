"use client";

import Image from "next/image";
import React, { useState } from "react";
import { MediaItemType } from "@/types/SellerTypes";
import ApifyPostDialog from "./ApifyPostDialog";

/**
 * @interface Props
 * @description Defines the props for the ApifyPostGallery component.
 */
type Props = {
  /**
   * @description An array of post objects, typically fetched from a scraping service like Apify.
   */
  posts: MediaItemType[];
};

/**
 * A component that displays a grid of Instagram posts fetched from a scraping service (Apify).
 *
 * This component is designed as a fallback for when an official Instagram API connection is not
 * available. It takes an array of post data and renders it in a simple 3-column grid. Each post
 * in the grid is clickable, which opens a detailed view in the `ApifyPostDialog` modal.
 *
 * ### State Management
 * - **Local State (`useState`)**: It uses a single state variable, `currentIndex`, to manage which
 * post is currently being viewed in the dialog. A `null` value indicates that the dialog is closed.
 *
 * ### Features
 * - **Modal Integration**: Seamlessly integrates with the `ApifyPostDialog` to show a detailed view of each post.
 * - **Post Navigation**: Contains the logic (`nextPost`, `prevPost`) to allow users to navigate between posts from within the dialog.
 * - **Media Type Indicators**: Overlays icons on the grid items to indicate if a post is a video or a carousel.
 * - **Image Proxy**: Uses an image proxy to serve images from external URLs, which can help with performance and avoiding CORS issues.
 *
 * @param {Props} props - The props for the component.
 * @returns {JSX.Element} A grid of clickable Instagram post thumbnails.
 * @see {@link ApifyPostDialog}
 * @see {@link https://react.dev/reference/react/useState | React useState Hook}
 */

export default function ApifyPostGallery({ posts }: Props) {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  // --- Dialog Control Functions ---
  /**
   * Opens the dialog and sets the current index to the selected post.
   * @param {number} index - The index of the post that was clicked.
   */
  const openDialog = (index: number) => {
    setCurrentIndex(index);
  };

  const closeDialog = () => {
    setCurrentIndex(null);
  };

  const nextPost = () => {
    if (currentIndex !== null && currentIndex < posts.length - 1) {
      setCurrentIndex((prev) => (prev ?? 0) + 1);
    }
  };

  const prevPost = () => {
    if (currentIndex !== null && currentIndex > 0) {
      setCurrentIndex((prev) => (prev ?? 0) - 1);
    }
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-1">
        {posts.map((post, index) => (
          <div
            key={post.id}
            className="relative w-full aspect-[3/4] overflow-hidden bg-black"
            onClick={() => openDialog(index)}
          >
            <Image
              // The image URL is passed through a proxy for optimization and to handle potential CORS issues.
              // src={`/api/proxy-image?url=${encodeURIComponent(post.display_url)}`}
              src={`https://image-proxy.ranarahul16-rr.workers.dev/?url=${encodeURIComponent(
                post.display_url
              )}`}
              alt="Instagram post"
              fill
              sizes="33vw"
              className="object-cover object-top"
              unoptimized
            />
            {post.media_type === "Video" && (
              <div className="absolute top-1 right-1">
                <Image
                  src="/ListingPageHeader/reel_logo.svg"
                  alt="video"
                  width={18}
                  height={18}
                />
              </div>
            )}
            {post.media_type === "Sidecar" && (
              <div className="absolute top-1 right-1">
                <Image
                  src="/ListingPageHeader/carousel_logo.png" // Make sure this image exists
                  alt="carousel"
                  width={36}
                  height={36}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Conditionally render the ApifyPostDialog modal when a post is selected. */}
      {currentIndex !== null && (
        <ApifyPostDialog
          isOpen={true}
          post={posts[currentIndex]}
          onClose={closeDialog}
          onNext={nextPost}
          onPrev={prevPost}
          isFirst={currentIndex == 0}
          isLast={currentIndex == posts.length - 1}
        />
      )}
    </>
  );
}
