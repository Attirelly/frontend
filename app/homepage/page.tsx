import HeroSection from "@/components/homepage/HeroSection";
import StoreTypeSelection from "@/components/homepage/StoreTypeSelection";
import ListingPageHeader from "@/components/listings/ListingPageHeader";

export default function HomePage() {
    return (
        <div className="flex flex-col">
         <ListingPageHeader/>
         <HeroSection/>
         <StoreTypeSelection/>
        </div>
    )
}