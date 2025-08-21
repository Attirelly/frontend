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
