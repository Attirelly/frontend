// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import Image from 'next/image';
// import CardTypeOne from '../cards/CardTypeOne';
// import { api } from '@/lib/axios';
// import { manrope } from '@/font';

// interface CardData {
//     id: string;
//     imageUrl: string;
//     discountText?: string;
//     title: string;
//     description?: string;
// }

// const SECTION_NUMBER = 4;

// export default function CardStack() {
//     const [centerIndex, setCenterIndex] = useState(2);
//     const [viewAll, setViewAll] = useState('');
//     const [name, setName] = useState('');
//     const [products, setProducts] = useState<CardData[]>([]);

//     // Fetch data
//     useEffect(() => {
//         const fetchSegmentInfo = async () => {
//             try {
//                 const res = await api.get(`homepage/get_products_by_section_number/${SECTION_NUMBER}`);
//                 const productData = res.data;
                
//                 const formattedProducts: CardData[] = productData.map((p) => ({
//                     id: p.product_id,
//                     imageUrl: p.images[0].image_url || '/Homepage/CardTypeOne.svg',
//                     title: p.product_name,
//                     description: `${p.stores.area.name}, ${p.stores.city.name}`,
//                 }));
//                 setProducts(formattedProducts);

//                 const resSection = await api.get(`/homepage/get_section_by_number/${SECTION_NUMBER}`);
//                 const sectionData = resSection.data;
//                 setViewAll(sectionData.section_url);
//                 setName(sectionData.section_name);
//             } catch (error) {
//                 console.error(error);
//             }
//         };
//         fetchSegmentInfo();
//     }, []);

//     // Handle infinite navigation
//     const handleNext = useCallback(() => {
//         setCenterIndex(prev => (prev + 1) % products.length);
//     }, [products.length]);

//     const handlePrev = useCallback(() => {
//         setCenterIndex(prev => (prev - 1 + products.length) % products.length);
//     }, [products.length]);

//     // Get visible cards with wrap-around logic
//     const getVisibleCards = useCallback(() => {
//         if (products.length === 0) return [];
        
//         const visibleIndices = [];
//         const totalCards = products.length;
        
//         // Always show 5 cards (2 left, center, 2 right)
//         for (let i = -2; i <= 2; i++) {
//             let index = centerIndex + i;
            
//             // Handle wrap-around for negative indices
//             if (index < 0) {
//                 index += totalCards;
//             } 
//             // Handle wrap-around for indices beyond array length
//             else if (index >= totalCards) {
//                 index -= totalCards;
//             }
            
//             visibleIndices.push(index);
//         }
        
//         return visibleIndices.map(index => ({
//             ...products[index],
//             originalIndex: index,
//             offset: (index - centerIndex + totalCards) % totalCards > totalCards / 2 
//                 ? (index - centerIndex + totalCards) % totalCards - totalCards
//                 : (index - centerIndex + totalCards) % totalCards
//         }));
//     }, [centerIndex, products]);

//     const visibleCards = getVisibleCards();

//     return (
//         <div className='flex flex-col gap-8 items-center'>
//             <span className={`${manrope.className} text-3xl text-[#242424]`} style={{ fontWeight: 400 }}>{name}</span>
//             <div className="relative w-full flex items-center justify-center px-20">
//                 {/* Left Arrow */}
//                 <button
//                     onClick={handlePrev}
//                     className="absolute left-4 z-30 bg-[#D9D9D9] shadow-md rounded-full w-10 h-10 flex items-center justify-center cursor-pointer"
//                 >
//                     <Image
//                         src="/Homepage/left_arrow.svg"
//                         alt="Left arrow"
//                         width={7}
//                         height={7}
//                     />
//                 </button>

//                 {/* Card Stack */}
//                 <div className="relative flex items-center justify-center w-full h-[588px]">
//                     {visibleCards.map((card) => {
//                         const offset = card.offset;
//                         const zIndex = 10 - Math.abs(offset);
//                         const cardWidth = 392;
//                         const overlap = cardWidth * 0.3;
//                         const translateX = offset * overlap;
//                         const scale = offset === 0 ? 1 : 0.9;

//                         // Height tiers based on offset
//                         let heightClass = 'h-full'; // center
//                         if (Math.abs(offset) === 1) heightClass = 'h-[588px]';
//                         if (Math.abs(offset) === 2) heightClass = 'h-[530px]';

//                         return (
//                             <div
//                                 key={`${card.id}-${card.originalIndex}`}
//                                 className={`absolute w-[392px] ${heightClass}`}
//                                 style={{
//                                     transform: `translateX(${translateX}px) scale(${scale})`,
//                                     zIndex,
//                                     transition: 'transform 600ms cubic-bezier(0.25, 1, 0.5, 1), height 600ms ease',
//                                     willChange: 'transform, height',
//                                 }}
//                             >
//                                 <a
//                                     href={`/product_detail/${card.id}`}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                 >
//                                     <CardTypeOne
//                                         imageUrl={card.imageUrl}
//                                         title={card.title}
//                                         description={card.description}
//                                     />
//                                 </a>
//                             </div>
//                         );
//                     })}
//                 </div>

//                 {/* Right Arrow */}
//                 <button
//                     onClick={handleNext}
//                     className="absolute right-4 z-30 bg-[#D9D9D9] shadow-md rounded-full p-2 w-10 h-10 flex items-center justify-center cursor-pointer"
//                 >
//                     <Image
//                         src="/Homepage/right_arrow.svg"
//                         alt="Right arrow"
//                         width={7}
//                         height={7}
//                     />
//                 </button>
//             </div>
//         </div>
//     );
// }


'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import CardTypeOne from '../cards/CardTypeOne';
import { api } from '@/lib/axios';
import { manrope } from '@/font';

interface CardData {
    id: string;
    imageUrl: string;
    discountText?: string;
    title: string;
    description?: string;
}

const SECTION_NUMBER = 4;

export default function CardStack() {
    const [centerIndex, setCenterIndex] = useState(2);
    const [viewAll, setViewAll] = useState('');
    const [name, setName] = useState('');
    const [products, setProducts] = useState<CardData[]>([]);

    // Fetch data
    useEffect(() => {
        const fetchSegmentInfo = async () => {
            try {
                const res = await api.get(`homepage/get_products_by_section_number/${SECTION_NUMBER}`);
                const productData = res.data;

                const formattedProducts: CardData[] = productData.map((p: any) => ({
                    id: p.product_id,
                    imageUrl: p.images?.[0]?.image_url || '/Homepage/CardTypeOne.svg',
                    title: p.product_name,
                    description: `${p.stores?.area?.name || ''}, ${p.stores?.city?.name || ''}`,
                }));
                setProducts(formattedProducts);

                const resSection = await api.get(`/homepage/get_section_by_number/${SECTION_NUMBER}`);
                const sectionData = resSection.data;
                setViewAll(sectionData.section_url);
                setName(sectionData.section_name);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };
        fetchSegmentInfo();
    }, []);

    // Handle infinite navigation
    const handleNext = useCallback(() => {
        if (products.length > 0) {
            setCenterIndex(prev => (prev + 1) % products.length);
        }
    }, [products.length]);

    const handlePrev = useCallback(() => {
        if (products.length > 0) {
            setCenterIndex(prev => (prev - 1 + products.length) % products.length);
        }
    }, [products.length]);

    // Get visible cards with wrap-around logic
    const getVisibleCards = useCallback(() => {
        if (products.length === 0) return [];

        const visibleIndices = [];
        const totalCards = products.length;

        // Always show 5 cards (2 left, center, 2 right)
        for (let i = -2; i <= 2; i++) {
            let index = centerIndex + i;

            // Handle wrap-around for negative indices
            if (index < 0) {
                index += totalCards;
            }
            // Handle wrap-around for indices beyond array length
            else if (index >= totalCards) {
                index -= totalCards;
            }
            visibleIndices.push(index);
        }

        return visibleIndices.map(index => ({
            ...products[index],
            originalIndex: index,
            offset: index - centerIndex,
        }));
    }, [centerIndex, products]);

    const visibleCards = getVisibleCards();

    return (
        <div className='flex flex-col gap-8 items-center'>
            <span className={`${manrope.className} text-3xl text-[#242424]`} style={{ fontWeight: 400 }}>{name}</span>
            <div className="relative w-full flex items-center justify-center px-20">
                {/* Left Arrow */}
                <button
                    onClick={handlePrev}
                    className="absolute left-4 z-30 bg-[#D9D9D9] shadow-md rounded-full w-10 h-10 flex items-center justify-center cursor-pointer"
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
                    {visibleCards.map((card) => {
                        const offset = card.offset;
                        const zIndex = 10 - Math.abs(offset);
                        const cardWidth = 392;
                        const overlap = cardWidth * 0.3;
                        const translateX = offset * overlap;
                        const scale = offset === 0 ? 1 : 0.9;

                        // Height tiers based on offset
                        let heightClass = 'h-full';
                        if (Math.abs(offset) === 1) heightClass = 'h-[588px]';
                        if (Math.abs(offset) === 2) heightClass = 'h-[530px]';

                        return (
                            <div
                                key={`${card.id}-${card.originalIndex}`}
                                className={`absolute w-[392px] ${heightClass}`}
                                style={{
                                    transform: `translateX(${translateX}px) scale(${scale})`,
                                    zIndex,
                                    transition: 'transform 600ms cubic-bezier(0.25, 1, 0.5, 1), height 600ms ease',
                                    willChange: 'transform, height',
                                }}
                            >
                                <a
                                    href={`/product_detail/${card.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <CardTypeOne
                                        imageUrl={card.imageUrl}
                                        title={card.title}
                                        description={card.description}
                                    />
                                </a>
                            </div>
                        );
                    })}
                </div>

                {/* Right Arrow */}
                <button
                    onClick={handleNext}
                    className="absolute right-4 z-30 bg-[#D9D9D9] shadow-md rounded-full p-2 w-10 h-10 flex items-center justify-center cursor-pointer"
                >
                    <Image
                        src="/Homepage/right_arrow.svg"
                        alt="Right arrow"
                        width={7}
                        height={7}
                    />
                </button>
            </div>
        </div>
    );
}