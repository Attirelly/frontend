import { manrope } from "@/font";
import CardTypeFive from "../cards/CardTypeFive";
import Image from "next/image";

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

const cards: CardData[] = [
  { id: '1', imageUrl: '/Homepage/CardImage.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana', price: 5000, mrp: 6000, discount: 15 },
  { id: '2', imageUrl: '/Homepage/homepage_image.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana', price: 5000, mrp: 6000, discount: 15 },
  { id: '3', imageUrl: '/Homepage/CardTypeOne.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana', price: 5000, mrp: 6000, discount: 15 },
  { id: '4', imageUrl: '/Homepage/CardImage.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana', price: 5000, mrp: 6000, discount: 15 },
  { id: '5', imageUrl: '/Homepage/CardImage.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana', price: 5000, mrp: 6000, discount: 15 },
];

export default function SectionSevenContainer() {
  return (
    <div className="w-fit mx-auto space-y-8">
      <div className='flex justify-between'>
        <span className={`${manrope.className} text-3xl text-[#242424]`} style={{ fontWeight: 400 }}>NEW ARRIVALS</span>
        <div className='flex items-center gap-2'>
          <span className={`${manrope.className} text-base text-[#242424]`} style={{ fontWeight: 400 }}>View All</span>
          <Image
            src="/Homepage/right_arrow.svg"
            alt="View All"
            width={5}
            height={5} />

        </div>

      </div>
      <div className="flex gap-[23px] justify-center">

        {cards.map((card) => (
          <CardTypeFive
            imageUrl={card.imageUrl}
            title="Embroidary Kurta"
            description="The new men's collection, 100% Jaipuri cotton"
            price={50000}
            mrp={65000}
            discount={15} />
        ))}

      </div>
    </div>

  )
}