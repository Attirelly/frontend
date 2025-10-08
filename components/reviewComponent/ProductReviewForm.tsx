// components/ProductReviewForm.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/axios"; // your axios wrapper
import { Star } from "lucide-react"; // Using lucide-react for icons

// You can create a dedicated StarRating component for reusability
const StarRatingInput = ({ rating, setRating }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`cursor-pointer transition-colors ${
            (hoverRating >= star || rating >= star)
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300"
          }`}
          onClick={() => setRating(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
        />
      ))}
    </div>
  );
};


interface ProductReviewFormProps {
  productId: string;
  variantId?: string;
}

// FIX: Define the quality options to match backend enum
const qualityOptions = {
  "1": "Poor",
  "2": "Average",
  "3": "Good",
  "4": "Very Good",
  "5": "Excellent",
};

export const ProductReviewForm: React.FC<ProductReviewFormProps> = ({ productId, variantId }) => {
  const [rating, setRating] = useState<number>(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [sizeFit, setSizeFit] = useState<"Too Small" | "True to Size" | "Too Large">();
  const [quality, setQuality] = useState<string>(""); // FIX: State is now a string
  const [recommended, setRecommended] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return toast.error("Please select a star rating.");
    if (!title || !comment) return toast.error("Please fill out the title and comment.");
    
    setSubmitting(true);

    try {
      await api.post("/reviews", {
        product_id: '1fe17908-01c4-4ef0-8cf5-de0f2efef6d0', // Use props instead of hardcoded values
        variant_id: '59f3418c-501f-43b0-ad8c-5e227a18eabc',
        rating,
        title,
        comment,
        size_fit: sizeFit,
        quality: quality, // FIX: Send the string value
        recommended,
      });
      toast.success("Review submitted successfully! 🎉");
      // Reset form state
      setRating(0);
      setTitle("");
      setComment("");
      setSizeFit(undefined);
      setQuality("");
      setRecommended(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border p-6 rounded-lg shadow-sm bg-white max-w-2xl mx-auto">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Write a Review</h3>
      
      <div className="space-y-6">
        {/* IMPROVEMENT: Interactive Star Rating */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Overall Rating*</label>
          <StarRatingInput rating={rating} setRating={setRating} />
        </div>

        <div>
          <label htmlFor="title" className="block mb-2 font-medium text-gray-700">Review Title*</label>
          <input
            id="title"
            type="text"
            className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 transition"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Best purchase ever!"
          />
        </div>

        <div>
          <label htmlFor="comment" className="block mb-2 font-medium text-gray-700">Your Review*</label>
          <textarea
            id="comment"
            rows={4}
            className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 transition"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us more about the product..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* IMPROVEMENT: Radio buttons for Size Fit */}
            <div>
                <label className="block mb-2 font-medium text-gray-700">Size Fit</label>
                <div className="flex flex-col space-y-2">
                    {["Too Small", "True to Size", "Too Large"].map((fit) => (
                        <label key={fit} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="sizeFit"
                                value={fit}
                                checked={sizeFit === fit}
                                onChange={(e) => setSizeFit(e.target.value as any)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                            />
                            {fit}
                        </label>
                    ))}
                </div>
            </div>
            {/* FIX & IMPROVEMENT: Quality dropdown with string values */}
            <div>
                <label htmlFor="quality" className="block mb-2 font-medium text-gray-700">Quality</label>
                <select
                    id="quality"
                    className="border p-2 rounded w-full bg-white focus:ring-2 focus:ring-blue-500 transition"
                    value={quality}
                    onChange={(e) => setQuality(e.target.value)}
                >
                    <option value="" disabled>Select Quality</option>
                    {Object.entries(qualityOptions).map(([value, label]) => (
                        <option key={value} value={label}>
                            {value} - {label}
                        </option>
                    ))}
                </select>
            </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <input
            id="recommended"
            type="checkbox"
            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            checked={recommended}
            onChange={(e) => setRecommended(e.target.checked)}
          />
          <label htmlFor="recommended" className="font-medium text-gray-700">
            Would you recommend this product?
          </label>
        </div>

        <button
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </div>
  );
};