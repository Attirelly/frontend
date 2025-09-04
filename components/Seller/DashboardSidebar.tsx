"use client";

import { useState, useRef, useLayoutEffect } from "react";
import { useSellerStore } from "@/store/sellerStore";

// --- Data (Unchanged) ---
const sections = [
  { id: "brand", title: "Business Details", iconUrl: "/OnboardingSections/business_details.png" },
  { id: "price", title: "Price Filters", iconUrl: "/OnboardingSections/price_filters.png" },
  { id: "market", title: "Where to Sell", iconUrl: "/OnboardingSections/where_to_sell.png" },
  { id: "social", title: "Social Links", iconUrl: "/OnboardingSections/social_links.png" },
  { id: "photos", title: "Store Photos", iconUrl: "/OnboardingSections/store_photos.png" },
  { id: "one_product", title: "Add Single", iconUrl: "/OnboardingSections/business_details.png" },
  { id: "bulk_products", title: "Add Bulk", iconUrl: "/OnboardingSections/business_details.png" },
  { id: "all_products", title: "All Products", iconUrl: "/OnboardingSections/business_details.png" },
  { id: "qr_code", title: "QR Code", iconUrl: "/OnboardingSections/business_details.png" },
];

const sectionGroups = [
  { heading: "Store Profile", ids: ["brand", "price", "market", "social", "photos"] },
  { heading: "Add Products", ids: ["one_product", "bulk_products", "all_products"] },
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
    <nav className="w-full bg-white p-2 shadow-md rounded-lg">
      <div
        ref={scrollContainerRef}
        className="flex flex-row items-center space-x-2 overflow-x-auto whitespace-nowrap scrollbar-none"
      >
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSelect(section.id)}
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition min-w-[90px] ${
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
            <span className="text-xs font-medium text-center">{section.title}</span>
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

// --- Main DashboardSidebar Component ---
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