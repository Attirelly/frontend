'use client';

import Image from 'next/image';
import React from 'react';
import { instaMediaType } from '@/types/SellerTypes';

type Props = {
  posts: instaMediaType[];
};

export default function GridPostGallery({ posts }: Props) {
  return (
    <div className="grid grid-cols-3 gap-[2px]">
      {posts.map((post) => (
        <div key={post.id} className="relative aspect-square overflow-hidden bg-black">
          {post.media_type === 'IMAGE' || post.media_type === 'CAROUSEL_ALBUM' ? (
            <Image
              src={post.media_url}
              alt="Instagram post"
              fill
              className="object-cover"
              unoptimized // needed if image is not from allowed domain
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
  );
}
