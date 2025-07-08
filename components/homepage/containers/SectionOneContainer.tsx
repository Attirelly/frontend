'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import CardTypeThree from '../cards/CardTypeThree';
import { manrope } from '@/font';
import { useRouter } from 'next/navigation';

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

export default function SectionTwoContainer() {
    const [startIndex, setStartIndex] = useState(0);
    const visibleCount = 5;
    const cardWidth = 232; // Width of each card
    const gap = 20; // Tailwind gap-5 = 1.25rem = 20px
    const maxIndex = cards.length - visibleCount;
    const [viewAll, setViewAll] = useState('');
    const router = useRouter();



    useEffect(() => {
        const fetchSegmentInfo = async () => {
            try {
                // API call to fetch segment information
                const url = 'https://google.com/';
                setViewAll(url);
                router.prefetch(url);
            }
            catch (error) {
                console.log('failed to fetch segment information');
            }
        }


        fetchSegmentInfo();
    }, [])

    const handleViewAllClick = () => {
        router.push(viewAll);
    };

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
                <div className='flex items-center gap-2'
                onClick={handleViewAllClick}>
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
                    className="absolute z-10 left-0 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-[#D9D9D9] shadow-md rounded-full w-10 h-10 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
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
                        className="flex gap-5 transition-transform duration-500 ease-in-out"
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
                    className="absolute  right-0 translate-x-1/2 top-1/2 -translate-y-1/2 bg-[#D9D9D9] shadow-md rounded-full w-10 h-10 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
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



// 'use client';

// import { useState } from 'react';
// import Image from 'next/image';
// import CardTypeOne from '../cards/CardTypeOne';

// interface CardData {
//     id: string;
//     imageUrl: string;
//     discountText: string;
//     title: string;
//     description?: string;
// }

// const cards: CardData[] = [
//     { id: '1', imageUrl: '/Homepage/CardTypeOne.svg', discountText: '23', title: 'Embroidary Kurta' },
//     { id: '2', imageUrl: '/Homepage/CardTypeOne.svg', discountText: '23', title: 'Embroidary Kurta' },
//     { id: '3', imageUrl: '/Homepage/CardTypeOne.svg', discountText: '23', title: 'Embroidary Kurta' },
//     { id: '4', imageUrl: '/Homepage/CardTypeOne.svg', discountText: '23', title: 'Embroidary Kurta' },
//     { id: '5', imageUrl: '/Homepage/CardTypeOne.svg', discountText: '23', title: 'Embroidary Kurta' },
//     { id: '6', imageUrl: '/Homepage/CardTypeOne.svg', discountText: '23', title: 'Embroidary Kurta' },
//     { id: '7', imageUrl: '/Homepage/CardTypeOne.svg', discountText: '23', title: 'Embroidary Kurta' },
//     { id: '8', imageUrl: '/Homepage/CardTypeOne.svg', discountText: '23', title: 'Embroidary Kurta' },
//     { id: '9', imageUrl: '/Homepage/CardTypeOne.svg', discountText: '23', title: 'Embroidary Kurta' },
//     { id: '10', imageUrl: '/Homepage/CardTypeOne.svg', discountText: '23', title: 'Embroidary Kurta' },
//     { id: '11', imageUrl: '/Homepage/CardTypeOne.svg', discountText: '23', title: 'Embroidary Kurta' },
// ];

// export default function CardStack() {
//     const [centerIndex, setCenterIndex] = useState(2); // Start with third card centered

//     const handleNext = () => {
//         setCenterIndex((prev) => Math.min(prev + 1, cards.length - 1));
//     };

//     const handlePrev = () => {
//         setCenterIndex((prev) => Math.max(prev - 1, 0));
//     };

//     const start = Math.max(0, centerIndex - 2);
//     const end = Math.min(cards.length, centerIndex + 3);
//     const visibleCards = cards.slice(start, end);
//     const centerOffset = centerIndex - start;

//     return (
//         <div className="relative w-full flex items-center justify-center py-30 px-20">
//             {/* Left Arrow */}
//             <button
//                 onClick={handlePrev}
//                 disabled={centerIndex === 0}
//                 className="absolute left-4 z-30 bg-[#D9D9D9] shadow-md rounded-full w-10 h-10 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//                 <Image
//                     src="/Homepage/left_arrow.svg"
//                     alt="Left arrow"
//                     width={7}
//                     height={7}
//                 />
//             </button>


//             {/* Card Stack */}
//             <div className="relative flex items-center justify-center w-full h-[588px]">
//                 {visibleCards.map((card, i) => {
//                     const offset = i - centerOffset;
//                     const zIndex = 10 - Math.abs(offset);
//                     const cardWidth = 392;
//                     const overlap = cardWidth * 0.5;
//                     const translateX = offset * overlap;
//                     const scale = offset === 0 ? 1 : 0.9;

//                     // Height tiers based on offset
//                     let heightClass = 'h-full'; // center
//                     if (Math.abs(offset) === 1) heightClass = 'h-[588px]';
//                     if (Math.abs(offset) === 2) heightClass = 'h-[530px]';

//                     return (
//                         <div
//                             key={card.id}
//                             className={`absolute w-[392px] ${heightClass}`}
//                             style={{
//                                 transform: `translateX(${translateX}px) scale(${scale})`,
//                                 zIndex,
//                                 transition: 'transform 600ms cubic-bezier(0.25, 1, 0.5, 1), height 600ms ease',
//                                 willChange: 'transform, height',
//                             }}
//                             onClick={() => console.log(`Clicked card ${card.id}`)}
//                         >
//                             <CardTypeOne
//                                 imageUrl={card.imageUrl}
//                                 discountText={card.discountText}
//                                 title={card.title}
//                                 description={card.description}
//                             />
//                         </div>
//                     );
//                 })}
//             </div>

//             {/* Right Arrow */}
//             <button
//                 onClick={handleNext}
//                 disabled={centerIndex === cards.length - 1}
//                 className="absolute right-4 z-30 bg-[#D9D9D9] shadow-md rounded-full p-2 w-10 h-10 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//                 <Image
//                     src="/Homepage/right_arrow.svg"
//                     alt="Left arrow"
//                     width={7}
//                     height={7}
//                 />
//             </button>
//         </div>
//     );
// }
