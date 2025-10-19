import React from 'react';
import { SectionWrapper } from '@/components/LandingPage/reusable_components/SectionWrapper';

const benefits = [
    { title: 'Effortless Collaborations', description: 'Instantly connect with Attirelly campaigns and explore opportunities tailored to your style and audience.' },
    { title: 'Direct Brand Deals', description: 'Collaborate with top ethnic labels, boutiques, and designers. No chasing – we bring the brands to you.' },
    { title: 'Existing Projects', description: 'Be part of model shoots, festive edits, and exclusive campaigns to enhance your portfolio and exposure.' },
];

const WhyJoin = () => (
  <SectionWrapper id="benefits" className="bg-black text-white">
    <div className="grid md:grid-cols-2 gap-4 items-center">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold font-rosario">
            Why Join Attirelly
          </h2>
        </div>
        <div className="md:text-right">
          <p className="text-lg text-white-400 font-rosario">
            Showcase your unique style to millions of shoppers.
          </p>
        </div>
      </div>
    <div className="mt-16 grid md:grid-cols-3 gap-8">
      {benefits.map((b) => (
        <div key={b.title} className="bg-zinc-900 p-8 rounded-xl">
          <h3 className="text-2xl font-semibold mb-4">{b.title}</h3>
          <p className="text-white-400">{b.description}</p>
        </div>
      ))}
    </div>
    
    <div className="mt-20 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h3 className="text-4xl font-bold font-rosario">Get Recognized</h3>
          <p className="text-lg text-white-400 mt-4 font-rosario">
            Get featured across apps, social media, and model shoots
          </p>
        </div>
        
        {/* Placeholder for your illustration */}
        <div className="flex justify-center md:justify-end items-center h-40">
          {/* REPLACE THIS DIV WITH YOUR SVG OR IMG TAG FOR THE ILLUSTRATION
            e.g., <img src="/images/attirelly-line-art.svg" alt="Attirelly" />
          */}
          <img src="/InfluencerProgramLanding/attirelly_landing.png" alt="Attirelly" />
          {/* <p className="text-5xl font-serif text-gray-700 opacity-50">Attirelly</p> */}
        </div>
      </div>


  </SectionWrapper>
);
export default WhyJoin;