'use client';

import { useState } from 'react';
import Image from 'next/image';
import CardTypeThree from '../cards/CardTypeThree';

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
  { id: '11', imageUrl: '/Homepage/CardTypeFive.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana' },
];

export default function SectionTwoContainer() {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 5;
  const cardWidth = 232; // Width of each card
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
    <div className="relative w-full py-20 px-20 overflow-hidden">
      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        disabled={startIndex === 0}
        className="absolute left-4 top-1/2 bg-[#D9D9D9] shadow-md rounded-full w-10 h-10 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
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
              <CardTypeThree
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
        className="absolute right-4 top-1/2 bg-[#D9D9D9] shadow-md rounded-full w-10 h-10 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Image
          src="/Homepage/right_arrow.svg"
          alt="Left arrow"
          width={7}
          height={7}
        />
      </button>
    </div>
  );
}
