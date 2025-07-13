'use client';

import { useState, useEffect } from 'react';
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
];

const SECTION_NUMBER = 4;

export default function CardStack() {
    const [centerIndex, setCenterIndex] = useState(2); // Start with third card centered
    const [viewAll, setViewAll] = useState('');
    const [name, setName] = useState('');
    const [products, setProducts] = useState<CardData[]>([]);

    useEffect(() => {
        const fetchSegmentInfo = async () => {
            try {

                const res = await api.get(`homepage/get_products_by_section_number/${SECTION_NUMBER}`);
                const productData = res.data;
                console.log(productData);
                const formattedProducts: CardData[] = productData.map((p) => ({
                    id: p.product_id,
                    imageUrl: p.images[0].image_url || '/Homepage/CardTypeOne.svg',
                    title: p.product_name,
                    description: `${p.stores.area.name}, ${p.stores.city.name}`,
                }));
                setProducts(formattedProducts);

                const resSection = await api.get(`/homepage/get_section_by_number/${SECTION_NUMBER}`);
                const sectionData = resSection.data;
                setViewAll(sectionData.section_url);
                setName(sectionData.section_name);


            }
            catch (error) {
                console.log('failed to fetch segment information');
            }
        }


        fetchSegmentInfo();
    }, [])


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
        // <div className='flex flex-col gap-8 items-center'>
        //     <span className={`${manrope.className} text-3xl text-[#242424]`} style={{ fontWeight: 400 }}>{name}</span>
            <div className="relative w-full flex items-center justify-center px-20">
                {/* Left Arrow */}
                <button
                    onClick={handlePrev}
                    disabled={centerIndex === 0}
                    className="absolute left-4 z-30 bg-[#D9D9D9] shadow-md rounded-full w-10 h-10 flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
                    {products.map((card, i) => {
                        const offset = i - centerOffset;
                        const zIndex = 10 - Math.abs(offset);
                        const cardWidth = 392;
                        const overlap = cardWidth * 0.3;
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
                            >
                                <a
                                    href={`/product_detail/${card.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <CardTypeOne
                                        imageUrl={card.imageUrl}
                                        discountText={card.discountText || ""}
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
                    disabled={centerIndex === cards.length - 1}
                    className="absolute right-4 z-30 bg-[#D9D9D9] shadow-md rounded-full p-2 w-10 h-10 flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Image
                        src="/Homepage/right_arrow.svg"
                        alt="Left arrow"
                        width={7}
                        height={7}
                    />
                </button>
            </div>
        // </div>

    );
}




// import CardTypeFive from "../cards/CardTypeFive";

// interface CardData {
//     id: string;
//     imageUrl: string;
//     discountText?: string;
//     title: string;
//     description?: string;
//     price: number;
//     mrp: number;
//     discount: number;
// }

// const cards: CardData[] = [
//     { id: '1', imageUrl: '/Homepage/CardImage.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana', price: 5000, mrp: 6000, discount: 15 },
//     { id: '2', imageUrl: '/Homepage/CardImage.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana', price: 5000, mrp: 6000, discount: 15 },
//     { id: '3', imageUrl: '/Homepage/CardImage.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana', price: 5000, mrp: 6000, discount: 15 },
//     { id: '4', imageUrl: '/Homepage/CardImage.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana', price: 5000, mrp: 6000, discount: 15 },
//     { id: '5', imageUrl: '/Homepage/CardImage.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana', price: 5000, mrp: 6000, discount: 15 },
// ];

// export default function SectionFiveContainer() {
//     return (
//         <div className="flex gap-[23px] justify-center">
//             {cards.map((card) => (
//                 <CardTypeFive
//                     imageUrl={card.imageUrl}
//                     title="Embroidary Kurta"
//                     description="The new men's collection, 100% Jaipuri cotton"
//                     price={50000}
//                     mrp={65000}
//                     discount={15} />
//             ))}

//         </div>
//     )
// }