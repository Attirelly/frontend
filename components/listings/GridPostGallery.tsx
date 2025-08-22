"use client";

import Image from "next/image";
import { instaMediaType } from "@/types/SellerTypes";
import PostDialogue from "./PostDialgue";
import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/axios";

interface IdProp {
  sellerId: string;
}


const BUFFER_LIMIT = 12; 
const API_LIMIT = 48;
export default function GridPostGallery({ sellerId }: IdProp) {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const [posts, setPosts] = useState<instaMediaType[]>([]); // rendered posts
  const [bufferPosts, setBufferPosts] = useState<instaMediaType[]>([]); // local batch (up to 50)
  const [loading, setLoading] = useState(false);
  const [afterCursor, setAfterCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef(null);
  const abortControllerRef = useRef<AbortController | null>(null);


  useEffect(()=>{
    fetchPosts();
  },[])
  // 🔹 fetch next 50 from backend
  const fetchPosts = async () => {
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

      // put 50 items in buffer
      setBufferPosts(responseData.media);
      setAfterCursor(responseData.paging.cursors?.after || null);
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

  // 🔹 move 12 from buffer → posts
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

  // observer for infinite scroll
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

  // reset when seller changes
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
            className="relative w-[300px] h-[400px] overflow-hidden bg-black"
            onClick={() => openDialog(index)}
          >
            {post.media_type === "IMAGE" ||
            post.media_type === "CAROUSEL_ALBUM" ? (
              <Image
                src={post.media_url}
                alt="Instagram post"
                fill
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

      {/* Infinite scroll trigger */}
      <div ref={observerTarget} className="h-10" />

      {currentIndex !== null && (
        <PostDialogue
          isOpen={true}
          post={posts[currentIndex]}
          onClose={closeDialog}
          onNext={nextPost}
          onPrev={prevPost}
          isFirst={currentIndex == 0}
          isLast={currentIndex == posts.length - 1}
        />
      )}
    </>
  );
}
