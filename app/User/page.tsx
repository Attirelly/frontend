import Hero from "@/components/SellerLanding/Hero";
import Benefits from "@/components/SellerLanding/Benefits";
import Testimonials from "@/components/SellerLanding/Testimonials";
import FAQ from "@/components/SellerLanding/FAQ";
import Footer from "@/components/SellerLanding/Footer";
import Header from "@/components/Header";
import SellerLandingHeader from "@/components/SellerLandingHeader";
import OurNumbers from "@/components/SellerLanding/OurNumbers";
console.log("hi")

export default function SellerOnboardingPage() {
  return (
    <main className="relative bg-white text-black">
      <SellerLandingHeader/>
      <Hero />
      <div className="absolute w-full top-[548px] rounded-tl-4xl rounded-tr-4xl bg-white">
<Benefits />
<OurNumbers/>
      </div>
      
      <Testimonials />
      <FAQ />
      <Footer />
    </main>
  );
}