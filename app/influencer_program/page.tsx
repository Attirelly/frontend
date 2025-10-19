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
import Testimonials from '@/components/LandingPage/Testimonials';
import CtaSection from '@/components/LandingPage/CtaSection';
import Faq from '@/components/LandingPage/Faq';
import FAQ from '@/components/SellerLanding/FAQ';
import Footer from '@/components/LandingPage/Footer';
import ListingFooter from '@/components/listings/ListingFooter';

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

const communityData = [
  { role: 'Stylists', task: '– Curate and showcase looks for campaigns.' },
  { role: 'MUAs', task: '– Collaborate in bridal & festive projects.' },
  { role: 'Photographers', task: '– Capture brand & creator shoots.' },
  { role: 'Wedding Planners', task: '– Join fashion-inspired shoots & collaborations' },
];

const steps = [
  {
    number: 1,
    title: 'Sign In',
    description: 'Create your Attirelly account',
  },
  {
    number: 2,
    title: 'Complete Dashboard',
    description: 'Add info, select content genres, and integrate Instagram',
  },
  {
    number: 3,
    title: 'Get Matched',
    description: 'We review your insights & connect you with relevant brands',
  },
  {
    number: 4,
    title: 'Collaborate and Earn',
    description: 'Join shoots, festive edits, lookbooks, and projects',
  },
];

const stories = [
    { quote: "Got my first brand shoot with a Chandigarh label in 2 weeks — Attirelly made it easy!", author: "@riya.sharma11", details: "5k followers, college student" },
    { quote: "As a NIFT student, I worked on real campaigns and built my portfolio — total game changer!", author: "@creates.ritz", details: "12k followers, student Creator" },
    { quote: "Attirelly connected me with designers & stylists for city shoots. My collaborations grew faster than I imagined.", author: "@shivani.realistic", details: "45k followers, early professional" },
    { quote: "Being part of Attirelly’s campaigns gave me exposure & credibility — now brands approach me directly.", author: "@anaya_06", details: "150k followers, professional stylist & creator" },
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
        <Community title="A Community of 2000+ Partners" description="Fashion thrives on collaboration. Work with stylists, MUAs, photographers, wedding planners to create real projects, not just posts." communityData={communityData} />
        <HowToStart title='How To Get Started' description='Start with simple 4 steps' steps={steps}/>
        <Testimonials title='Real Stories' stories={stories} />
        <CtaSection title='Your Influence, Our Platform.' description='Join Attirelly’s influencer network & start earning from your creativity today.' buttonText='Apply as an Influencer'/>
        <FAQ/>
      </main>
      <ListingFooter/>
    </div>
  );
}