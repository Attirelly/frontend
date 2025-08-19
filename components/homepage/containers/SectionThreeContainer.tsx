// 'use client';
// import { manrope } from "@/font";
// import CardTypeFive from "../cards/CardTypeFive";
// import Image from "next/image";
// import { useEffect, useState } from "react";
// import { api } from "@/lib/axios";

// interface CardData {
//   id: string;
//   imageUrl: string;
//   discountText?: string;
//   title: string;
//   description?: string;
//   price: number;
//   mrp: number;
//   discount: number;
// }

// const cards: CardData[] = [
//   { id: '1', imageUrl: '/Homepage/CardImage.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana', price: 5000, mrp: 6000, discount: 15 },
//   { id: '2', imageUrl: '/Homepage/homepage_image.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana', price: 5000, mrp: 6000, discount: 15 },
//   { id: '3', imageUrl: '/Homepage/CardTypeOne.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana', price: 5000, mrp: 6000, discount: 15 },
//   { id: '4', imageUrl: '/Homepage/CardImage.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana', price: 5000, mrp: 6000, discount: 15 },
//   { id: '5', imageUrl: '/Homepage/CardImage.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana', price: 5000, mrp: 6000, discount: 15 },
// ];

// const SECTION_NUMBER = 3;

// export default function SectionThreeContainer() {
//   const [viewAll, setViewAll] = useState('');
//   const [name, setName] = useState('');
//   const [products, setProducts] = useState<CardData[]>([]);

//   useEffect(() => {
//     const fetchSegmentInfo = async () => {
//       try {

//         const res = await api.get(`homepage/get_products_by_section_number/${SECTION_NUMBER}`);
//         const productData = res.data;

//         const formattedProducts: CardData[] = productData.map((p) => ({
//           id: p.product_id,
//           imageUrl: p.images[0].image_url || '/Homepage/CardTypeOne.svg',
//           title: p.product_name,
//           // description: `${p.stores.area.name}, ${p.stores.city.name}`,
//           description: p.stores.store_name,
//           price: p.variants[0].price,
//           mrp: p.variants[0].mrp,
//           discount: p.variants[0].discount,
//         }));
//         setProducts(formattedProducts);

//         const resSection = await api.get(`/homepage/get_section_by_number/${SECTION_NUMBER}`);
//         const sectionData = resSection.data;
//         setViewAll(sectionData.section_url);
//         setName(sectionData.section_name);

//       }
//       catch (error) {

//       }
//     }

//     fetchSegmentInfo();
//   }, []);

//   return (
//     <div className="w-fit mx-auto space-y-8">
//       <div className='flex justify-between'>
//         <span className={`${manrope.className} text-3xl text-[#242424]`} style={{ fontWeight: 400 }}>{name}</span>
//         <a
//           href={viewAll}
//           target="_blank"
//           rel="noopener noreferrer"
//           className='flex items-center gap-2'>
//           <span className={`${manrope.className} text-base text-[#242424]`} style={{ fontWeight: 400 }}>View All</span>
//           <Image
//             src="/Homepage/right_arrow.svg"
//             alt="View All"
//             width={5}
//             height={5} />

//         </a>

//       </div>
//       <div className="flex gap-[23px] justify-center">

//         {products.map((card) => (
//           <a
//             href={`/product_detail/${card.id}`}
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <CardTypeFive
//               imageUrl={card.imageUrl}
//               title={card.title}
//               description={card.description || ""}
//               price={card.price}
//               mrp={card.mrp}
//               discount={card.discount} />
//           </a>

//         ))}

//       </div>
//     </div>

//   )
// }

// // 'use client';

// // import { useState } from 'react';
// // import Image from 'next/image';
// // import CardTypeThree from '../cards/CardTypeThree';

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
// //   { id: '11', imageUrl: '/Homepage/CardTypeFive.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana' },
// // ];

// // export default function SectionThreeContainer() {
// //   const [startIndex, setStartIndex] = useState(0);
// //   const visibleCount = 5;
// //   const cardWidth = 232; // Width of each card
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
// //     <div className="relative w-full py-20 px-20 overflow-hidden">
// //       {/* Navigation Arrows */}
// //       <button
// //         onClick={handlePrev}
// //         disabled={startIndex === 0}
// //         className="absolute left-4 top-1/2 bg-[#D9D9D9] shadow-md rounded-full w-10 h-10 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
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
// //           className="flex gap-6 transition-transform duration-500 ease-in-out"
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
// //               <CardTypeThree
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
// //         className="absolute right-4 top-1/2 bg-[#D9D9D9] shadow-md rounded-full w-10 h-10 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
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

"use client";

import { manrope } from "@/font";
import CardTypeFive from "../cards/CardTypeFive";
import Image from "next/image";
import { useEffect, useState } from "react";
import { api } from "@/lib/axios";

interface CardData {
  id: string;
  imageUrl: string;
  discountText?: string;
  title: string;
  description?: string;
  price: number;
  mrp: number;
  discount: number;
}

const SECTION_NUMBER = 3;

export default function SectionThreeContainer() {
  const [viewAll, setViewAll] = useState("");
  const [name, setName] = useState("");
  const [products, setProducts] = useState<CardData[]>([]);

  useEffect(() => {
    const fetchSegmentInfo = async () => {
      try {
        const res = await api.get(
          `homepage/get_products_by_section_number/${SECTION_NUMBER}`
        );
        const productData = res.data;

        const formattedProducts: CardData[] = productData.map((p: any) => ({
          id: p.product_id,
          imageUrl: p.images?.[0]?.image_url || "/Homepage/CardTypeOne.svg",
          title: p.title,
          description: p.stores?.store_name || "",
          price: p.variants?.[0]?.price || 0,
          mrp: p.variants?.[0]?.mrp || 0,
          discount: p.variants?.[0]?.discount || 0,
        }));
        setProducts(formattedProducts);

        const resSection = await api.get(
          `/homepage/get_section_by_number/${SECTION_NUMBER}`
        );
        const sectionData = resSection.data;
        setViewAll(sectionData.section_url);
        setName(sectionData.section_name);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchSegmentInfo();
  }, []);

  if (!products || products.length == 0) {
    return <div></div>;
  }

  return (
    <div className="w-fit mx-auto space-y-8">
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
      <div className="flex gap-[23px] justify-center">
        {products.map((card) => (
          <a
            key={card.id}
            href={`/product_detail/${card.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <CardTypeFive
              imageUrl={card.imageUrl}
              title={card.title}
              description={card.description || ""}
              price={card.price}
              mrp={card.mrp}
              discount={card.discount}
            />
          </a>
        ))}
      </div>
    </div>
  );
}
