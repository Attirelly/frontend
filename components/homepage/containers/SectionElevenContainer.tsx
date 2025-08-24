'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { manrope } from '@/font';
import CardTypeFour from '../cards/CardTypeFour';
import { api } from '@/lib/axios';

interface CardData {
  id: string;
  imageUrl: string;
  discountText?: string;
  title: string;
  description?: string;
}

const SECTION_NUMBER = 11;

export default function SectionElevenContainer() {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 6;
  const cardWidth = 184; // Width of each card
  const gap = 20; // Tailwind gap-5 = 1.25rem = 20px
  const [stores, setStores] = useState<CardData[]>([]);
  const [viewAll, setViewAll] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchStoresBySection = async () => {
      try {
        const res = await api.get(`homepage/stores_by_section_number/${SECTION_NUMBER}`);
        const storeData = res.data;
        
        const formattedStores: CardData[] = storeData.map((store : any) => ({
          id: store.store_id,
          imageUrl: store.profile_image,
          title: store.store_name,
          description: store.area && store.area?.name.toLowerCase() === "others"? `${store.city?.name}` : `${store.area?.name}, ${store.city?.name}`,
        }));
        setStores(formattedStores);

        const resSection = await api.get(`/homepage/get_section_by_number/${SECTION_NUMBER}`);
        const sectionData = resSection.data;
        setViewAll(sectionData.section_url);
        setName(sectionData.section_name);

      } catch (error) {
        console.error(error);
      }
    };
    fetchStoresBySection()
  }, []);

  const totalCards = stores.length;

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

  const visibleCards = Array.from({ length: visibleCount }, (_, i) => {
    const realIndex = (startIndex + i) % totalCards;
    return stores[realIndex];
  });
  if(!stores || stores.length == 0  ){
   return <div></div>
  }
  return (
    <div className='w-[1242px] mx-auto space-y-8'>
      <div className='flex justify-between'>
        <span className={`${manrope.className} text-4xl text-[#242424]`} style={{ fontWeight: 400 }}>{name}</span>
        <a
          href={viewAll}
          target="_blank"
          rel="noopener noreferrer"
          className='flex items-center gap-2'>
          <span className={`${manrope.className} text-base text-[#242424]`} style={{ fontWeight: 400 }}>View All</span>
          <Image
            src="/Homepage/right_arrow.svg"
            alt="View All"
            width={5}
            height={5} />

        </a>

      </div>

      <div className="relative">
        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          // disabled={startIndex === 0}
          className="absolute z-50 -left-15 top-1/2 -translate-y-1/2 bg-[#D9D9D9] shadow-md rounded-full w-10 h-10 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
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
            className="flex gap-6 transition-transform duration-500 ease-in-out">
            {visibleCards.map((card) => (
              <div
                key={card?.id}
                style={{ minWidth: `${cardWidth}px` }}
              >
                <a
                  href={`/store_profile/${card?.id}`}
                  target="_blank"
                  rel="noopener noreferrer">

                  <CardTypeFour
                    imageUrl={card?.imageUrl}
                    title={card?.title}
                    description={card?.description || ''}
                  />
                </a>

              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleNext}
          // disabled={startIndex === maxIndex}
          className="absolute z-10  -right-10 translate-x-1/2 top-1/2 -translate-y-1/2 bg-[#D9D9D9] shadow-md rounded-full w-10 h-10 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
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