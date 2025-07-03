import CardTypeFive from "@/components/homepage/cards/CardTypeFive";
import CardTypeFour from "@/components/homepage/cards/CardTypeFour";
import CardTypeOne from "@/components/homepage/cards/CardTypeOne";
import CardTypeThree from "@/components/homepage/cards/CardTypeThree";
import CardTwoType from "@/components/homepage/cards/CardTypeTwo";
import SectionFiveContainer from "@/components/homepage/containers/SectionFiveContainer";
import SectionFourContainer from "@/components/homepage/containers/SectionFourContainer";
import SectionOneContainer from "@/components/homepage/containers/SectionOneContainer";
import SectionThreeContainer from "@/components/homepage/containers/SectionThreeContainer";
import SectionTwoContainer from "@/components/homepage/containers/SectionTwoContainer";
import HeroSection from "@/components/homepage/HeroSection";
import StoreTypeSelection from "@/components/homepage/StoreTypeSelection";
import ListingFooter from "@/components/listings/ListingFooter";
import ListingPageHeader from "@/components/listings/ListingPageHeader";

export default function HomePage() {
    return (
        <div className="flex flex-col">
            <ListingPageHeader />
            <HeroSection />
            <div className="mt-16 mx-auto mb-16">
                <StoreTypeSelection />
            </div>

            {/* overlapping images */}
            <div className="px-11">
                <SectionOneContainer />
            </div>

            {/* eight images ( 4 in each row) */}
            <div className="px-11">
<SectionTwoContainer />
            </div>
            

            {/* five images small without much detail */}
            <div className="px-11">
<SectionThreeContainer />
            </div>
            



            {/* six images */}
            <div className="px-11">
                <SectionFourContainer />
            </div>
            
            
            {/* 5 images big and with detail */}
            <div className="px-11">
<SectionFiveContainer />
            </div>
            



            <ListingFooter />
        </div>
    )
}