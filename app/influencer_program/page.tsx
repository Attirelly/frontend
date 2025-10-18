'use client';

import React from 'react';
import Header from '@/components/LandingPage/reusable_components/Header';
import { Button } from '@/components/LandingPage/reusable_components/Button';

// Import all the NEW influencer section components
import Hero from '@/components/LandingPage/Hero';
// import WhyJoin from '@/components/landing/influencer/WhyJoin';
// import Advantage from '@/components/landing/influencer/Advantage';
// import WhoCanJoin from '@/components/landing/influencer/WhoCanJoin';
// import ContentWeLove from '@/components/landing/influencer/ContentWeLove';
// import HowToStart from '@/components/landing/influencer/HowToStart';
// import Testimonials from '@/components/landing/influencer/Testimonials';
// import CtaSection from '@/components/landing/influencer/CtaSection';
// import Faq from '@/components/landing/influencer/Faq';
// import Footer from '@/components/landing/influencer/Footer';

const influencerNavLinks = [
    { name: 'Program Benefits', href: '#benefits' },
    { name: 'Who Can Join', href: '#who-can-join' },
    { name: 'How to Start', href: '#how-to-start' },
    { name: 'FAQ', href: '#faq' },
]

export default function InfluencerLandingPage() {
  return (
    <div className="bg-white text-black">
      <Header
        title="Attirelly"
        navLinks={influencerNavLinks}
        actions={<Button>Join Attirelly</Button>}
      />
      <main>
        <Hero />
        {/* <WhyJoin /> */}
        {/* <Advantage /> */}
        {/* <WhoCanJoin /> */}
        {/* <ContentWeLove /> */}
        {/* <HowToStart /> */}
        {/* <Testimonials /> */}
        {/* <CtaSection /> */}
        {/* <Faq /> */}
      </main>
      {/* <Footer /> */}
    </div>
  );
}