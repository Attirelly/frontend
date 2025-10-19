import React from 'react';
import { manrope } from '@/font';



interface WhyJoinProps {
  title:string;
  description:string;
  benefits: { title: string; description: string }[];
  subtitle:string;
  sub_description:string;
  image_url:string;
}

const WhyJoin = ({title, description, benefits, subtitle, sub_description, image_url}: WhyJoinProps) => (
  // <SectionWrapper id="benefits" className="bg-black text-white">
    <section className='px-4 md:px-6 lg:px-8 pt-20 md:py-20 bg-black text-white rounded-tr-4xl rounded-tl-4xl'>

      <div className={`${manrope.className} max-w-7xl mx-auto`} style={{ fontWeight: 500 }}>
      <div className={`grid md:grid-cols-2 gap-4 items-center`}>
        <div>
          <h2 className="text-4xl md:text-5xl text-center md:text-left" style={{ fontWeight: 800 }}>
            {title}
          </h2>
        </div>
        <div className="text-center md:text-right">
          <p className="text-lg md:text-xl lg:text-2xl text-white-400 font-rosario">
            {description}
          </p>
        </div>
      </div>
      <div className="mt-11 md:mt-16 grid md:grid-cols-3 gap-8 px-4">
        {benefits.map((b) => (
          <div key={b.title} className="bg-zinc-900 rounded-xl px-5 py-9">
            <div>
              <h3 className="text-2xl mb-4" style={{ fontWeight: 700 }}>{b.title}</h3>
              <p className="text-white-400 text-sm">{b.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h3 className="text-4xl md:text-[44px] text-center md:text-left" style={{fontWeight:800}}>{subtitle}</h3>
          <p className="text-lg text-white-400 mt-4 text-center md:text-left">
            {sub_description}
          </p>
        </div>

        {/* Placeholder for your illustration */}
        <div className="flex flex-col md:flex-row justify-center md:justify-end items-end md:items-center md:h-40 ">
          {/* REPLACE THIS DIV WITH YOUR SVG OR IMG TAG FOR THE ILLUSTRATION
            e.g., <img src="/images/attirelly-line-art.svg" alt="Attirelly" />
          */}
          <img src={image_url} alt="Attirelly" />
          {/* <p className="text-5xl font-serif text-gray-700 opacity-50">Attirelly</p> */}
        </div>
      </div>

    </div>

    </section>
    



  // </SectionWrapper>
);
export default WhyJoin;