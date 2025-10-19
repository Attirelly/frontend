'use client';

import React from 'react';
import Header from '@/components/LandingPage/reusable_components/Header';
import { Button } from '@/components/LandingPage/reusable_components/Button';

// Import all the NEW influencer section components
import Hero from '@/components/LandingPage/Hero';
import WhyJoin from '@/components/LandingPage/WhyJoin';
import Advantage from '@/components/LandingPage/Advantage';
import WhoCanJoin from '@/components/LandingPage/WhoCanJoin';
import ContentWeLove from '@/components/LandingPage/ContentWeLove';
import HowToStart from '@/components/LandingPage/HowToStart';
import Community from '@/components/LandingPage/Community';
// import Testimonials from '@/components/landing/influencer/Testimonials';
// import CtaSection from '@/components/landing/influencer/CtaSection';
// import Faq from '@/components/landing/influencer/Faq';
// import Footer from '@/components/landing/influencer/Footer';

const influencerNavLinks = [
    { name: 'Why join Attirelly', href: '#benefits' },
    { name: 'Advantages', href: '#who-can-join' },
    { name: 'Who can join', href: '#how-to-start' },
    { name: 'Content we love', href: '#faq' },
    { name: 'How to get started', href: '' },
    { name: 'FAQ', href: '' }
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
        <WhyJoin />
        <Advantage />
        <WhoCanJoin />
        <ContentWeLove />
        <Community/>
        <HowToStart />
        {/* <Testimonials /> */}
        {/* <CtaSection /> */}
        {/* <Faq /> */}
      </main>
      {/* <Footer /> */}
    </div>
  );
}