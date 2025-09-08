"use client";

import Image from "next/image";
import React, { useState } from "react";
import { MediaItemType } from "@/types/SellerTypes";
import ApifyPostDialog from "./ApifyPostDialog";

type Props = {
  posts: MediaItemType[];
};

export default function ApifyPostGallery({ posts }: Props) {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

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
