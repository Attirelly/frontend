'use client';

import { manrope } from "@/font";
import CardTypeFive from "../cards/CardTypeFive";
import Image from "next/image";
import { useEffect, useState, useMemo } from "react";
import { api } from "@/lib/axios";
import SectionThreeContainerSkeleton from "../skeleton/SectionThreeContainerSkeleton";

interface CardData {
  id: string;
  imageUrl: string;
  title: string;
  description?: string;
  price: number;
  mrp: number;
  discount: number;
}

const SECTION_NUMBER = 3;


/**
 * SectionThreeContainer component
 * 
 * An advanced and responsive carousel component that displays a slidable list of product cards
 * in a seamless, infinite loop. It fetches its content and title dynamically based on a section number.
 *
 * ## Features
 * - Displays a section title and a "View All" link, both fetched from an API.
 * - Renders a horizontal carousel of product cards using the {@link CardTypeFive} component, which includes pricing information.
 * - **Infinite Loop**: Implements a seamless, infinite scrolling effect by cloning items at the beginning and end of the list and performing a "magic jump" when reaching the cloned sections.
 * - **Responsive**: The number of visible cards adjusts based on screen width (2 for mobile, 3 for tablet, and 5 for desktop).
 * - **Navigation**: Provides "Previous" and "Next" arrow buttons for manual control.
 * - **Skeleton Loading**: Shows a skeleton placeholder (`SectionThreeContainerSkeleton`) while data is being fetched.
 *
 * ## Logic Flow
 * 1.  On mount, a `loading` state is set to `true`, and the skeleton component is rendered.
 * 2.  Two API calls are made: one to fetch the product data for the section and another for the section's metadata (title and "View All" URL).
 * 3.  The fetched data is stored in state, and `loading` is set to `false`.
 * 4.  The core of the infinite scroll is the `displayProducts` array, created with `useMemo`. It takes the original product list and adds clones to the beginning and end: `[endClones, realItems, startClones]`.
 * 5.  The visual sliding is achieved by applying a `transform: translateX()` style to a flex container. The position is calculated based on the `currentIndex`.
 * 6.  When the user navigates past the *real* items into a cloned area, a `setTimeout` triggers after the slide animation. It then performs a "magic jump" by instantly resetting the `currentIndex` to the corresponding *real* item, with the CSS transition temporarily disabled to hide the jump.
 *
 * ## Imports
 * - **Core/Libraries**: `useEffect`, `useState`, `useMemo` from `react`; `Image` from `next/image`.
 * - **Key Components**:
 *    - {@link CardTypeFive}: The card component used to render each product in the carousel.
 *    - {@link SectionThreeContainerSkeleton}: The skeleton loader component.
 * - **Utilities**:
 *    - `api` from `@/lib/axios`: The configured Axios instance for API calls.
 *    - `manrope` from `@/font`: Custom font for consistent typography.
 *
 * ## Key Data Structures
 * - **CardData**: An interface defining the shape of each product card's data, including `id`, `imageUrl`, `title`, `price`, `mrp`, and `discount`.
 * - **displayProducts**: A `useMemo`-derived array that includes the original products plus clones at both ends to enable the infinite loop effect.
 *
 * ## API Calls
 * - `GET /homepage/get_products_by_section_number/{id}`: Fetches the list of products to display in the carousel for a given section number.
 * - `GET /homepage/get_section_by_number/{id}`: Fetches the metadata for the section, such as its title and "View All" link.
 *
 * ## Props
 * - This component does not accept any props.
 *
 * @returns {JSX.Element | null} The rendered carousel component, its skeleton, or null if no products are found.
 */
export default function SectionThreeContainer() {
  const [viewAll, setViewAll] = useState("");
  const [name, setName] = useState("");
  const [products, setProducts] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);

  // --- 1. COPIED: Carousel state from the reference component ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(5); // Default to large screen
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Set the number of clones based on the max possible visible count for this section
  const clonesCount = 5;

  // --- 2. ADAPTED: Responsive logic for this section's card counts ---
  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth < 768) setVisibleCount(2);      // sm: 2 cards
      else if (window.innerWidth < 1024) setVisibleCount(3); // md: 3 cards
      else setVisibleCount(5);                              // lg: 5 cards
    };
    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  // --- 3. ADAPTED: API fetch logic to set the initial index ---
  useEffect(() => {
    const fetchSegmentInfo = async () => {
      setLoading(true);
      try {
        const res = await api.get(`homepage/get_products_by_section_number/${SECTION_NUMBER}`);
        const formattedProducts: CardData[] = res.data.map((p: any) => ({
          id: p.product_id,
          imageUrl: p.images?.[0]?.image_url || "/Homepage/CardTypeOne.svg",
          title: p.title,
          description: p.stores?.store_name || "",
          price: p.variants?.[0]?.price || 0,
          mrp: p.variants?.[0]?.mrp || 0,
          discount: p.variants?.[0]?.discount || 0,
        }));
        setProducts(formattedProducts);
        // Set the initial index to the start of the *real* items
        setCurrentIndex(clonesCount);

        const resSection = await api.get(`/homepage/get_section_by_number/${SECTION_NUMBER}`);
        setViewAll(resSection.data.section_url);
        setName(resSection.data.section_name);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSegmentInfo();
  }, []);

  // --- Infinite scroll cloning and transition logic ---
  const displayProducts = useMemo(() => {
    if (products.length === 0) return [];
    const startClones = products.slice(0, clonesCount);
    const endClones = products.slice(products.length - clonesCount);
    return [...endClones, ...products, ...startClones];
  }, [products]);

  useEffect(() => {
    if (!isTransitioning) {
      setTimeout(() => setIsTransitioning(true), 50);
    }
  }, [isTransitioning]);


  const handleNext = () => {
    if (!isTransitioning) return;
    setCurrentIndex(prev => prev + 1);

    if (currentIndex === products.length + clonesCount - 1) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(clonesCount);
      }, 500); // Must match transition duration
    }
  };

  const handlePrev = () => {
    if (!isTransitioning) return;
    setCurrentIndex(prev => prev - 1);

    if (currentIndex === clonesCount) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(products.length + clonesCount - 1);
      }, 500); // Must match transition duration
    }
  };

  if (loading) {
    return <SectionThreeContainerSkeleton />;
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    // Add padding to give space for the buttons
    <div className="w-full max-w-7xl mx-auto px-2 space-y-4 lg:space-y-8">
      <div className="flex items-center">
        <span className={`${manrope.className} text-xl md:text-2xl lg:text-3xl text-[#242424]`} style={{ fontWeight: 400 }}>
          {name}
        </span>
        {viewAll && (
          <a href={viewAll} target="_blank" rel="noopener noreferrer" className="flex ml-auto items-center gap-1 lg:gap-2">
            <span className={`${manrope.className} text-sm lg:text-base text-[#242424]`} style={{ fontWeight: 400 }}>
              View All
            </span>
            <Image src="/Homepage/right_arrow.svg" alt="View All" width={5} height={5} />
          </a>
        )}
      </div>

      {/* --- 5. UPDATED: JSX structure for the new carousel logic --- */}
      <div className="relative flex items-center">
        <button
          onClick={handlePrev}
          className="absolute z-10 left-0 top-1/2 -translate-y-1/2 -translate-x-1/4 bg-[#D9D9D9] shadow-md rounded-full w-10 h-10 flex items-center justify-center cursor-pointer lg:hidden"
        >
          <Image src="/Homepage/left_arrow.svg" alt="Left arrow" width={7} height={7} />
        </button>

        {/* The viewport */}
        <div className="w-full overflow-hidden">
          {/* The track that moves */}
          <div
            className="flex"
            style={{
              width: `${(displayProducts.length / visibleCount) * 100}%`,
              transform: `translateX(-${((currentIndex) / displayProducts.length) * 100}%)`,
              transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none',
            }}
          >
            {displayProducts.map((card, index) => (
              <div
                key={`${card.id}-${index}`} // Unique key for clones
                className="flex-shrink-0 px-2"
                style={{ width: `${100 / displayProducts.length}%` }}
              >
                <a href={`/product_detail/${card.id}`} target="_blank" rel="noopener noreferrer">
                  <CardTypeFive
                    imageUrl={card.imageUrl}
                    title={card.title}
                    description={card.description || ""}
                    price={card.price}
                    mrp={card.mrp}
                    discount={card.discount}
                  />
                </a>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleNext}
          className="absolute z-10 right-0 top-1/2 -translate-y-1/2 translate-x-1/4 bg-[#D9D9D9] shadow-md rounded-full w-10 h-10 flex items-center justify-center cursor-pointer lg:hidden"
        >
          <Image src="/Homepage/right_arrow.svg" alt="Right arrow" width={7} height={7} />
        </button>
      </div>
    </div>
  );
}

// NOTE: Make sure this utility class is in your global CSS file (e.g., globals.css)
/*
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
*/
