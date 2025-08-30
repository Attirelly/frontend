'use client';
import FAQ from "@/components/SellerLanding/FAQ";
import CurrentLocs from "@/components/homepage/CurrentLocs";
import ListingFooter from "@/components/listings/ListingFooter";
import AmbassadorHeader from "@/components/CollegeAmbassador/AmbassadorHeader";
import AmbassadorHero from "@/components/CollegeAmbassador/AmbassadorHero";
import AmbassadorBenefits from "@/components/CollegeAmbassador/AmbassadorBenefits";
import AmbassadorOurNumbers from "@/components/CollegeAmbassador/AmbassadorOurNumbers";
import AmbassadorRevolution from "@/components/CollegeAmbassador/AmbassadorRevolution";
import AmbassadorSellerForm from "@/components/CollegeAmbassador/AmbassadorSellerForm";
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
        }
        else {
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
      <AmbassadorHeader />
      <AmbassadorHero screenSize={screenSize} />
      <div className="absolute w-full top-[730px] lg:top-[548px] rounded-tl-4xl rounded-tr-4xl bg-white">
        <section id="Why Attirelly?"><AmbassadorBenefits screenSize={screenSize} /></section>
        <section id="Our Numbers"><AmbassadorOurNumbers /></section>
        <section id="Future Roadmap"><AmbassadorRevolution /></section>  
        <section id="FAQ"><FAQ /></section>
        <section id="Contact Us"><AmbassadorSellerForm /></section>
        <section><CurrentLocs /></section>
        <section><ListingFooter /></section>
      </div>


    </main>
  );
}