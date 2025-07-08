'use client';

import GridPostGallery from '@/components/listings/GridPostGallery';
import { useHeaderStore } from '@/store/listing_header_store';
import GridPostGallerySkeleton from './skeleton/store_desc/GridPostGallerySkeleton';
import InstagramFeed from '../InstagramFeed';


export default function PostGalleryContainer() {

  const { instaMedia, instaMediaLoading, instaUsername } = useHeaderStore();
  // const loading = !instaMedia;

  return (
    <div id="scrollable-container" className="h-[927px] overflow-y-auto scrollbar-none">
      {instaMediaLoading ? (
        <GridPostGallerySkeleton />
      ) : instaMedia?.length > 0 ? (
        <GridPostGallery posts={instaMedia} />
      ) : (
        <InstagramFeed username={instaUsername} />
      )}
    </div>
  );
}
