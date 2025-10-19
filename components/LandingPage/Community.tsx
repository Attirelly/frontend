import React from 'react';
import { SectionTitle } from '@/components/LandingPage/reusable_components/SectionTitle';

const communityData = [
  { role: 'Stylists', task: '– Curate and showcase looks for campaigns.' },
  { role: 'MUAs', task: '– Collaborate in bridal & festive projects.' },
  { role: 'Photographers', task: '– Capture brand & creator shoots.' },
  { role: 'Wedding Planners', task: '– Join fashion-inspired shoots & collaborations' },
];

const Community = () => (
  // 1. This is the full-width section with the gradient.
  //    It does NOT use SectionWrapper.
  <section className="py-24 font-rosario bg-gradient-to-b from-[#E8F4FF] to-white">
    
    {/* 2. This div constrains the content *inside* the full-width background */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionTitle
        title="A Community That Grows Together"
        subtitle="Fashion thrives on collaboration. Work with stylists, MUAs, photographers, wedding planners to create real projects, not just posts."
        className="mb-12"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 max-w-4xl mx-auto text-lg">
        {communityData.map((item) => (
          <p key={item.role} className="text-gray-800">
            <span className="font-semibold">{item.role}</span> {item.task}
          </p>
        ))}
      </div>
    </div>
  </section>
);

export default Community;