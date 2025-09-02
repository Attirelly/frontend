// "use client";

// import { manrope } from "@/font";
// import Image from "next/image";
// import CardTypeSix from "../cards/CardTypeSix";
// import { useEffect, useState } from "react";
// import { api } from "@/lib/axios";
// import SectionTwoContainerSkeleton from "../skeleton/SectionTwoContainerSkeleton";

// interface CardData {
//   id: string;
//   imageUrl: string;
//   discountText?: string;
//   title: string;
//   description?: string;
//   categoryLandingUrl?: string;
// }

// const SECTION_NUMBER = 2;
// const DESKTOP_VISIBLE_COUNT = 4;
// const TAB_VISIBLE_COUNT = 3;
// const MOBILE_VISIBLE_COUNT = 2;

// export default function SectionTwoContainer() {
//   const [startIndex, setStartIndex] = useState(0);
//   const [viewAll, setViewAll] = useState("");
//   const [name, setName] = useState("");
//   const [products, setProducts] = useState<CardData[]>([]);
//   const [visibleCount, setVisibleCount] = useState(DESKTOP_VISIBLE_COUNT);
//   const [screenSize, setScreenSize] = useState('sm');
//   const [loading, setLoading] = useState(true);


//   // ✅ handle responsive breakpoints
//   useEffect(() => {
//     const updateVisibleCount = () => {
//       if (window.innerWidth < 768) {
//         setVisibleCount(MOBILE_VISIBLE_COUNT);
//         setScreenSize('sm');
//       } else if (window.innerWidth < 1024) {
//         setVisibleCount(TAB_VISIBLE_COUNT);
//         setScreenSize('md');
//       } else if(window.innerWidth < 1300){
//         setVisibleCount(DESKTOP_VISIBLE_COUNT);
//         setScreenSize('lg')
//       }else{
//         setVisibleCount(DESKTOP_VISIBLE_COUNT);
//         setScreenSize('xl')
//       }
//     };

//     updateVisibleCount();
//     window.addEventListener("resize", updateVisibleCount);
//     return () => window.removeEventListener("resize", updateVisibleCount);
//   }, []);

//   // ✅ fetch API
//   useEffect(() => {
//     const fetchSegmentInfo = async () => {
//       try {
//         const res = await api.get(
//           `homepage/categories_by_section_number/${SECTION_NUMBER}`
//         );
//         const productData = res.data;

//         const formattedProducts: CardData[] = productData.map((p: any) => ({
//           id: p.category_id,
//           imageUrl: p.image_url,
//           title: p.name,
//           categoryLandingUrl: p.category_landing_url || "",
//         }));
//         setProducts(formattedProducts);

//         const resSection = await api.get(
//           `/homepage/get_section_by_number/${SECTION_NUMBER}`
//         );
//         const sectionData = resSection.data;
//         setViewAll(sectionData.section_url);
//         setName(sectionData.section_name);
//       } catch (error) {
//         console.error("Failed to fetch data:", error);
//       }
//       finally {
//         setLoading(false);
//       }
//     };

//     fetchSegmentInfo();
//   }, []);

  // const totalCards = products.length;

  // const handleNext = () => {
  //   if (totalCards > 0) {
  //     setStartIndex((prev) => (prev + 1) % totalCards);
  //   }
  // };

  // const handlePrev = () => {
  //   if (totalCards > 0) {
  //     setStartIndex((prev) => (prev - 1 + totalCards) % totalCards);
  //   }
  // };

  // // ✅ responsive visible cards
  // const visibleCards = Array.from({ length: visibleCount }, (_, i) => {
  //   const realIndex = (startIndex + i) % totalCards;
  //   return products[realIndex];
  // });

//   if (loading) {
//     return <SectionTwoContainerSkeleton />;
//   }

//   if (!products || products.length === 0) {
//     return <div></div>;
//   }

//   return (
//     <div className="w-full mx-auto space-y-4 lg:space-y-8">
//       {/* Title + View All */}
//       <div className="flex px-4 lg:px-0">
//         <span
//           className={`${manrope.className} text-xl md:text-2xl lg:text-3xl text-[#242424]`}
//           style={{ fontWeight: 400 }}
//         >
//           {name}
//         </span>
//         {viewAll && (
//           <a
//           href={viewAll}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="flex ml-auto items-center gap-1 lg:gap-2"
//         >
//           <span
//             className={`${manrope.className} text-sm lg:text-base text-[#242424]`}
//             style={{ fontWeight: 400 }}
//           >
//             View All
//           </span>
//           <Image
//             src="/Homepage/view_all_arrow.svg"
//             alt="View All"
//             width={12}
//             height={16}
//           />
//         </a>
//         )}
//       </div>

//       {/* Main scrolling container */}
//       <div className="relative flex items-center">
//         {/* Prev Button */}
//         <button
//           onClick={handlePrev}
//           className="absolute z-10 left-0 top-1/2 -translate-x-1/4 md:-translate-x-1/2 -translate-y-1/2 bg-[#D9D9D9] shadow-md rounded-full w-8 h-8 flex items-center justify-center cursor-pointer lg:hidden"
//         >
//           <Image
//             src="/Homepage/left_arrow.svg"
//             alt="Left arrow"
//             width={7}
//             height={7}
//           />
//         </button>

//         {/* Card Grid */}
//         <div
//           className={`w-full grid 
//             ${visibleCount === 2 ? "grid-cols-2 gap-x-2" : ""}
//             ${visibleCount === 3 ? "grid-cols-3 gap-x-10" : ""}
//             ${visibleCount === 4 ? "grid-cols-4 gap-x-12" : ""}`}
//         >
//           {visibleCards.map((card) => (
//             <a
//               key={card.id}
//               href={card?.categoryLandingUrl || "#"}
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               <CardTypeSix
//                 imageUrl={card.imageUrl}
//                 title={card.title}
//                 description={card.description || ""}
//                 screenSize={screenSize}
//               />
//             </a>
//           ))}
//         </div>

//         {/* Next Button */}
//         <button
//           onClick={handleNext}
//           className="absolute z-10 right-0 top-1/2 translate-x-1/4 md:translate-x-1/2 -translate-y-1/2 bg-[#D9D9D9] shadow-md rounded-full w-8 h-8 flex items-center justify-center cursor-pointer lg:hidden"
//         >
//           <Image
//             src="/Homepage/right_arrow.svg"
//             alt="Right arrow"
//             width={7}
//             height={7}
//           />
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

interface CardData {
  id: string;
  imageUrl: string;
  title: string;
  description?: string;
  categoryLandingUrl?: string;
}

const SECTION_NUMBER = 2;

export default function SectionTwoContainer() {
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
  useEffect(() => {
    const fetchSegmentInfo = async () => {
      setLoading(true);
      try {
        const res = await api.get(`homepage/categories_by_section_number/${SECTION_NUMBER}`);
        const formattedProducts = res.data.map((p: any) => ({
          id: p.category_id,
          imageUrl: p.image_url,
          title: p.name,
          categoryLandingUrl: p.category_landing_url || "",
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
          <a href={viewAll} target="_blank" rel="noopener noreferrer" className="flex ml-auto items-center gap-1 lg:gap-2">
            <span className={`${manrope.className} text-sm lg:text-base`} style={{ fontWeight: 400 }}>
              View All
            </span>
            <Image src="/Homepage/view_all_arrow.svg" alt="View All" width={12} height={16} />
          </a>
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
                <a href={card?.categoryLandingUrl || "#"} target="_blank" rel="noopener noreferrer">
                  <CardTypeSix
                    imageUrl={card.imageUrl}
                    title={card.title}
                    description={card.description || ""}
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