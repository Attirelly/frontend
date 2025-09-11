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

/**
 * @module CardStack
 * @description A sophisticated carousel component that displays a visually engaging stack of cards with a 3D perspective.
 * The central card is featured prominently, while adjacent cards are layered behind it.
 *
 * ## Features
 * - Renders a dynamic section title fetched from an API.
 * - **3D Stacking Effect**: Creates a visually appealing stack of cards using CSS `transform` (scale and translateX) and `z-index`. The central card is enlarged and brought to the front.
 * - **Responsive Display**: The number of visible cards in the stack adapts to the screen size (1 on mobile, 3 on tablet, 5 on desktop).
 * - **Infinite Loop**: Implements seamless, circular navigation. When the user navigates past the last item, the first one smoothly comes into view, and vice-versa.
 * - **Navigation**: Provides "Previous" and "Next" arrow buttons for manual control.
 * - **Skeleton Loading**: Displays a skeleton placeholder (`SectionFourContainerSkeleton`) while fetching initial data.
 *
 * ## Logic Flow
 * 1.  On mount, the component sets a `loading` state to `true` and renders a skeleton. It also sets up a resize listener to track screen size.
 * 2.  A `useEffect` hook fetches both the product data and the section's metadata (title) from two separate API endpoints.
 * 3.  Once data is fetched, it's stored in state, and `loading` is set to `false`, causing the component to render the card stack.
 * 4.  The core logic resides in the `getVisibleCards` function. Based on the current screen size, it determines how many cards to show.
 * 5.  It calculates a "visible window" of indices around the current `centerIndex`. Using modulo arithmetic, it handles the wrap-around to create an infinite loop.
 * 6.  For each visible card, it calculates an `offset` from the center. This offset is then used to dynamically apply CSS styles for `transform`, `scale`, `z-index`, and `height`, creating the 3D stacking effect.
 * 7.  The `handleNext` and `handlePrev` functions update the `centerIndex`, which triggers a re-calculation of visible cards and their styles, resulting in a smooth animation.
 *
 * ## Imports
 * - **Core/Libraries**: `useState`, `useEffect`, `useCallback` from `react`; `Image` from `next/image`.
 * - **Key Components**:
 *    - {@link CardTypeOne}: The card component used to render each item in the stack.
 *    - {@link SectionFourContainerSkeleton}: The skeleton loader component.
 * - **Utilities**:
 *    - `api` from `@/lib/axios`: The configured Axios instance for API calls.
 *    - `manrope` from `@/font`: Custom font for consistent typography.
 *
 * ## Key Data Structures
 * - **CardData**: An interface defining the shape of each card's data, including `id`, `imageUrl`, `title`, and `description`.
 * - **visibleCards**: A derived array of card objects. Each object is augmented with its `originalIndex` and `offset` from the center, which are used to calculate its dynamic styling.
 *
 * ## API Calls
 * - `GET /homepage/get_products_by_section_number/{id}`: Fetches the list of products to display in the card stack for a given section number.
 * - `GET /homepage/get_section_by_number/{id}`: Fetches the metadata for the section, such as its title.
 *
 * ## Props
 * - This component does not accept any props.
 *
 * @returns {JSX.Element | null} The rendered card stack component, its skeleton, or null if no products are found.
 */
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

  // Fetch data based on section number and fetch section data based on section number
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

  // loading state untill products are loaded
  if (loading) {
    return <SectionFourContainerSkeleton />;
  }
  
  // display empty div if no products found
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
