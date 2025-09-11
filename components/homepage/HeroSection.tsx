'use client';
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSwipeable } from 'react-swipeable';
const res = [
    { image: "/Homepage/homepage_image.svg", url: "https://attirelly.com/product_directory?store_type=Designer+Label" },
    // {image:"/Homepage/CardImage.svg", url:"https://maps.app.goo.gl/yWzNswF8oSVXbLCSA"},
    // {image:"/Homepage/CardTypeFive.svg", url:"https://maps.app.goo.gl/mF7SE4ScTkoc7eYEA"},
    // {image:"/Homepage/CardTypeOne.svg", url:"https://maps.app.goo.gl/toHDxmqNqLffRFRH8"},
];


/**
 * HeroSection component
 * 
 * A responsive and interactive image carousel (slider) component,
 * typically used as the main hero section on a homepage.
 *
 * ## Features
 * - Displays a full-width, clickable image that serves as a link.
 * - **Automatic Sliding**: Cycles through a list of images automatically every 5 seconds.
 * - **Manual Navigation**: Includes "Previous" and "Next" arrow buttons for desktop users.
 * - **Swipe Gestures**: Supports touch-based left and right swipes for navigation on mobile devices.
 * - **Slide Indicators**: Shows a series of dots ("bubbles") at the bottom to indicate the current slide and total number of slides.
 * - The carousel loops infinitely in both directions.
 *
 * ## Logic Flow
 * 1.  The component uses a local constant array `res` as its data source, where each item has an image and a URL.
 * 2.  A `useState` hook (`currIndex`) tracks the index of the currently visible slide.
 * 3.  A `useEffect` hook sets up an interval that automatically increments `currIndex` every 5 seconds, creating the auto-play functionality. The modulo (`%`) operator is used to ensure the slideshow loops.
 * 4.  `handleNext` and `handlePrev` functions allow for manual updates to `currIndex` via button clicks.
 * 5.  The `useSwipeable` hook from the `react-swipeable` library is configured to call these handler functions on user swipes.
 * 6.  The main `Image` component's `src` and the `onClick` URL are determined by the current slide at `res[currIndex]`.
 *
 * ## Key Data Structures
 * - **res**: A local constant array of objects. Each object must contain an `image` property (a string path to the image) and a `url` property (the destination link).
 *
 * ## Imports
 * - **Core/Libraries**: `useEffect`, `useState` from `react`; `Image` from `next/image`; `useSwipeable` from `react-swipeable` for touch gestures.
 *
 * ## API Calls
 * - This component does not make any API calls; it uses a hardcoded array (`res`) for its content.
 *
 * ## Props
 * - This component does not accept any props.
 *
 * @returns {JSX.Element} The rendered image carousel component.
 */
export default function HeroSection() {
    const [currIndex, setCurrIndex] = useState(0);
    const maxIndex = res.length - 1;

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrIndex((prev) => { return (prev + 1) % res.length })
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleClick = async (url: string) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const handleNext = () => {
        setCurrIndex((prev) => (prev + 1) % res.length);
    };

    const handlePrev = () => {
        setCurrIndex((prev) => (prev - 1 + res.length) % res.length);
    };

    const handlers = useSwipeable({
        onSwipedLeft: () => handleNext(),
        onSwipedRight: () => handlePrev(),
        preventScrollOnSwipe: true, // Prevents vertical scrolling when swiping horizontally
        trackMouse: false, // Don't track mouse movements as swipes
    });

    return (
        <div className="relative w-full h-[229px] lg:h-118" {...handlers}>
            <button
                onClick={handlePrev}
                // disabled={currIndex === 0}
                className="absolute z-10 -left-5 top-1/2 -translate-y-1/2 bg-[#D9D9D9] 
                shadow-md rounded-full w-10 h-10 flex items-center justify-center 
                cursor-pointer lg:flex hidden"
            >
                <Image
                    src="/Homepage/left_arrow.svg"
                    alt="Left arrow"
                    width={7}
                    height={7}
                />
            </button>

            <Image
                src={res[currIndex].image}
                alt="Homepage Image"
                fill
                className="object-cover cursor-pointer lg:rounded-bl-4xl lg:rounded-br-4xl"
                onClick={() => handleClick(res[currIndex].url)}
            />


            <button
                onClick={handleNext}
                // disabled={currIndex === maxIndex}
                className="absolute z-10 -right-5 top-1/2 -translate-y-1/2 bg-[#D9D9D9]
                 shadow-md rounded-full w-10 h-10 flex items-center justify-center 
                 cursor-pointer lg:flex hidden"
            >
                <Image
                    src="/Homepage/right_arrow.svg"
                    alt="Left arrow"
                    width={7}
                    height={7}
                />
            </button>

            <div>
                {/* create bubbles here with horizontally centred and bottom-15  */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {res.map((_, index) => (
                        <div
                            key={index}
                            className={`w-3 h-3 rounded-full ${index === currIndex ? 'bg-black' : 'bg-gray-300'
                                } transition-all duration-300`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}