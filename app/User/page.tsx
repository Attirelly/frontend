import Hero from "@/components/SellerLanding/Hero";
import Benefits from "@/components/SellerLanding/Benefits";
import Testimonials from "@/components/SellerLanding/Testimonials";
import FAQ from "@/components/SellerLanding/FAQ";
import Footer from "@/components/SellerLanding/Footer";
import Header from "@/components/Header";
import SellerLandingHeader from "@/components/SellerLandingHeader";
console.log("hi")

export default function SellerOnboardingPage() {
  return (
    <main className="bg-white text-gray-900">
      <SellerLandingHeader/>
      <Hero />
      <Benefits />
      <Testimonials />
      <FAQ />
      <Footer />
    </main>
  );
}