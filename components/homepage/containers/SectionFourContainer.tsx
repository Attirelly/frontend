"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import CardTypeOne from "../cards/CardTypeOne";
import { api } from "@/lib/axios";
import { manrope } from "@/font";
import SectionFourContainerSkeleton from "../skeleton/SectionFourContainerSkeleton";

interface CardData {
  id: string;
  imageUrl: string;
  discountText?: string;
  title: string;
  description?: string;
}

const SECTION_NUMBER = 4;

export default function CardStack() {
  const [centerIndex, setCenterIndex] = useState(2);
  const [viewAll, setViewAll] = useState("");
  const [name, setName] = useState("");
  const [products, setProducts] = useState<CardData[]>([]);
  const [screenSize, setScreenSize] = useState('sm');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateScreenSize = () => {
      if (window.innerWidth < 768) {
        setScreenSize("sm");
      } else if (window.innerWidth < 1024) {
        setScreenSize("md");
      } else if (window.innerWidth < 1300) {
        setScreenSize("lg");
      } else {
        setScreenSize("xl");
      }
    };

    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);
    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  // Fetch data
  useEffect(() => {
    const fetchSegmentInfo = async () => {
      try {
        const res = await api.get(
          `homepage/get_products_by_section_number/${SECTION_NUMBER}`
        );
        const productData = res.data;

        const formattedProducts: CardData[] = productData.map((p: any) => ({
          id: p.product_id,
          imageUrl: p.images[0].image_url || "/Homepage/CardTypeOne.svg",
          title: p.title,
          description: p.stores && p.stores.area && p.stores.area?.name.toLowerCase() === "others" ? `${p.stores?.city?.name || ''}` : `${p.stores?.area?.name || ''}, ${p.stores?.city?.name || ''}`,
        }));
        setProducts(formattedProducts);

        const resSection = await api.get(
          `/homepage/get_section_by_number/${SECTION_NUMBER}`
        );
        const sectionData = resSection.data;
        setViewAll(sectionData.section_url);
        setName(sectionData.section_name);
      } catch (error) {
        console.error(error);
      }
      finally {
        setLoading(false);
      }
    };
    fetchSegmentInfo();
  }, []);

  // Handle infinite navigation
  const handleNext = useCallback(() => {
    setCenterIndex((prev) => (prev + 1) % products.length);
  }, [products.length]);

  const handlePrev = useCallback(() => {
    setCenterIndex((prev) => (prev - 1 + products.length) % products.length);
  }, [products.length]);

  // Get visible cards with wrap-around logic
  // Get visible cards with wrap-around logic
  const getVisibleCards = useCallback(() => {
    if (products.length === 0) return [];

    let range = 2; // default for lg and xl → show 5 cards (-2..2)

    if (screenSize === "sm") {
      range = 0; // only center card
    } else if (screenSize === "md") {
      range = 1; // left, center, right (3 cards)
    }

    const visibleIndices = [];
    const totalCards = products.length;

    for (let i = -range; i <= range; i++) {
      let index = centerIndex + i;

      if (index < 0) index += totalCards;
      else if (index >= totalCards) index -= totalCards;

      visibleIndices.push(index);
    }

    return visibleIndices.map((index) => ({
      ...products[index],
      originalIndex: index,
      offset:
        (index - centerIndex + totalCards) % totalCards > totalCards / 2
          ? ((index - centerIndex + totalCards) % totalCards) - totalCards
          : (index - centerIndex + totalCards) % totalCards,
    }));
  }, [centerIndex, products, screenSize]);


  const visibleCards = getVisibleCards();

  if (loading) {
    return <SectionFourContainerSkeleton />;
  }

  if (!products || products.length == 0) {
    return <div></div>;
  }

  return (
    <div className="flex flex-col gap-8 items-center">
      <span
        className={`${manrope.className} text-[24px] md:text-[28px] lg:text-[32px] text-[#242424]`}
        style={{ fontWeight: 400 }}
      >
        {name}
      </span>
      <div className="relative w-full flex items-center justify-center px-20">
        {/* Left Arrow */}
        <button
          onClick={handlePrev}
          className="absolute left-4 z-30 bg-[#D9D9D9] shadow-md rounded-full w-10 h-10 flex items-center justify-center cursor-pointer"
        >
          <Image
            src="/Homepage/left_arrow.svg"
            alt="Left arrow"
            width={7}
            height={7}
          />
        </button>

        {/* Card Stack */}
        <div className="relative flex items-center justify-center w-full h-[588px]">
          {/* ✅ FIX: Sort the array to stabilize the DOM order before mapping */}
          {visibleCards
            .sort((a, b) => a.originalIndex - b.originalIndex)
            .map((card) => {
              const offset = card.offset;
              const zIndex = 10 - Math.abs(offset);
              const cardWidth = 392;
              const overlap = cardWidth * 0.3;
              const translateX = offset * overlap;
              const scale = offset === 0 ? 1 : 0.9;

              let heightClass = "";
              if (offset === 0) {
                heightClass = "h-[588px]";
              } else if (Math.abs(offset) === 1) {
                heightClass = "h-[530px]";
              } else {
                heightClass = "h-[480px]";
              }

              // ✅ Mobile fix
              const isMobile = screenSize === "sm";

              return (
                <div
                  key={`${card.id}-${card.originalIndex}`}
                  className={`${isMobile ? "relative mx-auto" : "absolute"} w-[392px] ${heightClass}`}
                  style={
                    isMobile
                      ? {
                        zIndex: 10,
                        transition: "height 600ms ease",
                      }
                      : {
                        transform: `translateX(${translateX}px) scale(${scale})`,
                        zIndex,
                        transition:
                          "transform 600ms cubic-bezier(0.25, 1, 0.5, 1), height 600ms ease",
                        willChange: "transform, height",
                      }
                  }
                >
                  <a
                    href={`/product_detail/${card.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <CardTypeOne
                      imageUrl={card.imageUrl}
                      title={card.title}
                      description={card.description}
                    />
                  </a>
                </div>
              );
            })}

        </div>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          className="absolute right-4 z-30 bg-[#D9D9D9] shadow-md rounded-full p-2 w-10 h-10 flex items-center justify-center cursor-pointer"
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
