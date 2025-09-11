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
import ListingMobileHeader from "@/components/mobileListing/ListingMobileHeader";
import ListingPageHeader from "@/components/listings/ListingPageHeader";

/**
 * The main homepage component for the application.
 *
 * This component orchestrates the layout and rendering of all major sections on the
 * homepage, including the hero section, store type selection, and various content sections.
 *
 * It is structured into two main sections:
 * 1.  A white background section (`bg-white`) for the header and initial content.
 * 2.  A light gray background section (`bg-[#F9F9F9]`) for the remaining content.
 *
 * @remarks
 * The component uses Tailwind CSS classes for a responsive layout, with different
 * padding and spacing values for mobile and desktop screens. It renders a mix of
 * imported components for each section, from `SectionOneContainer` to `SectionTwelveContainer`.
 *
 * **Key Components Rendered:**
 * - `ListingMobileHeader` and `ListingPageHeader`: Responsible for rendering the mobile and desktop headers respectively.
 * - `HeroSection`: The main hero area with a headline and call-to-action.
 * - `StoreTypeSelection`: A component for selecting store types.
 * - `ScrollingTextBanner` and `CurrentLocs`: Additional components for banners and location displays.
 * - `ListingFooter`: The main footer component.
 *
 * **Key Sections:**
 * - Section 1: {@link SectionOneContainer}
 * - Section 2: {@link SectionTwoContainer}
 * - Section 3: {@link SectionThreeContainer}
 * - Section 4: {@link SectionFourContainer}
 * - Section 5: {@link SectionFiveContainer}
 * - Section 6: {@link SectionSixContainer}
 * - Section 7: {@link SectionSevenContainer}
 * - Section 8: {@link SectionEightContainer}
 * - Section 9: {@link SectionNineContainer}
 * - Section 10: {@link SectionTenContainer}
 * - Section 11: {@link SectionElevenContainer}
 * - Section 12: {@link SectionTwelveContainer}
 */
export default function HomePage() {
  return (
    // Remove the background color from the outermost container
    <div className="w-full flex flex-col">
      <div className="bg-white">
        <ListingMobileHeader className="block lg:hidden" />
        <ListingPageHeader className="hidden lg:block" />

        <div className="lg:px-20">
          <HeroSection />
        </div>

        <div className="mt-16 mx-auto mb-16">
          <StoreTypeSelection />
        </div>

        <div className="space-y-16">
          {/* section 1 - 5 images scollable */}
          <div className="mx-auto px-3 md:px-9 lg:px-11">
            <SectionOneContainer />
          </div>
          {/* section 2 - 4 images, detail, shop now*/}
          <div className="mx-auto px-3 md:px-9 lg:px-11">
            <SectionTwoContainer />
          </div>
          {/* section 3 - five images, fixed, detail */}
          <div className="mx-auto px-3 md:px-9 lg:px-11">
            <SectionThreeContainer />
          </div>
          {/* section 4 - overlapping images */}
          <div className="mx-auto px-1 md:px-9 lg:px-11 mb-20">
            <SectionFourContainer />
          </div>
        </div>
      </div>
      <div className="text-black  bg-[#F9F9F9]">
        <div className="space-y-16 pt-16">
          <div className="px-11">
            <SectionFiveContainer />
          </div>
          <SectionSixContainer />
          <SectionSevenContainer />
        </div>

        <div className="mt-20 space-y-20">
          <div className="mx-auto px-3 md:px-9 lg:px-11">
            <SectionEightContainer />
          </div>
          <div className="mx-auto px-3 md:px-9 lg:px-11">
            <SectionNineContainer />
          </div>
          <div className="mx-auto px-3 md:px-9 lg:px-11">
            <SectionTenContainer />
          </div>
          <div className="mx-auto px-3 md:px-9 lg:px-11">
            <SectionElevenContainer />
          </div>
          <div className="mx-auto px-3 md:px-9 lg:px-11">
            <SectionTwelveContainer />
          </div>
        </div>

        <div className="mt-10">
          <ScrollingTextBanner />
        </div>

        <CurrentLocs />
      </div>

      {/* --- 3. FOOTER AREA (No background wrapper) --- */}
      <ListingFooter />
    </div>
  );
}
