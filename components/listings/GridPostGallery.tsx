'use client';

import React from 'react';
import Image from 'next/image';

export type InstagramPost = {
  id: string;
  media_url: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO';
};

type Props = {
  posts: InstagramPost[];
};

export default function GridPostGallery({ posts }: Props) {
  return (
    <div className="grid grid-cols-3 gap-[2px]">
      {posts.map((post) => (
        <div key={post.id} className="relative aspect-square overflow-hidden">
          <Image
            src={post.media_url}
            alt={post.caption || 'Instagram post'}
            fill
            className="object-cover"
          />
          {post.media_type === 'VIDEO' && (
            <div className="absolute top-1 right-1">
              <Image src="/ListingPageHeader/reel_logo.svg" alt="video" width={18} height={18} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
