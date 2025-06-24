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
        <div key={post.id} className="relative aspect-square overflow-hidden">
          <Image
            src={post.media_url}
            alt='Instagram post'
            fill
            className="object-cover"
          />
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
