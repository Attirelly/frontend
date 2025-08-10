import Hero from "@/components/SellerLanding/Hero";
import Benefits from "@/components/SellerLanding/Benefits";
import FAQ from "@/components/SellerLanding/FAQ";
import OurNumbers from "@/components/SellerLanding/OurNumbers";
import CurrentLocs from "@/components/homepage/CurrentLocs";
import ListingFooter from "@/components/listings/ListingFooter";
import Roadmap from "@/components/SellerLanding/Roadmap";
import SellerForm from "@/components/SellerLanding/SellerForm";
import HowItWorks from "@/components/SellerLanding/HowItWorks";
import AmbassadorHeader from "@/components/CollegeAmbassador/AmbassadorHeader";

export default function SellerOnboardingPage() {
  return (
    <main className="relative bg-white text-black">
      <AmbassadorHeader />
      <Hero />
      <div className="absolute w-full top-[548px] rounded-tl-4xl rounded-tr-4xl bg-white">
        <section id="Why Attirelly?"><Benefits /></section>
        <section id="How it works"><HowItWorks/></section>
    <section id="Our Numbers"><OurNumbers /></section>
    <section id="Future Roadmap"><Roadmap /></section>
    <section id="Contact Us"><SellerForm /></section>
    <section id="FAQ"><FAQ /></section>
    <section><CurrentLocs /></section>
    <section><ListingFooter /></section>
      </div>


    </main>
  );
}