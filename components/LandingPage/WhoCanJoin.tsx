'use client';
import React from 'react';
import { SectionWrapper } from '@/components/LandingPage/reusable_components/SectionWrapper';
import { SectionTitle } from '@/components/LandingPage/reusable_components/SectionTitle';
import { useLandingStore } from '@/store/InfluencerProgramLandingPage';
import { Button } from '@/components/LandingPage/reusable_components/Button';



// --- IMPORTANT ---
// YOU MUST CHANGE THESE IMAGE PATHS
// If your image is in `public/images/nano.jpg`, the path should be `/images/nano.jpg`
const influencerTiers = [
    { 
        name: 'Nano Influencers (0-10K)', 
        points: [
            'Ideal for college students, NIFT/Pearl creators, or early-stage fashion content creators', 
            'Build a portfolio without hassle, we connect you with labels and brands.', 
            'Perfect place to start building your personal brand.'
        ], 
        imageUrl: '/InfluencerProgramLanding/Nano_inf.png' // <-- 1. CHANGE THIS PATH
    },
    { 
        name: 'Micro Influencer (10K-100K)', 
        points: [
            'Expand your reach beyond your followers.', 
            'Access paid campaigns and barter collaborations.', 
            'Monetize your content and grow your influence.'
        ], 
        imageUrl: '/InfluencerProgramLanding/micro_inf.png' // <-- 2. CHANGE THIS PATH
    },
    { 
        name: 'Macro Influencer (100K+)', 
        points: [
            'Unlock high-value brand partnerships.', 
            'Lead major campaigns and festive edits.', 
            'Become a key voice in the Indian fashion landscape.'
        ], 
        imageUrl: '/InfluencerProgramLanding/macro_inf.png' // <-- 3. CHANGE THIS PATH
    },
];

const WhoCanJoin = () => {
    const { activeInfluencerIndex, setActiveInfluencerIndex } = useLandingStore();
    const activeTier = influencerTiers[activeInfluencerIndex];

    return (
        // --- START OF CHANGES ---

        // 1. Section background is white, text is black
        <SectionWrapper id="who-can-join" className="bg-white text-black">
            <SectionTitle 
              title="Who Can Join?" 
              subtitle="We welcome every creative voice shaping Indian fashion — from beginners to seasoned pros." 
              className="mb-16" // Add margin to space out the card
            />
            
            {/* 2. The main card is white, with a big shadow and rounded corners */}
            <div className="bg-black rounded-2xl shadow-2xl p-4 md:p-8 flex flex-col md:flex-row items-center gap-8 md:gap-12 overflow-hidden text-white">
                
                {/* 3. Increased image frame size (h-[500px]) */}
                <div className="w-full md:w-1/2 h-[410px] md:h-[460px]"> 
                    <img 
                      src={activeTier.imageUrl} 
                      alt={activeTier.name} 
                      // 4. Use large rounding on the image itself
                      className="rounded-xl object-cover w-full h-full"
                    />
                </div>

                {/* 5. Text styling for a white background */}
                <div className="w-full md:w-1/2 font-rosario">
                    <h3 className="text-3xl font-semibold mb-8 text-white">{activeTier.name}</h3>
                    
                    {/* 6. Use list-outside and ml-5 to match Figma's bullet points */}
                    <ul className="space-y-4 text-lg text-white-700 list-disc list-outside ml-5">
                        {activeTier.points.map(p => <li key={p}>{p}</li>)}
                    </ul>
                    <div className="mt-10">
                        
                        {/* 7. Button is 'secondary' (white) */}
                        <Button variant="secondary" className="mx-0">Get Started</Button>
                        
                        {/* 8. Dots are dark */}
                        <div className="flex space-x-2">
                            {influencerTiers.map((_, index) => (
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
        </SectionWrapper>
    );
};
export default WhoCanJoin;