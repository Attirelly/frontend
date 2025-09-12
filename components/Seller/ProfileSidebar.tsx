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


/**
 * ProfileSidebar component
 * 
 * The primary navigation sidebar for the multi-step Seller Onboarding process.
 * It visually represents the steps, tracks user progress, and allows navigation between unlocked sections.
 * It provides a responsive layout, showing a horizontal scrollbar on mobile and a vertical list on desktop.
 *
 * ## Features
 * - **Responsive Design**: Renders two distinct layouts for mobile vs. desktop screens using CSS.
 * - **Mobile View**: A compact, horizontally scrollable bar of icons and titles.
 * - **Desktop View**: A taller, vertical list of sections with icons, titles, and descriptions.
 * - **Progress Tracking**: Uses a `furthestStep` value from the global store to disable navigation to sections the user has not yet reached, enforcing a linear onboarding flow.
 * - **Stateful Navigation**: Highlights the currently `selected` section, which is controlled by the parent component.
 * - **Interactive**: Clicking on an unlocked section triggers the `onSelect` callback to notify the parent of a navigation change.
 * - **Scroll Preservation**: The mobile view uses `useLayoutEffect` to remember and restore its horizontal scroll position, preventing the scrollbar from resetting on re-renders.
 *
 * ## Logic Flow
 * 1.  The main `ProfileSidebar` component fetches the `furthestStep` from the `useSellerStore`.
 * 2.  It acts as a responsive switcher, rendering either the internal `MobileView` or `DesktopView` component based on screen size.
 * 3.  It passes the `selected`, `onSelect`, and `furthestStep` props down to the appropriate view.
 * 4.  Both `MobileView` and `DesktopView` map over the `sections` array to render the list of navigation items.
 * 5.  For each item, they check if its index is greater than `furthestStep`. If so, the item is visually disabled and the `onClick` handler is prevented.
 * 6.  The `MobileView` component contains a `useLayoutEffect` hook that saves the `scrollLeft` position of its container to a `useRef` on every scroll event. When the component re-renders, it uses the stored ref value to restore the scroll position.
 *
 * ## Imports
 * - **Core/Libraries**: `useRef`, `useState`, `useEffect`, `useLayoutEffect` from `react`.
 * - **State (Zustand Stores)**:
 * - `useSellerStore`: For retrieving the user's onboarding progress (`furthestStep`).
 *
 * ## Key Data Structures
 * - **sections**: A local constant array of objects, where each object defines a step in the onboarding process with an `id`, `title`, `description`, and `iconUrl`.
 *
 * ## API Calls
 * - This component does not make any API calls.
 *
 * ## Props
 * @param {object} props - The props for the component.
 * @param {string} props.selected - The ID of the currently active section, used for highlighting.
 * @param {(id: string) => void} props.onSelect - A callback function that is called with the section ID when a user clicks a navigation item.
 *
 * @returns {JSX.Element} The rendered responsive sidebar for the onboarding process.
 */
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