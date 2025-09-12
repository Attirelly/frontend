'use client';

import GridPostGallery from '@/components/listings/GridPostGallery';
import { useHeaderStore } from '@/store/listing_header_store';
import GridPostGallerySkeleton from './skeleton/store_desc/GridPostGallerySkeleton';
import InstagramFeed from '../InstagramFeed';
import ApifyPostGallery from './ApifyPostGallery';

/**
 * @interface IdProp
 * @description Defines the props for the PostGalleryContainer component.
 */
interface IdProp {
  /**
   * @description The unique identifier for the store, which is passed down to child components.
   */
  storeId: string;
}

/**
 * A container component that conditionally renders the appropriate post gallery for a store.
 *
 * This component acts as a router for displaying a store's social media posts. It checks the
 * global `useHeaderStore` for Instagram data from various sources and renders the corresponding
 * gallery component based on what is available. This allows the application to gracefully
 * handle different data states, from an official API connection to a fallback scraping service.
 *
 * ### Rendering Logic
 * The component follows a specific priority order to decide which gallery to show:
 * 1.  **Loading State**: If `instaMediaLoading` is true, it displays the `GridPostGallerySkeleton`.
 * 2.  **Official API Data**: If data from the official Instagram API (`instaMedia`) is available, it renders the `GridPostGallery`.
 * 3.  **Apify (Scraping) Data**: If official data is not available but data from the Apify scraping service (`instaMediaApify`) is, it renders the `ApifyPostGallery`.
 * 4.  **Fallback**: If no media data is available from any source, it defaults to rendering the `InstagramFeed` component, which likely shows a prompt or an embedded view based on the `instaUsername`.
 *
 * ### State Management
 * - This component is a consumer of the `useHeaderStore`, reading various Instagram-related states to make its rendering decisions.
 *
 * @param {IdProp} props - The props for the component.
 * @returns {JSX.Element} The appropriate post gallery component based on the available data.
 * @see {@link GridPostGallery}
 * @see {@link ApifyPostGallery}
 * @see {@link InstagramFeed}
 * @see {@link GridPostGallerySkeleton}
 * @see {@link https://docs.pmnd.rs/zustand/getting-started/introduction | Zustand Documentation}
 */

export default function PostGalleryContainer({storeId}:IdProp) {

  const { instaMedia, instaMediaLoading, instaUsername, instaMediaApify, storeName } = useHeaderStore();

  return (
    <div id="scrollable-container">
      {/* This block implements the conditional rendering logic based on the priority of data sources.
      */}
      {instaMediaLoading ? (
        // 1. If data is currently being fetched, show a skeleton loader.
        <GridPostGallerySkeleton />
      ) : instaMedia && instaMedia.length > 0 ? (
        // 2. If data from the official Instagram API is available, render the main gallery.
        <GridPostGallery sellerId={storeId} />
      ) : instaMediaApify && instaMediaApify.length > 0 ? (
        // 3. If no official data, but scraped (Apify) data is available, render the Apify gallery.
        <ApifyPostGallery posts={instaMediaApify} />
      ) : (
        // 4. As a final fallback, render the InstagramFeed component, which might show an embed or a message.
        <InstagramFeed username={instaUsername} />
      )}
    </div>
  );
}
