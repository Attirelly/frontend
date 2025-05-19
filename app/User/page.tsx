import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function SellerOnboardingPage() {
  return (
    <main className="bg-white text-gray-900">
      <Hero />
      <Benefits />
      <Testimonials />
      <FAQ />
      <Footer />
    </main>
  );
}