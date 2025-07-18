'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MediaUrlType } from '@/types/SellerTypes';

type Props = {
  mediaUrls: MediaUrlType[];
};

export default function SidecarCarousel({ mediaUrls }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentMedia = mediaUrls[currentIndex];

  const next = () => {
    if (currentIndex < mediaUrls.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const prev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  return (
    <div className="relative flex items-center justify-center w-full h-full">
      {currentMedia.type === 'Video' ? (
        <video
          src={currentMedia.media_url}
          controls
          autoPlay
          muted
          className="max-w-full max-h-full object-contain"
        />
      ) : (
        <img
          // src={currentMedia.media_url}
          src={`/api/proxy-image?url=${encodeURIComponent(currentMedia.media_url)}`}
          alt="Instagram post media"
          className="max-w-full max-h-full object-contain"
        />
      )}

      {currentIndex > 0 && (
        <button
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 text-white bg-black/60 p-1 rounded-full"
        >
          <ChevronLeft size={22} />
        </button>
      )}
      {currentIndex < mediaUrls.length - 1 && (
        <button
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-black/60 p-1 rounded-full"
        >
          <ChevronRight size={22} />
        </button>
      )}
    </div>
  );
}
