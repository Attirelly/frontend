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
  title: string;
  description?: string;
}

const SECTION_NUMBER = 10;

/**
 * SectionTenContainer component
 * 
 * A component that fetches and displays a responsive grid of store cards.
 * It includes a dynamic title, a "View All" link, and a skeleton loading state.
 *
 * ## Features
 * - Displays a section title and a "View All" link, both fetched from an API.
 * - Renders a simple, responsive grid of store cards using the {@link CardTwoType} component.
 * - The grid layout adapts to different screen sizes (2 columns on mobile, 4 on desktop).
 * - **Skeleton Loading**: Shows a skeleton placeholder (`SectionEightContainerSkeleton`) while the initial data is being fetched.
 * - Each store card is a clickable link that opens the corresponding store's profile page in a new tab.
 *
 * ## Logic Flow
 * 1.  On component mount, a `loading` state is set to `true`, and the skeleton component is rendered.
 * 2.  A `useEffect` hook triggers two API calls: one to fetch the store data for the section and another for the section's metadata (title and "View All" URL).
 * 3.  The fetched store data is formatted into a clean `CardData` structure.
 * 4.  Once the data is retrieved and processed, it is stored in state, and `loading` is set to `false`.
 * 5.  The component re-renders, displaying the grid of store cards. If no stores are returned, the component renders `null`.
 *
 * ## Imports
 * - **Core/Libraries**: `useEffect`, `useState` from `react`; `Image` from `next/image`.
 * - **Key Components**:
 *    - {@link CardTwoType}: The card component used to render each store in the grid.
 *    - {@link SectionEightContainerSkeleton}: The skeleton loader component.
 * - **Utilities**:
 *    - `api` from `@/lib/axios`: The configured Axios instance for API calls.
 *    - `manrope` from `@/font`: Custom font for consistent typography.
 *
 * ## Key Data Structures
 * - **CardData**: An interface defining the shape of each store card's data, including `id`, `imageUrl`, `title`, and `description`.
 *
 * ## API Calls
 * - `GET /homepage/stores_by_section_number/{id}`: Fetches the list of stores to display in the grid for a given section number.
 * - `GET /homepage/get_section_by_number/{id}`: Fetches the metadata for the section, such as its title and "View All" link.
 *
 * ## Props
 * - This component does not accept any props.
 *
 * @returns {JSX.Element | null} The rendered grid of stores, its skeleton, or null if no stores are found.
 */
export default function SectionTenContainer() {
  const [stores, setStores] = useState<CardData[]>([]);
  const [viewAll, setViewAll] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

   /**
   * fetch stores data and section data using section number
   */
  useEffect(() => {
    const fetchStoresBySection = async () => {
      setLoading(true);
      try {
        const res = await api.get(`homepage/stores_by_section_number/${SECTION_NUMBER}`);
        const storeData = res.data;

        const formattedStores: CardData[] = storeData.map((store: any) => ({
          id: store.store_id,
          imageUrl: store.profile_image || "/Homepage/CardImage.svg",
          title: store.store_name,
          description: store.area?.name.toLowerCase() === "others" ? `${store.city?.name}` : `${store.area?.name}, ${store.city?.name}`,
        }));
        setStores(formattedStores);

        const resSection = await api.get(`/homepage/get_section_by_number/${SECTION_NUMBER}`);
        const sectionData = resSection.data;
        setViewAll(sectionData.section_url);
        setName(sectionData.section_name);
      } catch (error) {
        console.error("Failed to fetch store data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStoresBySection();
  }, []);
  
  // show shimmer skeleton while data is being fetched
  if (loading) {
    return <SectionEightContainerSkeleton />;
  }

  // return empty div if no data is present in this section
  if (!stores || stores.length === 0) {
    return null; // Return null to render nothing
  }

  return (
    <div className="w-full mx-auto space-y-4 lg:space-y-8">
      <div className="flex items-center px-4 lg:px-0">
        <span
          className={`${manrope.className} text-xl md:text-2xl lg:text-3xl text-[#242424]`}
          style={{ fontWeight: 400 }}
        >
          {name}
        </span>
        {viewAll && (
          <a
            href={viewAll}
            target="_blank"
            rel="noopener noreferrer"
            className="flex ml-auto items-center gap-1 lg:gap-2"
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
        )}
      </div>

      {/* CHANGED: The grid now uses responsive prefixes directly */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 lg:gap-12">
        {stores.map((card) => (
          <a
            key={card.id}
            href={`/store_profile/${card.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {/* REMOVED: The screenSize prop is no longer passed to the child */}
            <CardTwoType
              imageUrl={card.imageUrl}
              title={card.title}
              description={card.description || ""}
            />
          </a>
        ))}
      </div>
    </div>
  );
}