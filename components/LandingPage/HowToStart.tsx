import React from 'react';
import { SectionWrapper } from '@/components/LandingPage/reusable_components/SectionWrapper';
import { SectionTitle } from '@/components/LandingPage/reusable_components/SectionTitle';
import { manrope, poppins } from '@/font';

// // Data for the community section
// const communityData = [
//   { role: 'Stylists', task: '– Curate and showcase looks for campaigns.' },
//   { role: 'MUAs', task: '– Collaborate in bridal & festive projects.' },
//   { role: 'Photographers', task: '– Capture brand & creator shoots.' },
//   { role: 'Wedding Planners', task: '– Join fashion-inspired shoots & collaborations' },
// ];

// // Data for the 4-step process
// const steps = [
//   {
//     number: 1,
//     title: 'Sign In',
//     description: 'Create your Attirelly account',
//   },
//   {
//     number: 2,
//     title: 'Complete Dashboard',
//     description: 'Add info, select content genres, and integrate Instagram',
//   },
//   {
//     number: 3,
//     title: 'Get Matched',
//     description: 'We review your insights & connect you with relevant brands',
//   },
//   {
//     number: 4,
//     title: 'Collaborate and Earn',
//     description: 'Join shoots, festive edits, lookbooks, and projects',
//   },
// ];

// // A simple SVG component for the arrow
// const ArrowIcon = () => (
//   <svg
//     className="w-20 h-16 text-gray-300 hidden md:block"
//     fill="none"
//     stroke="currentColor"
//     viewBox="0 0 24 24"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={1.5}
//       d="M17 8l4 4m0 0l-4 4m4-4H3"
//     />
//   </svg>
// );

// const HowToStart = () => (
//   <SectionWrapper id="how-to-start" className="bg-gray-50">
//     {/* --- Part 1: A Community That Grows Together --- */}
//     <div className="mb-24 font-rosario">
//       <SectionTitle
//         title="A Community That Grows Together"
//         subtitle="Fashion thrives on collaboration. Work with stylists, MUAs, photographers, wedding planners to create real projects, not just posts."
//         className="mb-12"
//       />
//       <div className="grid grid-cols-2 gap-x-8 gap-y-4 max-w-4xl mx-auto text-lg">
//         {communityData.map((item) => (
//           <p key={item.role} className="text-gray-800">
//             <span className="font-semibold">{item.role}</span> {item.task}
//           </p>
//         ))}
//       </div>
//     </div>

//     {/* --- Part 2: How To Get Started --- */}
//     <div className="font-rosario">
//       <SectionTitle
//         title="How To Get Started"
//         subtitle="Start with simple 4 steps"
//         className="mb-16"
//       />
//       <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
//         {steps.map((step, index) => (
//           <React.Fragment key={step.number}>
            
//             {/* The white card for the step */}
//             <div className="bg-white p-8 rounded-xl shadow-lg text-center w-full max-w-xs h-48 flex flex-col justify-center">
//               <span className="text-5xl font-extrabold text-black">
//                 {step.number}
//               </span>
//               <h3 className="text-xl font-semibold my-2 text-black">
//                 {step.title}
//               </h3>
//               <p className="text-gray-600">{step.description}</p>
//             </div>
            
//             {/* The arrow (hidden on mobile) */}
//             {index < steps.length - 1 && <ArrowIcon />}
            
//           </React.Fragment>
//         ))}
//       </div>
//     </div>
//   </SectionWrapper>
// );

// export default HowToStart;

// Data for the community section
const communityData = [
  { role: 'Stylists', task: '– Curate and showcase looks for campaigns.' },
  { role: 'MUAs', task: '– Collaborate in bridal & festive projects.' },
  { role: 'Photographers', task: '– Capture brand & creator shoots.' },
  { role: 'Wedding Planners', task: '– Join fashion-inspired shoots & collaborations' },
];

// Data for the 4-step process

// A simple SVG component for the arrow
const ArrowIcon = () => (
  <svg
    className="w-20 h-16 text-gray-300 hidden md:block"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M17 8l4 4m0 0l-4 4m4-4H3"
    />
  </svg>
);

interface HowToStartProps {
  title?: string;
  description?: string;
  steps?: { number: string; title: string; description?: string }[];
}

const HowToStart = ({ title, description, steps=[] }: HowToStartProps) => (

  <section className={`${poppins.className} py-20 px-4 md:px-6 lg:px-8 bg-white text-black`} style={{ fontWeight: 500 }}>
    <div className="max-w-7xl mx-auto">

      {/* --- Part 2: How To Get Started --- */}
    <div className="py-8"> {/* Added vertical padding here too */}

      <div className={`text-center mb-8`}>
      <h2 className="text-3xl md:text-4xl lg:text-5xl  tracking-tighter" style={{fontWeight:600}}>{title}</h2>
      {description && <p className="mt-4 text-lg text-black-500 max-w-3xl mx-auto">{description}</p>}
    </div>
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0 px-10 md:px-0">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="bg-white p-8 rounded-xl shadow-lg text-center w-full max-w-xs h-56 md:h-56 lg:h-50 flex flex-col justify-between">
              <span className="text-5xl text-black" style={{fontWeight:800}}>
                {step.number}
              </span>
              <h3 className={`${manrope.className} text-xl my-1 text-black`} style={{fontWeight:600}}>
                {step.title}
              </h3>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
            
            {index < steps.length - 1 && <ArrowIcon />}
            
          </React.Fragment>
        ))}
      </div>
    </div>

    </div>

  </section>

    
);

export default HowToStart;