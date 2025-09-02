// // 'use client';

// // import { useState } from 'react';
// // import Image from 'next/image';
// // import CardTypeFour from "../cards/CardTypeFour";

// // interface CardData {
// //   id: string;
// //   imageUrl: string;
// //   discountText?: string;
// //   title: string;
// //   description?: string;
// // }

// // const cards: CardData[] = [
// //   { id: '1', imageUrl: '/Homepage/CardTypeOne.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana' },
// //   { id: '2', imageUrl: '/Homepage/CardTypeOne.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana' },
// //   { id: '3', imageUrl: '/Homepage/CardTypeOne.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana' },
// //   { id: '4', imageUrl: '/Homepage/CardTypeOne.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana' },
// //   { id: '5', imageUrl: '/Homepage/CardImage.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana' },
// //   { id: '6', imageUrl: '/Homepage/CardTypeOne.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana' },
// //   { id: '7', imageUrl: '/Homepage/CardTypeOne.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana' },
// //   { id: '8', imageUrl: '/Homepage/CardTypeTwo.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana' },
// //   { id: '9', imageUrl: '/Homepage/CardTypeOne.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana' },
// //   { id: '10', imageUrl: '/Homepage/CardTypeOne.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana' },
// // ];

// // export default function SectionTwoContainer() {
// //   const [startIndex, setStartIndex] = useState(0);
// //   const visibleCount = 6;
// //   const cardWidth = 184; // Width of each card
// //   const gap = 20; // Tailwind gap-5 = 1.25rem = 20px
// //   const maxIndex = cards.length - visibleCount;

// //   const handleNext = () => {
// //     setStartIndex((prev) => Math.min(prev + 1, maxIndex));
// //   };

// //   const handlePrev = () => {
// //     setStartIndex((prev) => Math.max(prev - 1, 0));
// //   };

// //   const translateX = startIndex * (cardWidth + gap);

// //   return (
// //     <div className="relative w-full px-20 overflow-hidden">
// //       {/* Navigation Arrows */}
// //       <button
// //         onClick={handlePrev}
// //         disabled={startIndex === 0}
// //         className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#D9D9D9] shadow-md rounded-full w-10 h-10 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
// //       >
// //         <Image
// //           src="/Homepage/left_arrow.svg"
// //           alt="Left arrow"
// //           width={7}
// //           height={7}
// //         />
// //       </button>

// //       <div className="overflow-hidden">
// //         <div
// //           className="flex gap-8 transition-transform duration-500 ease-in-out"
// //           style={{
// //             transform: `translateX(-${translateX}px)`,
// //           }}
// //         >
// //           {cards.map((card) => (
// //             <div
// //               key={card.id}
// //               style={{ minWidth: `${cardWidth}px` }}
// //               onClick={() => console.log(card.id)}
// //             >
// //               <CardTypeFour
// //                 imageUrl={card.imageUrl}
// //                 title={card.title}
// //                 description={card.description || ''}
// //               />
// //             </div>
// //           ))}
// //         </div>
// //       </div>

// //       <button
// //         onClick={handleNext}
// //         disabled={startIndex === maxIndex}
// //         className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#D9D9D9] shadow-md rounded-full w-10 h-10 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
// //       >
// //         <Image
// //           src="/Homepage/right_arrow.svg"
// //           alt="Left arrow"
// //           width={7}
// //           height={7}
// //         />
// //       </button>
// //     </div>
// //   );
// // }

// 'use client';

// import { useState } from 'react';
// import Image from 'next/image';
// import CardTypeFour from "../cards/CardTypeFour";

// interface CardData {
//     id: string;
//     imageUrl: string;
//     discountText?: string;
//     title: string;
//     description?: string;
// }

// const cards: CardData[] = [
//     { id: '1', imageUrl: '/Homepage/CardTypeOne.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana' },
//     { id: '2', imageUrl: '/Homepage/CardTypeOne.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana' },
//     { id: '3', imageUrl: '/Homepage/CardTypeOne.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana' },
//     { id: '4', imageUrl: '/Homepage/CardTypeOne.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana' },
//     { id: '5', imageUrl: '/Homepage/CardImage.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana' },
//     { id: '6', imageUrl: '/Homepage/CardTypeOne.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana' },
//     { id: '7', imageUrl: '/Homepage/CardTypeOne.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana' },
//     { id: '8', imageUrl: '/Homepage/CardTypeTwo.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana' },
//     { id: '9', imageUrl: '/Homepage/CardTypeOne.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana' },
//     { id: '10', imageUrl: '/Homepage/CardTypeOne.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana' },
// ];

// export default function SectionTwoContainer() {
//     const [startIndex, setStartIndex] = useState(0);
//     const visibleCount = 6;
//     const cardWidth = 184; // Width of each card
//     const gap = 20; // Tailwind gap-5 = 1.25rem = 20px
//     const maxIndex = cards.length > visibleCount ? cards.length - visibleCount : 0;

//     const handleNext = () => {
//         setStartIndex((prev) => Math.min(prev + 1, maxIndex));
//     };

//     const handlePrev = () => {
//         setStartIndex((prev) => Math.max(prev - 1, 0));
//     };

//     const translateX = startIndex * (cardWidth + gap);

//     return (
//         <div className="relative w-full px-20 overflow-hidden">
//             {/* Navigation Arrows */}
//             <button
//                 onClick={handlePrev}
//                 disabled={startIndex === 0}
//                 className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#D9D9D9] shadow-md rounded-full w-10 h-10 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//                 <Image
//                     src="/Homepage/left_arrow.svg"
//                     alt="Left arrow"
//                     width={7}
//                     height={7}
//                 />
//             </button>

//             <div className="overflow-hidden">
//                 <div
//                     className="flex gap-8 transition-transform duration-500 ease-in-out"
//                     style={{
//                         transform: `translateX(-${translateX}px)`,
//                     }}
//                 >
//                     {cards.map((card) => (
//                         <div
//                             key={card.id}
//                             style={{ minWidth: `${cardWidth}px` }}
//                         >
//                             <CardTypeFour
//                                 imageUrl={card.imageUrl}
//                                 title={card.title}
//                                 description={card.description || ''}
//                             />
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             <button
//                 onClick={handleNext}
//                 disabled={startIndex === maxIndex}
//                 className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#D9D9D9] shadow-md rounded-full w-10 h-10 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//                 <Image
//                     src="/Homepage/right_arrow.svg"
//                     alt="Right arrow"
//                     width={7}
//                     height={7}
//                 />
//             </button>
//         </div>
//     );
// }

'use client';

import { useRef } from 'react';
import Image from 'next/image';
import CardTypeFour from "../cards/CardTypeFour";

interface CardData {
    id: string;
    imageUrl: string;
    title: string;
    description?: string;
}

// Your data can be fetched from an API or be static like this
const cards: CardData[] = [
    { id: '1', imageUrl: '/Homepage/CardTypeOne.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana' },
    { id: '2', imageUrl: '/Homepage/CardTypeOne.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana' },
    { id: '3', imageUrl: '/Homepage/CardTypeOne.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana' },
    { id: '4', imageUrl: '/Homepage/CardTypeOne.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana' },
    { id: '5', imageUrl: '/Homepage/CardImage.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana' },
    { id: '6', imageUrl: '/Homepage/CardTypeOne.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana' },
    { id: '7', imageUrl: '/Homepage/CardTypeOne.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana' },
    { id: '8', imageUrl: '/Homepage/CardTypeTwo.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana' },
];

export default function SectionTwoContainer() {
    // CHANGED: Use a ref to get direct access to the scrollable element
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // REMOVED: All state and calculations for startIndex and translateX are gone.

    // CHANGED: Navigation logic now directly manipulates the scroll position
    const handleNext = () => {
        if (scrollContainerRef.current) {
            const scrollAmount = scrollContainerRef.current.offsetWidth;
            scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const handlePrev = () => {
        if (scrollContainerRef.current) {
            const scrollAmount = scrollContainerRef.current.offsetWidth;
            scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        // CHANGED: Main container is now fluid and has responsive padding
        <div className="relative w-full max-w-7xl mx-auto px-4">
            <button
                onClick={handlePrev}
                className="absolute z-10 left-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center cursor-pointer"
            >
                <Image src="/Homepage/left_arrow.svg" alt="Left arrow" width={7} height={7} />
            </button>

            {/* CHANGED: This is now a flex container for the carousel */}
            <div
                ref={scrollContainerRef}
                className="flex w-full space-x-4 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-none px-2"
            >
                {cards.map((card) => (
                    // CHANGED: This wrapper div defines the responsive width of each card
                    <div key={card.id} className="flex-shrink-0 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 snap-start">
                        <CardTypeFour
                            imageUrl={card.imageUrl}
                            title={card.title}
                            description={card.description || ''}
                        />
                    </div>
                ))}
            </div>

            <button
                onClick={handleNext}
                className="absolute z-10 right-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center cursor-pointer"
            >
                <Image src="/Homepage/right_arrow.svg" alt="Right arrow" width={7} height={7} />
            </button>
        </div>
    );
}

// NOTE: Make sure this utility class is in your global CSS file (e.g., globals.css)
/*
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
*/