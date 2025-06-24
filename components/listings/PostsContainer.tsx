'use client';

import GridPostGallery, { InstagramPost } from '@/components/listings/GridPostGallery';
import { useEffect, useRef, useState } from 'react';
import { useHeaderStore } from '@/store/listing_header_store';

const generateMockPosts = (start: number, count: number): InstagramPost[] => {
  return Array.from({ length: count }, (_, i) => {
    const id = (start + i).toString();
    return {
      id,
      media_url: "/ListingPageHeader/store_profile_image.svg",
      caption: `Post #${id}`,
      media_type: i % 4 === 0 ? 'VIDEO' : 'IMAGE',
    };
  });
};

export default function PostGalleryContainer() {
  const {instaMedia} = useHeaderStore();
  const [posts, setPosts] = useState<InstagramPost[]>(generateMockPosts(0, 9));
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);
  console.log('instaMedia' , instaMedia);

  const fetchMorePosts = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const newPosts = generateMockPosts(page * 9, 9);
    setPosts((prev) => [...prev, ...newPosts]);
    setPage((prev) => prev + 1);
    setLoading(false);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          fetchMorePosts();
        }
      },
      { root: document.getElementById('scrollable-container'), threshold: 0.1 }
    );

    const current = loaderRef.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, [loading]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div
        id="scrollable-container"
        className="h-[850px] overflow-y-auto"
      >
        <GridPostGallery posts={posts} />
        <div ref={loaderRef} className="text-center py-3 text-sm text-gray-400">
          {loading ? 'Loading more...' : ''}
        </div>
      </div>
    </div>
  );
}
