import React from 'react';
import { SectionTitle } from '@/components/LandingPage/reusable_components/SectionTitle';
import { Button } from '@/components/LandingPage/reusable_components/Button';
import { manrope } from '@/font';



// --- UPDATED SPEECH BUBBLE COMPONENT ---

interface SpeechBubbleProps {
  text: string;
  tailDirection: 'up' | 'down';
  tailPosition: 'left' | 'right';
}

/**
 * A reusable component to create the speech bubble card.
 */
const SpeechBubble = ({ text, tailDirection, tailPosition }: SpeechBubbleProps) => {
  
  const tailBase = 'absolute w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent';
  const tailDirectionClasses = {
    up: 'border-b-[20px] border-b-white -top-4',
    down: 'border-t-[20px] border-t-white -bottom-4',
  };
  const tailPositionClasses = {
    left: 'left-8',
    right: 'right-8',
  };

  return (
    // --- FIX 1: Added max-w-md to control the bubble's width ---
    <div className="relative bg-white p-6 rounded-lg shadow-xl "> 
      <p className="text-lg font-manrope text-gray-800">{text}</p>
      
      <div 
        className={`
          ${tailBase}
          ${tailDirectionClasses[tailDirection]}
          ${tailPositionClasses[tailPosition]}
        `} 
      />
    </div>
  );
};

// --- END OF UPDATED SPEECH BUBBLE COMPONENT ---


const HowItWorks = () => (

//   <SectionWrapper id="how-it-works" className="bg-white">
 <section className={`${manrope.className} py-20 px-8 md:px-6 lg:px-8 bg-gradient-to-b from-[#D7E7FF] to-white`} style={{ fontWeight: 500 }}>
    <div className="max-w-7xl mx-auto">
        <SectionTitle title="How It works?"/>

        {/* --- FIX 2: Grid with flex wrappers for alignment --- */}
        <div className="grid grid-cols-1 mt-[40px] md:grid-cols-1 gap-x-16 gap-y-20 max-w-5xl mx-auto">
          
          {/* Bubble 1: Aligned Left */}
          <div className="flex justify-center md:justify-start w-full md:max-lg-md lg:max-lg-md">
            <SpeechBubble 
              text={`Brides often ask: 'Where should I get my lehenga from?' or 'What kind of outfit suits my vibe?'`} 
              tailDirection="down"
              tailPosition="left" 
            />
          </div>

          {/* Bubble 2: Aligned Right */}
          <div className="flex justify-center md:justify-end w-full md:max-lg-md lg:max-lg-md">
            <SpeechBubble 
              text={`You Suggest - "We know a brand for your bridal outfits — Attirelly"`} 
              tailDirection="down"
              tailPosition="right" 
            />
          </div>

          {/* Bubble 3: Aligned Left */}
          <div className="flex justify-center md:justify-start w-full md:max-lg-md lg:max-lg-md">
            <SpeechBubble 
              text={`You connect couples to Attirelly, and they discover brands and designers`} 
              tailDirection="down"
              tailPosition="left" 
            />
          </div>

          {/* Bubble 4: Aligned Right */}
          <div className="flex justify-center md:justify-end w-full md:max-lg-md lg:max-lg-md">
            <SpeechBubble 
              text={`Every time a client shops an outfit or books through your referral, you get paid.`} 
              tailDirection="down"
              tailPosition="right" 
            />
          </div>
          
        </div>

        {/* Button at the bottom */}
        <div className="mt-20 flex justify-center">
          <Button withArrow>Start Earning Today</Button>
        </div>

    </div>
 </section>  
  
);


export default HowItWorks;