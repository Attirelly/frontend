'use client';
import { SectionTitle } from '@/components/LandingPage/reusable_components/SectionTitle';
import { manrope } from '@/font';

const perks = [
    {
        title: "Exclusive Perks for You",
        description: "Get exclusive invites for fashion shows, workshops, and styled shoots."
    },
    {
        title: "Networking",
        description: "Get Access our growing community of 2000+ Partners"
    },
    {
        title: "You refer us & we refer you",
        description: "We also recommend you to shoppers, giving you steady inbound leads."
    }
]



const BeyondEarning = () => (

<section className={`${manrope.className} bg-white text-black py-20 px-4 md:px-6 lg:px-8`} style={{fontWeight: 800}}>
    <div className="max-w-7xl mx-auto">

      <SectionTitle title="Beyond Earnings-Real Growth "/>

      {/* Grid for the top two cards */}
    <div className="sm: grid grid-cols-1 mt-[40px] md: mt-[40px] md:grid-cols-2 gap-8 max-w-5xl mx-auto">
      
      {/* Card 1: Exclusive Perks */}
      <div className="bg-white p-8 rounded-xl shadow-xl text-center">
        <h3 className={"text-xl text-black"} style={{fontWeight: 800}}>
          {perks[0].title}
        </h3>
        <p className={"text-black-600 mt-2"} style={{fontWeight: 500}}>
          {perks[0].description}
        </p>
      </div>
      
      {/* Card 2: Networking */}
      <div className="bg-white p-8 rounded-xl shadow-xl text-center">
        <h3 className={"text-xl text-black"} style={{fontWeight: 800}}>
          {perks[1].title}
        </h3>
        <p className={"text-black-600 mt-2"} style={{fontWeight: 500}}>
          {perks[1].description}
        </p>
      </div>

      <div className=" bg-white p-8 rounded-xl shadow-xl text-center md:hidden lg:hidden sm:block">
        <h3 className={"text-xl text-black"} style={{fontWeight: 800}}>
          {perks[2].title}
        </h3>
        <p className={"text-black-600 mt-2"} style={{fontWeight: 500}}>
          {perks[2].description}
        </p>
      </div>
    </div>
    
    {/* Wrapper for the bottom, centered card */}
    <div className="mt-8 flex justify-center">
      
      {/* Card 3: You refer us... */}
      <div className="bg-white p-8 rounded-xl shadow-xl text-center max-w-lg sm: hidden md:block">
        <h3 className={"text-xl text-black"} style={{fontWeight: 800}}>
          {perks[2].title}
        </h3>
        <p className={"text-black-600 mt-2"} style={{fontWeight: 500}}>
          {perks[2].description}
        </p>
      </div>
    </div>

    </div>
</section>    

);

export default BeyondEarning;