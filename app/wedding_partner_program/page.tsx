'use client';

import React from 'react';
import Header from '@/components/LandingPage/reusable_components/Header';
import { Button } from '@/components/LandingPage/reusable_components/Button';

// Import all the Landing Page section components
import Hero from '@/components/LandingPage/Hero';
import WhyJoin from '@/components/LandingPage/WhyJoin';
import BeyondEarnings from '@/components/LandingPage/BeyondEarning';
import HowItWorks from '@/components/LandingPage/HowItWorks';
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

const WeddingPlannerNavLinks = [
    {name:"Why Join Attirelly", href:"#why-join"},
    {name:"How it works", href:"#how-it-works"},
    {name:"Who can Join", href:"#who-can-join"},
    {name:"Our Numbers", href:"#our-numbers"},
    {name:"How to get started", href:"#how-to-start"},
    {name:"FAQ", href:"#faq"}
]

const benefits = [
    { title: "Direct Brand Deals", description: "Work directly with top ethnic designers and brands on styled shoots, brand campaigns, and events.— no pitching, no chasing, no hassle. we bring the brands to you."},
    { title: "Get Recognised", description: "Get featured on attirelly's platform, social channels campaigns, and model shoots"},
    { title: "Save Time — For You and Your Clients", description: "We bring affordable boutiques to luxury labels in one place. Clients get curated looks, you get more referrals."}
]

interface WhoCanJoinProps {
    title?: string;
    description?: string;
    influencerTiers?: {name:string, points:string[], imageUrl:string}[];


 }

const WeddingPlannerTier = [
    {
      name: "MUAs", 
      points: ['Recommend outfits & earn on referrals', 'Feature in co-branded in social media campaigns of attirelly', 'Collaborate with 600+ designers & brands designers', 'xpand your professional network effortlessly'],
      imageUrl: '/WeddingProgramLanding/mua.svg'   
    },
    {
      name: "Stylists", 
      points: ['Earn by online Consultations', 'Refer & Earn per outfit booked', 'Work directly with boutiques, designers & ethnic brands for styling campaigns', 'Build a trusted portfolio and passive income'],
      imageUrl: '/WeddingProgramLanding/stylist.svg'   
    },
    {
      name: "Wedding Planners", 
      points: ['Earn commissions on every bridal outfit booked', 'Highlight your expertise and attract high-intent clients', 'Grow your brand visibility through co-branded campaigns with Attirelly'],
      imageUrl: '/WeddingProgramLanding/wedding_planner.svg'   
    },
    {
      name: "Photographers & Videographers", 
      points: ['Capture bridal, pre-wedding, and designer campaigns', 'Earn while building your portfolio', 'Collaborate & shoot with 600+ designers & brands designers', 'Collaborate with community of 2000+ stylists, influencers & MUAs'],
      imageUrl: '/WeddingProgramLanding/photograph.svg'   
    },

]

const communityData = [
  { role: 'Stylists', task: '– Curate and showcase looks for campaigns.' },
  { role: 'MUAs', task: '– Collaborate in bridal & festive projects.' },
  { role: 'Photographers', task: '– Capture brand & creator shoots.' },
  { role: 'Wedding Planners', task: '– Join fashion-inspired shoots & collaborations' },
];

const steps = [
  {
    number: "1",
    title: 'Sign In',
    description: 'Create your Attirelly account',
  },
  {
    number: "2",
    title: 'Complete Dashboard',
    description: 'Add info, select content genres, and integrate Instagram',
  },
  {
    number: "3",
    title: 'Get Matched',
    description: 'We review your insights & connect you with relevant brands',
  },
  {
    number: "4",
    title: 'Collaborate and Earn',
    description: 'Join shoots, festive edits, lookbooks, and projects',
  },
];

const numbers = [
  {
    number: "600+",
    title: 'Ethinic labels & designers onboard',
    // description: 'Create your Attirelly account',
  },
  {
    number: "100+",
    title: 'Collaborations completed',
    // description: 'Add info, select content genres, and integrate Instagram',
  },
  {
    number: "₹20Lac+",
    title: 'distributed to partners',
    // description: 'We review your insights & connect you with relevant brands',
  },
  {
    number: "30",
    title: 'Partners earned ₹50K+ each',
    // description: 'Join shoots, festive edits, lookbooks, and projects',
  },
];

const stories = [
    { quote: "Got my first brand shoot with a Chandigarh label in 2 weeks — Attirelly made it easy!", author: "@riya.sharma11", details: "5k followers, college student" },
    { quote: "As a NIFT student, I worked on real campaigns and built my portfolio — total game changer!", author: "@creates.ritz", details: "12k followers, student Creator" },
    { quote: "Attirelly connected me with designers & stylists for city shoots. My collaborations grew faster than I imagined.", author: "@shivani.realistic", details: "45k followers, early professional" },
    { quote: "Being part of Attirelly’s campaigns gave me exposure & credibility — now brands approach me directly.", author: "@anaya_06", details: "150k followers, professional stylist & creator" },
];


export default function WeddingPlanner () {
    return (

        <div className = "bg-white text-black">
            <Header
             title="Attirelly"
             actions={
              <>
                 <Button className="hidden md:inline">Join Attirelly</Button>
                
                 <Button className="md:hidden">Join</Button>
              </>   
             }
             navLinks={WeddingPlannerNavLinks}
            /> 
            <main>
             <section id="#hero"> 
             <Hero title="Attirelly Wedding Partner Program" subtitles={["Refer", "Collaborate", "Earn"]} description={["If you are a Wedding Planner, Makeup Artist, Stylist or Photographer — this is for you.", "Earn ₹1-3 Lakhs+ this wedding season through referrals and collaborations."]} buttonText="Apply Now"/>
             </section>
             <section id="why-join">
             <WhyJoin title="Why Join Attirelly" description={`Guide Thousands Of Couples Every Year On "Where To Shop"", "What To Wear", & "Whom To Trust"`} benefits={benefits} subtitle="Earn 1-3 Lac+ this wedding session" sub_description="More recommendations → more bookings → more income. whether for weddings, pre-weddings, or other events." image_url='/WeddingProgramLanding/attirelly_landing.png'/>
             </section>
             <section id="how-it-works">
             <HowItWorks/>
             </section>
             <section id="who-can-join">
             <WhoCanJoin title='Who Can Join?' description='We welcome every creative voice shaping Indian fashion — from beginners to seasoned pros.' influencerTiers={WeddingPlannerTier}/>
             </section>
             <section id="our-numbers">
             <HowToStart title='Our Numbers' steps={numbers}/> {/*Our Numbers Section */}
             </section>
             <BeyondEarnings/> 
             <Community title="A Community of 2000+ Partners" description="Fashion thrives on collaboration. Work with stylists, MUAs, photographers, wedding planners to create real projects, not just posts." communityData={communityData} />   
             <section id="how-to-start">
             <HowToStart title='How To Get Started' description='Start with simple 4 steps' steps={steps}/>
             </section>
             <Testimonials title='Real Stories' stories={stories} />   
             <CtaSection title='Start Earning Now' description={'Guide Thousands Of Couples Every Year On "Where To Shop", "What To Wear", and "Whom To Trust"'} buttonText='Apply Now'/>
             <section id="faq">
             <FAQ/>
             </section>   
            </main>
             <ListingFooter/>   
        </div>



    );
}