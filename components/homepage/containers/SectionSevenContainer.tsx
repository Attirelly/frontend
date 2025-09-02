// "use client";

// import { manrope } from "@/font";
// import CardTypeFive from "../cards/CardTypeFive";
// import Image from "next/image";
// import { useEffect, useState } from "react";
// import { api } from "@/lib/axios";

// interface CardData {
//   id: string;
//   imageUrl: string;
//   discountText?: string;
//   title: string;
//   description?: string;
//   price: number;
//   mrp: number;
//   discount: number;
// }

// const SECTION_NUMBER = 7;
// const DESKTOP_VISIBLE_COUNT = 5;
// const TAB_VISIBLE_COUNT = 3;
// const MOBILE_VISIBLE_COUNT = 2;

// export default function SectionSevenContainer() {
//   const [startIndex, setStartIndex] = useState(0);
//   const [viewAll, setViewAll] = useState("");
//   const [name, setName] = useState("");
//   const [products, setProducts] = useState<CardData[]>([]);
//   const [visibleCount, setVisibleCount] = useState(DESKTOP_VISIBLE_COUNT);
//   const [screenSize, setScreenSize] = useState("sm");

//   useEffect(() => {
//     const updateVisibleCount = () => {
//       if (window.innerWidth < 768) {
//         setVisibleCount(MOBILE_VISIBLE_COUNT);
//         setScreenSize("sm");
//       } else if (window.innerWidth < 1024) {
//         setVisibleCount(TAB_VISIBLE_COUNT);
//         setScreenSize("md");
//       } else if (window.innerWidth < 1300) {
//         setVisibleCount(DESKTOP_VISIBLE_COUNT);
//         setScreenSize("lg");
//       } else {
//         setVisibleCount(DESKTOP_VISIBLE_COUNT);
//         setScreenSize("xl");
//       }
//     };
//     updateVisibleCount();
//     window.addEventListener("resize", updateVisibleCount);
//     return () => window.removeEventListener("resize", updateVisibleCount);
//   }, []);

//   useEffect(() => {
//     const fetchSegmentInfo = async () => {
//       try {
//         const res = await api.get(
//           `homepage/get_products_by_section_number/${SECTION_NUMBER}`
//         );
//         const productData = res.data;

//         const formattedProducts: CardData[] = productData.map((p: any) => ({
//           id: p.product_id,
//           imageUrl: p.images?.[0]?.image_url || "/Homepage/CardTypeOne.svg",
//           title: p.title,
//           description: p.stores?.store_name || "",
//           price: p.variants?.[0]?.price || 0,
//           mrp: p.variants?.[0]?.mrp || 0,
//           discount: p.variants?.[0]?.discount || 0,
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
//     <div className="w-full mx-auto space-y-4 lg:space-y-8">
//       <div className="flex px-4 lg:px-0">
//         <span
//           className={`${manrope.className} text-xl md:text-2xl lg:text-3xl text-[#242424]`}
//           style={{ fontWeight: 400 }}
//         >
//           {name}
//         </span>
//         {viewAll && (
//           <a
//             href={viewAll}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="flex ml-auto items-center gap-1 lg:gap-2"
//           >
//             <span
//               className={`${manrope.className} text-sm lg:text-base text-[#242424]`}
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
//             ${visibleCount === 4 ? "grid-cols-4 gap-x-12" : ""}
//             ${visibleCount === 5 ? "grid-cols-5 gap-x-12" : ""}
//            `}
//         >
//           {visibleCards.map((card) => (
//             <a
//               key={card.id}
//               href={`/product_detail/${card.id}`}
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               <CardTypeFive
//                 imageUrl={card.imageUrl}
//                 title={card.title}
//                 description={card.description || ""}
//                 price={card.price}
//                 mrp={card.mrp}
//                 discount={card.discount}
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

"use client";

import { manrope } from "@/font";
import CardTypeFive from "../cards/CardTypeFive";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/axios";

interface CardData {
  id: string;
  imageUrl: string;
  title: string;
  description?: string;
  price: number;
  mrp: number;
  discount: number;
}

const SECTION_NUMBER = 7;

export default function SectionSevenContainer() {
  const [name, setName] = useState("");
  const [viewAll, setViewAll] = useState("");
  const [products, setProducts] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);

  // CHANGED: Use a ref for direct DOM access to the scroller
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // REMOVED: All state and useEffect for screenSize, startIndex, and visibleCount are gone.

  useEffect(() => {
    const fetchSegmentInfo = async () => {
      setLoading(true);
      try {
        const res = await api.get(`homepage/get_products_by_section_number/${SECTION_NUMBER}`);
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

        const resSection = await api.get(`/homepage/get_section_by_number/${SECTION_NUMBER}`);
        const sectionData = resSection.data;
        setViewAll(sectionData.section_url);
        setName(sectionData.section_name);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSegmentInfo();
  }, []);

  // CHANGED: Navigation logic now manipulates scroll position
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

  // ADDED: Loading skeleton can be shown here
  // if (loading) { return <YourSkeletonComponent />; }
  
  if (!products || products.length === 0) {
    return null; // Render nothing if there are no products
  }

  return (
    <div className="w-full mx-auto space-y-4 lg:space-y-8">
      <div className="flex items-center px-4 lg:px-0">
        <span className={`${manrope.className} text-xl md:text-2xl lg:text-3xl`} style={{ fontWeight: 400 }}>
          {name}
        </span>
        {viewAll && (
          <a href={viewAll} target="_blank" rel="noopener noreferrer" className="flex ml-auto items-center gap-1 lg:gap-2">
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
              <a href={`/product_detail/${card.id}`} target="_blank" rel="noopener noreferrer">
                {/* REMOVED: screenSize prop is gone */}
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