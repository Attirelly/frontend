import React from 'react';
import { manrope, poppins } from '@/font';
import { ArrowUpRight } from 'lucide-react';



interface TestimonialsProps {
    title?: string;
    stories?: { quote: string; author: string; details: string }[];
    buttonText?: string;
}
const Testimonials = ({ title, stories = [], buttonText }: TestimonialsProps) => (
    <section className={`${poppins.className} py-20 px-4 md:px-6 lg:px-8 bg-white text-black`} style={{ fontWeight: 600 }}>
        <div className="max-w-7xl mx-auto">
            {/* <SectionTitle title="Real Stories" className="mb-16" /> */}
            <div className={`text-center mb-8`}>
                <h2 className="text-3xl md:text-4xl lg:text-5xl tracking-tighter" style={{ fontWeight: 600 }}>{title}</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-y-12 gap-x-8">
                {stories.map(s => (
                    <div key={s.author} className="text-center">
                        <p className="text-base md:text-lg text-gray-800" style={{ fontWeight: 400 }}>"{s.quote}"</p>
                        <p className="text-sm md:text-black">{s.author} <span className="text-gray-500 font-normal">({s.details})</span></p>
                    </div>
                ))}
            </div>
            
                {buttonText && (
                    <div className={`${manrope.className} flex justify-center mt-12`}>
                    <button className='bg-black rounded-sm px-4 py-2'>
                        <div className='flex justify-center items-center'>
                            <span className='text-white text-sm md:text-base lg:text-lg'>{buttonText}</span>
                            <ArrowUpRight className="ml-2 h-4 w-4 text-white" />
                        </div>

                    </button>
                    </div>
                )}
            

        </div>
    </section>
);
export default Testimonials;