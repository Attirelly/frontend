'use client';
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { manrope } from '@/font';
import CardTypeFour from '../cards/CardTypeFour';
import { api } from '@/lib/axios';
import SectionElevenContainerSkeleton from '../skeleton/SectionElevenContainerSkeleton';

interface CardData {
  id: string;
  imageUrl: string;
  discountText?: string;
  title: string;
  description?: string;
}

const SECTION_NUMBER = 12;
const DESKTOP_VISIBLE_COUNT = 6;
const TAB_VISIBLE_COUNT = 4;
const MOBILE_VISIBLE_COUNT = 2;


/**
 * SectionTwelveContainer component
 * 
 * A responsive and advanced carousel component that displays a slidable list of store cards
 * in a seamless, infinite loop. It fetches its content and title dynamically based on a section number.
 *
 * ## Features
 * - Displays a section title and a "View All" link, both fetched from an API.
 * - Renders a horizontal carousel of store cards using the {@link CardTypeFour} component.
 * - **Infinite Loop**: Implements a seamless, infinite scrolling effect by cloning items at the beginning and end of the list and performing a "magic jump" when reaching the cloned sections.
 * - **Responsive**: The number of visible cards adjusts based on screen width (2 for mobile, 4 for tablet, and 6 for desktop).
 * - **Navigation**: Provides "Previous" and "Next" arrow buttons for manual control.
 * - **Skeleton Loading**: Shows a skeleton placeholder (`SectionElevenContainerSkeleton`) while data is being fetched.
 *
 * ## Logic Flow
 * 1.  On mount, a `loading` state is set to `true`, and the skeleton component is rendered. A resize listener is also set up to adjust the number of visible cards.
 * 2.  Two API calls are made: one to fetch the store data for the section and another for the section's metadata (title and "View All" URL).
 * 3.  The fetched data is stored in state, and `loading` is set to `false`.
 * 4.  The core of the infinite scroll is the `displayStores` array, created with `useMemo`. It takes the original store list and adds clones to the beginning and end: `[endClones, realItems, startClones]`.
 * 5.  The visual sliding is achieved by applying a `transform: translateX()` style to a flex container. The position is calculated by multiplying the `currentIndex` by the width percentage of a single card.
 * 6.  When the user navigates past the *real* items into a cloned area, a `setTimeout` triggers after the slide animation. It then performs a "magic jump" by instantly resetting the `currentIndex` to the corresponding *real* item, with the CSS transition temporarily disabled to hide the jump.
 *
 * ## Imports
 * - **Core/Libraries**: `useEffect`, `useMemo`, `useState` from `react`; `Link`, `Image` from Next.js.
 * - **Key Components**:
 *    - {@link CardTypeFour}: The card component used to render each store in the carousel.
 *    - {@link SectionElevenContainerSkeleton}: The skeleton loader component.
 * - **Utilities**:
 *    - `api` from `@/lib/axios`: The configured Axios instance for API calls.
 *    - `manrope` from `@/font`: Custom font for consistent typography.
 *
 * ## Key Data Structures
 * - **CardData**: An interface defining the shape of each store card's data, including `id`, `imageUrl`, `title`, and `description`.
 * - **displayStores**: A `useMemo`-derived array that includes the original stores plus clones at both ends to enable the infinite loop effect.
 *
 * ## API Calls
 * - `GET /homepage/stores_by_section_number/{id}`: Fetches the list of stores to display in the carousel for a given section number.
 * - `GET /homepage/get_section_by_number/{id}`: Fetches the metadata for the section, such as its title and "View All" link.
 *
 * ## Props
 * - This component does not accept any props.
 *
 * @returns {JSX.Element | null} The rendered carousel component, its skeleton, or null if no stores are found.
 */
export default function SectionTwelveContainer() {
  const [stores, setStores] = useState<CardData[]>([]);
  const [viewAll, setViewAll] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(DESKTOP_VISIBLE_COUNT);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const clonesCount = DESKTOP_VISIBLE_COUNT;

  // setting visible number of cards based on screen width
  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth < 768) setVisibleCount(MOBILE_VISIBLE_COUNT);
      else if (window.innerWidth < 1024) setVisibleCount(TAB_VISIBLE_COUNT);
      else setVisibleCount(DESKTOP_VISIBLE_COUNT);
    };
    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  // fetch store and setion data using section number
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
        setCurrentIndex(clonesCount);
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

  // logic to clone to implement infinite scroll
  const displayStores = useMemo(() => {
    if (stores.length === 0) return [];
    const startClones = stores.slice(0, clonesCount);
    const endClones = stores.slice(stores.length - clonesCount);
    return [...endClones, ...stores, ...startClones];
  }, [stores, clonesCount]);

  useEffect(() => {
    if (!isTransitioning) {
      setTimeout(() => setIsTransitioning(true), 50);
    }
  }, [isTransitioning]);

  // More robust "magic jump" logic
  const handleNext = () => {
    if (!isTransitioning) return;
    const newIndex = currentIndex + 1;
    setCurrentIndex(newIndex);

    if (newIndex > stores.length + clonesCount) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(clonesCount + 1);
      }, 500);
    }
  };

  const handlePrev = () => {
    if (!isTransitioning) return;
    const newIndex = currentIndex - 1;
    setCurrentIndex(newIndex);

    if (newIndex < clonesCount) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(stores.length + clonesCount - 1);
      }, 500);
    }
  };


  if (loading) {
    return <SectionElevenContainerSkeleton />;
  }
  if (!stores || stores.length === 0) {
    return null;
  }

  // Simplified and correct calculation for card width
  const cardWidthPercentage = 100 / visibleCount;

  return (
    <div className='w-full max-w-7xl mx-auto space-y-4 lg:space-y-8 px-2'>
      <div className='flex items-center'>
        <span className={`${manrope.className} text-xl md:text-2xl lg:text-3xl text-[#242424]`} style={{ fontWeight: 400 }}>{name}</span>
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
          className="absolute z-10 left-0 top-1/2 -translate-y-1/2 -translate-x-1/4 bg-[#D9D9D9] shadow-md rounded-full w-10 h-10 flex items-center justify-center cursor-pointer"
        >
          <Image src="/Homepage/left_arrow.svg" alt="Left arrow" width={7} height={7} />
        </button>

        <div className="w-full overflow-hidden">
          <div
            className="flex"
            style={{
              // ✅ FIX #2: Simplified and correct transform calculation
              transform: `translateX(-${currentIndex * cardWidthPercentage}%)`,
              transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none',
            }}
          >
            {/* ✅ FIX #1: Map over the cloned 'displayStores' array */}
            {displayStores.map((card, index) => (
              <div
                key={`${card.id}-${index}`}
                className="flex-shrink-0 px-2"
                style={{ width: `${cardWidthPercentage}%` }}
              >
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
        </div>

        <button
          onClick={handleNext}
          className="absolute z-10 right-0 top-1/2 -translate-y-1/2 translate-x-1/4 bg-[#D9D9D9] shadow-md rounded-full w-10 h-10 flex items-center justify-center cursor-pointer"
        >
          <Image src="/Homepage/right_arrow.svg" alt="Right arrow" width={7} height={7} />
        </button>
      </div>
    </div>
  );
}