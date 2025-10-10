// app/reviews/page.tsx
"use client";

import { ProductReviewForm } from "@/components/reviewComponent/ProductReviewForm";
import { ProductReviewList } from "@/components/reviewComponent/ProductReviewList";
import { ProductReviewStats } from "@/components/reviewComponent/ProductReviewStats";



interface ReviewsPageProps {
  productId: string;
  variantId?: string;
}

export default function ReviewsPage({ productId, variantId }: ReviewsPageProps) {
  return (
    <div className="max-w-3xl mx-auto py-6 px-4 space-y-6">
      {/* Stats Section */}
      <ProductReviewStats productId={'1fe17908-01c4-4ef0-8cf5-de0f2efef6d0'} />

      {/* Reviews List Section */}
      <ProductReviewList productId={'1fe17908-01c4-4ef0-8cf5-de0f2efef6d0'} />

      {/* Review Form Section */}
      <ProductReviewForm productId={productId} variantId={variantId} />
    </div>
  );
}
