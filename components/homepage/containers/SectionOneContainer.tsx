// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import CardTypeThree from "../cards/CardTypeThree";
// import { manrope } from "@/font";
// import { useRouter } from "next/navigation";
// import { api } from "@/lib/axios";

// interface CardData {
//   id: string;
//   imageUrl: string;
//   discountText?: string;
//   title: string;
//   description?: string;
//   categoryLandingUrl?: string;
// }

// const SECTION_NUMBER = 1;

// export default function SectionOneContainer() {
//   const [startIndex, setStartIndex] = useState(0);
//   const visibleCount = 5;
//   const cardWidth = 232; // Width of each card
//   const gap = 20; // Tailwind gap-5 = 1.25rem = 20px
//   const [viewAll, setViewAll] = useState("");
//   const [name, setName] = useState("");
//   const [products, setProducts] = useState<CardData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

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
//           // description: `${p.stores?.area?.name || ''}, ${p.stores?.city?.name || ''}`,
//         }));
//         setProducts(formattedProducts);

//         const resSection = await api.get(
//           `/homepage/get_section_by_number/${SECTION_NUMBER}`
//         );
//         const sectionData = resSection.data;
//         setViewAll(sectionData.section_url);
//         setName(sectionData.section_name);
//       } catch (error) {
//         console.error(error);
//       }
//       finally {
//         setLoading(false);
//       }
//     };

//     fetchSegmentInfo();
//   }, []);

//   const totalCards = products.length;

//   const handleNext = () => {
//     if (totalCards > 0) {
//       setStartIndex((prev) => (prev + 1) % totalCards);
//     }
//   };

//   const handlePrev = () => {
//     if (totalCards > 0) {
//       setStartIndex((prev) => (prev - 1 + totalCards) % totalCards);
//     }
//   };

//   const visibleCards = Array.from({ length: visibleCount }, (_, i) => {
//     const realIndex = (startIndex + i) % totalCards;
//     return products[realIndex];
//   });

//   if (!products || products.length == 0) {
//     return <div></div>;
//   }

//   return (
//     <div className="w-[1242px]  mx-auto space-y-8">
//       <div className="flex items-center">
//         <span
//           className={`${manrope.className} text-4xl text-[#242424]`}
//           style={{ fontWeight: 400 }}
//         >
//           {name}
//         </span>
//         {viewAll && (
//           <a
//             href={viewAll}
//             target="_blank"
//             rel="noopener noreferrer"
//             // Add ml-auto here to push this element to the right
//             className="ml-auto flex items-center gap-2"
//           >
//             <span
//               className={`${manrope.className} text-base text-[#242424]`}
//               style={{ fontWeight: 400 }}
//             >
//               View All
//             </span>
//             <Image
//               src="/Homepage/right_arrow.svg"
//               alt="View All"
//               width={5}
//               height={5}
//             />
//           </a>
//         )}
//       </div>

//       <div className="relative">
//         {/* Navigation Arrows */}
//         <button
//           onClick={handlePrev}
//           // disabled={startIndex === 0}
//           className="absolute z-50 left-0 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-[#D9D9D9] shadow-md rounded-full w-10 h-10 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
//         >
//           <Image
//             src="/Homepage/left_arrow.svg"
//             alt="Left arrow"
//             width={7}
//             height={7}
//           />
//         </button>

//         <div className="overflow-hidden">
//           <div className="flex gap-5 transition-transform duration-500 ease-in-out">
//             {visibleCards.map((card) => (
//               <div key={card?.id} style={{ minWidth: `${cardWidth}px` }}>
//                 <a
//                   href={card?.categoryLandingUrl || "#"}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   <CardTypeThree
//                     imageUrl={card?.imageUrl}
//                     title={card?.title}
//                     description={card?.description || ""}
//                   />
//                 </a>
//               </div>
//             ))}
//           </div>
//         </div>

//         <button
//           onClick={handleNext}
//           // disabled={startIndex === maxIndex}
//           className="absolute z-10 right-0 translate-x-1/2 top-1/2 -translate-y-1/2 bg-[#D9D9D9] shadow-md rounded-full w-10 h-10 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
//         >
//           <Image
//             src="/Homepage/right_arrow.svg"
//             alt="Left arrow"
//             width={7}
//             height={7}
//           />
//         </button>
//       </div>
//     </div>
//   );
// }

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
