'use client';

import GridPostGallery from '@/components/listings/GridPostGallery';
import { useHeaderStore } from '@/store/listing_header_store';
import GridPostGallerySkeleton from './skeleton/store_desc/GridPostGallerySkeleton';
import InstagramFeed from '../InstagramFeed';
import ApifyPostGallery from './ApifyPostGallery';


export default function PostGalleryContainer() {

  const { instaMedia, instaMediaLoading, instaUsername, instaMediaApify } = useHeaderStore();
  
  // const loading = !instaMedia;

  return (
    <div id="scrollable-container" className="h-[927px] overflow-y-auto scrollbar-thin">
      {instaMediaLoading ? (
        <GridPostGallerySkeleton />
      ) : instaMedia?.length > 0 ? (
        <GridPostGallery posts={instaMedia} />
      ) : instaMediaApify ?(
        <ApifyPostGallery posts={instaMediaApify} />
      )
       : (
        <InstagramFeed username={instaUsername} />
      )}
    </div>
  );
}
