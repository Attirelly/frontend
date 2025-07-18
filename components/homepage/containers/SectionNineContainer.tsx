'use client';

import { manrope } from '@/font';
import Image from 'next/image';
import CardTwoType from '../cards/CardTypeTwo';
import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';

interface CardData {
  id: string;
  imageUrl: string;
  discountText?: string;
  title: string;
  description?: string;
}

const cards: CardData[] = [
  { id: '1', imageUrl: '/Homepage/CardImage.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana' },
  { id: '2', imageUrl: '/Homepage/CardImage.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana' },
  { id: '3', imageUrl: '/Homepage/CardImage.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana' },
  { id: '4', imageUrl: '/Homepage/CardImage.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana' },
  { id: '5', imageUrl: '/Homepage/CardImage.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana' },
  { id: '6', imageUrl: '/Homepage/CardImage.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana' },
  { id: '7', imageUrl: '/Homepage/CardImage.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana' },
  { id: '8', imageUrl: '/Homepage/CardImage.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana' },
];

const SECTION_NUMBER = 9

export default function SectionNineContainer() {
  const [stores, setStores] = useState<CardData[]>([]);
  const [viewAll, setViewAll] = useState('');
  const [name, setName] = useState('');
  useEffect(() => {
    const fetchStoresBySection = async () => {
      try {
        const res = await api.get(`homepage/stores_by_section_number/${SECTION_NUMBER}`);
        const storeData = res.data;
        console.log(storeData);
        const formattedStores: CardData[] = storeData.map((store) => ({
          id: store.store_id,
          imageUrl: store.profile_image,
          title: store.store_name,
          description: `${store.area.name}, ${store.city.name}`,
        }));
        setStores(formattedStores);

        const resSection = await api.get(`/homepage/get_section_by_number/${SECTION_NUMBER}`);
        const sectionData = resSection.data;
        setViewAll(sectionData.section_url);
        setName(sectionData.section_name);

      } catch (error) {

      }
    }
    fetchStoresBySection()
  }, []);
  return (
    <div className='w-[1242px] mx-auto space-y-8'>
      <div className='flex justify-between'>
        <span className={`${manrope.className} text-3xl text-[#242424]`} style={{ fontWeight: 400 }}>{name}</span>
        <a
          href={viewAll}
          target="_blank"
          rel="noopener noreferrer"
          className='flex items-center gap-2'>
          <span

            className={`${manrope.className} text-base text-[#242424]`}
            style={{ fontWeight: 400 }}
          >
            View All
          </span>
          <Image
            src="/Homepage/view_all_arrow.svg"
            alt="View All"
            width={12}
            height={16} />

        </a>

      </div>

      <div className='flex flex-col'>
        <div className="grid grid-cols-4 gap-x-10 gap-y-6">
          {stores.map((card) => (
            <a
              href={`/store_profile/${card.id}`}
              target="_blank"
              rel="noopener noreferrer">
              <CardTwoType
                key={card.id}
                imageUrl={card.imageUrl === 'string' ? '/Homepage/CardImage.svg' : card.imageUrl}
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