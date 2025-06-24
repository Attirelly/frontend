'use client';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { manrope, playfair_display } from '@/font';

export default function DynamicFilterSkeleton() {
  return (
    <div className="sticky top-20 z-10">
      <div
        className={`${manrope.className} h-[calc(100vh-5rem)] overflow-y-auto max-w-xs p-4 bg-[#FFFAFA] rounded-lg shadow-sm border border-gray-200 relative`}
        style={{ fontWeight: 500 }}
      >
        <div className="flex items-center justify-between mb-3">
          <Skeleton width={80} height={24} />
          <Skeleton circle width={20} height={20} />
        </div>

        <Skeleton height={1} className="my-4" />

        {[...Array(4)].map((_, i) => (
          <div key={i} className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <Skeleton width={100} height={18} />
              <Skeleton circle width={20} height={20} />
            </div>

            <Skeleton height={28} className="mb-3 w-full" />

            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="flex items-center gap-2">
                  <Skeleton circle width={16} height={16} />
                  <Skeleton width={120} height={16} />
                </div>
              ))}
            </div>
            <Skeleton height={1} className="my-4" />
          </div>
        ))}

        <Skeleton height={36} width={120} className="mt-4" />
      </div>
    </div>
  );
}
