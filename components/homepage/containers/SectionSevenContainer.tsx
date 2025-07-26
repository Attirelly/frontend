'use client';
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

const cards: CardData[] = [
  { id: '1', imageUrl: '/Homepage/CardImage.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana', price: 5000, mrp: 6000, discount: 15 },
  { id: '2', imageUrl: '/Homepage/homepage_image.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana', price: 5000, mrp: 6000, discount: 15 },
  { id: '3', imageUrl: '/Homepage/CardTypeOne.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana', price: 5000, mrp: 6000, discount: 15 },
  { id: '4', imageUrl: '/Homepage/CardImage.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana', price: 5000, mrp: 6000, discount: 15 },
  { id: '5', imageUrl: '/Homepage/CardImage.svg', title: 'Label Parampara by Archit', description: 'Modal Town, Ludhiana', price: 5000, mrp: 6000, discount: 15 },
];

const SECTION_NUMBER = 7;

export default function SectionSevenContainer() {
  const [viewAll, setViewAll] = useState('');
  const [name, setName] = useState('');
  const [products, setProducts] = useState<CardData[]>([]);

  useEffect(() => {
    const fetchSegmentInfo = async () => {
      try {

        const res = await api.get(`homepage/get_products_by_section_number/${SECTION_NUMBER}`);
        const productData = res.data;
        
        const formattedProducts: CardData[] = productData.map((p) => ({
          id: p.product_id,
          imageUrl: p.images[0].image_url || '/Homepage/CardTypeOne.svg',
          title: p.product_name,
          // description: `${p.stores.area.name}, ${p.stores.city.name}`,
          description: p.stores.store_name,
          price: p.variants[0].price,
          mrp: p.variants[0].mrp,
          discount: p.variants[0].discount,
        }));
        setProducts(formattedProducts);

        const resSection = await api.get(`/homepage/get_section_by_number/${SECTION_NUMBER}`);
        const sectionData = resSection.data;
        setViewAll(sectionData.section_url);
        setName(sectionData.section_name);


      }
      catch (error) {
        
      }
    }


    fetchSegmentInfo();
  }, []);
  
  return (
    <div className="w-fit mx-auto space-y-8">
      <div className='flex justify-between'>
        <span className={`${manrope.className} text-3xl text-[#242424]`} style={{ fontWeight: 400 }}>{name}</span>
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
      <div className="flex gap-[23px] justify-center">

        {products.map((card) => (
          <a
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
              discount={card.discount} />
          </a>

        ))}

      </div>
    </div>

  )
}