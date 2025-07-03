'use client';

import { useState } from 'react';
import Image from 'next/image';
import CardTypeOne from '../cards/CardTypeOne';

interface CardData {
    id: string;
    imageUrl: string;
    discountText: string;
    title: string;
    description?: string;
}

const cards: CardData[] = [
    { id: '1', imageUrl: '/Homepage/CardTypeOne.svg', discountText: '23', title: 'Embroidary Kurta' },
    { id: '2', imageUrl: '/Homepage/CardTypeOne.svg', discountText: '23', title: 'Embroidary Kurta' },
    { id: '3', imageUrl: '/Homepage/CardTypeOne.svg', discountText: '23', title: 'Embroidary Kurta' },
    { id: '4', imageUrl: '/Homepage/CardTypeOne.svg', discountText: '23', title: 'Embroidary Kurta' },
    { id: '5', imageUrl: '/Homepage/CardTypeOne.svg', discountText: '23', title: 'Embroidary Kurta' },
    { id: '6', imageUrl: '/Homepage/CardTypeOne.svg', discountText: '23', title: 'Embroidary Kurta' },
    { id: '7', imageUrl: '/Homepage/CardTypeOne.svg', discountText: '23', title: 'Embroidary Kurta' },
    { id: '8', imageUrl: '/Homepage/CardTypeOne.svg', discountText: '23', title: 'Embroidary Kurta' },
    { id: '9', imageUrl: '/Homepage/CardTypeOne.svg', discountText: '23', title: 'Embroidary Kurta' },
    { id: '10', imageUrl: '/Homepage/CardTypeOne.svg', discountText: '23', title: 'Embroidary Kurta' },
    { id: '11', imageUrl: '/Homepage/CardTypeOne.svg', discountText: '23', title: 'Embroidary Kurta' },
];

export default function CardStack() {
    const [centerIndex, setCenterIndex] = useState(2); // Start with third card centered

    const handleNext = () => {
        setCenterIndex((prev) => Math.min(prev + 1, cards.length - 1));
    };

    const handlePrev = () => {
        setCenterIndex((prev) => Math.max(prev - 1, 0));
    };

    const start = Math.max(0, centerIndex - 2);
    const end = Math.min(cards.length, centerIndex + 3);
    const visibleCards = cards.slice(start, end);
    const centerOffset = centerIndex - start;

    return (
        <div className="relative w-full flex items-center justify-center py-30 px-20">
            {/* Left Arrow */}
            <button
                onClick={handlePrev}
                disabled={centerIndex === 0}
                className="absolute left-4 z-30 bg-[#D9D9D9] shadow-md rounded-full w-10 h-10 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Image
                    src="/Homepage/left_arrow.svg"
                    alt="Left arrow"
                    width={7}
                    height={7}
                />
            </button>


            {/* Card Stack */}
            <div className="relative flex items-center justify-center w-full h-[588px]">
                {visibleCards.map((card, i) => {
                    const offset = i - centerOffset;
                    const zIndex = 10 - Math.abs(offset);
                    const cardWidth = 392;
                    const overlap = cardWidth * 0.5;
                    const translateX = offset * overlap;
                    const scale = offset === 0 ? 1 : 0.9;

                    // Height tiers based on offset
                    let heightClass = 'h-full'; // center
                    if (Math.abs(offset) === 1) heightClass = 'h-[588px]';
                    if (Math.abs(offset) === 2) heightClass = 'h-[530px]';

                    return (
                        <div
                            key={card.id}
                            className={`absolute w-[392px] ${heightClass}`}
                            style={{
                                transform: `translateX(${translateX}px) scale(${scale})`,
                                zIndex,
                                transition: 'transform 600ms cubic-bezier(0.25, 1, 0.5, 1), height 600ms ease',
                                willChange: 'transform, height',
                            }}
                            onClick={() => console.log(`Clicked card ${card.id}`)}
                        >
                            <CardTypeOne
                                imageUrl={card.imageUrl}
                                discountText={card.discountText}
                                title={card.title}
                                description={card.description}
                            />
                        </div>
                    );
                })}
            </div>

            {/* Right Arrow */}
            <button
                onClick={handleNext}
                disabled={centerIndex === cards.length - 1}
                className="absolute right-4 z-30 bg-[#D9D9D9] shadow-md rounded-full p-2 w-10 h-10 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
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
