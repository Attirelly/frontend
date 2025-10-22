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
import ProblemsPage from '@/components/LandingPage/Problems';
import { Icon } from 'lucide-react';
import IconicPhotoboothPage from '@/components/LandingPage/IconicPhotobooth';
import BrideAndGroomForm from '@/components/LandingPage/BrideAndGroomForm';

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
        name: 'Your Personalised QR Gift Looks Like',
        points: [
            'Add a custom QR to your wedding invites or e-cards.'
        ],
        imageUrl: '/BrideGroom/get_gift_card.svg' // <-- 1. WxCHANGE THIS PATH
    }
];

const photobooth = [
    {
        name: 'Your Vogue-Style Photobooth Looks Like',
        points: [
            'Transform your wedding into a cinematic, unforgettable experience.'
        ],
        imageUrl: '/BrideGroom/photobooth.svg'
    }
];

const communityData = [
  { role: '', task: ' Hosting 100+ guests' },
  { role: '', task: 'Wedding planned in the next 1–6 months' },
  { role: '', task: 'Love capturing memories or active on social media' },
  { role: '', task: ' Want a modern, curated, effortless celebration' },
];

const steps = [
  {
    number: 1,
    title: 'Custom QR Code',
    description: 'Add a custom QR to your wedding invites or e-cards.',
  },
  {
    number: 2,
    title: 'Set Gift Amount',
    description: 'Add ₹500–₹15,000+, and let guests shop what they love.',
  },
  {
    number: 3,
    title: 'Scan. Explore. Shop.',
    description: 'Guests scan your Attirelly QR and shop their favourite outfits',
  },
  {
    number: 4,
    title: 'Effortless digital gifting',
    description: 'No stress. No hassle. No outfit distribution',
  },
];

const our_numbers = [
  {
    number: '100+',
    title: 'Happy couples',
    description: '',
  },
  {
    number: '100+',
    title: 'QR codes delivered',
    description: '',
  },
  {
    number: '40+',
    title: 'Photobooths installed',
    description: '',
  },
  {
    number: '₹15Lac+',
    title: 'In discount codes used',
    description: '',
  },
];

const stories = [
    { quote: "Got my first brand shoot with a Chandigarh label in 2 weeks — Attirelly made it easy!", author: "@riya.sharma11", details: "5k followers, college student" },
    { quote: "As a NIFT student, I worked on real campaigns and built my portfolio — total game changer!", author: "@creates.ritz", details: "12k followers, student Creator" }
];

const experiences = [
    "Exclusive 10–20% savings with Attirelly’s partner studios",
    "Memories captured, shared, and celebrated across social media.",
    "Stunning, magazine-worthy photos every moment becomes a keepsake.",
    "Transform your wedding into a cinematic, unforgettable experience."
];
export default function BrideGroomLandingPage() {
  return (
    <div className="bg-white text-black">
      <Header
        title="Attirelly"
        navLinks={influencerNavLinks}
        actions={<Button>Join Attirelly</Button>}
      />
      <main>
        <Hero title='Attirelly Brides & Grooms Program' title_secondary='Tying the knot soon? this is for you Make your wedding' subtitles={['Stylish', 'Effortless', 'Iconic']} description={['Give your guests a personalized QR gift or a Vogue-style photobooth moment.']} buttonText='Get Your Gifting QR Code'/>
        <ProblemsPage title='Problems With Old Fashioned Gifting' problems={['Gifting outfits is stressful — deciding, buying, and distributing for every guest. ','Say goodbye old-fashioned outfit gifting forget stress, no last-minute chaos.']}/>
        <HowToStart title='Skip the 20-Day Gifting Hassle Go Digital with Attirelly' steps={steps}/>
        <WhoCanJoin influencerTiers={influencerTiers} />
        <Community title="Perfect for couplesIconic Photobooth Experience, If" communityData={communityData} />
         {/* iconic photobooth moment */}
         <IconicPhotoboothPage title='Iconic Photobooth Experience' experiences={experiences} />
         <WhoCanJoin influencerTiers={photobooth} />
        <HowToStart title='Our Numbers' steps={our_numbers}/>
        <Testimonials title='Real Stories' stories={stories} buttonText='Be Our Next Featured Wedding' />
        <CtaSection title='Every Love Story, Styled Beautifully.' buttonText='Get Personalized QR Code' buttonText2='Book Your Photobooth'/>
        <BrideAndGroomForm/>
        <FAQ/>
      </main>
      <ListingFooter/>
    </div>
  );
}