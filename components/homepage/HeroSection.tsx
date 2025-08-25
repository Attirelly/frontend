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