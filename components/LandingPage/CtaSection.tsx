import React from 'react';
import { manrope } from '@/font';
import { ArrowUpRight } from 'lucide-react';

interface CtaSectionProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonText2?: string;
}

const CtaSection = ({ title, description, buttonText, buttonText2 }: CtaSectionProps) => (
  // <SectionWrapper className="text-center" style={{ background: 'linear-gradient(to top, #f0f4ff, #ffffff)' }}>
  <section className={`${manrope.className} py-24 bg-gradient-to-b from-[#E8F4FF] to-white`} style={{ fontWeight: 400 }}>
    <div className='flex flex-col justify-center items-center'>
      <h2 className="text-4xl md:text-5xl tracking-tighter text-center">{title}</h2>
      <p className="mt-4 text-gray-600 max-w-2xl text-lg text-center">
        {description}
      </p>
      <div className="mt-8">
        <button className='bg-black rounded-sm px-4 py-2'>
          <div className='flex justify-center items-center'>
            <span className='text-white text-lg md:text-xl lg:text-2xl'>{buttonText}</span>
            <ArrowUpRight className="ml-2 h-5 w-5 text-white" />
          </div>

        </button>
      </div>
      {buttonText2 && (
        <div className="mt-8">
          <button className='bg-white border border-black border-2 rounded-sm px-4 py-2'>
            <div className='flex justify-center items-center'>
              <span className='text-black text-lg md:text-xl lg:text-2xl'>{buttonText2}</span>
              <ArrowUpRight className="ml-2 h-5 w-5 text-black" />
            </div>

          </button>
        </div>
      )}


    </div>

  </section>


  // </SectionWrapper>
);
export default CtaSection;