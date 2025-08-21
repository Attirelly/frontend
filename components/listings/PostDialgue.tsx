'use client';

import React, { useEffect, useRef } from 'react';
import { instaMediaType } from '@/types/SellerTypes';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useHeaderStore } from '@/store/listing_header_store';
import { manrope, roboto } from '@/font';
import CorouselImages from './CorouselImages';

type Props = {
  isOpen: boolean;
  post: instaMediaType;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
};

export default function PostDialogue({ isOpen, post, onClose, onNext, onPrev, isFirst, isLast }: Props) {
  const { profilePic, storeName } = useHeaderStore();
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
  console.log(post);

  return (
    <div className="fixed inset-0 z-50 bg-neutral-900/70 flex justify-center items-center ">
      <div
        ref={wrapperRef}
        className="relative flex max-w-[70vw] max-h-[90vh]"
      >
        <div className='grid grid-cols-[1.5fr_1fr] rounded-2xl overflow-hidden'>
          {post.media_type === 'CAROUSEL_ALBUM' ? (
            <CorouselImages key={post.id} mediaUrls={post.carousel_images} />
          ) : 
          post.media_type === 'VIDEO' ? (
          //  <CustomVideoPlayer src={post.media_url} />
           <video
              src={post.media_url}
              controls
              autoPlay
              muted
              controlsList="nodownload noplaybackrate noremoteplayback"
              disablePictureInPicture
              // controlsList="nodownload"
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <img
              src={post.media_url}
              alt="Instagram post"
              className="max-w-full max-h-full object-contain"
            />
          )}
          <div className={`${manrope.className} bg-white px-3 flex flex-col gap-3`}
            style={{ fontWeight: 600 }}>
            <div className='flex pt-2 gap-4 items-center'>
              <img
                src="/ListingPageHeader/insta_black_logo.svg"
                alt='Instagram Logo'
                className='w-6 h-6' />
              <span className='text-[20px] text-black' style={{fontWeight:700}}>{storeName}  x  Attirelly</span>
            </div>

            {/* <hr className='border border-gray-300 '/> */}
            <span className='text-sm text-black' style={{ fontWeight: 400 }}>{post.caption || ''}</span>
            {/* <div className='text-sm flex gap-3'>
              <div className='flex flex-col items-center'>
                <img
                  src='/heart.png'
                  alt='comments'
                  className='w-4 h-4' />
                <span>{post.like_count} {post.like_count == 1 ? 'Like' : 'Likes'}</span>

              </div>
              <div className='flex flex-col items-center'>
                <img
                  src='/comment.png'
                  alt='likes'
                  className='w-4 h-4' />
                <span>{post.comments_count} {post.comments_count == 1 ? 'Comment' : 'Comments'}</span>
              </div>
            </div> */}
          </div>
        </div>


        {/* Close Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-[-40px] right-[-40px] text-black bg-white bg-black/70 rounded-full p-2"
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
            className="absolute left-[-48px] top-1/2 transform -translate-y-1/2 text-black bg-white rounded-full p-2"
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
            className="absolute right-[-48px] top-1/2 transform -translate-y-1/2 text-black bg-white rounded-full p-2"
          >
            <ChevronRight size={22} />
          </button>
        )}

      </div>
    </div>
  );
}
