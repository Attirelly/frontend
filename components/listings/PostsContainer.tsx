'use client';

import GridPostGallery from '@/components/listings/GridPostGallery';
import { useEffect, useRef, useState } from 'react';
import { useHeaderStore } from '@/store/listing_header_store';
import { instaMediaType } from '@/types/SellerTypes';

export default function PostGalleryContainer() {
  const { instaMedia } = useHeaderStore();
  const [visiblePosts, setVisiblePosts] = useState<instaMediaType[]>([]);
  const [page, setPage] = useState(1);
  const loaderRef = useRef<HTMLDivElement>(null);

  const POSTS_PER_PAGE = 9;

  const loadMorePosts = () => {
    const nextPage = page + 1;
    const start = page * POSTS_PER_PAGE;
    const end = start + POSTS_PER_PAGE;
    const nextPosts = instaMedia.slice(start, end);
    setVisiblePosts((prev) => [...prev, ...nextPosts]);
    setPage(nextPage);
  };

  useEffect(() => {
    if (instaMedia && instaMedia.length > 0) {
      setVisiblePosts(instaMedia.slice(0, POSTS_PER_PAGE));
    }
  }, [instaMedia]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMorePosts();
        }
      },
      {
        root: document.getElementById('scrollable-container'),
        threshold: 0.1,
      }
    );

    const current = loaderRef.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, [visiblePosts]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div id="scrollable-container" className="h-[850px] overflow-y-auto">
        <GridPostGallery posts={visiblePosts} />
        <div ref={loaderRef} className="text-center py-3 text-sm text-gray-400">
          {visiblePosts.length < instaMedia.length ? 'Loading more...' : 'End of posts'}
        </div>
      </div>
    </div>
  );
}
