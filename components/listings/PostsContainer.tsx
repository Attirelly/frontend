'use client';

import GridPostGallery from '@/components/listings/GridPostGallery';
import { useHeaderStore } from '@/store/listing_header_store';
import GridPostGallerySkeleton from './skeleton/store_desc/GridPostGallerySkeleton';
import InstagramFeed from '../InstagramFeed';
import ApifyPostGallery from './ApifyPostGallery';

interface IdProp {
  storeId : string
}

export default function PostGalleryContainer({storeId}:IdProp) {

  const { instaMedia, instaMediaLoading, instaUsername, instaMediaApify, storeName } = useHeaderStore();

  // const loading = !instaMedia;

  return (
    <div id="scrollable-container" >
      {instaMediaLoading ? (
        <GridPostGallerySkeleton />
      ) : instaMedia?.length > 0 ? (
        <GridPostGallery sellerId={storeId} />
      ) : instaMediaApify ?(
        <ApifyPostGallery posts={instaMediaApify} />
      )
       : (
        <InstagramFeed username={instaUsername} />
      )}
    </div>
  );
}
