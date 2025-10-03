// components/ProductReviewStats.tsx
"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { Star, MessageSquare, CheckCircle, XCircle } from "lucide-react"; // For icons

// --- Helper Components for a cleaner structure ---

// 1. Reusable component for displaying stats with a progress bar
const StatBar = ({
  label,
  percentage,
}: {
  label: string;
  percentage: number;
}) => (
  <div className="flex items-center gap-3 text-sm">
    <span className="w-24 text-gray-600">{label}</span>
    <div className="flex-1 bg-gray-200 rounded-full h-2.5">
      <div
        className="bg-gray-700 h-2.5 rounded-full"
        style={{ width: `${percentage}%` }}
      />
    </div>
    <span className="w-10 font-medium text-right text-gray-800">
      {percentage.toFixed(0)}%
    </span>
  </div>
);

// 2. Component for rendering precise star ratings (including half-stars)
const StarRatingDisplay = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex text-yellow-400">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} fill="currentColor" size={20} />
      ))}
      {halfStar && (
        <Star
          key="half"
          fill="currentColor"
          style={{ clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)" }}
          size={20}
        />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="text-gray-300" size={20} />
      ))}
    </div>
  );
};

// 3. Skeleton loader for a better loading experience
const StatsSkeleton = () => (
  <div className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
    <div className="flex items-center gap-4 mb-6">
      <div className="h-10 w-16 bg-gray-200 rounded"></div>
      <div className="space-y-2">
        <div className="h-5 w-24 bg-gray-200 rounded"></div>
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
      </div>
    </div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
    </div>
  </div>
);

// --- Main Component ---

interface Stats {
  avg_rating: number;
  total_reviews: number;
  fit_too_small: number;
  fit_true_to_size: number;
  fit_too_large: number;
  quality_avg: number;
  recommend_rate: number;
}

interface Props {
  productId: string;
}

export const ProductReviewStats: React.FC<Props> = ({ productId }) => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get(
          `/reviews/product/${productId}/stats`
        );
        setStats(res.data);
        console.log("Fetched review stats:", res.data);
      } catch (err) {
        console.error("Failed to fetch review stats:", err);
        setError("Could not load review statistics.");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchStats();
    }
  }, [productId]);

  if (loading) return <StatsSkeleton />;

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg text-red-700 flex items-center gap-3">
        <XCircle size={24} />
        <p>{error}</p>
      </div>
    );
  }

  if (!stats || stats.total_reviews === 0) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-600">
        <MessageSquare className="mx-auto mb-2" size={32} />
        <h4 className="font-semibold text-lg">No Reviews Yet</h4>
        <p className="text-sm">
          Be the first to share your thoughts on this product!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h4 className="font-semibold text-xl mb-4 text-gray-900">
        Ratings & Reviews
      </h4>

      <div className="flex items-center gap-4 mb-6">
        <span className="text-5xl font-bold text-gray-800">
          {stats.avg_rating.toFixed(1)}
        </span>
        <div>
          <StarRatingDisplay rating={stats.avg_rating} />
          <p className="text-sm text-gray-500 mt-1">
            Based on {stats.total_reviews} reviews
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h5 className="font-semibold text-md mb-3 text-gray-800">
            Fit Feedback
          </h5>
          <div className="space-y-2">
            <StatBar label="Too Small" percentage={stats.fit_too_small} />
            <StatBar label="True to Size" percentage={stats.fit_true_to_size} />
            <StatBar label="Too Large" percentage={stats.fit_too_large} />
          </div>
        </div>

        <div>
          <h5 className="font-semibold text-md mb-3 text-gray-800">
            Recommendation
          </h5>
          <div className="space-y-2">
            <StatBar
              label="Would Recommend"
              percentage={stats.recommend_rate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
