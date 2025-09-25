// app/insights/[username]/page.tsx

"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCreatorStore } from "@/store/creator_store";
import { Media } from "@/types/creatorTypes";
import MediaPostItem from "@/components/insights/MediaPostItem"; // We will create this next
import { ArrowLeft } from "lucide-react";

const MediaInsightsPage = () => {
  const router = useRouter();
  const params = useParams();
  const { mediaInsights } = useCreatorStore();

  // Get username from URL, ensuring it's a string
  const username = Array.isArray(params.username)
    ? params.username[0]
    : params.username;

  // Sort media by date and get the latest 12 posts
  const latestMedia = useMemo(() => {
    if (!mediaInsights) return [];
    return [...mediaInsights] // Create a copy to avoid mutating the original store state
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 12);
  }, [mediaInsights]);
  
  // Handle case where user navigates directly or refreshes the page
  if (latestMedia.length === 0) {
      return (
          <div className="flex flex-col items-center justify-center min-h-screen text-center">
              <h2 className="text-2xl font-bold mb-4">No Media Data Found</h2>
              <p className="text-gray-500 mb-6">The media insights might not be loaded. Please go back and select a profile again.</p>
              <button
                  onClick={() => router.back()}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
              >
                  <ArrowLeft size={18} />
                  Go Back
              </button>
          </div>
      )
  }

  return (
    <main className="bg-gray-50 min-h-screen p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
            <button 
                onClick={() => router.back()} 
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
            >
                <ArrowLeft size={16} />
                Back to Profiles
            </button>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Latest Posts for @{username}
          </h1>
          <p className="text-gray-500 mt-1">Displaying the 12 most recent posts.</p>
        </header>

        <section className="space-y-4">
            {latestMedia.map((media) => (
                <MediaPostItem key={media.media_id} media={media} />
            ))}
        </section>
      </div>
    </main>
  );
};

export default MediaInsightsPage;