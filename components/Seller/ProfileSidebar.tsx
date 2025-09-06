"use client";

import { useSellerStore } from '@/store/sellerStore';
import { useRef, useLayoutEffect } from 'react'; // Import useRef and useLayoutEffect

const sections = [
    {
        id: 'brand',
        title: 'Business details',
        desc: 'Enter your store address and owner name.',
        iconUrl: '/OnboardingSections/business_details.png',
    },
    {
        id: 'price',
        title: 'Price filters',
        desc: 'Define product tiers...',
        iconUrl: '/OnboardingSections/price_filters.png',
    },
    {
        id: 'market',
        title: 'Where to Sell',
        desc: 'Choose the place',
        iconUrl: '/OnboardingSections/where_to_sell.png',
    },
    {
        id: 'social',
        title: 'Social links',
        desc: 'Connect your Instagram and WhatsApp accounts.',
        iconUrl: '/OnboardingSections/social_links.png',
    },
    {
        id: 'photos',
        title: 'Photos',
        desc: 'Upload a banner and profile photo.',
        iconUrl: '/OnboardingSections/store_photos.png',
    },
];

// --- Sub-component for Mobile View with useLayoutEffect ---
const MobileView = ({ selected, onSelect, furthestStep }) => {
    // ✅ ADD: Refs for the scroll container and to store the position
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const scrollPositionRef = useRef(0);

    // ✅ ADD: useLayoutEffect to preserve scroll position
    useLayoutEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;

        // Restore scroll position after a re-render
        scrollContainer.scrollLeft = scrollPositionRef.current;

        const handleScroll = () => {
            if (scrollContainer) {
                scrollPositionRef.current = scrollContainer.scrollLeft;
            }
        };

        scrollContainer.addEventListener("scroll", handleScroll);
        return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }, []); // Empty dependency array ensures this runs only once

    return (
        <nav className="w-full p-2 rounded-lg text-black bg-white">
            <div
                // ✅ ADD: Attach the ref to the scrollable div
                ref={scrollContainerRef}
                className="flex flex-row items-stretch space-x-2 overflow-x-auto whitespace-nowrap scrollbar-none"
            >
                {sections.map((section, index) => {
                    const isDisabled = index > furthestStep;
                    const isSelected = selected === section.id;
                    return (
                        <button
                            key={section.id}
                            onClick={() => !isDisabled && onSelect(section.id)}
                            className={`flex flex-col items-center justify-center p-2 rounded-lg transition min-w-[90px] ${
                                isSelected ? "bg-gray-200" : "bg-transparent"
                            } ${
                                isDisabled
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-gray-100 cursor-pointer"
                            }`}
                        >
                            <img
                                src={section.iconUrl}
                                alt={section.title}
                                className="w-7 h-7 mb-1 rounded-full object-cover"
                            />
                            <span className="text-xs font-[400]text-center whitespace-normal">
                                {section.title}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

// --- Sub-component for Desktop View (Unchanged) ---
const DesktopView = ({ selected, onSelect, furthestStep }) => {
    return (
        <div className="bg-white p-4 rounded-2xl w-full max-w-sm self-start text-black">
            <h2 className="text-lg font-semibold mb-4">Complete your profile</h2>
            {sections.map((section, index) => {
                const isDisabled = index > furthestStep;
                const isSelected = selected === section.id;
                return (
                    <div
                        key={section.id}
                        onClick={() => !isDisabled && onSelect(section.id)}
                        className={`flex items-start gap-4 p-4 mb-2 rounded-2xl border transition ${
                            isSelected ? 'border-black bg-gray-100' : 'border-gray-300'
                        } ${
                            isDisabled
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:bg-gray-50 cursor-pointer'
                        }`}
                    >
                        <img
                            src={section.iconUrl}
                            alt={section.title}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex flex-col">
                            <h3 className="font-medium text-md">{section.title}</h3>
                            <p className="text-sm text-gray-500">{section.desc}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};


// --- Main ProfileSidebar Component (Unchanged) ---
export default function ProfileSidebar({
    selected,
    onSelect,
}: {
    selected: string;
    onSelect: (id: string) => void;
}) {
    const { furthestStep } = useSellerStore();

    return (
        <>
            <div className="block md:hidden w-full">
                <MobileView
                    selected={selected}
                    onSelect={onSelect}
                    furthestStep={furthestStep}
                />
            </div>
            <div className="hidden md:block">
                <DesktopView
                    selected={selected}
                    onSelect={onSelect}
                    furthestStep={furthestStep}
                />
            </div>
        </>
    );
}