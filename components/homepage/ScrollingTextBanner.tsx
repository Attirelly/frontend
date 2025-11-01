'use client';

import { manrope } from '@/font';
import { useRef } from 'react';

const res = [
  { text: 'Get access to 500+ design labels and premium retail brands at one place' },
  { text: 'From wedding wear to daily wear' },
];


/**
 * ScrollingTextBanner component
 * 
 * A component that creates a continuously scrolling horizontal text banner (marquee)
 * using pure CSS animations.
 *
 * ## Features
 * - Displays a seamless, infinitely scrolling line of text.
 * - The animation is created entirely with CSS using `@keyframes`, making it lightweight and performant.
 * - The animation pauses when the user hovers over the text, improving readability and user experience.
 * - The text content is easily configurable via a local constant array.
 * - Uses styled-jsx for component-scoped CSS, a feature built into Next.js.
 *
 * ## Logic Flow
 * 1.  The component's text content is defined in the `res` constant array.
 * 2.  A single string, `fullText`, is created by joining the text snippets from the `res` array.
 * 3.  To achieve a seamless loop, this `fullText` string is duplicated in the JSX.
 * 4.  A CSS animation named `marquee` translates the text container horizontally from `translateX(0%)` to `translateX(-50%)`.
 * 5.  When the animation reaches `-50%`, the first half of the duplicated text is exactly off-screen, and the second half is perfectly aligned where the first half began. The `infinite` property then restarts the animation, creating a flawless loop.
 * 6.  This component is purely presentational and contains no internal state or side effects.
 *
 * ## Key Data Structures
 * - **res**: A local constant array of objects, where each object contains a `text` property (string) to be displayed in the banner.
 *
 * ## Imports
 * - **Utilities**: `manrope` from `@/font` for consistent typography.
 *
 * ## API Calls
 * - This component does not make any API calls.
 *
 * ## Props
 * - This component does not accept any props.
 *
 * @returns {JSX.Element} The rendered scrolling text banner.
 */
export default function ScrollingTextBanner() {
  const fullText = res.map((item) => item.text).join('   •   ');

  return (
    <div className="w-full overflow-hidden bg-black py-4">
      <div className="relative h-3 md:h-2 flex items-center group cursor-pointer">
        <div className="marquee-track ">
          <span className={`${manrope.className} marquee-text text-white text-xl md:text-xl font-semibold`}>
            {fullText}   •   {fullText}
          </span>
        </div>
      </div>

      <style jsx>{`
        .marquee-track {
          display: flex;
          white-space: nowrap;
          overflow: hidden;
        }

        .marquee-text {
          display: inline-block;
          animation: marquee 40s linear infinite;
          animation-play-state: running;
        }
        
        .group:hover .marquee-text {
          animation-play-state: paused;
        }

        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
