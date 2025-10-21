import React from 'react';
import { SectionTitle } from '@/components/LandingPage/reusable_components/SectionTitle';
// import { Button } from '@/components/ui/Button';
import { manrope } from '@/font';

// Data for the steps, making the component easy to update
const steps = [
  {
    number: 1,
    title: 'Refer a Bride/Groom to Attirelly',
    description: 'And get a flat ₹1000 for every successful referral.',
  },
  {
    number: 2,
    title: 'Get a % on every purchase',
    description: 'Earn a percentage commission on every purchase your referred client makes.',
  },
  {
    number: 3,
    title: 'Collaborate with Brands & Designers',
    description: 'Get opportunities for styled shoots, campaigns, and events.',
  },
];

const HowItWorks = () => (

//   <SectionWrapper id="how-it-works" className="bg-white">
 <section className={`${manrope.className} py-20 px-8 md:px-6 lg:px-8 bg-gradient-to-b from-[#D7E7FF] to-white`} style={{ fontWeight: 500 }}>
    <div className="max-w-7xl mx-auto">
        <SectionTitle title="How It works?"/>
        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center"> */}
            
            {/* Left Column: Text Content */}
            {/* <div className="font-rosario"> */}
             {/* <div className={`text-center mb-8`}>
                <h2 className={"text-5xl text-black"} style={{ fontWeight: 800 }}>
                How it works?
                </h2>
              </div>    */}
                
                {/* <div className="mt-12 space-y-8">
                {steps.map((step) => (
                    <div key={step.number} className="flex items-start gap-4">
                    <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full font-bold text-xl text-gray-700">
                        {step.number}
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-black">{step.title}</h3>
                        <p className="text-gray-600 mt-1">{step.description}</p>
                    </div>
                    </div>
                ))}
                </div> */}

                {/* <div className="mt-12"> */}
                {/* <Button withArrow className="mx-0">
                    Start Earning Today
                </Button> */}
                {/* </div> */}
            {/* </div> */}

            {/* Right Column: Illustration */}
            {/* <div className="hidden lg:flex items-center justify-center p-8">
                <img
                src="/images/partner-how-it-works.png" // IMPORTANT: Replace this with the actual path to your illustration in the `public` folder
                alt="How Attirelly referrals work"
                className="rounded-xl object-contain"
                /> */}
                
            {/* </div> */}
            {/* </div> */}
    </div>
 </section>  
  
);


export default HowItWorks;