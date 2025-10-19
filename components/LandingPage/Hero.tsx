import React from 'react';
import { manrope, poppins } from '@/font';
import { ArrowUpRight } from 'lucide-react';

interface HeroProps {
  title?: string;
  subtitles?: string[];
  description?: string[];
  buttonText?: string;
}

const Hero = ({ title, subtitles = [], description = [], buttonText }: HeroProps) => {
  const size = 3;
  return (
    <section
      className="text-center py-24 px-4 sm:px-6 lg:px-8 font-rosario bg-gradient-to-b from-[#D7E7FF] to-[#FFFFFF]" // Increased vertical padding
    // style={{
    //   background: 'linear-gradient(to bottom, #D7E7FF 90%, #FFFFFF 10%)', // Adjusted gradient
    // }}
    >
      <div className={`${manrope.className} max-w-4xl mx-auto font-rosario`} style={{ fontWeight: 600 }}>
        {/* Updated heading styling */}
        <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold leading-tight  text-gray-900`}
          style={{ fontWeight: 800 }}>
          {title}
        </h1>

        {/* Updated "Create • Collaborate • Earn" styling */}
        <div className={`${poppins.className} inline-flex items-center gap-3 border-gray-600 rounded-full px-7 py-3 text-lg md:text-2xl lg:text-3xl font-medium text-gray-800 my-8 shadow-sm`}
        style={{fontWeight:400}}>
          <span>{subtitles[0]}</span> • <span>{subtitles[1]}</span> • <span>{subtitles[2]}</span>
        </div>

        {/* Updated paragraph styling */}
        <p className={`mt-3 text-lg md:text-xl lg:text-2xl text-black-700 leading-relaxed`}>
          {description[0]}
          <br />
          {description[1]}
        </p>

        <div className="mt-10 font-rosario"> {/* Adjusted top margin */}
          {/* <Button withArrow>Apply as an Influencer</Button> */}
          <button className='bg-black rounded-sm px-4 py-2'>
            <div className='flex justify-center items-center'>
              <span className='text-white text-lg md:text-xl lg:text-2xl'>{buttonText}</span>
              <ArrowUpRight className="ml-2 h-5 w-5 text-white" />
            </div>

          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;