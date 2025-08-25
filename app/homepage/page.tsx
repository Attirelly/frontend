import SectionEightContainer from "@/components/homepage/containers/SectionEightContainer";
import SectionElevenContainer from "@/components/homepage/containers/SectionElevenContainer";
import SectionFiveContainer from "@/components/homepage/containers/SectionFiveContainer";
import SectionFourContainer from "@/components/homepage/containers/SectionFourContainer";
import SectionNineContainer from "@/components/homepage/containers/SectionNineContainer";
import SectionOneContainer from "@/components/homepage/containers/SectionOneContainer";
import SectionSevenContainer from "@/components/homepage/containers/SectionSevenContainer";
import SectionSixContainer from "@/components/homepage/containers/SectionSixContainer";
import SectionTenContainer from "@/components/homepage/containers/SectionTenContainer";
import SectionThreeContainer from "@/components/homepage/containers/SectionThreeContainer";
import SectionTwelveContainer from "@/components/homepage/containers/SectionTwelveContainer";
import SectionTwoContainer from "@/components/homepage/containers/SectionTwoContainer";
import CurrentLocs from "@/components/homepage/CurrentLocs";
import HeroSection from "@/components/homepage/HeroSection";
import ScrollingTextBanner from "@/components/homepage/ScrollingTextBanner";
import StoreTypeSelection from "@/components/homepage/StoreTypeSelection";
import ListingFooter from "@/components/listings/ListingFooter";
import ListingPageHeader from "@/components/listings/ListingPageHeader";

export default function HomePage() {
    return (
        // Remove the background color from the outermost container
        <div className="w-full flex flex-col">
            <div className="bg-white">
                <ListingPageHeader />

                <div className="lg:px-20">
                    <HeroSection />
                </div>

                <div className="mt-16 mx-auto mb-16">
                    <StoreTypeSelection />
                </div>

                <div className="space-y-16">
                    {/* section 1 - 5 images scollable */}
                    <div className="px-11">
                        <SectionOneContainer />
                    </div>
                    {/* section 2 - 4 images, detail, shop now*/}
                    <div className="px-11">
                        <SectionTwoContainer />
                    </div>
                    {/* section 3 - five images, fixed, detail */}
                    <div className="px-11">
                        <SectionThreeContainer />
                    </div>
                    {/* section 4 - overlapping images */}
                    <div className="px-11">
                        <SectionFourContainer />
                    </div>
                </div>
            </div>
            <div className="text-black bg-gray-500">
                <div className="space-y-16 pt-16">
                    <div className="px-11">
                        <SectionFiveContainer />
                    </div>
                    <SectionSixContainer />
                    <SectionSevenContainer />
                </div>

                <div className="mt-20 space-y-20 bg-[#F9F9F9]">
                    <SectionEightContainer />
                    <SectionNineContainer />
                    <SectionTenContainer />
                    <SectionElevenContainer />
                    <SectionTwelveContainer />
                </div>

                <div className="mt-10">
                    <ScrollingTextBanner />
                </div>

                <CurrentLocs />
            </div>


            {/* --- 3. FOOTER AREA (No background wrapper) --- */}
            <ListingFooter />
        </div>
    )
}