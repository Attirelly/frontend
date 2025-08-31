"use client"
import Hero from "@/components/SellerLanding/Hero";
import Benefits from "@/components/SellerLanding/Benefits";
import Testimonials from "@/components/SellerLanding/Testimonials";
import FAQ from "@/components/SellerLanding/FAQ";
import Footer from "@/components/SellerLanding/Footer";
import SellerLandingHeader from "@/components/SellerLanding/SellerLandingHeader";
import OurNumbers from "@/components/SellerLanding/OurNumbers";
import CurrentLocs from "@/components/homepage/CurrentLocs";
import ListingFooter from "@/components/listings/ListingFooter";
import Roadmap from "@/components/SellerLanding/Roadmap";
import SellerForm from "@/components/SellerLanding/SellerForm";
import HowItWorks from "@/components/SellerLanding/HowItWorks";
import { useEffect, useState } from "react";

export default function SellerOnboardingPage() {
  const [screenSize, setScreenSize] = useState('sm');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setScreenSize('sm');
      } else if (window.innerWidth < 1024) {
        setScreenSize('md');
      } else if (window.innerWidth < 1290) {
        setScreenSize('lg');
      } else {
        setScreenSize('xl');
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1); // remove "#"
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  return (
    <main className="relative bg-white text-black">
      <SellerLandingHeader />
      <Hero screenSize={screenSize} />
      <div className="absolute w-full top-[730px] lg:top-[548px] rounded-tl-4xl rounded-tr-4xl bg-white">
        <section id="Why Attirelly?"><Benefits screenSize={screenSize} /></section>
        <section id="How it works"><HowItWorks screenSize={screenSize} /></section>
        <section id="Our Numbers"><OurNumbers screenSize={screenSize}/></section>
        <section id="Future Roadmap"><Roadmap screenSize={screenSize}/></section>
        {/* <section id="Contact Us"><SellerForm /></section> */}
        <section id="FAQ"><FAQ /></section>
        <section><CurrentLocs /></section>
        <section><ListingFooter /></section>
      </div>


    </main>
  );
}