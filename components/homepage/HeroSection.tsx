'use client';
import Image from "next/image";
import { useEffect, useState } from "react";
const res = [
    {image:"/Homepage/homepage_image.svg"},
    {image:"/Homepage/CardImage.svg"},
    {image:"/Homepage/CardTypeFive.svg"},
    {image:"/Homepage/CardTypeOne.svg"},
];
export default function HeroSection() {
    const [currIndex, setCurrIndex] = useState(0);
    const maxIndex = res.length - 1;

    useEffect(() => {
        const interval = setInterval(() => {
           setCurrIndex((prev) => { return (prev+1)%res.length })
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleNext = () => {
  setCurrIndex((prev) => (prev + 1) % res.length);
};

    const handlePrev = () => {
  setCurrIndex((prev) => (prev - 1 + res.length) % res.length);
};
    return (
        <div className="relative w-full h-118">
            <button
                onClick={handlePrev}
                disabled={currIndex === 0}
                className="absolute z-10 -left-5 top-1/2 -translate-y-1/2 bg-[#D9D9D9] shadow-md rounded-full w-10 h-10 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
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
                className="object-cover"
            />
            

            <button
                onClick={handleNext}
                disabled={currIndex === maxIndex}
                className="absolute z-10 -right-5 top-1/2 -translate-y-1/2 bg-[#D9D9D9] shadow-md rounded-full w-10 h-10 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
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
      className={`w-3 h-3 rounded-full ${
        index === currIndex ? 'bg-black' : 'bg-gray-300'
      } transition-all duration-300`}
    />
  ))}
</div>
            </div>
        </div>
    )
}