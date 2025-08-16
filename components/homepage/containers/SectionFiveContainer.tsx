// 'use client';

// import { useEffect, useState } from 'react';
// import Image from 'next/image';
// import CardTypeThree from '../cards/CardTypeThree';
// import { manrope } from '@/font';
// import { useRouter } from 'next/navigation';
// import { api } from '@/lib/axios';

// interface CardData {
//   id: string;
//   imageUrl: string;
//   discountText?: string;
//   title: string;
//   description?: string;
// }

// const SECTION_NUMBER = 5;

// export default function SectionFiveContainer() {
//   const [startIndex, setStartIndex] = useState(0);
//   const visibleCount = 5;
//   const cardWidth = 232; // card width in px
//   const gap = 20; // 20px gap
//   const [viewAll, setViewAll] = useState('');
//   const [name, setName] = useState('');
//   const [products, setProducts] = useState<CardData[]>([]);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchSegmentInfo = async () => {
//       try {
//         const res = await api.get(
//           `homepage/get_products_by_section_number/${SECTION_NUMBER}`
//         );
//         const productData = res.data;

//         const formattedProducts: CardData[] = productData.map((p: any) => ({
//           id: p.product_id,
//           imageUrl: p.images[0]?.image_url || '/Homepage/CardTypeOne.svg',
//           title: p.product_name,
//           description: `${p.stores.area.name}, ${p.stores.city.name}`,
//         }));
//         setProducts(formattedProducts);

//         const resSection = await api.get(
//           `/homepage/get_section_by_number/${SECTION_NUMBER}`
//         );
//         const sectionData = resSection.data;
//         setViewAll(sectionData.section_url);
//         setName(sectionData.section_name);
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     fetchSegmentInfo();
//   }, []);

//   // Navigation handlers with modular arithmetic for infinite loop
//   const totalCards = products.length;

//   const handleNext = () => {
//     if (totalCards > 0) {
//       setStartIndex((prev) => (prev + 1) % totalCards);
//     }
//   };

//   const handlePrev = () => {
//     if (totalCards > 0) {
//       setStartIndex((prev) => (prev - 1 + totalCards) % totalCards);
//     }
//   };

//   // Get exactly 5 visible cards using wrapping
//   const visibleCards = Array.from({ length: visibleCount }, (_, i) => {
//     const realIndex = (startIndex + i) % totalCards;
//     return products[realIndex];
//   });

//   return (
//     <div className="w-[1242px] mx-auto space-y-8">
//       {/* Section header */}
//       <div className="flex justify-between">
//         <span
//           className={`${manrope.className} text-3xl text-[#242424]`}
//           style={{ fontWeight: 400 }}
//         >
//           {name}
//         </span>
//         <a
//           href={viewAll}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="flex items-center gap-2"
//         >
//           <span
//             className={`${manrope.className} text-base text-[#242424]`}
//             style={{ fontWeight: 400 }}
//           >
//             View All
//           </span>
//           <Image
//             src="/Homepage/right_arrow.svg"
//             alt="View All"
//             width={5}
//             height={5}
//           />
//         </a>
//       </div>

//       {/* Carousel */}
//       <div className="relative">
//         {/* Prev Button */}
//         <button
//           onClick={handlePrev}
//           className="absolute z-50 left-0 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-[#D9D9D9] shadow-md rounded-full w-10 h-10 flex items-center justify-center cursor-pointer"
//         >
//           <Image
//             src="/Homepage/left_arrow.svg"
//             alt="Left arrow"
//             width={7}
//             height={7}
//           />
//         </button>

//         {/* Visible Cards */}
//         <div className="overflow-hidden">
//           <div className="flex gap-5 transition-transform duration-500 ease-in-out">
//             {visibleCards.map((card) => (
//               <div
//                 key={card?.id}
//                 style={{ minWidth: `${cardWidth}px` }}
//               >
//                 <a
//                   href={`/product_detail/${card?.id}`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   <CardTypeThree
//                     imageUrl={card?.imageUrl}
//                     title={card?.title}
//                     description={card?.description || ''}
//                   />
//                 </a>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Next Button */}
//         <button
//           onClick={handleNext}
//           className="absolute z-10 right-0 translate-x-1/2 top-1/2 -translate-y-1/2 bg-[#D9D9D9] shadow-md rounded-full w-10 h-10 flex items-center justify-center cursor-pointer"
//         >
//           <Image
//             src="/Homepage/right_arrow.svg"
//             alt="Right arrow"
//             width={7}
//             height={7}
//           />
//         </button>
//       </div>
//     </div>
//   );
// }


'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import CardTypeThree from '../cards/CardTypeThree';
import { manrope } from '@/font';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';

interface CardData {
    id: string;
    imageUrl: string;
    discountText?: string;
    title: string;
    description?: string;
}

const SECTION_NUMBER = 5;

export default function SectionFiveContainer() {
    const [startIndex, setStartIndex] = useState(0);
    const visibleCount = 5;
    const cardWidth = 232; // card width in px
    const gap = 20; // 20px gap
    const [viewAll, setViewAll] = useState('');
    const [name, setName] = useState('');
    const [products, setProducts] = useState<CardData[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchSegmentInfo = async () => {
            try {
                const res = await api.get(
                    `homepage/get_products_by_section_number/${SECTION_NUMBER}`
                );
                const productData = res.data;

                const formattedProducts: CardData[] = productData.map((p: any) => ({
                    id: p.product_id,
                    imageUrl: p.images?.[0]?.image_url || '/Homepage/CardTypeOne.svg',
                    title: p.title,
                    description: `${p.stores?.area?.name || ''}, ${p.stores?.city?.name || ''}`,
                }));
                setProducts(formattedProducts);

                const resSection = await api.get(
                    `/homepage/get_section_by_number/${SECTION_NUMBER}`
                );
                const sectionData = resSection.data;
                setViewAll(sectionData.section_url);
                setName(sectionData.section_name);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };

        fetchSegmentInfo();
    }, []);

    const totalCards = products.length;
    const maxIndex = totalCards > visibleCount ? totalCards - visibleCount : 0;

    const handleNext = () => {
        if (totalCards > 0) {
            setStartIndex((prev) => (prev + 1) % totalCards);
        }
    };

    const handlePrev = () => {
        if (totalCards > 0) {
            setStartIndex((prev) => (prev - 1 + totalCards) % totalCards);
        }
    };

    return (
        <div className="w-[1242px] mx-auto space-y-8">
            {/* Section header */}
            <div className="flex justify-between">
                <span
                    className={`${manrope.className} text-3xl text-[#242424]`}
                    style={{ fontWeight: 400 }}
                >
                    {name}
                </span>
                <a
                    href={viewAll}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                >
                    <span
                        className={`${manrope.className} text-base text-[#242424]`}
                        style={{ fontWeight: 400 }}
                    >
                        View All
                    </span>
                    <Image
                        src="/Homepage/right_arrow.svg"
                        alt="View All"
                        width={5}
                        height={5}
                    />
                </a>
            </div>

            {/* Carousel */}
            <div className="relative">
                {/* Prev Button */}
                <button
                    onClick={handlePrev}
                    className="absolute z-50 left-0 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-[#D9D9D9] shadow-md rounded-full w-10 h-10 flex items-center justify-center cursor-pointer"
                >
                    <Image
                        src="/Homepage/left_arrow.svg"
                        alt="Left arrow"
                        width={7}
                        height={7}
                    />
                </button>

                {/* Visible Cards */}
                <div className="overflow-hidden">
                    <div
                        className="flex gap-5 transition-transform duration-500 ease-in-out"
                        style={{
                            transform: `translateX(-${startIndex * (cardWidth + gap)}px)`,
                        }}
                    >
                        {products.map((card) => (
                            <div
                                key={card.id}
                                style={{ minWidth: `${cardWidth}px` }}
                                className="flex-shrink-0"
                            >
                                <a
                                    href={`/product_detail/${card.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <CardTypeThree
                                        imageUrl={card.imageUrl}
                                        title={card.title}
                                        description={card.description || ''}
                                    />
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Next Button */}
                <button
                    onClick={handleNext}
                    className="absolute z-10 right-0 translate-x-1/2 top-1/2 -translate-y-1/2 bg-[#D9D9D9] shadow-md rounded-full w-10 h-10 flex items-center justify-center cursor-pointer"
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