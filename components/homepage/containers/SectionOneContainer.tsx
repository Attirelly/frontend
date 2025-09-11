"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import CardTypeThree from "../cards/CardTypeThree";
import { manrope } from "@/font";
import { api } from "@/lib/axios";

interface CardData {
  id: string;
  imageUrl: string;
  title: string;
  description?: string;
  categoryLandingUrl?: string;
}

const SECTION_NUMBER = 1;

export default function SectionOneContainer() {
  const [viewAll, setViewAll] = useState("");
  const [name, setName] = useState("");
  const [products, setProducts] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);

  // CHANGED: Use a ref to get direct access to the scrollable element
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // REMOVED: All state for startIndex and visibleCards is gone.

  useEffect(() => {
    const fetchSegmentInfo = async () => {
      setLoading(true);
      try {
        const res = await api.get(`homepage/categories_by_section_number/${SECTION_NUMBER}`);
        const productData = res.data;

        const formattedProducts: CardData[] = productData.map((p: any) => ({
          id: p.category_id,
          imageUrl: p.image_url,
          title: p.name,
          categoryLandingUrl: p.category_landing_url || "",
        }));
        setProducts(formattedProducts);

        const resSection = await api.get(`/homepage/get_section_by_number/${SECTION_NUMBER}`);
        const sectionData = resSection.data;
        setViewAll(sectionData.section_url);
        setName(sectionData.section_name);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSegmentInfo();
  }, []);

  // CHANGED: Navigation logic now directly manipulates the scroll position
  const handleNext = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.offsetWidth;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.offsetWidth;
      scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };
  
  // You can add a skeleton loader for the loading state if you wish
  // if (loading) { return <YourSkeletonComponent />; }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    // CHANGED: Main container is now fluid, centered, and has padding.
    <div className="w-full max-w-7xl mx-auto px-4 space-y-4 md:space-y-8">
      <div className="flex items-center">
        <span className={`${manrope.className} text-xl md:text-2xl lg:text-3xl`} style={{ fontWeight: 400 }}>
          {name}
        </span>
        {viewAll && (
          <a href={viewAll} target="_blank" rel="noopener noreferrer" className="ml-auto flex items-center gap-2">
            <span className={`${manrope.className} text-sm lg:text-base`} style={{ fontWeight: 400 }}>
              View All
            </span>
            <Image src="/Homepage/right_arrow.svg" alt="View All" width={5} height={5} />
          </a>
        )}
      </div>

      <div className="relative flex items-center">
        {/* Prev Button */}
        <button
          onClick={handlePrev}
          className="absolute z-10 -left-4 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center cursor-pointer"
        >
          <Image src="/Homepage/left_arrow.svg" alt="Left arrow" width={7} height={7} />
        </button>

        {/* CHANGED: This is now a flex container for the carousel */}
        <div
          ref={scrollContainerRef}
          className="flex w-full space-x-4 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-none px-2"
        >
          {/* CHANGED: Map over the entire products array */}
          {products.map((card) => (
            // CHANGED: This wrapper div defines the responsive width of each card
            <div key={card.id} className="flex-shrink-0 w-1/2 md:w-1/3 lg:w-1/5 snap-start">
              <a href={card?.categoryLandingUrl || "#"} target="_blank" rel="noopener noreferrer">
                <CardTypeThree
                  imageUrl={card.imageUrl}
                  title={card.title}
                  description={card.description || ""}
                />
              </a>
            </div>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="absolute z-10 -right-4 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center cursor-pointer"
        >
          <Image src="/Homepage/right_arrow.svg" alt="Right arrow" width={7} height={7} />
        </button>
      </div>
    </div>
  );
}
