import React from 'react';
import { SectionTitle } from '@/components/LandingPage/reusable_components/SectionTitle';
import { manrope } from '@/font';



interface CommunityProps {
  title?: string;
  description?: string;
  communityData?: { role: string; task: string }[];
}

const Community = ({ title, description, communityData=[] }: CommunityProps) => (
  // 1. This is the full-width section with the gradient.
  //    It does NOT use SectionWrapper.
  <section className={`${manrope.className} py-24 bg-gradient-to-b from-[#D7E7FF] to-white`} style={{fontWeight:400}}>
    
    {/* 2. This div constrains the content *inside* the full-width background */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionTitle
        title={title || ""}
        subtitle={description || ""}
        className="mb-12"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 max-w-4xl mx-auto text-lg">
        {communityData.map((item) => (
          <p key={item.role} className="text-gray-800 text-center md:text-left">
            <span className="font-semibold">{item.role}</span> {item.task}
          </p>
        ))}
      </div>
    </div>
  </section>
);

export default Community;