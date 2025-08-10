import FAQ from "@/components/SellerLanding/FAQ";
import CurrentLocs from "@/components/homepage/CurrentLocs";
import ListingFooter from "@/components/listings/ListingFooter";
import AmbassadorHeader from "@/components/CollegeAmbassador/AmbassadorHeader";
import AmbassadorHero from "@/components/CollegeAmbassador/AmbassadorHero";
import AmbassadorBenefits from "@/components/CollegeAmbassador/AmbassadorBenefits";
import AmbassadorOurNumbers from "@/components/CollegeAmbassador/AmbassadorOurNumbers";
import AmbassadorRevolution from "@/components/CollegeAmbassador/AmbassadorRevolution";
import AmbassadorSellerForm from "@/components/CollegeAmbassador/AmbassadorSellerForm";

export default function SellerOnboardingPage() {
  return (
    <main className="relative bg-white text-black">
      <AmbassadorHeader />
      <AmbassadorHero />
      <div className="absolute w-full top-[548px] rounded-tl-4xl rounded-tr-4xl bg-white">
        <section id="Why Attirelly?"><AmbassadorBenefits /></section>
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