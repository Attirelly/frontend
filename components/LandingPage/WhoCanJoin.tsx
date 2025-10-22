'use client';
import React from 'react';
import { SectionTitle } from '@/components/LandingPage/reusable_components/SectionTitle';
import { useLandingStore } from '@/store/InfluencerProgramLandingPage';
import { manrope, poppins } from '@/font';



// --- IMPORTANT ---
// YOU MUST CHANGE THESE IMAGE PATHS
// If your image is in `public/images/nano.jpg`, the path should be `/images/nano.jpg`


interface WhoCanJoinProps {
    title?: string;
    description?: string;
    influencerTiers?: { name: string, points: string[], imageUrl: string }[];


}

const WhoCanJoin = ({ title, description, influencerTiers = [] }: WhoCanJoinProps) => {
    const { activeInfluencerIndex, setActiveInfluencerIndex } = useLandingStore();
    const activeTier = influencerTiers[activeInfluencerIndex];

    return (
        // --- START OF CHANGES ---

        // 1. Section background is white, text is black
        <section className={`${manrope.className} py-20 px-4 md:px-6 lg:px-8 bg-white text-black`} style={{ fontWeight: 500 }}>
            <div className="max-w-7xl mx-auto">

                <SectionTitle
                    title={title || ""}
                    subtitle={description || ""}
                    className="mb-7" // Add margin to space out the card
                />

                {/* 2. The main card is white, with a big shadow and rounded corners */}
                <div className="bg-black rounded-2xl shadow-2xl p-4 md:p-8 lg:px-25 lg:py-15 flex flex-col md:flex-row gap-8 md:gap-12 overflow-hidden text-white">

                    {/* 3. Increased image frame size (h-[500px]) */}
                    <div className="hidden md:block w-full md:w-[410px] h-[410px] md:h-[470px]">
                        <img
                            src={activeTier.imageUrl}
                            alt={activeTier.name}
                            // 4. Use large rounding on the image itself
                            className="rounded-xl object-cover w-full h-full"
                        />
                    </div>

                    {/* 5. Text styling for a white background */}
                    <div className={`flex flex-col ${influencerTiers.length > 1 ? '' : 'justify-center items-center'} w-full md:w-1/2`}>
                        <h3 className="text-2xl font-semibold mb-8 text-white text-center md:text-left" style={{ fontWeight: 800 }}>{activeTier.name}</h3>

                        {/* 6. Use list-outside and ml-5 to match Figma's bullet points */}
                        {influencerTiers.length > 1 ?  (
                            <ul className={`${poppins.className} space-y-4 text-base md:text-lg text-white-700 list-disc list-outside ml-5`}>
                                {activeTier.points.map(p => <li key={p}>{p}</li>)}
                            </ul>
                        ) : (
                            <p className='text-sm text-center md:text-left'>{activeTier.points[0]}</p>
                        )}


                        <div className="flex flex-col items-center md:items-start mt-10">

                            {/* 7. Button is 'secondary' (white) */}
                            <button className={`${poppins.className} w-fit bg-white rounded-sm text-black text-base px-10 py-4`}>
                                Get Started
                            </button>

                            <div className="block md:hidden w-full md:w-[410px] h-[410px] md:h-[470px] mt-4">
                                <img
                                    src={activeTier.imageUrl}
                                    alt={activeTier.name}
                                    // 4. Use large rounding on the image itself
                                    className="rounded-xl object-cover w-full h-full"
                                />
                            </div>

                            {/* 8. Dots are dark */}
                            <div className="flex space-x-2 mt-4">
                                {influencerTiers.length > 1 && influencerTiers.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveInfluencerIndex(index)}
                                        className={`h-3 w-3 rounded-full transition-colors ${activeInfluencerIndex === index ? 'bg-white' : 'bg-gray-300 hover:bg-gray-500'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                {/* --- END OF CHANGES --- */}

            </div>

        </section>
    );
};
export default WhoCanJoin;