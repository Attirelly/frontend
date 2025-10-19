import React from 'react';
import { SectionWrapper } from '@/components/LandingPage/reusable_components/SectionWrapper';
import { SectionTitle } from '@/components/LandingPage/reusable_components/SectionTitle';
import { manrope, poppins } from '@/font';

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
  

  <section className={`${manrope.className} text-black bg-white py-20 px-4 md:px-6 lg:px-8`} style={{fontWeight: 800}}>
      {/* --- FIX 2: Changed to 2-column grid --- */}

    <SectionTitle title="Content We Love"></SectionTitle>  
    <div className="grid grid-cols-1 sm: px-[47px] mt: py-8 md:grid-cols-2 gap-6 max-w-5xl mx-auto ">
      {contentTypes.map((content) => (
        
        // --- FIX 3: Updated card and text styling ---
        <div
          key={content.title}
          className="bg-white py-6 px-7 rounded-2xl shadow-2xl text-center"
        >
          <h3 className="text-xl text-black">
            {content.title}
          </h3>
          <p className={`text-black`} style={{fontWeight: 500}} >
            {content.subtitle}
          </p>
        </div>

      ))}
    </div>

    

    {/* --- FIX 2: Changed to 2-column grid --- */}
    {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto font-rosario">
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
    </div> */}

  </section> 

);

export default ContentWeLove;