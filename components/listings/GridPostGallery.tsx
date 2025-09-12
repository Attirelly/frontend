"use client";

import Image from "next/image";
import { instaMediaType } from "@/types/SellerTypes";
import PostDialogue from "./PostDialgue";
import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/axios";

/**
 * @interface IdProp
 * @description Defines the props for the GridPostGallery component.
 */
interface IdProp {
  /**
   * @description The unique identifier for the seller (store), used to fetch their Instagram posts.
   */
  sellerId: string;
}

// --- Infinite Scroll & Buffering Configuration ---
/**
 * @const {number} BUFFER_LIMIT
 * @description The number of posts to move from the local buffer to the visible grid at a time when the user scrolls.
 */
const BUFFER_LIMIT = 12;
/**
 * @const {number} API_LIMIT
 * @description The total number of posts to fetch from the backend in a single API call, which then populates the local buffer.
 */
const API_LIMIT = 48;

/**
 * A component that displays a grid of Instagram posts with a buffered infinite scroll mechanism.
 *
 * This component is designed for performance, fetching a large batch of posts from the backend and
 * storing them in a client-side buffer. It then incrementally reveals these posts to the user in smaller
 * chunks as they scroll down the page, providing a smooth and seamless experience without frequent
 * loading indicators.
 *
 * ### Buffered Infinite Scroll
 * 1.  **API Fetch (`fetchPosts`)**: Fetches a large batch of posts (`API_LIMIT`) from the backend and stores them in the `bufferPosts` state. It uses a cursor (`afterCursor`) for pagination.
 * 2.  **UI Display (`loadFromBuffer`)**: An `IntersectionObserver` watches a target element at the bottom of the grid. When this element becomes visible, a smaller chunk of posts (`BUFFER_LIMIT`) is moved from the `bufferPosts` to the visible `posts` state.
 * 3.  **Automatic Refetch**: When the buffer is depleted, `loadFromBuffer` automatically calls `fetchPosts` to get the next large batch from the API.
 *
 * ### API Endpoint
 * **`GET /instagram/seller/:sellerId/data`**
 * This endpoint fetches a paginated list of a seller's Instagram posts.
 * - **`:sellerId`** (string): The unique ID of the store.
 * - **`limit`** (query param, number): The number of posts to return.
 * - **`after`** (query param, string, optional): The pagination cursor from the previous response.
 *
 * @param {IdProp} props - The props for the component.
 * @returns {JSX.Element} An infinitely scrolling grid of Instagram posts.
 * @see {@link PostDialogue}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API | Intersection Observer API}
 * @see {@link https://axios-http.com/docs/intro | Axios Documentation}
 */
export default function GridPostGallery({ sellerId }: IdProp) {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const [posts, setPosts] = useState<instaMediaType[]>([]); // rendered posts
  const [bufferPosts, setBufferPosts] = useState<instaMediaType[]>([]); // local batch (up to 50)
  const [loading, setLoading] = useState(false);
  const [afterCursor, setAfterCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // --- Refs ---
  // A ref to the target element that the IntersectionObserver will watch.
  const observerTarget = useRef(null);
  // A ref to hold the AbortController for the current API request.
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Fetches the next large batch of posts from the backend API and populates the local buffer.
   * It uses an AbortController to cancel any ongoing fetch request if a new one is initiated.
   */

  const fetchPosts = async () => {
    // Guard clauses to prevent unnecessary API calls.
    if (loading || !hasMore || !sellerId) return;

    // cancel previous request if still running
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    try {
      let apiUrl = `instagram/seller/${sellerId}/data?limit=${API_LIMIT}`;
      if (afterCursor) {
        apiUrl += `&after=${afterCursor}`;
      }

      const response = await api.get(apiUrl, {
        signal: controller.signal,
      });
      const responseData = await response.data;

      // Populate the buffer with the new batch of posts.
      setBufferPosts(responseData.media);
      // Update the cursor for the next fetch.
      setAfterCursor(responseData.paging.cursors?.after || null);
      // Update the `hasMore` flag based on the presence of a next cursor.
      setHasMore(!!responseData.paging.cursors?.after);
    } catch (e: any) {
      if (e.name === "CanceledError") {
        console.log("Fetch aborted");
      } else {
        console.error("Failed to fetch posts:", e);
      }
    } finally {
      setLoading(false);
    }
  };

    /**
   * Moves a smaller chunk of posts from the buffer to the visible `posts` state.
   * If the buffer becomes empty, it triggers `fetchPosts` to get more data.
   */

  const loadFromBuffer = () => {
    if (bufferPosts.length > 0) {
      const nextBatch = bufferPosts.slice(0, BUFFER_LIMIT);
      const remaining = bufferPosts.slice(BUFFER_LIMIT);
      setPosts((prev) => [...prev, ...nextBatch]);
      setBufferPosts(remaining);
    } else if (!loading && hasMore) {
      fetchPosts();
    }
  };
  /**
   * Effect to set up the IntersectionObserver for infinite scrolling.
   * When the observer target becomes visible, it calls `loadFromBuffer`.
   */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          loadFromBuffer();
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0.5,
      }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [loading, hasMore, bufferPosts]);

  /**
   * Effect to reset the component's state and trigger a fresh data fetch
   * whenever the `sellerId` prop changes.
   */
  useEffect(() => {
    setPosts([]);
    setBufferPosts([]);
    setAfterCursor(null);
    setHasMore(true);
    fetchPosts();
  }, [sellerId]);

  const openDialog = (index: number) => setCurrentIndex(index);
  const closeDialog = () => setCurrentIndex(null);
  const nextPost = () => {
    if (currentIndex !== null && currentIndex < posts.length - 1) {
      setCurrentIndex((prev) => (prev ?? 0) + 1);
    }
  };
  const prevPost = () => {
    if (currentIndex !== null && currentIndex > 0) {
      setCurrentIndex((prev) => (prev ?? 0) - 1);
    }
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-1">
        {posts.map((post, index) => (
          <div
            key={post.id}
            className="relative w-full aspect-[3/4] overflow-hidden bg-black"
            onClick={() => openDialog(index)}
          >
            {post.media_type === "IMAGE" ||
            post.media_type === "CAROUSEL_ALBUM" ? (
              <Image
                src={post.media_url}
                alt="Instagram post"
                fill
                sizes="33vw"
                className="object-cover object-top"
                unoptimized
              />
            ) : post.media_type === "VIDEO" ? (
              <video
                src={post.media_url}
                className="object-cover object-top w-full h-full"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : null}

            {post.media_type === "VIDEO" && (
              <div className="absolute top-1 right-1">
                <Image
                  src="/ListingPageHeader/reel_logo.svg"
                  alt="video"
                  width={18}
                  height={18}
                />
              </div>
            )}
            {post.media_type === "CAROUSEL_ALBUM" && (
              <div className="absolute top-1 right-1">
                <Image
                  src="/ListingPageHeader/carousel_logo.png"
                  alt="carousel"
                  width={36}
                  height={36}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* This invisible div is the target for the IntersectionObserver. */}
      {/* When it scrolls into view, more posts are loaded. */}
      <div ref={observerTarget} className="h-10" />

      {/* Conditionally render the PostDialogue modal when a post is selected. */}
      {currentIndex !== null && (
        <PostDialogue
          isOpen={true}
          post={posts[currentIndex]}
          onClose={closeDialog}
          onNext={nextPost}
          onPrev={prevPost}
          isFirst={currentIndex === 0}
          isLast={currentIndex === posts.length - 1}
        />
      )}
      </>
  );
}
