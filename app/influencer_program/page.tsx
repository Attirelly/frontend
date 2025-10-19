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

const benefits = [
  { title: 'Effortless Collaborations', description: 'Instantly connect with Attirelly campaigns and explore opportunities tailored to your style and audience.' },
  { title: 'Direct Brand Deals', description: 'Collaborate with top ethnic labels, boutiques, and designers. No chasing – we bring the brands to you.' },
  { title: 'Existing Projects', description: 'Be part of model shoots, festive edits, and exclusive campaigns to enhance your portfolio and exposure.' },
];

const influencerTiers = [
    {
        name: 'Nano Influencers (0-10K)',
        points: [
            'Ideal for college students, NIFT/Pearl creators, or early-stage fashion content creators',
            'Build a portfolio without hassle, we connect you with labels and brands.',
            'Perfect place to start building your personal brand.'
        ],
        imageUrl: '/InfluencerProgramLanding/Nano_inf.png' // <-- 1. CHANGE THIS PATH
    },
    {
        name: 'Micro Influencer (10K-100K)',
        points: [
            'Expand your reach beyond your followers.',
            'Access paid campaigns and barter collaborations.',
            'Monetize your content and grow your influence.'
        ],
        imageUrl: '/InfluencerProgramLanding/micro_inf.png' // <-- 2. CHANGE THIS PATH
    },
    {
        name: 'Macro Influencer (100K+)',
        points: [
            'Unlock high-value brand partnerships.',
            'Lead major campaigns and festive edits.',
            'Become a key voice in the Indian fashion landscape.'
        ],
        imageUrl: '/InfluencerProgramLanding/macro_inf.png' // <-- 3. CHANGE THIS PATH
    },
];

export default function InfluencerLandingPage() {
  return (
    <div className="bg-white text-black">
      <Header
        title="Attirelly"
        navLinks={influencerNavLinks}
        actions={<Button>Join Attirelly</Button>}
      />
      <main>
        <Hero title='Attirelly Influencer Program' subtitles={['Create', 'Collaborate', 'Earn']} description={['Start earning from your creativity today.', 'Whether you love styling outfits, creating content, or telling fashion stories.']} buttonText='Apply as an Influencer'/>
        <WhyJoin title='Why Join Attirelly' description='Showcase your unique style to millions of shoppers.' benefits={benefits} subtitle='Get Recognized' sub_description='Get featured across apps, social media, and model shoots' image_url='/InfluencerProgramLanding/attirelly_landing.png'/>
        <Advantage />
        <WhoCanJoin title='Who Can Join?' description='We welcome every creative voice shaping Indian fashion — from beginners to seasoned pros.' influencerTiers={influencerTiers} />
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