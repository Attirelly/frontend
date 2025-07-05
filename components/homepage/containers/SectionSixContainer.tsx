'use client';

import { manrope } from '@/font';
import Image from 'next/image';
import CardTypeSix from '../cards/CardTypeSix';

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
];

export default function SectionSixContainer() {
  return (
    <div className='w-[1242px] mx-auto space-y-8'>
      <div className='flex justify-between'>
             <span className={`${manrope.className} text-3xl text-[#242424]`} style={{ fontWeight: 400 }}>NEW SUITS</span>
             <div className='flex items-center gap-2'>
               <span className={`${manrope.className} text-base text-[#242424]`} style={{ fontWeight: 400 }}>View All</span>
               <Image
                 src="/Homepage/view_all_arrow.svg"
                 alt="View All"
                 width={12}
                 height={16} />
     
             </div>
     
           </div> 

           <div className='flex flex-col'>
<div className="grid grid-cols-4 gap-x-10 gap-y-6">
      {cards.map((card) => (
        <CardTypeSix
          key={card.id}
          imageUrl={card.imageUrl}
          title={card.title}
          description={card.description || ''}
        />
      ))}
    </div>
    </div>

    </div>
    
    
  );
}
