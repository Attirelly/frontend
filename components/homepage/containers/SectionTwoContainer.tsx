'use client';

import { manrope } from '@/font';
import CardTwoType from '../cards/CardTypeTwo';

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

export default function SectionTwoContainer() {
  return (
    <div className='flex flex-col items-center'>
<div className="grid grid-cols-4 gap-x-10 gap-y-6 px-10 py-10">
      {cards.map((card) => (
        <CardTwoType
          key={card.id}
          imageUrl={card.imageUrl}
          title={card.title}
          description={card.description || ''}
        />
      ))}
    </div>
    <button
    className={`${manrope.className} text-sm mt-10 border w-35 h-10 rounded-lg`} style={{fontWeight:400}}>
      View All
    </button>
    </div>
    
  );
}
