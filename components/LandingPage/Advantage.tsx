import React from 'react';
import { SectionWrapper } from '@/components/LandingPage/reusable_components/SectionWrapper';
import { SectionTitle } from '@/components/LandingPage/reusable_components/SectionTitle';
import { Banknote, Users, LucideProps } from 'lucide-react'; // Import LucideProps
import { ForwardRefExoticComponent, RefAttributes } from 'react'; // Import component types

// Define a precise type for our icon prop
type AdvantageIcon = 
  | string 
  | ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;

// Define the type for the advantage object
interface Advantage {
  iconType: 'text' | 'icon';
  icon: AdvantageIcon;
  title: string;
}

// Update the array to use the new type
const advantages: Advantage[] = [
  {
    iconType: 'text',
    icon: '5X',
    title: '5x faster brand collaborations than Instagram alone',
  },
  {
    iconType: 'icon',
    icon: Banknote,
    title: 'Boost your follower-to-income ratio',
  },
  {
    iconType: 'icon',
    icon: Users,
    title: 'Join a community of 2000+ MUAs, stylists & photographers',
  },
];

const Advantage = () => (
  <SectionWrapper>
    <SectionTitle
      title="The Attirelly Advantage"
      subtitle="We welcome every creative voice shaping Indian fashion — from beginners to seasoned pros."
    />
    
    <div className="grid md:grid-cols-3 gap-8 mt-20">
      {advantages.map((adv) => (
        <div key={adv.title} className="relative">
          
          {/* Floating icon circle */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="bg-white rounded-full h-20 w-20 flex items-center justify-center shadow-lg border border-gray-100">
              
              {/* --- THIS IS THE FIX --- */}
              {adv.iconType === 'text' ? (
                // 1. If type is 'text', TS knows adv.icon is a string. We render it in a <span>.
                <span className="text-3xl font-extrabold font-rosario text-black">
                  {adv.icon}
                </span>
              ) : (
                // 2. If type is 'icon', TS knows adv.icon is a component.
                // We must assign it to a variable with a Capital Letter (React convention)
                // and render it as a component tag <Icon />.
                (() => {
                  const Icon = adv.icon as React.ElementType;
                  return <Icon className="h-10 w-10 text-black" />;
                })()
              )}
              {/* --- END OF FIX --- */}

            </div>
          </div>

          {/* Card content */}
          <div className="bg-white p-8 pt-16 rounded-xl shadow-lg text-center h-full">
            <p className="text-lg font-medium font-rosario text-gray-800">
              {adv.title}
            </p>
          </div>
        </div>
      ))}
    </div>
  </SectionWrapper>
);

export default Advantage;