import Hero from "@/components/SellerLanding/Hero";
import Benefits from "@/components/SellerLanding/Benefits";
import Testimonials from "@/components/SellerLanding/Testimonials";
import FAQ from "@/components/SellerLanding/FAQ";
import Footer from "@/components/SellerLanding/Footer";
import Header from "@/components/Header";
console.log("hi")

export default function SellerOnboardingPage() {
  return (
    <main className="bg-white text-gray-900">
      <Header
        title="Attirelly"
        actions={
          <label className="text-black">Need help? Call +91-9821205090</label>
        }
      />
      <Hero />
      <Benefits />
      <Testimonials />
      <FAQ />
      <Footer />
    </main>
  );
}