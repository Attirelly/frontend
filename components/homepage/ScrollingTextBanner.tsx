'use client';

import { manrope } from '@/font';
import { useRef } from 'react';

const res = [
  { text: 'Get access to 500+ design labels and premium retail brands at one place' },
  { text: 'From wedding wear to daily wear' },
];


export default function ScrollingTextBanner() {
  const fullText = res.map((item) => item.text).join('   •   ');

  return (
    <div className="w-full overflow-hidden bg-black py-4">
      <div className="relative h-10 flex items-center">
        <div className="marquee-track">
          <span className={`${manrope.className} marquee-text text-white text-2xl font-semibold hover:[animation-play-state:paused]`}>
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
