'use client';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { manrope, playfair_display } from '@/font';


/**
 * DynamicFilterSkeleton
 * 
 * A skeleton loader component that mimics the layout and structure of the main
 * filter sidebar. It is displayed to the user while the actual filter data is being fetched,
 * improving perceived performance and preventing content layout shifts.
 *
 * ## Features
 * - **Layout Mimicry**: Carefully structured to match the key UI elements of the real filter component, including a main header, multiple filter sections, search bars, and lists of options.
 * - **Shimmer Effect**: Uses the `react-loading-skeleton` library to render gray, shimmering placeholders for a modern loading aesthetic.
 * - **Consistent Structure**: Uses loops to render a consistent and representative placeholder for multiple filter groups.
 *
 * ## Purpose
 * This component's primary role is to enhance the User Experience (UX) during data loading periods.
 * By rendering a component with the same dimensions as the final content, it prevents the page layout
 * from jarringly shifting when the real data arrives (a problem known as Cumulative Layout Shift - CLS).
 *
 * ## Logic Flow
 * - This component is purely presentational and stateless.
 * - It has no internal logic or data fetching; it simply renders a static structure of placeholder elements.
 *
 * ## Imports
 * - **Core/Libraries**:
 *    - `Skeleton` from `react-loading-skeleton`: The primary component for creating placeholder elements.
 *    - `react-loading-skeleton/dist/skeleton.css`: The necessary stylesheet for the skeleton library.
 * - **Utilities**:
 *    - `manrope`, `playfair_display` from `@/font`: For applying consistent font styles to the container.
 *
 * ## API Calls
 * - This component does not make any API calls.
 *
 * ## Props
 * - This component does not accept any props.
 *
 * @returns {JSX.Element} The rendered skeleton loader for the filter sidebar.
 */
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
