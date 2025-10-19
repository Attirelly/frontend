import React from 'react';
import { SectionWrapper } from '@/components/LandingPage/reusable_components/SectionWrapper';
import { SectionTitle } from '@/components/LandingPage/reusable_components/SectionTitle';
import { rosario } from '@/font';

// --- FIX 1: Updated data structure to include subtitles ---
const contentTypes = [
  {
    title: 'Try-ons & Outfit Styling',
    subtitle: 'Show your unique ethnic looks',
  },
  {
    title: 'Saree Draping & Mix-n-Match Guides',
    subtitle: 'Educate & inspire your audience',
  },
  {
    title: 'Honest Label Reviews',
    subtitle: 'Share real opinions & styling tips',
  },
  {
    title: 'Festive',
    subtitle: "'Get Ready With Me' & budget looks",
  },
  {
    title: 'Market Hauls & Boutique Walkthroughs',
    subtitle: 'Explore local fashion gems',
  },
  {
    title: 'Wedding',
    subtitle: 'Wedding trends & styling stories',
  },
];

const ContentWeLove = () => (
  <SectionWrapper>
    <SectionTitle title="Content We Love" className="mb-12" />

    {/* --- FIX 2: Changed to 2-column grid --- */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto font-rosario">
      {contentTypes.map((content) => (
        
        // --- FIX 3: Updated card and text styling ---
        <div
          key={content.title}
          className="bg-white p-8 rounded-xl shadow-lg text-center font-rosario"
        >
          <h3 className="text-xl font-semibold text-black">
            {content.title}
          </h3>
          <p className="text-black-500 text-xl">
            {content.subtitle}
          </p>
        </div>

      ))}
    </div>
  </SectionWrapper>
);

export default ContentWeLove;