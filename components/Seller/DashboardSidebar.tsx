"use client";

import { useState, useRef, useLayoutEffect } from "react";
import { useSellerStore } from "@/store/sellerStore";

// --- Data (Unchanged) ---
const sections = [
  {
    id: "brand",
    title: "Business Details",
    iconUrl: "/OnboardingSections/business_details.png",
  },
  {
    id: "price",
    title: "Price Filters",
    iconUrl: "/OnboardingSections/price_filters.png",
  },
  {
    id: "market",
    title: "Where to Sell",
    iconUrl: "/OnboardingSections/where_to_sell.png",
  },
  {
    id: "social",
    title: "Social Links",
    iconUrl: "/OnboardingSections/social_links.png",
  },
  {
    id: "photos",
    title: "Store Photos",
    iconUrl: "/OnboardingSections/store_photos.png",
  },
  {
    id: "one_product",
    title: "Add Single",
    iconUrl: "/OnboardingSections/business_details.png",
  },
  {
    id: "bulk_products",
    title: "Add Bulk",
    iconUrl: "/OnboardingSections/business_details.png",
  },
  {
    id: "all_products",
    title: "All Products",
    iconUrl: "/OnboardingSections/business_details.png",
  },
  {
    id: "qr_code",
    title: "QR Code",
    iconUrl: "/OnboardingSections/business_details.png",
  },
  {
    id: "size_charts",
    title: "Size Charts",
    iconUrl: "/OnboardingSections/business_details.png",
  }
];

const sectionGroups = [
  {
    heading: "Store Profile",
    ids: ["brand", "price", "market", "social", "photos"],
  },
  {
    heading: "Add Products",
    ids: ["one_product", "bulk_products", "all_products"],
  },
  {
    heading: "Size Charts",
    ids: ["size_charts"],
  },
  { heading: "QR Code", ids: ["qr_code"] },
];

// --- Extracted MobileSidebar Component ---
const MobileSidebar = ({ selected, onSelect }) => {
  const scrollContainerRef = useRef(null);
  const scrollPositionRef = useRef(0); // Ref to store the scrollLeft value

  // This effect preserves the scroll position across re-renders
  useLayoutEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    // Restore scroll position after a re-render
    scrollContainer.scrollLeft = scrollPositionRef.current;

    const handleScroll = () => {
      scrollPositionRef.current = scrollContainer.scrollLeft;
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []); // Empty dependency array means this runs only once on mount

  return (
    <nav className="w-full p-2 rounded-lg text-black bg-white">
      <div
        ref={scrollContainerRef}
        className="flex flex-row items-stretch space-x-2 overflow-x-auto whitespace-nowrap scrollbar-none"
      >
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSelect(section.id)}
            className={`flex flex-col items-center justify-center p-1 rounded-lg transition min-w-[90px] ${
              selected === section.id
                ? "bg-gray-200"
                : "bg-transparent hover:bg-gray-100"
            }`}
          >
            <img
              src={section.iconUrl}
              alt={section.title}
              className="w-7 h-7 mb-1 rounded-full object-cover"
            />
            <div className="text-xs font-[400] text-center whitespace-normal">
              {section.title}
            </div>
          </button>
        ))}
      </div>
    </nav>
  );
};

// --- Extracted DesktopSidebar Component ---
const DesktopSidebar = ({ selected, onSelect, openGroups, toggleGroup }) => {
  return (
    <div className="bg-gray-100 rounded-2xl md:w-80 lg:w-96 flex-shrink-0 self-start space-y-6 text-black">
      {sectionGroups.map((group) => (
        <div className="bg-white p-4 rounded-2xl" key={group.heading}>
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => toggleGroup(group.heading)}
          >
            <h3 className="text-md font-semibold">{group.heading}</h3>
            <span className="text-sm text-gray-500">
              {openGroups[group.heading] ? "▲" : "▼"}
            </span>
          </div>
          {openGroups[group.heading] && (
            <div className="mt-3 space-y-3">
              {group.ids.map((id) => {
                const section = sections.find((s) => s.id === id);
                if (!section) return null;
                return (
                  <div
                    key={section.id}
                    onClick={() => onSelect(section.id)}
                    className={`flex items-start gap-4 p-2 cursor-pointer rounded-2xl border transition ${
                      selected === section.id
                        ? "border-black bg-gray-100"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <img
                      src={section.iconUrl}
                      alt={section.title}
                      className="w-7 h-7 rounded-full object-cover bg-white"
                    />
                    <div className="flex flex-col">
                      <p className="font-medium text-md">{section.title}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

/**
 * DashboardSidebar component
 * 
 * The primary navigation component for the Seller Dashboard. It provides a responsive UI
 * that adapts from a horizontal scrolling bar on mobile to a collapsible, grouped sidebar on desktop.
 *
 * ## Features
 * - **Responsive Design**: Renders two distinct layouts for mobile vs. desktop screens using CSS.
 * - **Mobile View**: A compact, horizontally scrollable bar of icons and titles that is touch-friendly.
 * - **Desktop View**: A taller, vertical sidebar with collapsible sections (e.g., "Store Profile", "Add Products") for better organization.
 * - **Stateful Navigation**: Highlights the currently `selected` section passed in via props.
 * - **Interactive**: Clicking on a section triggers the `onSelect` callback to notify the parent component of a navigation change.
 * - **Scroll Preservation**: The mobile sidebar remembers its horizontal scroll position across re-renders for a seamless user experience.
 *
 * ## Logic Flow
 * 1.  The main `DashboardSidebar` component acts as a responsive switcher, rendering either a `MobileSidebar` or a `DesktopSidebar` based on screen size.
 * 2.  It manages the state for the collapsible desktop groups (`openGroups`) and provides a function (`toggleGroup`) to handle their open/closed state.
 * 3.  **DesktopSidebar Logic**:
 *        - It maps over the `sectionGroups` constant to create the collapsible sections.
 *        - The visibility of each section's content is controlled by the `openGroups` state passed down from the parent.
 *        - It then maps over the `ids` within each group to render the individual navigation items.
 * 4.  **MobileSidebar Logic**:
 *        - It renders a horizontally scrollable `div` containing all navigation items from the `sections` array.
 *        - A `useLayoutEffect` hook is used to remember and restore the `scrollLeft` position, preventing the scrollbar from resetting on parent component updates.
 * 5.  In both views, the `selected` prop is used to apply active styles, and the `onSelect` callback is fired on click.
 *
 * ## Imports
 * - **Core/Libraries**: `useRef`, `useState`, `useEffect`, `useLayoutEffect` from `react`.
 * - **State (Zustand Stores)**:
 *    - `useSellerStore`: (Imported but not directly used in this snippet) To access global seller state.
 *
 * ## Key Data Structures
 * - **sections**: A local constant array of objects, where each object defines a navigation item with an `id`, `title`, and `iconUrl`.
 * - **sectionGroups**: A local constant array of objects that defines the structure for the desktop sidebar, grouping `section` IDs under a `heading`.
 *
 * ## API Calls
 * - This component does not make any API calls.
 *
 * ## Props
 * @param {object} props - The props for the component.
 * @param {string} props.selected - The ID of the currently active section, used for highlighting.
 * @param {(id: string) => void} props.onSelect - A callback function that is called with the section ID when a user clicks a navigation item.
 *
 * @returns {JSX.Element} The rendered responsive sidebar.
 */
export default function DashboardSidebar({ selected, onSelect }) {
  const {
    // ... your useSellerStore hooks remain unchanged
  } = useSellerStore();

  const [openGroups, setOpenGroups] = useState(
    Object.fromEntries(sectionGroups.map((g) => [g.heading, true]))
  );

  const toggleGroup = (heading) => {
    setOpenGroups((prev) => ({ ...prev, [heading]: !prev[heading] }));
  };

  return (
    <>
      <div className="block md:hidden w-full">
        <MobileSidebar selected={selected} onSelect={onSelect} />
      </div>
      <div className="hidden md:block">
        <DesktopSidebar
          selected={selected}
          onSelect={onSelect}
          openGroups={openGroups}
          toggleGroup={toggleGroup}
        />
      </div>
    </>
  );
}
