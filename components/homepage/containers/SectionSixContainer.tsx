// 'use client';

// import { manrope } from '@/font';
// import Image from 'next/image';
// import CardTypeSix from '../cards/CardTypeSix';
// import { useEffect, useState } from 'react';
// import { api } from '@/lib/axios';

// interface CardData {
//   id: string;
//   imageUrl: string;
//   discountText?: string;
//   title: string;
//   description?: string;
// }

// const cards: CardData[] = [
//   { id: '1', imageUrl: '/Homepage/CardImage.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana' },
//   { id: '2', imageUrl: '/Homepage/CardImage.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana' },
//   { id: '3', imageUrl: '/Homepage/CardImage.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana' },
//   { id: '4', imageUrl: '/Homepage/CardImage.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana' },
// ];

// const SECTION_NUMBER = 6;

// export default function SectionSixContainer() {
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
//           description: `${p.stores.area.name}, ${p.stores.city.name}`,
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
//   }, [])

//   return (
//     <div className='w-[1242px] mx-auto space-y-8'>
//       <div className='flex justify-between'>
//         <span className={`${manrope.className} text-3xl text-[#242424]`} style={{ fontWeight: 400 }}>{name}</span>
//         <a
//           href={viewAll}
//           target="_blank"
//           rel="noopener noreferrer"
//           className='flex items-center gap-2'>
//           <span className={`${manrope.className} text-base text-[#242424]`} style={{ fontWeight: 400 }}>View All</span>
//           <Image
//             src="/Homepage/view_all_arrow.svg"
//             alt="View All"
//             width={12}
//             height={16} />

//         </a>

//       </div>

//       <div className='flex flex-col'>
//         <div className="grid grid-cols-4 gap-x-10 gap-y-6">
//           {products.map((card) => (
//             <a
//               href={`/product_detail/${card.id}`}
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               <CardTypeSix
//                 key={card.id}
//                 imageUrl={card.imageUrl}
//                 title={card.title}
//                 description={card.description || ''}
//               />
//             </a>

//           ))}
//         </div>
//       </div>

//     </div>


//   );
// }


'use client';

import { manrope } from '@/font';
import Image from 'next/image';
import CardTypeSix from '../cards/CardTypeSix';
import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';

interface CardData {
    id: string;
    imageUrl: string;
    discountText?: string;
    title: string;
    description?: string;
}

const SECTION_NUMBER = 6;

export default function SectionSixContainer() {
    const [viewAll, setViewAll] = useState('');
    const [name, setName] = useState('');
    const [products, setProducts] = useState<CardData[]>([]);

    useEffect(() => {
        const fetchSegmentInfo = async () => {
            try {
                const res = await api.get(`homepage/get_products_by_section_number/${SECTION_NUMBER}`);
                const productData = res.data;

                const formattedProducts: CardData[] = productData.map((p: any) => ({
                    id: p.product_id,
                    imageUrl: p.images?.[0]?.image_url || '/Homepage/CardTypeOne.svg',
                    title: p.title,
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


  if (!products || products.length == 0) {
    return <div></div>;
  }

    return (
        <div className='w-[1242px] mx-auto space-y-8'>
            <div className='flex justify-between'>
                <span className={`${manrope.className} text-3xl text-[#242424]`} style={{ fontWeight: 400 }}>{name}</span>
                <a
                    href={viewAll}
                    target="_blank"
                    rel="noopener noreferrer"
                    className='flex items-center gap-2'
                >
                    <span className={`${manrope.className} text-base text-[#242424]`} style={{ fontWeight: 400 }}>View All</span>
                    <Image
                        src="/Homepage/view_all_arrow.svg"
                        alt="View All"
                        width={12}
                        height={16}
                    />
                </a>
            </div>

            <div className='flex flex-col'>
                <div className="grid grid-cols-4 gap-x-10 gap-y-6">
                    {products.map((card) => (
                        <a
                            key={card.id}
                            href={`/product_detail/${card.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <CardTypeSix
                                imageUrl={card.imageUrl}
                                title={card.title}
                                description={card.description || ''}
                            />
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}