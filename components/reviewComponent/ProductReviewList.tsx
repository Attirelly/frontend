// components/ProductReviewList.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { api } from "@/lib/axios";
import {  CheckBadgeIcon } from '@heroicons/react/24/solid'; // Using Heroicons for a nice badge
import { Star } from 'lucide-react'; // For star outlines
import { format } from 'date-fns'; // Great library for date formatting

// --- Helper Components ---

// Star display (can be reused from ProductReviewStats)
const StarRatingDisplay = ({ rating, className = "h-5 w-5" }: { rating: number, className?: string }) => (
    <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
            <Star
                key={i}
                className={`${className} ${rating > i ? 'text-yellow-400' : 'text-gray-300'}`}
            />
        ))}
    </div>
);

// --- Enhanced Data Interface ---
// Assumes your API can provide this richer data
interface Review {
    review_id: string;
    rating: number;
    title: string;
    comment: string;
    created_at: string; // ISO date string
    user: {
        name: string;
    };
    size_fit: string;
    quality: string;
    recommended: boolean;
    is_verified_purchase: boolean;
}

// --- Main Component ---

interface Props {
    productId: string;
}

export const ProductReviewList: React.FC<Props> = ({ productId }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [sortBy, setSortBy] = useState("created_at:desc");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Reset reviews when product ID changes
        setReviews([]);
        setPage(1);
        setHasMore(true);
        setLoading(true);

        const fetchReviews = async () => {
            try {
                // API call now includes sorting and pagination params
                const res = await api.get(`/reviews/product/${productId}`);
                setReviews(res.data);
                setError(null);
            } catch (err) {
                setError("Failed to load reviews.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchReviews();
        }
    }, [productId, sortBy]);

    const loadMoreReviews = async () => {
        const nextPage = page + 1;
        try {
            const res = await api.get(`/reviews/product/${productId}`, {
                params: { sort_by: sortBy, page: nextPage, limit: 5 }
            });
            setReviews(prev => [...prev, ...res.data]);
            setPage(nextPage);
        } catch (err) {
            setError("Failed to load more reviews.");
        }
    };
    
    const renderContent = () => {
        if (loading && reviews && reviews.length === 0) {
            return <p>Loading reviews...</p>; // Replace with a skeleton loader for better UX
        }
        if (error) {
            return <p className="text-red-500">{error}</p>;
        }
        if (reviews && reviews.length === 0) 
        {
            return <p className="text-gray-600 py-8 text-center">Be the first to review this product!</p>;
        }
        return (
            <div className="space-y-6">
                {reviews && reviews.map((review) => (
                    <div key={review.review_id} className="border-b border-gray-200 pb-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="font-semibold text-gray-800">{`Hardcoded User Name`}</p>
                                    {review.is_verified_purchase && (
                                        <div className="flex items-center text-xs text-green-600">
                                            <CheckBadgeIcon className="h-4 w-4 mr-1" />
                                            Verified Purchase
                                        </div>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500">
                                    {format(new Date(review.created_at), 'MMMM d, yyyy')}
                                </p>
                            </div>
                            <StarRatingDisplay rating={review.rating} />
                        </div>

                        <h4 className="font-semibold text-lg mt-3">{review.title}</h4>
                        <p className="text-gray-700 mt-1">{review.comment}</p>
                        
                        <div className="flex flex-wrap items-center gap-3 mt-4 text-sm">
                            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full">Fit: {review.size_fit}</span>
                            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full">Quality: {review.quality}</span>
                            {review.recommended && (
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">✔ Recommends</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="mt-8">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h3 className="text-xl font-bold text-gray-900">Customer Reviews</h3>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                    <option value="created_at:desc">Most Recent</option>
                    <option value="rating:desc">Highest Rating</option>
                    <option value="rating:asc">Lowest Rating</option>
                </select>
            </div>

            {renderContent()}

            {hasMore && !loading && (
                <div className="text-center mt-8">
                    <button
                        onClick={loadMoreReviews}
                        className="bg-gray-800 text-white font-semibold py-2 px-6 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
};