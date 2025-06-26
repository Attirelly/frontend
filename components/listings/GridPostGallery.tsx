'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import { instaMediaType } from '@/types/SellerTypes';
import PostDialogue from './PostDialgue';

type Props = {
  posts: instaMediaType[];
};

export default function GridPostGallery({ posts }: Props) {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const openDialog = (index: number) => {
    setCurrentIndex(index);
  };

  const closeDialog = () => {
    console.log('dsaads');
    setCurrentIndex(null);
  };

  const nextPost = () => {
    console.log(currentIndex);
    if (currentIndex !== null && currentIndex < posts.length - 1) {
      console.log('next clicked');
      setCurrentIndex((prev) => (prev ?? 0) + 1);
    }
  };

  const prevPost = () => {
    console.log(currentIndex);
    if (currentIndex !== null && currentIndex > 0) {
      console.log('prev clicked');
      setCurrentIndex((prev) => (prev ?? 0) - 1);
    }
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-[2px]">
        {posts.map((post, index) => (
          <div
            key={post.id}
            className="relative aspect-square overflow-hidden bg-black"
            onClick={() => openDialog(index)}
          >
            {post.media_type === 'IMAGE' || post.media_type === 'CAROUSEL_ALBUM' ? (
              <Image
                src={post.media_url}
                alt="Instagram post"
                fill
                className="object-cover"
                unoptimized
              />
            ) : post.media_type === 'VIDEO' ? (
              <video
                src={post.media_url}
                className="object-cover w-full h-full"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : null}

            {post.media_type === 'VIDEO' && (
              <div className="absolute top-1 right-1">
                <Image
                  src="/ListingPageHeader/reel_logo.svg"
                  alt="video"
                  width={18}
                  height={18}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {currentIndex !== null && (
        <PostDialogue
          isOpen={true}
          post={posts[currentIndex]}
          onClose={closeDialog}
          onNext={nextPost}
          onPrev={prevPost}
        />
      )}
    </>
  );
}
