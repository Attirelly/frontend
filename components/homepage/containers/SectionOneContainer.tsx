// "use client";

// import { useEffect, useRef, useState } from "react";
// import Image from "next/image";
// import CardTypeThree from "../cards/CardTypeThree";
// import { manrope } from "@/font";
// import { api } from "@/lib/axios";

// interface CardData {
//   id: string;
//   imageUrl: string;
//   title: string;
//   description?: string;
//   categoryLandingUrl?: string;
// }

// const SECTION_NUMBER = 1;

// export default function SectionOneContainer() {
//   const [viewAll, setViewAll] = useState("");
//   const [name, setName] = useState("");
//   const [products, setProducts] = useState<CardData[]>([]);
//   const [loading, setLoading] = useState(true);

//   // CHANGED: Use a ref to get direct access to the scrollable element
//   const scrollContainerRef = useRef<HTMLDivElement>(null);

//   // REMOVED: All state for startIndex and visibleCards is gone.

//   useEffect(() => {
//     const fetchSegmentInfo = async () => {
//       setLoading(true);
//       try {
//         const res = await api.get(`homepage/categories_by_section_number/${SECTION_NUMBER}`);
//         const productData = res.data;

//         const formattedProducts: CardData[] = productData.map((p: any) => ({
//           id: p.category_id,
//           imageUrl: p.image_url,
//           title: p.name,
//           categoryLandingUrl: p.category_landing_url || "",
//         }));
//         setProducts(formattedProducts);

//         const resSection = await api.get(`/homepage/get_section_by_number/${SECTION_NUMBER}`);
//         const sectionData = resSection.data;
//         setViewAll(sectionData.section_url);
//         setName(sectionData.section_name);
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchSegmentInfo();
//   }, []);

//   // CHANGED: Navigation logic now directly manipulates the scroll position
//   const handleNext = () => {
//     if (scrollContainerRef.current) {
//       const scrollAmount = scrollContainerRef.current.offsetWidth;
//       scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
//     }
//   };

//   const handlePrev = () => {
//     if (scrollContainerRef.current) {
//       const scrollAmount = scrollContainerRef.current.offsetWidth;
//       scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
//     }
//   };
  
//   // You can add a skeleton loader for the loading state if you wish
//   // if (loading) { return <YourSkeletonComponent />; }

//   if (!products || products.length === 0) {
//     return null;
//   }

//   return (
//     // CHANGED: Main container is now fluid, centered, and has padding.
//     <div className="w-full max-w-7xl mx-auto px-4 space-y-4 md:space-y-8">
//       <div className="flex items-center">
//         <span className={`${manrope.className} text-xl md:text-2xl lg:text-3xl`} style={{ fontWeight: 400 }}>
//           {name}
//         </span>
//         {viewAll && (
//           <a href={viewAll} target="_blank" rel="noopener noreferrer" className="ml-auto flex items-center gap-2">
//             <span className={`${manrope.className} text-sm lg:text-base`} style={{ fontWeight: 400 }}>
//               View All
//             </span>
//             <Image src="/Homepage/right_arrow.svg" alt="View All" width={5} height={5} />
//           </a>
//         )}
//       </div>

//       <div className="relative flex items-center">
//         {/* Prev Button */}
//         <button
//           onClick={handlePrev}
//           className="absolute z-10 -left-4 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center cursor-pointer"
//         >
//           <Image src="/Homepage/left_arrow.svg" alt="Left arrow" width={7} height={7} />
//         </button>

//         {/* CHANGED: This is now a flex container for the carousel */}
//         <div
//           ref={scrollContainerRef}
//           className="flex w-full space-x-4 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-none px-2"
//         >
//           {/* CHANGED: Map over the entire products array */}
//           {products.map((card) => (
//             // CHANGED: This wrapper div defines the responsive width of each card
//             <div key={card.id} className="flex-shrink-0 w-1/2 md:w-1/3 lg:w-1/5 snap-start">
//               <a href={card?.categoryLandingUrl || "#"} target="_blank" rel="noopener noreferrer">
//                 <CardTypeThree
//                   imageUrl={card.imageUrl}
//                   title={card.title}
//                   description={card.description || ""}
//                 />
//               </a>
//             </div>
//           ))}
//         </div>

//         {/* Next Button */}
//         <button
//           onClick={handleNext}
//           className="absolute z-10 -right-4 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center cursor-pointer"
//         >
//           <Image src="/Homepage/right_arrow.svg" alt="Right arrow" width={7} height={7} />
//         </button>
//       </div>
//     </div>
//   );
// }

'use client';

import { manrope } from "@/font";
import Image from "next/image";
import CardTypeSix from "../cards/CardTypeSix";
import { useEffect, useState, useMemo } from "react";
import { api } from "@/lib/axios";
import SectionTwoContainerSkeleton from "../skeleton/SectionTwoContainerSkeleton";
import Link from "next/link";

interface CardData {
  id: string;
  imageUrl: string;
  title: string;
  description?: string;
  landingUrl?: string;
}

const SECTION_NUMBER = 1;


/**
 * SectionTwoContainer component
 * 
 * A responsive and advanced carousel component that displays a slidable list of cards
 * in a seamless, infinite loop. It fetches its content and title dynamically based on a section number.
 *
 * ## Features
 * - Displays a section title and a "View All" link, both fetched from an API.
 * - Renders a horizontal carousel of cards using the {@link CardTypeSix} component.
 * - **Infinite Loop**: Implements a seamless, infinite scrolling effect by cloning items at the beginning and end of the list and performing a "magic jump" when reaching the cloned sections.
 * - **Responsive**: The number of visible cards in the carousel adjusts based on screen width (2 for mobile, 3 for tablet, 4 for desktop).
 * - **Navigation**: Provides "Previous" and "Next" arrow buttons for manual control.
 * - **Skeleton Loading**: Shows a skeleton placeholder (`SectionTwoContainerSkeleton`) while data is being fetched.
 *
 * ## Logic Flow
 * 1.  On mount, `useEffect` sets a `loading` state to `true` and renders the skeleton.
 * 2.  Two API calls are made: one to fetch the card data for the section and another to fetch the section's metadata (title and "View All" URL).
 * 3.  The fetched data is stored in state, and `loading` is set to `false`.
 * 4.  The core of the infinite scroll is the `displayProducts` array. It is created by taking the original list of products and adding a few "clones" from the end to the beginning and from the beginning to the end. `[endClones, realItems, startClones]`.
 * 5.  The visual sliding is achieved by applying a `transform: translateX()` style to a flex container holding all `displayProducts`. The position is calculated based on the `currentIndex`.
 * 6.  When the user navigates to the end of the *real* items and into the `startClones` area, a `setTimeout` triggers after the slide animation. It then instantly jumps the carousel back to the beginning of the *real* items by disabling the CSS transition, updating the index, and then re-enabling the transition. This creates a seamless, infinite loop. The same logic applies in reverse.
 *
 * ## Key Data Structures
 * - **CardData**: An interface defining the shape of each card's data, including `id`, `imageUrl`, and `title`.
 * - **displayProducts**: A `useMemo`-derived array that includes the original products plus clones at both ends to enable the infinite loop effect.
 *
 * ## Imports
 * - **Core/Libraries**: `useEffect`, `useState`, `useMemo` from `react`; `Link`, `Image` from Next.js.
 * - **Key Components**:
 *    - {@link CardTypeSix}: The card component used to render each item in the carousel.
 *    - {@link SectionTwoContainerSkeleton}: The skeleton loader component.
 * - **Utilities**:
 *    - `api` from `@/lib/axios`: The configured Axios instance for API calls.
 *    - `manrope` from `@/font`: Custom font for consistent typography.
 *
 * ## API Calls
 * - `GET /homepage/categories_by_section_number/{id}`: Fetches the list of cards (categories) to display in the carousel for a given section number.
 * - `GET /homepage/get_section_by_number/{id}`: Fetches the metadata for the section, such as its title and "View All" link.
 *
 * ## Props
 * - This component does not accept any props.
 *
 * @returns {JSX.Element | null} The rendered carousel component, its skeleton, or null if no products are found.
 */
export default function SectionOneContainer() {
  const [viewAll, setViewAll] = useState("");
  const [name, setName] = useState("");
  const [products, setProducts] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);

  // --- CAROUSEL STATE ---
  const [currentIndex, setCurrentIndex] = useState(0); // Tracks the current slide position
  const [visibleCount, setVisibleCount] = useState(4); // How many cards are visible
  const [isTransitioning, setIsTransitioning] = useState(true); // To manage the "magic jump" animation

  // Set the number of clones based on the max possible visible count
  const clonesCount = 4;

  // --- RESPONSIVE LOGIC ---
  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth < 768) setVisibleCount(2);
      else if (window.innerWidth < 1024) setVisibleCount(3);
      else setVisibleCount(4);
    };
    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  // --- API FETCH LOGIC ---
  console.log();
  useEffect(() => {
    const fetchSegmentInfo = async () => {
      setLoading(true);
      try {
        const res = await api.get(`homepage/flat_curation_items/${SECTION_NUMBER}`);
        const formattedProducts = res.data.map((p: any) => ({
          id: p.id,
          imageUrl: p.image_url,
          title: p.heading,
          landingUrl: p.landing_url || "",
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

  // --- INFINITE SCROLL LOGIC ---

  // 1. Create a new array with clones at the beginning and end
  const displayProducts = useMemo(() => {
    if (products.length === 0) return [];
    const startClones = products.slice(0, clonesCount);
    const endClones = products.slice(products.length - clonesCount);
    return [...endClones, ...products, ...startClones];
  }, [products]);

  // 2. Handle the "magic jump" when reaching the cloned sections
  useEffect(() => {
    if (!isTransitioning) {
        // After a jump, re-enable the transition for the next user interaction
        setTimeout(() => {
            setIsTransitioning(true);
        }, 50); // A small delay to ensure the style is applied
    }
  }, [isTransitioning]);


  const handleNext = () => {
    if (!isTransitioning) return;
    setCurrentIndex(prev => prev + 1);

    if (currentIndex === products.length + clonesCount - 1) {
        // If we are at the last *real* item and click next, we slide to the first clone
        // then instantly jump back to the first *real* item.
        setTimeout(() => {
            setIsTransitioning(false); // Disable transition for the jump
            setCurrentIndex(clonesCount);
        }, 500); // This should match your transition duration
    }
  };

  const handlePrev = () => {
    if (!isTransitioning) return;
    setCurrentIndex(prev => prev - 1);

    if (currentIndex === clonesCount) {
        // If we are at the first *real* item and click prev, we slide to the last clone
        // then instantly jump back to the last *real* item.
        setTimeout(() => {
            setIsTransitioning(false);
            setCurrentIndex(products.length + clonesCount - 1);
        }, 500); // This should match your transition duration
    }
  };


  if (loading) return <SectionTwoContainerSkeleton />;
  if (!products || products.length === 0) return null;

  // Calculate offset based on the new, longer `displayProducts` array
  const cardWidthPercentage = 100 / visibleCount;
  // We subtract the initial clone offset to align the first real item correctly
  const carouselOffset = -(currentIndex - (clonesCount - (clonesCount / visibleCount))) * (100 / clonesCount);


  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 lg:space-y-8 text-black px-2">
      <div className="flex items-center">
        <span className={`${manrope.className} text-xl md:text-2xl lg:text-3xl`} style={{ fontWeight: 400 }}>
          {name}
        </span>
        {viewAll && (
          <Link href={viewAll} target="_blank" rel="noopener noreferrer" className="flex ml-auto items-center gap-1 lg:gap-2">
            <span className={`${manrope.className} text-sm lg:text-base`} style={{ fontWeight: 400 }}>
              View All
            </span>
            <Image src="/Homepage/view_all_arrow.svg" alt="View All" width={12} height={16} />
          </Link>
        )}
      </div>

      <div className="relative flex items-center">
        <button
          onClick={handlePrev}
          className="absolute z-10 left-0 top-1/2 -translate-y-1/2 -translate-x-1/4 bg-[#D9D9D9] shadow-md rounded-full w-10 h-10 flex items-center justify-center cursor-pointer lg:hidden"
        >
          <Image src="/Homepage/left_arrow.svg" alt="Left arrow" width={7} height={7} />
        </button>

        <div className="w-full overflow-hidden">
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
                key={`${card.id}-${index}`}
                className="flex-shrink-0 px-2"
                style={{ width: `${100 / displayProducts.length}%` }}
              >
                <Link href={card?.landingUrl || "#"} target="_blank" rel="noopener noreferrer">
                  <CardTypeSix
                    imageUrl={card.imageUrl}
                    title={card.title}
                    description={card.description || ""}
                  />
                </Link>
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