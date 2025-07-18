'use client';

import React, { useEffect, useRef } from 'react';
import { instaMediaType, MediaItemType } from '@/types/SellerTypes';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useHeaderStore } from '@/store/listing_header_store';
import { roboto } from '@/font';
import SidecarCarousel from './SidecarCarousel';

type Props = {
  isOpen: boolean;
  post: MediaItemType;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
};

export default function ApifyPostDialog({ isOpen, post, onClose, onNext, onPrev, isFirst, isLast }: Props) {
  const { profilePic } = useHeaderStore();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-neutral-900/70 flex justify-center items-center">
      <div
        ref={wrapperRef}
        className="relative flex w-[1000px] h-[600px] bg-black"
      >
        <div className='grid grid-cols-[1.5fr_1fr] w-full h-full'>
          <div className="flex justify-center items-center w-full h-full bg-black overflow-hidden">
            {post.media_type === 'Sidecar' ? (
              <SidecarCarousel mediaUrls={post.media_urls} />
            ) : post.media_type === 'Video' ? (
              <video
                src={post.media_urls[0].media_url}
                controls
                autoPlay
                muted
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <img
                src={`/api/proxy-image?url=${encodeURIComponent(post.media_urls[0].media_url)}`}
                alt="Instagram post"
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>


          <div className={`${roboto.className} bg-white px-3 flex flex-col gap-3`}
            style={{ fontWeight: 600 }}>
            <div className='flex pt-2 gap-4 items-center'>
              <img
                src={profilePic}
                alt='Instagram Profile Pic'
                className='w-10 h-10 rounded-full' />
              <span>{post.username}</span>
            </div>

            {/* <hr className='border border-gray-300 '/> */}
            <span className='text-sm' style={{ fontWeight: 400 }}>{post.caption || 'No Caption Found'}</span>
            <div className='text-sm flex gap-3'>
              <div className='flex flex-col items-center'>
                <img
                  src='/heart.png'
                  alt='comments'
                  className='w-4 h-4' />
                <span>{post.likes_count} {post.likes_count == 1 ? 'Like' : 'Likes'}</span>

              </div>
              <div className='flex flex-col items-center'>
                <img
                  src='/comment.png'
                  alt='likes'
                  className='w-4 h-4' />
                <span>{post.comments_count} {post.comments_count == 1 ? 'Comment' : 'Comments'}</span>
              </div>
            </div>
          </div>
        </div>


        {/* Close Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-[-40px] right-[-40px] text-white bg-black/70 rounded-full p-2"
        >
          <X size={22} />
        </button>

        {/* Navigation Arrows */}
        {!isFirst && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-[-48px] top-1/2 transform -translate-y-1/2 text-white bg-black/70 rounded-full p-2"
          >
            <ChevronLeft size={22} />
          </button>
        )}
        {!isLast && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-[-48px] top-1/2 transform -translate-y-1/2 text-white bg-black/70 rounded-full p-2"
          >
            <ChevronRight size={22} />
          </button>
        )}

      </div>
    </div>
  );
}
