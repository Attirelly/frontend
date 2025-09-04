// 'use client';

// import React, { useEffect, useRef } from 'react';
// import { instaMediaType } from '@/types/SellerTypes';
// import { X, ChevronLeft, ChevronRight } from 'lucide-react';
// import { useHeaderStore } from '@/store/listing_header_store';
// import { manrope, roboto } from '@/font';
// import CorouselImages from './CorouselImages';

// type Props = {
//   isOpen: boolean;
//   post: instaMediaType;
//   onClose: () => void;
//   onNext: () => void;
//   onPrev: () => void;
//   isFirst: boolean;
//   isLast: boolean;
// };

// export default function PostDialogue({ isOpen, post, onClose, onNext, onPrev, isFirst, isLast }: Props) {
//   const { profilePic, storeName } = useHeaderStore();
//   const wrapperRef = useRef<HTMLDivElement | null>(null);
//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
//         onClose();
//       }
//     };
//     if (isOpen) document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [isOpen, onClose]);

//   if (!isOpen) return null;
//   console.log(post);

//   return (
//     <div className="fixed inset-0 z-50 bg-neutral-900/70 flex justify-center items-center ">
//       <div
//         ref={wrapperRef}
//         className="relative flex max-w-[957px] max-h-[621px]"
//       >
//         <div className='flex rounded-2xl overflow-hidden'>
//           <div className="flex justify-center items-center w-full h-full bg-black overflow-hidden">
//           {post.media_type === 'CAROUSEL_ALBUM' ? (
//             <CorouselImages key={post.id} mediaUrls={post.carousel_images} />
//           ) :
//           post.media_type === 'VIDEO' ? (
//           //  <CustomVideoPlayer src={post.media_url} />
//            <video
//               src={post.media_url}
//               controls
//               autoPlay
//               muted
//               controlsList="nodownload noplaybackrate noremoteplayback"
//               disablePictureInPicture
//               // controlsList="nodownload"
//               className="max-w-full max-h-full object-contain"
//             />
//           ) : (
//             <img
//               src={post.media_url}
//               alt="Instagram post"
//               className="max-w-full max-h-full object-contain"
//             />
//           )}
//           </div>
//           <div className={`${manrope.className} w-[519px] bg-white px-3 flex flex-col gap-[25px]`}
//             style={{ fontWeight: 600 }}>
//             <div className='flex pt-2 gap-4 items-center'>
//               <img
//                 src="/ListingPageHeader/insta_black_logo.svg"
//                 alt='Instagram Logo'
//                 className='w-6 h-6' />
//               <span className='text-[20px] text-black' style={{fontWeight:700}}>{storeName}  x  Attirelly</span>
//             </div>

//             <hr className='border border-[#E8E8E8]'/>
//             <span className='text-sm text-black' style={{ fontWeight: 400 }}>{post.caption || ''}</span>
//             {/* <div className='text-sm flex gap-3'>
//               <div className='flex flex-col items-center'>
//                 <img
//                   src='/heart.png'
//                   alt='comments'
//                   className='w-4 h-4' />
//                 <span>{post.like_count} {post.like_count == 1 ? 'Like' : 'Likes'}</span>

//               </div>
//               <div className='flex flex-col items-center'>
//                 <img
//                   src='/comment.png'
//                   alt='likes'
//                   className='w-4 h-4' />
//                 <span>{post.comments_count} {post.comments_count == 1 ? 'Comment' : 'Comments'}</span>
//               </div>
//             </div> */}
//           </div>
//         </div>

//         {/* Close Button */}
//         <button
//           onClick={(e) => {
//             e.stopPropagation();
//             onClose();
//           }}
//           className="absolute top-[-40px] right-[-40px] text-black bg-white bg-black/70 rounded-full p-2"
//         >
//           <X size={22} />
//         </button>

//         {/* Navigation Arrows */}
//         {!isFirst && (
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               onPrev();
//             }}
//             className="absolute left-[-48px] top-1/2 transform -translate-y-1/2 text-black bg-white rounded-full p-2"
//           >
//             <ChevronLeft size={22} />
//           </button>
//         )}
//         {!isLast && (
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               onNext();
//             }}
//             className="absolute right-[-48px] top-1/2 transform -translate-y-1/2 text-black bg-white rounded-full p-2"
//           >
//             <ChevronRight size={22} />
//           </button>
//         )}

//       </div>
//     </div>
//   );
// }

"use client";

import React, { useEffect, useRef } from "react";
import { instaMediaType } from "@/types/SellerTypes";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useHeaderStore } from "@/store/listing_header_store";
import { manrope } from "@/font";
import CorouselImages from "./CorouselImages";
import clsx from "clsx";

type Props = {
  isOpen: boolean;
  post: instaMediaType;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
};

export default function PostDialogue({
  isOpen,
  post,
  onClose,
  onNext,
  onPrev,
  isFirst,
  isLast,
}: Props) {
  const { storeName } = useHeaderStore();
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    // Backdrop with padding for mobile
    <div className="fixed inset-0 z-50 bg-neutral-900/80 flex justify-center items-center p-4">
      {/* Main dialog container: responsive width, height, and flex direction */}
      <div
        ref={wrapperRef}
        className="w-full h-full md:h-auto md:w-auto max-h-[90vh] max-w-4xl flex flex-col md:flex-row rounded-lg overflow-hidden"
      >
        {/* Media Container: flexible, relative for buttons */}
        <div className="flex-1 flex justify-center items-center bg-black">
          {post.media_type === "CAROUSEL_ALBUM" ? (
            <CorouselImages key={post.id} mediaUrls={post.carousel_images} />
          ) : post.media_type === "VIDEO" ? (
            <video
              src={post.media_url}
              controls
              autoPlay
              muted
              controlsList="nodownload noplaybackrate"
              disablePictureInPicture
              className="w-full h-full object-contain"
            />
          ) : (
            <img
              src={post.media_url}
              alt="Instagram post"
              className="w-full h-full object-contain"
            />
          )}

          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-white bg-black/40 rounded-full p-2 z-20"
            aria-label="Close dialog"
          >
            <X size={24} />
          </button>

          {/* Previous Button (Inside Media) */}
          {!isFirst && (
            <button
              onClick={onPrev}
              className="absolute left-[0px] md:left-[20px] top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/60 rounded-full p-2 z-10"
              aria-label="Previous post"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Next Button (Inside Media) */}
          {!isLast && (
            <button
              onClick={onNext}
              className="absolute right-[0px] md:right-[20px] top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/60 rounded-full p-2 z-10"
              aria-label="Next post"
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>

        {/* Info/Caption Sidebar */}
        <div
          className={clsx(
            manrope.className,
            // Responsive width, full on mobile, fixed on desktop
            "w-full md:w-[350px] lg:w-[400px] flex-shrink-0 bg-white p-4 flex flex-col gap-4"
          )}
        >
          <div className="flex pt-2 gap-4 items-center">
            <img
              src="/ListingPageHeader/insta_black_logo.svg"
              alt="Instagram Logo"
              className="w-7 h-7"
            />
            <span className="text-lg font-bold text-black">
              {storeName} x Attirelly
            </span>
          </div>
          <hr className="border-gray-200" />
          {/* Scrollable container for long captions */}
          <div className="overflow-y-auto flex-1 scrollbar-none">
            <p className="text-sm text-black font-normal whitespace-pre-line">
              {post.caption || ""}
            </p>
          </div>
        </div>

        {/* Close Button (Global) */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white bg-black/40 rounded-full p-2 z-20 md:text-black md:bg-white md:top-[-40px] md:right-[-40px]"
          aria-label="Close dialog"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
}
