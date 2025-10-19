import React from 'react';
import { rosario, rubik } from '@/font';
import { Button } from '@/components/LandingPage/reusable_components/Button'; // Assuming you have this Button component

const Hero = () => {
  return (
    <section
      className="text-center py-24 px-4 sm:px-6 lg:px-8 font-rosario bg-gradient-to-b from-[#D7E7FF] to-[#FFFFFF]" // Increased vertical padding
      // style={{
      //   background: 'linear-gradient(to bottom, #D7E7FF 90%, #FFFFFF 10%)', // Adjusted gradient
      // }}
    >
      <div className="max-w-4xl mx-auto font-rosario">
        {/* Updated heading styling */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight  text-gray-900">
          Attirelly Influencer Program 
        </h1>

        {/* Updated "Create • Collaborate • Earn" styling */}
        <div className="inline-flex items-center gap-3 border-gray-600 rounded-full px-7 py-3 text-3xl font-medium text-gray-800 my-8 shadow-sm">
          <span>Create</span> • <span>Collaborate</span> • <span>Earn</span>
        </div>
        
        {/* Updated paragraph styling */}
        <p className="mt-3 text-xl text-black-700 font-rosario leading-relaxed">
          Start earning from your creativity today.
          <br />
          Whether you love styling outfits, creating content, or telling fashion stories.
        </p>

        <div className="mt-10 font-rosario"> {/* Adjusted top margin */}
          <Button withArrow>Apply as an Influencer</Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;