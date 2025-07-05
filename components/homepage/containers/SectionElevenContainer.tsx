'use client';

import { useState } from 'react';
import Image from 'next/image';
import CardTypeThree from '../cards/CardTypeThree';
import { manrope } from '@/font';
import CardTypeFour from '../cards/CardTypeFour';

interface CardData {
  id: string;
  imageUrl: string;
  discountText?: string;
  title: string;
  description?: string;
}

const cards: CardData[] = [
  { id: '1', imageUrl: '/Homepage/CardTypeOne.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana' },
  { id: '2', imageUrl: '/Homepage/CardTypeOne.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana' },
  { id: '3', imageUrl: '/Homepage/CardTypeOne.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana' },
  { id: '4', imageUrl: '/Homepage/CardTypeOne.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana' },
  { id: '5', imageUrl: '/Homepage/CardImage.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana' },
  { id: '6', imageUrl: '/Homepage/CardTypeOne.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana' },
  { id: '7', imageUrl: '/Homepage/CardTypeOne.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana' },
  { id: '8', imageUrl: '/Homepage/CardTypeTwo.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana' },
  { id: '9', imageUrl: '/Homepage/CardTypeOne.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana' },
  { id: '10', imageUrl: '/Homepage/CardTypeOne.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana' },
];

export default function SectionElevenContainer() {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 6;
  const cardWidth = 184; // Width of each card
  const gap = 20; // Tailwind gap-5 = 1.25rem = 20px
  const maxIndex = cards.length - visibleCount;

  const handleNext = () => {
    setStartIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - 1, 0));
  };

  const translateX = startIndex * (cardWidth + gap);

  return (
    <div className='w-[1242px]  mx-auto space-y-8'>
      <div className='flex justify-between'>
        <span className={`${manrope.className} text-3xl text-[#242424]`} style={{ fontWeight: 400 }}>NEW ARRIVALS</span>
        <div className='flex items-center gap-2'>
          <span className={`${manrope.className} text-base text-[#242424]`} style={{ fontWeight: 400 }}>View All</span>
          <Image
            src="/Homepage/right_arrow.svg"
            alt="View All"
            width={5}
            height={5} />

        </div>

      </div>

      <div className="relative">
        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          disabled={startIndex === 0}
          className="absolute z-10 -left-15 top-1/2 -translate-y-1/2 bg-[#D9D9D9] shadow-md rounded-full w-10 h-10 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
        >
          <Image
            src="/Homepage/left_arrow.svg"
            alt="Left arrow"
            width={7}
            height={7}
          />
        </button>

        <div className="overflow-hidden">
          <div
            className="flex gap-6 transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${translateX}px)`,
            }}
          >
            {cards.map((card) => (
              <div
                key={card.id}
                style={{ minWidth: `${cardWidth}px` }}
                onClick={() => console.log(card.id)}
              >
                <CardTypeFour
                  imageUrl={card.imageUrl}
                  title={card.title}
                  description={card.description || ''}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={startIndex === maxIndex}
          className="absolute  -right-10 translate-x-1/2 top-1/2 -translate-y-1/2 bg-[#D9D9D9] shadow-md rounded-full w-10 h-10 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
        >
          <Image
            src="/Homepage/right_arrow.svg"
            alt="Left arrow"
            width={7}
            height={7}
          />
        </button>
      </div>
    </div>
  );
}