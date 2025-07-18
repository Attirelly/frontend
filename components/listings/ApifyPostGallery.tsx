'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import { MediaItemType } from '@/types/SellerTypes';
import PostDialogue from './PostDialgue';
import ApifyPostDialog from './ApifyPostDialog';

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
      <div className="grid grid-cols-3 gap-[2px]">
        {posts.map((post, index) => (
          <div
            key={post.id}
            className="relative aspect-square overflow-hidden bg-black"
            onClick={() => openDialog(index)}
          >
            {post.media_type === 'Image' || post.media_type === 'Sidecar' ? (
              <img
                // src={post.media_urls[0].media_url}
                src="https://instagram.fpoa35-1.fna.fbcdn.net/v/t51.2885-15/520347357_18544084108035859_2250915303986305106_n.jpg?stp=dst-jpg_e35_p1080x1080_sh0.08_tt6&_nc_ht=instagram.fpoa35-1.fna.fbcdn.net&_nc_cat=1&_nc_oc=Q6cZ2QHOv4ybWn_MSpqkut1MKM128aKh85uBjoz7u-ARq_IDKz91gXaONO1_MlMOQs6aXy0&_nc_ohc=i6cS79MBdcQQ7kNvwE1x4Eg&_nc_gid=OHdlhSDeSJQi5v3NjNhrpA&edm=AOQ1c0wBAAAA&ccb=7-5&ig_cache_key=MzY3OTE0MTM1MTk1NTI4OTkxNw%3D%3D.3-ccb7-5&oh=00_AfRNl_6J-jfjxUJ_KnlL3PDA_DLdFIAX0uO6vU0WCe48PA&oe=68802640&_nc_sid=8b3546"
                alt="Instagram post"
                
                className="object-cover w-full h-full"
                
              />
            ) : post.media_type === 'Video' ? (
              <video
                src={post.media_urls[0].media_url}
                className="object-cover w-full h-full"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : null}

            {post.media_type === 'Video' && (
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
        <ApifyPostDialog
          isOpen={true}
          post={posts[currentIndex]}
          onClose={closeDialog}
          onNext={nextPost}
          onPrev={prevPost}
          isFirst={currentIndex == 0 ? true : false}
          isLast={currentIndex == posts.length-1 ? true : false}
        />
      )}
    </>
  );
}
