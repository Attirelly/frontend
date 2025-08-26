"use client";

import { manrope } from "@/font";
import Image from "next/image";
import CardTwoType from "../cards/CardTypeTwo";
import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import SectionEightContainerSkeleton from "../skeleton/SectionEightContainerSkeleton";

interface CardData {
  id: string;
  imageUrl: string;
  discountText?: string;
  title: string;
  description?: string;
}

const SECTION_NUMBER = 9;

export default function SectionNineContainer() {
  const [stores, setStores] = useState<CardData[]>([]);
  const [viewAll, setViewAll] = useState("");
  const [name, setName] = useState("");
  const [screenSize, setScreenSize] = useState('sm');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const updateVisibleCount = () => {
        if (window.innerWidth < 768) {
          setScreenSize('sm');
        } else if (window.innerWidth < 1024) {
          setScreenSize('md');
        } else if(window.innerWidth < 1300){
          setScreenSize('lg')
        }else{
          setScreenSize('xl')
        }
      };
  
      updateVisibleCount();
      window.addEventListener("resize", updateVisibleCount);
      return () => window.removeEventListener("resize", updateVisibleCount);
    }, []);

  useEffect(() => {
    const fetchStoresBySection = async () => {
      try {
        const res = await api.get(
          `homepage/stores_by_section_number/${SECTION_NUMBER}`
        );
        const storeData = res.data;

        const formattedStores: CardData[] = storeData.map((store: any) => ({
          id: store.store_id,
          imageUrl: store.profile_image || "/Homepage/CardImage.svg",
          title: store.store_name,
          description: store.area && store.area?.name.toLowerCase() === "others"? `${store.city?.name}` : `${store.area?.name}, ${store.city?.name}`,
        }));
        setStores(formattedStores);

        const resSection = await api.get(
          `/homepage/get_section_by_number/${SECTION_NUMBER}`
        );
        const sectionData = resSection.data;
        setViewAll(sectionData.section_url);
        setName(sectionData.section_name);
      } catch (error) {
        console.error("Failed to fetch store data:", error);
      }
      finally {
        setLoading(false);
      }
    };
    fetchStoresBySection();
  }, []);

  if (loading) {
    return <SectionEightContainerSkeleton />;
  }

  if (!stores || stores.length == 0) {
    return <div></div>;
  }

  return (
    <div className="w-full mx-auto space-y-4 lg:space-y-8">
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

      <div className="flex flex-col">
        <div className={`grid
        ${screenSize === 'sm' ? "grid-cols-2 gap-x-2" : ""}
            ${screenSize === 'md' ? "grid-cols-4 gap-x-10" : ""}
            ${screenSize === 'lg' || screenSize === 'xl' ? "grid-cols-4 gap-x-12" : ""}
            gap-y-6`}>
          {stores.map((card) => (
            <a
              key={card.id}
              href={`/store_profile/${card.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <CardTwoType
                imageUrl={card.imageUrl}
                title={card.title}
                description={card.description || ""}
                screenSize={screenSize}
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
