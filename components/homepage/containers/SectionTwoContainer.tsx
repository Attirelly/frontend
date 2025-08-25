"use client";

import { manrope } from "@/font";
import Image from "next/image";
import CardTypeSix from "../cards/CardTypeSix";
import { useEffect, useState } from "react";
import { api } from "@/lib/axios";

interface CardData {
  id: string;
  imageUrl: string;
  discountText?: string;
  title: string;
  description?: string;
  categoryLandingUrl?: string;
}

const SECTION_NUMBER = 2;
const DESKTOP_VISIBLE_COUNT = 4;
const MOBILE_VISIBLE_COUNT = 2;

export default function SectionTwoContainer() {
  const [startIndex, setStartIndex] = useState(0);
  const [viewAll, setViewAll] = useState("");
  const [name, setName] = useState("");
  const [products, setProducts] = useState<CardData[]>([]);

  useEffect(() => {
    const fetchSegmentInfo = async () => {
      try {
        const res = await api.get(
          `homepage/categories_by_section_number/${SECTION_NUMBER}`
        );
        const productData = res.data;

        const formattedProducts: CardData[] = productData.map((p: any) => ({
          id: p.category_id,
          imageUrl: p.image_url,
          title: p.name,
          categoryLandingUrl: p.category_landing_url || "",
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

  const totalCards = products.length;

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

  const visibleCards = Array.from({ length: totalCards }, (_, i) => {
    const realIndex = (startIndex + i) % totalCards;
    return products[realIndex];
  });

  if (!products || products.length === 0) {
    return <div></div>;
  }

  return (
    <div className="w-full lg:w-[1242px] mx-auto space-y-4 lg:space-y-8">
      {/* Container for title and "View All" */}
      <div className="flex justify-between px-4 lg:px-0">
        <span
          className={`${manrope.className} text-xl md:text-2xl lg:text-3xl text-[#242424]`}
          style={{ fontWeight: 400 }}
        >
          {name}
        </span>
        <a
          href={viewAll}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 lg:gap-2"
        >
          <span
            className={`${manrope.className} text-sm lg:text-base text-[#242424]`}
            style={{ fontWeight: 400 }}
          >
            View All
          </span>
          <Image
            src="/Homepage/view_all_arrow.svg"
            alt="View All"
            width={12}
            height={16}
          />
        </a>
      </div>

      {/* Main scrolling container */}
      <div className="relative">
        {/* Navigation Arrows for Mobile */}
        <button
          onClick={handlePrev}
          className="absolute z-10 left-0 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-[#D9D9D9] shadow-md rounded-full w-8 h-8 flex items-center justify-center cursor-pointer lg:hidden"
        >
          <Image
            src="/Homepage/left_arrow.svg"
            alt="Left arrow"
            width={7}
            height={7}
          />
        </button>

        {/* The Card Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-x-10 lg:gap-y-6">
          {products.slice(startIndex, startIndex + MOBILE_VISIBLE_COUNT).map((card, index) => (
            <a
              key={card.id}
              href={card?.categoryLandingUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="lg:hidden"
            >
              <CardTypeSix
                imageUrl={card.imageUrl}
                title={card.title}
                description={card.description || ""}
              />
            </a>
          ))}
          {products.map((card) => (
            <a
              key={card.id}
              href={card?.categoryLandingUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:block"
            >
              <CardTypeSix
                imageUrl={card.imageUrl}
                title={card.title}
                description={card.description || ""}
              />
            </a>
          ))}
        </div>

        {/* Navigation Arrows for Mobile */}
        <button
          onClick={handleNext}
          className="absolute z-10 right-0 translate-x-1/2 top-1/2 -translate-y-1/2 bg-[#D9D9D9] shadow-md rounded-full w-8 h-8 flex items-center justify-center cursor-pointer lg:hidden"
        >
          <Image
            src="/Homepage/right_arrow.svg"
            alt="Left arrow"
            width={7}
            height={7}
          />
        </button>
      </div>
    </div>
  );
}