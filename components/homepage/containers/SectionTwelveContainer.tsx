// 'use client';

// import { useEffect, useState } from 'react';
// import Image from 'next/image';
// import { manrope } from '@/font';
// import CardTypeFour from '../cards/CardTypeFour';
// import { api } from '@/lib/axios';
// import SectionElevenContainerSkeleton from '../skeleton/SectionElevenContainerSkeleton';

// interface CardData {
//   id: string;
//   imageUrl: string;
//   discountText?: string;
//   title: string;
//   description?: string;
// }

// const SECTION_NUMBER = 12;
// const DESKTOP_VISIBLE_COUNT = 6;
// const TAB_VISIBLE_COUNT = 4;
// const MOBILE_VISIBLE_COUNT = 2;

// export default function SectionTwelveContainer() {
//   const [startIndex, setStartIndex] = useState(0);
//   const cardWidth = 184; // Width of each card
//   const gap = 20; // Tailwind gap-5 = 1.25rem = 20px
//   const [stores, setStores] = useState<CardData[]>([]);
//   const [viewAll, setViewAll] = useState('');
//   const [visibleCount, setVisibleCount] = useState(DESKTOP_VISIBLE_COUNT);
//   const [name, setName] = useState('');
//   const [loading, setLoading] = useState(true);

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
//     const fetchStoresBySection = async () => {
//       try {
//         const res = await api.get(`homepage/stores_by_section_number/${SECTION_NUMBER}`);
//         const storeData = res.data;

//         const formattedStores: CardData[] = storeData.map((store: any) => ({
//           id: store.store_id,
//           imageUrl: store.profile_image,
//           title: store.store_name,
//           description: store.area && store.area?.name.toLowerCase() === "others" ? `${store.city?.name}` : `${store.area?.name}, ${store.city?.name}`,
//         }));
//         setStores(formattedStores);

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
//     fetchStoresBySection()
//   }, []);

//   const totalCards = stores.length;

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
//     return stores[realIndex];
//   });

//   if (loading) {
//     return <SectionElevenContainerSkeleton />;
//   }

//   if (!stores || stores.length == 0) {
//     return <div></div>;
//   }
//   return (
//     <div className='w-full mx-auto space-y-4 lg:space-y-8'>
//       <div className='flex px-4 lg:px-2'>
//         <span className={`${manrope.className} text-xl md:text-2xl lg:text-3xl text-[#242424]`} style={{ fontWeight: 400 }}>{name}</span>
//         {viewAll && (
//           <a
//             href={viewAll}
//             target="_blank"
//             rel="noopener noreferrer"
//             className='flex ml-auto items-center gap-1 lg:gap-2'>
//             <span className={`${manrope.className} text-sm lg:text-base text-[#242424]`} style={{ fontWeight: 400 }}>View All</span>
//             <Image
//               src="/Homepage/right_arrow.svg"
//               alt="View All"
//               width={5}
//               height={5} />

//           </a>
//         )}


//       </div>

//       <div className="relative flex items-center">
//         {/* Navigation Arrows */}
//         <button
//           onClick={handlePrev}
//           // disabled={startIndex === 0}
//           className="absolute z-50 -left-0 -translate-x-1/4 top-1/2 -translate-y-1/2 bg-[#D9D9D9] shadow-md rounded-full w-10 h-10 flex items-center justify-center cursor-pointer"
//         >
//           <Image
//             src="/Homepage/left_arrow.svg"
//             alt="Left arrow"
//             width={7}
//             height={7}
//           />
//         </button>

//         {/* <div className="overflow-hidden"> */}
//         <div
//           className={`w-full grid
//             ${screenSize === 'sm' ? "grid-cols-2 pl-1" : ""}
//             ${screenSize === 'md' ? "grid-cols-4 px-10 ml-2" : ""}
//             ${screenSize === 'lg' ? "grid-cols-6 px-8 ml-2" : ""}
//             ${screenSize === 'xl' ? "grid-cols-6 px-10 ml-2" : ""}
//            `}
//         >
//           {visibleCards.map((card) => (
//             <div
//               key={card?.id}
//               style={{ minWidth: `${cardWidth}px` }}
//             >
//               <a
//                 href={`/store_profile/${card?.id}`}
//                 target="_blank"
//                 rel="noopener noreferrer">

//                 <CardTypeFour
//                   imageUrl={card?.imageUrl}
//                   title={card?.title}
//                   description={card?.description || ''}
//                   screenSize={screenSize}
//                 />
//               </a>

//             </div>
//           ))}
//         </div>
//         {/* </div> */}

//         <button
//           onClick={handleNext}
//           // disabled={startIndex === maxIndex}
//           className="absolute z-10  -right-0 translate-x-1/4 top-1/2 -translate-y-1/2 bg-[#D9D9D9] shadow-md rounded-full w-10 h-10 flex items-center justify-center cursor-pointer"
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

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { manrope } from '@/font';
import CardTypeFour from '../cards/CardTypeFour';
import { api } from '@/lib/axios';
import SectionElevenContainerSkeleton from '../skeleton/SectionElevenContainerSkeleton';

interface CardData {
  id: string;
  imageUrl: string;
  title: string;
  description?: string;
}

const SECTION_NUMBER = 12;

export default function SectionTwelveContainer() {
  const [stores, setStores] = useState<CardData[]>([]);
  const [viewAll, setViewAll] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchStoresBySection = async () => {
      setLoading(true);
      try {
        const res = await api.get(`homepage/stores_by_section_number/${SECTION_NUMBER}`);
        const formattedStores: CardData[] = res.data.map((store: any) => ({
          id: store.store_id,
          imageUrl: store.profile_image,
          title: store.store_name,
          description: store.area?.name.toLowerCase() === "others" ? `${store.city?.name}` : `${store.area?.name}, ${store.city?.name}`,
        }));
        setStores(formattedStores);

        const resSection = await api.get(`/homepage/get_section_by_number/${SECTION_NUMBER}`);
        setViewAll(resSection.data.section_url);
        setName(resSection.data.section_name);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStoresBySection();
  }, []);

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

  if (loading) {
    return <SectionElevenContainerSkeleton />;
  }

  if (!stores || stores.length === 0) {
    return null;
  }

  return (
    <div className='w-full mx-auto space-y-4 lg:space-y-8'>
      <div className='flex items-center px-4 lg:px-2'>
        <span className={`${manrope.className} text-xl md:text-2xl lg:text-3xl`} style={{ fontWeight: 400 }}>{name}</span>
        {viewAll && (
          <a href={viewAll} target="_blank" rel="noopener noreferrer" className='flex ml-auto items-center gap-1 lg:gap-2'>
            <span className={`${manrope.className} text-sm lg:text-base`} style={{ fontWeight: 400 }}>View All</span>
            <Image src="/Homepage/right_arrow.svg" alt="View All" width={5} height={5} />
          </a>
        )}
      </div>

      <div className="relative flex items-center">
        <button
          onClick={handlePrev}
          className="absolute z-10 -left-4 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center cursor-pointer"
        >
          <Image src="/Homepage/left_arrow.svg" alt="Left arrow" width={7} height={7} />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex w-full space-x-4 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-none px-2"
        >
          {stores.map((card) => (
            <div key={card.id} className="flex-shrink-0 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 snap-start">
              <a href={`/store_profile/${card.id}`} target="_blank" rel="noopener noreferrer">
                <CardTypeFour
                  imageUrl={card.imageUrl}
                  title={card.title}
                  description={card.description || ''}
                />
              </a>
            </div>
          ))}
        </div>

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